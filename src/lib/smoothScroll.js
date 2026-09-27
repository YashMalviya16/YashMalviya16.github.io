import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenis = null;

// In-page links (#about etc.): glide there with Lenis, leaving room for the fixed nav.
function onAnchorClick(e) {
  const a = e.target.closest?.('a[href^="#"]');
  if (!a || !lenis || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
  const id = a.getAttribute('href').slice(1);
  const target = id === 'top' || id === '' ? 0 : document.getElementById(id);
  if (target === null) return;
  e.preventDefault();
  // No offset needed: Lenis applies the CSS scroll-padding-top (= nav height) itself.
  lenis.scrollTo(target, { duration: 1.4 });
  history.replaceState(null, '', `#${id}`);
}

// Starts inertia-based smooth scrolling (skipped for reduced-motion users and touch devices,
// where native scrolling already feels right).
export function startSmoothScroll() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const off = new URLSearchParams(location.search).has('nosmooth'); // for testing / screenshots
  if (reduce || coarse || off || lenis) return () => {};
  lenis = new Lenis({ autoRaf: true, lerp: 0.1 });
  document.addEventListener('click', onAnchorClick);
  return () => {
    document.removeEventListener('click', onAnchorClick);
    lenis?.destroy();
    lenis = null;
  };
}

export function lockScroll(locked) {
  if (lenis) locked ? lenis.stop() : lenis.start();
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}
