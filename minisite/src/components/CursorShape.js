import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'
import { isLazy } from '../lazyMode.js'

const TEXT_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, span, a, li, label, td, th, blockquote'

/* ── Shape definitions ──────────────────────────────────────
   Each shape = { start: [x,y], segs: [[cp1x,cp1y, cp2x,cp2y, ex,ey], …] }
   Both must have exactly 8 cubic-bézier segments so every
   vertex on the arrow has a partner on the beam to lerp to.
   ViewBox: 0 0 28 30  →  rendered at 17 × 18 px.
─────────────────────────────────────────────────────────── */

// Arrow — original path with L commands promoted to cubics
const ARROW = {
  start: [1.02, 2.21],
  segs: [
    [0.85, 1.38,   1.73,  0.72,   2.47,  1.12],   // tip curve
    [10.75, 5.28,  25.86, 13.61,  25.86, 13.61],   // right edge
    [26.62, 14.01, 26.54, 15.14,  25.72, 15.43],   // right-point curve
    [22.41, 16.61, 15.79, 18.98,  15.79, 18.98],   // to elbow
    [15.23, 19.18, 14.73, 19.55,  14.38, 20.04],   // elbow curve
    [12.30, 23.02,  8.16, 28.56,   8.16, 28.56],   // to bottom
    [7.65,  29.26,  6.55, 29.02,   6.37, 28.17],   // bottom curve
    [4.59,  19.52,  1.02,  2.21,   1.02,  2.21],   // closing edge
  ],
}

// I-beam — thin rounded rect, 8 matching segments
const BEAM = {
  start: [2, 1],
  segs: [
    [3.10,  1.00,  4.00,  1.45,   4.00,  2.50],   // top-right corner
    [4.00,  6.00,  4.00, 10.00,   4.00, 15.00],   // right side upper
    [4.00, 20.00,  4.00, 24.00,   4.00, 27.50],   // right side lower
    [4.00, 28.55,  3.10, 29.00,   2.00, 29.00],   // bottom-right corner
    [0.90, 29.00,  0.00, 28.55,   0.00, 27.50],   // bottom-left corner
    [0.00, 24.00,  0.00, 20.00,   0.00, 15.00],   // left side lower
    [0.00, 10.00,  0.00,  6.00,   0.00,  2.50],   // left side upper
    [0.00,  1.45,  0.90,  1.00,   2.00,  1.00],   // top-left corner → close
  ],
}

/* ── Hotspot offsets (px) ───────────────────────────────────
   Arrow tip  ≈ (1, 2)  in viewBox → basically (0, 0) in px
   Beam centre ≈ (2, 15) in viewBox → needs ≈ (−1.2, −9) px
────────────────────────────────────────────────────────── */
const ARROW_OFFSET = [0, 0]
const BEAM_OFFSET  = [-1.2, -9]

const ARROW_STROKE = 2
const BEAM_STROKE  = 1.2
const DURATION     = 200  // ms
const LERP_POS     = 0.25 // responsive but still smooth (overridden to 1.0 when lazy off)

/* ── Helpers ────────────────────────────────────────────── */
function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function lerp(a, b, t) { return a + (b - a) * t }

function buildPath(a, b, t) {
  const sx = lerp(a.start[0], b.start[0], t)
  const sy = lerp(a.start[1], b.start[1], t)
  let d = `M${sx.toFixed(2)},${sy.toFixed(2)}`
  for (let i = 0; i < a.segs.length; i++) {
    const sa = a.segs[i], sb = b.segs[i]
    const v = sa.map((val, j) => lerp(val, sb[j], t).toFixed(2))
    d += `C${v[0]},${v[1]} ${v[2]},${v[3]} ${v[4]},${v[5]}`
  }
  return d + 'Z'
}

/* ── Component ──────────────────────────────────────────── */
export default defineComponent({
  name: 'CursorShape',

  setup() {
    // Raw mouse target — updated instantly on mousemove
    let rawX = -200
    let rawY = -200

    // Smoothed display position — lerped in tick(), drives the template
    const sx      = ref(-200)
    const sy      = ref(-200)
    const visible = ref(false)

    // Morph state (all mutated inside rAF — not reactive on purpose)
    let isText   = false
    let current  = 0       // 0 = arrow, 1 = beam
    let animFrom = 0
    let animTo   = 0
    let animStart = null
    let rafId    = null
    let isNavPill = false

    // Direct DOM refs (bypass Vue reactivity for 60 fps perf)
    let svgEl  = null
    let pathEl = null

    function onMouseMove(e) {
      rawX = e.clientX
      rawY = e.clientY
      if (!visible.value) {
        // Snap smoothed position to avoid lerping in from off-screen
        sx.value = rawX
        sy.value = rawY
        visible.value = true
      }
      isNavPill = !!e.target?.closest?.('.nav-pills')
    }

    function onMouseLeave() {
      // Hide immediately — don't lerp toward an off-screen target
      visible.value = false
    }

    function tick(now) {
      // Smooth cursor position
      const lp = isLazy.value ? LERP_POS : 1
      sx.value = lerp(sx.value, rawX, lp)
      sy.value = lerp(sy.value, rawY, lp)

      // Detect text under cursor every frame — handles case study opening,
      // scrolling content, and any situation where mousemove doesn't fire
      if (visible.value) {
        const el = document.elementFromPoint(rawX, rawY)
        const newIsText = !!el?.closest?.(TEXT_SELECTOR)
          && !el?.closest?.('.action-icon, .about-shrink-btn, .nav-pills, .cv-wrap, .cc-outer')
        if (newIsText !== isText) {
          isText = newIsText
          const target = isText ? 1 : 0
          if (target !== animTo) {
            animFrom  = current
            animTo    = target
            animStart = performance.now()
          }
        }
      }

      // Advance morph
      if (animStart !== null) {
        const raw = Math.min((now - animStart) / DURATION, 1)
        current = animFrom + (animTo - animFrom) * easeInOut(raw)
        if (raw >= 1) { current = animTo; animStart = null }
      }

      if (svgEl && pathEl) {
        // Hotspot offset
        const ox = lerp(ARROW_OFFSET[0], BEAM_OFFSET[0], current)
        const oy = lerp(ARROW_OFFSET[1], BEAM_OFFSET[1], current)
        svgEl.style.transform = `translate(${ox.toFixed(1)}px,${oy.toFixed(1)}px)`

        // Path + stroke
        pathEl.setAttribute('d', buildPath(ARROW, BEAM, current))
        pathEl.setAttribute('stroke-width', lerp(ARROW_STROKE, BEAM_STROKE, current).toFixed(2))
      }

      rafId = requestAnimationFrame(tick)
    }

    // Skip entirely on touch / mobile devices, or when reduced motion is preferred
    const prefersReducedMotion = typeof matchMedia !== 'undefined'
      && matchMedia('(prefers-reduced-motion: reduce)').matches

    const isTouch = prefersReducedMotion
      || 'ontouchstart' in window
      || navigator.maxTouchPoints > 0
      || (typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches)
      || window.innerWidth <= 768

    onMounted(() => {
      if (isTouch) return

      svgEl  = document.getElementById('cs-svg')
      pathEl = document.getElementById('cs-path')

      // Set initial arrow frame
      if (pathEl) {
        pathEl.setAttribute('d', buildPath(ARROW, BEAM, 0))
      }

      window.addEventListener('mousemove', onMouseMove, { passive: true })
      document.documentElement.addEventListener('mouseleave', onMouseLeave)
      rafId = requestAnimationFrame(tick)
    })

    onUnmounted(() => {
      window.removeEventListener('mousemove', onMouseMove)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      if (rafId) cancelAnimationFrame(rafId)
    })

    return () => {
      if (isTouch) return null

      return h('div', {
        class: 'cs-root',
        style: `left:${sx.value}px;top:${sy.value}px;opacity:${visible.value ? 1 : 0}`,
      }, [
        h('svg', {
          id: 'cs-svg',
          width: 17,
          height: 18,
          viewBox: '0 0 28 30',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
        }, [
          h('defs', null, [
            h('filter', { id: 'cs-shadow', x: '-20%', y: '-20%', width: '140%', height: '140%' }, [
              h('feDropShadow', { dx: 0, dy: 1, stdDeviation: 1, 'flood-color': 'rgba(0,0,0,0.25)' }),
            ]),
          ]),
          h('path', {
            id: 'cs-path',
            fill: '#333333',
            stroke: 'white',
            'stroke-width': ARROW_STROKE,
            filter: 'url(#cs-shadow)',
          }),
        ]),
      ])
    }
  },
})
