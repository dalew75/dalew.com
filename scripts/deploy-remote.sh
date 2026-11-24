#!/bin/bash
# Deploy dalew.com on the droplet over SSH, from this machine. Warm-standby slots: a new version is
# built and started next to the live one ("stage"), then nginx is pointed at it in seconds ("promote").
#
#   scripts/deploy-remote.sh stage <target>  build + start <target> in the standby slot (live keeps serving)
#   scripts/deploy-remote.sh peek            tunnel the standby to http://localhost:23920 to look at it
#   scripts/deploy-remote.sh promote [sha]   make the standby live (seconds); the old version stays warm.
#                                            With a sha: only if that's what's staged (auto-stage may have
#                                            staged a newer push; the droplet stages new main commits itself)
#   scripts/deploy-remote.sh rollback        flip back to the warm previous version (seconds)
#   scripts/deploy-remote.sh slots           what each slot runs, which is live, health
#   scripts/deploy-remote.sh latest|<target> stage + promote in one go (only promote if already staged)
#   scripts/deploy-remote.sh status|list|history
#
# <target>: latest, a list number, a sha, or a branch on origin (a feature branch may go live; the next
# deploy must contain it). Flags: --force, --migrations-ok (see droplet lib/slots.sh).
# Also: npm run deploy -- <args>. The server runs ~/apps/droplet/bin/site-deploy dalew <args> after pulling
# the droplet repo. DEPLOY_HOST (default fairyboo.art) picks the server. It deploys what's on GitHub: push first.

set -e

HOST="${DEPLOY_HOST:-fairyboo.art}"
SITE=dalew
PEEK_PORT=23920   # ops/ports.json "dalew-peek"
arg="${1:-list}"

case "$arg" in
  -h|--help) sed -n '2,19p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
  peek)
    slot=$(ssh -o BatchMode=yes "$HOST" "node -pe 'JSON.parse(require(\"fs\").readFileSync(process.env.HOME + \"/apps/.slots/$SITE.json\")).standby'")
    port=3002; [ "$slot" = b ] && port=3005
    echo "Standby slot $slot (:$port on the droplet) -> http://localhost:$PEEK_PORT  (Ctrl-C to close)"
    echo "It runs with the live config."
    exec ssh -o BatchMode=yes -N -L "127.0.0.1:$PEEK_PORT:127.0.0.1:$port" "$HOST" ;;
  list|status|history|slots|promote|rollback) ;;
  *)
    # Staging/deploying: refuse when the branch being deployed has commits the server can't see yet
    cd "$(dirname "$0")/.."
    target="$arg"; [ "$arg" = stage ] && target="${2:-}"
    branch=main
    if [[ ! "$target" =~ ^(latest|[0-9]+|[0-9a-fA-F]{7,40})$ ]] && [ -n "$target" ]; then branch="$target"; fi
    git fetch --quiet origin "$branch" 2>/dev/null || { echo "Branch $branch isn't on origin: push it first." >&2; exit 1; }
    if git rev-parse --verify --quiet "$branch" > /dev/null; then
      unpushed=$(git rev-list --count "origin/$branch..$branch" 2>/dev/null || echo 0)
      if [ "$unpushed" != "0" ]; then
        echo "Local $branch has $unpushed commit(s) not on origin/$branch; the server won't see them." >&2
        echo "Run 'git push origin $branch' first (or deploy anyway with DEPLOY_ALLOW_UNPUSHED=1)." >&2
        [ "${DEPLOY_ALLOW_UNPUSHED:-}" = "1" ] || exit 1
      fi
    fi
    ;;
esac

# Show dates in this machine's timezone (the server runs on UTC)
tz="${TZ:-$(cat /etc/timezone 2>/dev/null || echo UTC)}"
args=""
for a in "$@"; do args="$args $(printf %q "$a")"; done
[ -n "$args" ] || args=" list"
remote_cmd="git -C ~/apps/droplet pull --quiet --ff-only && TZ=$(printf %q "$tz") ~/apps/droplet/bin/site-deploy $SITE$args"
echo "[$HOST] site-deploy $SITE$args"
exec ssh -o BatchMode=yes "$HOST" "bash -lc $(printf %q "$remote_cmd")"
