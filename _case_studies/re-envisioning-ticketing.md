---
cs_key: ticketing
slug: re-envisioning-ticketing
title: "Fifty million people opened the app. Ten million bought a ticket. The brief was the other forty."
description: "Re-architecting a mass ticketing platform from a transaction into a habit — a content tab, a discovery product and an ad server, funded by a template system that halved the design team and cut asset turnaround from a day to two hours."
date: 2021-04-15
tooltip: "The forty million who never\nbought a ticket 🎟️"
---

<!-- VET (numbers): MAU/ticket volumes, team sizes, TAT and dwell figures come straight
     from the April 2021 leadership deck. Company deliberately unnamed — referred to
     throughout as "a mass ticketing platform". Do not reinstate the brand name. -->

<div class="cs-body" markdown="1">

# Fifty million people opened the app. Ten million bought a ticket. The brief was the other forty.
{: .cs-title}

<div class="tldr-collapsible" markdown="1">
For twenty years the company had sold one thing: a seat. A seat at a small-town Christmas gig, a seat at an 80,000-capacity cricket final, a seat in row H for the Friday release. Fifty million people a month opened the app. Ten million of them bought something.
{: .cs-body-text}

Everyone read that gap as a conversion problem, and every fix on the roadmap was pointed at closing it. I spent a month in the session logs before I'd say the other thing out loud: this wasn't leakage to plug, it was an audience nobody had designed for — forty million people showing up every month for something the product didn't sell.
{: .cs-body-text}
</div>

## My role
{: .cs-section-title}

I was Head of Design. With the Head of Product I re-architected the platform from a pure transaction engine into a content and engagement app — the pitch, the navigation model, the three new products, and the operating change underneath that made any of it affordable. Seventy people in the design org reported to me while we did it.
{: .cs-body-text}

## Stack
{: .cs-section-title}

Sketch and Figma, InVision, Google Analytics, CleverTap, Jira, a CDN-side image pipeline, and an unreasonable number of printed storyboards.
{: .cs-body-text}

## Three reasons to stop thinking about the convenience fee
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
Seeing the audience is free; getting a twenty-year-old business to build for it is not. Before a single screen existed I had to argue the gap was worth chasing at all. The revenue line was a booking fee on a ticket — works in our favour while cinemas are the default Friday night, but breaks down once streaming becomes the default *every* night. Three things made the case for me.
{: .cs-body-text}

**Streaming had quietly become the competition.** Not another ticketing app. A phone, a sofa, and no seat to choose.
{: .cs-body-text}

**We were sitting on the country's largest opinion set about films.** More user ratings than the two best-known international review sites put together, on some titles. That number moved box office, and we were using it as a decoration on a listing page.
{: .cs-body-text}

**And the forty million.** We called them non-bookers and dreamers, someone who wants the Friday show and can't justify it this week. We had the stars, the comedians, the sportspeople and the production houses on speed dial. We had every lever needed to keep those people around.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="audience-split" data-hint="Pick a segment — see what it was actually worth"></div>

## The pitch
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
Leadership gave us a quarter to prove the direction before it touched the roadmap. We watched what the forty million already did between bookings, then designed to it: three tabs, three moods. **Home** stays exactly where the muscle memory is — you came to book, book. It gains smarter filters and better discovery, and nothing else moves. **Store** is for when someone wants the merch, not the seat. **Buzz** is for the other twenty-nine days of the month, when nobody is buying anything and everybody is scrolling.
{: .cs-body-text}

The restraint was the design work. Every instinct in the room wanted to make the home tab do the new job too. Leaving it alone is what let us ship the rest without a conversion scare.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="pitch-morph" data-hint="Toggle Before/After — watch the home screen re-shape"></div>

<div class="tldr-collapsible" markdown="1">
Underneath, the business case is a loop rather than a line. Ticketing earns directly. Engagement doesn't earn anything by itself — it earns by making an ad server worth building, and by putting a dreamer within one tap of a booking on a week they can afford it.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="revenue-loop" data-hint="Click a node to trace the money"></div>

## The problem nobody puts in the deck
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
More content means more artwork. A lot more. Seventy people already sat in design: fifteen product designers, and fifty-five graphic designers, illustrators and print designers turning around key art, banners and posters for every show going live.
{: .cs-body-text}

For a media company the obvious answer is to hire. Media companies always hire. I argued the opposite — that a design org this size was a symptom, and that the fifteen product designers were the ones who could fix it.
{: .cs-body-text}

The hard part was never the tooling. It was moving a service culture — organisers ring their account manager, the account manager rings a designer, a designer opens Photoshop — onto a product culture, where we build the thing that does it and everyone uses the thing. I took that argument to marketing, to business, to ground ops and to the supply side one room at a time, using how the big international ticketing platforms run their creative pipelines as the proof it was normal.
{: .cs-body-text}

Every creative request moved onto tickets. No more favours, no more corridor briefs, no more "just this once". Painful for a quarter, transparent forever after.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="team-shape" data-hint="Drag the year — watch the org change shape"></div>

## Templates, and the machine behind them
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
The audit was ugly in the best way: eleven different image sizes in production for a single show, most of them the residue of a layout that no longer existed. We took it to two. One vertical, one horizontal, per show. Everything else — every crop, every density, every placement — got derived on the fly at the CDN rather than drawn by a person.
{: .cs-body-text}

That one decision is what paid for the rest. Turnaround for the full creative set on a new show went from twenty-four hours to two. Not because anyone worked faster, but because most of the work stopped being work — it became a rule, running on request, on a machine that never got bored of resizing.
{: .cs-body-text}

None of it was clever. It didn't need to be clever, it needed to be consistent — which is still the part people get wrong when they hand work to something that isn't a person. I wrote the guidelines as instructions to be *executed*, not read: exact ratios, exact safe areas, what to do when the title is longer than the poster, when to refuse and come back to a human.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="template-pipeline" data-hint="Publish a show the old way, then the new way"></div>

## Buzz
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
An endless feed for the daily dose — celebrity noise, box office numbers, trailers, whatever happened last night. Highlights ride the top in a format everyone's thumbs already knew. Underneath it, three or four content templates the editorial team could fill without a designer in the loop.
{: .cs-body-text}

Time on the tab went from about ten seconds — the old sprinkling of content across the app — to roughly thirteen minutes.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="buzz-feed" data-hint="Scroll it, tap a story, double-tap to like"></div>

## Watch Guide
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
The honest product. If streaming is where the country actually watches things, then be the place that answers *what should I watch, and where is it*. Tell us your languages, your genres and which services you already pay for; we'll stop showing you things you can't watch.
{: .cs-body-text}

New product, so it started small — three or four thousand visitors — and doubled inside four months, peaking around twenty-four thousand. Average session, three to four minutes, which for a recommendation surface is a long time.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="watch-guide" data-hint="Set your preferences — the shelf re-sorts as you go"></div>

## Ad-tech
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
The part that had to be designed carefully or not at all. The rule I wrote and defended: **a loyal booker never sees an ad.** Ever. Someone who books every fortnight is the most valuable person in the building and the least appropriate person to sell attention against.
{: .cs-body-text}

Infrequent users get personalised placements that push them back toward a booking. Dreamers — the forty million — get the broad inventory. Same card design as the rest of the app, so the units carry more context than a standard banner ever does, and the app doesn't suddenly look rented out.
{: .cs-body-text}

It was this platform that kept revenue moving through 2020, when nobody in the country could sit in a cinema.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="ad-rules" data-hint="Switch the audience — the rules change what loads"></div>

<div class="cs-demo" data-demo="ad-tech-shot" data-hint="Three live units, all built from the same card template"></div>

## Results
{: .cs-section-title}

<div class="cs-results">
  <div class="cs-result-card">
    <span class="cs-result-number">13min</span>
    <span class="cs-result-label">on the content tab, up from about ten seconds</span>
  </div>
  <div class="cs-result-card">
    <span class="cs-result-number">2hr</span>
    <span class="cs-result-label">to make a show live, down from twenty-four</span>
  </div>
  <div class="cs-result-card">
    <span class="cs-result-number">11<span class="cs-result-arrow">→</span>2</span>
    <span class="cs-result-label">image sizes in production, per show</span>
  </div>
  <div class="cs-result-card">
    <span class="cs-result-number">300%</span>
    <span class="cs-result-label">productivity across a design org of half the size</span>
  </div>
</div>

<div class="tldr-collapsible" markdown="1">
Fifty designers became twenty. Nobody was let go — the rest were repurposed into ad-tech, Watch Guide and Buzz. Three products shipped in under two quarters on a codebase old enough to have opinions, with every change rolled out on a three-to-six-month adoption cycle because you don't hard-cut an app fifty million people rely on.
{: .cs-body-text}
</div>

## What I learned
{: .cs-section-title}

**Growth arguments are won on the supply side.** The demand story — new tabs, new audience, new revenue — took one meeting. The eighteen months of actual work was convincing a service organisation to become a product organisation, and building the pipeline that made it survivable. Nobody puts that slide in the deck. It's the whole job.
{: .cs-body-text}

<div class="tldr-collapsible" markdown="1">
**A big design team can be a design failure.** Fifty-five people hand-making assets wasn't capacity, it was an unsolved problem wearing a headcount costume. The fix wasn't efficiency, it was deciding which parts of the craft were decisions and which parts were rules — then writing the rules down precisely enough that something other than a designer could follow them.
{: .cs-body-text}

That distinction is the one I've spent every year since refining. The tools got dramatically better at the second half. The first half is still ours.
{: .cs-closing}
</div>

</div>
