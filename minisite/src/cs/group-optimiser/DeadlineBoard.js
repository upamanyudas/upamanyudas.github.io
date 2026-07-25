import { defineComponent, h, ref, onUnmounted } from 'vue'
import AppWindow from '../shared/AppWindow.js'

/**
 * DeadlineBoard — the smallest feature in the project and the one agents brought up
 * most. Running the optimiser *is* the thing this tab is tracking, so it closes
 * its own rows. Not a machine making the tax decision; a machine refusing to make
 * a human retype what it already knows.
 */
const ROWS = [
  { name: 'Southland Holdings', due: '07 Apr', status: 'Incomplete' },
  { name: 'Waihopai Transport', due: '07 Apr', status: 'Not Started' },
  { name: 'Ōtautau Logistics',  due: '07 Apr', status: 'Incomplete' },
  { name: 'Riverton Property',  due: '07 Apr', status: 'Pending Approval' },
  { name: 'Tuatapere Farming',  due: '07 Apr', status: 'Not Started' },
  { name: 'Colac Bay Rentals',  due: '07 Apr', status: 'Pending Payment' },
]

const TONE = {
  'Not Started': 'grey', 'Incomplete': 'amber', 'Pending Approval': 'blue',
  'Pending Payment': 'blue', 'Complete': 'green',
}

export default defineComponent({
  name: 'DeadlineBoard',
  setup() {
    const auto = ref(true)
    const statuses = ref(ROWS.map(r => r.status))
    const running = ref(false)
    let timer = null

    function run() {
      clearInterval(timer)
      statuses.value = ROWS.map(r => r.status)
      if (!auto.value) return
      running.value = true
      let i = 0
      timer = setInterval(() => {
        statuses.value = statuses.value.map((s, n) => (n === i ? 'Complete' : s))
        i += 1
        if (i >= ROWS.length) { clearInterval(timer); running.value = false }
      }, 320)
    }
    onUnmounted(() => clearInterval(timer))

    return () =>
      h('div', { class: 'go-board' }, [
        h('div', { class: 'cs-toolbar' }, [
          h('button', {
            class: ['cs-chip', auto.value ? 'cs-chip--on' : ''].join(' '),
            onClick: () => { auto.value = !auto.value; run() },
          }, 'Auto-complete deadline status'),
          h('button', { class: 'cs-run', onClick: run }, running.value ? 'Optimising…' : 'Run the optimiser'),
        ]),

        h(AppWindow, { title: 'Dashboard · Upcoming deadlines', active: 'Dashboard' }, {
          default: () => h('table', { class: 'go-table' }, [
            h('thead', null, [h('tr', null, [
              h('th', null, 'Taxpayer'), h('th', null, 'Terminal tax'), h('th', null, 'Status'),
            ])]),
            h('tbody', null, ROWS.map((r, i) =>
              h('tr', { key: r.name }, [
                h('td', null, r.name),
                h('td', null, r.due),
                h('td', null, [
                  h('span', { class: `go-status go-status--${TONE[statuses.value[i]]}` }, statuses.value[i]),
                ]),
              ])
            )),
          ]),
        }),

        h('p', { class: 'cs-note' },
          auto.value
            ? 'With the step-one preference on, the rows close themselves as the group is optimised.'
            : 'With it off, someone updates six rows by hand this evening — and the tab drifts out of date by Thursday, which is how a tracker stops being trusted.'),
      ])
  },
})
