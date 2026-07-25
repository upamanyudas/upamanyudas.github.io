import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'
import { isLazy } from '../lazyMode.js'

const CHAR_DELAY_MS = 18   // ms between each typed character
const LERP_FACTOR   = 0.07 // lower = more lag (0.08–0.15 feels natural)

export default defineComponent({
  name: 'CursorTooltip',

  setup() {
    const visible   = ref(false)
    const displayed = ref('')
    const x         = ref(0)
    const y         = ref(0)

    let fullText      = ''
    let charIndex     = 0
    let typeTimer     = null
    let currentTarget = null

    // Raw mouse coords (updated instantly)
    let mouseX = 0
    let mouseY = 0
    // Smoothed display coords (lerped toward mouse)
    let smoothX = 0
    let smoothY = 0
    let rafId   = null

    // ── Lerp animation loop ──────────────────────────────────
    function lerp(a, b, t) { return a + (b - a) * t }

    function animLoop() {
      const lf = isLazy.value ? LERP_FACTOR : 1
      smoothX = lerp(smoothX, mouseX, lf)
      smoothY = lerp(smoothY, mouseY, lf)
      x.value = smoothX
      y.value = smoothY
      rafId = requestAnimationFrame(animLoop)
    }

    // ── Typewriter ───────────────────────────────────────────
    function startTyping(text) {
      clearTimeout(typeTimer)
      fullText        = text
      charIndex       = 0
      displayed.value = ''
      visible.value   = true
      tick()
    }

    function tick() {
      if (charIndex < fullText.length) {
        displayed.value = fullText.slice(0, ++charIndex)
        typeTimer = setTimeout(tick, CHAR_DELAY_MS)
      }
    }

    function hide() {
      clearTimeout(typeTimer)
      visible.value   = false
      displayed.value = ''
      currentTarget   = null
    }

    // ── Mouse tracking ───────────────────────────────────────
    function onMouseMove(e) {
      mouseX = e.clientX
      mouseY = e.clientY

      const el = e.target?.closest?.('[data-tooltip]') ?? null

      if (el !== currentTarget) {
        currentTarget = el
        if (el) {
          startTyping(el.dataset.tooltip)
        } else {
          hide()
        }
      } else if (el && el.dataset.tooltip !== fullText) {
        // Tooltip text changed while hovering the same element (e.g. theme toggle)
        startTyping(el.dataset.tooltip)
      }
    }

    function onMouseLeave() {
      hide()
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

      // Seed smoothed position so there's no initial jump from (0,0)
      smoothX = window.innerWidth / 2
      smoothY = window.innerHeight / 2
      mouseX  = smoothX
      mouseY  = smoothY

      rafId = requestAnimationFrame(animLoop)
      window.addEventListener('mousemove', onMouseMove)
      document.documentElement.addEventListener('mouseleave', onMouseLeave)
    })

    onUnmounted(() => {
      clearTimeout(typeTimer)
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMouseMove)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
    })

    // ── Render ───────────────────────────────────────────────
    return () => {
      if (!visible.value) return null

      const offset   = 24
      const maxLineLen = Math.max(...displayed.value.split('\n').map(l => l.length))
      const pillW  = maxLineLen * 10.5 + 32
      const clampedX = Math.min(x.value + offset, window.innerWidth - pillW - 8)
      const clampedY = y.value + offset

      return h('div', {
        class: 'cursor-tooltip',
        style: { left: `${clampedX}px`, top: `${clampedY}px` },
      }, displayed.value)
    }
  },
})
