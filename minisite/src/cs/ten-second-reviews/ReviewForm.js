import { defineComponent, h, ref, nextTick, onUnmounted } from 'vue'
import PhoneFrame from '../shared/PhoneFrame.js'

/**
 * ReviewForm — the screen that shipped, rebuilt from the release build, and the
 * stopwatch that justified it. Three questions in order of what they cost the
 * person answering. Two are optional: a usable review exists after the first.
 */
const TAGS = ['#GreatMusic', '#StrongActing', '#AvgDirection', '#ThumbsUp', '#Entertaining',
  '#Heartwarming', '#Satisfying', '#Watchable', '#CrowdPleaser']

const HEART = 'M12 21s-8.4-5.2-8.4-11A4.9 4.9 0 0 1 12 6.6a4.9 4.9 0 0 1 8.4 3.4c0 5.8-8.4 11-8.4 11Z'

const heart = size => h('svg', { class: 'rv-fm-heart', viewBox: '0 0 24 24', width: size, height: size },
  [h('path', { d: HEART, fill: 'currentColor' })])

const status = () => h('div', { class: 'rv-fm-status' }, [
  h('span', null, '13:00'),
  h('span', { class: 'rv-fm-status-r' }, '▪▪▪ ᯤ ▮'),
])

export default defineComponent({
  name: 'ReviewForm',
  setup() {
    const step = ref(0)
    const rating = ref(0)
    const tags = ref([])
    const text = ref('')
    const elapsed = ref(0)
    const done = ref(false)
    const scroll = ref(null)
    let timer = null

    function start() {
      if (timer || done.value) return
      timer = setInterval(() => { elapsed.value += 0.1 }, 100)
    }
    function stop() { clearInterval(timer); timer = null }
    onUnmounted(stop)

    function reset() {
      stop()
      step.value = 0; rating.value = 0; tags.value = []; text.value = ''
      elapsed.value = 0; done.value = false
    }

    function rate(v) {
      start()
      rating.value = v
      if (navigator.vibrate) navigator.vibrate(8)
    }

    function toggleTag(t) {
      start()
      tags.value = tags.value.includes(t) ? tags.value.filter(x => x !== t) : [...tags.value, t]
    }

    function next() {
      step.value += 1
      nextTick(() => scroll.value?.scrollTo({ top: scroll.value.scrollHeight, behavior: 'smooth' }))
    }

    function submit() {
      stop()
      done.value = true
    }

    const secs = () => elapsed.value.toFixed(1) + 's'

    const section = (title, sub, ...body) => h('section', { class: 'rv-fm-sec' }, [
      h('h4', null, title),
      sub ? h('p', { class: 'rv-fm-sub' }, sub) : null,
      ...body,
    ])

    function rateSection() {
      return section('How would you rate the movie?', null,
        h('div', { class: 'rv-fm-slider', style: `--v:${rating.value}` }, [
          rating.value ? null : h('span', { class: 'rv-fm-cue' }, 'SLIDE TO RATE →'),
          h('div', { class: 'rv-fm-rail' }, [
            h('span', { class: 'rv-fm-fill' }),
            h('div', { class: 'rv-fm-ticks' }, Array.from({ length: 11 }, (_, i) => h('span', { key: i }))),
            h('span', { class: 'rv-fm-thumb' }, heart(26)),
            h('input', {
              class: 'rv-fm-range', type: 'range', min: 0, max: 100, step: 10, value: rating.value,
              'aria-label': 'Rating', onInput: e => rate(+e.target.value),
            }),
          ]),
          h('b', { class: 'rv-fm-pct' }, `${rating.value}%`),
        ]))
    }

    const tagSection = () => section('What did you like?', 'Express yourself with hashtags!',
      h('div', { class: 'rv-fm-tags' }, TAGS.map(t =>
        h('button', {
          key: t,
          class: ['rv-fm-tag', tags.value.includes(t) ? 'rv-fm-tag--on' : ''].join(' '),
          onClick: () => toggleTag(t),
        }, t))))

    const textSection = () => section(
      [h('span', null, 'Express more, write a review'), h('em', null, '(Optional)')], null,
      h('textarea', {
        class: 'rv-fm-text', rows: 3, value: text.value, placeholder: 'Write your review',
        onInput: e => { start(); text.value = e.target.value },
      }))

    const doneBody = () => h('div', { class: 'rv-fm-done' }, [
      heart(56),
      h('p', { class: 'rv-fm-donetime' }, secs()),
      h('p', { class: 'rv-fm-donetext' },
        tags.value.length && !text.value
          ? 'A complete, readable review — no sentence required. The fastest we recorded in testing was nine seconds.'
          : text.value
            ? 'A written review, from someone who had already committed at step one. That is the point of putting it last.'
            : 'A rating, banked. Sixty seconds was the old number for this.'),
      h('button', { class: 'rv-fm-ghost', onClick: reset }, 'Again'),
    ])

    return () =>
      h('div', { class: 'rv-form' }, [
        h(PhoneFrame, {}, {
          default: () => [
            status(),

            h('div', { class: 'rv-fm-bar' }, [
              h('div', { class: 'rv-fm-title' }, [
                h('strong', null, 'How was the movie?'),
                h('em', null, 'War'),
              ]),
              h('button', { class: 'rv-fm-x', onClick: reset, 'aria-label': 'Start over' }, '✕'),
            ]),

            h('div', { class: 'rv-fm-scroll', ref: scroll }, done.value ? [doneBody()] : [
              h('div', { class: 'rv-fm-film' }, [
                h('span', { class: 'rv-fm-poster' }),
                h('p', { class: 'rv-fm-watched' }, 'You watched yesterday'),
                h('p', { class: 'rv-fm-name' }, 'War'),
              ]),

              rateSection(),
              step.value >= 1 ? tagSection() : null,
              step.value >= 2 ? textSection() : null,

              rating.value ? null : h('div', { class: 'rv-fm-matter' }, [
                h('p', { class: 'rv-fm-matter-h' }, 'Your ratings matter!'),
                h('p', null, 'They help others decide what to watch next.'),
              ]),
            ]),

            done.value ? null : h('div', { class: 'rv-fm-foot' }, [
              step.value < 2
                ? h('button', { class: 'rv-fm-ghost', disabled: !rating.value, onClick: next },
                    step.value === 0 ? 'Add hashtags' : 'Write a review')
                : null,
              h('button', { class: 'rv-fm-submit', disabled: !rating.value, onClick: submit }, 'Submit Review'),
            ]),
          ],
        }),

        h('p', { class: 'rv-fm-watch' }, [h('span', null, 'Time on task'), h('b', null, secs())]),

        h('p', { class: 'cs-note' },
          'The stopwatch starts on your first touch and stops on submit. Sixty seconds was the number we started with.'),
      ])
  },
})
