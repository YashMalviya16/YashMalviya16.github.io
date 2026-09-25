# yashmalviya16.github.io

Personal portfolio of Yash Malviya, live at https://yashmalviya16.github.io.

Built with React + Vite, animated with [Motion](https://motion.dev), deployed to GitHub Pages by GitHub Actions on every push to `main`.

## Work on it

```bash
npm install
npm run dev        # preview at http://localhost:5173
npm run build      # production build in dist/
```

## Update content

All text, links, jobs and projects live in [`src/data.js`](src/data.js). Edit that file; the components read from it.

To add a project image, put the original in `legacy/images/`, add a line to `scripts/optimize-images.mjs`, and run `npm run images`. It writes a compressed WebP to `public/images/`.

## Hero background video

The hero uses an animated neural-network canvas by default. To use a video instead, put a short, silent,
looping clip (MP4, under about 4 MB, 1920×1080 or smaller) in `public/videos/` and set
`heroVideo: '/videos/your-clip.mp4'` in `src/data.js`.

## Contact form

The form opens the visitor's email app by default. To have it send directly, get a free access key from https://web3forms.com and paste it into `web3formsKey` in `src/data.js`.

## Layout

| Path | What |
|---|---|
| `src/data.js` | All site content |
| `src/components/` | One file per section |
| `src/styles.css` | Design tokens and styles |
| `.claude/skills/portfolio-design/` | Design rules Claude Code follows when editing the site |
| `legacy/` | The previous template-based site, kept for reference (not deployed) |
