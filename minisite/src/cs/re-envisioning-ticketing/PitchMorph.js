import { defineComponent, h, ref } from 'vue'

/**
 * PitchMorph — the old home and the new home, coded so they can actually move.
 * Toggling the era runs an element FLIP: the outgoing screen's rows lift and
 * fade out top-down while the incoming rows rise into place, and the bottom
 * nav cross-morphs from five ticketing icons to four tabs.
 */
const NAV_ICONS = {
  home:   'M3 10.5 12 3l9 7.5V21H3z',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4',
  music:  'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm11-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  flame:  'M12 3c3 4 6 5.5 6 9a6 6 0 1 1-12 0c0-2 1-3.5 2.5-5C9 8.5 10 7 12 3Z',
  more:   'M4 7h16M4 12h16M4 17h16',
  store:  'M4 8h16l-1.2 12H5.2ZM9 8V6a3 3 0 0 1 6 0v2',
  buzz:   'M4 11l12-6v14L4 13Zm0 0v3m12-6a3 3 0 0 1 0 6',
  user:   'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
}
const navIcon = (name, on) => h('svg', {
  class: ['sp-navicon', on ? 'sp-navicon--on' : ''].join(' '),
  viewBox: '0 0 24 24', width: 15, height: 15, fill: 'none',
  stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
}, [h('path', { d: NAV_ICONS[name] })])

const navBar = (cls, tabs) => h('nav', { class: `sp-nav ${cls}` }, tabs.map(t =>
  h('span', { class: ['sp-navbtn', t.on ? 'sp-navbtn--on' : ''].join(' '), key: t.label || t.icon },
    [navIcon(t.icon, t.on), t.label ? h('em', null, t.label) : null])))

const poster = (rating, name, from, to) => h('div', { class: 'sp-poster' }, [
  h('span', { class: 'sp-poster-art', style: `background:linear-gradient(150deg,${from},${to})` }),
  h('span', { class: 'sp-poster-rate' }, '♥ ' + rating),
  h('span', { class: 'sp-poster-name' }, name),
])
const GRID = [
  ['Workshops\n& More', '210+ Events', '#8a6f5e'], ['StayFit\nLive', '15+ Events', '#f0b400'],
  ['Kids\nZone', '85+ Events', '#e94e8a'], ['Interactive\nGames', '10+ Events', '#22b3a4'],
  ['Arts &\nCrafts', '25+ Events', '#ee6a58'], ['Theatre\nShows', '35+ Events', '#233158'],
]

// One animated row; i sets the stagger.
const row = (i, children) => h('div', { class: 'sp-row', key: i, style: { transitionDelay: `${i * 55}ms` } }, children)

const beforeRows = [
  row(0, h('div', { class: 'sp-tabrow' }, ['All', 'Movies', 'Events', 'Plays', 'S'].map((t, i) =>
    h('span', { class: i === 0 ? 'sp-tab sp-tab--on' : 'sp-tab', key: t }, t)))),
  row(1, h('div', { class: 'sp-hero sp-hero--promo' }, [
    h('span', { class: 'sp-hero-kick' }, 'NOW IN CINEMAS'),
    h('strong', null, 'Book your tickets, get up to ₹120 back'),
  ])),
  row(2, [
    h('p', { class: 'sp-secttl' }, 'Movies Playing'),
    h('div', { class: 'sp-prow' }, [
      poster('95%', 'Endgame', '#1d2b53', '#4a5a8a'),
      poster('85%', 'Hellboy', '#7a1f12', '#d0452a'),
      poster('95%', 'Shazam', '#123a5a', '#2f7db0'),
    ]),
  ]),
  row(3, [
    h('p', { class: 'sp-secttl' }, 'Events Happening'),
    h('div', { class: 'sp-prow' }, [
      h('span', { class: 'sp-ev', style: 'background:linear-gradient(150deg,#b0264a,#f0a020)' }),
      h('span', { class: 'sp-ev', style: 'background:linear-gradient(150deg,#3a2a5a,#c0506a)' }),
      h('span', { class: 'sp-ev', style: 'background:linear-gradient(150deg,#1a5a7a,#5ab0c0)' }),
    ]),
  ]),
]

const afterRows = [
  row(0, h('div', { class: 'sp-home-head' }, [
    h('div', null, [h('strong', null, 'Hey there!'), h('span', { class: 'sp-loc' }, '◍ Home ⌄')]),
    h('div', { class: 'sp-home-right' }, [h('span', { class: 'sp-badge' }, '225p To Go'), h('span', { class: 'sp-avatar' })]),
  ])),
  row(1, h('div', { class: 'sp-hero sp-hero--live' }, [
    h('span', { class: 'sp-hero-eyebrow' }, 'LIVE'),
    h('strong', null, 'A Comedian’s Tale'),
    h('span', { class: 'sp-hero-pill' }, '80 mins · Show duration'),
  ])),
  row(2, h('div', { class: 'sp-wg' }, [
    h('span', { class: 'sp-wg-mark' }, ['watch', h('em', null, 'guide')]),
    h('span', { class: 'sp-wg-copy' }, 'Watch movies at home. Your personal theatre'),
  ])),
  row(3, [
    h('p', { class: 'sp-secttl sp-secttl--dark' }, 'The best of Entertainment'),
    h('div', { class: 'sp-egrid' }, GRID.map(([name, sub, bg]) =>
      h('span', { class: 'sp-etile', style: `background:${bg}`, key: name }, [h('strong', null, name), h('em', null, sub)]))),
  ]),
]

const navBefore = navBar('sp-nav--before', [
  { icon: 'home', on: true }, { icon: 'search' }, { icon: 'music' }, { icon: 'flame' }, { icon: 'more' },
])
const navAfter = navBar('sp-nav--after', [
  { icon: 'home', label: 'Home', on: true }, { icon: 'store', label: 'Store' },
  { icon: 'buzz', label: 'Buzz' }, { icon: 'user', label: 'Profile' },
])

export default defineComponent({
  name: 'PitchMorph',
  setup() {
    const era = ref('before')
    return () =>
      h('figure', { class: 'pm' }, [
        h('div', { class: 'cs-tabs cs-tabs--wide' },
          ['before', 'after'].map(e =>
            h('button', {
              key: e,
              class: ['cs-tab', era.value === e ? 'cs-tab--on' : ''].join(' '),
              onClick: () => { era.value = e },
            }, e === 'before' ? 'Before' : 'After')
          )
        ),

        h('div', { class: ['sp', 'sp--pitch', era.value === 'after' ? 'sp--after' : 'sp--before'].join(' ') }, [
          h('span', { class: 'sp-notch' }),
          h('div', { class: 'sp-screen' }, [
            h('div', { class: 'sp-morph' }, [
              h('div', { class: 'sp-layer sp-layer--before' }, beforeRows),
              h('div', { class: 'sp-layer sp-layer--after' }, afterRows),
            ]),
            h('div', { class: 'sp-navwrap' }, [navBefore, navAfter]),
          ]),
        ]),

        h('figcaption', { class: 'pm-cap' },
          'The home screen, before and after. Toggle the era — Home keeps its place while Store and Buzz settle in beside it.'),
      ])
  },
})
