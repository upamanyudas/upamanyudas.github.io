import { defineComponent, h } from 'vue'
import { ICON_EXTERNAL_LINK } from '../../assets/icons/icons.js'
import { profile } from '../../siteData.js'

/**
 * FilmCard — vertical poster card for the two short films, drawn in code.
 *   variant 'forest' → A Forest's Dream (night forest, drifting mist)
 *   variant 'kea'    → The Birds of Play (alpine tussock and snowcaps)
 */

const forestScene = () => h('svg', { class: 'film-svg', viewBox: '0 0 252 522', preserveAspectRatio: 'xMidYMid slice', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': 'true' }, [
  h('defs', null, [
    h('linearGradient', { id: 'afd-sky', x1: '0', y1: '0', x2: '0', y2: '1' }, [
      h('stop', { offset: '0%',  'stop-color': '#10160e' }),
      h('stop', { offset: '55%', 'stop-color': '#233020' }),
      h('stop', { offset: '100%','stop-color': '#3f4a33' }),
    ]),
  ]),
  h('rect', { width: '252', height: '522', fill: 'url(#afd-sky)' }),

  // Stars
  ...[[30, 48, 1.4], [78, 84, 1], [126, 40, 1.6], [180, 70, 1.1], [222, 110, 1.4], [58, 140, 1], [200, 30, 1]].map(([cx, cy, r], i) =>
    h('circle', { class: 'film-star', style: { animationDelay: (i * 0.7) + 's' }, cx, cy, r, fill: '#e8ecd8' })
  ),
  h('circle', { cx: '198', cy: '92', r: '17', fill: '#e8ecd8', opacity: '0.85' }),
  h('circle', { cx: '191', cy: '86', r: '15', fill: '#1a2417' }),

  // Ridgelines of spiky beech canopy — far, mid, near
  h('path', { d: 'M0 268 L18 250 L30 264 L48 240 L62 258 L84 236 L100 256 L122 232 L140 252 L162 234 L180 254 L202 238 L220 256 L238 244 L252 258 L252 522 L0 522 Z', fill: '#4a5639', opacity: '0.8' }),
  h('g', { class: 'film-mist film-mist--far' }, [
    h('ellipse', { cx: '80', cy: '300', rx: '110', ry: '17', fill: '#cfd8c2', opacity: '0.16' }),
    h('ellipse', { cx: '220', cy: '312', rx: '90', ry: '13', fill: '#cfd8c2', opacity: '0.12' }),
  ]),
  h('path', { d: 'M0 340 L22 314 L38 334 L60 306 L78 330 L102 302 L118 326 L144 300 L160 324 L184 304 L200 326 L226 308 L240 328 L252 318 L252 522 L0 522 Z', fill: '#39452c' }),
  h('g', { class: 'film-mist film-mist--near' }, [
    h('ellipse', { cx: '150', cy: '382', rx: '130', ry: '20', fill: '#cfd8c2', opacity: '0.2' }),
    h('ellipse', { cx: '10', cy: '396', rx: '80', ry: '13', fill: '#cfd8c2', opacity: '0.14' }),
  ]),
  h('path', { d: 'M0 428 L26 396 L44 420 L70 388 L90 416 L114 386 L134 412 L158 384 L178 410 L204 390 L222 412 L252 394 L252 522 L0 522 Z', fill: '#242e1c' }),
])

const keaScene = () => h('svg', { class: 'film-svg', viewBox: '0 0 252 522', preserveAspectRatio: 'xMidYMid slice', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': 'true' }, [
  h('defs', null, [
    h('linearGradient', { id: 'bop-sky', x1: '0', y1: '0', x2: '0', y2: '1' }, [
      h('stop', { offset: '0%',  'stop-color': '#cfe0e8' }),
      h('stop', { offset: '100%','stop-color': '#eef3f0' }),
    ]),
  ]),
  h('rect', { width: '252', height: '522', fill: 'url(#bop-sky)' }),
  h('circle', { cx: '206', cy: '64', r: '22', fill: '#f6e7b2', opacity: '0.9' }),

  // Mountains with snow caps
  h('path', { d: 'M-10 330 L74 180 L150 330 Z', fill: '#8a99a4' }),
  h('path', { d: 'M74 180 L96 220 L84 216 L74 232 L62 214 L52 220 Z', fill: '#f4f7f7' }),
  h('path', { d: 'M120 330 L210 200 L290 330 Z', fill: '#a5b2ba' }),
  h('path', { d: 'M210 200 L228 232 L216 226 L208 244 L196 226 L186 230 Z', fill: '#f4f7f7' }),

  // Tussock foreground
  h('path', { d: 'M0 330 C60 314 190 314 252 332 L252 522 L0 522 Z', fill: '#7b7f4e' }),
  h('path', { d: 'M0 380 C80 362 180 366 252 384 L252 522 L0 522 Z', fill: '#4f6151' }),
])

export default defineComponent({
  name: 'FilmCard',

  props: {
    variant: { type: String, required: true },  // 'forest' | 'kea'
  },

  setup(props) {
    const film = profile.films[props.variant]

    return () => h('div', {
      class: `bento-card dark film-card film-${props.variant}-card`,
      'data-tooltip': film.tooltip,
      onClick: () => window.open(film.url, '_blank', 'noopener,noreferrer'),
    }, [
      h('a', {
        class: 'action-icon',
        href: film.url,
        target: '_blank',
        rel: 'noopener noreferrer',
        onClick: (e) => e.stopPropagation(),
      }, [
        h('img', { src: ICON_EXTERNAL_LINK, alt: `Watch ${film.title}` }),
      ]),

      props.variant === 'forest' ? forestScene() : keaScene(),

      h('div', { class: 'film-title-block' }, [
        h('span', { class: 'film-eyebrow' }, 'A short film'),
        h('span', { class: 'film-title' }, film.title),
      ]),
    ])
  },
})
