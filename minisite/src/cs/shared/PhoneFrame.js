import { defineComponent, h } from 'vue'

/** Device chrome shared by the mobile case-study demos. Screen content comes in as the default slot. */
export default defineComponent({
  name: 'PhoneFrame',
  props: {
    label: { type: String, default: '' },
    dark:  { type: Boolean, default: false },
    tone:  { type: String, default: '' },   // extra class for per-study screen theming
  },
  setup(props, { slots }) {
    return () => h('figure', { class: 'pf' }, [
      h('div', { class: ['pf-body', props.dark ? 'pf-body--dark' : '', props.tone].filter(Boolean).join(' ') }, [
        h('span', { class: 'pf-notch' }),
        h('div', { class: 'pf-screen' }, slots.default?.()),
      ]),
      props.label ? h('figcaption', { class: 'pf-label' }, props.label) : null,
    ])
  },
})
