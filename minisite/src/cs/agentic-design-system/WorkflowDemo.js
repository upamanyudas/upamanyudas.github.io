import { defineComponent, h, ref, Transition } from 'vue'

/* Four maintenance jobs the agent ran on the production system */
const AGENT_ACTIONS = [
  {
    action: 'Drift audit',
    input: 'One question: do the stylesheet and the Figma variables still agree?',
    output: '38 semantic tokens existed in code but had never been published to Figma',
    outcome: 'All 38 reconciled — designers and the build now read the same list',
  },
  {
    action: 'Token consolidation',
    input: 'Agent grouped every text colour by resolved value, not by name',
    output: 'Text/Primary and Text/Body were two names for one near-navy, used interchangeably for a year',
    outcome: 'Collapsed by aliasing — one decision, no visual change, no migration',
  },
  {
    action: 'Dead token cleanup',
    input: 'Every custom property cross-referenced against every component and story',
    output: '11 tokens had no consumers left — a retired chart ramp, two overlay greys, a legacy brand gradient',
    outcome: 'Removed from code, with a matching Figma checklist for the library',
  },
  {
    action: 'Hardcoded colour hunt',
    input: 'Agent read the stylesheet looking for raw hex outside the primitive layer',
    output: 'Two components held a near-black directly — invisible in dark mode, invisible in review',
    outcome: 'Both re-pointed at --color-text-primary; dark mode fixed itself',
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
