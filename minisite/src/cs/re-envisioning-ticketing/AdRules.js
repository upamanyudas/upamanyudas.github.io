import { defineComponent, h, ref } from 'vue'
import PhoneFrame from '../shared/PhoneFrame.js'

/**
 * AdRules — the ad server, expressed as the three rules I wrote for it.
 * Switch the audience and watch the inventory change, including the case
 * where the correct amount of advertising is none.
 */
const AUDIENCES = [
  {
    key: 'loyal', label: 'Loyal booker',
    rule: 'Never. Not once.',
    body: 'Books every fortnight. The most valuable person in the building, and the least appropriate person to sell attention against. This was the rule I spent the most political capital defending, and the one that made the rest defensible.',
    slots: [],
  },
  {
    key: 'infrequent', label: 'Infrequent',
    rule: 'Personalised, and pointed back at a booking.',
    body: 'Booked twice this year. Placements are contextual — an offer on the card they already use, a nearby show in a genre they have actually paid for. Every unit has a job: get them to a seat.',
    slots: [
      { kind: 'echo', label: 'Echo banner · in-flow', note: 'Placed mid-scroll where a listing already broke — impressions without a new interruption.' },
      { kind: 'native', label: 'Native card · same shape as everything else', note: 'Identical card design to editorial. Carries far more context than a standard banner slot.' },
    ],
  },
  {
    key: 'dreamer', label: 'Dreamer',
    rule: 'Broad inventory, full sheet.',
    body: 'Opens the app, watches trailers, buys nothing. Gets the widest inventory including the splash unit — the single highest-earning placement we ran. This is the forty million turning into a revenue line without ever buying a ticket.',
    slots: [
      { kind: 'splash', label: 'Splash · full sheet on open', note: 'Highest revenue per impression of anything we shipped. Dismissible in one tap, capped hard per session.' },
      { kind: 'echo', label: 'Echo banner · in-flow', note: 'Repeats the same advertiser once further down, which lifted recall without lifting complaints.' },
      { kind: 'native', label: 'Native card · feed', note: 'Sits in Buzz looking like Buzz. Labelled, always.' },
    ],
  },
]

export default defineComponent({
  name: 'AdRules',
  setup() {
    const who = ref('dreamer')
    const aud = () => AUDIENCES.find(a => a.key === who.value)

    return () =>
      h('div', { class: 'tk-ads' }, [
        h('div', { class: 'cs-tabs cs-tabs--wide' },
          AUDIENCES.map(a =>
            h('button', {
              key: a.key,
              class: ['cs-tab', who.value === a.key ? 'cs-tab--on' : ''].join(' '),
              onClick: () => { who.value = a.key },
            }, a.label)
          )
        ),

        h('div', { class: 'tk-ads-stage' }, [
          h(PhoneFrame, {}, {
            default: () => [
              h('div', { class: 'tk-screenhead' }, 'It all starts here'),
              h('div', { class: 'tk-screenbody' }, [
                aud().slots.some(s => s.kind === 'splash')
                  ? h('div', { class: 'tk-ad tk-ad--splash' }, [h('span', null, 'Sponsored'), h('em', null, 'splash')])
                  : null,
                h('div', { class: 'tk-grid' }, Array.from({ length: 4 }, (_, i) => h('span', { key: i, class: 'tk-tile' }))),
                aud().slots.some(s => s.kind === 'echo')
                  ? h('div', { class: 'tk-ad tk-ad--echo' }, [h('span', null, 'Sponsored'), h('em', null, 'echo banner')])
                  : null,
                h('div', { class: 'tk-grid' }, Array.from({ length: 2 }, (_, i) => h('span', { key: i, class: 'tk-tile' }))),
                aud().slots.some(s => s.kind === 'native')
                  ? h('div', { class: 'tk-ad tk-ad--native' }, [h('span', null, 'Sponsored'), h('em', null, 'native card')])
                  : null,
                aud().slots.length ? null : h('p', { class: 'tk-ads-clean' }, 'No inventory served.'),
              ]),
            ],
          }),

          h('div', { class: 'tk-ads-side' }, [
            h('p', { class: 'tk-ads-rule' }, aud().rule),
            h('p', { class: 'tk-ads-body' }, aud().body),
            h('ul', { class: 'tk-ads-list' },
              aud().slots.length
                ? aud().slots.map(s => h('li', { key: s.label }, [h('strong', null, s.label), h('span', null, s.note)]))
                : [h('li', null, [h('strong', null, 'Zero placements'), h('span', null, 'The whole app, ad-free, for the people who pay for it.')])]
            ),
          ]),
        ]),
      ])
  },
})
