import { defineComponent, h, ref, onMounted, onUnmounted, computed } from 'vue'
import { useRipple } from '../../composables/useRipple.js'

const NUM_RAYS   = 12
const RAY_DELAYS = [0, 0.72, 0.28, 1.05, 0.51, 0.18, 0.88, 0.42, 0.63, 0.95, 0.35, 0.77]

// Lottie animation data (toggle circle sliding left ↔ right, frames 0–14 @ 30 fps)
const TOGGLE_ANIM = {"v":"5.6.5","fr":30,"ip":0,"op":15,"w":32,"h":32,"nm":"toggle","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"toggle","sr":1,"ks":{"o":{"a":0,"k":100,"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[16,16,0],"ix":2},"a":{"a":0,"k":[12,12,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-1.657,0],[0,-1.657],[1.657,0],[0,1.657]],"o":[[1.657,0],[0,1.657],[-1.657,0],[0,-1.657]],"v":[[0,-3],[3,0],[0,3],[-3,0]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0,0,0,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":2,"lj":2,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":1,"k":[{"i":{"x":0.337,"y":1},"o":{"x":0.666,"y":0},"t":0,"s":[8,12],"to":[1.333,0],"ti":[-1.333,0]},{"t":15,"s":[16,12]}],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"circle","np":2,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false},{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[-3.866,0],[0,0],[0,-3.866],[3.866,0],[0,0],[0,3.866]],"o":[[0,0],[3.866,0],[0,3.866],[0,0],[-3.866,0],[0,-3.866]],"v":[[-4,-7],[4,-7],[11,0],[4,7],[-4,7],[-11,0]],"c":true},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0,0,0,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":2,"lj":2,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tr","p":{"a":0,"k":[12,12],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"toggle","np":2,"cix":2,"bm":0,"ix":2,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":15,"st":0,"bm":0}],"markers":[]}

/* Three-state theme: light → dark → auto (follows the OS, live).
   The head boot script applied the saved preference before first paint. */
const CYCLE = { light: 'dark', dark: 'auto', auto: 'light' }

export default defineComponent({
  name: 'BulbCard',

  setup() {
    const systemDark = matchMedia('(prefers-color-scheme: dark)')
    const pref   = ref(document.documentElement.dataset.themePref || 'auto')
    const isDark = ref(document.documentElement.dataset.theme === 'dark')
    const { spawnRipple, renderRipples } = useRipple()
    const lottieEl = ref(null)
    let lottieAnim = null

    function apply() {
      const dark = pref.value === 'dark' || (pref.value === 'auto' && systemDark.matches)
      const changed = dark !== isDark.value
      isDark.value = dark
      document.documentElement.dataset.theme = dark ? 'dark' : ''
      document.documentElement.dataset.themePref = pref.value
      try { localStorage.setItem('upa-theme', pref.value) } catch (e) {}

      if (lottieAnim && changed) {
        lottieAnim.setDirection(dark ? 1 : -1)
        lottieAnim.goToAndPlay(dark ? 0 : 14, true)
      }
    }

    // Follow live OS changes while in auto
    function onSystemChange() {
      if (pref.value === 'auto') apply()
    }

    onMounted(() => {
      systemDark.addEventListener('change', onSystemChange)
      if (!window.lottie || !lottieEl.value) return
      lottieAnim = window.lottie.loadAnimation({
        container:     lottieEl.value,
        renderer:      'svg',
        loop:          false,
        autoplay:      false,
        animationData: TOGGLE_ANIM,
      })
      lottieAnim.goToAndStop(isDark.value ? 14 : 0, true)
    })

    onUnmounted(() => systemDark.removeEventListener('change', onSystemChange))

    function toggle(e) {
      pref.value = CYCLE[pref.value] || 'light'
      apply()
      spawnRipple(e)
    }

    const tooltip = computed(() => ({
      light: 'Switch to dark mode 🌙',
      dark:  'Match my system 🖥️',
      auto:  isDark.value ? 'Auto — following your system 🌙\nClick for light mode'
                          : 'Auto — following your system ☀️\nClick for light mode',
    }[pref.value]))

    return () => {
      const rayArms = Array.from({ length: NUM_RAYS }, (_, i) =>
        h('div', {
          class: 'ray-arm',
          style: { transform: `rotate(${i * (360 / NUM_RAYS)}deg)` },
        }, [
          h('div', {
            class: 'ray-bar',
            style: { animationDelay: RAY_DELAYS[i] + 's' },
          }),
        ])
      )

      return h('div', {
        class: ['bento-card', 'bulb-card', isDark.value ? 'is-dark' : '', pref.value === 'auto' ? 'is-auto' : ''],
        onClick: toggle,
        'data-tooltip': tooltip.value,
      }, [

        // ── Action icon (Lottie toggle) ────────────────────────
        h('div', { class: 'action-icon' }, [
          h('div', { class: 'bulb-lottie', ref: lottieEl }),
        ]),

        // ── Auto badge — visible when following the system ──
        h('span', { class: 'bulb-auto-badge' }, [
          h('svg', {
            width: 11, height: 11, viewBox: '0 0 24 24', fill: 'none',
            stroke: 'currentColor', 'stroke-width': 2.4,
            'stroke-linecap': 'round', 'stroke-linejoin': 'round',
          }, [
            h('rect', { x: 2, y: 4, width: 20, height: 13, rx: 2 }),
            h('path', { d: 'M8 21h8M12 17v4' }),
          ]),
          'auto',
        ]),

        // ── Icon ──────────────────────────────────────────
        h('div', { class: 'icon-wrap' }, [

          // Sun — fades out + rotates away when hidden
          h('div', { class: isDark.value ? 'sun hidden' : 'sun' }, [
            ...rayArms,
            h('div', { class: 'sun-circle' }),
          ]),

          // Moon — fades in + rotates into view when visible
          h('div', { class: isDark.value ? 'moon visible' : 'moon' }, [
            h('div', { class: 'moon-stars' }, [
              h('div', { class: 'mstar' }),
              h('div', { class: 'mstar' }),
              h('div', { class: 'mstar' }),
            ]),
            h('div', { class: 'moon-shape' }),
          ]),
        ]),

        ...renderRipples(),
      ])
    }
  },
})
