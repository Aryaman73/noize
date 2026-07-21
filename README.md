# Noize

Noize is a simple web app that helps people relax/focus using white noise or
background noise. Built with **React 18** and **Vite**.

Originally a [create-react-app](https://github.com/facebook/create-react-app)
project; migrated to Vite so it runs on modern Node and deploys cleanly to
GitHub Pages. See [`PLAN.md`](./PLAN.md) for the migration notes.

## Requirements

- Node 18+ (a `.nvmrc` pins Node 20; the app is developed on newer versions too)

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in development mode at [http://localhost:5173](http://localhost:5173).
The page hot-reloads as you edit.

### `npm run build`

Builds the app for production into the `dist/` folder (minified, hashed
filenames). Ready to deploy to any static host.

### `npm run preview`

Serves the built `dist/` locally so you can sanity-check a production build
before deploying.

## Deployment (GitHub Pages)

Deployment is automated via GitHub Actions
([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)). On every push
to `master`, the workflow builds the app and publishes `dist/` to GitHub Pages.

One-time setup in your own repo:

1. Push this repo to your GitHub account.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `master` (or run the workflow manually) — the site publishes at
   `https://<your-username>.github.io/<repo-name>/`.

The Vite `base` is relative (`./`), so the same build works at a repo sub-path,
behind a custom domain, or at the site root without changes.

## Notes

- Ambient audio is streamed from an external Backendless CDN.
- Background visuals are bundled `.mp4` videos with `.gif` fallbacks.
