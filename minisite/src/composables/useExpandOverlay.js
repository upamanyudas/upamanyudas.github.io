import { ref, nextTick } from 'vue'

/**
 * useExpandOverlay — shared expand-to-overlay composable.
 *
 * Encapsulates the FLIP open/close animation, Escape key handling,
 * scroll-lock, and state management used by quote cards and similar
 * expandable overlays.
 *
 * Options:
 *   animMs : number — animation duration in ms (default 700)
 *   maxW   : number — max expanded width in px (default 560)
 *   maxH   : number — max expanded height in px (default 660)
 *
 * Returns:
 *   cardEl, innerEl     — template refs for the collapsed card and inner scroll container
 *   expanded, settled, closing — reactive state flags
 *   expandedStyle()     — computed inline style for the expanded overlay position
 *   open(), close()     — trigger open/close transitions
 */
export function useExpandOverlay({ animMs = 700, maxW = 560, maxH = 660 } = {}) {
  const cardEl   = ref(null)
  const innerEl  = ref(null)
  const expanded = ref(false)
  const settled  = ref(false)
  const closing  = ref(false)

  let startRect  = null
  let closeTimer = null

  function onKeydown(e) { if (e.key === 'Escape') close() }

  function expandedStyle() {
    if (!startRect) return {}
    const vpW     = window.innerWidth
    const vpH     = window.innerHeight
    const targetW = Math.min(maxW, vpW - 48)
    const targetH = Math.min(maxH, vpH * 0.85)
    const targetL = (vpW - targetW) / 2
    const targetT = (vpH - targetH) / 2

    if (!settled.value || closing.value) {
      return {
        left:   startRect.left   + 'px',
        top:    startRect.top    + 'px',
        width:  startRect.width  + 'px',
        height: startRect.height + 'px',
      }
    }
    return {
      left:   Math.max(24, targetL) + 'px',
      top:    Math.max(24, targetT) + 'px',
      width:  targetW + 'px',
      height: targetH + 'px',
    }
  }

  async function open() {
    if (expanded.value) return
    startRect      = cardEl.value.getBoundingClientRect()
    expanded.value = true
    settled.value  = false
    closing.value  = false
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow            = 'hidden'
    document.addEventListener('keydown', onKeydown)
    await nextTick()
    if (innerEl.value) innerEl.value.scrollTop = 0
    requestAnimationFrame(() => {
      requestAnimationFrame(() => { settled.value = true })
    })
  }

  function close() {
    if (closing.value) return
    closing.value = true
    clearTimeout(closeTimer)
    closeTimer = setTimeout(() => {
      expanded.value = false
      settled.value  = false
      closing.value  = false
      startRect      = null
      document.documentElement.style.overflow = ''
      document.body.style.overflow            = ''
      document.removeEventListener('keydown', onKeydown)
    }, animMs + 20)
  }

  return {
    cardEl,
    innerEl,
    expanded,
    settled,
    closing,
    expandedStyle,
    open,
    close,
  }
}
