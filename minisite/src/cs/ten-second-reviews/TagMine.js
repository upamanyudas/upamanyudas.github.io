import { defineComponent, h, ref, computed, onUnmounted } from 'vue'

/**
 * TagMine — where the hashtags came from. Three hundred real reviews, read for
 * the words people already reach for. We didn't write the vocabulary; we counted it.
 */
const REVIEWS = [
  { text: 'Jhakaas! Total paisa vasool, go watch it first day first show.', hits: ['#Jhakaas', '#PaisaVasool'] },
  { text: 'Blockbuster material. Second half drags but the acting is strong.', hits: ['#Blockbuster', '#StrongActing'] },
  { text: 'Must watch on the big screen. Timepass if you go with friends.', hits: ['#MustWatch', '#Timepass'] },
  { text: 'Overrated honestly. Average story, good performances.', hits: ['#Overrated', '#Average', '#StrongActing'] },
  { text: 'Epic visuals, entertaining throughout, one of the year’s best.', hits: ['#Epic', '#Entertaining'] },
  { text: 'Paisa vasool. Must watch with family, crowd was clapping.', hits: ['#PaisaVasool', '#MustWatch', '#CrowdPleaser'] },
  { text: 'Good story, memorable ending, strong acting from the lead.', hits: ['#GoodStory', '#Memorable', '#StrongActing'] },
  { text: 'Entertaining but average. Timepass, nothing more.', hits: ['#Entertaining', '#Average', '#Timepass'] },
]

export default defineComponent({
  name: 'TagMine',
  setup() {
    const read = ref(REVIEWS.length)
    let timer = null

    const counts = computed(() => {
      const tally = {}
      REVIEWS.slice(0, read.value).forEach(r => r.hits.forEach(t => { tally[t] = (tally[t] || 0) + 1 }))
      return Object.entries(tally).sort((a, b) => b[1] - a[1])
    })

    function run() {
      clearInterval(timer)
      read.value = 0
      timer = setInterval(() => {
        read.value += 1
        if (read.value >= REVIEWS.length) clearInterval(timer)
      }, 420)
    }
    onUnmounted(() => clearInterval(timer))

    return () =>
      h('div', { class: 'rv-mine' }, [
        h('div', { class: 'cs-toolbar' }, [
          h('span', { class: 'rv-mine-count' }, `${read.value} of ${REVIEWS.length} read · ${counts.value.length} tags found`),
          h('button', { class: 'cs-run', onClick: run }, 'Read them again'),
        ]),

        h('div', { class: 'rv-mine-cols' }, [
          h('div', { class: 'rv-mine-feed' },
            REVIEWS.map((r, i) =>
              h('p', {
                key: r.text,
                class: ['rv-mine-review', i < read.value ? 'rv-mine-review--on' : ''].join(' '),
              }, r.text)
            )
          ),

          h('div', { class: 'rv-mine-tags' },
            counts.value.length
              ? counts.value.map(([tag, n]) =>
                  h('span', { key: tag, class: 'rv-mine-tag' }, [
                    h('em', null, tag),
                    h('i', { class: 'rv-mine-bar', style: { width: `${n * 22}px` } }),
                    h('b', null, String(n)),
                  ])
                )
              : [h('p', { class: 'rv-mine-empty' }, 'Nothing yet.')]
          ),
        ]),

        h('p', { class: 'cs-note' },
          'Eight of the three hundred, for the sake of your scroll. The real pass produced the shortlist that became the tag set — including two that only make sense in Hindi, which is exactly why we did not invent them ourselves.'),
      ])
  },
})
