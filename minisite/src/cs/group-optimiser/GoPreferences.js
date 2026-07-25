import { defineComponent, h, ref } from 'vue'

/**
 * GoPreferences — step one. Four questions that change the maths, each carrying
 * the consequence in plain English. "(Recommended)" had to survive a sentence
 * explaining itself, or it did not ship.
 */
const PREFS = [
  {
    key: 'sales',
    label: 'Use current tax sales',
    detail: 'Void pending sales and include those balances in the optimisation.',
    recommended: true,
    on:  'Tax the group already listed for sale comes back into the pot first. Cheaper than buying the same amount from the pool, which is why it is the default.',
    off: 'Existing sales stay where they are. Correct if a buyer is already lined up — and it means the group may buy tax it technically already owns.',
  },
  {
    key: 'sell',
    label: 'Sell balances not used',
    detail: 'Sell any surplus the optimisation does not need to satisfy the group.',
    recommended: false,
    on:  'Surplus is converted to cash. Useful when a client needs the cash flow, and it may trigger further AML verification — which is exactly why this one is not recommended by default.',
    off: 'Surplus stays in the pool against next year. The quiet, boring, usually right answer.',
  },
  {
    key: 'future',
    label: 'Exclude future tax dates',
    detail: 'Leave out dates on or after today from this optimisation.',
    recommended: true,
    on:  'Only dates that have already passed are calculated. Recommended when clients still intend to deposit on the upcoming dates themselves.',
    off: 'Future dates are included, and the group position assumes nothing else will be paid in. The totals change, so the summary says so, loudly.',
  },
  {
    key: 'status',
    label: 'Complete upcoming deadline status',
    detail: 'Mark optimised taxpayers as complete on the dashboard.',
    recommended: true,
    on:  'Running the optimiser is the thing the deadline tracker is tracking. This closes the loop so nobody retypes what the system already knows.',
    off: 'Statuses stay as they were, and someone updates twelve rows by hand this evening.',
  },
]

export default defineComponent({
  name: 'GoPreferences',
  setup() {
    const state = ref(Object.fromEntries(PREFS.map(p => [p.key, p.recommended])))

    return () =>
      h('div', { class: 'go-prefs' }, PREFS.map(p =>
        h('div', { key: p.key, class: 'go-pref' }, [
          h('button', {
            class: ['rv-toggle', state.value[p.key] ? 'rv-toggle--on' : ''].join(' '),
            onClick: () => { state.value = { ...state.value, [p.key]: !state.value[p.key] } },
            'aria-pressed': String(state.value[p.key]),
          }, [
            h('span', { class: 'rv-toggle-switch' }),
            h('span', { class: 'rv-toggle-copy' }, [
              h('strong', null, [p.label, p.recommended ? h('i', { class: 'go-rec' }, 'Recommended') : null]),
              h('em', null, p.detail),
            ]),
          ]),
          h('p', { class: ['go-pref-why', state.value[p.key] ? 'go-pref-why--on' : ''].join(' ') },
            state.value[p.key] ? p.on : p.off),
        ])
      ))
  },
})
