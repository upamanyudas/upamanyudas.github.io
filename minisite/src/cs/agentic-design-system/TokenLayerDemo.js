import { defineComponent, h, ref } from 'vue'

/* The three-tier token architecture — populated with this site's real tokens */
const TOKEN_LAYERS = [
  {
    tier: 'Primitive',
    desc: 'Raw values named by hue + scale. Never used directly in components.',
    tokens: [
      { name: '--color-primitive-warm-100', value: '#f0ede8', color: '#f0ede8' },
      { name: '--color-primitive-teal-500', value: '#008B8B', color: '#008B8B' },
      { name: '--color-primitive-purple-600', value: '#7c5cfc', color: '#7c5cfc' },
      { name: '--color-primitive-neutral-750', value: '#2c2c2c', color: '#2c2c2c' },
      { name: '--color-primitive-indigo-100', value: '#e0e0ea', color: '#e0e0ea' },
      { name: '--color-primitive-forest-600', value: '#6e7a50', color: '#6e7a50' },
    ],
  },
  {
    tier: 'Semantic',
    desc: 'Intent-based aliases. Components reference these - they swap in dark mode.',
    tokens: [
      { name: '--color-text-primary', value: '→ Neutral/750', color: '#2c2c2c', dark: '→ Indigo/100', darkColor: '#e0e0ea' },
      { name: '--color-bg-body', value: '→ Warm/100', color: '#f0ede8', dark: '→ Indigo/950', darkColor: '#0e0e18' },
      { name: '--color-primary', value: '→ Teal/500', color: '#008B8B' },
      { name: '--gradient-brand', value: 'Teal/500 → Purple/600', color: 'linear-gradient(135deg, #008B8B, #7c5cfc)' },
    ],
  },
  {
    tier: 'Component',
    desc: 'Scoped to specific UI patterns like cards, panels and the film posters.',
    tokens: [
      { name: '--color-surface-claude', value: '→ Orange/Claude', color: '#D97757' },
      { name: '--color-widget-bg', value: '→ Neutral/880', color: '#1e1e1e' },
      { name: '--color-brand-kea-orange', value: '→ Kea/Orange', color: '#e8632c' },
      { name: '--color-panel-focus', value: '→ Blue/Focus', color: '#589df6' },
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
                        border: t.color === '#ffffff' || t.color === '#f0ede8' || t.color === '#e0e0ea' ? '1px solid #e0e0e0' : 'none',
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
