# Noize — Modernization Plan

A background/white-noise generator SPA. This document captures the state of the
project as found, why it wouldn't run, and the plan to get it (1) running
locally, (2) on modern tooling, and (3) deployable to GitHub Pages.

## Findings (state as found)

| Area | Detail |
| --- | --- |
| Build tool | Create React App — `react-scripts@3.3.0` (webpack 4). **Deprecated / EOL.** |
| React | 16.14 (class + function components, `ReactDOM.render`). |
| `firebase@7` | Listed as a dependency but **not used anywhere** in `src/`. Dead weight. |
| Audio | Streamed from a hardcoded **Backendless** CDN URL (`backendlessappcontent.com/.../a{1..10}.mp3`). Not Firebase. |
| Analytics | `react-ga` with a **Universal Analytics** ID (`UA-156002988-1`). Google shut UA down in **July 2023**, so this code is dead. |
| Media | 10 looping background `.mp4` videos with `.gif` fallbacks, bundled from `src/images/`. |
| Dynamic imports | `require(\`${isrc}.mp4\`)` — a webpack-only feature. Must be rewritten for any modern bundler. |
| Service worker | Standard CRA `serviceWorker.js`, registered in `index.js`. |
| Tests | None. Only `setupTests.js` + testing-library deps (all very old). |
| Deploy | `gh-pages@2` devDep; no `homepage` set; no CI. |
| Git remote | `origin` → `github.com/kartiknair/noize` (**original author's** repo). |

### Why it won't run today
Node v26 ships OpenSSL 3, which removed the legacy MD4 hash that webpack 4
(inside react-scripts 3.3.0) relies on. Result — **confirmed** by running the build:

```
Error: error:0308010C:digital envelope routines::unsupported
```

A band-aid exists (`NODE_OPTIONS=--openssl-legacy-provider`, which does build
successfully), but it keeps the project on dead tooling and does not satisfy
goal #2. So we migrate instead.

## Decision: migrate CRA → Vite + React 18

One change satisfies all three goals: Vite runs natively on Node 26, is the
current standard for React SPAs, and emits clean static output that GitHub Pages
serves directly.

## Plan

### 1. Get it working locally (Vite + React 18) — ✅ DONE
- [x] Replace `package.json`: dropped `react-scripts`, `firebase`, `react-ga`, CRA
      testing libs, `gh-pages`. Added `vite`, `@vitejs/plugin-react`, React 18.
      (65 packages, 0 vulnerabilities — down from the old CRA tree.)
- [x] Add `vite.config.js` with `@vitejs/plugin-react` and `base: './'`.
- [x] Move `public/index.html` → `./index.html`; drop `%PUBLIC_URL%`; add the
      `<script type="module" src="/src/index.jsx">` entry. Inter font moved from a
      render-blocking CSS `@import` to a `<link>` in the head.
- [x] Rename JSX files `.js` → `.jsx` (App, Library, SongCard, SongPage, About, index).
- [x] `index.jsx`: `createRoot` + `StrictMode` instead of `ReactDOM.render`; service worker removed.
- [x] Replace webpack `require()` media loading with a Vite `import.meta.glob`
      helper (`src/media.js`) that maps `./images/iN` → hashed asset URL.
- [x] Remove dead code: `react-ga` analytics in App, `serviceWorker.js`, `setupTests.js`.
- [x] `npm install` + `npm run dev` verified: HTML serves, JSX transforms, media glob
      resolves, build emits all 10 mp4/gif assets, `npm run preview` returns 200.

### 2. Modern standards (folded into step 1) — ✅ DONE
- React 18 + `createRoot` + StrictMode, ESM, Vite 6. Class components kept (still
  supported; rewriting to hooks is optional polish, out of scope for "get it working").
- Note: Google Analytics can be re-added later as a GA4 `gtag` snippet if wanted.

### 3. GitHub Pages hosting — ✅ workflow added; needs user's repo
- [x] Added `.github/workflows/deploy.yml` — GitHub Actions build + deploy to Pages
      (modern approach; no `gh-pages` branch pushing needed). Also added `.nvmrc` (Node 20).
- [ ] **User action required:** point `origin` at **your own** GitHub repo (it currently
      points at the original author `kartiknair/noize`), push, then enable
      **Settings → Pages → Source: GitHub Actions**.
- Because base is relative, the same build works whether the repo is `noize`
  (→ `you.github.io/noize/`) or served from a custom domain.

## Notes / follow-ups (optional)
- Backendless audio URLs are external HTTPS — fine over GitHub Pages.
- Consider adding a GA4 snippet if analytics is still wanted.
- Consider `vite-plugin-pwa` if offline support is desired (replaces the old SW).
