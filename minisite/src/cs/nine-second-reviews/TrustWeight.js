import { defineComponent, h, ref, computed } from 'vue'

/**
 * TrustWeight — what "Booked on the app" is actually worth. Four words on the
 * surface, a weighting on the aggregate, and a flag on the shapes a campaign makes.
 */
const VOTES = [
  { who: 'A. Bose',    pct: 70, booked: true },
  { who: 'S. Iyer',    pct: 80, booked: true },
  { who: 'R. Khan',    pct: 60, booked: true },
  { who: 'M. Pillai',  pct: 90, booked: true },
  { who: 'D. Sharma',  pct: 70, booked: true },
  { who: 'user_88213', pct: 100, booked: false, burst: true },
  { who: 'user_88219', pct: 100, booked: false, burst: true },
  { who: 'user_88224', pct: 100, booked: false, burst: true },
  { who: 'K. Mehta',   pct: 20, booked: false },
]

export default defineComponent({
  name: 'TrustWeight',
  setup() {
    const weighted = ref(false)
    const flagging = ref(false)

    const score = computed(() => {
      let sum = 0, n = 0
      VOTES.forEach(v => {
        if (flagging.value && v.burst) return
        const w = weighted.value && v.booked ? 3 : 1
        sum += v.pct * w
        n += w
      })
      return n ? Math.round(sum / n) : 0
    })

    const toggle = (model, label, sub) => h('button', {
      class: ['rv-toggle', model.value ? 'rv-toggle--on' : ''].join(' '),
      onClick: () => { model.value = !model.value },
      'aria-pressed': String(model.value),
    }, [
      h('span', { class: 'rv-toggle-switch' }),
      h('span', { class: 'rv-toggle-copy' }, [h('strong', null, label), h('em', null, sub)]),
    ])

    return () =>
      h('div', { class: 'rv-trust' }, [
        h('div', { class: 'rv-trust-head' }, [
          h('span', { class: 'rv-trust-score' }, `${score.value}%`),
          h('span', { class: 'rv-trust-caption' }, 'headline rating, from the nine votes below'),
        ]),

        h('div', { class: 'rv-trust-toggles' }, [
          toggle(weighted, 'Weight verified ticket-holders', 'A rating from someone who sat in the seat counts for more.'),
          toggle(flagging, 'Flag campaign patterns', 'Burst timing, identical values, accounts with one interest.'),
        ]),

        h('ul', { class: 'rv-trust-list' }, VOTES.map(v => {
          const cut = flagging.value && v.burst
          return h('li', {
            key: v.who,
            class: ['rv-trust-row', cut ? 'rv-trust-row--cut' : '',
              weighted.value && v.booked ? 'rv-trust-row--heavy' : ''].filter(Boolean).join(' '),
          }, [
            h('span', { class: 'rv-trust-who' }, v.who),
            v.booked
              ? h('span', { class: 'rv-trust-badge' }, 'Booked on the app')
              : h('span', { class: 'rv-trust-badge rv-trust-badge--none' }, cut ? 'Flagged for review' : 'Unverified'),
            h('span', { class: 'rv-trust-pct' }, `${v.pct}%`),
            weighted.value && v.booked && !cut ? h('span', { class: 'rv-trust-weight' }, '×3') : null,
          ])
        })),

        h('p', { class: 'cs-note' },
          'Turn both on and the headline drops six points — because three of the nine were one campaign, and the platform had been quoting them as public opinion.'),
      ])
  },
})
