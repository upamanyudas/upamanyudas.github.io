import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'
import CaseStudyOverlay from '../../components/CaseStudyOverlay.js'
import DriftBg from '../shared/DriftBg.js'

const HERO_SRC = '/minisite/src/assets/images/optimiser-hero.svg'

/* A group's positions, drifting — some short, some over */
const ITEMS = [
  '−248,400', '+92,600', '−61,250', '+145,900', '−18,900', '+12,670',
  '+40,000', '+25,000', '−12,380',
].map(label => ({ label, kind: 'num' }))
  .concat(['transfer in', 'transfer out', 'purchase', 'sale', 'pool balance', '75 days']
    .map(label => ({ label, kind: 'pill' })))

/** Positions netting off to zero, over and over. */
const NettingBars = defineComponent({
  name: 'NettingBars',
  setup() {
    const t = ref(0)
    let raf = null

    onMounted(() => {
      const tick = () => { t.value += 0.01; raf = requestAnimationFrame(tick) }
      raf = requestAnimationFrame(tick)
    })
    onUnmounted(() => cancelAnimationFrame(raf))

    return () => h('div', { class: 'go-card-bars' },
      [0, 1, 2, 3, 4, 5].map(i => {
        const v = Math.sin(t.value + i * 0.9)
        return h('span', {
          key: i,
          class: ['go-card-bar', v < 0 ? 'go-card-bar--neg' : ''].join(' '),
          style: { height: `${12 + Math.abs(v) * 26}px` },
        })
      })
    )
  },
})

const cardFace = () => h('div', { class: 'go-card-face' }, [
  h(NettingBars),
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
        default:     () => [h(DriftBg, { items: ITEMS }), cardFace()],
        heroOverlay: () => h('div', { class: 'go-hero-overlay' }, [h(DriftBg, { items: ITEMS }), cardFace()]),
        flyContent:  () => h('div', { class: 'go-fly-overlay' }, [cardFace()]),
      })
  },
})
