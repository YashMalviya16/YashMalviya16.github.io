import { motion } from 'motion/react';

export const ease = [0.22, 1, 0.36, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

// Fades its children up once when they scroll into view.
export default function Reveal({ as = 'div', children, delay = 0, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ hidden: fadeUp.hidden, show: { ...fadeUp.show, transition: { ...fadeUp.show.transition, delay } } }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

// Headline reveal: each word slides up from behind a mask, one after another.
// `animate` = play immediately (hero); otherwise it plays when scrolled into view.
export function SplitHeading({ as = 'h2', text, className, delay = 0, animate = false, stepDelay = 0.06 }) {
  const Tag = motion[as];
  const trigger = animate
    ? { initial: 'hidden', animate: 'show' }
    : { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '-80px' } };

  return (
    <Tag className={className} aria-label={text} {...trigger} transition={{ staggerChildren: stepDelay, delayChildren: delay }}>
      {text.split(' ').map((word, i, all) => (
        <span key={i} aria-hidden="true">
          <span className="mask">
            <motion.span
              className="mask-inner"
              variants={{ hidden: { y: '110%', rotate: 4 }, show: { y: '0%', rotate: 0, transition: { duration: 0.9, ease } } }}
            >
              {word}
            </motion.span>
          </span>
          {i < all.length - 1 && ' '}
        </span>
      ))}
    </Tag>
  );
}
