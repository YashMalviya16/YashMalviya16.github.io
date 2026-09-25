import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { profile } from '../data.js';
import { ArrowRight, Download, GitHub, LinkedIn } from './Icons.jsx';
import Magnetic from './Magnetic.jsx';
import NeuralField from './NeuralField.jsx';
import { ease } from './Reveal.jsx';

function Letters({ text, delay, className }) {
  return (
    <span className={`mask ${className ?? ''}`} aria-hidden="true">
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          className="mask-inner"
          variants={{
            hidden: { y: '115%' },
            show: { y: '0%', transition: { duration: 1, ease, delay: delay + i * 0.035 } },
          }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  );
}

function RotatingWord({ words }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % words.length), 2400);
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span className="rotator">
      <AnimatePresence initial={false}>
        <motion.span
          key={words[i]}
          className="rotator-word"
          initial={{ y: '100%', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-100%', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.5, ease }}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero({ ready }) {
  const ref = useRef(null);
  const [first, ...rest] = profile.name.split(' ');

  // Scroll: content drifts up and fades, background zooms slightly (parallax).
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // Mouse: portrait tilts toward the cursor.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 14 });
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 14 });

  function onMove(e) {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  const state = ready ? 'show' : 'hidden';
  const up = (delay) => ({
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease, delay } },
  });

  return (
    <section id="top" className="hero" ref={ref} onPointerMove={onMove}>
      <motion.div className="hero-bg" style={{ scale: bgScale }}>
        {profile.heroVideo ? (
          <video className="hero-video" src={profile.heroVideo} autoPlay muted loop playsInline preload="metadata" aria-hidden="true" />
        ) : (
          <NeuralField />
        )}
        <div className="hero-vignette" />
      </motion.div>

      <motion.div className="container hero-grid" style={{ y: contentY, opacity: contentOpacity }} initial="hidden" animate={state}>
        <div>
          <motion.span className="eyebrow" variants={up(0.1)}>
            <i className="live-dot" aria-hidden="true" /> {profile.role} · {profile.location.split(',')[0]}
          </motion.span>

          <h1 className="hero-title" aria-label={profile.name}>
            <Letters text={first} delay={0.15} />
            <br />
            <Letters text={rest.join(' ')} delay={0.35} className="accent" />
          </h1>

          <motion.p className="hero-line" variants={up(0.7)}>
            I build with <RotatingWord words={profile.focus} />
          </motion.p>
          <motion.p className="lead" variants={up(0.8)}>{profile.tagline}</motion.p>

          <motion.div className="hero-actions" variants={up(0.9)}>
            <Magnetic>
              <a className="btn btn-primary btn-lg" href="#projects">
                View my work <ArrowRight />
              </a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn-lg" href={profile.resume} download>
                <Download /> Download CV
              </a>
            </Magnetic>
          </motion.div>

          <motion.div className="hero-social" variants={up(1)}>
            <Magnetic strength={0.5}>
              <a className="icon-link" href={profile.links.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
                <LinkedIn />
              </a>
            </Magnetic>
            <Magnetic strength={0.5}>
              <a className="icon-link" href={profile.links.github} target="_blank" rel="noopener" aria-label="GitHub">
                <GitHub />
              </a>
            </Magnetic>
          </motion.div>
        </div>

        <motion.div
          className="hero-media"
          variants={{
            hidden: { opacity: 0, scale: 0.9, clipPath: 'inset(100% 0% 0% 0% round 28px)' },
            show: { opacity: 1, scale: 1, clipPath: 'inset(0% 0% 0% 0% round 28px)', transition: { duration: 1.2, ease, delay: 0.4 } },
          }}
          style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 900 }}
        >
          <div className="portrait">
            <img src={profile.portrait} alt={`Portrait of ${profile.name}`} width="800" height="1000" fetchPriority="high" />
            <div className="portrait-shine" aria-hidden="true" />
          </div>
          <div className="status"><i aria-hidden="true" /> Open to opportunities</div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        className="scroll-cue"
        aria-label="Scroll to About"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ delay: 1.4 }}
      >
        <span>Scroll</span>
        <i aria-hidden="true" />
      </motion.a>
    </section>
  );
}
