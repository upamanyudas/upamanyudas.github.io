import { defineComponent, h } from 'vue'

/**
 * TldrToggle — reusable Detailed / TL;DR pill-bar toggle.
 *
 * Props:
 *   modelValue : boolean — true = TL;DR mode active
 *
 * Emits:
 *   update:modelValue : boolean
 *
 * Usage:
 *   h(TldrToggle, { modelValue: tldr.value, 'onUpdate:modelValue': v => { tldr.value = v } })
 */
export default defineComponent({
  name: 'TldrToggle',
  props: {
    modelValue: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () =>
      h('div', { class: 'tldr-bar' }, [
        h('div', {
          class: 'tldr-indicator',
          style: { transform: props.modelValue ? 'translateX(calc(100% + 4px))' : 'translateX(0)' },
        }),
        h('button', {
          class: ['tldr-pill', !props.modelValue ? 'tldr-pill--active' : ''].filter(Boolean).join(' '),
          onClick: () => emit('update:modelValue', false),
        }, 'Detailed'),
        h('button', {
          class: ['tldr-pill', props.modelValue ? 'tldr-pill--active' : ''].filter(Boolean).join(' '),
          onClick: () => emit('update:modelValue', true),
        }, 'TL;DR'),
      ])
  },
})
