import { defineComponent, h } from 'vue'

/**
 * AdShot — coded reproductions of the ad-tech deck: a splash unit, an echo
 * banner mid-scroll, and a sponsored card built from the same template as
 * editorial. Advertisers are rendered as generic sponsored units on purpose —
 * the reusable card pattern is the point, not any one brand's artwork.
 */
const NAV = [
  { icon: 'M3 10.5 12 3l9 7.5V21H3z', label: 'Home', on: true },
  { icon: 'M4 8h16l-1.2 12H5.2ZM9 8V6a3 3 0 0 1 6 0v2', label: 'Store' },
  { icon: 'M4 11l12-6v14L4 13Zm0 0v3m12-6a3 3 0 0 1 0 6', label: 'Buzz' },
  { icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0', label: 'Profile' },
]

const navIcon = (d, on) => h('svg', {
  class: ['sp-navicon', on ? 'sp-navicon--on' : ''].join(' '),
  viewBox: '0 0 24 24', width: 15, height: 15, fill: 'none',
  stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
}, [h('path', { d })])

const statusBar = () => h('div', { class: 'ap-status' }, [
  h('span', null, '12:54'),
  h('span', { class: 'ap-status-r' }, '▪▪▪ ᯤ ▮'),
])

const nav = () => h('nav', { class: 'sp-nav' }, NAV.map(t =>
  h('span', { class: ['sp-navbtn', t.on ? 'sp-navbtn--on' : ''].join(' '), key: t.label },
    [navIcon(t.icon, t.on), h('em', null, t.label)])))

const phone = (screen, caption) =>
  h('figure', { class: 'ap' }, [
    h('div', { class: 'ap-body' }, [
      h('span', { class: 'sp-notch' }),
      h('div', { class: 'ap-screen' }, screen),
    ]),
    h('figcaption', { class: 'ap-cap' }, caption),
  ])

// ── 1 · Splash-screen ad, dimmed app behind ──
const splash = [
  h('div', { class: 'ap-splash-veil' }),
  h('div', { class: 'ap-splash-bar' }, [h('span'), h('span'), h('span', { class: 'on' }), h('span')]),
  h('div', { class: 'ap-splash-top' }, [h('strong', null, 'Cashless play'), h('span', { class: 'ap-x' }, '×')]),
  h('div', { class: 'ap-splash-card' }, [
    h('div', { class: 'ap-splash-hd' }, [
      h('p', null, 'Play a winning knock, go cashless'),
      h('span', { class: 'ap-scheme' }, [h('i'), h('i', { class: 'b' })]),
    ]),
    h('span', { class: 'ap-splash-fig' }),
    h('span', { class: 'ap-splash-hash' }, '#PlayToPay'),
    h('span', { class: 'ap-cta' }, 'Know More'),
  ]),
]

// ── 2 · Echo banner mid-scroll ──
const echo = [
  statusBar(),
  h('div', { class: 'ap-h2-head' }, [
    h('strong', null, 'Tonight in your city'),
    h('span', { class: 'ap-dim' }, 'Your city · West ⌄'),
  ]),
  h('div', { class: 'ap-tabs' }, ['Movies', 'Events', 'Sports', 'Plays', 'Activities'].map((t, i) =>
    h('span', { class: i === 0 ? 'ap-tab ap-tab--on' : 'ap-tab', key: t }, t))),
  h('div', { class: 'ap-h2-grid' }, [
    ['Workshops', '170+', '#8a6f5e'], ['Kids Zone', '85+', '#e94e8a'], ['Music', '25+', '#2c9c6a'],
  ].map(([n, c, bg]) => h('span', { class: 'ap-h2-tile', style: `background:${bg}`, key: n },
    [h('strong', null, n), h('em', null, c + ' Events')]))),
  h('div', { class: 'ap-echo' }, [
    h('span', { class: 'ap-echo-card' }),
    h('div', { class: 'ap-echo-copy' }, [
      h('strong', null, 'Get ₹500 movie voucher'),
      h('em', null, 'On a new partner credit card'),
      h('span', { class: 'ap-echo-cta' }, 'Know More'),
    ]),
  ]),
  h('div', { class: 'ap-h2-sec' }, [h('strong', null, 'Laughter Therapy'), h('em', null, 'See All ›')]),
  h('div', { class: 'ap-h2-row' }, Array.from({ length: 3 }, (_, i) =>
    h('span', { class: 'ap-h2-show', key: i }, h('em', null, 'ONLINE')))),
  nav(),
]

// ── 3 · Sponsored card, identical to editorial ──
const sponsored = [
  h('div', { class: 'ap-sp-head' }, [
    h('span', { class: 'ap-sp-av' }),
    h('div', null, [h('strong', null, 'A studio'), h('em', null, 'Sponsored partner')]),
    h('span', { class: 'ap-follow' }, 'Follow'),
  ]),
  h('div', { class: 'ap-sp-social' }, [h('span', null, '♥ 3,234'), h('span', null, '↗')]),
  h('div', { class: 'ap-sp-art' }, [h('span', { class: 'ap-tag' }, 'SPONSORED'), h('span', { class: 'ap-play' }, '▶')]),
  h('div', { class: 'ap-sp-cta' }, [
    h('strong', null, 'Watch it now — streaming tonight'),
    h('div', { class: 'ap-sp-cta-row' }, [
      h('span', { class: 'ap-sp-brand' }), h('em', null, 'Sponsored partner'),
      h('span', { class: 'ap-cta ap-cta--sm' }, 'Watch Now'),
    ]),
  ]),
  h('div', { class: 'ap-sp-social' }, [h('span', null, '♥ 3,234'), h('span', null, '↗')]),
  h('div', { class: 'ap-sp-peek' }, [h('strong', null, '10% off tacos for your booked movie')]),
]

export default defineComponent({
  name: 'AdShot',
  setup() {
    return () => h('figure', { class: 'shot shot--ad' }, [
      h('div', { class: 'shot-ad-head' }, [
        h('strong', null, 'Ad-tech'),
        h('span', null, 'Contextual, personalised units built from the same card templates as the rest of the app.'),
      ]),
      h('div', { class: 'shot-ad-stage' }, [
        phone(splash, 'Splash-screen banner — the single highest-earning ad unit.'),
        phone(echo, 'Echo banners, dropped into the natural scroll so impressions build inside one flow.'),
        phone(sponsored, 'Same card as editorial, so a paid unit carries far more context than a standard banner.'),
      ]),
    ])
  },
})
