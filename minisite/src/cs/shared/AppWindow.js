import { defineComponent, h } from 'vue'

/** Desktop app chrome for the dashboard demos — side nav, title bar, content slot. */
const NAV = ['Dashboard', 'Taxpayer Accounts', 'Group Optimiser', 'Tax Calculator', 'Reports', 'Contacts']

export default defineComponent({
  name: 'AppWindow',
  props: {
    title:  { type: String, default: '' },
    active: { type: String, default: 'Group Optimiser' },
    nav:    { type: Boolean, default: true },
  },
  setup(props, { slots }) {
    return () => h('div', { class: 'aw' }, [
      props.nav
        ? h('aside', { class: 'aw-nav' }, NAV.map(n =>
            h('span', { key: n, class: ['aw-nav-item', n === props.active ? 'aw-nav-item--on' : ''].join(' ') }, n)
          ))
        : null,
      h('div', { class: 'aw-main' }, [
        props.title ? h('div', { class: 'aw-bar' }, props.title) : null,
        h('div', { class: 'aw-body' }, slots.default?.()),
      ]),
    ])
  },
})
