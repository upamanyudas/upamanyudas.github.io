---
cs_key: reviews
slug: ten-second-reviews
title: "Eight people in a hundred wrote a review. The other ninety-two weren't lazy — the form was."
description: "Rebuilding ratings and reviews on a mass ticketing platform: a rating construct that finally matched its own scale, a three-step form that took nine seconds, and a trust model that made the number worth quoting. Time on task 60s → 10s, reviews up 24%."
date: 2020-11-24
tooltip: "A rating people could give\nin nine seconds ❤️"
---

<!-- VET (numbers): 60s→10s time-on-task, 24% review growth, 8-in-100 write rate,
     62 + 1,400 survey respondents, 300+ reviews analysed, 88% cinema-experience
     figure — all from the November 2020 study. Platform deliberately unnamed;
     partner marketplace unnamed too. Do not reinstate either brand. -->

<div class="cs-body" markdown="1">

# Eight people in a hundred wrote a review. The other ninety-two weren't lazy — the form was.
{: .cs-title}

<div class="tldr-collapsible" markdown="1">
A film releasing on a Friday has about three weeks to make its money. Inside that window a rating is not a nice-to-have — it is the single most public signal about whether a stranger should spend an evening and a thousand rupees on it. Our ratings moved box office. Distributors watched them. And on some titles we held more of them than the two best-known international review sites put together.
{: .cs-body-text}

We were collecting all of that through a form that asked for a hundred and forty characters before it would let anyone leave.
{: .cs-body-text}
</div>

## My role
{: .cs-section-title}

I ran design on this end to end — the research plan, the rating construct, the trade-offs I took to the branding and business teams, and the last pixel of the form. Twenty million tickets a month were being booked around it, so nothing shipped without a defensible reason.
{: .cs-body-text}

## Stack
{: .cs-section-title}

Figma, Google Analytics, CleverTap, two rounds of survey research, a lot of phone calls, and Jira for the user stories.
{: .cs-body-text}

## Houston, we have four problems
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
**The icon had escaped.** At one point there were more than ten variations of the heart-and-star mark in production, depending on which surface you were standing on and which year it had been built.
{: .cs-body-text}

**The contribution went nowhere.** Someone had borrowed the hundred-and-forty-character minimum from social media and made it a gate. So people padded — repeated words, unrelated text, a wall of emoji — just to get past it. And the people who genuinely wrote something thoughtful watched it disappear down the page with nothing acknowledging it existed.
{: .cs-body-text}

**Nowhere to say it.** You could rate from the film's detail page, or from a modal on the homepage. That was the entire surface area. Come out of a cinema, open the app, and there was nothing asking you the one question you were most qualified to answer at that exact moment.
{: .cs-body-text}

**And nobody had to have been there.** Anyone could rate anything. Which meant a reader had no way of telling a person who sat through it from a person with an agenda — and there were plenty of the second kind.
{: .cs-body-text}
</div>

## The rating scale was lying about itself
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
The first finding came out of analytics, not interviews, and it was the one that reframed the project. The scale ran zero to a hundred percent in ten-point steps. The interface showed five hearts. Which means half the values on the scale needed half a heart — and the control gave you no way to express that, no affordance suggesting it was possible, and no feedback when you missed.
{: .cs-body-text}

The distribution confirmed it in the least ambiguous way I have ever seen data confirm anything. Whole hearts spiked. The halves sat in the trough between them. People were not rating films more generously at eighty than at seventy — they were rating what the control could physically hit.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="rating-bias" data-hint="Toggle the control — watch where the votes pile up"></div>

## Research is like a box of chocolates
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
Then the qualitative half. One study with sixty-two users — survey plus phone calls, because the phone calls are where people say the true thing. A second with over fourteen hundred, drawn from our existing personas.
{: .cs-body-text}

What makes people write? Sixty percent write when a film is either wonderful or terrible; eighteen percent write because they simply like writing; fourteen percent write to help someone else out. And why don't they? It takes too long, and they don't know what to say. Writer's block, in a text field, about a film they finished forty minutes ago.
{: .cs-body-text}

One line from a respondent did more to shape the final design than any workshop:
{: .cs-body-text}

> I've never written a movie review in my life — I'm not sure what to write, and even if I do, I don't really know if anyone's gonna get value from it.
{: .cs-quote-block}

Then we read three hundred-odd reviews properly. The discovery hiding in there was linguistic: Indian cinema-goers reach for the same short, loaded words over and over. *Jhakaas. Blockbuster. Must watch. Paisa vasool.* People weren't short of an opinion. They were short of a sentence. We already had the vocabulary — thousands of people had written it for us — we had just never handed it back.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="tag-mine" data-hint="Run the reviews through — the tags are theirs, not ours"></div>

## What everyone else was doing
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
We pulled apart the end-to-end rating flows of the apps our personas already had on their home screens, looking for patterns worth stealing and dead ends worth avoiding. Nearly everyone lands on five points. One long-standing film database runs ten. Delivery apps show you the distribution as a graph. A ride-hailing app hands out compliments instead of asking for prose. And a social app had proved that a slider, of all things, is something people will drag for fun.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="benchmark" data-hint="Compare the constructs side by side"></div>

## Adding more love to the heart
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
Branding had already settled the heart. Stars are the industry convention and I raised that as a usability concern, in writing, more than once — a heart carries an emotional read that a star does not, and people had learned stars for twenty years. That argument I lost, and losing it cleanly was the right call: the heart was by then a genuinely recognised mark in Indian entertainment, and throwing away that recognition to win a consistency point would have been vanity.
{: .cs-body-text}

So the question became: what construct makes a ten-point scale honest, using a heart?
{: .cs-body-text}

**Existing** — five hearts, half-heart increments, no affordance for the halves. **Take one** — ten hearts, which tests badly for exactly the reason Hick predicts: ten targets is a decision, five is a reflex. **Take two** — a plain range slider, playful and quick, but in testing people didn't know it could be dragged. **Final** — a ten-point slider with a real handle, snap points you can feel, and haptic feedback on each step. It won every round, and it won on speed.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="rating-takes" data-hint="All four are live — drag them and feel the difference"></div>

## Build once, use anywhere
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
The form became three questions in progressive disclosure, in strict order of how much they cost the person answering. Rate it — one drag. Describe it in tags — optional, and pre-filled with their own vocabulary. Write something — optional, and by this point genuinely optional, because we already have a usable review without it.
{: .cs-body-text}

Time on task for a tag-only review came in as low as **nine seconds**. And because it was built as one modular component, it dropped into every surface we could find: the detail page, the homepage nudge, a push notification three and a half hours after a showtime, the post-booking screen.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="review-form" data-hint="Leave a review — the stopwatch is real"></div>

<div class="tldr-collapsible" markdown="1">
One trade-off I still think about. Eighty-eight percent of people folded the *cinema* into their rating of the *film* — the seat, the sound, the queue, the air conditioning. We designed a version that separated the two, and then cut it from launch, because a question you can't act on is a question you shouldn't ask. Splitting the score meant deciding what we'd do with a bad cinema, and who at that cinema we'd tell. That is a business loop, not a design detail, and it wasn't built yet.
{: .cs-body-text}
</div>

## Doing the PM stuff
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
New touchpoints meant new rules about when it is acceptable to interrupt someone. We wrote them as user stories with our agile coach — given, when, then — which forced the awkward specifics into the open. Three and a half hours after showtime, not during. Within thirty days, not forever. Once.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="nudge-story" data-hint="Set the conditions — see whether it fires"></div>

## Making the number worth quoting
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
Trust turned out to be four words. **Booked on the app**, sitting under a review, next to a rating. That is the whole intervention on the surface — and underneath it, the aggregate started weighting verified ticket-holders more heavily, so the headline percentage came to mean something closer to what a reader assumed it meant.
{: .cs-body-text}

The fraud side got the unglamorous treatment: the backend learned the shapes that organised rating campaigns make — the burst, the identical phrasing, the account that only ever rates one distributor's films — and started flagging them for a human instead of waiting for someone to notice on social media.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="trust-weight" data-hint="Turn the weighting on — watch the headline number move"></div>

## Reading a hundred reviews in ten seconds
{: .cs-section-title}

<div class="tldr-collapsible" markdown="1">
People don't read, so the detail page stopped asking them to. Top five tags and top five reviews, in the position a shopper's mental model already expects them — down the page, after the thing itself. The tags are the summary; the reviews are the evidence for anyone who wants it. In testing people skimmed the whole sentiment of a film in ten to twenty seconds.
{: .cs-body-text}
</div>

<div class="cs-demo" data-demo="review-summary" data-hint="Tap a tag to read only those reviews"></div>

## Results
{: .cs-section-title}

<div class="cs-results">
  <div class="cs-result-card">
    <span class="cs-result-number">10s</span>
    <span class="cs-result-label">time on task, down from sixty</span>
  </div>
  <div class="cs-result-card">
    <span class="cs-result-number">24%</span>
    <span class="cs-result-label">growth in reviews submitted</span>
  </div>
  <div class="cs-result-card">
    <span class="cs-result-number">9s</span>
    <span class="cs-result-label">fastest complete tag review recorded in testing</span>
  </div>
  <div class="cs-result-card">
    <span class="cs-result-number">1</span>
    <span class="cs-result-label">component, reused on every surface that asks</span>
  </div>
</div>

<div class="tldr-collapsible" markdown="1">
One of the world's largest marketplaces went on to list films with us, and our ratings were part of that handshake — which is a decent external audit of whether a number is trustworthy. Mentions and shares across social media went up alongside it, mostly because a tag is a shareable thing and a paragraph is not.
{: .cs-body-text}
</div>

## What I learned
{: .cs-section-title}

**People don't type.** They will absolutely tell you what they think — they just won't compose it. Give them their own words back and the contribution rate stops being a motivation problem and starts being an input problem, which is the kind design can actually solve.
{: .cs-body-text}

<div class="tldr-collapsible" markdown="1">
**People don't read either.** Every screen after this one I've designed on the assumption that someone will spend ten seconds and take away exactly one thing. Decide what that thing is before you open the file.
{: .cs-body-text}

**And check what the control can physically express.** A scale with ten values and a control with five targets is not a rounding error, it is a data quality incident that ran for years and moved box office. Nobody found it in a review. We found it because somebody plotted the distribution and asked why it looked like a comb.
{: .cs-closing}
</div>

</div>
