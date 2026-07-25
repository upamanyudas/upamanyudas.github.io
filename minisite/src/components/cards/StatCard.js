import { defineComponent, h } from 'vue'
import { ICON_EXPAND, ICON_SHRINK } from '../../assets/icons/icons.js'
import { useExpandOverlay } from '../../composables/useExpandOverlay.js'
import { useRipple } from '../../composables/useRipple.js'
import { stats } from '../../siteData.js'

/**
 * StatCard — headline impact number; expands to an anonymised breakdown.
 * Content lives in _data/minisite/stats.yml (no company names on site).
 *
 * Props:
 *   statKey : key in stats.cards (e.g. 'statmoney' | 'statusers')
 */
export default defineComponent({
  name: 'StatCard',

  props: {
    statKey: { type: String, required: true },
  },

  setup(props) {
    const stat = stats.cards.find(c => c.key === props.statKey) || {}
    const cardClass = props.statKey === 'statmoney' ? 'stat-money-card' : 'stat-users-card'
    const { cardEl, innerEl, expanded, settled, closing, expandedStyle, open, close } = useExpandOverlay()
    const { spawnRipple, renderRipples } = useRipple()

    function guardedOpen() {
      if (cardEl.value && cardEl.value.closest('.grid-slot--dim')) return
      open()
    }

    return () => h('div', { class: 'stat-card-wrapper' }, [

      // ── Collapsed card ──────────────────────────────────────
      h('div', {
        ref:            cardEl,
        class:          ['bento-card', 'stat-card', cardClass, expanded.value ? 'stat-card--ghost' : ''].filter(Boolean).join(' '),
        onClick:        guardedOpen,
        'data-tooltip': stat.tooltip,
      }, [
        h('a', {
          class:   'action-icon',
          href:    '#',
          onClick: e => { e.preventDefault(); guardedOpen() },
        }, [h('img', { src: ICON_EXPAND, alt: 'Expand' })]),

        h('span', { class: 'stat-value' }, stat.value),
        h('span', { class: 'stat-label' }, stat.label),
      ]),

      // ── Expanded overlay (breakdown) ────────────────────────
      expanded.value ? h('div', null, [

        h('div', {
          class:       ['about-backdrop', closing.value ? 'about-backdrop--out' : ''].join(' '),
          onClick:     close,
          onWheel:     e => e.preventDefault(),
          onTouchmove: e => e.preventDefault(),
        }),

        h('div', {
          class: [
            'about-expanded-card',
            settled.value  ? 'about-expanded-card--settled' : '',
            closing.value  ? 'about-expanded-card--closing' : '',
          ].filter(Boolean).join(' '),
          style:   expandedStyle(),
          onClick: spawnRipple,
        }, [
          h('button', {
            class:          'about-shrink-btn',
            onClick:        e => { e.stopPropagation(); close() },
            'aria-label':   'Close',
            'data-tooltip': 'Press Esc to exit',
          }, [h('img', { src: ICON_SHRINK, alt: 'Close', width: 20, height: 20 })]),

          h('div', { ref: innerEl, class: 'about-expanded-inner stat-expanded-inner' }, [
            h('div', { class: 'about-expanded-content' }, [

              h('span', { class: 'stat-expanded-value' }, stat.value),
              h('p',    { class: 'stat-expanded-label' }, stat.label),

              h('h3', { class: 'stat-breakdown-title' }, stat.breakdown_title),
              h('div', { class: 'stat-breakdown' },
                (stat.breakdown || []).map(row =>
                  h('div', { class: 'stat-breakdown-row' }, [
                    h('span', { class: 'stat-breakdown-segment' }, row.segment),
                    h('p',    { class: 'stat-breakdown-detail' }, row.detail),
                  ])
                )
              ),

              stat.footnote ? h('p', { class: 'stat-footnote' }, stat.footnote) : null,
            ]),
          ]),

          ...renderRipples(),
        ]),

      ]) : null,
    ])
  },
})
