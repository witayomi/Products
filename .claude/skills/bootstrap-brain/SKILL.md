---
name: bootstrap-brain
description: Stand up a Parker brand brain in a plain git repo, without the Parker Desktop app, with the Parker MCP optional. Use this whenever someone wants to set up, install, build, or onboard a Parker brain for a brand and the normal path does not apply — no Parker Desktop installed, working in a repo they already own or a cloud/remote session, or the Parker MCP is not connected. Also use it to install the Parker skills into an existing repo, to mount or repair the parker-system method library, to fix a vendored (copied) parker-system that should be a pinned submodule, or to resume a brand-brain build that died partway. Prefer this over set-up-brain when there is no ~/.parker/workspace.json, when git is the sync rather than Parker Desktop, or when the build has to run on public research instead of live account data. Triggers on phrases like "set up a brain for this client", "install parker brain here", "build a brand brain without the MCP", "mount parker-system", or "the brain build stopped halfway".
---

# Bootstrap a brand brain

The factory's own `/set-up-brain` is the front door when the world matches its
assumptions: Parker Desktop created the folder and syncs it, and the Parker MCP is live.
This skill is for when it does not. It handles the same build, but in a plain git repo the
team already owns, with git as the sync, and with the MCP treated as optional.

Everything about *method* still comes from `parker-system/prompts/onboarding-runner.md`.
That file is canonical and this skill does not restate or replace it. What lives here is
only the delta: how to get mounted and scaffolded without the app, how to decide and
communicate what a missing MCP costs, and how to keep hours of work from evaporating.

## Read the situation before doing anything

Three questions, answered by looking rather than asking:

**Is there already a brain here?** A stamped `CLAUDE.md`, real content in
`sub-context-docs/` or `strategy/`, or a `BUILD-STATUS.md` marked complete means this is a
retrieval, not a build. Do not rebuild it. Hand to `/get-started`. A `BUILD-STATUS.md` that
is *not* complete means a build died partway: reconcile the ledger against what is actually
on disk, demote anything marked done whose output is missing, and continue from the first
pending item. Nobody should rebuild finished work.

**Is this the factory clone?** If `prompts/onboarding-runner.md` sits at the repo root,
this is `parker-brain` itself. Brand data never goes here. The bootstrap script refuses,
which is the right behavior — help them get a separate repo for the brand instead.

**Is the MCP connected?** Check the actual tool list rather than assuming. This decides
the shape of everything downstream.

## Run the bootstrap

```bash
bash .claude/skills/bootstrap-brain/scripts/bootstrap.sh
```

It mounts the factory as a submodule pinned to the latest release, copies the executable
layer out of that mount, scaffolds the flat layout, seeds `running-notes/` from the
templates, and verifies that every `parker-system/...` path the skills reference resolves.
It is idempotent and will not overwrite running-notes that already have content, so it is
safe on a half-built repo. `--check` verifies without changing anything; `--tag vN` pins to
a specific release.

Two things it protects you from, both of which are quiet and expensive later:

**The method is mounted, never copied.** Vendoring `parker-system/` as plain files looks
identical and works at first. But there is no pin for `/update-brain` to move, the
session-start hook flags the layout as stale, and build verification fails. If the repo
already has a vendored copy, the script converts it.

**The latest tag needs a numeric sort.** Sorted as text, `v9` beats `v22`, which silently
pins the brain to a year-old method. The script sorts numerically.

Install `.claude/settings.json` and the hooks as the factory ships them. The git guard
looks like a problem here since git is the sync, but it only fires when origin points at
the parker-brain org — a self-managed repo passes through untouched. See
`references/git-persistence.md`.

## The MCP gate

This is a real gate. The runner says not to proceed past it on your own judgment, and it
is right to insist, because the cost is invisible until the build is finished and wrong.

Ask through the popup question form, not in chat. The form is what fires a notification;
a chat question strands the build if they have stepped away. Give three options — pause,
connect it now, or build without it — and wait.

If they build without it, read `references/no-mcp-build.md` before writing the ledger. It
has the branch-by-branch breakdown of what blocks and why, the discipline for labeling
data-limited claims, and the backfill order for when the MCP arrives later.

The one thing worth being blunt about: about 36 prompts are affected and 30 hard-block,
including the entire audit baseline and voice-of-customer layer. The strategy spine and
craft layer survive intact. Every claim about how the brand's own ads actually perform
does not. Say that plainly rather than letting someone discover it at the end.

## Write the ledger

`BUILD-STATUS.md` at the repo root, created during the scaffold, before the intake. The
spec is in the runner's status file section; follow it. What matters most in this variant:

Mark blocked prompts `blocked`, with one line on why. Not skipped, not quietly absent.
`/refresh-context` reads the ledger, so a properly marked blocked prompt runs itself the
day the data arrives. A silently omitted one never runs again.

Keep it true as you go, not in a batch at the end. In a remote or cloud session the
container can be reclaimed mid-build, and the ledger is the only thing a fresh session can
resume from. A ledger written retrospectively cannot do the one job it exists for.

## Run the intake

Follow the runner's brand intake exactly — the clusters, the order, the popup form for
every question including the open ones. Do not open with a meta-question about how much of
it they want to do; that forces a decision before they have answered anything. Lead with
the first card.

One adjustment for the no-MCP case, and it is worth saying to them directly: normally the
intake is the short list of things Parker cannot observe, sitting on top of real data.
Without the MCP it is most of what the brain will know. The ceiling on the build is set
here. Tell them that before you start asking, because it changes how much effort the
answers deserve.

The gap question at the end carries the most weight. Give the yardstick — *everything
you'd tell an agency you just hired, or a new strategist joining the account* — and push
them to voice dictate and be long rather than tidy. "Anything else?" reliably gets one
line back, which is a waste of the most valuable question in the set.

## Build, and commit as you go

The build itself is the runner's, unchanged: Phase 1 in its five parallel branches, then
the synthesis nodes, then `open-loops-roll-up`, then Phase 2, then Phase 3. Delegate
prompts by pointer, never by paraphrase — the fidelity contract in the runner explains why
a summarized prompt silently drops the blocks and claim labels that make output worth
having.

Speak at phase boundaries. Everything between them goes to `BUILD-STATUS.md`, not the
chat. A stream of per-prompt narration teaches nothing because nobody reads it.

Commit and push at every phase boundary. `references/git-persistence.md` has the detail,
including why an unpushed commit in an ephemeral container is worth exactly as much as an
uncommitted file.

## Finish

Stamp `parker_config.json`, `CLAUDE.md` from the brand template, and `README.md`. Note in
`running-notes/standard-sync.md` that the repo is self-managed and git is the sync, so the
next agent does not go looking for Parker Desktop.

Move `BUILD-STATUS.md` into `prompts-run-log/` once the build completes, so the root stays
clean and the ledger survives as the build's record.

Then hand off to `/get-started`. The build is not the deliverable; someone who can use it
is. Lead with one plain sentence on what is actually scheduled and what is not, and if the
MCP is still missing, one sentence on what is thin and what would fix it.

## A note on licensing

Parker Brain is PolyForm Noncommercial 1.0.0. Study, modify and share are fine.
Commercial use — client work, agency deliverables — needs a separate written license from
Real Simple Labs. Worth raising once if this is being stood up for a client brand, then
dropping; it is the team's call to make, not something to keep relitigating.
