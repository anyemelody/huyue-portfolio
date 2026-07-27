# huyue-portfolio

Personal portfolio for **Yue Hu** — design engineer × agentic AI / creative tooling.
Built with **Vite + React + React-Three-Fiber (Three.js)**. Ported from concept `homepage_concept_v7_dualaxis.html`.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
```

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build
```

## Structure

```
src/
  main.jsx               app entry
  App.jsx                page composition
  styles.css             all styles (ported from the v7 concept)
  data/
    flagships.js         Highlight Work (AIGE + Sound Viz)  ← fill real content
    eras.js              Journey timeline (3 eras + projects) ← confirm years / projects
    stack.js             Stack keywords  ← keep only what's true
  components/
    BackgroundFX.jsx     fixed Three.js (R3F) particle constellation; scroll dollies the camera
    Nav.jsx
    Hero.jsx             positioning + hero copy
    HighlightWork.jsx    two flagship AI systems (3D tilt on hover)
    Journey.jsx          dual-axis timeline: scroll down = switch era, keep scrolling = horizontal projects
    Stack.jsx
    About.jsx
    Footer.jsx
    PlaceholderThumb.jsx generative placeholder thumbnails (swap for real images/video)
```

## What's placeholder (fill next)

- `data/flagships.js` — real architecture, metrics, demo/GitHub links for AIGE & Sound Viz.
- `data/eras.js` — confirm year ranges; "Rain Rite" details; per-project role/client/result.
- Replace `PlaceholderThumb` usages with real images/video from huyue.space.
- Hero "based in ___", About bio + photo, real résumé / LinkedIn / GitHub links.

## Accessibility / fallback

- `prefers-reduced-motion`: 3D renders a single static frame; the dual-axis journey falls back to a
  simple vertical list with horizontally-swipeable project rows.
- Touch / small screens (≤760px): same simplified fallback (no scroll-jacking).

## Deploy

**Vercel (recommended):** import the repo → framework preset **Vite** → deploy. Add custom domain `huyue.space`.

**GitHub Pages:** `npm run build`, publish `dist/` (set `base` in `vite.config.js` if not served from root).

## Next ideas (phase 4 polish)

- Swap the hand-rolled journey scroll engine for **GSAP ScrollTrigger** (deps already included) for smoother pinning.
- Add **Lenis** smooth scrolling (dep included) — wire in `main.jsx` after confirming it plays well with the pinned section.
- Promote one flagship into a live, playable mini-demo.
