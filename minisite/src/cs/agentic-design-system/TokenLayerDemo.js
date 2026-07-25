import { defineComponent, h, ref } from 'vue'

/* The three-tier token architecture — the fintech system's colour tokens */
const TOKEN_LAYERS = [
  {
    tier: 'Primitive',
    desc: 'Raw values named by hue + scale. Never used directly in components.',
    tokens: [
      { name: '--color-primitive-slate-100', value: '#eef1f5', color: '#eef1f5' },
      { name: '--color-primitive-navy-700', value: '#1b2a4a', color: '#1b2a4a' },
      { name: '--color-primitive-teal-500', value: '#0f9b8e', color: '#0f9b8e' },
      { name: '--color-primitive-green-600', value: '#2e9e5b', color: '#2e9e5b' },
      { name: '--color-primitive-amber-500', value: '#f0a020', color: '#f0a020' },
      { name: '--color-primitive-red-600', value: '#d13d3d', color: '#d13d3d' },
    ],
  },
  {
    tier: 'Semantic',
    desc: 'Intent-based aliases. Components reference these - they swap in dark mode.',
    tokens: [
      { name: '--color-text-primary', value: '→ Navy/700', color: '#1b2a4a', dark: '→ Slate/100', darkColor: '#eef1f5' },
      { name: '--color-bg-body', value: '→ Slate/100', color: '#eef1f5', dark: '→ Navy/950', darkColor: '#0d1526' },
      { name: '--color-status-positive', value: '→ Green/600', color: '#2e9e5b' },
      { name: '--color-status-attention', value: '→ Amber/500', color: '#f0a020' },
      { name: '--color-status-critical', value: '→ Red/600', color: '#d13d3d' },
    ],
  },
  {
    tier: 'Component',
    desc: 'Scoped to one pattern — the savings figure, the schedule, the advisor badge.',
    tokens: [
      { name: '--color-savings-figure', value: '→ Status/Positive', color: '#2e9e5b' },
      { name: '--color-schedule-due', value: '→ Status/Attention', color: '#f0a020' },
      { name: '--color-schedule-overdue', value: '→ Status/Critical', color: '#d13d3d' },
      { name: '--color-advisor-badge', value: '→ Teal/500', color: '#0f9b8e' },
    ],
  },
]

export default defineComponent({
  name: 'TokenLayerDemo',
  setup() {
    const expanded = ref(null) // which tier is expanded

    function toggle(tier) {
      expanded.value = expanded.value === tier ? null : tier
    }

    // aria-hidden: decorative interactive demo — the prose describes the
    // architecture; this would only leak token names into screen readers.
    return () =>
      h('div', { class: 'ads-token-demo', 'aria-hidden': 'true' }, [
        ...TOKEN_LAYERS.map(layer =>
          h('div', {
            class: ['ads-token-layer', expanded.value === layer.tier ? 'ads-token-layer--open' : ''].filter(Boolean).join(' '),
            key: layer.tier,
          }, [
            h('div', { class: 'ads-token-header', onClick: () => toggle(layer.tier) }, [
              h('div', { class: 'ads-token-tier' }, [
                h('span', { class: 'ads-token-tier-badge' }, layer.tier),
                h('span', { class: 'ads-token-tier-desc' }, layer.desc),
              ]),
              h('span', { class: 'ads-token-chevron' }, expanded.value === layer.tier ? '−' : '+'),
            ]),
            h('div', { class: 'ads-token-rows-wrap' }, [
              h('div', { class: 'ads-token-rows' },
                layer.tokens.map(t =>
                  h('div', { class: 'ads-token-row', key: t.name }, [
                    h('span', {
                      class: 'ads-token-swatch',
                      style: {
                        background: t.color,
                        border: t.color === '#eef1f5' ? '1px solid #d4dae2' : 'none',
                      },
                    }),
                    h('code', { class: 'ads-token-name' }, t.name),
                    h('span', { class: 'ads-token-value' }, t.value),
                    t.dark
                      ? h('span', { class: 'ads-token-dark' }, [
                          h('span', {
                            class: 'ads-token-swatch ads-token-swatch--sm',
                            style: { background: t.darkColor },
                          }),
                          'Dark: ' + t.dark,
                        ])
                      : null,
                  ])
                )
              ),
            ]),
          ])
        ),
      ])
  },
})
