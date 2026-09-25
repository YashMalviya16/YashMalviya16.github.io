import { useRef } from 'react';
import { motion, useInView, useScroll, useTransform, animate } from 'motion/react';
import { useEffect, useState } from 'react';

// Paragraph whose words light up one by one as it scrolls through the viewport.
export function ScrollText({ text, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.45'] });
  const words = text.split(' ');

  return (
    <p ref={ref} className={`scroll-text ${className ?? ''}`} aria-label={text}>
      {words.map((w, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          {w}
        </Word>
      ))}
    </p>
  );
}

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <span aria-hidden="true">
      <motion.span style={{ opacity }}>{children}</motion.span>{' '}
    </span>
  );
}

// Counts up to a value (e.g. "3+", "4.0") the first time it scrolls into view.
export function Counter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const match = String(value).match(/^([\d.]+)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const decimals = match && match[1].includes('.') ? match[1].split('.')[1].length : 0;
  const [shown, setShown] = useState(match ? (0).toFixed(decimals) : value);

  useEffect(() => {
    if (!inView || !match) return;
    const c = animate(0, target, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setShown(v.toFixed(decimals)) });
    return () => c.stop();
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return <strong ref={ref}>{match ? `${shown}${match[2]}` : value}</strong>;
}
