import { motion } from 'motion/react';
import { profile } from '../data.js';
import { ArrowRight, Download, GitHub, LinkedIn } from './Icons.jsx';
import { ease, fadeUp, stagger } from './Reveal.jsx';

export default function Hero() {
  const [first, ...rest] = profile.name.split(' ');

  return (
    <section id="top" className="hero">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container hero-grid">
        <motion.div initial="hidden" animate="show" variants={stagger}>
          <motion.span className="eyebrow" variants={fadeUp}>Hello, I'm</motion.span>
          <motion.h1 variants={fadeUp}>
            {first} <span className="accent">{rest.join(' ')}</span>
          </motion.h1>
          <motion.p className="hero-role" variants={fadeUp}>{profile.role}</motion.p>
          <motion.p className="lead" variants={fadeUp}>{profile.tagline}</motion.p>

          <motion.div className="hero-actions" variants={fadeUp}>
            <a className="btn btn-primary" href="#projects">
              View my work <ArrowRight />
            </a>
            <a className="btn" href={profile.resume} download>
              <Download /> Download CV
            </a>
          </motion.div>

          <motion.div className="hero-social" variants={fadeUp}>
            <a className="icon-link" href={profile.links.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
              <LinkedIn />
            </a>
            <a className="icon-link" href={profile.links.github} target="_blank" rel="noopener" aria-label="GitHub">
              <GitHub />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-media"
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
        >
          <div className="portrait">
            <img src={profile.portrait} alt={`Portrait of ${profile.name}`} width="800" height="1000" fetchPriority="high" />
            <div className="status"><i aria-hidden="true" /> Open to opportunities</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
