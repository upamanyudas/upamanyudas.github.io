import { defineComponent, h, ref, onMounted, onUnmounted, TransitionGroup } from 'vue'

/**
 * ContentDataPanel — replaces a "CMS screenshot".
 * Left: layouts.yml being edited (two cards swapped). Right: the live grid
 * FLIP-animating to match. This is genuinely how this site is re-ordered.
 */
const BASE = [
  { key: 'about',  color: '#008B8B', w: 2 },
  { key: 'gmail',  color: '#faf9f7', w: 1 },
  { key: 'films',  color: '#6e7a50', w: 1 },
  { key: 'stats',  color: '#7c5cfc', w: 2 },
]

export default defineComponent({
  name: 'ContentDataPanel',
  setup() {
    const swapped = ref(false)
    const typing  = ref(false)
    let timer = null

    function loop() {
      typing.value = true                       // highlight the edited lines
      timer = setTimeout(() => {
        swapped.value = !swapped.value          // commit → grid animates
        typing.value = false
        timer = setTimeout(loop, 2600)
      }, 1200)
    }

    onMounted(() => { timer = setTimeout(loop, 1400) })
    onUnmounted(() => clearTimeout(timer))

    return () => {
      const order = swapped.value
        ? [BASE[0], BASE[3], BASE[2], BASE[1]]
        : BASE

      return h('div', { class: 'cd-panel', 'aria-hidden': 'true' }, [

        // ── YAML pane ──
        h('div', { class: 'cd-code' }, [
          h('div', { class: 'cd-code-title' }, '_data/minisite/layouts.yml'),
          h('pre', { class: 'cd-pre' }, [
            h('span', { class: 'cd-line' }, 'order:'),
            h('span', { class: 'cd-line' }, '  - about'),
            h('span', { class: ['cd-line', typing.value ? 'cd-line--editing' : ''].join(' ') },
              swapped.value ? '  - stats' : '  - gmail'),
            h('span', { class: 'cd-line' }, '  - films'),
            h('span', { class: ['cd-line', typing.value ? 'cd-line--editing' : ''].join(' ') },
              swapped.value ? '  - gmail' : '  - stats'),
          ]),
          h('div', { class: ['cd-commit', typing.value ? 'cd-commit--busy' : ''].join(' ') },
            typing.value ? 'agent editing…' : 'saved ✓'),
        ]),

        h('span', { class: 'cd-arrow' }, '→'),

        // ── Live grid pane ──
        h('div', { class: 'cd-grid-pane' }, [
          h('div', { class: 'cd-grid-title' }, 'the grid'),
          h(TransitionGroup, { tag: 'div', class: 'cd-grid', name: 'cd-flip' }, () =>
            order.map(cell =>
              h('div', {
                key: cell.key,
                class: 'cd-cell',
                style: {
                  background: cell.color,
                  gridColumn: `span ${cell.w}`,
                  border: cell.color === '#faf9f7' ? '1px solid #e0e0e0' : 'none',
                },
              }, h('span', { class: 'cd-cell-label', style: { color: cell.color === '#faf9f7' ? '#2c2c2c' : '#fff' } }, cell.key))
            )
          ),
        ]),
      ])
    }
  },
})
