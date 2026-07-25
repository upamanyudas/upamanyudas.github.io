import { defineComponent, h, ref, onMounted, onUnmounted } from 'vue'

export default defineComponent({
  name: 'BackToTop',
  setup() {
    const visible = ref(false)
    let scrolling = false   // true while our own animation is running

    function onScroll() {
      if (scrolling) return  // ignore scroll events from our animation
      visible.value = window.scrollY > window.innerHeight
    }

    function scrollToTop() {
      const start = window.scrollY
      if (start === 0) return

      scrolling = true
      const startTime = performance.now()
      const duration = 500

      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)   // ease-out cubic
        window.scrollTo(0, start * (1 - ease))
        if (progress < 1) {
          requestAnimationFrame(step)
        } else {
          scrolling = false
          visible.value = false
        }
      }

      requestAnimationFrame(step)
    }

    onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
    onUnmounted(() => window.removeEventListener('scroll', onScroll))

    return () =>
      h(
        'button',
        {
          class: ['back-to-top', visible.value ? 'back-to-top--visible' : ''],
          onClick: scrollToTop,
          'aria-label': 'Back to top',
        },
        // Up-arrow SVG icon
        h(
          'svg',
          {
            xmlns: 'http://www.w3.org/2000/svg',
            width: '20',
            height: '20',
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          [
            h('polyline', { points: '18 15 12 9 6 15' }),
          ]
        )
      )
  },
})
