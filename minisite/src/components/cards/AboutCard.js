import { defineComponent, h, ref, nextTick } from 'vue'
import { ICON_SHRINK, ICON_EXPAND } from '../../assets/icons/icons.js'
import { useRipple } from '../../composables/useRipple.js'
import { useLinkPreview } from '../../composables/useLinkPreview.js'
import { fillYears, profile, templateHTML } from '../../siteData.js'

const AVATAR   = profile.avatar
const ABOUT_MAX_W = 800   // max width for the expanded about card
const ANIM_MS = 700   // must match CSS transition duration

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

    // ── Link peek previews (shared with case studies) ──
    const { handlers: previewHandlers, bindLinks, renderPreview } = useLinkPreview()

    // Tag + warm the screenshots on expand, so the first hover isn't a blank box
    const bioEl = ref(null)
    let prepared = false
    function prepareLinks() {
      if (prepared) return
      prepared = true
      bindLinks(bioEl.value)
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
      prepareLinks()   // bio links exist now

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
                ref: bioEl,
                class: 'about-expanded-body',
                innerHTML: fillYears(templateHTML('tpl-about')),
                ...previewHandlers,
              }),
            ]),
          ]),

          ...renderRipples(),

          renderPreview(),
        ]),

      ]) : null,
    ])
  },
})
