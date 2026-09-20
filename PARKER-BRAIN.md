# Parker Brain skills (installed)

The 21 Parker skills from [real-simple-labs/parker-brain](https://github.com/real-simple-labs/parker-brain)
are installed in this repo, along with the method library they read from.

Upstream commit: `9e65a4e` (2026-09-16).

## What landed where

| Path | What it is |
| --- | --- |
| `.claude/skills/` | The 21 skills. Claude Code loads these automatically when you open this repo. |
| `.claude/agents/` | `context-grounding-review` and `creative-voice-review` — the two review subagents `scriptwriting` spawns as quality gates. |
| `.claude/output-styles/parker.md` | The Parker voice layer. Not switched on (see below). |
| `scripts/` | Helper scripts the skills call: `voice-lint.py`, `grounding-check.py`, `build-doc-map.py`, and the rest. |
| `parker-system/` | The read-only method library: `creative-strategy-context/`, `system/`, `prompts/`, `templates/`. Skills reference these by `parker-system/...` paths, so the directory name matters — don't rename it. |

Upstream ships `parker-system/` as a git submodule pinned to a release tag. It's vendored
as plain files here instead, so there's no submodule to init and nothing extra to clone.
The trade-off: pulling upstream updates is a manual re-copy rather than a tag bump.

## The skills

**Craft** — `scriptwriting`, `hooks`, `headlines`, `iterations`, `ai-ad-generation`, `ad-account-analysis`

**Ideation** — `harvest-ideas`, `evaluate-ideas`, `dream`, `brand-idea-bank-maintenance`

**Open loops** — `open-loops-advance`, `open-loops-validate`

**System and maintenance** — `set-up-brain`, `setup-routines`, `refresh-context`, `self-improve`,
`self-improvement-intake`, `improve-system`, `propagate-craft`, `expert-signal-intake`, `update-parker-skill`

## Two things deliberately left out

**The usage-logging hooks.** Upstream's `.claude/settings.json` wires `scripts/usage-log.py` into
SessionStart, Stop, SubagentStop, and SessionEnd. Telemetry on every session is a real choice, not a
default, so it isn't installed. To turn it on, copy the `hooks` block from
`https://github.com/real-simple-labs/parker-brain/blob/main/.claude/settings.json`.

**The Parker output style.** Upstream sets `"outputStyle": "Parker"`, which injects the Parker voice
into the system prompt for every session in the repo. The file is here but not activated, because it
would override how Claude talks to you across all work in this repo, not just Parker tasks. Run
`/output-style Parker` to switch it on for a session, or add `"outputStyle": "Parker"` to
`.claude/settings.json` to make it permanent.

## What the skills expect that isn't here yet

These skills are built to run inside a **brand brain** — a folder holding one brand's strategy, personas,
voice-of-customer data, competitors, and idea bank. That brand layer doesn't exist in this repo. Skills
reference `strategy/`, `idea-bank/`, `self-improvement/`, and `global/` at the repo root and will say so
when they're missing.

Two ways forward:

1. Run `/set-up-brain` and let it build the brand layer here.
2. Use the craft skills as-is. They degrade gracefully — you get the method and the format discipline,
   just without brand-specific grounding.

Several skills also expect the **Parker MCP** for live ad account, organic social, review, and competitor
ad library data. Without it they work from what you give them in the conversation.

## License

Parker Brain is under the [PolyForm Noncommercial License 1.0.0](parker-system/LICENSE.md).
Noncommercial use only — study, modify, and share it freely, but client work, agency deliverables,
or anything else commercial needs a separate written license from Real Simple Labs.
