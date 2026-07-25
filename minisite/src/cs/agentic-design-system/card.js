import { defineComponent, h } from 'vue'
import CaseStudyOverlay from '../../components/CaseStudyOverlay.js'
import MagneticTokensBg from './MagneticTokensBg.js'

const HERO_SRC = '/minisite/src/assets/images/agentic-hero.svg'

/* Tool marks drawn in code — Storybook, Figma, Claude */
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

// Official mark from storybookjs/brand — coral panel, S, corner bookmark
const logoStorybook = () => h('svg', { class: 'ads-card-logo', viewBox: '0 0 52 64', width: 26, xmlns: 'http://www.w3.org/2000/svg' }, [
  h('g', { transform: 'translate(1 1)' }, [
    h('path', { fill: '#FF4785', d: 'M50.2729096,2.92285771 C50.2769973,2.98759391 50.2790429,3.05244063 50.2790429,3.11730315 L50.2790429,58.8828028 C50.2790429,60.6043831 48.8689636,62 47.1295431,62 C47.0824212,62 47.0353056,61.9989534 46.9882313,61.9968606 L4.94876437,60.1280997 C3.31149338,60.0553189 2.00425692,58.751918 1.94279175,57.1309472 L0.0022554267,5.95476663 C-0.0618328758,4.26461814 1.24754196,2.83223697 2.95307926,2.72673418 L37.427,0.594 L37.1272753,7.62078766 C37.1238721,7.70179664 37.1419373,7.78178731 37.179031,7.85305525 L37.2223772,7.92113026 C37.3791917,8.12573637 37.6738999,8.16578288 37.880626,8.0105767 L40.6382617,5.94019678 L42.9673936,7.75618537 C43.0546693,7.82423279 43.1634862,7.85946584 43.2745216,7.85562813 C43.5338374,7.84666553 43.7367132,7.6313391 43.7276576,7.37468316 L43.4674595,0.218291667 L46.9330824,0.00617628491 C48.6691159,-0.10121296 50.1644074,1.2046298 50.2729096,2.92285771 Z' }),
    h('path', { fill: '#fff', d: 'M29.4029796,23.368648 C29.4029796,24.58142 37.6567008,24.00017 38.7646901,23.1482813 C38.7646901,14.8895929 34.2873503,10.5497821 26.0885852,10.5497821 C17.88982,10.5497821 13.2961856,14.9571143 13.2961856,21.5681161 C13.2961856,33.0822778 28.9959487,33.3026444 28.9959487,39.5830962 C28.9959487,41.3460299 28.1237396,42.3927719 26.2048797,42.3927719 C23.7045471,42.3927719 22.7160434,41.1289316 22.832338,36.8317805 C22.832338,35.8995698 13.2961856,35.6089448 13.0054493,36.8317805 C12.2651161,47.2453073 18.8201763,50.248968 26.3211742,50.248968 C33.5895831,50.248968 39.2880157,46.4144645 39.2880157,39.4729126 C39.2880157,27.132376 23.3556634,27.4629261 23.3556634,21.3477494 C23.3556634,18.8686237 25.2163761,18.5380737 26.3211742,18.5380737 C27.4841196,18.5380737 29.5774214,18.7409467 29.4029796,23.368648 Z' }),
    h('path', { fill: '#fff', d: 'M37.1272753,7.62078766 L37.4276823,0.591583333 L43.4674595,0.218291667 L43.7276576,7.37468316 C43.7367132,7.6313391 43.5338374,7.84666553 43.2745216,7.85562813 C43.1634862,7.85946584 43.0546693,7.82423279 42.9673936,7.75618537 L40.6382617,5.94019678 L37.880626,8.0105767 C37.6738999,8.16578288 37.3791917,8.12573637 37.2223772,7.92113026 C37.1563661,7.83500129 37.1227378,7.72879963 37.1272753,7.62078766 Z' }),
  ]),
])

const cardFace = () => h('div', { class: 'ads-card-face' }, [
  h('div', { class: 'ads-card-logos' }, [
    h('div', { class: 'ads-card-logo-wrap' }, [logoStorybook()]),
    h('div', { class: 'ads-card-logo-wrap' }, [logoFigma()]),
    h('div', { class: 'ads-card-logo-wrap' }, [logoClaude()]),
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
            h('div', { class: 'ads-card-logo-wrap' }, [logoStorybook()]),
            h('div', { class: 'ads-card-logo-wrap' }, [logoFigma()]),
            h('div', { class: 'ads-card-logo-wrap' }, [logoClaude()]),
          ]),
          h('p', { class: 'ads-card-title' }, 'Agentic\nDesign\nSystem'),
        ]),
      })
  },
})
