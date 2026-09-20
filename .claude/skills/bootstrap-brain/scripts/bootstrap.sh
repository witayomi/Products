#!/usr/bin/env bash
# Stand up a Parker brand brain in a plain git repo.
#
# Mounts the public factory as a pinned submodule at the latest release, copies
# the executable layer out of that mount, and scaffolds the flat brand layout.
# Idempotent: safe to re-run on a half-built repo, and it never overwrites a
# running-notes file that already has content in it.
#
#   bash .claude/skills/bootstrap-brain/scripts/bootstrap.sh [--tag vN] [--check]
#
#   --tag vN   pin to a specific release instead of the latest
#   --check    verify an existing setup and change nothing

set -euo pipefail

FACTORY="https://github.com/real-simple-labs/parker-brain"
MOUNT="parker-system"
PIN=""
CHECK_ONLY=0

while [ $# -gt 0 ]; do
  case "$1" in
    --tag)   PIN="$2"; shift 2 ;;
    --check) CHECK_ONLY=1; shift ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

die() { echo "ERROR: $*" >&2; exit 1; }
note() { echo "  $*"; }

# `git submodule status <dir>` exits 0 for a plain tracked directory too, so its
# exit code cannot tell a real submodule from a vendored copy -- which is exactly
# the case this script exists to fix. Test for non-empty output instead.
is_submodule() { [ -n "$(git submodule status "$1" 2>/dev/null)" ]; }

# --- Guards -----------------------------------------------------------------
# The runner is firm that a brand's data never lands in the factory clone, and
# that the method is mounted rather than copied. Both mistakes are quiet and
# expensive later, so check for them before touching anything.

git rev-parse --show-toplevel >/dev/null 2>&1 || die "not a git repo. Run 'git init' first, or cd into the brand's repo."
ROOT="$(git rev-parse --show-toplevel)"
cd "$ROOT"

if [ -f "prompts/onboarding-runner.md" ] && [ -d "creative-strategy-context" ]; then
  die "this looks like the parker-brain factory clone. A brand brain needs its own repo -- the factory is read-only method, never a place to build a brand."
fi

# --- Resolve the release ----------------------------------------------------

if [ -z "$PIN" ]; then
  echo "Finding the latest factory release..."
  # Sort numerically. Lexical sort puts v9 above v22, which silently pins the
  # brain to a year-old method.
  PIN="v$(git ls-remote --tags "$FACTORY" 2>/dev/null \
        | sed -E 's|.*refs/tags/v||' \
        | grep -E '^[0-9]+$' \
        | sort -n | tail -1)"
  [ "$PIN" = "v" ] && die "could not reach $FACTORY to list releases. Check network access."
fi
note "release: $PIN"

# --- Check mode -------------------------------------------------------------

if [ "$CHECK_ONLY" -eq 1 ]; then
  echo
  echo "Checking the setup..."
  FAIL=0
  if is_submodule "$MOUNT"; then
    AT="$(git -C "$MOUNT" describe --tags 2>/dev/null || echo 'no tag')"
    note "mount: submodule at $AT"
    [ "$AT" = "$PIN" ] || { note "  -> behind latest ($PIN). Run /update-brain to move the pin."; }
  elif [ -d "$MOUNT" ]; then
    note "mount: FAIL -- $MOUNT exists but is not a submodule (vendored copy)."
    note "  A copy has no pin for /update-brain to move and fails build verification."
    note "  Re-run this script without --check to convert it."
    FAIL=1
  else
    note "mount: FAIL -- no $MOUNT at all."; FAIL=1
  fi
  MISSING=0
  while read -r p; do
    [ -e "$p" ] || { note "unresolved reference: $p"; MISSING=$((MISSING+1)); }
  done < <(grep -rhoE 'parker-system/[A-Za-z0-9_./-]+\.(md|py|sh)' .claude/skills 2>/dev/null | sort -u)
  [ "$MISSING" -eq 0 ] && note "skill path references: all resolve" || { note "skill path references: $MISSING broken"; FAIL=1; }
  echo
  [ "$FAIL" -eq 0 ] && echo "Setup looks good." || { echo "Setup has problems (above)."; exit 1; }
  exit 0
fi

# --- Mount the method -------------------------------------------------------

echo
echo "Mounting the method library..."

if is_submodule "$MOUNT"; then
  note "already a submodule -- moving the pin to $PIN"
  git -C "$MOUNT" fetch -q --tags
  git -C "$MOUNT" checkout -q "$PIN"
else
  if [ -d "$MOUNT" ]; then
    # A vendored copy. The runner is explicit that this fails build
    # verification and leaves nothing for /update-brain to move, so replace it.
    note "found a vendored copy -- replacing it with a real submodule"
    git rm -r -q --cached "$MOUNT" 2>/dev/null || true
    rm -rf "$MOUNT"
  fi
  git submodule add -q "$FACTORY" "$MOUNT"
  git -C "$MOUNT" fetch -q --tags
  git -C "$MOUNT" checkout -q "$PIN"
fi
note "mounted at $(git -C "$MOUNT" describe --tags)"

# --- Ship the executable layer ---------------------------------------------
# Everything here is copied OUT OF THE MOUNT, never out of a clone of main, so
# the skills and the method are always the same release.

echo
echo "Shipping the executable layer..."

mkdir -p .claude
# Preserve any skill the team wrote themselves; refresh the ones the factory owns.
cp -R "$MOUNT/.claude/skills/." .claude/skills/
cp -R "$MOUNT/templates/brand-routines/claude/skills/." .claude/skills/
cp -R "$MOUNT/.claude/agents" .claude/agents 2>/dev/null || true
cp -R "$MOUNT/.claude/output-styles" .claude/output-styles 2>/dev/null || true
cp -R "$MOUNT/templates/brand-routines/claude/hooks" .claude/hooks
rm -rf scripts && cp -R "$MOUNT/scripts" scripts

# settings.json carries the deny rules that keep the mount read-only, the craft
# context hook, and the git guard. The guard only fires when origin points at
# the parker-brain org, so a self-managed repo like this one is unaffected.
[ -f .claude/settings.json ] || cp "$MOUNT/templates/brand-routines/claude/settings.json" .claude/settings.json
note "skills: $(find .claude/skills -maxdepth 1 -mindepth 1 -type d | wc -l | tr -d ' ')"

# --- Scaffold the flat layout ----------------------------------------------

echo
echo "Scaffolding the brand layout..."

mkdir -p sub-context-docs source-pulls personas/voice-of-customer personas/sources \
         competitors audits strategy idea-bank briefs \
         open-loops hypotheses validations re-validations \
         expert-insights/inbox expert-insights/curation expert-insights/context-update-candidates \
         running-notes schedules dreaming workflows prompts-run-log

for d in open-loops hypotheses validations re-validations dreaming workflows; do
  [ -f "$d/README.md" ] || printf '# %s\n\nSeeded at build time. Populated by the routine that owns this layer.\n' "$d" > "$d/README.md"
done

cp -R "$MOUNT/templates/brand-routines/schedules/." schedules/

# Seed from the factory templates, but never clobber real content -- a re-run on
# a half-built brain must not wipe intake answers already captured.
seed() {
  local tpl="$MOUNT/templates/$1" dst="$2"
  [ -f "$tpl" ] || return 0
  if [ -s "$dst" ] && [ "$(wc -c <"$dst")" -ne "$(wc -c <"$tpl")" ]; then
    note "kept existing $dst"
  else
    cp "$tpl" "$dst"
  fi
}
seed brand-rules-template.md          running-notes/brand-rules.md
seed success-definition-template.md   running-notes/success-definition.md
seed missing-context-template.md      running-notes/missing-context.md
seed brand-notes-from-org-template.md running-notes/brand-notes-from-org.md
seed refresh-schedule-template.md     running-notes/refresh-schedule.md
seed standard-sync-template.md        running-notes/standard-sync.md
seed brand-lens-template.md           brand-lens.md

# --- Verify -----------------------------------------------------------------

echo
echo "Verifying..."
MISSING=0
while read -r p; do
  [ -e "$p" ] || { note "BROKEN: $p"; MISSING=$((MISSING+1)); }
done < <(grep -rhoE 'parker-system/[A-Za-z0-9_./-]+\.(md|py|sh)' .claude/skills 2>/dev/null | sort -u)

if [ "$MISSING" -gt 0 ]; then
  die "$MISSING skill path reference(s) do not resolve. The mount is wrong or incomplete."
fi
note "every parker-system reference resolves"

cat <<EOF

Done. The brain is scaffolded and the method is pinned at $PIN.

Still to do, and these are the conversational half -- go back to SKILL.md:
  - the MCP gate (do not assume; ask)
  - BUILD-STATUS.md with the prompt ledger
  - the brand intake
  - parker_config.json, CLAUDE.md and README.md at the stamp step
EOF
