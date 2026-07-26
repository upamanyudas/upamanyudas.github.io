import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'
import CaseStudyOverlay from '../../components/CaseStudyOverlay.js'
import FilmStripBg from './FilmStripBg.js'

const HERO_SRC = '/minisite/src/assets/images/reviews-hero.svg'

const HEART = 'M12 20s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 4.65-7 9-7 9Z'

/** The slider that shipped, sweeping on its own. */
const SweepSlider = defineComponent({
  name: 'SweepSlider',
  setup() {
    const pct = ref(60)
    let raf = null, t = 0

    onMounted(() => {
      const tick = () => {
        t += 0.012
        pct.value = Math.round((0.52 + 0.34 * Math.sin(t)) * 10) * 10
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    })
    onUnmounted(() => cancelAnimationFrame(raf))

    return () => h('div', { class: 'rv-card-slider' }, [
      h('span', { class: 'rv-card-track' }, [
        h('span', { class: 'rv-card-fill', style: { width: `${pct.value}%` } }),
        h('svg', { class: 'rv-card-thumb', viewBox: '0 0 24 24', width: 22, height: 22, style: { left: `${pct.value}%` } },
          [h('path', { d: HEART, fill: 'currentColor' })]),
      ]),
      h('em', { class: 'rv-card-pct' }, `${pct.value}%`),
    ])
  },
})

const cardFace = () => h('div', { class: 'rv-card-face' }, [
  h(SweepSlider),
  h('p', { class: 'rv-card-title' }, 'A review in\nnine seconds'),
])

export default defineComponent({
  name: 'ReviewsCard',
  setup() {
    return () =>
      h(CaseStudyOverlay, {
        cardKey: 'reviews',
        cardClass: 'reviews-card',
        imageSrc: HERO_SRC,
        imageClass: 'rv-hero-img',
        heroWrapClass: 'rv-hero-wrap',
        heroSize: 448,
      }, {
        default:     () => [h(FilmStripBg), cardFace()],
        heroOverlay: () => h('div', { class: 'rv-hero-overlay' }, [h(FilmStripBg), cardFace()]),
        flyContent:  () => h('div', { class: 'rv-fly-overlay' }, [cardFace()]),
      })
  },
})
