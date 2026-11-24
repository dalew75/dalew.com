# dalew.com

Personal website: Next.js 14 (app router), React 18, TypeScript. Pages are `app/page.tsx` and `app/now/page.tsx`. Static files are in `public/`; e.g. `public/oauth/aiengineerjobs-client.json` is the OAuth client metadata the aiengineerjobs poller (workstation) points at, so it must stay at that URL. `archive/html/` is the old static site, kept for reference and not served.

**Hosting:** the combined droplet (`ssh fairyboo.art`) with **warm-standby slots** (`dalew75/droplet` `lib/slots.sh`, since 2026-11-24): two worktrees of `/home/dale/apps/dalew.com`, `~/apps/slots/dalew-a` (pm2 `dalew-website-a`, 127.0.0.1:3002) and `dalew-b` (`dalew-website-b`, :3005); nginx's upstream `dalew_live` points at the live one. `/api/health` reports `{ok, slot, sha, branch}`; the deploy checks the public one reports the new sha after switching. Server config and the deploy tool live in the `dalew75/droplet` repo (`../droplet`).

## Git

When a change is done, commit it and push `main` to `origin` without asking (user decision). Use Conventional Commit subjects. Never commit secrets or env files.

## Deploying after changes

- **Deploy:** `scripts/deploy-remote.sh <args>` (= `npm run deploy -- <args>`). It refuses unpushed commits on the branch being deployed, then SSHes to the droplet, pulls `~/apps/droplet` and runs `bin/site-deploy dalew <args>`. `stage <latest|n|sha|branch>` builds and starts that version in the standby slot (a minute or two; long timeout) while live keeps serving; `peek` tunnels the standby to http://localhost:23920; `promote` points nginx at it (seconds) and keeps the old one warm; `rollback` flips back (seconds); `slots` shows both; `latest|<target>` = stage + promote; also `status`, `list` (numbered, 0 = newest), `history`. A feature branch may go live; merge it before the next deploy (`stage` refuses otherwise unless `--force`).
- **Flow after a push:** run `scripts/deploy-remote.sh stage latest` right away (background), then ask the question below; "Deploy latest" with that version staged = `promote`.
- After committing and pushing a change that affects the live site (anything outside docs/markdown, e.g. `app/`, `components/`, `public/`, `package*.json`, config), **ask with AskUserQuestion** (one question, single choice): "Deploy latest (Recommended)" / "Don't deploy now" / "Deploy a different version". Include the commit subject(s) in the question. Don't deploy without that answer.
- Deploy latest → `promote` if it's staged, else `scripts/deploy-remote.sh latest`. Report success, or the build error from the tail of the output.
- A different version, or a request in chat ("deploy the previous version", "roll back to before the now page"): run `status` and `list`, and match the description against commit subjects (use `git show --stat <sha>` and this chat's context when subjects are vague). Then confirm with AskUserQuestion offering the 1–3 likeliest commits as `sha  date  subject`, ask about main (next bullet), and deploy. "Previous version" means the commit before the one **currently deployed** (from `status`). "Before feature X" means the parent of the commit that added X.
- **Rolling back to an older version: ask whether to move `main` back too** (AskUserQuestion, single choice): "Keep main as is, just deploy the old version" / "Reset main to it and park the newer commits on a branch". Suggest a branch name from what the newer commits do, `parked/<kebab-feature>`, and list the commits that would move. If they choose reset: `git branch <name> origin/main` → `git push origin <name>` → `git checkout main && git reset --hard <sha>` (local `main` must be clean and pushed first) → `git push --force-with-lease origin main` → `scripts/deploy-remote.sh latest` (site-deploy resets the server's `main` to `origin/main`). Otherwise `scripts/deploy-remote.sh <sha>`.
- When the user asks for a list of versions, show a table: `#` (0 = newest), Commit (short sha), Date, Time (local, HH:MM), Author, Change (plain-words summary), and mark the live one with **← live now**. Always look up the live commit on the server first (`status`); if it's older than the rows shown, add it as an extra row below. `history` shows the deploy log.
- Afterwards run `scripts/deploy-remote.sh status` and tell the user what's live.

## History

`docs/TIMELINE.md`: origin, milestones and one line per finished task (dates only, public repo).
