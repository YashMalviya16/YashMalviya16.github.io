import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, wrap } from 'motion/react';

// Endless ticker that speeds up (and reverses) with scroll velocity.
export default function Marquee({ items, baseSpeed = 3, reverse = false }) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-1000, 0, 1000], [-4, 0, 4], { clamp: false });
  const direction = useRef(reverse ? -1 : 1);
  const translate = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    const b = boost.get();
    if (b < 0) direction.current = reverse ? 1 : -1;
    else if (b > 0) direction.current = reverse ? -1 : 1;
    const move = direction.current * -baseSpeed * (delta / 1000) * (1 + Math.abs(b));
    x.set(x.get() + move);
  });

  const row = items.map((it, i) => (
    <span className="marquee-item" key={i}>
      {it}
      <i aria-hidden="true">✦</i>
    </span>
  ));

  return (
    <div className="marquee" aria-hidden="true">
      <motion.div className="marquee-track" style={{ x: translate }}>
        {row}
        {row}
      </motion.div>
    </div>
  );
}
