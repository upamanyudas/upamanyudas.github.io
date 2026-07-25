import { defineComponent, h, ref, nextTick, onUnmounted, onMounted, createApp } from 'vue'
import { ICON_SHRINK, ICON_FULL_SCREEN } from '../assets/icons/icons.js'
import { useRipple } from '../composables/useRipple.js'
import { caseStudies, templateHTML } from '../siteData.js'
import { DEMOS } from '../cs/registry.js'
import InteractiveTag from './InteractiveTag.js'
import TldrToggle from './TldrToggle.js'

const ANIM_MS = 700
const EASE = 'cubic-bezier(0.34, 1.1, 0.64, 1)'
const REDUCED_MOTION = matchMedia('(prefers-reduced-motion: reduce)').matches
const FLY_TRANSITION = `left ${ANIM_MS}ms ${EASE}, top ${ANIM_MS}ms ${EASE}, width ${ANIM_MS}ms ${EASE}, height ${ANIM_MS}ms ${EASE}, border-radius ${ANIM_MS}ms ${EASE}`

// Card-key → canonical URL slug / tooltip, from the Jekyll case-studies collection.
const CARD_KEY_TO_SLUG    = Object.fromEntries(caseStudies.map(cs => [cs.key, cs.slug]))
const CARD_KEY_TO_TOOLTIP = Object.fromEntries(caseStudies.map(cs => [cs.key, cs.tooltip]))

/**
 * CsContent — renders the Jekyll-rendered case study body (from its hidden
 * <template>) and mounts the interactive demo components onto every
 * <div class="cs-demo" data-demo="…"> marker inside it.
 */
const CsContent = defineComponent({
  name: 'CsContent',
  props: { cardKey: { type: String, required: true } },
  setup(props) {
    const hostEl = ref(null)
    const tldr = ref(false)
    let demoApps = []

    onMounted(() => {
      const host = hostEl.value
      if (!host) return

      // Wrap each TL;DR-collapsible block's children (CSS grid-rows animation
      // needs a single child) so the markdown source stays clean.
      host.querySelectorAll('.tldr-collapsible').forEach(el => {
        const inner = document.createElement('div')
        inner.append(...el.childNodes)
        el.append(inner)
      })

      // Mount interactive demos onto their markers
      host.querySelectorAll('.cs-demo[data-demo]').forEach(el => {
        const comp = DEMOS[el.dataset.demo]
        if (!comp) return
        const hint = el.dataset.hint
        const app = createApp({
          render: () => [
            h(comp),
            hint ? h(InteractiveTag, { hint, centered: true }) : null,
          ],
        })
        app.mount(el)
        demoApps.push(app)
      })
    })

    onUnmounted(() => {
      demoApps.forEach(app => app.unmount())
      demoApps = []
    })

    return () => h('div', { class: 'cs-jekyll-root' }, [
      h(TldrToggle, { modelValue: tldr.value, 'onUpdate:modelValue': v => { tldr.value = v } }),
      h('div', {
        ref: hostEl,
        class: ['cs-jekyll-body', tldr.value ? 'tldr-on' : ''].filter(Boolean).join(' '),
        innerHTML: templateHTML(`tpl-cs-${props.cardKey}`),
      }),
    ])
  },
})

/**
 * CaseStudyOverlay — shared expand-to-fullscreen component for case study cards.
 * Body content comes from the Jekyll collection via CsContent; the collapsed
 * card face, hero overlay and fly overlay come in via slots.
 */
export default defineComponent({
  name: 'CaseStudyOverlay',

  props: {
    cardClass:  { type: String, default: '' },
    cardKey:    { type: String, default: '' },
    imageSrc:      { type: String, default: '' },
    imageClass:    { type: String, default: '' },
    heroWrapClass: { type: String, default: '' },
    heroSize:   { type: Number, default: 448 },
    videoSrc:   { type: String, default: '' },   // when set, hero media is a looping <video>
  },

  setup(props, { slots }) {
    const cardEl    = ref(null)
    const videoEl   = ref(null)
    const expanded  = ref(false)
    const settled   = ref(false)
    const closing   = ref(false)
    const flyActive  = ref(false)
    const flyFading  = ref(false)
    const heroReady  = ref(false)
    const wasOpen    = ref(false)
    const flyStyle  = ref({})
    const { spawnRipple, renderRipples } = useRipple()

    let startRect  = null
    let videoStart = null
    let closeTimer = null
    let flyTimer   = null
    let imgObserver = null
    let savedScrollY = 0

    // ── Back-to-top inside case study ──
    const scrollHost = ref(null)
    const bttVisible = ref(false)

    function lockInnerScroll() {
      const el = scrollHost.value
      if (el) el.style.overflowY = 'hidden'
    }
    function unlockInnerScroll() {
      const el = scrollHost.value
      if (el) el.style.overflowY = ''
    }

    let csScrolling = false

    function onCsScroll(e) {
      if (csScrolling) return
      bttVisible.value = e.target.scrollTop > window.innerHeight * 0.5
    }

    function scrollCsToTop() {
      const el = scrollHost.value
      if (!el) return
      const start = el.scrollTop
      if (start === 0) return

      csScrolling = true
      const startTime = performance.now()
      const duration = 500
      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        el.scrollTo(0, start * (1 - ease))
        if (progress < 1) {
          requestAnimationFrame(step)
        } else {
          csScrolling = false
          bttVisible.value = false
        }
      }
      requestAnimationFrame(step)
    }

    // ── Scroll-triggered fade-slide-up for figures and demos ──
    const contentEl = ref(null)

    function setupImageObserver() {
      if (imgObserver) imgObserver.disconnect()
      const container = contentEl.value
      if (!container) return

      imgObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add('cs-img-visible')
              imgObserver.unobserve(entry.target)
            }
          })
        },
        { threshold: 0, rootMargin: '200px', root: container.closest('.cs-expanded-inner') }
      )

      container.querySelectorAll('.cs-cover-img, .cs-demo-video, .cs-demo').forEach(el => {
        imgObserver.observe(el)
      })

      // Safety net: IO is unreliable inside scroll containers on mobile
      setTimeout(() => {
        container.querySelectorAll('.cs-demo').forEach(el => el.classList.add('cs-img-visible'))
      }, 1500)
    }

    function teardownImageObserver() {
      if (imgObserver) { imgObserver.disconnect(); imgObserver = null }
    }

    onUnmounted(teardownImageObserver)

    // ── Escape key to close ──
    function onKeydown(e) { if (e.key === 'Escape') close() }
    onUnmounted(() => document.removeEventListener('keydown', onKeydown))

    // ── Deep-link + URL sync ──
    function onHashOpen(e) {
      if (e.detail === props.cardKey) open()
    }
    function onPopState() {
      if (!expanded.value) return
      const slug = CARD_KEY_TO_SLUG[props.cardKey]
      const onMyPath = slug && window.location.pathname === `/case-studies/${slug}/`
      if (!onMyPath) close({ skipUrlUpdate: true })
    }
    onMounted(() => {
      window.addEventListener('cs:open', onHashOpen)
      window.addEventListener('popstate', onPopState)
    })
    onUnmounted(() => {
      window.removeEventListener('cs:open', onHashOpen)
      window.removeEventListener('popstate', onPopState)
    })

    // Hero media — a looping muted <video> when videoSrc is set, else the flat image.
    function media(attrs, onReady) {
      const isVideo = !!props.videoSrc
      const source = isVideo
        ? { src: props.videoSrc, poster: props.imageSrc, loop: true, muted: true, playsinline: true, autoplay: !REDUCED_MOTION }
        : { src: props.imageSrc, alt: '' }
      const ready = onReady ? (isVideo ? { onLoadeddata: onReady } : { onLoad: onReady }) : null
      return h(isVideo ? 'video' : 'img', { ...source, ...ready, ...attrs })
    }

    // ── Ripple on expanded card click (skip interactive widgets) ──
    function onExpandedClick(e) {
      if (e.target.closest('.cs-demo') || e.target.closest('.tldr-bar')) return
      spawnRipple(e)
    }

    // ── Where the hero lands in the expanded view ──
    function videoTarget() {
      const vpW = window.innerWidth
      const size = Math.min(props.heroSize, vpW - 48)
      return {
        left: (vpW - size) / 2,
        top: 40,
        size,
      }
    }

    // ── Expanded card position (FLIP: card rect → fullscreen) ──
    function expandedStyle() {
      if (!startRect) return {}

      if (!settled.value || closing.value) {
        return {
          left:   startRect.left   + 'px',
          top:    startRect.top    + 'px',
          width:  startRect.width  + 'px',
          height: startRect.height + 'px',
        }
      }
      return {
        left:   '0px',
        top:    '0px',
        width:  '100vw',
        height: '100vh',
      }
    }

    // ── Open ──
    async function open() {
      if (expanded.value) return
      // Never open from a de-prioritised (dimmed) grid slot
      if (cardEl.value && cardEl.value.closest('.grid-slot--dim')) return

      startRect  = cardEl.value.getBoundingClientRect()
      videoStart = videoEl.value.getBoundingClientRect()

      flyStyle.value = {
        left:         videoStart.left   + 'px',
        top:          videoStart.top    + 'px',
        width:        videoStart.width  + 'px',
        height:       videoStart.height + 'px',
        borderRadius: '32px',
        transition:   'none',
      }
      flyActive.value = true
      heroReady.value = false
      bttVisible.value = false
      expanded.value  = true
      settled.value   = false
      closing.value   = false
      wasOpen.value   = true
      savedScrollY = window.scrollY
      // Push the canonical case-study URL unless already there
      const slug = CARD_KEY_TO_SLUG[props.cardKey]
      if (slug) {
        const target = `/case-studies/${slug}/`
        if (window.location.pathname !== target) {
          history.pushState(null, '', target)
        }
      }
      document.body.style.position = 'fixed'
      document.body.style.top = `-${savedScrollY}px`
      document.body.style.width = '100%'
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', onKeydown)

      await nextTick()
      lockInnerScroll()

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          settled.value = true

          nextTick(() => setupImageObserver())

          const t = videoTarget()
          flyStyle.value = {
            left:         t.left + 'px',
            top:          t.top  + 'px',
            width:        t.size + 'px',
            height:       t.size + 'px',
            borderRadius: '32px',
            transition:   FLY_TRANSITION,
          }

          // Hand off to the static hero once flight completes and hero painted
          clearTimeout(flyTimer)
          flyTimer = setTimeout(() => {
            const doHandoff = () => {
              flyFading.value = true
              requestAnimationFrame(() => requestAnimationFrame(() => {
                setTimeout(() => {
                  flyActive.value = false
                  flyFading.value = false
                  unlockInnerScroll()
                }, 250)
              }))
            }
            if (heroReady.value) {
              doHandoff()
            } else {
              let handedOff = false
              const poll = setInterval(() => {
                if (heroReady.value) {
                  clearInterval(poll)
                  if (!handedOff) { handedOff = true; doHandoff() }
                }
              }, 50)
              setTimeout(() => {
                clearInterval(poll)
                if (!handedOff) { handedOff = true; doHandoff() }
              }, 500)
            }
          }, ANIM_MS + 150)
        })
      })
    }

    // ── Close ──
    function close(opts = {}) {
      if (closing.value) return

      const useFly = !flyActive.value

      if (useFly && videoStart) {
        const t = videoTarget()
        flyStyle.value = {
          left:         t.left + 'px',
          top:          t.top  + 'px',
          width:        t.size + 'px',
          height:       t.size + 'px',
          borderRadius: '32px',
          transition:   'none',
        }
        flyActive.value = true

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            flyStyle.value = {
              left:         videoStart.left   + 'px',
              top:          videoStart.top    + 'px',
              width:        videoStart.width  + 'px',
              height:       videoStart.height + 'px',
              borderRadius: '32px',
              transition:   FLY_TRANSITION,
            }
          })
        })
      }

      closing.value = true
      teardownImageObserver()
      clearTimeout(closeTimer)
      closeTimer = setTimeout(() => {
        expanded.value  = false
        settled.value   = false
        closing.value   = false
        flyActive.value = false
        flyFading.value = false
        startRect  = null
        videoStart = null
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        document.body.style.overflow = ''
        window.scrollTo(0, savedScrollY)
        document.removeEventListener('keydown', onKeydown)
        // Return URL to root unless the browser already navigated (popstate)
        if (!opts.skipUrlUpdate) {
          const slug = CARD_KEY_TO_SLUG[props.cardKey]
          const onMyPath = slug && window.location.pathname === `/case-studies/${slug}/`
          if (onMyPath) {
            history.pushState(null, '', '/')
          } else if (props.cardKey && window.location.hash === '#' + props.cardKey) {
            history.replaceState(null, '', window.location.pathname + window.location.search)
          }
        }
      }, ANIM_MS + 20)
    }

    // ── Render ──
    return () => h('div', { class: 'cs-card-wrapper' }, [

      // ── Flying media (position:fixed, above everything) ──
      flyActive.value
        ? h('div', {
            class: 'cs-video-fly',
            style: { ...flyStyle.value, overflow: 'hidden' },
          }, [
            media({ style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' } }),
            slots.flyContent?.(),
          ])
        : null,

      // ── Collapsed card ──
      h('div', {
        ref:     cardEl,
        class:   [
          'bento-card', 'dark',
          props.cardClass,
          expanded.value ? 'cs-card--ghost' : '',
          wasOpen.value ? 'cs-card--was-open' : '',
        ].filter(Boolean).join(' '),
        onClick: open,
        'data-tooltip': CARD_KEY_TO_TOOLTIP[props.cardKey],
      }, [
        h('a', {
          class:   'action-icon',
          href:    '#',
          onClick: e => { e.preventDefault(); open() },
        }, [h('img', { src: ICON_FULL_SCREEN, alt: 'Open case study' })]),

        media({
          ref:   videoEl,
          class: props.imageClass,
          style: flyActive.value
            ? 'pointer-events: none; opacity: 0;'
            : 'pointer-events: none;',
        }),

        // Collapsed card face
        slots.default?.(),
      ]),

      // ── Expanded fullscreen overlay ──
      expanded.value ? h('div', null, [

        h('div', {
          class:   ['cs-backdrop', closing.value ? 'cs-backdrop--out' : ''].filter(Boolean).join(' '),
          onClick:     close,
          onWheel:     e => e.preventDefault(),
          onTouchmove: e => e.preventDefault(),
        }),

        h('div', {
          class: [
            'cs-expanded',
            settled.value ? 'cs-expanded--settled' : '',
            closing.value ? 'cs-expanded--closing' : '',
          ].filter(Boolean).join(' '),
          style: expandedStyle(),
          onClick: onExpandedClick,
        }, [

          h('div', { class: 'cs-header' }, [
            h('button', {
              class:           'cs-header-close',
              onClick:         e => { e.stopPropagation(); close() },
              'aria-label':    'Close case study',
              'data-tooltip':  'Press Esc to exit fullscreen',
            }, [
              h('img', { src: ICON_SHRINK, alt: 'Close', width: 20, height: 20 }),
            ]),
          ]),

          h('div', { ref: scrollHost, class: 'cs-expanded-inner', onScroll: onCsScroll }, [
            h('div', { ref: contentEl, class: 'cs-expanded-content' }, [

              // Hero (static, replaces flying media after animation)
              h('div', {
                class: ['cs-hero-wrap', props.heroWrapClass].filter(Boolean).join(' '),
                style: {
                  width:    props.heroSize + 'px',
                  height:   props.heroSize + 'px',
                  position: 'relative',
                  marginLeft:  'auto',
                  marginRight: 'auto',
                },
              }, [
                media({
                  class: 'cs-hero-video',
                  style: {
                    width:      '100%',
                    height:     '100%',
                    objectFit:  'cover',
                    opacity:    flyActive.value && !flyFading.value ? 0 : 1,
                    transition: 'opacity 0.2s ease',
                  },
                }, () => { heroReady.value = true }),
                slots.heroOverlay?.(),
              ]),

              // Case study body from the Jekyll collection
              h(CsContent, { cardKey: props.cardKey }),
            ]),
          ]),

          ...renderRipples(),

          // Back-to-top (inside expanded card)
          h('button', {
            class: ['cs-back-to-top', bttVisible.value ? 'cs-back-to-top--visible' : ''],
            onClick: e => { e.stopPropagation(); scrollCsToTop() },
            'aria-label': 'Back to top',
          }, [
            h('svg', {
              xmlns: 'http://www.w3.org/2000/svg',
              width: '20', height: '20', viewBox: '0 0 24 24',
              fill: 'none', stroke: 'currentColor',
              'stroke-width': '2.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
            }, [h('polyline', { points: '18 15 12 9 6 15' })]),
          ]),
        ]),
      ]) : null,
    ])
  },
})
