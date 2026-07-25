import { defineComponent, h, ref, computed } from 'vue'

/**
 * Exclusions — the three edges the product is actually judged on. All three were
 * being handled as errors at the point of failure; all three moved upstream into
 * a stated exclusion with a reason and a way back.
 */
const EDGES = [
  {
    key: 'deadline',
    trip: 'One taxpayer is past the IRD deadline for pooling this year',
    banner: 'Some taxpayers have passed the IRD deadline for tax pooling for the selected year. These taxpayers will not be included in the optimisation.',
    where: 'Step one, the moment the year is chosen',
    fix: 'Not fixable — it is statute. So the only useful design is to say it early, name the taxpayers, and never let the accountant discover it at step three.',
    tone: 'hard',
  },
  {
    key: 'future',
    trip: 'Three tax dates fall after today',
    banner: 'Amounts due at IRD for tax dates after 15/07/2023 have been excluded from the optimisation. Further actions and payments may be required.',
    where: 'Step two, footnoted against the affected totals',
    fix: 'Reversible. The preference on step one flips it, and the summary carries an asterisk pointing back there — because a number that quietly excludes something is worse than a slightly busier number.',
    tone: 'soft',
  },
  {
    key: 'incomplete',
    trip: 'Three entities are Not Started or Incomplete',
    banner: '3 taxpayers in this group have the status Not Started or Incomplete. Continue to exclude these taxpayers and update their status.',
    where: 'A modal between step two and step three',
    fix: 'Deliberately interruptive, and the only modal in the flow. Excluding an entity from a group filing is a decision with consequences, so it gets a decision-shaped interaction rather than a footnote.',
    tone: 'ask',
  },
]

export default defineComponent({
  name: 'Exclusions',
  setup() {
    const on = ref({ deadline: true, future: false, incomplete: false })
    const live = computed(() => EDGES.filter(e => on.value[e.key]))

    return () =>
      h('div', { class: 'go-edges' }, [
        h('div', { class: 'go-edge-switches' }, EDGES.map(e =>
          h('button', {
            key: e.key,
            class: ['cs-chip', on.value[e.key] ? 'cs-chip--on' : ''].join(' '),
            onClick: () => { on.value = { ...on.value, [e.key]: !on.value[e.key] } },
          }, e.trip)
        )),

        h('div', { class: 'go-edge-stage' },
          live.value.length
            ? live.value.map(e =>
                h('div', { key: e.key, class: `go-banner go-banner--${e.tone}` }, [
                  h('p', { class: 'go-banner-text' }, e.banner),
                  h('p', { class: 'go-banner-where' }, [h('strong', null, 'Surfaced: '), e.where]),
                  h('p', { class: 'go-banner-fix' }, e.fix),
                ])
              )
            : [h('p', { class: 'go-edge-empty' }, 'A clean group — every entity finished, every date in the past, nobody past deadline. It happens, and the screen should look calm when it does.')]
        ),
      ])
  },
})
