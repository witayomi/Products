# Phase 5 and 6: launch, scale and sunset

Agents 5 and 6.

---

## 5.1 Launch structure

**Test budget: $2,100 over 14 days. Do not exceed it before reading the gate.**

| Campaign | Objective | Budget | Creative | Audience |
|---|---|---|---|---|
| C1 Direct offer | Purchase | $60/day | 3 variants of the direct script (file 04, 4.2) | Broad, US, women 29-45, job-title and employer behaviours in construction, engineering, industrial, enterprise tech |
| C2 Workhorse | Purchase | $60/day | W1 and W2 | Same |
| C3 Moment targeting | Purchase | $30/day | N1, N2, N5 | Same, flighted to Q4 comp calendars |

CBO off for the test. ABO gives you clean per-angle CAC, which is the only number that matters in the first fortnight.

**Read nothing before day 5.** At $150/day you have roughly 95 clicks a day and 0.6 purchases. Statistical noise until day 5 minimum.

---

## 5.2 Scaling rules

| Condition | Action |
|---|---|
| 3-day rolling cash ratio at or above 2.0x | Vertical scale, +20% budget every 48 hours |
| Frequency above 3.0, or CAC up more than 25% | Horizontal scale. Deploy niche angles N1 to N15 to fresh sub-segments |
| CTR below 1.5%, or CPC up 30% | Creative rotation. Pull the losing angle, replace from the niche bank |
| 4 consecutive sales with conversion holding | Price step, per the ladder in file 03 section 3.5 |
| CAC above $285 | This is a pricing decision, not a creative decision. Step the price before you touch the ads |

That last row is the one most people get wrong. When CAC rises on an offer with only 7% of headroom, rewriting the hook buys you a week. Raising the price fixes the ratio the same day, and this ICP is not price-sensitive at $697.

---

## 5.3 Sunset triggers

```
IF 7-day cash ratio < 1.0x (CAC above $606):
    TRIGGER -> Level 1: creative refresh, deploy next 5 niche angles

IF refresh fails to restore ratio >= 1.5x within 14 days:
    TRIGGER -> Level 2: sunset protocol
```

**One override.** If the ratio breaks because refunds crossed 15% rather than because CAC rose, do not refresh creative. Refresh the audience. A refund spike on this offer means the ads pulled the grievance cohort rather than the buyer with a comp cycle in six weeks. Rewriting the hook makes that worse. Changing who sees it fixes it.

---

## 5.4 Sunset execution

1. Pause all campaigns via API.
2. Export: conversion telemetry, winning hooks by angle, full objection log from support tickets, refund reasons verbatim, audit-completion data.
3. Tag reusable assets. The Ask Tax Audit calculator and the band data pack survive the sunset of this offer and carry into the B2B route in file 00.
4. Redirect the funnel to a waitlist. Do not 404 a page with backlinks and pixel history.
5. Hand the objection log back to Agent 1 as input, not as a post-mortem. The reasons people refunded are the reasons the next offer exists.

---

## 5.5 What to actually watch

| Metric | Cadence | Why |
|---|---|---|
| CAC by angle | Daily from day 5 | The only scaling input |
| Audit completion rate | Daily | Leading indicator of refunds, 3 weeks ahead of them |
| Refund rate, rolling 30 | Weekly | Kills the offer faster than CAC does |
| Objection verbatim | Continuous | Becomes next quarter's niche angles |
| Outcome reports from buyers | Monthly | The asset that unlocks the B2B route. Ask every buyer at day 90: did you ask, what happened, what changed |

That last one is not a testimonial exercise. 40 to 60 documented outcomes with dollar figures attached is the entire sales asset for the $12,000 employer-paid version, and it is worth more than the front-end revenue.
