import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'
import PhoneFrame from '../shared/PhoneFrame.js'

/**
 * BuzzFeed — the content tab, with the metric that justified it running live.
 * The dwell counter only ticks while the feed is actually being scrolled,
 * which is the same rule the analytics used.
 */
const STORIES = ['Born today', 'What2Watch', 'Watch Guide', 'DeadArt', 'Mixtape', 'Backstage']

const POSTS = [
  { kicker: 'Streaming', title: 'Everything new on the platforms this month', meta: 'Editorial · 1 hour ago', likes: 3234, tall: true },
  { kicker: 'Live from HQ', title: 'Watch them live for ₹0', meta: 'Live · starts 8pm', cta: 'Register', likes: 1102 },
  { kicker: 'Box office', title: 'The weekend numbers, and what they mean for next Friday', meta: 'Editorial · 3 hours ago', likes: 876 },
  { kicker: 'Top 10', title: 'The reviews everyone is arguing about', meta: 'Community · today', likes: 2410, tall: true },
]

export default defineComponent({
  name: 'BuzzFeed',
  setup() {
    const story = ref(0)
    const liked = ref({})
    const dwell = ref(0)
    const scroller = ref(null)
    let timer = null
    let lastScroll = 0

    // Dwell only counts while the thumb is moving — same rule as the analytics.
    function onScroll() { lastScroll = Date.now() }

    onMounted(() => {
      timer = setInterval(() => {
        if (Date.now() - lastScroll < 1200) dwell.value += 1
      }, 1000)
    })
    onUnmounted(() => clearInterval(timer))

    const clock = () => {
      const m = Math.floor(dwell.value / 60)
      const s = String(dwell.value % 60).padStart(2, '0')
      return `${m}:${s}`
    }

    const toggleLike = i => { liked.value = { ...liked.value, [i]: !liked.value[i] } }

    const heart = on => h('svg', {
      class: ['tk-heart', on ? 'tk-heart--on' : ''].join(' '),
      viewBox: '0 0 24 24', width: 14, height: 14,
      fill: on ? 'currentColor' : 'none', stroke: 'currentColor', 'stroke-width': 1.8,
    }, [h('path', { d: 'M12 20s-7-4.35-7-9a4 4 0 0 1 7-2.65A4 4 0 0 1 19 11c0 4.65-7 9-7 9Z' })])

    return () =>
      h('div', { class: 'tk-buzz' }, [
        h(PhoneFrame, { dark: true }, {
          default: () => [
            h('div', { class: 'tk-buzz-head' }, [
              h('strong', null, 'Buzz'),
              h('span', null, 'Discover what’s happening'),
            ]),

            h('div', { class: 'tk-buzz-rail' },
              STORIES.map((s, i) =>
                h('button', {
                  key: s,
                  class: ['tk-story', story.value === i ? 'tk-story--on' : ''].join(' '),
                  onClick: () => { story.value = i; lastScroll = Date.now() },
                }, [h('span', { class: 'tk-story-ring' }), h('span', { class: 'tk-story-label' }, s)])
              )
            ),

            h('div', { ref: scroller, class: 'tk-buzz-scroll', onScroll }, [
              h('p', { class: 'tk-buzz-now' }, STORIES[story.value] + ' — tap through the highlights'),
              ...POSTS.map((p, i) =>
                h('article', { key: p.title, class: ['tk-post', p.tall ? 'tk-post--tall' : ''].join(' ') }, [
                  h('div', { class: 'tk-post-art' }, [h('span', { class: 'tk-post-kicker' }, p.kicker)]),
                  h('h5', null, p.title),
                  h('div', { class: 'tk-post-foot' }, [
                    h('button', { class: 'tk-post-like', onClick: () => toggleLike(i) }, [
                      heart(!!liked.value[i]),
                      h('span', null, String(p.likes + (liked.value[i] ? 1 : 0))),
                    ]),
                    h('span', { class: 'tk-post-meta' }, p.meta),
                    p.cta ? h('span', { class: 'tk-post-cta' }, p.cta) : null,
                  ]),
                ])
              ),
              h('p', { class: 'tk-buzz-end' }, 'You are up to date.'),
            ]),
          ],
        }),

        h('div', { class: 'tk-dwell' }, [
          h('span', { class: 'tk-dwell-time' }, clock()),
          h('span', { class: 'tk-dwell-caption' }, 'your time on tab · the old average was 0:10, the new one about 13:00'),
        ]),
      ])
  },
})
