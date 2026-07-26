import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'

/**
 * FilmStripBg — faint 35mm film strips (sprocket holes + frames) tiled and
 * scrolling slowly on a diagonal; a frame here and there catches the light.
 * Cinema, ambient — nothing floats, nothing is a chip.
 */
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches
const ANGLE = -20 * Math.PI / 180
const STRIP = 60, GAP = 12   // strip height, gap between strips
const FRAME_W = 42, FRAME_H = 30, PITCH = 54, HOLE = 5

export default defineComponent({
  name: 'FilmStripBg',
  setup() {
    const canvasRef = ref(null)
    let animId = null, resizeObs = null, W = 0, H = 0, t = 0

    function roundRect(ctx, x, y, w, hgt, r) {
      ctx.beginPath()
      ctx.roundRect(x, y, w, hgt, r)
      ctx.fill()
    }

    function draw() {
      const canvas = canvasRef.value
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, W, H)
      if (!REDUCED) t += 0.32

      const half = Math.hypot(W, H) / 2 + STRIP
      const offset = t % PITCH
      ctx.save()
      ctx.translate(W / 2, H / 2)
      ctx.rotate(ANGLE)

      for (let sy = -half; sy < half; sy += STRIP + GAP) {
        const midY = sy + STRIP / 2

        // Frames down the middle of the strip
        for (let fx = -half - PITCH; fx < half + PITCH; fx += PITCH) {
          const x = fx - offset
          const glow = 0.5 + 0.5 * Math.sin(Math.floor(fx / PITCH) * 1.7 + sy * 0.05 + t * 0.025)
          ctx.fillStyle = `rgba(255,238,220,${glow > 0.86 ? 0.16 : 0.055})`
          roundRect(ctx, x - FRAME_W / 2, midY - FRAME_H / 2, FRAME_W, FRAME_H, 3)
        }

        // Sprocket holes along both edges
        ctx.fillStyle = 'rgba(255,255,255,0.09)'
        for (let hx = -half - PITCH; hx < half + PITCH; hx += PITCH / 2) {
          const x = hx - offset
          roundRect(ctx, x - HOLE / 2, midY - STRIP / 2 + 5, HOLE, HOLE, 1.5)
          roundRect(ctx, x - HOLE / 2, midY + STRIP / 2 - 10, HOLE, HOLE, 1.5)
        }
      }

      ctx.restore()
      if (!REDUCED) animId = requestAnimationFrame(draw)
    }

    function resize() {
      const canvas = canvasRef.value
      if (!canvas) return
      const rect = canvas.parentElement.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      W = rect.width; H = rect.height
      canvas.width = W * dpr; canvas.height = H * dpr
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
      canvas.getContext('2d').scale(dpr, dpr)
      if (REDUCED) draw()
    }

    onMounted(() => {
      resize()
      draw()
      resizeObs = new ResizeObserver(resize)
      if (canvasRef.value?.parentElement) resizeObs.observe(canvasRef.value.parentElement)
    })

    onUnmounted(() => {
      if (animId) cancelAnimationFrame(animId)
      if (resizeObs) resizeObs.disconnect()
    })

    return () => h('canvas', { ref: canvasRef, class: 'ads-card-canvas' })
  },
})
