import { defineComponent, h, ref, computed } from 'vue'

/**
 * SpreadsheetPain — the before, sized honestly. The work does not grow with the
 * group; it grows with the group against every tax date, in both directions.
 */
const DATES = 4   // three provisional instalments plus terminal

export default defineComponent({
  name: 'SpreadsheetPain',
  setup() {
    const n = ref(4)

    const cells = computed(() => n.value * DATES * 3)          // due · paid · in pool
    const pairs = computed(() => (n.value * (n.value - 1)) / 2) // who can cover whom
    const txns  = computed(() => n.value * 2)

    return () =>
      h('div', { class: 'go-pain' }, [
        h('div', { class: 'go-pain-bar' }, [
          h('button', { class: 'go-step', disabled: n.value <= 2, onClick: () => { n.value -= 1 } }, '−'),
          h('span', { class: 'go-pain-n' }, [h('strong', null, String(n.value)), ' entities in the group']),
          h('button', { class: 'go-step', disabled: n.value >= 12, onClick: () => { n.value += 1 } }, '+'),
        ]),

        h('div', { class: 'go-sheets' }, Array.from({ length: n.value }, (_, i) =>
          h('div', { key: i, class: 'go-sheet' }, [
            h('span', { class: 'go-sheet-name' }, `Taxpayer ${i + 1}`),
            h('div', { class: 'go-sheet-grid' }, Array.from({ length: DATES * 3 }, (_, c) =>
              h('i', { key: c })
            )),
          ])
        )),

        h('div', { class: 'go-tiles' }, [
          h('div', { class: 'go-tile' }, [h('strong', null, String(n.value)), h('span', null, 'spreadsheets, one per entity')]),
          h('div', { class: 'go-tile' }, [h('strong', null, String(cells.value)), h('span', null, 'figures reconciled by hand')]),
          h('div', { class: 'go-tile go-tile--bad' }, [h('strong', null, String(pairs.value)), h('span', null, 'surplus-to-shortfall pairings to consider')]),
          h('div', { class: 'go-tile' }, [h('strong', null, String(txns.value)), h('span', null, 'transactions raised one at a time')]),
        ]),

        h('p', { class: 'cs-note' },
          `Add one entity and the pairings jump to ${((n.value + 1) * n.value) / 2}. That curve, run in the busiest fortnight of an accountant's year, against a deadline that does not move, is the whole brief.`),
      ])
  },
})
