import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

// Wraps an element so it drifts toward the cursor while hovered, then springs back.
export default function Magnetic({ children, strength = 0.35, className }) {
  const ref = useRef(null);
  const x = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.2 });
  const y = useSpring(useMotionValue(0), { stiffness: 200, damping: 15, mass: 0.2 });

  function onMove(e) {
    if (e.pointerType !== 'mouse') return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div ref={ref} className={`magnetic ${className ?? ''}`} style={{ x, y }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.div>
  );
}
