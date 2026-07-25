import { defineComponent, h, ref } from 'vue'

/**
 * RatingTakes — all four constructs, live. Existing, two rejected takes and the
 * one that shipped. Try to give the first control a 70 and the study explains itself.
 */
const HEART = 'M12 20s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 4.65-7 9-7 9Z'

/* fill: 0 = empty, 0.5 = half, 1 = full */
function heart(fill, size = 26) {
  const id = `hf${Math.round(fill * 10)}${size}`
  return h('svg', { class: 'rv-heart', viewBox: '0 0 24 24', width: size, height: size }, [
    h('defs', null, [
      h('linearGradient', { id, x1: '0', x2: '1', y1: '0', y2: '0' }, [
        h('stop', { offset: fill, 'stop-color': 'currentColor' }),
        h('stop', { offset: fill, 'stop-color': 'transparent' }),
      ]),
    ]),
    h('path', { d: HEART, fill: `url(#${id})`, stroke: 'currentColor', 'stroke-width': 1.6 }),
  ])
}

const TAKES = [
  {
    key: 'existing', name: 'Existing',
    verdict: 'Five targets, ten values. The halves were reachable in theory and invisible in practice — which is exactly what the distribution showed.',
  },
  {
    key: 'ten', name: 'Take one — ten hearts',
    verdict: 'Every value now hittable, and ten decisions where there used to be five. Hick’s law is not a suggestion: it tested slower and people hesitated.',
  },
  {
    key: 'plain', name: 'Take two — range slider',
    verdict: 'Fast and genuinely fun once people realised it moved. In testing, several never realised it moved. No handle, no invitation.',
  },
  {
    key: 'final', name: 'Final — snap slider',
    verdict: 'A handle you can see, snap points you can feel, and a short haptic tick on every step. Fastest of the four, and the one that shipped.',
  },
]

export default defineComponent({
  name: 'RatingTakes',
  setup() {
    const vals = ref({ existing: 60, ten: 60, plain: 60, final: 60 })
    const set = (k, v) => { vals.value = { ...vals.value, [k]: v } }

    // Real haptics where the device has them — the same tick the app used.
    function buzz() { if (navigator.vibrate) navigator.vibrate(8) }

    function control(key) {
      const v = vals.value[key]

      if (key === 'existing') {
        // Whole hearts only on the visible target; the half is hiding in the left edge.
        return h('div', { class: 'rv-hearts' }, [0, 1, 2, 3, 4].map(i => {
          const whole = (i + 1) * 20
          const fill = Math.min(1, Math.max(0, (v - i * 20) / 20))
          return h('button', {
            key: i, class: 'rv-heartbtn', 'aria-label': `${whole}%`,
            onClick: e => set(key, e.offsetX < e.currentTarget.clientWidth * 0.32 ? whole - 10 : whole),
          }, [heart(fill)])
        }))
      }

      if (key === 'ten') {
        return h('div', { class: 'rv-hearts rv-hearts--ten' }, Array.from({ length: 10 }, (_, i) =>
          h('button', {
            key: i, class: 'rv-heartbtn', 'aria-label': `${(i + 1) * 10}%`,
            onClick: () => set(key, (i + 1) * 10),
          }, [heart(v >= (i + 1) * 10 ? 1 : 0, 20)])
        ))
      }

      return h('input', {
        class: key === 'plain' ? 'rv-range rv-range--plain' : 'rv-range rv-range--final',
        type: 'range', min: 0, max: 100, step: 10, value: v,
        'aria-label': TAKES.find(t => t.key === key).name,
        onInput: e => { set(key, +e.target.value); if (key === 'final') buzz() },
      })
    }

    return () =>
      h('div', { class: 'rv-takes' }, TAKES.map(t =>
        h('div', { key: t.key, class: ['rv-take', t.key === 'final' ? 'rv-take--final' : ''].join(' ') }, [
          h('div', { class: 'rv-take-head' }, [
            h('h5', null, t.name),
            h('span', { class: 'rv-take-val' }, `${vals.value[t.key]}%`),
          ]),
          h('div', { class: 'rv-take-ctl' }, [
            control(t.key),
            t.key === 'final' ? h('div', { class: 'rv-ticks' }, Array.from({ length: 11 }, (_, i) => h('span', { key: i }))) : null,
          ]),
          h('p', { class: 'rv-take-verdict' }, t.verdict),
        ])
      ))
  },
})
