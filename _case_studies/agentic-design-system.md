---
cs_key: agenticds
slug: agentic-design-system
title: "I didn't ask AI to design my portfolio. I rebuilt my portfolio so AI could design with me."
description: "This site is the case study — 305 tokens in three layers, content as data, and four autonomous agent workflows that maintain it."
date: 2026-07-25
tooltip: "This site is the case study —\na design system AI can operate 🤖"
---

<div class="cs-body" markdown="1">

# I didn't ask AI to design my portfolio. I rebuilt my portfolio so AI could design with me.
{: .cs-title}

<div class="tldr-collapsible" markdown="1">
Most AI-assisted design work follows the same script: a designer prompts a model, the model generates screens, tokens, copy. The AI builds things *for* you. The output is static — the moment it lands, the system stops being able to look after itself.
{: .cs-body-text}

This project asks the opposite question: what happens if the design system is structured so an agent can operate *inside* it — auditing tokens, re-flowing layouts, rewriting content, and keeping everything in sync — the same way a designer on my team would?
{: .cs-body-text}
</div>

## My role
{: .cs-section-title}

I lead a design org by day, and this portfolio is my sandbox. Rather than experimenting on a production system I'm responsible for, I made my own site the test subject: real design system, real content, real constraints — and every mistake is mine to keep.
{: .cs-body-text}

## Stack
{: .cs-section-title}

Jekyll, Vue 3 (no build step), CSS custom properties, YAML + markdown content, Claude as the agent.
{: .cs-body-text}

<div class="tldr-collapsible" markdown="1">
## The hypothesis
{: .cs-section-title}

A design system is no longer documentation for developers. It's instructions for a machine. If that's true, three things should hold: the token architecture must be semantically layered, the content must live as structured data rather than markup, and the naming must carry enough meaning that an agent can make judgment calls without me.
{: .cs-body-text}

I wanted to test this on a real system — not a demo with two buttons and a colour ramp. This site ships 12 cards, a full case-study engine, dark mode, and 305 design tokens that all have to stay coherent while an agent works on them.
{: .cs-body-text}
</div>

## Token architecture
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
The foundation is a three-layer token system. Primitives hold raw values — hex colours, scales, font stacks. Semantic tokens alias primitives by intent: `--color-text-primary`, `--color-bg-body`. Component tokens scope to specific patterns — the Claude-orange case-study card, the kea's underwing, the terminal chrome.
{: .cs-body-text}

The layering is what makes the system machine-readable. An agent meeting `--color-text-primary` doesn't need taste — it follows the chain: semantic → primitive → raw value. Rename a primitive and nothing downstream cares. That indirection is the entire trick.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="token-layers" data-hint="Explore the three token layers"></div>

<div class="tldr-collapsible" markdown="1">
The same chain is what an agent walks when it audits the system. Here it is, live — flip the theme and watch the semantic layer re-point while the component column never changes.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="token-arch" data-hint="Flip the theme — the middle column does the work"></div>

## Dark mode as proof
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
Dark mode is the cheapest test of whether a token architecture is honest. If components reference semantic tokens, dark mode is one attribute swap on the root element. If any component holds a raw hex, it gets caught red-handed.
{: .cs-body-text}

It also earned this site a feature the original inspiration doesn't have: a third, *auto* state that follows your OS live. Because no component knows what theme it's in, adding a whole new state touched one card and zero components.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="theme-window" data-hint="A working theme switch — try auto"></div>

## Content as data
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
The second structural bet: no words live in components. The bio, the impact numbers, the grid order, this very paragraph — all YAML and markdown that Jekyll renders and the components consume. An agent rewriting my about section never opens a `.js` file; a CMS can bolt on later without a line of code changing.
{: .cs-body-text}

The grid is the clearest example. Every filter state, desktop and mobile, is a small YAML map of card → grid position. Re-ordering the portfolio is a data edit, and the FLIP animation comes along for free.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="content-data" data-hint="layouts.yml on the left, the grid on the right"></div>

## Agent workflows
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
With the structure in place, I handed the agent four real maintenance jobs — the kind I'd normally give a designer with a spare afternoon. Each one worked because the system's naming and layering carried the context.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="agent-workflows" data-hint="Click each workflow to see the full loop"></div>

<div class="tldr-collapsible" markdown="1">
The part that matters: none of these followed a script. For the token audit, the agent decided on its own to grep every custom property against every module, cross-reference the results, and rewrite the token file — from one prompt asking whether things were in sync. Structure gave it enough context to make the judgment calls.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="drift-audit" data-hint="The actual audit, replayed"></div>

## Results
{: .cs-section-title}

<div class="ads-results">
  <div class="ads-result-card">
    <span class="ads-result-number">305</span>
    <span class="ads-result-label">design tokens in three layers — every one with a consumer</span>
  </div>
  <div class="ads-result-card">
    <span class="ads-result-number">49%</span>
    <span class="ads-result-label">of the reference stylesheet removed by the agent's triage</span>
  </div>
  <div class="ads-result-card">
    <span class="ads-result-number">0</span>
    <span class="ads-result-label">bitmap screenshots — every figure on this page is a live component</span>
  </div>
  <div class="ads-result-card">
    <span class="ads-result-number">4</span>
    <span class="ads-result-label">autonomous agent workflows validated on a real system</span>
  </div>
</div>

## What I learned
{: .cs-section-title}

The biggest one: **quality becomes measurable**. When every token has a semantic name and every piece of content is data, "design system health" stops being a feeling and starts being a number an agent can report. The audit above isn't an illustration — it ran, and the token file is cleaner because of it.
{: .cs-body-text}

The second: **the craft moves upstream**. An agent assembling from a sloppy system produces sloppy interfaces, faster. The deliberate choices — a warm off-white instead of default grey, an orange underwing on a hover state — are what make the assembled output feel designed. The agent's work is only as good as the vocabulary it assembles from.
{: .cs-body-text}

<div class="tldr-collapsible" markdown="1">
And a quieter one, from years of leading design teams: briefing an agent well is the same skill as briefing a designer well. Clear intent, honest constraints, and the humility to let the executor make calls inside them. The teams I've built taught me that long before the tools did.
{: .cs-body-text}

The design system is no longer just documentation for developers. It's instructions for a machine — and the designer's job is to make those instructions worth following.
{: .cs-closing}
</div>

<div class="cs-demo" data-demo="repo-window"></div>

</div>
