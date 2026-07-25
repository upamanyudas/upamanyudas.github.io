import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'
import CaseStudyOverlay from '../../components/CaseStudyOverlay.js'
import LedgerGridBg from './LedgerGridBg.js'

const HERO_SRC = '/minisite/src/assets/images/optimiser-hero.svg'

/* A group's gross positions; running subtotals swing, the net lands small */
const POSITIONS = [-248400, 145900, 92600, -61250, 40000, -18900, 25000, 12670, 14760]
const CUM = POSITIONS.reduce((a, n) => [...a, a[a.length - 1] + n], [0])
const NET = CUM[CUM.length - 1]                       // +2,380 — netted to a small credit
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches
const fmt = n => (n < 0 ? '−' : '+') + Math.abs(n).toLocaleString('en-US')

/** One pass: gross positions tally fast, then resolve to the small net. */
const NetCounter = defineComponent({
  name: 'NetCounter',
  setup() {
    const t = ref(REDUCED ? 0.75 : 0)
    let raf = null

    onMounted(() => {
      if (REDUCED) return
      const tick = () => { t.value = (t.value + 0.006) % 1; raf = requestAnimationFrame(tick) }
      raf = requestAnimationFrame(tick)
    })
    onUnmounted(() => cancelAnimationFrame(raf))

    return () => {
      const tallying = t.value < 0.6
      const k = 1 + Math.floor((t.value / 0.6) * (POSITIONS.length - 1))
      const val = tallying ? CUM[Math.min(k, POSITIONS.length - 1)] : NET
      const cls = ['go-net-val', tallying ? '' : (NET < 0 ? 'go-net-val--neg' : 'go-net-val--pos')]

      return h('div', { class: 'go-card-net' }, [
        h('span', { class: 'go-net-cap' }, tallying ? 'optimising…' : 'net position'),
        h('span', { class: cls.filter(Boolean).join(' ') }, fmt(val)),
      ])
    }
  },
})

const cardFace = () => h('div', { class: 'go-card-face' }, [
  h(NetCounter),
  h('p', { class: 'go-card-title' }, 'Group\nOptimiser'),
  h('p', { class: 'go-card-sub' }, 'a whole group’s tax position,\nnetted in one pass'),
])

export default defineComponent({
  name: 'OptimiserCard',
  setup() {
    return () =>
      h(CaseStudyOverlay, {
        cardKey: 'optimiser',
        cardClass: 'optimiser-card',
        imageSrc: HERO_SRC,
        imageClass: 'go-hero-img',
        heroWrapClass: 'go-hero-wrap',
        heroSize: 448,
      }, {
        default:     () => [h(LedgerGridBg), cardFace()],
        heroOverlay: () => h('div', { class: 'go-hero-overlay' }, [h(LedgerGridBg), cardFace()]),
        flyContent:  () => h('div', { class: 'go-fly-overlay' }, [cardFace()]),
      })
  },
})
