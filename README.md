# yashmalviya16.github.io

Personal portfolio of Yash Malviya, live at https://yashmalviya16.github.io.

React + Vite, animated with [Motion](https://motion.dev) and Lenis smooth scrolling, deployed to GitHub Pages by GitHub Actions on every push to `main`.

## Work on it

```bash
npm install
npm run dev        # preview at http://localhost:5173  (add ?nointro to skip the intro)
npm run check      # the same checks + build that run on GitHub before deploying
```

## Update content

All text, links, jobs, projects, KPIs, press and highlights live in [`src/data.js`](src/data.js). Edit that file; the page reads from it.

| To change | Where |
|---|---|
| Photos of organisations (Experience) | put files in `photos/orgs/`, run `npm run photos`, set `photo:` in `experience` |
| Proof photos (Honors & community) | put files in `photos/highlights/`, run `npm run photos`, set `photo:` in `achievements` |
| Link-preview image (LinkedIn, WhatsApp…) | `node scripts/og-card.mjs` rebuilds `public/images/og-card.jpg` |
| Résumé | replace `public/Yash-Malviya-Resume.pdf` |

## Contact form

The form opens the visitor's email app by default. To have it send directly, get a free access key from https://web3forms.com and paste it into `web3formsKey` in `src/data.js`.

## Layout

| Path | What |
|---|---|
| `src/data.js` | All site content |
| `src/editorial/` | The site: one file per area (Hero, Intro, Work, Sections, ProcessVideo, GenCover…) |
| `src/components/` | Shared pieces: neural-network canvas, magnetic buttons |
| `src/lib/` | Smooth scroll, generated music, contact form |
| `scripts/` | Image processing, link-preview card, pre-deploy checks |
| `.claude/skills/portfolio-design/` | Design rules Claude Code follows when editing the site |
| `legacy/` | The previous template site and source images (not deployed) |
