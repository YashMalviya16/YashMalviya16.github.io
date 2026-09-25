import { useEffect, useState } from 'react';
import { animate, motion } from 'motion/react';
import { profile } from '../data.js';
import { ease } from './Reveal.jsx';

// Intro screen: a 0→100 counter, then the panel slides up to reveal the page.
// Shown once per browser session; skipped entirely for reduced-motion users.
export function shouldShowPreloader() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return !sessionStorage.getItem('intro-seen');
  } catch {
    return false;
  }
}

export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    const controls = animate(0, 100, {
      duration: 1.6,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        try { sessionStorage.setItem('intro-seen', '1'); } catch { /* storage blocked */ }
        document.documentElement.style.overflow = '';
        onDone();
      },
    });
    return () => controls.stop();
  }, [onDone]);

  return (
    <motion.div
      className="preloader"
      initial={{ y: 0 }}
      exit={{ y: '-100%', borderBottomLeftRadius: '50% 12vh', borderBottomRightRadius: '50% 12vh', transition: { duration: 0.9, ease } }}
      aria-hidden="true"
    >
      <motion.div className="preloader-name" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
        {profile.name}
        <span>{profile.role}</span>
      </motion.div>
      <div className="preloader-count">{count}</div>
      <div className="preloader-bar"><motion.i style={{ scaleX: count / 100 }} /></div>
    </motion.div>
  );
}
