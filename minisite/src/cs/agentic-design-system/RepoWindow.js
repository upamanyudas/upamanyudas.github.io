import { defineComponent, h } from 'vue'

const REPO_URL = 'https://github.com/upamanyudas/upamanyudas.github.io'

/** RepoWindow — the receipts. A browser-window frame around the actual
 *  content architecture, linking to the source. No screenshot involved. */
const TREE = [
  { path: '_case_studies/agentic-design-system.md', note: 'this very page, as markdown' },
  { path: '_data/minisite/layouts.yml',             note: 'the grid, as data' },
  { path: '_data/minisite/profile.yml',             note: 'the words, as data' },
  { path: 'minisite/src/styles/tokens.css',         note: '305 tokens, three layers' },
  { path: 'minisite/src/cs/agentic-design-system/', note: 'every figure here, as code' },
]

export default defineComponent({
  name: 'RepoWindow',
  setup() {
    return () =>
      h('a', {
        class: 'ads-browser-window cs-cover-img cs-cover-img--full',
        href: REPO_URL,
        target: '_blank',
        rel: 'noopener noreferrer',
      }, [
        h('div', { class: 'ads-browser-bar' }, [
          h('div', { class: 'ads-browser-dots' }, [
            h('span', { class: 'ads-browser-dot ads-browser-dot--red' }),
            h('span', { class: 'ads-browser-dot ads-browser-dot--yellow' }),
            h('span', { class: 'ads-browser-dot ads-browser-dot--green' }),
          ]),
          h('div', { class: 'ads-browser-address' }, 'github.com/upamanyudas'),
        ]),
        h('div', { class: 'ads-browser-viewport rw-viewport' }, [
          h('div', { class: 'rw-tree' },
            TREE.map(f =>
              h('div', { class: 'rw-row', key: f.path }, [
                h('code', { class: 'rw-path' }, f.path),
                h('span', { class: 'rw-note' }, f.note),
              ])
            )
          ),
          h('div', { class: 'ads-browser-overlay' }, [
            h('span', { class: 'ads-browser-cta' }, [
              'Read the source',
              h('svg', { width: '16', height: '16', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'ads-browser-icon' }, [
                h('path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }),
                h('polyline', { points: '15 3 21 3 21 9' }),
                h('line', { x1: '10', y1: '14', x2: '21', y2: '3' }),
              ]),
            ]),
          ]),
        ]),
      ])
  },
})
