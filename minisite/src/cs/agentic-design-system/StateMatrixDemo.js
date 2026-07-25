import { defineComponent, h, ref } from 'vue'

/**
 * StateMatrixDemo — the completeness argument, as a live matrix.
 * A payment row in all seven states, each bound to the token that drives it.
 * Leave one blank and the agent invents it; this is the alternative.
 */
const STATES = [
  { name: 'default',  token: '--color-surface-card',      dot: '#8a94a6', label: '15 Jan · $12,400' },
  { name: 'hover',    token: '--color-surface-card-hover', dot: '#8a94a6', label: '15 Jan · $12,400' },
  { name: 'focus',    token: '--color-border-focus',      dot: '#0f9b8e', label: '15 Jan · $12,400' },
  { name: 'ontime',   token: '--color-status-positive',   dot: '#2e9e5b', label: 'Paid · $12,400' },
  { name: 'due',      token: '--color-schedule-due',      dot: '#f0a020', label: 'Due in 6 days' },
  { name: 'overdue',  token: '--color-schedule-overdue',  dot: '#d13d3d', label: 'Overdue · 11 days' },
  { name: 'disabled', token: '--color-text-disabled',     dot: '#c3cad4', label: 'Not yet authorised' },
]

export default defineComponent({
  name: 'StateMatrixDemo',
  setup() {
    const active = ref('due')

    // aria-hidden: decorative demo — the prose lists the same states.
    return () =>
      h('div', { class: 'sm-matrix', 'aria-hidden': 'true' }, [
        h('div', { class: 'sm-tabs' },
          STATES.map(s =>
            h('button', {
              class: ['sm-tab', active.value === s.name ? 'sm-tab--active' : ''].join(' '),
              key: s.name,
              onClick: () => { active.value = s.name },
            }, s.name)
          )
        ),

        h('div', { class: 'sm-stage' },
          STATES.filter(s => s.name === active.value).map(s =>
            h('div', {
              class: `sm-row sm-row--${s.name}`,
              key: s.name,
              style: { '--sm-accent': s.dot },
            }, [
              h('span', { class: 'sm-row-dot' }),
              h('span', { class: 'sm-row-label' }, s.label),
              h('span', { class: 'sm-row-chevron' }, '›'),
            ])
          )
        ),

        h('p', { class: 'sm-note' }, [
          'Driven by ',
          h('code', null, STATES.find(s => s.name === active.value).token),
        ]),
      ])
  },
})
