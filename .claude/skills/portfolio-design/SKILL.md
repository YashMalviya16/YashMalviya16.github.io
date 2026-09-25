---
name: portfolio-design
description: Design system for Yash Malviya's portfolio (React + Vite + Motion). Use whenever adding or changing a section, component, colour, font or animation on this site.
---

# Portfolio design system

Stack: React + Vite, animation with Motion (`import { motion } from "motion/react"`). All content lives in
`src/data.js` — components never hard-code copy.

## Colour
Use only the CSS custom properties in `src/styles.css` (`--bg`, `--surface`, `--surface-2`, `--border`,
`--text`, `--muted`, `--accent`, `--accent-ink`). Never write a raw hex value in a component. Dark is the
default theme; light is defined under `prefers-color-scheme: light`. One accent colour only; it marks
interactive things (links, buttons, focus rings, active nav) and small highlights, never large fills.

## Type
- Display: Space Grotesk 600 — headings only.
- Body: Inter 400/500.
- Scale (fluid): h1 `clamp(2.5rem, 6vw, 4.5rem)`, h2 `clamp(1.75rem, 3.5vw, 2.5rem)`, h3 1.25rem, body 1rem/1.65, small 0.875rem.
- Line length for prose: max 65ch.

## Spacing & layout
- 4px base; use the `--space-*` tokens.
- Content width 1120px, side gutter 24px (16px under 480px).
- Sections: `padding-block: clamp(4rem, 10vw, 7rem)`; each starts with an eyebrow label + h2.
- Radius: 16px cards, 999px pills/buttons.

## Motion
- Entrances: fade + 24px rise, 0.6s, ease `[0.22, 1, 0.36, 1]`, triggered once on scroll (`whileInView`, `viewport={{ once: true, margin: "-80px" }}`).
- Stagger children by 0.08s. Hover: lift 4px, 0.2s.
- Never animate layout-shifting properties on scroll; transform and opacity only.
- The app is wrapped in `<MotionConfig reducedMotion="user">` — keep it that way.

## Quality bar
- Must look right at 360px wide. Test mobile first.
- Every image: WebP in `public/images`, ≤ 250 KB, explicit width/height, meaningful `alt`.
- Every interactive element reachable by keyboard with a visible focus ring.
- No lorem ipsum, no template credits, no dead links.
