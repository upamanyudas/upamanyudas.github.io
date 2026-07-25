import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'

/**
 * LedgerGridBg — a faint spreadsheet grid with a calculation sweep.
 * A bright column travels left→right; active cells it crosses flash a
 * gain (green) or loss (red), then fade back to neutral behind it — a
 * whole group's ledger being computed and netting out, one pass.
 */
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches
const CELL = 34, LEAD = 22, TAIL = 130   // px: cell size, ramp-in, fade-out tail

export default defineComponent({
  name: 'LedgerGridBg',
  setup() {
    const canvasRef = ref(null)
    let cells = [], animId = null, resizeObs = null
    let W = 0, H = 0, cols = 0, rows = 0, t = 0

    function build() {
      cells = []
      if (!W || !H) return
      cols = Math.ceil(W / CELL) + 1
      rows = Math.ceil(H / CELL) + 1
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          if (Math.random() < 0.5)                      // ~half the cells carry a figure
            cells.push({ c, r, sign: Math.random() < 0.5 ? 1 : -1 })
    }

    function draw() {
      const canvas = canvasRef.value
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, W, H)
      if (!REDUCED) t += 1.4
      const sweepX = REDUCED ? W * 0.5 : t % (W + TAIL)

      // Grid lines
      ctx.strokeStyle = 'rgba(255,255,255,0.06)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let c = 0; c <= cols; c++) { const x = c * CELL; ctx.moveTo(x, 0); ctx.lineTo(x, H) }
      for (let r = 0; r <= rows; r++) { const y = r * CELL; ctx.moveTo(0, y); ctx.lineTo(W, y) }
      ctx.stroke()

      // Cells lighting up around the sweep, fading to neutral behind it
      cells.forEach(({ c, r, sign }) => {
        const cx = c * CELL + CELL / 2
        const d = sweepX - cx
        let k = 0
        if (d < 0 && d > -LEAD) k = 1 + d / LEAD        // ramp in as sweep nears
        else if (d >= 0 && d < TAIL) k = 1 - d / TAIL   // fade out after it passes
        if (k <= 0) return

        const [cr, cg, cb] = sign > 0 ? [110, 224, 160] : [255, 140, 140]
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${k * 0.28})`
        ctx.fillRect(c * CELL + 1, r * CELL + 1, CELL - 2, CELL - 2)

        if (k > 0.7) {                                  // a faint +/- tick at the peak
          ctx.fillStyle = `rgba(255,255,255,${(k - 0.7) / 0.3 * 0.45})`
          ctx.font = '600 11px ui-monospace, monospace'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(sign > 0 ? '+' : '−', cx, r * CELL + CELL / 2)
        }
      })

      // The sweep itself — a soft bright edge
      const g = ctx.createLinearGradient(sweepX - 14, 0, sweepX + 2, 0)
      g.addColorStop(0, 'rgba(255,255,255,0)')
      g.addColorStop(1, 'rgba(255,255,255,0.16)')
      ctx.fillStyle = g
      ctx.fillRect(sweepX - 14, 0, 16, H)

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
      build()
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
