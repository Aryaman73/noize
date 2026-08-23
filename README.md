<h1 align="center">🎧 Noize</h1>

<p align="center">
  <em>Background &amp; white noise to help you relax or focus.</em><br>
  Ten looping pixel-art scenes, ten ambient tracks, zero sign-ups.
</p>

<p align="center">
  <a href="https://aryaman73.github.io/noize/"><strong>Open the app →</strong></a>
</p>

<p align="center">
  <img alt="React 18" src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white">
  <img alt="Vite 6" src="https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white">
  <img alt="Node 20" src="https://img.shields.io/badge/Node-20-339933?logo=nodedotjs&logoColor=white">
  <a href="https://github.com/Aryaman73/noize/actions/workflows/deploy.yml"><img alt="Deploy" src="https://github.com/Aryaman73/noize/actions/workflows/deploy.yml/badge.svg"></a>
</p>

---

## What it is

Pick a scene — a waterfall, a thunderstorm, a café, a snowy blizzard — and it
loops as full-bleed video while its ambient track plays. That's the whole app.

This is a recreation of a [lovely little project][original] originally built by
[kartiknair](https://github.com/kartiknair), rebuilt on modern tooling with the
original art and sounds kept intact. Credits for every artist and sound live on
the in-app **about** page.

[original]: https://github.com/kartiknair/noize

## Highlights

| | |
| --- | --- |
| 🌗 **Dark mode** | Follows `prefers-color-scheme` by default, overridable with the toggle, remembered in `localStorage`, and applied before first paint so there's no flash of the wrong theme. |
| 📱 **iOS-friendly audio** | MP3s are served from the Pages site itself so Safari actually plays them (see [Audio pipeline](#audio-pipeline)). Videos use `playsInline` so iOS doesn't hijack them into fullscreen. |
| 🎞️ **Video with GIF fallback** | Each scene is an `.mp4`; if `<video>` errors, the component swaps in the `.gif`. |
| 📦 **Zero runtime deps** | React and ReactDOM. That's it. |
| 🚀 **Push-to-deploy** | Every push to `master` builds and publishes to GitHub Pages via Actions. |

## Quick start

```bash
nvm use          # Node 20 (see .nvmrc); Node 18+ works
npm ci
npm run dev      # http://localhost:5173
```

> **Heads up:** in local dev the audio files aren't present — they're fetched at
> deploy time, not stored in git (see below). The UI, scenes, and theming all
> work; only playback is silent. Drop the ten MP3s into `public/audio/` if you
> want sound locally.

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR at [localhost:5173](http://localhost:5173). |
| `npm run build` | Production build into `dist/` (minified, hashed filenames). |
| `npm run preview` | Serves the built `dist/` locally to sanity-check a release. |

## Project layout

```
index.html          entry + no-flash theme script
src/
  index.jsx         createRoot + StrictMode
  App.jsx           view switching (library / song / about)
  Library.jsx       grid of scenes; builds the audio + image URLs
  SongCard.jsx      one scene tile, video with gif fallback
  SongPage.jsx      full-bleed scene + <audio> player
  About.jsx         credits
  ThemeToggle.jsx   sun/moon toggle
  theme.js          theme resolution + persistence
  media.js          import.meta.glob → hashed asset URLs
  images/           iN.mp4 + iN.gif (bundled, 10 scenes)
public/             favicon, manifest, robots.txt
.github/workflows/  deploy.yml
```

## Infrastructure

### Build

Vite 6 with `@vitejs/plugin-react`. `base` is `./` (relative), so the same build
works at a Pages sub-path (`user.github.io/noize/`), behind a custom domain, or
at a site root — no rebuild, no config swap.

Scene media is bundled from `src/images/`. Because Vite has no webpack-style
dynamic `require()`, [`src/media.js`](src/media.js) eagerly globs every
`.mp4`/`.gif` and maps the `./images/iN` keys the components use onto their
final hashed URLs.

### Audio pipeline

The ten MP3s are **not in git** and **not hotlinked** — they're stored as a
GitHub Release asset (`audio-v1`) and pulled into `dist/audio/` by the deploy
workflow, so they ride along inside the Pages artifact.

The detour matters on iOS:

- **GitHub Releases** serve `application/octet-stream` + `Content-Disposition: attachment` → Safari refuses to play them.
- **GitHub Pages** serves `audio/mpeg` inline with range-request support → works everywhere, iOS included.

At runtime `Library.jsx` builds URLs as `${import.meta.env.BASE_URL}audio/aN.mp3`,
which keeps them correct under any deploy base. Earlier versions streamed from a
Backendless CDN; that dependency is gone.

### Deployment

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs on every
push to `master` (and on manual dispatch):

```
checkout → setup-node 20 (npm cache) → npm ci → npm run build
        → curl the 10 MP3s into dist/audio/
        → upload-pages-artifact → deploy-pages
```

It uses OIDC (`id-token: write`) with the official Pages actions — no
`gh-pages` branch, no tokens to manage. Concurrency is capped to one deploy,
with newer pushes cancelling in-flight runs.

**One-time setup in a fork:** Settings → Pages → Source → **GitHub Actions**,
then upload the audio as a Release tagged `audio-v1` (or point the `curl` loop
at wherever you host it).

## History

Started life as a Create React App project on `react-scripts@3.3.0`, which no
longer builds on modern Node (webpack 4 needs OpenSSL's removed MD4 hash). It
was migrated to Vite + React 18, and dead weight — `firebase`, a Universal
Analytics `react-ga` snippet, the CRA service worker — was dropped along the
way. Full notes in [`PLAN.md`](./PLAN.md).
