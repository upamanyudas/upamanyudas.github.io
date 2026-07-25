import { defineComponent, h } from 'vue'
import { ICON_EXPAND, ICON_SHRINK } from '../../assets/icons/icons.js'
import { useExpandOverlay } from '../../composables/useExpandOverlay.js'
import { useRipple } from '../../composables/useRipple.js'
import { profile, templateHTML } from '../../siteData.js'

const QUOTE_ICON = '/minisite/src/assets/icons/quote.svg'

/**
 * QuoteCard — expandable philosophy card.
 * Quote + body come from _data/minisite/profile.yml via a Jekyll template.
 *
 * Props:
 *   quoteKey  : key in profile.quotes ('ux' | 'craft')
 *   cardClass : e.g. 'ux-quote-card' | 'ds-quote-card'
 */
export default defineComponent({
  name: 'QuoteCard',

  props: {
    quoteKey:  { type: String, required: true },
    cardClass: { type: String, required: true },
  },

  setup(props) {
    const { cardEl, innerEl, expanded, settled, closing, expandedStyle, open, close } = useExpandOverlay()
    const { spawnRipple, renderRipples } = useRipple()

    const quote = profile.quotes[props.quoteKey] || {}
    // Jekyll-rendered fragments (quote line + body paragraphs)
    const tpl = document.createElement('div')
    tpl.innerHTML = templateHTML(`tpl-quote-${props.quoteKey}`)
    const quoteHTML = tpl.querySelector('.quote-text-src')?.innerHTML || ''
    const bodyHTML  = tpl.querySelector('.quote-body-src')?.innerHTML || ''

    function guardedOpen() {
      if (cardEl.value && cardEl.value.closest('.grid-slot--dim')) return
      open()
    }

    return () => h('div', { class: `${props.cardClass}-wrapper` }, [

      // ── Collapsed card ──────────────────────────────────────
      h('div', {
        ref:            cardEl,
        class:          ['bento-card', props.cardClass, expanded.value ? `${props.cardClass}--ghost` : ''].filter(Boolean).join(' '),
        onClick:        guardedOpen,
        'data-tooltip': quote.tooltip,
      }, [
        h('a', {
          class:   'action-icon',
          href:    '#',
          onClick: e => { e.preventDefault(); guardedOpen() },
        }, [h('img', { src: ICON_EXPAND, alt: 'Expand' })]),

        h('img', { class: 'quote-icon', src: QUOTE_ICON, alt: '' }),
        h('p',    { class: 'quote-text', innerHTML: quoteHTML }),
        h('span', { class: 'design-principle' }, 'My design principle'),
      ]),

      // ── Expanded overlay ────────────────────────────────────
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

          h('div', { ref: innerEl, class: `about-expanded-inner ${props.cardClass}-expanded-inner` }, [
            h('div', { class: 'about-expanded-content' }, [

              h('img', { class: `${props.cardClass}-expanded-icon quote-expanded-icon`, src: QUOTE_ICON, alt: '' }),

              h('p',   { class: `${props.cardClass}-expanded-quote quote-expanded-quote`, innerHTML: quoteHTML }),

              h('div', { class: `${props.cardClass}-expanded-body quote-expanded-body`, innerHTML: bodyHTML }),

              h('span', { class: 'design-principle' }, 'My design principle'),
            ]),
          ]),

          ...renderRipples(),
        ]),

      ]) : null,
    ])
  },
})
