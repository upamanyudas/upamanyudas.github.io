import { defineComponent, h, ref } from 'vue'

/**
 * ComponentSpecPanel — replaces a "Figma description field" screenshot.
 * The same component described twice: the sentence a designer skims, and
 * the spec Figma MCP hands an agent. Toggle between the two readers.
 */
const HUMAN = [
  'StatementCard',
  '',
  'A card that shows a client’s tax position.',
]

const AGENT = [
  'StatementCard',
  '',
  'Surface  --color-surface-card',
  'Border   --color-border-card, 1px',
  'Radius   --radius-lg',
  'Elevation --shadow-sm, --shadow-md on hover',
  '',
  'Props',
  '  status    ontime | due | overdue | filed',
  '  amount    currency, --color-savings-figure',
  '  actedFor  bool → shows AdvisorBadge',
  '',
  'States   default hover focus disabled',
  '         loading empty error',
  'Focus    --color-border-focus, 2px offset',
]

export default defineComponent({
  name: 'ComponentSpecPanel',
  setup() {
    const agentView = ref(true)

    // aria-hidden: decorative demo — the prose makes the same point.
    return () =>
      h('div', { class: 'sp-panel', 'aria-hidden': 'true' }, [
        h('div', { class: 'ta-toggle sp-toggle' }, [
          h('button', {
            class: ['ta-toggle-btn', !agentView.value ? 'ta-toggle-btn--active' : ''].join(' '),
            onClick: () => { agentView.value = false },
          }, 'What a designer skims'),
          h('button', {
            class: ['ta-toggle-btn', agentView.value ? 'ta-toggle-btn--active' : ''].join(' '),
            onClick: () => { agentView.value = true },
          }, 'What the agent reads'),
        ]),

        h('div', { class: 'cd-code sp-code' }, [
          h('div', { class: 'cd-code-title' }, 'Figma → component description'),
          h('pre', { class: 'cd-pre' },
            (agentView.value ? AGENT : HUMAN).map((line, i) =>
              h('span', {
                class: ['cd-line', i === 0 ? 'sp-name' : ''].join(' '),
                key: i,
              }, line || ' ')
            )
          ),
        ]),

        h('p', { class: 'tw-caption sp-caption' }, agentView.value
          ? 'Enough to rebuild the component from words alone — so it stops guessing.'
          : 'True, and completely useless to anything that has to rebuild it.'),
      ])
  },
})
