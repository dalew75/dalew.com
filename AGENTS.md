# dalew.com

Personal website: Next.js 14 (app router), React 18, TypeScript. Pages are `app/page.tsx` and `app/now/page.tsx`. Static files are in `public/`; e.g. `public/oauth/aiengineerjobs-client.json` is the OAuth client metadata the aiengineerjobs poller (workstation) points at, so it must stay at that URL. `archive/html/` is the old static site, kept for reference and not served.

**Hosting:** the combined droplet (`ssh fairyboo.art`). The checkout is `/home/dale/apps/dalew.com`, pm2 app `dalew-website` (`next start -p 3002`), and nginx proxies dalew.com to it. Server config and the deploy tool live in the `dalew75/droplet` repo (`../droplet`).

## Git

When a change is done, commit it and push `main` to `origin` without asking (user decision). Use Conventional Commit subjects. Never commit secrets or env files.

## Deploying after changes

- **Deploy:** `scripts/deploy-remote.sh <args>` (= `npm run deploy -- <args>`). It refuses if local `main` is unpushed, then SSHes to the droplet, runs `git pull` on `~/apps/droplet`, and runs `bin/site-deploy dalew <args>` there. Args: `status` (deployed vs newest), `list` (numbered, 0 = newest), `history` (deploy log), `latest`, `<n>` (list number), `<sha>` (any commit on `origin/main`). A build takes a minute or two; use a long timeout.
- After committing and pushing a change that affects the live site (anything outside docs/markdown, e.g. `app/`, `components/`, `public/`, `package*.json`, config), **ask with AskUserQuestion** (one question, single choice): "Deploy latest (Recommended)" / "Don't deploy now" / "Deploy a different version". Include the commit subject(s) in the question. Don't deploy without that answer.
- Deploy latest → `scripts/deploy-remote.sh latest`. Report success, or the build error from the tail of the output.
- A different version, or a request in chat ("deploy the previous version", "roll back to before the now page"): run `status` and `list`, and match the description against commit subjects (use `git show --stat <sha>` and this chat's context when subjects are vague). Then confirm with AskUserQuestion offering the 1–3 likeliest commits as `sha  date  subject`, ask about main (next bullet), and deploy. "Previous version" means the commit before the one **currently deployed** (from `status`). "Before feature X" means the parent of the commit that added X.
- **Rolling back to an older version: ask whether to move `main` back too** (AskUserQuestion, single choice): "Keep main as is, just deploy the old version" / "Reset main to it and park the newer commits on a branch". Suggest a branch name from what the newer commits do, `parked/<kebab-feature>`, and list the commits that would move. If they choose reset: `git branch <name> origin/main` → `git push origin <name>` → `git checkout main && git reset --hard <sha>` (local `main` must be clean and pushed first) → `git push --force-with-lease origin main` → `scripts/deploy-remote.sh latest` (site-deploy resets the server's `main` to `origin/main`). Otherwise `scripts/deploy-remote.sh <sha>`.
- When the user asks for a list of versions, show a table: `#` (0 = newest), Commit (short sha), Date, Time (local, HH:MM), Author, Change (plain-words summary), and mark the live one with **← live now**. Always look up the live commit on the server first (`status`); if it's older than the rows shown, add it as an extra row below. `history` shows the deploy log.
- Afterwards run `scripts/deploy-remote.sh status` and tell the user what's live.
