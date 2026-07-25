import { defineComponent, h, ref } from 'vue'

/**
 * AudienceSplit — fifty dots, one per million monthly actives.
 * The whole pitch in one picture: ten of them were the business, forty were the brief.
 */
const SEGMENTS = [
  {
    key: 'bookers', label: 'Bookers', value: '10M',
    line: 'buy at least one ticket a month',
    lever: 'The business, entirely. Every instinct said optimise here — and every point of conversion left was going to cost more than the last.',
    from: 0, to: 10,
  },
  {
    key: 'dreamers', label: 'Dreamers', value: '40M',
    line: 'open the app and buy nothing',
    lever: 'Four out of five people, showing up for something we did not sell. Content, recommendations and merch gave them a reason to stay — and put us in the room on the week a seat became affordable.',
    from: 10, to: 50,
  },
  {
    key: 'all', label: 'Everyone', value: '50M',
    line: 'monthly actives, one of the largest entertainment audiences anywhere',
    lever: 'One audience on the dashboard, two audiences in reality. Treating them as one is what kept the roadmap stuck on the funnel for a decade.',
    from: 0, to: 50,
  },
]

export default defineComponent({
  name: 'AudienceSplit',
  setup() {
    const active = ref('dreamers')
    const seg = () => SEGMENTS.find(s => s.key === active.value)

    return () =>
      h('div', { class: 'tk-split' }, [
        h('div', { class: 'cs-tabs' },
          SEGMENTS.map(s =>
            h('button', {
              key: s.key,
              class: ['cs-tab', active.value === s.key ? 'cs-tab--on' : ''].join(' '),
              onClick: () => { active.value = s.key },
            }, s.label)
          )
        ),

        h('div', { class: 'tk-dots', 'aria-hidden': 'true' },
          Array.from({ length: 50 }, (_, i) =>
            h('span', {
              key: i,
              class: ['tk-dot', i >= seg().from && i < seg().to ? 'tk-dot--on' : ''].join(' '),
              style: { transitionDelay: `${(i % 10) * 14}ms` },
            })
          )
        ),

        h('p', { class: 'tk-split-stat' }, [
          h('strong', null, seg().value),
          ' ' + seg().line,
        ]),
        h('p', { class: 'tk-split-lever' }, seg().lever),
        h('p', { class: 'cs-note' }, 'One dot = one million monthly actives.'),
      ])
  },
})
