# Persistence without Parker Desktop

A managed brain is synced by the Parker Desktop app. The app watches the folder, saves
every write, and handles clashes between teammates. That is why the runner tells the
agent never to touch git: two sync engines fighting over one folder corrupts both.

Without the app, that reasoning inverts. There is no second sync engine. Git is the only
thing standing between hours of build work and an empty disk, so the rule becomes the
opposite: commit and push at every phase boundary.

## The guard already knows

`.claude/hooks/git-guard.py` blocks git in a brain, but it only fires when the repo's
origin points at the parker-brain org, on GitHub or Parker's gateway. A repo on the
team's own remote is the documented self-managed exception and passes through untouched.

So install `settings.json` and the hooks exactly as the factory ships them. Do not strip
the guard. It is correct as written, it self-disables where it should, and stripping it
means a brain that later migrates to Parker Desktop loses a protection nobody remembers
to restore.

Record the arrangement in `running-notes/standard-sync.md`: the repo is self-managed, git
is the sync, and the Parker Desktop guidance elsewhere in the runner does not apply here.
The next agent to open this brain reads that file and needs to know.

## When to commit

Commit and push at each of these, because each is a point where losing the work would
cost real time:

- End of Phase 0, once the mount and scaffold are in.
- Every Phase 1 branch that completes.
- Each Phase 1 synthesis node.
- The roadmap, before the review gate.
- Each Phase 3 artifact.
- The stamp step at the end.

Between those, writes land on disk and that is enough. Committing after every prompt
turns the history into noise and slows the build for no gain.

Message shape that stays readable later:

```
Phase 1A: brand foundation slices

10 of 13 built. ad-account-evaluation, performance-targets-and-metrics
and organic-channels-inventory blocked on the missing audit baseline.
```

## Ephemeral containers

In Claude Code on the web the container is reclaimed after inactivity. A multi-hour build
will not survive it, and an uncommitted one leaves nothing to resume from.

Two things follow. Push at every boundary rather than batching to the end — an unpushed
commit dies with the container just like an uncommitted file. And keep `BUILD-STATUS.md`
accurate as you go, since after a container is reclaimed the ledger is the only record of
where the build got to. A fresh session reads it, reconciles each `done` against what is
actually on disk, demotes anything missing back to `pending`, and continues from the first
pending item.

That reconciliation only works if the ledger was honest while the build was running. A
ledger updated in a batch at the end is worthless for resuming, which is the one job it
exists to do.

## What this does not replace

Parker Desktop also handles teammate access and clash merging. Git gives the team neither
for free — they need repo access and they need to know how to handle a merge conflict, or
one person owns the repo and the rest read it.

Worth saying to the user once, plainly, rather than letting them discover it when a second
person tries to open the brain.
