import { defineComponent, h } from 'vue'
import CaseStudyOverlay from '../../components/CaseStudyOverlay.js'

/* The pitch film itself is the hero — trimmed, muted, looping. Poster covers the first frame. */
const VIDEO_SRC  = '/minisite/src/assets/video/ticketing-hero.mp4'
const POSTER_SRC = '/minisite/src/assets/video/ticketing-hero-poster.jpg'

/* The four-tab shell, drawn as the mark for the study */
const TABS = [
  { label: 'Home',  d: 'M3 10.5 12 3l9 7.5V21H3z' },
  { label: 'Store', d: 'M4 8h16l-1.2 12H5.2ZM9 8V6a3 3 0 0 1 6 0v2' },
  { label: 'Buzz',  d: 'M4 11l12-6v14L4 13Zm0 0v3m12-6a3 3 0 0 1 0 6' },
  { label: 'You',   d: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0' },
]

const tabBar = () => h('div', { class: 'tk-card-tabs' },
  TABS.map((t, i) =>
    h('span', { key: t.label, class: ['tk-card-tab', i === 2 ? 'tk-card-tab--on' : ''].join(' ') }, [
      h('svg', {
        viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none',
        stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      }, [h('path', { d: t.d })]),
      h('em', null, t.label),
    ])
  )
)

/* Scrim rides with the face everywhere — the film underneath is bright and busy. */
const cardFace = () => [
  h('span', { class: 'tk-card-scrim' }),
  h('div', { class: 'tk-card-face' }, [
    h('p', { class: 'tk-card-title' }, 'Re-envisioning\na mass ticketing\nplatform'),
    h('p', { class: 'tk-card-count' }, ['50M opened it. ', h('strong', null, '10M'), ' bought a seat.']),
    tabBar(),
  ]),
]

export default defineComponent({
  name: 'TicketingCard',
  setup() {
    return () =>
      h(CaseStudyOverlay, {
        cardKey: 'ticketing',
        cardClass: 'ticketing-card',
        videoSrc: VIDEO_SRC,
        imageSrc: POSTER_SRC,
        imageClass: 'tk-hero-img',
        heroWrapClass: 'tk-hero-wrap',
        heroSize: 448,
      }, {
        default:     () => cardFace(),
        heroOverlay: () => h('div', { class: 'tk-hero-overlay' }, cardFace()),
        flyContent:  () => h('div', { class: 'tk-fly-overlay' }, cardFace()),
      })
  },
})
