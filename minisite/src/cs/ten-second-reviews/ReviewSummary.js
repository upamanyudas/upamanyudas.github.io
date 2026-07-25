import { defineComponent, h, ref, computed } from 'vue'
import PhoneFrame from '../shared/PhoneFrame.js'

/**
 * ReviewSummary — the detail page block. Top five tags are the summary; the
 * reviews underneath are the evidence, for the minority who want it.
 * Tap a tag and the evidence narrows.
 */
const TAGS = [
  { tag: '#Entertaining', n: 786 },
  { tag: '#MustWatch',    n: 429 },
  { tag: '#StrongActing', n: 318 },
  { tag: '#Overrated',    n: 204 },
  { tag: '#GoodStory',    n: 151 },
]

const REVIEWS = [
  { who: 'A. Bose',   pct: 60, booked: true,  tags: ['#Overrated', '#StrongActing'],
    text: 'Best action film I have sat through this year, and I still think it is overrated. Watch it in IMAX or do not bother.' },
  { who: 'S. Iyer',   pct: 90, booked: true,  tags: ['#Entertaining', '#MustWatch'],
    text: 'Two hours gone in what felt like forty minutes. Take the family, take the loud cousin, take everyone.' },
  { who: 'R. Khan',   pct: 70, booked: true,  tags: ['#GoodStory', '#StrongActing'],
    text: 'The story holds together, which is more than I expected. The lead carries the second half almost alone.' },
  { who: 'M. Pillai', pct: 80, booked: false, tags: ['#Entertaining'],
    text: 'Good fun. Nothing you will think about on Monday, and that is fine on a Friday.' },
  { who: 'D. Sharma', pct: 50, booked: true,  tags: ['#Overrated'],
    text: 'Everybody in my feed said masterpiece. It is a solid Saturday film. Those are not the same sentence.' },
]

export default defineComponent({
  name: 'ReviewSummary',
  setup() {
    const filter = ref(null)

    const shown = computed(() =>
      filter.value ? REVIEWS.filter(r => r.tags.includes(filter.value)) : REVIEWS)

    return () =>
      h('div', { class: 'rv-summary' }, [
        h(PhoneFrame, {}, {
          default: () => [
            h('div', { class: 'rv-sum-head' }, [
              h('strong', null, 'Top reviews'),
              h('span', null, `${REVIEWS.length * 20} reviews ›`),
            ]),

            h('div', { class: 'rv-sum-nudge' }, [
              h('span', null, 'Watched it? Add your rating'),
              h('em', null, 'Rate now'),
            ]),

            h('p', { class: 'rv-sum-lead' }, 'Summary of 100 reviews. Tap a tag to read only those.'),

            h('div', { class: 'cs-chips' }, TAGS.map(t =>
              h('button', {
                key: t.tag,
                class: ['cs-chip', filter.value === t.tag ? 'cs-chip--on' : ''].join(' '),
                onClick: () => { filter.value = filter.value === t.tag ? null : t.tag },
              }, [t.tag, h('i', null, String(t.n))])
            )),

            h('div', { class: 'rv-sum-list' },
              shown.value.length
                ? shown.value.map(r =>
                    h('article', { key: r.who, class: 'rv-sum-card' }, [
                      h('div', { class: 'rv-sum-by' }, [
                        h('span', { class: 'rv-sum-who' }, r.who),
                        h('span', { class: 'rv-sum-pct' }, `${r.pct}%`),
                      ]),
                      r.booked ? h('span', { class: 'rv-trust-badge' }, 'Booked on the app') : null,
                      h('p', { class: 'rv-sum-tags' }, r.tags.join(' ')),
                      h('p', { class: 'rv-sum-text' }, r.text),
                    ])
                  )
                : [h('p', { class: 'rv-sum-empty' }, 'Nobody tagged it that.')]
            ),
          ],
        }),

        h('p', { class: 'cs-note' },
          filter.value
            ? `${shown.value.length} of ${REVIEWS.length} reviews carry ${filter.value}. In testing people read the tags and stopped there — which was the design intent, not a failure.`
            : 'Five tags and five reviews. In testing, people took the sentiment of a film in ten to twenty seconds.'),
      ])
  },
})
