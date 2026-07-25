import { defineComponent, h } from 'vue'
import CaseStudyOverlay from '../../components/CaseStudyOverlay.js'
import MagneticTokensBg from './MagneticTokensBg.js'

const HERO_SRC = '/minisite/src/assets/images/agentic-hero.svg'

/* Tool marks drawn in code — Figma, Claude, Jekyll */
const logoFigma = () => h('svg', { class: 'ads-card-logo', viewBox: '0 0 24 36', width: 22, xmlns: 'http://www.w3.org/2000/svg' }, [
  h('path', { d: 'M6 0h6v12H6a6 6 0 1 1 0-12Z', fill: '#f24e1e' }),
  h('path', { d: 'M12 0h6a6 6 0 1 1 0 12h-6V0Z', fill: '#ff7262' }),
  h('path', { d: 'M6 12h6v12H6a6 6 0 1 1 0-12Z', fill: '#a259ff' }),
  h('circle', { cx: 18, cy: 18, r: 6, fill: '#1abcfe' }),
  h('path', { d: 'M6 24h6v6a6 6 0 1 1-6-6Z', fill: '#0acf83' }),
])

const logoClaude = () => h('svg', { class: 'ads-card-logo ads-card-logo--claude', viewBox: '0 0 24 24', width: 26, xmlns: 'http://www.w3.org/2000/svg' }, [
  h('path', {
    d: 'M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8Z M19 16l.9 3.1L23 20l-3.1.9L19 24l-.9-3.1L15 20l3.1-.9Z',
    fill: '#D97757',
  }),
])

const logoJekyll = () => h('svg', { class: 'ads-card-logo', viewBox: '0 0 24 24', width: 20, xmlns: 'http://www.w3.org/2000/svg' }, [
  // Test tube tilted — Jekyll's mark, simplified
  h('path', { d: 'M9.2 2.4 14.9 4.5 10 17.8a3 3 0 1 1-5.6-2.1L9.2 2.4Z', fill: '#fdfdfd', stroke: '#b21a2c', 'stroke-width': 1.4 }),
  h('path', { d: 'M7.4 9.6l4.4 1.6-1.8 4.9a2 2 0 1 1-4.3-1.6l1.7-4.9Z', fill: '#b21a2c' }),
  h('circle', { cx: 17.6, cy: 7, r: 1.4, fill: '#b21a2c' }),
])

const cardFace = () => h('div', { class: 'ads-card-face' }, [
  h('div', { class: 'ads-card-logos' }, [
    h('div', { class: 'ads-card-logo-wrap' }, [logoJekyll()]),
    h('div', { class: 'ads-card-logo-wrap' }, [logoClaude()]),
    h('div', { class: 'ads-card-logo-wrap' }, [logoFigma()]),
  ]),
  h('p', { class: 'ads-card-title' }, 'Agentic\nDesign\nSystem'),
])

export default defineComponent({
  name: 'AgenticDSCard',
  setup() {
    return () =>
      h(CaseStudyOverlay, {
        cardKey: 'agenticds',
        cardClass: 'agentic-ds-card',
        imageSrc: HERO_SRC,
        imageClass: 'ads-hero-img',
        heroWrapClass: 'ads-hero-wrap',
        heroSize: 448,
      }, {
        // Collapsed card face: canvas bg + logos + pixel title
        default: () => [
          h(MagneticTokensBg),
          cardFace(),
        ],

        // Expanded hero: live canvas + face on top of the flat hero
        heroOverlay: () => h('div', { class: 'ads-hero-overlay' }, [
          h(MagneticTokensBg),
          cardFace(),
        ]),

        // Fly content: face rides the flying element during the transition
        flyContent: () => h('div', { class: 'ads-fly-overlay' }, [
          h('div', { class: 'ads-card-logos' }, [
            h('div', { class: 'ads-card-logo-wrap' }, [logoJekyll()]),
            h('div', { class: 'ads-card-logo-wrap' }, [logoClaude()]),
            h('div', { class: 'ads-card-logo-wrap' }, [logoFigma()]),
          ]),
          h('p', { class: 'ads-card-title' }, 'Agentic\nDesign\nSystem'),
        ]),
      })
  },
})
