import { defineComponent, h, ref, computed, onUnmounted } from 'vue'

/**
 * TemplatePipeline — publishing one show, both ways.
 * Eleven hand-drawn sizes against two masters and nine crops derived on request.
 * The clock is the argument; the grid is just where you watch it happen.
 */
const SIZES = [
  '1080×1920', '1280×720', '800×1200', '1200×628', '640×640', '500×500',
  '320×480', '970×250', '728×90', '300×250', '160×600',
]

const MODES = {
  manual: {
    label: 'By hand',
    step: 260,
    clock: i => `${Math.round(i / SIZES.length * 24)} hr`,
    done: '24 hr · 11 files · 11 briefs · six people touched it',
    note: 'Eleven sizes, every one of them drawn, checked and chased. Most were the residue of a layout that had not existed for two years.',
  },
  templated: {
    label: 'Templated',
    step: 90,
    clock: i => (i <= 2 ? `${i} hr` : '2 hr'),
    done: '2 hr · 2 masters · 9 crops derived on request',
    note: 'One vertical, one horizontal, drawn by a designer. Every other crop and density is a rule the CDN applies when the request arrives — no queue, no ticket, nobody bored.',
  },
}

export default defineComponent({
  name: 'TemplatePipeline',
  setup() {
    const mode = ref('templated')
    const filled = ref(SIZES.length)
    let timer = null

    const cfg = computed(() => MODES[mode.value])
    const running = computed(() => filled.value < SIZES.length)

    function run() {
      clearInterval(timer)
      filled.value = 0
      timer = setInterval(() => {
        filled.value += 1
        if (filled.value >= SIZES.length) clearInterval(timer)
      }, cfg.value.step)
    }

    function setMode(m) {
      mode.value = m
      run()
    }

    onUnmounted(() => clearInterval(timer))

    // Templated: first two are drawn masters, the rest are derived.
    const isMaster = i => mode.value === 'templated' && i < 2

    return () =>
      h('div', { class: 'tk-pipe' }, [
        h('div', { class: 'cs-toolbar' }, [
          h('div', { class: 'cs-tabs' },
            Object.keys(MODES).map(m =>
              h('button', {
                key: m,
                class: ['cs-tab', mode.value === m ? 'cs-tab--on' : ''].join(' '),
                onClick: () => setMode(m),
              }, MODES[m].label)
            )
          ),
          h('button', { class: 'cs-run', onClick: run }, running.value ? 'Publishing…' : 'Publish a show'),
        ]),

        h('div', { class: 'tk-pipe-clock' }, [
          h('span', { class: 'tk-pipe-time' }, running.value ? cfg.value.clock(filled.value) : cfg.value.done.split(' · ')[0]),
          h('span', { class: 'tk-pipe-caption' }, running.value ? 'turnaround so far' : cfg.value.done.split(' · ').slice(1).join(' · ')),
        ]),

        h('div', { class: 'tk-pipe-grid', 'aria-hidden': 'true' },
          SIZES.map((size, i) =>
            h('span', {
              key: size,
              class: [
                'tk-asset',
                i < filled.value ? 'tk-asset--on' : '',
                isMaster(i) ? 'tk-asset--master' : '',
              ].filter(Boolean).join(' '),
            }, [
              h('span', { class: 'tk-asset-size' }, size),
              h('span', { class: 'tk-asset-kind' },
                isMaster(i) ? 'master' : mode.value === 'templated' ? 'derived' : 'drawn'),
            ])
          )
        ),

        h('p', { class: 'cs-note' }, cfg.value.note),
      ])
  },
})
