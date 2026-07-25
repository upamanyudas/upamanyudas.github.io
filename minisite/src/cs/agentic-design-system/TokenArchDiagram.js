import { defineComponent, h, ref } from 'vue'

/**
 * TokenArchDiagram — replaces a static architecture screenshot.
 * Shows the alias chain primitive → semantic → component, and lets you
 * flip the theme to watch the semantic layer re-point live.
 */
const ROWS = [
  {
    semantic: '--color-bg-body',
    component: 'body',
    light: { name: 'Slate/100',  hex: '#eef1f5' },
    dark:  { name: 'Navy/950',   hex: '#0d1526' },
  },
  {
    semantic: '--color-text-primary',
    component: '.savings-figure',
    light: { name: 'Navy/700',   hex: '#1b2a4a' },
    dark:  { name: 'Slate/100',  hex: '#eef1f5' },
  },
  {
    semantic: '--color-surface-card',
    component: '.payment-schedule',
    light: { name: 'Slate/25',   hex: '#fbfcfd' },
    dark:  { name: 'Navy/800',   hex: '#152038' },
  },
]

export default defineComponent({
  name: 'TokenArchDiagram',
  setup() {
    const dark = ref(false)

    return () =>
      h('div', { class: 'ta-diagram', 'aria-hidden': 'true' }, [
        h('div', { class: 'ta-head' }, [
          h('div', { class: 'ta-col-labels' }, [
            h('span', null, 'Primitive'),
            h('span', null, 'Semantic'),
            h('span', null, 'Component'),
          ]),
          h('div', { class: 'ta-toggle' }, [
            h('button', {
              class: ['ta-toggle-btn', !dark.value ? 'ta-toggle-btn--active' : ''].join(' '),
              onClick: () => { dark.value = false },
            }, 'Light'),
            h('button', {
              class: ['ta-toggle-btn', dark.value ? 'ta-toggle-btn--active' : ''].join(' '),
              onClick: () => { dark.value = true },
            }, 'Dark'),
          ]),
        ]),

        ...ROWS.map(row => {
          const prim = dark.value ? row.dark : row.light
          return h('div', { class: 'ta-row', key: row.semantic }, [
            h('span', { class: 'ta-chip ta-chip--primitive' }, [
              h('span', { class: 'ta-swatch', style: { background: prim.hex } }),
              h('span', { class: 'ta-chip-label' }, prim.name),
            ]),
            h('span', { class: 'ta-arrow' }, '→'),
            h('code', { class: 'ta-chip ta-chip--semantic' }, row.semantic),
            h('span', { class: 'ta-arrow' }, '→'),
            h('code', { class: 'ta-chip ta-chip--component' }, row.component),
          ])
        }),

        h('p', { class: 'ta-note' }, dark.value
          ? 'Dark mode: only the semantic bindings changed. No component was edited.'
          : 'Every component resolves through the semantic layer — nothing holds a raw hex.'),
      ])
  },
})
