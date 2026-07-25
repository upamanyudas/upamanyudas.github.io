import { defineComponent, h } from 'vue'
import { ICON_EXTERNAL_LINK } from '../../assets/icons/icons.js'
import { useAnimReplay } from '../../composables/useAnimReplay.js'
import { profile } from '../../siteData.js'

const HREF    = profile.linkedin
const TOOLTIP = 'Connect with me on LinkedIn 💼'

export default defineComponent({
  name: 'LinkedInCard',

  props: {
    classes: { type: String, default: '' },
  },

  setup(props) {
    const { animEl, replay } = useAnimReplay()

    return () => {
      const classes = ['bento-card', 'linkedin-card', props.classes]
        .filter(Boolean).join(' ')

      return h('div', {
        class: classes,
        'data-tooltip': TOOLTIP,
        onMouseenter: replay,
        onClick: () => window.open(HREF, '_blank', 'noopener,noreferrer'),
      }, [
        h('a', {
          class: 'action-icon',
          href: HREF,
          target: '_blank',
          rel: 'noopener noreferrer',
          onClick: (e) => e.stopPropagation(),
        }, [
          h('img', { src: ICON_EXTERNAL_LINK, alt: 'Open LinkedIn' }),
        ]),

        // Animated LinkedIn "in" SVG — animations rewind on mouseenter
        h('svg', {
          ref: animEl,
          class: 'li-svg',
          viewBox: '0 0 36 36',
          fill: 'none',
          width: '88',
          height: '88',
          xmlns: 'http://www.w3.org/2000/svg',
        }, [
          h('circle', {
            class: 'li-dot',
            cx: '11', cy: '10', r: '2.2',
          }),
          h('path', {
            class: 'li-path',
            d: 'M11 15.5 L11 26',
            style: { '--len': '11', '--draw-dur': '0.38s', '--draw-delay': '0.08s' },
          }),
          h('path', {
            class: 'li-path',
            d: 'M17 15.5 L17 26',
            style: { '--len': '11', '--draw-dur': '0.38s', '--draw-delay': '0.14s' },
          }),
          h('path', {
            class: 'li-path',
            d: 'M17 19.5 C17 17 19 15.5 21 15.5 C23 15.5 25 17 25 19.5 L25 26',
            style: { '--len': '22', '--draw-dur': '0.42s', '--draw-delay': '0.20s' },
          }),
        ]),
      ])
    }
  },
})
