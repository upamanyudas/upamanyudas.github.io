import { defineComponent, h, ref, nextTick, onMounted, onUnmounted } from 'vue'
import { isLazy }     from './lazyMode.js'
import { packLayout } from './pack.js'
import { layouts, caseStudies } from './siteData.js'
import NavBar         from './components/NavBar.js'
import CursorTooltip  from './components/CursorTooltip.js'
import CursorShape    from './components/CursorShape.js'
import BackToTop      from './components/BackToTop.js'
import AboutCard      from './components/cards/AboutCard.js'
import GmailCard      from './components/cards/GmailCard.js'
import LinkedInCard   from './components/cards/LinkedInCard.js'
import BulbCard       from './components/cards/BulbCard.js'
import BirdsCard      from './components/cards/BirdsCard.js'
import FilmCard       from './components/cards/FilmCard.js'
import StatCard       from './components/cards/StatCard.js'
import QuoteCard      from './components/cards/QuoteCard.js'
import AgenticDSCard  from './cs/agentic-design-system/card.js'
import TicketingCard  from './cs/re-envisioning-ticketing/card.js'
import ReviewsCard    from './cs/ten-second-reviews/card.js'
import OptimiserCard  from './cs/group-optimiser/card.js'

const MOBILE_BREAKPOINT = layouts.mobile_breakpoint

/* ── Card registry ───────────────────────────────────────────────────
   Key → component (+ static props). Order and grid placement come from
   _data/minisite/layouts.yml, so reordering is a YAML edit. */
const COMPONENTS = {
  about:      { comp: AboutCard },
  gmail:      { comp: GmailCard },
  linkedin:   { comp: LinkedInCard },
  bulb:       { comp: BulbCard },
  birds:      { comp: BirdsCard },
  agenticds:  { comp: AgenticDSCard },
  ticketing:  { comp: TicketingCard },
  reviews:    { comp: ReviewsCard },
  optimiser:  { comp: OptimiserCard },
  filmforest: { comp: FilmCard, props: { variant: 'forest' } },
  filmkea:    { comp: FilmCard, props: { variant: 'kea' } },
  statmoney:  { comp: StatCard, props: { statKey: 'statmoney' } },
  statusers:  { comp: StatCard, props: { statKey: 'statusers' } },
  statyears:  { comp: StatCard, props: { statKey: 'statyears' } },
  dsquote:    { comp: QuoteCard, props: { quoteKey: 'craft', cardClass: 'ds-quote-card' } },
  uxquote:    { comp: QuoteCard, props: { quoteKey: 'ux', cardClass: 'ux-quote-card' } },
}

// key + component + size/filter metadata from layouts.yml, in packing order
const CARD_ENTRIES = layouts.order
  .filter(key => COMPONENTS[key])
  .map(key => ({ key, ...COMPONENTS[key], ...layouts.cards[key] }))

// Per-breakpoint pack entries — mobile uses the `m` column span.
const entriesFor = mobile =>
  CARD_ENTRIES.map(e => ({ ...e, w: mobile ? e.m : e.w }))
const DESKTOP_ENTRIES = entriesFor(false)
const MOBILE_ENTRIES  = entriesFor(true)

export default defineComponent({
  name: 'App',
  setup() {
    const activeFilter = ref('All')
    const isMobile = ref(window.innerWidth <= MOBILE_BREAKPOINT)

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`)
    mql.addEventListener('change', (e) => { isMobile.value = e.matches })

    // ── Deep-link: open a case study from /case-studies/<slug>/ or /#<key> ──
    const SLUG_TO_CARD_KEY = Object.fromEntries(caseStudies.map(cs => [cs.slug, cs.key]))

    function resolveCardKey() {
      const pathMatch = window.location.pathname.match(/\/case-studies\/([^/]+)\/?$/)
      if (pathMatch) {
        const fromSlug = SLUG_TO_CARD_KEY[pathMatch[1]]
        if (fromSlug) return fromSlug
        const appEl = document.getElementById('app')
        const hint = appEl && appEl.dataset && appEl.dataset.caseStudy
        if (hint) return hint
      }
      const hash = window.location.hash.slice(1)
      if (hash) return hash
      return null
    }

    function openCardFromUrl() {
      const cardKey = resolveCardKey()
      if (!cardKey) return
      // Small delay to ensure cards are mounted and listening
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('cs:open', { detail: cardKey }))
      }, 300)
    }
    onMounted(() => {
      openCardFromUrl()
      window.addEventListener('hashchange', openCardFromUrl)
      window.addEventListener('popstate', openCardFromUrl)
    })
    onUnmounted(() => {
      window.removeEventListener('hashchange', openCardFromUrl)
      window.removeEventListener('popstate', openCardFromUrl)
    })

    // Direct DOM refs per grid slot — outside Vue reactivity for FLIP perf
    const slotEls = {}

    /* ── FLIP animation on filter change ── */
    async function onFilterChange(newFilter) {
      if (newFilter === activeFilter.value) return

      window.scrollTo({ top: 0, behavior: isLazy.value ? 'smooth' : 'instant' })

      // F: snapshot current rects
      const prevRects = {}
      for (const key in slotEls) {
        const el = slotEls[key]
        if (el) prevRects[key] = el.getBoundingClientRect()
      }

      // L: re-render with new grid positions
      activeFilter.value = newFilter
      await nextTick()

      // I + P: invert then play
      const movers = []
      for (const key in slotEls) {
        const el = slotEls[key]
        if (!el || !prevRects[key]) continue
        const newRect = el.getBoundingClientRect()
        const dx = prevRects[key].left - newRect.left
        const dy = prevRects[key].top  - newRect.top
        if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) continue

        el.style.transition = 'none'
        el.style.transform  = `translate(${dx}px, ${dy}px)`
        movers.push(el)
      }

      if (!movers.length) return

      movers.forEach(el => { el.style.willChange = 'transform' })
      movers[0].getBoundingClientRect()

      requestAnimationFrame(() => {
        movers.forEach(el => {
          el.style.transition =
            'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease'
          el.style.transform = 'none'

          const cleanup = () => {
            el.style.transition = ''
            el.style.transform  = ''
            el.style.willChange = ''
            el.removeEventListener('transitionend', cleanup)
          }
          el.addEventListener('transitionend', cleanup, { once: true })
        })
      })
    }

    /* ── Render ── */
    return () => {
      const mobile = isMobile.value
      const entries = mobile ? MOBILE_ENTRIES : DESKTOP_ENTRIES
      const cols = mobile ? 2 : 4
      const layout = packLayout(entries, activeFilter.value, cols)

      const cardSlots = CARD_ENTRIES.map(({ key, comp, props }) => {
        const pos = layout[key]

        return h('div', {
          key,
          class: ['grid-slot', pos.dim ? 'grid-slot--dim' : ''],
          style: {
            gridColumn: pos.col,
            gridRow:    pos.row,
          },
          // Dim cards are visual context only — unfocusable, unopenable
          inert: pos.dim || undefined,
          ref: el => { slotEls[key] = el },
        }, [
          h(comp, props || {}),
        ])
      })

      return h('div', [
        h(CursorShape),
        h(CursorTooltip),
        h(NavBar, { onFilterChange }),
        h(BackToTop),
        h('main', { class: 'main' }, [
          h('div', { class: 'mobile-page-logo upa-logo' }, [
            h('span', { class: 'upa-logo-text' }, 'Upa'),
          ]),
          h('div', { class: 'grid' }, cardSlots),
        ]),
      ])
    }
  },
})
