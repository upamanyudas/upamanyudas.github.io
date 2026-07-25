import { defineComponent, h, ref } from 'vue'

/**
 * PaymentPlans — step three. Three genuinely different cost profiles, shown as
 * small multiples on one shared scale rather than hidden in a dropdown. This is
 * the only decision on the screen that is about cash flow, not tax position.
 */
const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

const PLANS = [
  {
    key: 'flexi', name: 'Flexitax',
    blurb: 'Pay what you want, when you want. Each payment goes toward the tax and the interest accrued so far, and you can vary it as cash allows.',
    who: 'Lumpy revenue, or a client who genuinely does not know what next quarter looks like.',
    profile: [18, 6, 4, 22, 9, 3, 14, 7, 5, 19, 8, 12],
  },
  {
    key: 'finance', name: 'Finance plan',
    blurb: 'A fixed fee agreed up front, with the tax itself payable at set future dates. You know the total on day one and it does not move.',
    who: 'Clients who need certainty on the number more than flexibility on the timing.',
    profile: [12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 62],
  },
  {
    key: 'custom', name: 'Custom plan',
    blurb: 'Build an instalment arrangement and compare the options side by side before committing to one.',
    who: 'A group settling a large residual, where an even spread is easier to sign off internally.',
    profile: [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
  },
]

export default defineComponent({
  name: 'PaymentPlans',
  setup() {
    const picked = ref('flexi')

    // One shared scale across all three, so the shapes are honestly comparable.
    const max = Math.max(...PLANS.flatMap(p => p.profile))

    return () =>
      h('div', { class: 'go-plans' }, [
        h('div', { class: 'go-plan-cards' }, PLANS.map(p =>
          h('button', {
            key: p.key,
            class: ['go-plan', picked.value === p.key ? 'go-plan--on' : ''].join(' '),
            onClick: () => { picked.value = p.key },
          }, [
            h('h5', null, p.name),
            h('div', { class: 'go-spark', role: 'img', 'aria-label': `${p.name} payment profile over twelve months` },
              p.profile.map((v, i) => h('i', { key: i, style: { height: `${(v / max) * 100}%` } }))
            ),
            h('div', { class: 'go-spark-x' }, [h('span', null, MONTHS[0]), h('span', null, MONTHS[11])]),
          ])
        )),

        h('div', { class: 'go-plan-detail' }, [
          h('p', { class: 'go-plan-blurb' }, PLANS.find(p => p.key === picked.value).blurb),
          h('p', { class: 'go-plan-who' }, [h('strong', null, 'Suits: '), PLANS.find(p => p.key === picked.value).who]),
        ]),

        h('label', { class: 'go-aml' }, [
          h('input', { type: 'checkbox' }),
          h('span', null, 'I confirm the amounts being transferred to IRD for each taxpayer are, to the best of my knowledge, materially the same as or less than that taxpayer’s actual or forecast tax liability.'),
        ]),

        h('p', { class: 'cs-note' },
          'Same twelve months, same scale, three different shapes. The AML confirmation underneath is a legal requirement — I got it as short and as plain as I was allowed to.'),
      ])
  },
})
