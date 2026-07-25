import { defineComponent, h, ref, computed, onMounted, onUnmounted } from 'vue'

/**
 * ThemeWindow — replaces a "dark mode in Storybook" screenshot.
 * Three product surfaces with a working light / dark / auto switch.
 * Auto genuinely follows your OS, scoped to this window only.
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
          h('span', { class: 'tw-title' }, 'storybook / surfaces'),
          h('div', { class: 'tw-modes' },
            ['light', 'dark', 'auto'].map(m =>
              h('button', {
                class: ['tw-mode-btn', mode.value === m ? 'tw-mode-btn--active' : ''].join(' '),
                onClick: () => { mode.value = m },
              }, m)
            )
          ),
        ]),

        // Three product surfaces, every colour resolved through the semantic layer
        h('div', { class: 'tw-canvas' }, [
          miniCard('tw-mini-advisor', [
            h('span', { class: 'tw-mini-avatar' }),
            h('span', { class: 'tw-mini-lines' }, [
              h('span', { class: 'tw-mini-line' }),
              h('span', { class: 'tw-mini-line tw-mini-line--short' }),
            ]),
            h('span', { class: 'tw-mini-badge tw-mini-badge--advisor' }, 'advisor'),
          ]),
          miniCard('tw-mini-savings', [
            h('span', { class: 'tw-mini-figure' }, '$41,600'),
            h('span', { class: 'tw-mini-caption' }, 'saved'),
          ]),
          miniCard('tw-mini-schedule', [
            h('span', { class: 'tw-mini-badge tw-mini-badge--overdue' }, 'overdue'),
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
