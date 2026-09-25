import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenis = null;

// Starts inertia-based smooth scrolling (skipped for reduced-motion users and touch devices,
// where native scrolling already feels right).
export function startSmoothScroll() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  if (reduce || coarse || lenis) return () => {};
  lenis = new Lenis({ autoRaf: true, lerp: 0.1, anchors: { offset: -68 } });
  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}
