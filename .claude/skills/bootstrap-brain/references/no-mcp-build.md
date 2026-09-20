# Building without the Parker MCP

The runner assumes the MCP is live. Every Phase 1 branch reads through it, and the
foundation one-pagers are *defined* as syntheses of audits that only exist if the ad
account is connected. So "no MCP" is not a degraded version of the same build. It is a
different build, with a different shape, and the honest thing is to say so out loud
before anyone spends hours on it.

The failure this document exists to prevent: a build that runs all the way through,
produces a full-looking vault, and quietly invents the numbers. A brain that says the
hook rate is 28% when nobody ever read the account is worse than no brain, because the
team will act on it. Blocked is a real, acceptable state. Fabricated is not.

## What breaks, by branch

Counts are against factory release v22.

| Branch | Blocked | Why |
| --- | --- | --- |
| 1A brand foundation | 3 of 13 | `ad-account-evaluation`, `performance-targets-and-metrics`, `organic-channels-inventory` are syntheses of the 1E audits. No audits, nothing to synthesize. |
| 1B competitors | 0 | Builds from public sources. The ad-library slice thins to what the public Meta Ad Library shows. |
| 1C persona sources | 5 of 8 | `ad-account`, `ad-comments`, `customer-reviews`, `post-purchase-surveys`, `brand-self-echo-detection` all read Parker's pipes. `reddit`, `brand-reputation` and `other-reviews` survive on public search. |
| 1D voice of customer | 11 of 11 | The whole branch extracts from the corpus 1C was supposed to collect. |
| 1E audit baseline | 17 of 17 | 11 internal cuts need the ad account outright. The 6 external cuts (`*-external`, `single-competitor-ad-analysis`, `monthly-creative-landscape`, `monthly-top-impressions-report`) are partly recoverable from the public ad library. |
| 2 strategy | 0 | Builds on whatever Phase 1 produced. Thinner input, same method. |
| 3 ideation | 0 | Same. |

So roughly 36 prompts are affected, 30 of them hard-blocked. What survives is the
strategy spine, the competitive read, and the whole craft layer. What does not survive
is every claim about how the brand's own advertising is actually performing.

## The three ways to handle it

Ask through the popup form and wait. The runner is explicit that this is a gate, not a
judgment call to make on the user's behalf. Give them all three:

1. **Pause** until the MCP is connected. Nothing half-built in the meantime.
2. **Connect it now** at `app.heyparker.ai/dashboard/parker-brain`, then re-test and build
   properly. Worth flagging that MCP connections are usually environment-level, so it may
   take a fresh session to pick up.
3. **Build without it**, understanding the shape above.

Do not soften option 3 into "it'll be mostly fine." It will not be mostly fine on
performance, and someone should decide that knowingly.

## If they build without it

**Mark blocked prompts blocked in the ledger, with the reason.** Not skipped, not
quietly missing. `/refresh-context` reads the ledger, so a correctly marked blocked
prompt is one that runs automatically the day the MCP arrives. A silently omitted one
never runs again.

**Label every claim.** The factory prompts already carry claim labels — use them, and
lean on `data-limited` far harder than a normal build would. A reader six months from now
needs to tell instantly which lines came from evidence and which came from reasoning
about a category.

**Log the gaps as they appear.** Every blocked pull goes to
`running-notes/missing-context.md` as an open question. That file is the backfill list.

**Let the intake carry more weight than usual.** Normally the intake is the short list of
things Parker cannot observe, sitting on top of real data. Here it is most of what the
brain will know. Say that to the user plainly before you start asking, because it changes
how much effort they should put into answering. The gap question at the end matters most
of all — give them the yardstick (*everything you'd tell an agency you just hired*) and
push them to voice dictate it and be long rather than tidy.

**Substitute public sources where they genuinely reach.** Web search does real work on
category research, competitor positioning, public reviews, Reddit, and the public Meta
Ad Library. It reaches nothing about the brand's own spend, conversion, or creative
performance. Know which side of that line you are on for every claim you write.

## When the MCP arrives later

The backfill path, in order:

1. Connect it and test each surface actually returns data, not just that it responds.
2. Run the 1E audit baseline first. The foundation one-pagers depend on it, so it unblocks
   the most downstream work.
3. Run the blocked 1C pulls, then all of 1D on the real corpus.
4. Re-run the 1A syntheses that were blocked.
5. Re-run `open-loops-roll-up`, then revisit the roadmap. Real performance data usually
   moves it, and a roadmap built blind should not be treated as settled.

`/refresh-context` walks the Phase 1 → 2 → 3 dependency spine and catches docs made stale
by upstream changes, so it handles most of this once the ledger is honest about what was
blocked. Which is the whole reason to mark them properly the first time.
