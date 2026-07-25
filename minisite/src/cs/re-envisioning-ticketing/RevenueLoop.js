import { defineComponent, h, ref } from 'vue'

/**
 * RevenueLoop — the whiteboard diagram from the leadership pitch, made clickable.
 * Ticketing earns on the left. Engagement earns nothing on its own; it earns by
 * making the ad server worth building, and by keeping a dreamer one tap away.
 */
const NODES = {
  ticketing: {
    title: 'Ticketing',
    kicker: 'Direct revenue',
    body: 'Movies and live entertainment. Twenty years of it, and the only line on the P&L when this started. Untouched by the redesign on purpose — you do not rebuild the engine mid-flight.',
  },
  guide: {
    title: 'Watch Guide',
    kicker: 'New product',
    body: 'What to watch, and which service you already pay for that has it. The most honest thing we shipped: it sends people somewhere we earn nothing, and earns their next visit.',
  },
  buzz: {
    title: 'Buzz',
    kicker: 'Daily habit',
    body: 'A daily feed for the twenty-nine days a month nobody is booking anything. Ten seconds of dwell became roughly thirteen minutes.',
  },
  ads: {
    title: 'Smart ad server',
    kicker: 'Indirect revenue',
    body: 'Never to a loyal booker. Personalised to infrequent users to push them back toward a booking. Broad inventory to dreamers. The rules were the design work — the units were the easy half.',
  },
}

const ORDER = ['ticketing', 'guide', 'buzz', 'ads']

export default defineComponent({
  name: 'RevenueLoop',
  setup() {
    const active = ref('ads')

    const node = key => h('button', {
      key,
      class: ['tk-node', `tk-node--${key}`, active.value === key ? 'tk-node--on' : ''].join(' '),
      onClick: () => { active.value = key },
    }, [
      h('span', { class: 'tk-node-kicker' }, NODES[key].kicker),
      h('span', { class: 'tk-node-title' }, NODES[key].title),
    ])

    return () =>
      h('div', { class: 'tk-loop' }, [
        h('p', { class: 'tk-loop-crown' }, 'Revenue'),

        h('div', { class: 'tk-loop-row' }, [
          node('ticketing'),
          h('div', { class: 'tk-loop-mid' }, [
            h('span', { class: 'tk-loop-midlabel' }, 'Drive engagement'),
            node('guide'),
            node('buzz'),
          ]),
          node('ads'),
        ]),

        h('div', { class: 'tk-loop-detail' }, [
          h('h4', null, NODES[active.value].title),
          h('p', null, NODES[active.value].body),
        ]),

        h('p', { class: 'cs-note' }, `${ORDER.indexOf(active.value) + 1} of ${ORDER.length} — click any block.`),
      ])
  },
})
