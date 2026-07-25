import { defineComponent, h, ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * ThemeWindow — replaces a "dark mode in Storybook" screenshot.
 * A miniature component gallery with its own working light / dark / auto
 * switch. Auto genuinely follows your OS, scoped to this window only.
 */
export default defineComponent({
  name: 'ThemeWindow',
  setup() {
    const mode = ref('light')
    const systemDark = matchMedia('(prefers-color-scheme: dark)')
    const sysDark = ref(systemDark.matches)

    function onSystem(e) { sysDark.value = e.matches }
    onMounted(() => systemDark.addEventListener('change', onSystem))
    onUnmounted(() => systemDark.removeEventListener('change', onSystem))

    const isDark = computed(() => mode.value === 'dark' || (mode.value === 'auto' && sysDark.value))

    const miniCard = (cls, children) =>
      h('div', { class: `tw-mini-card ${cls}` }, children)

    return () =>
      h('div', { class: ['tw-window', isDark.value ? 'tw-window--dark' : ''].join(' '), 'aria-hidden': 'true' }, [
        // Title bar
        h('div', { class: 'tw-bar' }, [
          h('div', { class: 'tw-dots' }, [
            h('span', { class: 'tw-dot tw-dot--red' }),
            h('span', { class: 'tw-dot tw-dot--yellow' }),
            h('span', { class: 'tw-dot tw-dot--green' }),
          ]),
          h('span', { class: 'tw-title' }, 'components / gallery'),
          h('div', { class: 'tw-modes' },
            ['light', 'dark', 'auto'].map(m =>
              h('button', {
                class: ['tw-mode-btn', mode.value === m ? 'tw-mode-btn--active' : ''].join(' '),
                onClick: () => { mode.value = m },
              }, m)
            )
          ),
        ]),

        // Mini bento gallery — every surface driven by the same semantic vars
        h('div', { class: 'tw-canvas' }, [
          miniCard('tw-mini-about', [
            h('span', { class: 'tw-mini-avatar' }),
            h('span', { class: 'tw-mini-lines' }, [
              h('span', { class: 'tw-mini-line' }),
              h('span', { class: 'tw-mini-line tw-mini-line--short' }),
            ]),
          ]),
          miniCard('tw-mini-stat', [
            h('span', { class: 'tw-mini-stat-value' }, '517M+'),
            h('span', { class: 'tw-mini-line tw-mini-line--short' }),
          ]),
          miniCard('tw-mini-quote', [
            h('span', { class: 'tw-mini-quote-mark' }, '“'),
            h('span', { class: 'tw-mini-lines' }, [
              h('span', { class: 'tw-mini-line' }),
              h('span', { class: 'tw-mini-line tw-mini-line--short' }),
            ]),
          ]),
        ]),

        h('p', { class: 'tw-caption' },
          mode.value === 'auto'
            ? (sysDark.value ? 'Following your OS — it is dark right now.' : 'Following your OS — it is light right now.')
            : 'Three surfaces, one semantic layer, zero per-component theme code.'),
      ])
  },
})
