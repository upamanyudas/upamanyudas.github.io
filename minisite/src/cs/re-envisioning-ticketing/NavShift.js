import { defineComponent, h, ref, watch } from 'vue'
import PhoneFrame from '../shared/PhoneFrame.js'

/**
 * NavShift — the old five-icon ticketing shell against the new four-tab one.
 * Every "before" tab is a different way of asking someone to buy a seat;
 * the "after" shell keeps that intact and adds two moods next to it.
 */
const ICONS = {
  home:   'M3 10.5 12 3l9 7.5V21H3z',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4',
  music:  'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm11-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
  flame:  'M12 3c3 4 6 5.5 6 9a6 6 0 1 1-12 0c0-2 1-3.5 2.5-5C9 8.5 10 7 12 3Z',
  more:   'M4 7h16M4 12h16M4 17h16',
  store:  'M4 8h16l-1.2 12H5.2ZM9 8V6a3 3 0 0 1 6 0v2',
  buzz:   'M4 11l12-6v14L4 13Zm0 0v3m12-6a3 3 0 0 1 0 6',
  user:   'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0',
}

const SHELLS = {
  before: {
    note: 'Five entry points, all of them ticketing. The app had one mood.',
    tabs: [
      { key: 'home',   label: 'Home',     icon: 'home',   head: 'All · Movies · Events · Plays',
        rows: ['Movies playing', 'Events happening'], kind: 'grid' },
      { key: 'search', label: 'Search',   icon: 'search', head: 'Search movies, events, sports',
        rows: ['Recent searches', 'Trending near you'], kind: 'list' },
      { key: 'music',  label: 'Music',    icon: 'music',  head: 'Live music near you',
        rows: ['This weekend', 'Touring soon'], kind: 'grid' },
      { key: 'trend',  label: 'Trending', icon: 'flame',  head: 'Selling fast',
        rows: ['Almost sold out', 'Just added'], kind: 'grid' },
      { key: 'more',   label: 'More',     icon: 'more',   head: 'Everything else',
        rows: ['Your bookings', 'Offers', 'Help'], kind: 'list' },
    ],
  },
  after: {
    note: 'Home does not move an inch. Store and Buzz are the two moods it never covered.',
    tabs: [
      { key: 'home',  label: 'Home',    icon: 'home',  head: 'Hey — what are you doing tonight?',
        rows: ['The best of entertainment', 'Movies now showing'], kind: 'grid', accent: true },
      { key: 'store', label: 'Store',   icon: 'store', head: 'Merch, not seats',
        rows: ['Fan drops', 'Collectibles'], kind: 'grid' },
      { key: 'buzz',  label: 'Buzz',    icon: 'buzz',  head: 'Discover what’s happening',
        rows: ['Top highlights', 'Box office this week'], kind: 'feed' },
      { key: 'you',   label: 'Profile', icon: 'user',  head: 'Your bookings and passes',
        rows: ['Upcoming', 'Past'], kind: 'list' },
    ],
  },
}

const icon = (name, on) => h('svg', {
  class: ['tk-navicon', on ? 'tk-navicon--on' : ''].join(' '),
  viewBox: '0 0 24 24', width: 18, height: 18, fill: 'none',
  stroke: 'currentColor', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
}, [h('path', { d: ICONS[name] })])

/* Screen bodies are schematic on purpose — the shape of the page is the argument, not the artwork. */
function screenBody(tab) {
  if (tab.kind === 'feed') {
    return [
      h('div', { class: 'tk-rail' }, Array.from({ length: 6 }, (_, i) => h('span', { key: i, class: 'tk-rail-dot' }))),
      h('div', { class: 'tk-feedcard' }),
      h('div', { class: 'tk-feedcard tk-feedcard--short' }),
    ]
  }
  if (tab.kind === 'list') {
    return Array.from({ length: 5 }, (_, i) => h('div', { key: i, class: 'tk-listrow' }))
  }
  return [
    h('div', { class: 'tk-banner' }),
    h('div', { class: 'tk-grid' }, Array.from({ length: 6 }, (_, i) => h('span', { key: i, class: 'tk-tile' }))),
  ]
}

export default defineComponent({
  name: 'NavShift',
  setup() {
    const era = ref('after')
    const tab = ref('home')

    // Each shell has its own tab set — snap back to the first one when they swap.
    watch(era, e => { tab.value = SHELLS[e].tabs[0].key })

    return () => {
      const shell = SHELLS[era.value]
      const current = shell.tabs.find(t => t.key === tab.value) || shell.tabs[0]

      return h('div', { class: 'tk-nav' }, [
        h('div', { class: 'cs-tabs cs-tabs--wide' },
          ['before', 'after'].map(e =>
            h('button', {
              key: e,
              class: ['cs-tab', era.value === e ? 'cs-tab--on' : ''].join(' '),
              onClick: () => { era.value = e },
            }, e === 'before' ? 'Before' : 'After')
          )
        ),

        h(PhoneFrame, { tone: current.accent ? 'pf-body--warm' : '' }, {
          default: () => [
            h('div', { class: 'tk-screenhead' }, current.head),
            h('div', { class: 'tk-screenbody' }, [
              ...current.rows.map(r => h('p', { key: r, class: 'tk-rowlabel' }, r)),
              ...screenBody(current),
            ]),
            h('nav', { class: 'tk-navbar' },
              shell.tabs.map(t =>
                h('button', {
                  key: t.key,
                  class: ['tk-navbtn', tab.value === t.key ? 'tk-navbtn--on' : ''].join(' '),
                  onClick: () => { tab.value = t.key },
                }, [icon(t.icon, tab.value === t.key), h('span', null, t.label)])
              )
            ),
          ],
        }),

        h('p', { class: 'cs-note' }, shell.note),
      ])
    }
  },
})
