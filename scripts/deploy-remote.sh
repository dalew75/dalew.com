#!/bin/bash
# Deploy dalew.com on the droplet over SSH, from this machine.
#
#   scripts/deploy-remote.sh status   deployed commit vs newest origin/main
#   scripts/deploy-remote.sh history  deploy log: when, which commit, latest/rollback
#   scripts/deploy-remote.sh list     numbered recent commits (0 = newest)   [default]
#   scripts/deploy-remote.sh latest   deploy the newest commit on origin/main
#   scripts/deploy-remote.sh <n>      deploy commit number <n> from the list
#   scripts/deploy-remote.sh <sha>    deploy that commit (must be on origin/main)
#
# Also: npm run deploy -- <args>. The server runs the shared deploy tool from the
# dalew75/droplet repo (~/apps/droplet/bin/site-deploy dalew <args>), after pulling it.
# DEPLOY_HOST (default fairyboo.art) picks the server. The server deploys what's on GitHub, so push first.

set -e

HOST="${DEPLOY_HOST:-fairyboo.art}"
SITE=dalew
arg="${1:-list}"

case "$arg" in
  -h|--help) sed -n '2,13p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
  list|status|history) ;;
  *)
    # Deploying: refuse when local main has commits the server can't see yet
    cd "$(dirname "$0")/.."
    git fetch --quiet origin main
    unpushed=$(git rev-list --count origin/main..main 2>/dev/null || echo 0)
    if [ "$unpushed" != "0" ]; then
      echo "Local main has $unpushed commit(s) not on origin/main; the server won't see them." >&2
      echo "Run 'git push origin main' first (or deploy anyway with DEPLOY_ALLOW_UNPUSHED=1)." >&2
      [ "${DEPLOY_ALLOW_UNPUSHED:-}" = "1" ] || exit 1
    fi
    ;;
esac

# Show dates in this machine's timezone (the server runs on UTC)
tz="${TZ:-$(cat /etc/timezone 2>/dev/null || echo UTC)}"
remote_cmd="git -C ~/apps/droplet pull --quiet --ff-only && TZ=$(printf %q "$tz") ~/apps/droplet/bin/site-deploy $SITE $(printf %q "$arg")"
echo "[$HOST] site-deploy $SITE $arg"
exec ssh -o BatchMode=yes "$HOST" "bash -lc $(printf %q "$remote_cmd")"
