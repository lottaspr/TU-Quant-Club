# TU Quant Club website

Website for TU Quant Club, the quantitative trading student club in Munich. Built with React, Vite and TypeScript.

## Run locally

```bash
npm install
npm run dev
```

`npm run build` writes the static site to `dist/`.

## Where things live

- `src/content.ts`: club name, email, apply link, events, team roles and stats
- `src/pages/`: Home, About, Team, Events, Apply
- `src/components/`: nav, footer, charts and the scroll effects
- `src/styles.css`: colors from the Figma file, Helvetica type and all styling

Routing uses hash URLs (`/#/about`), so the site works on any static host.

## Deploy

Deploying is manual for now: turn on Settings → Pages → Source: GitHub Actions, then run the "Deploy to GitHub Pages" workflow from the Actions tab. To deploy on every push, add a `push` trigger in `.github/workflows/deploy.yml`.

## Credits

The dotted orb animations use the [thinking-orbs](https://github.com/rareformlabs/thinking-orbs) engine (MIT © Jakub Antalik), drawn at large sizes by `src/components/Orb.tsx`.
