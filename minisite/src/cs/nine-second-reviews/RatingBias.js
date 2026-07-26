import { defineComponent, h, ref, computed } from 'vue'

/**
 * RatingBias — the comb. A ten-value scale behind a five-target control, and the
 * distribution that gave it away. Shape redrawn from the 2020 analytics pull;
 * the ratios are the finding, not the raw export.
 */
const BUCKETS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

const DATA = {
  broken: {
    label: 'Five hearts, half increments',
    votes: [0.9, 4.2, 1.1, 6.8, 1.4, 11.2, 2.1, 18.6, 2.4, 14.1],
    note: 'Every second value needs half a heart. The control gave no affordance for it, so people rounded to whatever they could hit — and a film that deserved 70 was recorded at 80.',
  },
  fixed: {
    label: 'Ten-point slider, snap points',
    votes: [1.6, 2.4, 3.1, 4.6, 6.2, 9.4, 12.8, 14.9, 9.1, 6.8],
    note: 'Every value reachable, every value felt. One peak, a tail on each side — a distribution that looks like an opinion instead of a mechanism.',
  },
}

// Half-heart positions on the old control — unreachable without an affordance.
const isHalf = pct => (pct / 10) % 2 === 1

export default defineComponent({
  name: 'RatingBias',
  setup() {
    const mode = ref('broken')
    const hover = ref(null)

    const set = computed(() => DATA[mode.value])
    const max = computed(() => Math.max(...set.value.votes))

    return () =>
      h('div', { class: 'rv-chart' }, [
        h('div', { class: 'cs-tabs cs-tabs--wide' },
          Object.keys(DATA).map(k =>
            h('button', {
              key: k,
              class: ['cs-tab', mode.value === k ? 'cs-tab--on' : ''].join(' '),
              onClick: () => { mode.value = k },
            }, DATA[k].label)
          )
        ),

        h('p', { class: 'rv-chart-title' }, 'Votes recorded at each value on the scale'),

        h('div', { class: 'rv-plot' },
          BUCKETS.map((pct, i) => {
            const v = set.value.votes[i]
            const gap = mode.value === 'broken' && isHalf(pct)
            return h('div', {
              key: pct,
              class: ['rv-bar-slot', hover.value === pct ? 'rv-bar-slot--hover' : ''].join(' '),
              onMouseenter: () => { hover.value = pct },
              onMouseleave: () => { hover.value = null },
              onFocus: () => { hover.value = pct },
              tabindex: '0',
            }, [
              hover.value === pct
                ? h('span', { class: 'rv-tip' }, `${v.toFixed(1)}k votes at ${pct}%`)
                : null,
              h('span', {
                class: ['rv-bar', gap ? 'rv-bar--gap' : ''].join(' '),
                style: { height: `${(v / max.value) * 100}%` },
              }),
              h('span', { class: 'rv-bar-x' }, `${pct}%`),
              gap ? h('span', { class: 'rv-bar-half' }, '½') : null,
            ])
          })
        ),

        h('div', { class: 'rv-legend' }, [
          h('span', null, [h('i', { class: 'rv-key' }), 'Votes recorded']),
          mode.value === 'broken'
            ? h('span', null, [h('i', { class: 'rv-key rv-key--gap' }), 'Needs half a heart — no way to hit it'])
            : null,
        ]),

        h('p', { class: 'cs-note' }, set.value.note),
      ])
  },
})
