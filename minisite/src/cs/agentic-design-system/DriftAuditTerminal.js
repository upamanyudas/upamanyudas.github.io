import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'

/**
 * DriftAuditTerminal — replaces an "agent output" screenshot.
 * Replays the drift audit: one question, no script, an actionable list back.
 */
const LINES = [
  { text: '$ claude "do tokens.css and the Figma variables still agree?"',  cls: 'dt-cmd',  pause: 700 },
  { text: '● Reading 412 custom properties across 34 modules…',             cls: 'dt-info', pause: 800 },
  { text: '● Pulling Primitive + Semantic collections over MCP…',           cls: 'dt-info', pause: 800 },
  { text: '● 374 tokens matched on name and resolved value',                cls: 'dt-ok',   pause: 500 },
  { text: '● 38 in code, absent from Figma:',                               cls: 'dt-warn', pause: 300 },
  { text: '    --color-schedule-due      --color-schedule-overdue',         cls: 'dt-dim',  pause: 250 },
  { text: '    --color-advisor-badge     --color-savings-figure  …',        cls: 'dt-dim',  pause: 700 },
  { text: '● 11 more resolve, but nothing consumes them  → cleanup list',   cls: 'dt-warn', pause: 900 },
  { text: '● Wrote drift-report.md, grouped by fix  ✓',                     cls: 'dt-ok',   pause: 1600 },
  { text: '$ a design system that can tell you how it is doing.',           cls: 'dt-cmd',  pause: 2600 },
]

const TYPE_MS = 14

export default defineComponent({
  name: 'DriftAuditTerminal',
  setup() {
    const done    = ref([])   // fully typed lines
    const current = ref('')   // line being typed
    let timers = []
    let destroyed = false

    function schedule(fn, ms) {
      const id = setTimeout(() => { if (!destroyed) fn() }, ms)
      timers.push(id)
    }

    function typeLine(idx) {
      if (idx >= LINES.length) {
        schedule(() => { done.value = []; typeLine(0) }, 400)   // loop
        return
      }
      const line = LINES[idx]
      let c = 0
      function tick() {
        if (destroyed) return
        c++
        current.value = line.text.slice(0, c)
        if (c < line.text.length) {
          schedule(tick, TYPE_MS)
        } else {
          done.value = [...done.value, { text: line.text, cls: line.cls }]
          current.value = ''
          schedule(() => typeLine(idx + 1), line.pause)
        }
      }
      tick()
    }

    onMounted(() => typeLine(0))
    onUnmounted(() => { destroyed = true; timers.forEach(clearTimeout) })

    return () =>
      h('div', { class: 'dt-terminal', 'aria-hidden': 'true' }, [
        h('div', { class: 'dt-bar' }, [
          h('span', { class: 'tw-dot tw-dot--red' }),
          h('span', { class: 'tw-dot tw-dot--yellow' }),
          h('span', { class: 'tw-dot tw-dot--green' }),
          h('span', { class: 'dt-title' }, 'drift audit — code ⇄ Figma'),
        ]),
        h('div', { class: 'dt-body' }, [
          ...done.value.map((l, i) => h('div', { class: `dt-line ${l.cls}`, key: i }, l.text)),
          h('div', { class: 'dt-line dt-typing' }, [current.value, h('span', { class: 'dt-cursor' })]),
        ]),
      ])
  },
})
