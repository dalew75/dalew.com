# dalew.com timeline

The project's history: where it came from, its milestones, and a dated line for every finished task.
`project-stats dalew.com` reads this file, so keep the formats exact. Append with the shell, never rewrite old
lines. Public repo: dates only, no clock times.

## Origin

- **Conceived:** 2023-05-03 (estimated) · personal website
- **First commit:** 2023-05-03 · 70416c1
- **First working version:** 2023-05-03 · e488454 · static HTML site with socials (now in `archive/html/`)
- **First deploy:** 2023-05-03 (estimated) · e488454 · static site; on the combined droplet via `site-deploy` since 2026-11-19 (44022ee)
- **Why it started:** a personal home page
- **Came from / replaced:** none

## Milestones

| Date | Milestone | Commit | Notes |
|---|---|---|---|
| 2023-05-03 | first working | e488454 | static HTML (backfilled) |
| 2026-01-21 | rewrite | 7078360 | old static site removed, Next.js app (backfilled) |
| 2026-11-19 | first deploy | 44022ee | deploys through dalew75/droplet `site-deploy` (backfilled) |
| 2026-11-24 | warm-standby deploys | b145619 | stage in a second slot, promote in seconds |

## Timeline

- 2023-05-03 · feat · Static personal site: socials, centered layout · e488454 (backfilled)
- 2026-01-21 · pivot · Removed the static site files; Next.js app router site · 7078360 (backfilled)
- 2026-11-19 · feat · OAuth client metadata for the aiengineerjobs poller; deploy via droplet site-deploy · 7c0ca2b, 44022ee (backfilled)
- 2026-11-24 · deploy · Zero-downtime side builds (NEXT_DIST_DIR) · 2812ded (backfilled)
- 2026-11-24 · milestone · Warm-standby slots: /api/health with slot + sha, stage/peek/promote/rollback; cut over to slot b (switch took 4 s) · b145619, droplet 23cc921
- 2026-11-24 · feat · Security headers (nosniff, referrer policy, no framing), no X-Powered-By; first full slot cycle: stage 77 s, promote/rollback/promote 3–4 s each, 47/47 requests 200 · 8ef79cf
