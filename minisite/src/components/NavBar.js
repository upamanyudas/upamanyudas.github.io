import { defineComponent, h, ref, onMounted, onUnmounted, nextTick } from 'vue'
import { layouts } from '../siteData.js'
import LazyToggle from './LazyToggle.js'

const NAV_ITEMS = ['All', 'About', 'Work', 'Side Quests']

// Shorter labels for mobile to avoid two-line pills
const MOBILE_LABELS = { 'Side Quests': 'Hobbies' }
const SCROLL_THRESHOLD = 80  // px from top before hide kicks in

export default defineComponent({
  name: 'NavBar',
  emits: ['filterChange'],
  setup(props, { emit }) {
    const active = ref('All')
    const hidden = ref(false)
    const isMobile = ref(window.innerWidth <= layouts.mobile_breakpoint)
    const pillsRef = ref(null)
    const pillEls = ref([])
    const indicatorStyle = ref({ left: '0px', width: '0px' })
    const indicatorReady = ref(false)

    // Hover ghost pill state
    const hoverStyle = ref({ left: '0px', width: '0px', opacity: 0 })

    // Liquid-glass stretch state
    const isAnimating = ref(false)
    const stretchTransform = ref('')

    function getElMetrics(item) {
      const container = pillsRef.value
      if (!container) return null
      const idx = NAV_ITEMS.indexOf(item)
      const el = pillEls.value[idx]
      if (!el) return null
      const containerRect = container.getBoundingClientRect()
      const elRect = el.getBoundingClientRect()
      return {
        left: elRect.left - containerRect.left,
        width: elRect.width,
        centerX: (elRect.left - containerRect.left) + elRect.width / 2,
      }
    }

    function updateIndicator(skipTransition = false) {
      const m = getElMetrics(active.value)
      if (!m) return
      indicatorStyle.value = {
        left: `${m.left}px`,
        width: `${m.width}px`,
      }
      if (!skipTransition) indicatorReady.value = true
    }

    let lastScrollY = 0

    function onScroll() {
      // On mobile the nav lives at the bottom and is always visible
      if (window.innerWidth <= layouts.mobile_breakpoint) {
        hidden.value = false
        lastScrollY = window.scrollY
        return
      }
      const currentY = window.scrollY
      if (currentY > lastScrollY && currentY > SCROLL_THRESHOLD) {
        hidden.value = true
      } else {
        hidden.value = false
      }
      lastScrollY = currentY
    }

    const mql = window.matchMedia(`(max-width: ${layouts.mobile_breakpoint}px)`)
    function onBreakpoint(e) { isMobile.value = e.matches }

    onMounted(() => {
      lastScrollY = window.scrollY
      window.addEventListener('scroll', onScroll, { passive: true })
      mql.addEventListener('change', onBreakpoint)
      nextTick(() => {
        updateIndicator(true)
        requestAnimationFrame(() => { indicatorReady.value = true })
      })
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', onScroll)
      mql.removeEventListener('change', onBreakpoint)
    })

    // ── Hover ghost pill handlers ──
    function onPillHover(item) {
      if (item === active.value) {
        hoverStyle.value = { ...hoverStyle.value, opacity: 0 }
        return
      }
      const m = getElMetrics(item)
      if (!m) return
      hoverStyle.value = {
        left: `${m.left}px`,
        width: `${m.width}px`,
        opacity: 1,
      }
    }

    function onPillLeave() {
      hoverStyle.value = { ...hoverStyle.value, opacity: 0 }
    }

    // ── Liquid-glass select ──
    function selectItem(item) {
      if (item === active.value) return

      const fromMetrics = getElMetrics(active.value)
      const toMetrics   = getElMetrics(item)

      hoverStyle.value = { ...hoverStyle.value, opacity: 0 }

      if (fromMetrics && toMetrics) {
        const distance = Math.abs(toMetrics.centerX - fromMetrics.centerX)
        // Stretch proportional to distance — capped for subtlety
        const stretchX = 1 + Math.min(distance / 280, 0.35)
        const squishY  = 1 - Math.min(distance / 900, 0.12)

        // Phase 1: stretch while moving
        isAnimating.value = true
        stretchTransform.value = `scaleX(${stretchX}) scaleY(${squishY})`

        active.value = item
        emit('filterChange', item)
        nextTick(() => {
          updateIndicator(false)

          // Phase 2: settle back to normal
          requestAnimationFrame(() => {
            setTimeout(() => {
              stretchTransform.value = 'scaleX(1) scaleY(1)'
              // Phase 3: done
              setTimeout(() => {
                isAnimating.value = false
                stretchTransform.value = ''
              }, 280)
            }, 80)
          })
        })
      } else {
        active.value = item
        emit('filterChange', item)
        nextTick(() => updateIndicator(false))
      }
    }

    return () => {
      const baseIndicator = { ...indicatorStyle.value }
      if (stretchTransform.value) {
        baseIndicator.transform = stretchTransform.value
      }

      return h('nav', { class: ['nav', hidden.value ? 'nav--hidden' : ''].filter(Boolean).join(' ') }, [
        // Logo: "Upa" that unfolds to "Upamanyu" on hover
        h('a', { class: 'nav-logo upa-logo', href: '/', 'data-tooltip': 'That’s me — Upamanyu. Upa for short.' }, [
          h('span', { class: 'upa-logo-text' }, [
            'Upa',
            h('span', { class: 'upa-logo-rest' }, 'manyu'),
          ]),
        ]),

        h('div', {
          class: 'nav-pills',
          ref: pillsRef,
          onMouseleave: onPillLeave,
        }, [
          // Hover ghost pill (faint, follows hovered item)
          h('span', {
            class: 'nav-pill-hover-ghost',
            style: hoverStyle.value,
          }),
          // Sliding indicator with liquid-glass stretch
          h('span', {
            class: [
              'nav-pill-indicator',
              indicatorReady.value ? 'nav-pill-indicator--ready' : '',
              isAnimating.value ? 'nav-pill-indicator--liquid' : '',
            ],
            style: baseIndicator,
          }),
          // Pills
          ...NAV_ITEMS.map((item, i) =>
            h('a', {
              href: '#',
              class: ['nav-pill', active.value === item ? 'active' : ''],
              ref: (el) => { if (el) pillEls.value[i] = el },
              onClick: (e) => { e.preventDefault(); selectItem(item) },
              onMouseenter: () => onPillHover(item),
            }, isMobile.value && MOBILE_LABELS[item] ? MOBILE_LABELS[item] : item)
          ),
        ]),

        // ── Lazy-mode toggle (top-right) ──
        h(LazyToggle),
      ])
    }
  },
})
