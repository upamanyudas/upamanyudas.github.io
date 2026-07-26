import { defineComponent, h, ref, computed } from 'vue'

/**
 * NudgeStory — the acceptance criteria, as a machine you can break.
 * Written with our agile coach in given / when / then, because that format forces
 * the awkward specifics into the open: how long after, how long is too long, how often.
 */
const CONDITIONS = [
  { key: 'booked',  given: 'the person booked this film on the platform',   fail: 'We are asking someone to review a film we cannot prove they saw. That is how the trust problem started.' },
  { key: 'settled', when: 'at least 3.5 hours have passed since showtime',   fail: 'Too early. They are in the car park, or worse, still in the seat.' },
  { key: 'fresh',   when: 'the showtime was within the last 30 days',        fail: 'Too late. Nobody remembers row H from five weeks ago, and a vague rating is worse than none.' },
  { key: 'once',    when: 'we have not already asked about this film',       fail: 'We have asked before. Ask twice and the notification becomes something to switch off.' },
  { key: 'open',    given: 'the person has the app open, or notifications on', fail: 'No surface to ask on. Nothing to do here.' },
]

export default defineComponent({
  name: 'NudgeStory',
  setup() {
    const on = ref({ booked: true, settled: true, fresh: true, once: true, open: true })
    const fires = computed(() => CONDITIONS.every(c => on.value[c.key]))
    const firstFail = computed(() => CONDITIONS.find(c => !on.value[c.key]))

    return () =>
      h('div', { class: 'rv-story' }, [
        h('p', { class: 'rv-story-title' }, 'As a user, I want to be asked for a rating at a moment I can actually answer.'),

        h('ul', { class: 'rv-story-list' }, CONDITIONS.map(c =>
          h('li', { key: c.key }, [
            h('button', {
              class: ['rv-story-cond', on.value[c.key] ? 'rv-story-cond--on' : ''].join(' '),
              onClick: () => { on.value = { ...on.value, [c.key]: !on.value[c.key] } },
              'aria-pressed': String(on.value[c.key]),
            }, [
              h('span', { class: 'rv-story-key' }, c.given ? 'GIVEN' : 'WHEN'),
              h('span', { class: 'rv-story-text' }, c.given || c.when),
              h('span', { class: 'rv-story-mark' }, on.value[c.key] ? '✓' : '✕'),
            ]),
          ])
        )),

        h('div', { class: ['rv-story-then', fires.value ? 'rv-story-then--on' : ''].join(' ') }, [
          h('span', { class: 'rv-story-key' }, 'THEN'),
          fires.value
            ? h('span', null, 'the notification fires — once — and opens straight into step one of the form.')
            : h('span', null, firstFail.value.fail),
        ]),
      ])
  },
})
