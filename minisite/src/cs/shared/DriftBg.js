import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'

/**
 * DriftBg — ambient white-on-colour chips drifting behind a case-study card.
 * Generic on purpose: pass the vocabulary, get the motion. Kinds are 'pill'
 * (rounded, monospace) and 'num' (bare figure, for ledgers and money).
 */
const REDUCED_MOTION = matchMedia('(prefers-reduced-motion: reduce)').matches

export default defineComponent({
  name: 'DriftBg',
  props: {
    items:   { type: Array,  required: true },   // [{ label, kind }]
    density: { type: Number, default: 8000 },    // px² per element
  },

  setup(props) {
    const canvasRef = ref(null)
    let shapes = [], animId = null, resizeObs = null
    let W = 0, H = 0, time = 0

    function initShapes() {
      shapes = []
      if (!W || !H) return
      const count = Math.floor((W * H) / props.density)
      const pool = [...props.items].sort(() => Math.random() - 0.5)
      const cols = Math.ceil(Math.sqrt(count * (W / H)))
      const rows = Math.ceil(count / cols)

      for (let i = 0; i < count; i++) {
        const el = pool[i % pool.length]
        shapes.push({
          hx: ((i % cols) + 0.5 + (Math.random() - 0.5) * 0.8) * (W / cols),
          hy: (Math.floor(i / cols) + 0.5 + (Math.random() - 0.5) * 0.8) * (H / rows),
          x: 0, y: 0,
          phase: Math.random() * Math.PI * 2,
          speed: 0.45 + Math.random() * 0.7,
          ampX: 8 + Math.random() * 14,
          ampY: 6 + Math.random() * 11,
          opacity: 0.2 + Math.random() * 0.2,
          ...el,
        })
      }
    }

    function drawPill(ctx, s) {
      ctx.font = "500 8px ui-monospace, 'Cascadia Code', monospace"
      const w = ctx.measureText(s.label).width + 18
      const x = s.x - w / 2, y = s.y - 8

      ctx.beginPath()
      ctx.roundRect(x, y, w, 16, 8)
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      ctx.fillStyle = 'rgba(255,255,255,0.62)'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(s.label, x + 9, s.y + 0.5)
    }

    function drawNum(ctx, s) {
      ctx.font = "600 11px ui-monospace, 'Cascadia Code', monospace"
      ctx.fillStyle = 'rgba(255,255,255,0.5)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(s.label, s.x, s.y)
    }

    function draw() {
      const canvas = canvasRef.value
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, W, H)
      if (!REDUCED_MOTION) time += 0.012

      shapes.forEach(s => {
        s.x = s.hx + Math.sin(time * s.speed + s.phase) * s.ampX
        s.y = s.hy + Math.cos(time * s.speed * 0.7 + s.phase) * s.ampY
        ctx.globalAlpha = s.opacity
        s.kind === 'num' ? drawNum(ctx, s) : drawPill(ctx, s)
        ctx.globalAlpha = 1
      })

      animId = requestAnimationFrame(draw)
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
      initShapes()
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
