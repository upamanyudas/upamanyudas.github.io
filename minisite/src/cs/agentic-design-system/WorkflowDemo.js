import { defineComponent, h, ref, Transition } from 'vue'

/* Four agent workflows that actually ran while building this site */
const AGENT_ACTIONS = [
  {
    action: 'Stylesheet triage',
    input: 'Agent diffed a 4,807-line reference stylesheet against the components this site actually ships',
    output: 'Nearly half the rules styled cards that don’t exist here',
    outcome: 'Trimmed to ~2,400 lines — every rule now has a consumer',
  },
  {
    action: 'Orphan token cleanup',
    input: 'Every CSS custom property grepped against every component and demo',
    output: '14 tokens had no consumers left — loose gradients, a stray brand orange, an entire unused font stack',
    outcome: 'Removed from tokens.css — 305 tokens remain, all of them live',
  },
  {
    action: 'Layout as data',
    input: 'Four filter layouts × two breakpoints, described only in layouts.yml',
    output: 'Agent computed gapless grid placements for all 12 cards in every state',
    outcome: 'Re-ordering the portfolio is now a YAML edit, not a code change',
  },
  {
    action: 'A third theme state',
    input: 'Asked for an auto mode that follows the OS — the reference site had only light and dark',
    output: 'The semantic token layer meant no component needed to know about it',
    outcome: 'Light → dark → auto shipped by changing one card and zero components',
  },
]

export default defineComponent({
  name: 'WorkflowDemo',
  setup() {
    const activeIdx = ref(0)
    const wrapRef = ref(null)

    // aria-hidden: decorative demo — workflows are summarised in the prose.
    return () =>
      h('div', { class: 'ads-workflow-demo', 'aria-hidden': 'true' }, [
        // Tab bar
        h('div', { class: 'ads-workflow-tabs' },
          AGENT_ACTIONS.map((a, i) =>
            h('button', {
              class: ['ads-workflow-tab', activeIdx.value === i ? 'ads-workflow-tab--active' : ''].filter(Boolean).join(' '),
              key: i,
              onClick: () => { activeIdx.value = i },
            }, a.action)
          )
        ),
        // Active card with crossfade + height animation
        h('div', { class: 'ads-workflow-card-wrap', ref: wrapRef }, [
          h(Transition, {
            name: 'ads-fade',
            mode: 'out-in',
            onBeforeLeave() {
              const wrap = wrapRef.value
              if (wrap) wrap.style.height = wrap.offsetHeight + 'px'
            },
            onEnter(el) {
              const wrap = wrapRef.value
              if (!wrap) return
              void el.offsetHeight
              wrap.style.height = el.offsetHeight + 'px'
            },
            onAfterEnter() {
              const wrap = wrapRef.value
              if (wrap) wrap.style.height = ''
            },
          }, () =>
            h('div', { class: 'ads-workflow-card', key: activeIdx.value }, [
              h('div', { class: 'ads-workflow-step ads-workflow-slide', style: { animationDelay: '0ms' } }, [
                h('span', { class: 'ads-workflow-label' }, 'Input'),
                h('p', null, AGENT_ACTIONS[activeIdx.value].input),
              ]),
              h('div', { class: 'ads-workflow-arrow ads-workflow-slide', style: { animationDelay: '80ms' } }, '→'),
              h('div', { class: 'ads-workflow-step ads-workflow-slide', style: { animationDelay: '160ms' } }, [
                h('span', { class: 'ads-workflow-label' }, 'Finding'),
                h('p', null, AGENT_ACTIONS[activeIdx.value].output),
              ]),
              h('div', { class: 'ads-workflow-arrow ads-workflow-slide', style: { animationDelay: '240ms' } }, '→'),
              h('div', { class: 'ads-workflow-step ads-workflow-step--outcome ads-workflow-slide', style: { animationDelay: '320ms' } }, [
                h('span', { class: 'ads-workflow-label' }, 'Outcome'),
                h('p', null, AGENT_ACTIONS[activeIdx.value].outcome),
              ]),
            ])
          ),
        ]),
      ])
  },
})
