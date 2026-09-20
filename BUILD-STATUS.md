# Build status

**Brand:** _not yet locked — waiting on brand context from Witayomi_
**Build started:** 2026-09-20
**Current phase:** Phase 0 — setup
**Right now:** Repo is scaffolded and the method library is mounted. Waiting on brand context before the intake.

> **WAITING ON YOU:** the brand this brain is for, and the context you said you'd provide. Nothing past Phase 0 can start without it.

## Data situation — read this first

The Parker MCP is **not connected**. That's the link to the ad account, organic socials, customer
reviews, post-purchase surveys, and the competitor ad library. You chose to build without it.

What that means for this ledger: every prompt whose only source is the ad account or Parker's
review and survey pipes is marked `blocked (no MCP)`. They're not skipped or faked — they sit
unbuilt until the data is wired in, and `/refresh-context` will run them then. Everything that can
be built from public research, the intake, and what you tell me is marked `pending` and will run,
with each claim labeled data-limited.

Roughly: the strategy spine, the competitive read, and the creative method all build. The
performance layer does not.

## Scoreboard

| Phase | Branch | Done | Buildable | Blocked on MCP |
| --- | --- | --- | --- | --- |
| 0 | Setup | 4 of 6 | 6 | 0 |
| 1 | A. Brand foundation | 0 | 10 | 3 |
| 1 | B. Competitors | 0 | 10 per rival + 2 | 0 |
| 1 | C. Persona source pulls | 0 | 3 | 5 |
| 1 | D. Voice of customer | 0 | 0 | 11 |
| 1 | E. Audit baseline | 0 | 0 | 16 |
| 1 | Synthesis + roll-up | 0 | 5 | 4 |
| 2 | Strategy | 0 | 5 | 0 |
| 3 | Ideation | 0 | 4 | 0 |

## Prompt ledger

### Phase 0 — setup

- `done` — Existence check. No prior brain found; cold build.
- `done` — MCP gate. Not connected; user chose to build without it.
- `done` — Scaffold the flat repo layout.
- `done` — Mount the factory method at `parker-system/`, pinned to release `v22`.
- `pending` — Brand intake (blocked on brand context).
- `pending` — Stamp `parker_config.json`, `CLAUDE.md`, `README.md`.

### Phase 1A — brand foundation (independent)

- `pending` — `brand-identity-analysis`
- `pending` — `website-and-product-audit`
- `pending` — `category-and-market-research`
- `pending` — `competitive-landscape`
- `pending` — `customer-journey-and-persona-discovery`
- `pending` — `community-and-forums`
- `pending` — `reputation-analysis`
- `pending` — `visual-vocabulary`
- `pending` — `marketing-calendar-and-campaigns`
- `pending` — `operations-and-team`
- `blocked (no MCP)` — `ad-account-evaluation` — synthesis of the audit baseline, which needs the ad account.
- `blocked (no MCP)` — `performance-targets-and-metrics` — same.
- `blocked (no MCP)` — `organic-channels-inventory` — needs the organic social pulls.

### Phase 1B — competitors (per rival, after the set is named)

- `pending` — `_competitive-set` roster, seeded from the intake.
- `pending` — per rival: `competitor-brand-identity-analysis`, `competitor-website-and-product-audit`, `competitor-customer-and-persona-discovery`, `competitor-reviews-and-customer-language`, `competitor-reputation-analysis`, `competitor-community-and-forums`, `competitor-organic-channels-audit`, `competitor-ad-account-evaluation` (public ad library only), `running-notes-on-competitor`
- `pending` — `competitor-snapshot` per rival ← that rival's slices
- `pending` — `working-thesis-synthesis` ← all snapshots

### Phase 1C — persona source pulls

- `pending` — `reddit`
- `pending` — `brand-reputation`
- `pending` — `other-reviews` (public review sites only)
- `blocked (no MCP)` — `ad-account`
- `blocked (no MCP)` — `ad-comments`
- `blocked (no MCP)` — `customer-reviews`
- `blocked (no MCP)` — `post-purchase-surveys`
- `blocked (no MCP)` — `brand-self-echo-detection` — needs the brand's own ad corpus.

### Phase 1D — voice of customer

- `blocked (no MCP)` — `voc-corpus-profile` and all ten `voc-*` slices (`pain-phrase`, `outcome-phrase`, `objection`, `trigger-moment`, `aspirational`, `metaphor`, `category-jargon`, `anti-language`, `surprise-delight`) plus `voice-of-customer-assembly`. The corpus these extract from comes from 1C's blocked pulls. A thin version can run off public reviews once 1C lands; it will be marked as such.

### Phase 1E — audit baseline (t0)

- `blocked (no MCP)` — all sixteen audit cuts: quarterly (`90-day-creative-strategy-audit`, `90-day-performance-audit`, `90-day-diversity-audit`, `customer-review-audit`, `quarterly-whitespace-analysis`), monthly (`monthly-hook-audit`, `monthly-performance-report`, `monthly-organic-tiktok-audit`, `monthly-tiktok-mining`), `biweekly-iterations-report`, `weekly-performance-snapshot`, and the external cuts (`90-day-creative-strategy-audit-external`, `90-day-performance-audit-external`, `90-day-diversity-audit-external`, `single-competitor-ad-analysis`, `monthly-creative-landscape`, `monthly-top-impressions-report`). Every one reads the ad account.

### Phase 1 — synthesis nodes

- `pending` — `personas-profile` ← branch C (thin, from what C can reach)
- `pending` — `persona-voice-library` ← `personas-profile`
- `pending` — `lifecycle-journey-maps` ← `personas-profile`
- `pending` — `cross-persona-bias-notes` ← `personas-profile`
- `pending` — `brand-profile-narrative` ← all of A
- `pending` — `gaps-opportunities-inspo` ← A + B
- `pending` — `open-loops-roll-up` ← everything above. Last Phase-1 step, bridge into Phase 2.

### Phase 2 — strategy

- `pending` — `persona-strategy-input`
- `pending` — `product-priority`
- `pending` — `messaging-strategy-input`
- `pending` — `creator-talent-strategy-input`
- `pending` — `strategic-roadmap` ← all four
- `pending` — **Gate:** roadmap review. Timing set at intake.

### Phase 3 — ideation

- `pending` — `brand-idea-bank`
- `pending` — `idea-evaluation` ← idea bank + approved roadmap
- `pending` — `sprint-plan` ← the shortlist
- `pending` — `brief-creation` ← the concept map

## Needs attention

1. **Brand context.** Nothing past Phase 0 runs without it.
2. **No Parker MCP.** 32 prompts are blocked on it, including the entire audit and voice-of-customer
   layer. The brain will be strong on strategy and craft, thin on performance truth, until it's wired.
3. **This is a remote container.** It gets reclaimed after inactivity, so the build commits and pushes
   to git at every phase boundary. Nothing lives only on this disk.

## What happens next

You send brand context. I lock the brand, run the intake, then Phase 1 opens and the build goes quiet
until the phase turns over. This file stays current the whole way.
