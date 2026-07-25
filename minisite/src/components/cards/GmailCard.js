import { defineComponent, h, ref, onMounted, watch } from 'vue'
import { ICON_COPY } from '../../assets/icons/icons.js'
import { useAnimReplay } from '../../composables/useAnimReplay.js'
import { useRipple } from '../../composables/useRipple.js'
import { profile } from '../../siteData.js'

// Lottie checkmark — trim-path draw, 45 frames @ 30 fps
const CHECKMARK_ANIM = {"v":"5.7.1","fr":30,"ip":0,"op":45,"w":32,"h":32,"nm":"checkMark","ddd":0,"assets":[],"layers":[{"ddd":0,"ind":1,"ty":4,"nm":"checkmark","sr":1,"ks":{"o":{"a":1,"k":[{"i":{"x":[0.833],"y":[0.833]},"o":{"x":[0.167],"y":[0.167]},"t":0,"s":[0]},{"t":5,"s":[100]}],"ix":11},"r":{"a":0,"k":0,"ix":10},"p":{"a":0,"k":[16,16,0],"ix":2},"a":{"a":0,"k":[12,12,0],"ix":1},"s":{"a":0,"k":[100,100,100],"ix":6}},"ao":0,"shapes":[{"ty":"gr","it":[{"ind":0,"ty":"sh","ix":1,"ks":{"a":0,"k":{"i":[[0,0],[0,0],[0,0]],"o":[[0,0],[0,0],[0,0]],"v":[[8,-5.5],[-3,5.5],[-8,0.5]],"c":false},"ix":2},"nm":"Path 1","mn":"ADBE Vector Shape - Group","hd":false},{"ty":"st","c":{"a":0,"k":[0,0,0,1],"ix":3},"o":{"a":0,"k":100,"ix":4},"w":{"a":0,"k":2,"ix":5},"lc":2,"lj":2,"bm":0,"nm":"Stroke 1","mn":"ADBE Vector Graphic - Stroke","hd":false},{"ty":"tm","s":{"a":1,"k":[{"i":{"x":[0.3],"y":[1]},"o":{"x":[0.3],"y":[0]},"t":0,"s":[100]},{"t":45,"s":[0]}],"ix":1},"e":{"a":0,"k":100,"ix":2},"o":{"a":0,"k":0,"ix":3},"m":1,"ix":3,"nm":"Trim Paths 1","mn":"ADBE Vector Filter - Trim","hd":false},{"ty":"tr","p":{"a":0,"k":[12,11.5],"ix":2},"a":{"a":0,"k":[0,0],"ix":1},"s":{"a":0,"k":[100,100],"ix":3},"r":{"a":0,"k":0,"ix":6},"o":{"a":0,"k":100,"ix":7},"sk":{"a":0,"k":0,"ix":4},"sa":{"a":0,"k":0,"ix":5},"nm":"Transform"}],"nm":"checkmark","np":3,"cix":2,"bm":0,"ix":1,"mn":"ADBE Vector Group","hd":false}],"ip":0,"op":45,"st":0,"bm":0}],"markers":[]}

const EMAIL = profile.email

export default defineComponent({
  name: 'GmailCard',

  props: {
    classes: { type: String, default: '' },
  },

  setup(props) {
    const copied   = ref(false)
    const checkEl  = ref(null)
    const { animEl, replay } = useAnimReplay()
    const { spawnRipple, renderRipples } = useRipple()
    let lottieAnim = null
    let checkTimer = null
    let timer      = null

    onMounted(() => {
      if (!window.lottie || !checkEl.value) return
      lottieAnim = window.lottie.loadAnimation({
        container:     checkEl.value,
        renderer:      'svg',
        loop:          false,
        autoplay:      false,
        animationData: CHECKMARK_ANIM,
      })
      lottieAnim.setSpeed(2)
    })

    // Play the checkmark draw animation in sync with the text fade-in
    watch(copied, (val) => {
      if (!lottieAnim) return
      if (val) {
        lottieAnim.goToAndStop(0, true)
        clearTimeout(checkTimer)
        checkTimer = setTimeout(() => lottieAnim.play(), 300)
      } else {
        clearTimeout(checkTimer)
        lottieAnim.goToAndStop(0, true)
      }
    })

    // navigator.clipboard is undefined off https/localhost — fall back to execCommand
    function legacyCopy(text) {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px'
      document.body.appendChild(ta)
      ta.select()
      ta.setSelectionRange(0, text.length)   // iOS Safari needs the explicit range
      const ok = document.execCommand('copy')
      ta.remove()
      return ok
    }

    function flashCopied() {
      copied.value = true
      clearTimeout(timer)
      timer = setTimeout(() => { copied.value = false }, 2000)
    }

    function handleCopy() {
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(EMAIL)
          .then(flashCopied)
          .catch(() => { if (legacyCopy(EMAIL)) flashCopied() })
        return
      }
      if (legacyCopy(EMAIL)) flashCopied()
    }

    return () => {
      const classes = ['bento-card', 'gmail-card', props.classes]
        .filter(Boolean).join(' ')

      return h('div', {
        class: classes,
        onClick: (e) => { spawnRipple(e); handleCopy() },
        onMouseenter: replay,
        'data-tooltip': 'Click to copy my email address 📨',
      }, [
        // Action icon — single persistent element so CSS transitions can fire
        h('span', { class: `action-icon${copied.value ? ' gmail-copied-label' : ''}` }, [
          h('img', {
            class: `gm-copy-icon${copied.value ? ' gm-copy-icon--out' : ''}`,
            src: ICON_COPY,
            alt: 'Copy email',
          }),
          h('span', { class: `gm-copied-text${copied.value ? ' gm-copied-text--in' : ''}` }, [
            h('div', { class: 'gm-check-lottie', ref: checkEl }),
            'Copied',
          ]),
        ]),

        // Animated Gmail logo SVG — animations rewind on mouseenter
        h('svg', {
          ref: animEl,
          class: 'gm-svg',
          viewBox: '52 42 88 66',
          width: '64',
          height: '64',
          xmlns: 'http://www.w3.org/2000/svg',
        }, [
          h('path', { class: 'gm-from-top', fill: '#c5221f', d: 'M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2' }),
          h('path', { class: 'gm-from-top', fill: '#ea4335', d: 'M72 74V48l24 18 24-18v26L96 92' }),
          h('path', { class: 'gm-from-top', fill: '#fbbc04', d: 'M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2' }),
          h('path', { class: 'gm-from-left',  fill: '#4285f4', d: 'M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6' }),
          h('path', { class: 'gm-from-right', fill: '#34a853', d: 'M120 108h14c3.32 0 6-2.69 6-6V59l-20 15' }),
        ]),

        ...renderRipples(),
      ])
    }
  },
})
