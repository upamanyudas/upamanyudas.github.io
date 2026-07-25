import { defineComponent, h } from 'vue'

/** FigmaSourcePanel — the two canonical files, as a browser frame rather
 *  than a screenshot. Split so an agent queries one, not both. */
const FILES = [
  { path: 'Tokens · Primitive',   note: 'raw values, hue + scale' },
  { path: 'Tokens · Semantic',    note: 'intent aliases, light + dark pairs' },
  { path: 'Library · Components', note: '26, each with an agent-readable spec' },
  { path: 'Library · States',     note: 'every state drawn, none inferred' },
  { path: 'MCP',                  note: 'how the agent reads both files' },
]

export default defineComponent({
  name: 'FigmaSourcePanel',
  setup() {
    return () =>
      h('div', { class: 'ads-browser-window cs-cover-img cs-cover-img--full' }, [
        h('div', { class: 'ads-browser-bar' }, [
          h('div', { class: 'ads-browser-dots' }, [
            h('span', { class: 'ads-browser-dot ads-browser-dot--red' }),
            h('span', { class: 'ads-browser-dot ads-browser-dot--yellow' }),
            h('span', { class: 'ads-browser-dot ads-browser-dot--green' }),
          ]),
          h('div', { class: 'ads-browser-address' }, 'figma.com — two files, one source of truth'),
        ]),
        h('div', { class: 'ads-browser-viewport rw-viewport' }, [
          h('div', { class: 'rw-tree' },
            FILES.map(f =>
              h('div', { class: 'rw-row', key: f.path }, [
                h('code', { class: 'rw-path' }, f.path),
                h('span', { class: 'rw-note' }, f.note),
              ])
            )
          ),
        ]),
      ])
  },
})
