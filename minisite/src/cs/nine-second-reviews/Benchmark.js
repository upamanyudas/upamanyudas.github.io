import { defineComponent, h, ref } from 'vue'

/**
 * Benchmark — the competitive teardown, kept as constructs rather than logos.
 * What we took from each is the last line; what we left is usually more interesting.
 */
const APPS = [
  {
    key: 'five', kind: 'Five-point stars',
    who: 'Nearly every marketplace on the home screen',
    took: 'The convention people have learned. We could not use it — the heart was already the mark.',
    demo: 'stars',
  },
  {
    key: 'ten', kind: 'Ten-point scale',
    who: 'The long-standing film database',
    took: 'Proof a ten-point scale survives at scale. Also proof that ten discrete targets is a decision, not a reflex.',
    demo: 'ten',
  },
  {
    key: 'graph', kind: 'Distribution graph',
    who: 'Food delivery and film databases',
    took: 'Show the spread, not just the average. We put it on the detail page so a 70% with a flat spread reads differently to a 70% with two camps.',
    demo: 'graph',
  },
  {
    key: 'compliment', kind: 'Compliments, not prose',
    who: 'Ride-hailing',
    took: 'The single most useful idea in the whole review. Give people buttons instead of a blank field and the contribution rate stops being a motivation problem.',
    demo: 'chips',
  },
  {
    key: 'slider', kind: 'Draggable slider',
    who: 'Social stories',
    took: 'Evidence that people will drag a control for fun — if, and only if, it looks draggable.',
    demo: 'slider',
  },
]

const HEART = 'M12 20s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 4.65-7 9-7 9Z'

function preview(kind) {
  if (kind === 'stars') {
    return h('div', { class: 'rv-bm-row' }, Array.from({ length: 5 }, (_, i) =>
      h('span', { key: i, class: ['rv-bm-star', i < 4 ? 'rv-bm-star--on' : ''].join(' ') }, '★')))
  }
  if (kind === 'ten') {
    return h('div', { class: 'rv-bm-row' }, Array.from({ length: 10 }, (_, i) =>
      h('span', { key: i, class: ['rv-bm-pip', i < 7 ? 'rv-bm-pip--on' : ''].join(' ') })))
  }
  if (kind === 'graph') {
    return h('div', { class: 'rv-bm-graph' }, [8, 14, 26, 46, 72, 58, 34, 20, 12, 7].map((v, i) =>
      h('i', { key: i, style: { height: `${v}%` } })))
  }
  if (kind === 'chips') {
    return h('div', { class: 'rv-bm-row rv-bm-row--wrap' },
      ['Great story', 'Worth it', 'Too long'].map(c => h('span', { key: c, class: 'rv-bm-chip' }, c)))
  }
  return h('div', { class: 'rv-bm-slider' }, [
    h('i', { class: 'rv-bm-track' }),
    h('svg', { class: 'rv-bm-thumb', viewBox: '0 0 24 24', width: 18, height: 18 }, [h('path', { d: HEART, fill: 'currentColor' })]),
  ])
}

export default defineComponent({
  name: 'Benchmark',
  setup() {
    const open = ref('compliment')

    return () =>
      h('div', { class: 'rv-bm' }, APPS.map(a =>
        h('button', {
          key: a.key,
          class: ['rv-bm-card', open.value === a.key ? 'rv-bm-card--on' : ''].join(' '),
          onClick: () => { open.value = a.key },
        }, [
          h('div', { class: 'rv-bm-preview' }, [preview(a.demo)]),
          h('h5', null, a.kind),
          h('span', { class: 'rv-bm-who' }, a.who),
          open.value === a.key ? h('p', { class: 'rv-bm-took' }, a.took) : null,
        ])
      ))
  },
})
