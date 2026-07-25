import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'
import { ICON_EXTERNAL_LINK } from '../../assets/icons/icons.js'
import { profile } from '../../siteData.js'

/**
 * BirdsCard — wildlife photography side quest. Links to eBird.
 * "Bird Flying" by Diogo de Freitas, LottieFiles Simple License.
 * Rests on frame 0; loops while hovered.
 */
const ANIM = '/minisite/src/assets/animations/bird-flying.json'

export default defineComponent({
  name: 'BirdsCard',

  setup() {
    const birdEl = ref(null)
    let anim = null

    onMounted(() => {
      if (!window.lottie || !birdEl.value) return
      anim = window.lottie.loadAnimation({
        container: birdEl.value,
        renderer:  'svg',
        loop:      true,
        autoplay:  false,
        path:      ANIM,
      })
    })

    onUnmounted(() => anim && anim.destroy())

    return () => h('div', {
      class: 'bento-card birds-card',
      'data-tooltip': profile.birds.tooltip,
      onClick: () => window.open(profile.ebird, '_blank', 'noopener,noreferrer'),
      onMouseenter: () => anim && anim.goToAndPlay(0, true),
      onMouseleave: () => anim && anim.goToAndStop(0, true),
    }, [
      h('a', {
        class: 'action-icon',
        href: profile.ebird,
        target: '_blank',
        rel: 'noopener noreferrer',
        onClick: (e) => e.stopPropagation(),
      }, [
        h('img', { src: ICON_EXTERNAL_LINK, alt: 'Open eBird profile' }),
      ]),

      h('div', { class: 'birds-lottie', ref: birdEl, 'aria-hidden': 'true' }),

      h('div', { class: 'birds-label' }, [
        h('span', { class: 'birds-label-title' }, profile.birds.label),
        h('span', { class: 'birds-label-sub' }, profile.birds.sub),
      ]),
    ])
  },
})
