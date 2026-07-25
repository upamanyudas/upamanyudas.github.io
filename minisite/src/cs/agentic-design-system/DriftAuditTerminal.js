import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'

/**
 * DriftAuditTerminal — replaces an "agent output" screenshot.
 * Replays the real orphan-token audit that ran while building this site.
 */
const LINES = [
  { text: '$ claude "is tokens.css in sync with what the components use?"', cls: 'dt-cmd',  pause: 700 },
  { text: '● Scanning 305 custom properties across 31 modules…',            cls: 'dt-info', pause: 900 },
  { text: '● 291 tokens resolve to at least one consumer',                  cls: 'dt-ok',   pause: 500 },
  { text: '● 14 orphans found:',                                            cls: 'dt-warn', pause: 300 },
  { text: '    --gradient-duo-streak  --color-brand-strava',                cls: 'dt-dim',  pause: 250 },
  { text: '    --font-family-rayo     --color-primitive-orange-500  …',     cls: 'dt-dim',  pause: 700 },
  { text: '● Removing orphans, rewriting tokens.css  ✓',                    cls: 'dt-ok',   pause: 1600 },
  { text: '$ every remaining token is load-bearing.',                       cls: 'dt-cmd',  pause: 2600 },
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
          h('span', { class: 'dt-title' }, 'token audit — this site, July 2026'),
        ]),
        h('div', { class: 'dt-body' }, [
          ...done.value.map((l, i) => h('div', { class: `dt-line ${l.cls}`, key: i }, l.text)),
          h('div', { class: 'dt-line dt-typing' }, [current.value, h('span', { class: 'dt-cursor' })]),
        ]),
      ])
  },
})
