import { defineComponent, h, ref, computed } from 'vue'

/**
 * TeamShape — the org before, during and after the pipeline landed.
 * The headcount barely moves; where it sits moves completely.
 */
const STAGES = [
  {
    year: 'Before',
    caption: 'A service desk with seventy people in it. Every banner, every poster, every crop drawn by hand, briefed in a corridor.',
    product: 15, craft: 55, moved: 0, tat: '24 hr', sizes: '11 sizes',
  },
  {
    year: 'Templates land',
    caption: 'Two image sizes, guidelines written as instructions, and every request on a ticket. The queue got shorter than the argument about the queue.',
    product: 15, craft: 34, moved: 21, tat: '6 hr', sizes: '4 sizes',
  },
  {
    year: 'After',
    caption: 'Twenty people making assets. Thirty-five redeployed into ad-tech, Watch Guide and Buzz — the three products the change paid for. Nobody left.',
    product: 15, craft: 20, moved: 35, tat: '2 hr', sizes: '2 sizes',
  },
]

export default defineComponent({
  name: 'TeamShape',
  setup() {
    const idx = ref(0)
    const s = computed(() => STAGES[idx.value])

    const group = (n, cls, label) => h('div', { class: 'tk-org-group' }, [
      h('div', { class: 'tk-org-dots' },
        Array.from({ length: n }, (_, i) =>
          h('span', { key: i, class: `tk-org-dot ${cls}`, style: { transitionDelay: `${i * 8}ms` } })
        )
      ),
      h('span', { class: 'tk-org-label' }, `${n} · ${label}`),
    ])

    return () =>
      h('div', { class: 'tk-org' }, [
        h('input', {
          class: 'tk-slider',
          type: 'range', min: 0, max: STAGES.length - 1, step: 1,
          value: idx.value,
          'aria-label': 'Stage',
          onInput: e => { idx.value = +e.target.value },
        }),
        h('div', { class: 'tk-org-ticks' }, STAGES.map((st, i) =>
          h('button', {
            key: st.year,
            class: ['tk-org-tick', idx.value === i ? 'tk-org-tick--on' : ''].join(' '),
            onClick: () => { idx.value = i },
          }, st.year)
        )),

        h('div', { class: 'tk-org-groups' }, [
          group(s.value.product, 'tk-org-dot--product', 'product designers'),
          group(s.value.craft, 'tk-org-dot--craft', 'making assets'),
          s.value.moved ? group(s.value.moved, 'tk-org-dot--moved', 'moved onto the new products') : null,
        ]),

        h('div', { class: 'tk-org-meta' }, [
          h('span', null, [h('strong', null, s.value.tat), ' to make a show live']),
          h('span', null, [h('strong', null, s.value.sizes), ' in production']),
        ]),

        h('p', { class: 'cs-note' }, s.value.caption),
      ])
  },
})
