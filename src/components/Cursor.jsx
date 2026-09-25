import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

// Custom cursor for mouse users: a small dot plus a trailing ring that grows over links
// and shows a label over anything with a data-cursor attribute (e.g. "View").
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState({ hover: false, label: '' });
  const [down, setDown] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 350, damping: 30, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 350, damping: 30, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add('has-cursor');

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target.closest?.('[data-cursor], a, button, input, textarea, label');
      setState((prev) => {
        const next = { hover: !!target, label: target?.getAttribute?.('data-cursor') ?? '' };
        return prev.hover === next.hover && prev.label === next.label ? prev : next;
      });
    };
    const leave = () => { x.set(-100); y.set(-100); };
    const press = () => setDown(true);
    const release = () => setDown(false);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    window.addEventListener('pointerdown', press);
    window.addEventListener('pointerup', release);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      window.removeEventListener('pointerdown', press);
      window.removeEventListener('pointerup', release);
    };
  }, [x, y]);

  if (!enabled) return null;
  const size = state.label ? 88 : state.hover ? 56 : 32;

  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} aria-hidden="true" />
      <motion.div
        className={`cursor-ring${state.label ? ' labelled' : ''}`}
        style={{ x: rx, y: ry }}
        animate={{ width: size, height: size, scale: down ? 0.85 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        aria-hidden="true"
      >
        {state.label && <span>{state.label}</span>}
      </motion.div>
    </>
  );
}
