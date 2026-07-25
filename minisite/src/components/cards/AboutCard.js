import { defineComponent, h, ref, nextTick } from 'vue'
import { ICON_SHRINK, ICON_EXPAND } from '../../assets/icons/icons.js'
import { useRipple } from '../../composables/useRipple.js'
import { isLazy } from '../../lazyMode.js'
import { profile, templateHTML } from '../../siteData.js'

const AVATAR   = profile.avatar
const ABOUT_MAX_W = 800   // max width for the expanded about card
const ANIM_MS = 700   // must match CSS transition duration

/* ── Link peek previews — code-drawn brand cards, keyed by .brand-* class ── */
const BRAND_PREVIEWS = {
  'brand-octopus':   { label: 'Octopus Deploy', sub: 'octopus.com',      color: '#0d80d2' },
  'brand-bms':       { label: 'BookMyShow',     sub: 'in.bookmyshow.com', color: '#c4242b' },
  'brand-cleartrip': { label: 'Cleartrip',      sub: 'cleartrip.com',    color: '#ff4f17' },
  'brand-tmnz':      { label: 'TMNZ',           sub: 'tmnz.co.nz',       color: '#0e6e8c' },
  'brand-nid':       { label: 'National Institute of Design', sub: 'nid.edu', color: '#b01e24' },
  'brand-jj':        { label: 'Sir JJ School of Art', sub: 'est. 1857',  color: '#8a6d3b' },
  'brand-forest':    { label: "A Forest's Dream", sub: 'a short film',   color: '#6e7a50' },
  'brand-kea':       { label: 'The Birds of Play', sub: 'a short film',  color: '#e8632c' },
}

function previewDataURI({ label, sub, color }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">
    <rect width="320" height="200" rx="16" fill="#faf9f7"/>
    <rect width="320" height="72" fill="${color}"/>
    <circle cx="36" cy="36" r="14" fill="rgba(255,255,255,0.9)"/>
    <text x="24" y="118" font-family="Syne, sans-serif" font-size="19" font-weight="700" fill="#2c2c2c">${label}</text>
    <text x="24" y="146" font-family="Syne, sans-serif" font-size="13" fill="#888888">${sub}</text>
  </svg>`
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg)
}

// Shared cubic-bezier for all FLIP transitions
const EASE = 'cubic-bezier(0.34, 1.1, 0.64, 1)'
const FLY_TRANSITION = `left ${ANIM_MS}ms ${EASE}, top ${ANIM_MS}ms ${EASE}, width ${ANIM_MS}ms ${EASE}, height ${ANIM_MS}ms ${EASE}, border-radius 400ms ease`

export default defineComponent({
  name: 'AboutCard',

  setup() {
    const cardEl   = ref(null)
    const avatarEl = ref(null)
    const expanded  = ref(false)
    const settled   = ref(false)
    const closing   = ref(false)
    const wasOpen   = ref(false)    // prevents card-enter animation replaying
    const flyActive       = ref(false)
    const flyStyle        = ref({})
    const { spawnRipple: spawnExpandedRipple, renderRipples } = useRipple()

    // ── Touch / mobile detection (skip link previews) ──
    const isTouch = 'ontouchstart' in window
      || navigator.maxTouchPoints > 0
      || (typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches)
      || window.innerWidth <= 768

    // ── Link preview (iOS-style peek) ──
    const preview = ref({ visible: false, x: 0, y: 0, src: '' })
    let previewTimer = null
    const PREVIEW_OFFSET = 24
    const PREVIEW_W = 320
    const PREVIEW_H = 200
    const PREVIEW_LERP = 0.07

    let previewMouseX = 0
    let previewMouseY = 0
    let previewSmoothX = 0
    let previewSmoothY = 0
    let previewRafId = null

    function lerpVal(a, b, t) { return a + (b - a) * t }

    function previewAnimLoop() {
      const pl = isLazy.value ? PREVIEW_LERP : 1
      previewSmoothX = lerpVal(previewSmoothX, previewMouseX, pl)
      previewSmoothY = lerpVal(previewSmoothY, previewMouseY, pl)
      preview.value = {
        ...preview.value,
        x: previewSmoothX,
        y: previewSmoothY,
      }
      previewRafId = requestAnimationFrame(previewAnimLoop)
    }

    function showPreview(e, src) {
      clearTimeout(previewTimer)
      const rawX = e.clientX + PREVIEW_OFFSET
      const rawY = e.clientY + PREVIEW_OFFSET
      const clampedX = Math.min(rawX, window.innerWidth  - PREVIEW_W - 12)
      const clampedY = Math.min(rawY, window.innerHeight - PREVIEW_H - 12)
      previewMouseX = clampedX
      previewMouseY = clampedY

      if (!preview.value.visible || preview.value.src !== src) {
        previewSmoothX = clampedX
        previewSmoothY = clampedY
        preview.value = { visible: true, x: clampedX, y: clampedY, src }
        cancelAnimationFrame(previewRafId)
        previewRafId = requestAnimationFrame(previewAnimLoop)
      }
    }

    function hidePreview() {
      previewTimer = setTimeout(() => {
        preview.value = { ...preview.value, visible: false }
        cancelAnimationFrame(previewRafId)
      }, 80)
    }

    // Delegated hover on the injected bio HTML
    function onBioOver(e) {
      if (isTouch) return
      const link = e.target.closest?.('a.bio-link')
      if (!link) { hidePreview(); return }
      const brand = [...link.classList].find(c => BRAND_PREVIEWS[c])
      if (!brand) { hidePreview(); return }
      showPreview(e, previewDataURI(BRAND_PREVIEWS[brand]))
    }

    let startRect   = null
    let avatarStart = null
    let closeTimer  = null
    let avatarTimer = null

    function onKeyDown(e) {
      if (e.key === 'Escape') close()
    }

    // Where the avatar lands inside the expanded card
    function avatarTarget() {
      const vpW     = window.innerWidth
      const vpH     = window.innerHeight
      const targetW = Math.min(ABOUT_MAX_W, vpW - 48)
      const targetH = Math.min(vpH * 0.85, 820)
      const targetL = Math.max(24, (vpW - targetW) / 2)
      const targetT = Math.max(24, (vpH - targetH) / 2)
      return {
        left: targetL + (targetW - 150) / 2,
        top:  targetT + 40,
        size: 150,
      }
    }

    // Where the whole expanded card lives
    function expandedStyle() {
      if (!startRect) return {}
      const vpW     = window.innerWidth
      const vpH     = window.innerHeight
      const targetW = Math.min(ABOUT_MAX_W, vpW - 48)
      const targetH = Math.min(vpH * 0.85, 820)
      const targetL = (vpW - targetW) / 2
      const targetT = (vpH - targetH) / 2

      if (!settled.value || closing.value) {
        return {
          left:   startRect.left   + 'px',
          top:    startRect.top    + 'px',
          width:  startRect.width  + 'px',
          height: startRect.height + 'px',
        }
      }
      return {
        left:   Math.max(24, targetL) + 'px',
        top:    Math.max(24, targetT) + 'px',
        width:  targetW + 'px',
        height: targetH + 'px',
      }
    }

    async function open() {
      if (expanded.value) return
      if (cardEl.value && cardEl.value.closest('.grid-slot--dim')) return

      startRect   = cardEl.value.getBoundingClientRect()
      avatarStart = avatarEl.value.getBoundingClientRect()

      // ① Place flying avatar exactly over the collapsed avatar
      flyStyle.value = {
        left:         avatarStart.left   + 'px',
        top:          avatarStart.top    + 'px',
        width:        avatarStart.width  + 'px',
        height:       avatarStart.height + 'px',
        borderRadius: '24px 0 0 24px',
        transition:   'none',
      }
      flyActive.value = true
      expanded.value  = true
      settled.value   = false
      closing.value   = false
      wasOpen.value   = true
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', onKeyDown)

      await nextTick()

      // ② Let start-state paint, then trigger card + avatar transitions
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          settled.value = true

          const t = avatarTarget()
          flyStyle.value = {
            left:         t.left + 'px',
            top:          t.top  + 'px',
            width:        t.size + 'px',
            height:       t.size + 'px',
            borderRadius: '50%',
            transition:   FLY_TRANSITION,
          }

          // ③ Hand off to the static expanded avatar once flying is done
          clearTimeout(avatarTimer)
          avatarTimer = setTimeout(() => { flyActive.value = false }, ANIM_MS + 150)
        })
      })
    }

    function close() {
      if (closing.value) return

      const useFly = !flyActive.value

      if (useFly) {
        const t = avatarTarget()
        flyStyle.value = {
          left:         t.left + 'px',
          top:          t.top  + 'px',
          width:        t.size + 'px',
          height:       t.size + 'px',
          borderRadius: '50%',
          transition:   'none',
        }
        flyActive.value = true

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            flyStyle.value = {
              left:         avatarStart.left   + 'px',
              top:          avatarStart.top    + 'px',
              width:        avatarStart.width  + 'px',
              height:       avatarStart.height + 'px',
              borderRadius: '24px 0 0 24px',
              transition:   FLY_TRANSITION,
            }
          })
        })
      }

      closing.value = true
      clearTimeout(closeTimer)
      window.removeEventListener('keydown', onKeyDown)
      closeTimer = setTimeout(() => {
        expanded.value  = false
        settled.value   = false
        closing.value   = false
        flyActive.value = false
        startRect   = null
        avatarStart = null
        document.documentElement.style.overflow = ''
        document.body.style.overflow = ''
      }, ANIM_MS + 20)
    }

    return () => h('div', { class: 'about-card-wrapper' }, [

      // ── Flying avatar (position:fixed, above everything) ──
      h('img', {
        class: 'about-avatar-fly',
        src:   AVATAR,
        alt:   '',
        style: {
          ...flyStyle.value,
          opacity: flyActive.value ? 1 : 0,
          pointerEvents: 'none',
        },
      }),

      // ── Collapsed card ────────────────────────────────────
      h('div', {
        ref:            cardEl,
        class:          ['bento-card', 'about-card', expanded.value ? 'about-card--ghost' : '', wasOpen.value ? 'about-card--was-open' : ''].join(' '),
        onClick:        open,
        'data-tooltip': 'Expand to learn more about me',
      }, [
        h('a', {
          class:   'action-icon',
          href:    '#',
          onClick: e => { e.preventDefault(); open() },
        }, [h('img', { src: ICON_EXPAND, alt: 'Expand' })]),

        h('img', {
          ref:   avatarEl,
          class: 'about-avatar',
          src:   AVATAR,
          alt:   profile.name,
          style: flyActive.value ? { opacity: 0 } : {},
        }),

        h('div', { class: 'about-bio' }, [
          h('p', profile.greeting),
          h('p', profile.card_bio),
        ]),
      ]),

      // ── Expanded overlay ──────────────────────────────────
      expanded.value ? h('div', null, [

        h('div', {
          class:   ['about-backdrop', closing.value ? 'about-backdrop--out' : ''].join(' '),
          onClick:     close,
          onWheel:     e => e.preventDefault(),
          onTouchmove: e => e.preventDefault(),
        }),

        h('div', {
          class: [
            'about-expanded-card',
            settled.value ? 'about-expanded-card--settled' : '',
            closing.value ? 'about-expanded-card--closing' : '',
          ].filter(Boolean).join(' '),
          style: expandedStyle(),
          onClick: spawnExpandedRipple,
        }, [
          h('button', {
            class:          'about-shrink-btn',
            onClick:        e => { e.stopPropagation(); close() },
            'aria-label':   'Close',
            'data-tooltip': 'Press Esc to exit',
          }, [h('img', { src: ICON_SHRINK, alt: 'Close', width: 20, height: 20 })]),

          h('div', { class: 'about-expanded-inner' }, [
            h('div', { class: 'about-expanded-content' }, [

              h('img', {
                class: 'about-expanded-avatar',
                src:   AVATAR,
                alt:   profile.name,
                style: flyActive.value ? { opacity: 0 } : {},
              }),

              // Jekyll-rendered bio + pronunciation + principles
              h('div', {
                class: 'about-expanded-body',
                innerHTML: templateHTML('tpl-about'),
                onMouseover: onBioOver,
                onMousemove: onBioOver,
                onMouseleave: hidePreview,
              }),
            ]),
          ]),

          ...renderRipples(),

          // ── Link preview popup (iOS-style peek) ──
          h('div', {
            class: ['bio-link-preview', preview.value.visible ? 'bio-link-preview--visible' : ''].join(' '),
            style: {
              left: preview.value.x + 'px',
              top:  preview.value.y + 'px',
            },
          }, [
            preview.value.src ? h('img', {
              class: 'bio-link-preview-img',
              src:   preview.value.src,
              alt:   'Preview',
            }) : null,
          ]),
        ]),

      ]) : null,
    ])
  },
})
