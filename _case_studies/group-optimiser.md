---
cs_key: optimiser
slug: group-optimiser
title: "Twelve entities, twelve spreadsheets, one deadline — and the tax they needed was already sitting in the group."
description: "Designing Group Optimiser for TMNZ: a three-step tool that nets a whole group's provisional tax position in one pass — transfers, purchases, sales, and the interest saved — replacing a spreadsheet-per-client ritual run against a hard IRD deadline."
date: 2024-09-13
tooltip: "Netting a whole group's tax\nposition in one pass 🧮"
---

<!-- VET (numbers): the group in the demos is synthetic — same placeholder shape as the
     Figma file (Taxpayer Name / IRD 000000000). Structural claims (three steps, one pass,
     75-day rule, UOMI/penalty savings) are sourced from TMNZ's public material and the
     Tax Administration Act regime. Any adoption or time-saved metric needs your real
     numbers before this goes out — I have deliberately not invented one. -->

<div class="cs-body" markdown="1">

# Twelve entities, twelve spreadsheets, one deadline — and the tax they needed was already sitting in the group.
{: .cs-title}

<div class="tldr-collapsible" markdown="1">
New Zealand runs provisional tax on fixed dates. Miss one, or guess low, and Inland Revenue charges use-of-money interest and late payment penalties from the day you should have paid. Tax pooling is the legislated way out: a pool of tax already deposited with IRD on those dates, from which you can buy a backdated credit that IRD treats as paid on time.
{: .cs-body-text}

Most of the country's accountants use it for one client at a time. The interesting problem is a **group** — a parent and its subsidiaries, filing together, some having overpaid and some having underpaid on exactly the same dates. The money to fix the shortfall is frequently already sitting two rows down the same spreadsheet.
{: .cs-body-text}

Getting it there meant building a spreadsheet per entity, working out by hand who was over and who was under, and then raising each transfer, purchase and sale as a separate transaction. Against a hard deadline. In the busiest fortnight of an accountant's year.
{: .cs-body-text}
</div>

## My role
{: .cs-section-title}

I led design at [TMNZ](https://www.tmnz.co.nz), New Zealand's original tax pooling provider. Group Optimiser was mine end to end: the discovery with tax agents, the flow, the interaction model for the netting table, the terminology, every state and every empty state, and the arguments with myself about how much of this to automate.
{: .cs-body-text}

## Stack
{: .cs-section-title}

Figma with a component library and variables, ClickUp for the brief-in, real accountant sessions for validation, and a design system named after New Zealand plants.
{: .cs-body-text}

## The before
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
Here is the ritual, and I want to be fair about it — it worked. It was just enormously expensive, entirely manual, and wrong in a way nobody could see until the deadline had gone.
{: .cs-body-text}

Every entity in the group needs its position worked out: what IRD says is due on each date, what has actually been paid, what is sitting in the pool. Then someone reconciles those by hand into a group view, decides which surpluses cover which shortfalls, and raises the transactions one at a time. Add an entity and the work doesn't grow by one — it grows by one *against every other entity and every tax date*.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="spreadsheet-pain" data-hint="Add entities — watch what actually grows"></div>

## Three steps, in the order an accountant thinks
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
The whole design came down to sequencing. An accountant does not want a settings screen; they want to be asked the handful of questions that change the maths, see the answer, and then commit it deliberately. So: **preferences**, then **the optimised position**, then **confirm**.
{: .cs-body-text}

The rule I held to across all three: **nothing is created until step three**. Steps one and two are a quote you can run twenty times on a Tuesday and walk away from. That single promise is what let me put a live-recalculating table in front of people handling other people's tax money without anyone getting nervous.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="optimiser-steps" data-hint="Walk the three steps"></div>

## Step one — the four questions that change the maths
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
Every preference on this screen exists because leaving it implicit would produce a technically correct answer that the accountant would then have to unpick. Should tax that's currently listed for sale be pulled back into the group? Should surplus that the optimisation doesn't need be sold? Should tax dates that haven't happened yet be included, when the client may still intend to deposit on them?
{: .cs-body-text}

Each one carries a plain-English consequence and, where there's a defensible default, the word **(Recommended)** — earned, not decorative. A recommendation on a screen about someone else's tax liability is a promise, so each one had to survive a sentence explaining why.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="go-preferences" data-hint="Toggle each one — the consequence is spelled out"></div>

## Step two — the netting table
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
This is the product. Every taxpayer in the group, their position at IRD, what they hold in the pool, and — the part that did not exist before — what the group can do for itself before anybody spends a dollar.
{: .cs-body-text}

Include and exclude entities and the whole position recalculates in front of you: transfers out of the surplus entities, transfers into the short ones, the residual that genuinely has to be bought from the pool, and any excess that can be sold. Underneath it, the number the entire product exists to produce — the interest and penalties this group does not pay.
{: .cs-body-text}

Two interaction decisions did most of the work. The table recalculates **immediately**, with no apply button, because an accountant tests a hypothesis by toggling — and an apply button turns eight hypotheses into eight round trips. And every derived figure carries its own explanation on hover, because "why is that number that number" is the only question that matters here, and a support call is a design failure.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="net-position" data-hint="Include and exclude taxpayers — everything below recalculates"></div>

## The awkward cases, drawn
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
Financial tools are judged on their edges, and this one had three that mattered. A taxpayer past the IRD deadline for pooling that year, who cannot legally be included no matter what the table would prefer. Tax dates in the future, which may or may not belong in the calculation depending on whether the client plans to deposit on them. And entities the accountant simply has not finished — not started, or half-filled — sitting in a group that is otherwise ready to go.
{: .cs-body-text}

None of these are errors. All three were being handled as errors, in red, at the point of failure. I moved every one of them upstream into a stated exclusion with a reason and a way back, because an accountant discovering at step three that four entities silently dropped out is an accountant who never trusts the tool again.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="exclusions" data-hint="Trip each edge case — see where it surfaces"></div>

## Step three — how you'd like to pay for it
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
The residual purchase still has to be paid for, and there are genuinely different products behind that: pay it down flexibly as cash allows, fix a fee up front and settle at a future date, or build an instalment arrangement. Three real choices, each with a different interest profile, presented as a comparison rather than a dropdown — because this is the one decision on the screen that is about the client's cash flow rather than their tax position.
{: .cs-body-text}

Then the AML confirmation, which is a legal requirement and reads like one. I fought to keep it in plain language and short, and lost about a third of that fight, which is roughly par for a compliance checkbox.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="payment-plans" data-hint="Compare the three — the cost profile moves"></div>

## Where it lands afterwards
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
Group Optimiser doesn't live alone. The dashboard has an Upcoming Deadlines tab where an agent tracks which clients are approaching which dates, and every entity carries a status: not started, incomplete, complete, pending approval, pending payment.
{: .cs-body-text}

Running the optimiser is, by definition, doing the thing those statuses are tracking — so one of the step-one preferences quietly closes the loop and marks the optimised taxpayers complete. It's the smallest feature in the project and the one agents mentioned most, because it removes the bit of admin that exists purely because two screens didn't talk to each other.
{: .cs-body-text}

Which is the version of automation I actually believe in: not a machine making the tax decision, but a machine refusing to make a human retype what it already knows.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="deadline-board" data-hint="Run the optimiser — watch the statuses close themselves"></div>

## And the paperwork
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
Accountants do not finish at the screen. They finish when the client, the file and sometimes the bank all have the same document. So the same optimised position exports as a report designed to be read on paper: a group page, a page per taxpayer, footed with who generated it and when, and a payment page with the banking details on it.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="report-export" data-hint="Page through the generated report"></div>

## Results
{: .cs-section-title}

<div class="cs-results">
  <div class="cs-result-card">
    <span class="cs-result-number">3</span>
    <span class="cs-result-label">steps, replacing a spreadsheet per entity</span>
  </div>
  <div class="cs-result-card">
    <span class="cs-result-number">1</span>
    <span class="cs-result-label">pass to net a whole group and raise every transaction</span>
  </div>
  <div class="cs-result-card">
    <span class="cs-result-number">100%</span>
    <span class="cs-result-label">of late payment penalties avoided on a position settled in time</span>
  </div>
  <div class="cs-result-card">
    <span class="cs-result-number">0</span>
    <span class="cs-result-label">transactions created before you press confirm</span>
  </div>
</div>

## What I learned
{: .cs-section-title}

**In financial products the edge cases *are* the product.** The happy path took a fortnight. Past-deadline taxpayers, future dates, half-finished entities, groups where the optimisation nets to exactly zero, groups with nothing to buy at all — that took months, and it is the entire difference between a tool an accountant trusts in June and one they open once.
{: .cs-body-text}

<div class="tldr-collapsible" markdown="1">
**Recalculation is a trust mechanic, not a performance one.** The reason the table updates instantly isn't speed. It's that watching a number move in response to your own decision is how a person builds a model of what the system is doing — and a model is the thing that lets them sign off on it.
{: .cs-body-text}

**And say what you excluded, before you exclude it.** Every quiet, sensible, correct omission a system makes on someone's behalf is a small withdrawal from the same account. Spend it once and you have a support ticket. Spend it twice and they go back to the spreadsheet, where at least the mistakes are theirs.
{: .cs-closing}
</div>

</div>
