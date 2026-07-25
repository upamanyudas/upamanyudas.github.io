import { defineComponent, h, ref, onUnmounted } from 'vue'
import PhoneFrame from '../shared/PhoneFrame.js'

/**
 * ReviewForm — the component that shipped, and the stopwatch that justified it.
 * Three questions in order of what they cost the person answering. Two of them
 * are optional, which is the entire trick: a usable review exists after step one.
 */
const TAGS = ['#MustWatch', '#Entertaining', '#StrongActing', '#Epic', '#Overrated',
  '#Average', '#Timepass', '#GoodStory', '#Memorable', '#CrowdPleaser']

const STEPS = ['Rate it', 'Tag it', 'Say it']

export default defineComponent({
  name: 'ReviewForm',
  setup() {
    const step = ref(0)
    const rating = ref(0)
    const tags = ref([])
    const text = ref('')
    const elapsed = ref(0)
    const done = ref(false)
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

    function submit() {
      stop()
      done.value = true
    }

    const secs = () => elapsed.value.toFixed(1) + 's'

    function body() {
      if (done.value) {
        return h('div', { class: 'rv-form-done' }, [
          h('span', { class: 'rv-form-tick' }, '❤'),
          h('p', { class: 'rv-form-time' }, secs()),
          h('p', { class: 'rv-form-donetext' },
            tags.value.length && !text.value
              ? 'A complete, readable review — no sentence required. The fastest we recorded in testing was nine seconds.'
              : text.value
                ? 'A written review, from someone who had already committed at step one. That is the point of putting it last.'
                : 'A rating, banked. Sixty seconds was the old number for this.'),
          h('button', { class: 'cs-run', onClick: reset }, 'Again'),
        ])
      }

      if (step.value === 0) {
        return [
          h('p', { class: 'rv-form-q' }, 'How would you rate the film?'),
          h('div', { class: 'rv-form-rate' }, [
            h('span', { class: 'rv-form-pct' }, `${rating.value}%`),
            h('input', {
              class: 'rv-range rv-range--final',
              type: 'range', min: 0, max: 100, step: 10, value: rating.value,
              'aria-label': 'Rating',
              onInput: e => rate(+e.target.value),
            }),
            h('div', { class: 'rv-ticks' }, Array.from({ length: 11 }, (_, i) => h('span', { key: i }))),
          ]),
          h('p', { class: 'rv-form-hint' }, 'Slide to rate — this is the only required question.'),
        ]
      }

      if (step.value === 1) {
        return [
          h('p', { class: 'rv-form-q' }, 'Describe it in tags'),
          h('div', { class: 'cs-chips' }, TAGS.map(t =>
            h('button', {
              key: t,
              class: ['cs-chip', tags.value.includes(t) ? 'cs-chip--on' : ''].join(' '),
              onClick: () => toggleTag(t),
            }, t)
          )),
          h('p', { class: 'rv-form-hint' }, 'Optional. Their words, mined from three hundred reviews — not ours.'),
        ]
      }

      return [
        h('p', { class: 'rv-form-q' }, 'Anything else?'),
        h('textarea', {
          class: 'rv-form-text', rows: 3, value: text.value,
          placeholder: 'Write your review (optional)',
          onInput: e => { start(); text.value = e.target.value },
        }),
        h('p', { class: 'rv-form-hint' }, 'Optional, and by now genuinely optional — we already have a usable review.'),
      ]
    }

    return () =>
      h('div', { class: 'rv-form' }, [
        h(PhoneFrame, {}, {
          default: () => [
            h('div', { class: 'rv-form-head' }, [
              h('strong', null, 'How was the movie?'),
              h('span', { class: 'rv-form-clock' }, secs()),
            ]),

            h('div', { class: 'rv-form-steps' }, STEPS.map((s, i) =>
              h('span', {
                key: s,
                class: ['rv-form-step', i === step.value && !done.value ? 'rv-form-step--on' : '',
                  i < step.value || done.value ? 'rv-form-step--past' : ''].filter(Boolean).join(' '),
              }, s)
            )),

            h('div', { class: 'rv-form-body' }, body()),

            done.value ? null : h('div', { class: 'rv-form-actions' }, [
              step.value < 2
                ? h('button', {
                    class: 'rv-form-next',
                    disabled: step.value === 0 && !rating.value,
                    onClick: () => { step.value += 1 },
                  }, step.value === 0 ? 'Next' : 'Add a review')
                : null,
              h('button', {
                class: 'rv-form-submit',
                disabled: !rating.value,
                onClick: submit,
              }, 'Submit review'),
            ]),
          ],
        }),

        h('p', { class: 'cs-note' },
          'The stopwatch starts on your first touch and stops on submit. Sixty seconds was the number we started with.'),
      ])
  },
})
