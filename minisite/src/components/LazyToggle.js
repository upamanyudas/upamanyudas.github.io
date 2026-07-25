import { defineComponent, h, ref, onUnmounted } from 'vue'
import { isLazy, toggleLazy } from '../lazyMode.js'

/* ── Normalised SVG paths (6 cubic-bézier segments each) ─────────────
   Both paths share the same structure so every control point has a
   partner to lerp to.  Viewbox: 0 0 24 24.

   Wave  — original: M3 12c2-3 4-3 6 0s4 3 6 0 4-3 6 0
           Split each cubic at t=0.5 → 6 segments.

   Bolt  — original: M13 2L4.5 12.5H11L10 22L18.5 11.5H12L13 2
           Each line promoted to a cubic (⅓ / ⅔ interpolation).
──────────────────────────────────────────────────────────────────────── */
const WAVE = {
  start: [3, 12],
  segs: [
    [4, 10.5,    5, 9.75,     6, 9.75],
    [7, 9.75,    8, 10.5,     9, 12],
    [10, 13.5,   11, 14.25,   12, 14.25],
    [13, 14.25,  14, 13.5,    15, 12],
    [16, 10.5,   17, 9.75,    18, 9.75],
    [19, 9.75,   20, 10.5,    21, 12],
  ],
}

const BOLT = {
  start: [13, 2],
  segs: [
    [10.17, 5.5,    7.33, 9,       4.5, 12.5],
    [6.67, 12.5,    8.83, 12.5,    11, 12.5],
    [10.67, 15.67,  10.33, 18.83,  10, 22],
    [12.83, 18.5,   15.67, 15,     18.5, 11.5],
    [16.33, 11.5,   14.17, 11.5,   12, 11.5],
    [12.33, 8.33,   12.67, 5.17,   13, 2],
  ],
}

/* ── Helpers ───────────────────────────────────────────────────────── */
function lerp(a, b, t) { return a + (b - a) * t }

function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

function buildPath(a, b, t) {
  const sx = lerp(a.start[0], b.start[0], t)
  const sy = lerp(a.start[1], b.start[1], t)
  let d = `M${sx.toFixed(2)},${sy.toFixed(2)}`
  for (let i = 0; i < a.segs.length; i++) {
    const sa = a.segs[i], sb = b.segs[i]
    const v = sa.map((val, j) => lerp(val, sb[j], t).toFixed(2))
    d += `C${v[0]},${v[1]} ${v[2]},${v[3]} ${v[4]},${v[5]}`
  }
  return d
}

const MORPH_MS = 300   // icon morph duration

export default defineComponent({
  name: 'LazyToggle',

  setup() {
    // Morph progress: 0 = wave (smooth), 1 = bolt (snappy)
    let morphT      = isLazy.value ? 0 : 1
    let morphFrom   = morphT
    let morphTo     = morphT
    let morphStart  = null
    let rafId       = null

    const pathD       = ref(buildPath(WAVE, BOLT, morphT))
    const labelFading = ref(false)

    function tick(now) {
      if (morphStart !== null) {
        const raw = Math.min((now - morphStart) / MORPH_MS, 1)
        morphT = morphFrom + (morphTo - morphFrom) * easeInOut(raw)
        pathD.value = buildPath(WAVE, BOLT, morphT)
        if (raw >= 1) { morphT = morphTo; morphStart = null }
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    onUnmounted(() => { if (rafId) cancelAnimationFrame(rafId) })

    function onRelease() {
      // Fade out label, swap state, start morph
      labelFading.value = true

      toggleLazy()

      // Kick off icon morph
      morphFrom  = morphT
      morphTo    = isLazy.value ? 0 : 1
      morphStart = performance.now()

      // Fade label back in after a beat
      setTimeout(() => { labelFading.value = false }, 100)
    }

    const tooltip = () => isLazy.value
      ? 'Toggle snappy scrolling effects'
      : 'Toggle smooth scrolling effects'

    return () =>
      h('button', {
        class: ['lazy-toggle', isLazy.value ? 'lazy-toggle--on' : 'lazy-toggle--off'],
        onPointerup: onRelease,
        'data-tooltip': tooltip(),
        'aria-label': tooltip(),
      }, [
        // Morphing icon
        h('svg', {
          class: 'lazy-toggle__icon',
          width: 16,
          height: 16,
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2.2,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        }, [
          h('path', { d: pathD.value }),
        ]),
        // Label with crossfade
        h('span', {
          class: ['lazy-toggle__label', labelFading.value ? 'lazy-toggle__label--fading' : ''],
        }, isLazy.value ? 'Smooth scroll' : 'Instant scroll'),
      ])
  },
})
