# Home Dashboard

Home screen that brings Ben's apps together (Meal Rota, Chores, Money Flow and others) with a to-do list and his Google Calendar.

Live: https://bengalebg23.github.io/HomeDashboard-/

## How Ben works
- Ben works from his phone. He asks for changes in chat and Claude pushes them straight to the deploy branch. There's no local build and no pull-request review.
- Pushing to `main` deploys via GitHub Pages within a minute or two.
- The repo is **public**. Never commit secrets, API keys meant to stay private, family photos or personal data.

## Every release
- Bump `APP_VERSION` and the `<title>` in `index.html` and `CACHE_VERSION` in `sw.js` together.
- Keep `HANDOFF.md` up to date (version, what changed, open threads) if the repo has one.
- After pushing, give Ben the live URL and the new version number so he can check it on his phone.

## Code rules
- Single-file app: keep HTML, CSS and JS in `index.html`. No build step, bundler or npm packages.
- Pin exact CDN versions (no `@latest` or floating majors). A floating Babel major broke an app before.
- Self-review before pushing: duplicate `const`/`let` in one scope, variable shadowing inside loops, unclosed template literals, undefined references.
- Defer re-renders triggered inside click handlers with `setTimeout(..., 0)` to avoid detached-node bugs from bubbled events.
- Don't swallow Firebase errors with a bare `console.warn`. Surface them so permission problems are visible.
- UK English in all user-facing text.
- Bulk Firebase writes: use direct awaited `set()` calls. Debounced save helpers only keep the last write in a tight loop.
- Never let a fresh or cleared device overwrite cloud data on first load. Read the cloud first, merge, then write.

## This app
- Reads the House Ledger Firebase database (`house-ledger-26622`). Changes to Chores' data paths must be mirrored here.
- `calendar-feed.gs` is a Google Apps Script that runs on Ben's own Google account and serves calendar events as JSON. It isn't deployed by Pages. Ben pastes changes into script.google.com and redeploys there, so tell him when it changes.
- If an app's URL changes, update its link here.
