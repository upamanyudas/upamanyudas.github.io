import { defineComponent, h, ref, computed } from 'vue'
import AppWindow from '../shared/AppWindow.js'

/**
 * NetPosition — the netting table, live. Toggle a taxpayer and everything below
 * recalculates immediately: there is no apply button, because an accountant tests
 * a hypothesis by toggling and an apply button turns eight tests into eight trips.
 *
 * Group is synthetic. Interest and penalty rates are illustrative — the shape of
 * the maths is the point, not the basis points.
 */
const UOMI = 0.0888   // IRD use-of-money interest on an underpayment, illustrative
const PENALTY = 0.05  // 1% initial plus 4% at seven days, illustrative

const GROUP = [
  { name: 'Southland Holdings',  ird: '099 123 456', ird_pos: -248400, pool: 0 },
  { name: 'Waihopai Transport',  ird: '116 884 201', ird_pos:   92600, pool: 0 },
  { name: 'Ōtautau Logistics',   ird: '128 550 917', ird_pos:  -61250, pool: 40000 },
  { name: 'Riverton Property',   ird: '134 771 088', ird_pos:  145900, pool: 0 },
  { name: 'Tuatapere Farming',   ird: '141 209 663', ird_pos:  -18900, pool: 0 },
  { name: 'Colac Bay Rentals',   ird: '152 663 410', ird_pos:   12670, pool: 25000 },
]

const nz = new Intl.NumberFormat('en-NZ', { style: 'currency', currency: 'NZD', maximumFractionDigits: 0 })
const money = v => nz.format(Math.abs(v))

export default defineComponent({
  name: 'NetPosition',
  setup() {
    const included = ref(Object.fromEntries(GROUP.map(t => [t.ird, true])))
    const focus = ref('saved')

    const sums = computed(() => {
      const on = GROUP.filter(t => included.value[t.ird])
      const shortfall = on.filter(t => t.ird_pos < 0).reduce((a, t) => a - t.ird_pos, 0)
      const surplus   = on.filter(t => t.ird_pos > 0).reduce((a, t) => a + t.ird_pos, 0)
                      + on.reduce((a, t) => a + t.pool, 0)
      const transfers = Math.min(surplus, shortfall)
      return {
        count: on.length,
        shortfall, surplus, transfers,
        purchase: Math.max(0, shortfall - surplus),
        sell:     Math.max(0, surplus - shortfall),
        saved:    Math.round(shortfall * (UOMI + PENALTY)),
      }
    })

    const TILES = () => [
      { key: 'transfers', label: 'Group transfers', value: money(sums.value.transfers),
        why: `Surplus moved between entities inside the group. Costs nothing and buys nothing — it is tax the group already holds, applied where the group is short.` },
      { key: 'purchase', label: 'Net purchase required', value: money(sums.value.purchase),
        why: sums.value.purchase
          ? `What the group genuinely has to buy from the pool once it has helped itself. Payable before the 75-day deadline.`
          : `Nothing. The group covered its own shortfall entirely — which is the outcome the whole product exists to find.` },
      { key: 'sell', label: 'Excess available to sell', value: money(sums.value.sell),
        why: sums.value.sell
          ? `Surplus the optimisation did not need. Leave it in the pool against next year, or sell it — that is the second preference on step one.`
          : `None. Every dollar of surplus in this group is doing a job.` },
      { key: 'saved', label: 'Interest and penalties avoided', value: money(sums.value.saved), good: true,
        why: `Use-of-money interest and late payment penalties IRD would charge on ${money(sums.value.shortfall)} of shortfall, had it simply gone unpaid. Rates here are illustrative.` },
    ]

    return () =>
      h('div', { class: 'go-net' }, [
        h(AppWindow, { title: 'Group Optimiser · Southland Consolidated Group · Income tax 2023' }, {
          default: () => [
            h('table', { class: 'go-table' }, [
              h('thead', null, [h('tr', null, [
                h('th', null, 'Included'),
                h('th', null, 'Taxpayer'),
                h('th', { class: 'go-num' }, 'Position at IRD'),
                h('th', { class: 'go-num' }, 'Pool balance'),
              ])]),
              h('tbody', null, GROUP.map(t =>
                h('tr', {
                  key: t.ird,
                  class: included.value[t.ird] ? '' : 'go-row--out',
                }, [
                  h('td', null, [
                    h('button', {
                      class: ['go-check', included.value[t.ird] ? 'go-check--on' : ''].join(' '),
                      'aria-label': `Include ${t.name}`,
                      'aria-pressed': String(included.value[t.ird]),
                      onClick: () => { included.value = { ...included.value, [t.ird]: !included.value[t.ird] } },
                    }, included.value[t.ird] ? '✓' : ''),
                  ]),
                  h('td', null, [h('strong', null, t.name), h('span', { class: 'go-ird' }, `IRD ${t.ird}`)]),
                  h('td', { class: ['go-num', t.ird_pos < 0 ? 'go-neg' : 'go-pos'].join(' ') },
                    `${t.ird_pos < 0 ? '−' : '+'}${money(t.ird_pos)}`),
                  h('td', { class: 'go-num' }, t.pool ? money(t.pool) : '—'),
                ])
              )),
            ]),

            h('div', { class: 'go-tiles go-tiles--4' }, TILES().map(t =>
              h('button', {
                key: t.key,
                class: ['go-tile', t.good ? 'go-tile--good' : '', focus.value === t.key ? 'go-tile--on' : ''].filter(Boolean).join(' '),
                onMouseenter: () => { focus.value = t.key },
                onFocus: () => { focus.value = t.key },
                onClick: () => { focus.value = t.key },
              }, [h('strong', null, t.value), h('span', null, t.label)])
            )),

            h('p', { class: 'go-why' }, TILES().find(t => t.key === focus.value).why),
          ],
        }),

        h('p', { class: 'cs-note' },
          `${sums.value.count} of ${GROUP.length} taxpayers included. Take Riverton Property out and watch the purchase appear — that one entity is covering most of the group.`),
      ])
  },
})
