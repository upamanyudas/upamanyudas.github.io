import { defineComponent, h, ref, computed } from 'vue'
import PhoneFrame from '../shared/PhoneFrame.js'

/**
 * ReviewSummary — the detail-page block, rebuilt from the release build. Top five
 * tags are the summary; the cards underneath are the evidence, for the minority
 * who want it. Tap a tag and the evidence narrows.
 */
const TAGS = [
  { tag: '#Entertaining', n: 768 },
  { tag: '#MustWatch',    n: 429 },
  { tag: '#StrongActing', n: 318 },
  { tag: '#Overrated',    n: 204 },
  { tag: '#GoodStory',    n: 151 },
]

const REVIEWS = [
  { who: 'A. Bose',   pct: 60, booked: true,  up: '2K',  ago: '23 mins ago', tags: ['#Overrated', '#StrongActing'],
    text: 'Best action film I have sat through this year, and I still think it is overrated. Watch it in IMAX or do not bother.' },
  { who: 'S. Iyer',   pct: 90, booked: true,  up: '1.4K', ago: '2 hours ago', tags: ['#Entertaining', '#MustWatch'],
    text: 'Two hours gone in what felt like forty minutes. Take the family, take the loud cousin, take everyone.' },
  { who: 'R. Khan',   pct: 70, booked: true,  up: '870', ago: '5 hours ago', tags: ['#GoodStory', '#StrongActing'],
    text: 'The story holds together, which is more than I expected. The lead carries the second half almost alone.' },
  { who: 'M. Pillai', pct: 80, booked: false, up: '312', ago: 'Yesterday',   tags: ['#Entertaining'],
    text: 'Good fun. Nothing you will think about on Monday, and that is fine on a Friday.' },
  { who: 'D. Sharma', pct: 50, booked: true,  up: '96',  ago: 'Yesterday',   tags: ['#Overrated'],
    text: 'Everybody in my feed said masterpiece. It is a solid Saturday film. Those are not the same sentence.' },
]

const HEART = 'M12 21s-8.4-5.2-8.4-11A4.9 4.9 0 0 1 12 6.6a4.9 4.9 0 0 1 8.4 3.4c0 5.8-8.4 11-8.4 11Z'

const icon = (d, cls) => h('svg', { class: cls, viewBox: '0 0 24 24', width: 16, height: 16, fill: 'none',
  stroke: 'currentColor', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' },
  [h('path', { d })])

const heart = () => h('svg', { class: 'rv-sm-heart', viewBox: '0 0 24 24', width: 15, height: 15 },
  [h('path', { d: HEART, fill: 'currentColor' })])

const status = () => h('div', { class: 'rv-sm-status' }, [
  h('span', null, '11:11'),
  h('span', { class: 'rv-sm-status-r' }, '▪▪▪ ᯤ ▮'),
])

export default defineComponent({
  name: 'ReviewSummary',
  setup() {
    const filter = ref(null)

    const shown = computed(() =>
      filter.value ? REVIEWS.filter(r => r.tags.includes(filter.value)) : REVIEWS)

    const card = r => h('article', { key: r.who, class: 'rv-sm-card' }, [
      h('header', null, [
        h('span', { class: 'rv-sm-av' }),
        h('div', { class: 'rv-sm-by' }, [
          h('strong', null, r.who),
          h('em', null, r.booked ? 'Booked on the app' : 'Has not booked'),
        ]),
        h('span', { class: 'rv-sm-score' }, [heart(), `${r.pct}%`]),
      ]),
      h('p', { class: 'rv-sm-tags' }, r.tags.join('  ')),
      h('p', { class: 'rv-sm-text' }, [r.text, h('a', null, ' …more')]),
      h('footer', null, [
        h('span', null, [icon('M7 22V11l5-9a2.5 2.5 0 0 1 2.5 3L13 11h5.5a2 2 0 0 1 2 2.4l-1.5 6.6a2 2 0 0 1-2 2Z'), r.up]),
        icon('M17 2v11l-5 9a2.5 2.5 0 0 1-2.5-3L11 13H5.5a2 2 0 0 1-2-2.4l1.5-6.6a2 2 0 0 1 2-2Z'),
        h('em', null, r.ago),
        h('b', null, '⋮'),
      ]),
    ])

    return () =>
      h('div', { class: 'rv-summary' }, [
        h(PhoneFrame, {}, {
          default: () => [
            status(),

            h('div', { class: 'rv-sm-nav' }, [
              icon('M15 19 8 12l7-7', 'rv-sm-navicon'),
              h('strong', null, 'Breaking Surface'),
              icon('M18 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm0 13a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM6 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Zm2.2-3.4 7.6-3.6m-7.6 5.4 7.6 3.6', 'rv-sm-navicon'),
            ]),

            h('div', { class: 'rv-sm-offers' }, [
              h('div', { class: 'rv-sm-offer' }, [
                h('strong', null, '15% off with your bank card'),
                h('em', null, 'Offer valid till Dec 2020'),
              ]),
              h('div', { class: 'rv-sm-offer' }, [h('strong', null, 'Buy one get one')]),
            ]),

            h('div', { class: 'rv-sm-scroll' }, [
              h('div', { class: 'rv-sm-head' }, [
                h('h4', null, 'Top reviews'),
                h('a', null, '100 reviews ›'),
              ]),

              h('div', { class: 'rv-sm-nudge' }, [
                h('div', null, [
                  h('strong', null, 'Watched? Add your rating & review'),
                  h('em', null, 'Your ratings matter'),
                ]),
                h('span', { class: 'rv-sm-rate' }, 'Rate now'),
              ]),

              h('p', { class: 'rv-sm-lead' }, 'Summary of 100 reviews. Tap a hashtag to read more.'),

              h('div', { class: 'rv-sm-chips' }, TAGS.map(t =>
                h('button', {
                  key: t.tag,
                  class: ['rv-sm-chip', filter.value === t.tag ? 'rv-sm-chip--on' : ''].join(' '),
                  onClick: () => { filter.value = filter.value === t.tag ? null : t.tag },
                }, [t.tag, h('i', null, String(t.n))])
              )),

              h('div', { class: 'rv-sm-rail' },
                shown.value.length
                  ? shown.value.map(card)
                  : [h('p', { class: 'rv-sm-empty' }, 'Nobody tagged it that.')]),

              h('h4', { class: 'rv-sm-cast' }, 'Cast'),
              h('div', { class: 'rv-sm-crew' }, ['Lead', 'Lead', 'Support', 'Support'].map((n, i) =>
                h('span', { key: i }, [h('i'), h('b', null, n)]))),
            ]),

            h('div', { class: 'rv-sm-foot' }, [h('span', { class: 'rv-sm-book' }, 'Book tickets')]),
          ],
        }),

        h('p', { class: 'cs-note' },
          filter.value
            ? `${shown.value.length} of ${REVIEWS.length} reviews carry ${filter.value}. In testing people read the tags and stopped there — which was the design intent, not a failure.`
            : 'Five tags and five reviews. In testing, people took the sentiment of a film in ten to twenty seconds.'),
      ])
  },
})
