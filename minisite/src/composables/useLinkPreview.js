import { h, ref, Teleport, onScopeDispose } from 'vue'
import { isLazy } from '../lazyMode.js'

/**
 * useLinkPreview — iOS-style peek for prose links (about bio, case studies).
 * Everything is read off the link itself — href, text, brand colour — so
 * authoring a link is the only edit. Shots are baked by assets/link-previews/
 * capture.sh; anything without one falls back to the drawn chip.
 */
const SHOT = '/minisite/src/assets/link-previews/'
const OFFSET = 24
const W = 320
const H = 200
const LERP = 0.07

/** Baked capture for a link — name rule mirrors capture.sh. */
function shotSrc(link) {
  const own = link.host === location.host
  const name = ((own ? '' : link.hostname) + link.pathname)
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
  return SHOT + name + '.jpg'
}

function previewOf(link) {
  return {
    src:   shotSrc(link),
    label: link.textContent.trim(),
    sub:   link.hostname.replace(/^www\./, ''),
    color: getComputedStyle(link).color,   // the .brand-* colour it already wears
  }
}

export function useLinkPreview() {
  const isTouch = 'ontouchstart' in window
    || navigator.maxTouchPoints > 0
    || (typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches)
    || window.innerWidth <= 768

  const preview = ref({ visible: false, x: 0, y: 0, src: '' })
  const failed  = ref(false)   // screenshot unavailable → compact chip instead
  let hideTimer = null
  let mouseX = 0, mouseY = 0, smoothX = 0, smoothY = 0, rafId = null

  function lerpVal(a, b, t) { return a + (b - a) * t }

  function animLoop() {
    const pl = isLazy.value ? LERP : 1
    smoothX = lerpVal(smoothX, mouseX, pl)
    smoothY = lerpVal(smoothY, mouseY, pl)
    preview.value = { ...preview.value, x: smoothX, y: smoothY }
    rafId = requestAnimationFrame(animLoop)
  }

  function show(e, link) {
    const shot = previewOf(link)
    clearTimeout(hideTimer)
    mouseX = Math.min(e.clientX + OFFSET, window.innerWidth  - W - 12)
    mouseY = Math.min(e.clientY + OFFSET, window.innerHeight - H - 12)

    if (!preview.value.visible || preview.value.src !== shot.src) {
      smoothX = mouseX
      smoothY = mouseY
      failed.value = false
      preview.value = { visible: true, x: mouseX, y: mouseY, ...shot }
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(animLoop)
    }
  }

  function hide() {
    hideTimer = setTimeout(() => {
      preview.value = { ...preview.value, visible: false }
      cancelAnimationFrame(rafId)
    }, 80)
  }

  /** Delegated hover for injected HTML — bind to the prose container. */
  function onLinkOver(e) {
    if (isTouch) return
    const link = e.target.closest?.('a.bio-link')
    if (!link) { hide(); return }
    show(e, link)
  }

  /** Tag every prose link so it peeks, then warm the screenshot cache. */
  function bindLinks(root) {
    if (!root) return
    root.querySelectorAll('a[href]').forEach(a => a.classList.add('bio-link'))
    if (isTouch) return
    root.querySelectorAll('a.bio-link').forEach(a => { new Image().src = shotSrc(a) })
  }

  const handlers = { onMouseover: onLinkOver, onMousemove: onLinkOver, onMouseleave: hide }

  onScopeDispose(() => { clearTimeout(hideTimer); cancelAnimationFrame(rafId) })

  function renderPreview() {
    return h(Teleport, { to: 'body' }, [
      h('div', {
        class: [
          'bio-link-preview',
          preview.value.visible ? 'bio-link-preview--visible' : '',
          failed.value ? 'bio-link-preview--chip' : '',
        ].filter(Boolean).join(' '),
        style: { left: preview.value.x + 'px', top: preview.value.y + 'px' },
      }, [
        // No screenshot (bot-blocked, offline) → small branded chip
        failed.value ? h('div', { class: 'bio-link-chip' }, [
          h('span', { class: 'bio-link-chip-dot', style: { background: preview.value.color } }),
          h('span', { class: 'bio-link-chip-text' }, [
            h('span', { class: 'bio-link-chip-label', style: { color: preview.value.color } }, preview.value.label),
            h('span', { class: 'bio-link-chip-sub' }, preview.value.sub),
          ]),
        ]) : preview.value.src ? h('img', {
          key:     preview.value.src,
          class:   'bio-link-preview-img',
          src:     preview.value.src,
          alt:     'Preview',
          onError: () => { failed.value = true },
        }) : null,
      ]),
    ])
  }

  return { handlers, bindLinks, renderPreview, hide, isTouch }
}
