// Interaction engine adapted from mchiu.co.uk (Alex Chiu), rebuilt for upamanyu.in
import { createApp } from 'vue'
import App from './App.js'
import { isLazy } from './lazyMode.js'
import { watch } from 'vue'

// ── Smooth scroll ─────────────────────────────────────────────────────────────
// Intercepts wheel events and lerps the scroll position for an inertia feel.
// Falls back to native smooth scrolling when reduced motion is preferred
// (e.g. OS low-power mode, accessibility setting) to avoid dropped-frame jank.
// Respects the lazy-mode toggle: dynamically adds/removes the wheel listener
// so that snappy mode has zero scroll latency (no passive:false on window).
;(function initSmoothScroll() {
  const prefersReducedMotion =
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    // Use native smooth scrolling — no rAF loop, no wheel hijack
    document.documentElement.style.scrollBehavior = 'smooth'
    return
  }

  const LERP    = 0.09   // lower = slower / more buttery
  const SPEED   = 1.0    // wheel delta multiplier

  let current = window.scrollY
  let target  = window.scrollY
  let rafId   = null

  function tick() {
    const dist = target - current
    if (Math.abs(dist) < 0.5) {
      current = target
      window.scrollTo(0, Math.round(current))
      rafId = null
      return
    }
    current += dist * LERP
    window.scrollTo(0, current)
    rafId = requestAnimationFrame(tick)
  }

  function onWheel(e) {
    // Let expanded overlay cards handle their own scrolling
    if (e.target.closest('.about-expanded-card') || e.target.closest('.cs-expanded')) return

    e.preventDefault()

    // Normalise across deltaMode (pixel / line / page)
    let delta = e.deltaY
    if (e.deltaMode === 1) delta *= 40
    if (e.deltaMode === 2) delta *= window.innerHeight

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight
    target = Math.max(0, Math.min(target + delta * SPEED, maxScroll))

    if (!rafId) rafId = requestAnimationFrame(tick)
  }

  // Keep current & target in sync if scroll happens another way (back-to-top, keyboard, etc.)
  window.addEventListener('scroll', () => {
    if (!rafId) {
      current = window.scrollY
      target  = window.scrollY
    }
  }, { passive: true })

  // Dynamically attach/detach the wheel listener based on lazy mode.
  // This avoids the passive:false scroll latency penalty when snappy.
  function attachSmooth() {
    window.addEventListener('wheel', onWheel, { passive: false })
  }

  function detachSmooth() {
    window.removeEventListener('wheel', onWheel)
    // Kill any in-flight lerp so it doesn't fight native scroll
    if (rafId) { cancelAnimationFrame(rafId); rafId = null }
    current = window.scrollY
    target  = window.scrollY
  }

  // Initial state
  if (isLazy.value) attachSmooth()

  // React to toggle changes
  watch(isLazy, (lazy) => {
    if (lazy) attachSmooth()
    else detachSmooth()
  })
})()

// ── iOS :active fix ──────────────────────────────────────────────────────────
// iOS Safari won't fire :active on touch without a touchstart listener.
document.addEventListener('touchstart', () => {}, { passive: true })

// ── App ───────────────────────────────────────────────────────────────────────
createApp(App).mount('#app')
