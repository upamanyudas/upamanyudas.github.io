import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'

/**
 * MagneticTokensBg — a canvas-based animated background showing
 * floating design-system token pills, component chips, and colour swatches.
 * Adapted from the magnetic-elements.html demo for use inside a bento card.
 *
 * No mouse interaction (card is small) — elements drift with gentle ambient motion.
 */

// ── Element data ──
const TOKENS = [
  'color.primary', 'color.accent', 'color.surface', 'color.muted',
  'spacing.4', 'spacing.8', 'spacing.16', 'spacing.24',
  'radius.sm', 'radius.md', 'radius.lg',
  'shadow.xs', 'shadow.sm',
  'font.size.sm', 'font.size.md', 'font.weight.600',
  'opacity.disabled', 'z.modal',
  'transition.fast',
]

const COMPONENTS = [
  'Button', 'Badge', 'Tag', 'Input', 'Toggle',
  'Modal', 'Tooltip', 'Card', 'Avatar', 'Tabs',
]

const SWATCHES = [
  { hex: '#ffffff', name: 'white',   r: 255, g: 255, b: 255 },
  { hex: '#faf9f7', name: 'neutral', r: 250, g: 249, b: 247 },
  { hex: '#008B8B', name: 'teal',    r: 0,   g: 139, b: 139 },
  { hex: '#7c5cfc', name: 'purple',  r: 124, g: 92,  b: 252 },
  { hex: '#e0e0ea', name: 'indigo',  r: 224, g: 224, b: 234 },
]

export default defineComponent({
  name: 'MagneticTokensBg',

  setup() {
    const canvasRef = ref(null)
    let shapes = []
    let animId = null
    let W = 0, H = 0
    let time = 0

    function buildPool() {
      const pool = []
      TOKENS.forEach(t => pool.push({ kind: 'token', label: t }))
      COMPONENTS.forEach(c => pool.push({ kind: 'component', label: c }))
      SWATCHES.forEach(s => pool.push({ kind: 'swatch', ...s }))
      return pool
    }

    function initShapes() {
      shapes = []
      if (!W || !H) return

      // Fewer elements — card is small
      const count = Math.floor((W * H) / 8000)
      const pool = buildPool().sort(() => Math.random() - 0.5)

      for (let i = 0; i < count; i++) {
        const el = pool[i % pool.length]
        const cols = Math.ceil(Math.sqrt(count * (W / H)))
        const rows = Math.ceil(count / cols)
        const col = i % cols
        const row = Math.floor(i / cols)
        const hx = (col + 0.5 + (Math.random() - 0.5) * 0.8) * (W / cols)
        const hy = (row + 0.5 + (Math.random() - 0.5) * 0.8) * (H / rows)

        shapes.push({
          hx, hy, x: hx, y: hy,
          // Ambient drift: each element has a unique phase + speed
          phase: Math.random() * Math.PI * 2,
          speed: 0.45 + Math.random() * 0.7,
          ampX: 8 + Math.random() * 14,
          ampY: 6 + Math.random() * 11,
          kind:  el.kind,
          label: el.label || '',
          hex:   el.hex || '',
          name:  el.name || '',
          cr: el.r || 0, cg: el.g || 0, cb: el.b || 0,
          opacity: 0.2 + Math.random() * 0.19,
        })
      }
    }

    // ── Draw helpers (white-on-orange theme) ──

    function drawTokenChip(ctx, s) {
      const fontSize = 8
      ctx.font = `500 ${fontSize}px ui-monospace, 'Cascadia Code', monospace`
      const tw = ctx.measureText(s.label).width
      const pad = 6
      const bw = tw + pad * 2 + 10
      const bh = 16
      const bx = s.x - bw / 2
      const by = s.y - bh / 2
      const r = bh / 2

      ctx.beginPath()
      ctx.roundRect(bx, by, bw, bh, r)
      ctx.fillStyle = 'rgba(255,255,255,0.08)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.25)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      // Dot
      ctx.beginPath()
      ctx.arc(bx + pad + 2, s.y, 2, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.45)'
      ctx.fill()

      // Label
      ctx.fillStyle = 'rgba(255,255,255,0.6)'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(s.label, bx + pad + 7, s.y + 0.5)
    }

    function drawComponentChip(ctx, s) {
      const fontSize = 9
      ctx.font = `500 ${fontSize}px Inter, system-ui`
      const tw = ctx.measureText(s.label).width
      const pad = 7
      const bw = tw + pad * 2 + 12
      const bh = 18
      const bx = s.x - bw / 2
      const by = s.y - bh / 2
      const r = 4

      ctx.beginPath()
      ctx.roundRect(bx, by, bw, bh, r)
      ctx.fillStyle = 'rgba(255,255,255,0.06)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'
      ctx.lineWidth = 0.5
      ctx.stroke()

      // Diamond icon
      const ix = bx + pad + 3
      const iy = s.y
      const is = 3.5
      ctx.save()
      ctx.translate(ix, iy)
      ctx.beginPath()
      ctx.moveTo(0, -is)
      ctx.lineTo(is * 0.866, 0)
      ctx.lineTo(0, is)
      ctx.lineTo(-is * 0.866, 0)
      ctx.closePath()
      ctx.strokeStyle = 'rgba(255,255,255,0.4)'
      ctx.lineWidth = 0.8
      ctx.stroke()
      ctx.restore()

      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'middle'
      ctx.fillText(s.label, bx + pad + 9, s.y + 0.5)
    }

    function drawSwatch(ctx, s) {
      const r = 8
      ctx.beginPath()
      ctx.arc(s.x, s.y - 3, r, 0, Math.PI * 2)
      ctx.fillStyle = s.hex
      ctx.globalAlpha = s.opacity * 0.6
      ctx.fill()
      ctx.globalAlpha = s.opacity
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.font = '500 7px ui-monospace, monospace'
      ctx.fillStyle = 'rgba(255,255,255,0.35)'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'
      ctx.fillText(s.name, s.x, s.y + r + 1)
    }

    // ── Animation loop ──

    function draw() {
      const canvas = canvasRef.value
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, W, H)
      time += 0.012

      shapes.forEach(s => {
        // Gentle ambient drift
        s.x = s.hx + Math.sin(time * s.speed + s.phase) * s.ampX
        s.y = s.hy + Math.cos(time * s.speed * 0.7 + s.phase) * s.ampY

        ctx.globalAlpha = s.opacity

        switch (s.kind) {
          case 'token':     drawTokenChip(ctx, s);     break
          case 'component': drawComponentChip(ctx, s);  break
          case 'swatch':    drawSwatch(ctx, s);         break
        }

        ctx.globalAlpha = 1
      })

      animId = requestAnimationFrame(draw)
    }

    function resize() {
      const canvas = canvasRef.value
      if (!canvas) return
      const rect = canvas.parentElement.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      W = rect.width
      H = rect.height
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      const ctx = canvas.getContext('2d')
      ctx.scale(dpr, dpr)
      initShapes()
    }

    let resizeObs = null

    onMounted(() => {
      resize()
      draw()
      // Use ResizeObserver to handle card size changes
      resizeObs = new ResizeObserver(() => resize())
      if (canvasRef.value?.parentElement) {
        resizeObs.observe(canvasRef.value.parentElement)
      }
    })

    onUnmounted(() => {
      if (animId) cancelAnimationFrame(animId)
      if (resizeObs) resizeObs.disconnect()
    })

    return () => h('canvas', {
      ref: canvasRef,
      class: 'ads-card-canvas',
    })
  },
})
