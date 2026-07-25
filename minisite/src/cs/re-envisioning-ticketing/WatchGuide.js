import { defineComponent, h, ref, computed } from 'vue'
import PhoneFrame from '../shared/PhoneFrame.js'

/**
 * WatchGuide — tell it what you speak, what you like and what you already pay for,
 * and it stops showing you things you cannot watch. Titles are placeholders;
 * the filtering is real.
 */
const LANGS  = ['Hindi', 'English', 'Telugu', 'Tamil', 'Bengali', 'Malayalam', 'Marathi', 'Kannada']
const GENRES = ['Thriller', 'Comedy', 'Drama', 'Horror', 'Documentary', 'Crime', 'Anime', 'Sport']
const SERVICES = ['Service A', 'Service B', 'Service C', 'Service D', 'Service E']

/* A small synthetic catalogue — enough rows for the filter to visibly bite. */
const CATALOGUE = [
  { t: 'The Long Monsoon',   lang: 'Hindi',     genre: 'Drama',       svc: 'Service A' },
  { t: 'Nightcrawl',         lang: 'English',   genre: 'Thriller',    svc: 'Service B' },
  { t: 'Harbour Lights',     lang: 'Bengali',   genre: 'Drama',       svc: 'Service C' },
  { t: 'Six Wickets',        lang: 'Hindi',     genre: 'Sport',       svc: 'Service A' },
  { t: 'Kitchen Politics',   lang: 'Tamil',     genre: 'Comedy',      svc: 'Service D' },
  { t: 'Cold Open',          lang: 'English',   genre: 'Crime',       svc: 'Service B' },
  { t: 'Field Notes',        lang: 'Malayalam', genre: 'Documentary', svc: 'Service E' },
  { t: 'The Understudy',     lang: 'Marathi',   genre: 'Drama',       svc: 'Service C' },
  { t: 'Paper Tigers',       lang: 'Telugu',    genre: 'Thriller',    svc: 'Service A' },
  { t: 'Second Innings',     lang: 'Kannada',   genre: 'Comedy',      svc: 'Service D' },
  { t: 'Static',             lang: 'English',   genre: 'Horror',      svc: 'Service E' },
  { t: 'Monsoon Wedding II', lang: 'Hindi',     genre: 'Comedy',      svc: 'Service B' },
]

export default defineComponent({
  name: 'WatchGuide',
  setup() {
    const picked = ref({
      lang: ['Hindi', 'English', 'Tamil'],
      genre: ['Thriller', 'Comedy', 'Drama'],
      svc: ['Service A', 'Service B', 'Service D'],
    })
    const open = ref(null)

    function toggle(kind, value) {
      const list = picked.value[kind]
      picked.value = {
        ...picked.value,
        [kind]: list.includes(value) ? list.filter(v => v !== value) : [...list, value],
      }
    }

    const matches = computed(() => CATALOGUE.filter(c =>
      (!picked.value.lang.length  || picked.value.lang.includes(c.lang)) &&
      (!picked.value.genre.length || picked.value.genre.includes(c.genre)) &&
      (!picked.value.svc.length   || picked.value.svc.includes(c.svc))
    ))

    const chipRow = (kind, values) => h('div', { class: 'cs-chips' },
      values.map(v =>
        h('button', {
          key: v,
          class: ['cs-chip', picked.value[kind].includes(v) ? 'cs-chip--on' : ''].join(' '),
          onClick: () => toggle(kind, v),
        }, v)
      )
    )

    return () =>
      h('div', { class: 'tk-guide' }, [
        h('div', { class: 'tk-guide-prefs' }, [
          h('h5', null, 'Languages'), chipRow('lang', LANGS),
          h('h5', null, 'Genres'),    chipRow('genre', GENRES),
          h('h5', null, 'Services you already pay for'), chipRow('svc', SERVICES),
        ]),

        h(PhoneFrame, {}, {
          default: () => [
            h('div', { class: 'tk-guide-head' }, [
              h('strong', null, 'Watch Guide'),
              h('span', null, 'A better way to discover'),
            ]),
            h('div', { class: 'tk-guide-shelf' },
              matches.value.length
                ? matches.value.map(c =>
                    h('button', {
                      key: c.t,
                      class: ['tk-title', open.value === c.t ? 'tk-title--on' : ''].join(' '),
                      onClick: () => { open.value = open.value === c.t ? null : c.t },
                    }, [
                      h('span', { class: 'tk-title-art' }),
                      h('span', { class: 'tk-title-name' }, c.t),
                      h('span', { class: 'tk-title-meta' }, `${c.lang} · ${c.genre}`),
                      open.value === c.t
                        ? h('span', { class: 'tk-title-where' }, `Watch on ${c.svc}`)
                        : null,
                    ])
                  )
                : [h('p', { class: 'tk-guide-empty' }, 'Nothing matches all of that. Which is the honest answer, and the one the old homepage never gave.')]
            ),
          ],
        }),

        h('p', { class: 'cs-note' },
          `${matches.value.length} of ${CATALOGUE.length} titles you can actually watch tonight. Tap one for where it lives.`),
      ])
  },
})
