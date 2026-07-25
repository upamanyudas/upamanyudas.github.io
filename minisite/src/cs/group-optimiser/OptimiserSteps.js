import { defineComponent, h, ref } from 'vue'
import AppWindow from '../shared/AppWindow.js'

/**
 * OptimiserSteps — the three-step shell. The promise printed on step two is the
 * one that makes the whole thing usable: nothing is created until step three.
 */
const STEPS = [
  {
    n: 1, name: 'Preferences',
    lead: 'Select which tax type and income year you would like a quote for.',
    body: 'form',
    note: 'Group, tax type, income year, then the four preferences that change the maths. Nothing here touches an account.',
  },
  {
    n: 2, name: 'Optimised position',
    lead: 'Here is the summary of the required transactions for the group.',
    body: 'table',
    note: 'The netting table. Continue to step three to see it broken down by tax date — no transactions are created until step three is completed.',
  },
  {
    n: 3, name: 'Confirm taxpayers',
    lead: 'Confirm the amounts, choose how to pay, and we will raise the transactions.',
    body: 'confirm',
    note: 'Broken down by tax date, with the payment profile and the AML confirmation. This is the only screen in the flow that writes anything.',
  },
]

function bodyFor(kind) {
  if (kind === 'form') {
    return h('div', { class: 'go-mini-form' }, [
      h('span', { class: 'go-mini-field go-mini-field--wide' }, 'Southland Consolidated Group'),
      h('span', { class: 'go-mini-field' }, 'Income tax'),
      h('span', { class: 'go-mini-field' }, '2023'),
      ...Array.from({ length: 4 }, (_, i) => h('span', { key: i, class: 'go-mini-check' })),
    ])
  }
  if (kind === 'table') {
    return h('div', { class: 'go-mini-table' }, Array.from({ length: 6 }, (_, i) =>
      h('span', { key: i, class: ['go-mini-row', i === 0 ? 'go-mini-row--head' : ''].join(' ') })
    ))
  }
  return h('div', { class: 'go-mini-confirm' }, [
    h('div', { class: 'go-mini-plans' }, Array.from({ length: 3 }, (_, i) =>
      h('span', { key: i, class: ['go-mini-plan', i === 0 ? 'go-mini-plan--on' : ''].join(' ') })
    )),
    h('span', { class: 'go-mini-aml' }),
    h('span', { class: 'go-mini-cta' }),
  ])
}

export default defineComponent({
  name: 'OptimiserSteps',
  setup() {
    const at = ref(1)
    const step = () => STEPS[at.value - 1]

    return () =>
      h('div', { class: 'go-steps' }, [
        h(AppWindow, { title: 'Group Optimiser' }, {
          default: () => [
            h('div', { class: 'go-stepper' }, STEPS.map(s => [
              h('button', {
                key: s.n,
                class: ['go-stop', at.value === s.n ? 'go-stop--on' : '', at.value > s.n ? 'go-stop--done' : ''].filter(Boolean).join(' '),
                onClick: () => { at.value = s.n },
              }, [h('i', null, String(s.n)), h('span', null, s.name)]),
              s.n < STEPS.length ? h('span', { key: `b${s.n}`, class: ['go-stopbar', at.value > s.n ? 'go-stopbar--on' : ''].join(' ') }) : null,
            ]).flat()),

            h('p', { class: 'go-steplead' }, step().lead),
            bodyFor(step().body),
          ],
        }),

        h('p', { class: 'cs-note' }, step().note),
      ])
  },
})
