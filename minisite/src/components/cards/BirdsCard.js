import { defineComponent, h } from 'vue'
import { ICON_EXTERNAL_LINK } from '../../assets/icons/icons.js'
import { profile } from '../../siteData.js'

/**
 * BirdsCard — wildlife photography side quest. Hand-drawn SVG kingfisher
 * that blinks on idle and tilts its head when you hover. Links to eBird.
 */
export default defineComponent({
  name: 'BirdsCard',

  setup() {
    return () => h('div', {
      class: 'bento-card birds-card',
      'data-tooltip': profile.birds.tooltip,
      onClick: () => window.open(profile.ebird, '_blank', 'noopener,noreferrer'),
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

      // ── The bird ──
      h('svg', { class: 'birds-svg', viewBox: '0 0 252 252', xmlns: 'http://www.w3.org/2000/svg', 'aria-hidden': 'true' }, [
        // Branch
        h('path', { class: 'birds-branch', d: 'M18 196 C70 188 160 192 236 178', stroke: 'var(--color-text-subtle)', 'stroke-width': '5', 'stroke-linecap': 'round', fill: 'none' }),
        h('path', { class: 'birds-branch', d: 'M170 188 C186 180 198 170 204 158', stroke: 'var(--color-text-subtle)', 'stroke-width': '3.5', 'stroke-linecap': 'round', fill: 'none' }),

        // Legs
        h('path', { d: 'M118 168 L114 190 M136 168 L136 190', stroke: '#7a6a55', 'stroke-width': '3.5', 'stroke-linecap': 'round' }),

        // Tail
        h('path', { class: 'birds-tail', d: 'M150 150 L196 176 L184 184 L146 162 Z', fill: 'var(--color-brand-ebird)', opacity: '0.85' }),

        // Body
        h('path', { d: 'M92 132 C92 106 152 100 162 130 C170 154 150 176 124 176 C102 176 92 154 92 132 Z', fill: 'var(--color-brand-ebird)' }),
        // Belly
        h('path', { d: 'M104 148 C110 168 140 172 152 156 C146 172 128 178 116 172 C106 168 102 158 104 148 Z', fill: '#e9dfc8' }),

        // Head group — tilts on hover
        h('g', { class: 'birds-head' }, [
          h('circle', { cx: '96', cy: '104', r: '25', fill: '#2e5c30' }),
          // Beak
          h('path', { d: 'M76 98 L30 106 L76 114 Z', fill: '#5a4632' }),
          // Eye + blinking lid
          h('circle', { cx: '90', cy: '100', r: '3.2', fill: '#101810' }),
          h('circle', { cx: '91.2', cy: '98.8', r: '1', fill: '#ffffff' }),
          h('rect', { class: 'birds-eyelid', x: '85', y: '95', width: '10', height: '10', rx: '5', fill: '#2e5c30' }),
        ]),

        // Wing
        h('path', { class: 'birds-wing', d: 'M112 128 C136 118 156 126 158 142 C152 158 128 162 112 150 Z', fill: '#24501f', opacity: '0.55' }),
      ]),

      // ── Label ──
      h('div', { class: 'birds-label' }, [
        h('span', { class: 'birds-label-title' }, profile.birds.label),
        h('span', { class: 'birds-label-sub' }, profile.birds.sub),
      ]),
    ])
  },
})
