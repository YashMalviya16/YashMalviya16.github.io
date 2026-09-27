import { motion } from 'motion/react';

export const ease = [0.22, 1, 0.36, 1];

// Two-tone headline: words before "|" are ink, words after are grey. Each word comes into focus
// from a blur as the heading scrolls into view.
export function BlurHeading({ text, as = 'h2', className = '', center = false, delay = 0 }) {
  const Tag = motion[as];
  const [strong, soft = ''] = text.split('|');
  const words = [
    ...strong.trim().split(/\s+/).map((w) => ({ w, soft: false })),
    ...soft.trim().split(/\s+/).filter(Boolean).map((w) => ({ w, soft: true })),
  ];

  return (
    <Tag
      className={`ed-heading ${center ? 'is-center' : ''} ${className}`}
      aria-label={text.replace('|', ' ')}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      transition={{ staggerChildren: 0.07, delayChildren: delay }}
    >
      {words.map(({ w, soft: isSoft }, i) => (
        <span key={i} aria-hidden="true">
          <motion.span
            className={isSoft ? 'soft' : undefined}
            style={{ display: 'inline-block' }}
            variants={{
              hidden: { opacity: 0, y: 24, filter: 'blur(14px)' },
              show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease } },
            }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
}

// Small pill label with an orange dot, used above every section heading.
export function Pill({ children, dark = false }) {
  return (
    <motion.span
      className={`ed-pill ${dark ? 'is-dark' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease }}
    >
      <i aria-hidden="true" /> {children}
    </motion.span>
  );
}

export function FadeUp({ children, delay = 0, className, as = 'div', ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, ease, delay }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7" /><path d="M8 7h9v9" />
  </svg>
);

export const Plus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

// Orange glyphs used on the dark process / achievement cards.
export const glyphs = [
  <svg key="0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" /></svg>,
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" /></svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><circle cx="12" cy="7" r="4" /><circle cx="7" cy="16" r="4" /><circle cx="17" cy="16" r="4" /></svg>,
  <svg key="3" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z" /></svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M12 3a9 9 0 1 0 9 9h-9z" /></svg>,
  <svg key="5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-8-5.3-8-11a5 5 0 0 1 8-4 5 5 0 0 1 8 4c0 5.7-8 11-8 11z" /></svg>,
];
