---
cs_key: agenticds
slug: agentic-design-system
title: "Nobody reads the design system. So I rewrote ours for the thing that does."
description: "A fintech design system rebuilt as instructions for a machine — 412 tokens in three layers, 26 components with specs an agent can read, and four maintenance jobs it now runs on its own."
date: 2026-07-25
tooltip: "A design system rebuilt as\ninstructions for a machine 🤖"
---

<!-- VET (numbers): 412 tokens · 26 components · 38 drifted · 11 dead · team of five
     are directional, not audited. Derived from a ~26-component fintech library with
     dark mode and a full state matrix (industry norm ≈ 350–500 tokens at that size).
     Replace with the real figures before this goes out. Stack line (React + TS,
     Storybook 10, Figma MCP) also needs confirming. -->

<div class="cs-body" markdown="1">

# Nobody reads the design system. So I rewrote ours for the thing that does.
{: .cs-title}

<div class="tldr-collapsible" markdown="1">
Most AI-assisted design work runs the same play: a designer prompts a model, the model produces screens, tokens, copy. The AI makes things *for* you, once, and then the output sits there — a system that can't look after itself.
{: .cs-body-text}

We tried the inverse. Instead of asking an agent to design our product, I rebuilt the design system so an agent could work *inside* it — auditing tokens, catching drift, correcting components, keeping Figma and code telling the same story. The same jobs I'd hand a designer with a spare Thursday.
{: .cs-body-text}
</div>

## My role
{: .cs-section-title}

I led design at a fintech whose product does one unglamorous, enormously valuable thing: it helps small businesses pay their tax on better terms, usually through the accountant who already does their books. Money saved is the whole proposition — the platform has taken hundreds of millions in interest and penalties off small businesses' bills.
{: .cs-body-text}

Which makes the interface almost entirely numbers, dates, statuses and money. Those four are exactly where a design system either holds or quietly leaks. I owned the system, and I rebuilt it for a reader I hadn't designed for before.
{: .cs-body-text}

## Stack
{: .cs-section-title}

Figma, Storybook 10, Figma MCP, CSS custom properties, React + TypeScript, Claude as the agent.
{: .cs-body-text}

<div class="tldr-collapsible" markdown="1">
## The hypothesis
{: .cs-section-title}

A design system stopped being documentation for developers the day an agent could read it. If it's now instructions for a machine, three things have to be true: the tokens must be semantically layered, every component must describe itself in a way a machine can parse, and the naming must carry enough meaning that an agent can make a judgment call without me in the room.
{: .cs-body-text}

Worth testing on something real, not a demo with two buttons and a colour ramp. This system runs 26 components, dark mode, a state matrix that covers overdue payments and half-filed returns, and 412 tokens that all have to stay coherent while an agent works on them.
{: .cs-body-text}
</div>

## Token architecture
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
Three layers. Primitives hold raw values — hex, scales, font stacks — and no component is allowed to touch them. Semantic tokens alias primitives by intent: `--color-text-primary`, `--color-status-critical`. Component tokens scope to a single pattern — the savings figure, the payment schedule, the badge that says an accountant is acting on a client's behalf.
{: .cs-body-text}

The layering is what makes it machine-readable. An agent that meets `--color-status-critical` doesn't need taste; it follows the chain — semantic to primitive to raw value — and lands somewhere defensible. Rename a primitive and nothing downstream notices. That indirection is the entire trick.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="token-layers" data-hint="Explore the three token layers"></div>

<div class="tldr-collapsible" markdown="1">
Here's the chain the agent walks when it audits us. Flip the theme and watch the semantic column re-point while the component column sits perfectly still.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="token-arch" data-hint="Flip the theme — the middle column does the work"></div>

## Dark mode as proof
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
Dark mode is the cheapest honesty test a token architecture can take. If components only ever reference semantic tokens, dark mode is one attribute on the root element. If anything is holding a raw hex, it gets caught red-handed the moment the lights go down.
{: .cs-body-text}

Storybook found ours. Two components had hardcoded near-black text — a statement label and an icon caption — invisible in dark mode and invisible in review, because nobody clicks every story. The agent found them by reading the stylesheet, not by looking at pixels.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="theme-window" data-hint="A working theme switch — try auto"></div>

## Descriptions written for machines
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
The second structural bet, and the one that changed how my team worked. Figma MCP reads component descriptions — so those descriptions stopped being a sentence for a designer browsing the library and became a spec for something that has to rebuild the component from words alone.
{: .cs-body-text}

"A card that shows a client's tax position" is true and completely useless. What an agent needs is the surface token, the border token, the elevation, every prop and its accepted values, and what happens on hover. Write that down once and the agent stops guessing.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="component-spec" data-hint="Same component, two readers"></div>

## Every state, drawn
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
An agent will never leave a gap empty. Skip the disabled state and it will invent one — usually 50% opacity on everything, including the text you spent a week getting legible. Skip the error state on a payment row and it will reach for the nearest red it can find.
{: .cs-body-text}

So the state matrix became non-negotiable: every component ships with every state drawn and bound to a token, including the awkward ones this product can't avoid — a payment that's overdue, a return that's part-filed, a client an accountant hasn't been authorised for yet. Completeness is what keeps the agent from improvising.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="state-matrix" data-hint="Every state, and the token behind it"></div>

## Figma as the source of truth
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
Two canonical files, deliberately split. One holds tokens — variables, text styles, the primitive and semantic collections. The other holds components and their machine-readable descriptions. The split isn't tidiness: it means an agent asked about a colour queries one file, and an agent asked about a component queries the other, instead of trawling both and picking wrong.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="figma-source"></div>

## Agent workflows
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
With the structure in place I handed the agent four real maintenance jobs — the unloved kind that slip for a quarter because there's always something shipping. Each one worked because the naming and the layering carried the context.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="agent-workflows" data-hint="Click each workflow to see the full loop"></div>

<div class="tldr-collapsible" markdown="1">
The part that matters: none of these followed a script. For the drift audit I asked one question — whether the stylesheet and the Figma variables still agreed. The agent decided on its own to enumerate the custom properties, pull the Figma collections, diff them, sort the gaps by whether anything consumed them, and hand back a list I could action. Structure gave it enough context to make those calls.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="drift-audit" data-hint="The actual audit, replayed"></div>

## Results
{: .cs-section-title}

<div class="cs-results">
  <div class="cs-result-card">
    <span class="cs-result-number">412</span>
    <span class="cs-result-label">tokens in three layers, aligned across code and Figma</span>
  </div>
  <div class="cs-result-card">
    <span class="cs-result-number">26</span>
    <span class="cs-result-label">components carrying specs an agent can read unaided</span>
  </div>
  <div class="cs-result-card">
    <span class="cs-result-number">38</span>
    <span class="cs-result-label">drifted tokens found in the first audit — all reconciled</span>
  </div>
  <div class="cs-result-card">
    <span class="cs-result-number">4</span>
    <span class="cs-result-label">autonomous workflows now running on a production system</span>
  </div>
</div>

## What I learned
{: .cs-section-title}

The big one: **quality becomes measurable**. Once every token has a semantic name and every component has a spec, "is our design system healthy" stops being a feeling someone defends in a review and becomes a number an agent reports on a Monday. The audit above wasn't an illustration. It ran, and the system is cleaner for it.
{: .cs-body-text}

The second: **the craft moves upstream**. The risk was never that agent-built screens look bland. It's that an agent assembling from a sloppy system produces sloppy interfaces, faster, and with more confidence. The deliberate choices — a green reserved strictly for money saved, a red that only ever means a date has passed — are what make the assembled output feel designed. The agent is only as good as the vocabulary it assembles from.
{: .cs-body-text}

<div class="tldr-collapsible" markdown="1">
And a quieter one, from years of leading design teams: briefing an agent well is the same skill as briefing a designer well. Clear intent, honest constraints, and the humility to let whoever's executing make calls inside them. The teams taught me that long before the tools did.
{: .cs-body-text}

The design system is no longer just documentation for developers. It's instructions for a machine — and the designer's job is to make those instructions worth following.
{: .cs-closing}
</div>

</div>
