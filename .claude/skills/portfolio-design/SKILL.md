---
name: portfolio-design
description: Design system for Yash Malviya's orange editorial portfolio (React + Vite + Motion). Use whenever adding or changing a section, component, colour, font, image or animation on this site.
---

# Portfolio design system

Stack: React + Vite, animation with Motion (`import { motion } from "motion/react"`), Lenis smooth scroll.
All content lives in `src/data.js`; components never hard-code copy. The site lives in `src/editorial/`.

## Look
- Light editorial base (`--ed-bg` #f3f3f1, ink #0f0f0f) with **burnt orange `--ed-orange` #e4572e** as the only accent.
- Dark sections (`.ed-dark`) for contrast: Honors & community, process cards, menu, intro.
- Signature element: the white **neural network** canvas (`components/NeuralField.jsx`) over the orange hero. Keep it.
- Use only the `--ed-*` tokens in `src/editorial/editorial.css`; no new colours without a reason.

## Type
- Display: Inter Tight 700–800, UPPERCASE, tight tracking (-0.045em) for headings.
- Headings are two-tone via `BlurHeading` (`"Strong words|soft grey words"`) and blur into focus on scroll.
- Body: Inter 400/500. Small labels: `Pill` (orange dot, uppercase, 0.72rem).

## Components to reuse (src/editorial/ui.jsx and friends)
`BlurHeading`, `Pill`, `FadeUp`, `ArrowUpRight`, `Plus`, `glyphs`, `GenCover` (Gen-AI style project art),
`Magnetic` (CTAs), `ProjectModal` / `Lightbox` (overlays), `lockScroll()` for anything modal.

## Motion
- Entrances: fade/blur + rise, ease `[0.22, 1, 0.36, 1]`, once, on scroll.
- Transform and opacity only. Wrap is `<MotionConfig reducedMotion="user">`; every CSS animation needs a
  `prefers-reduced-motion` off switch; heavy/looping effects pause off-screen or until hover.

## Content rules
- Government work is named by tech stack, never by internal project name.
- Numbers (KPIs) must come from the résumé or the user; don't invent metrics, testimonials or prices.

## Quality bar
- Must work at 375px wide with no horizontal scroll.
- Images: WebP via `npm run photos`, meaningful `alt`, explicit width/height where possible.
- Run `npm run check` before pushing (case-sensitive paths for GitHub's Linux runners).
