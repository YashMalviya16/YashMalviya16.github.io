import { useRef } from 'react';
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react';
import { profile, projects } from '../data.js';
import ProjectCover from '../components/ProjectCover.jsx';
import Magnetic from '../components/Magnetic.jsx';
import NeuralField from '../components/NeuralField.jsx';
import { ArrowUpRight, ease } from './ui.jsx';

// Letters rise out of a mask one by one; each word is its own unit so lines only break between words.
function BigName({ text, delay }) {
  let n = 0;
  return (
    <span aria-hidden="true">
      {text.split(' ').map((word, w, all) => (
        <span key={w}>
          <span className="mask">
            {[...word].map((ch) => (
              <motion.span
                key={n}
                className="mask-inner"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.1, ease, delay: delay + n++ * 0.04 }}
              >
                {ch}
              </motion.span>
            ))}
          </span>
          {w < all.length - 1 && ' '}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const ref = useRef(null);
  const featured = projects[0];
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const ghostY = useTransform(scrollYProgress, [0, 1], ['0%', '40%']);
  const networkY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);
  const portraitY = useTransform(scrollYProgress, [0, 1], ['0%', '12%']);
  const nameY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);

  // Portrait leans slightly toward the cursor.
  const mx = useMotionValue(0);
  const px = useSpring(useTransform(mx, [-0.5, 0.5], [-18, 18]), { stiffness: 80, damping: 18 });
  const cardX = useSpring(useTransform(mx, [-0.5, 0.5], [12, -12]), { stiffness: 80, damping: 18 });

  return (
    <section
      id="top"
      className="ed-hero"
      ref={ref}
      onPointerMove={(e) => e.pointerType === 'mouse' && mx.set(e.clientX / window.innerWidth - 0.5)}
    >
      <div className="ed-hero-grid" aria-hidden="true" />

      <motion.div className="ed-hero-ghost" style={{ y: ghostY }} aria-hidden="true"
        initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, ease }}>
        {profile.name.split(' ')[0]}
      </motion.div>

      {/* The neural network from the classic site, drawn in white over the orange. */}
      <motion.div className="ed-hero-network" style={{ y: networkY }} aria-hidden="true"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 2, delay: 0.3 }}>
        <NeuralField color="#ffffff" strength={1.6} className="ed-hero-network-canvas" />
      </motion.div>

      <motion.div className="ed-hero-portrait" style={{ y: portraitY, x: px }}
        initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.3, ease, delay: 0.2 }}>
        <img src="/images/portrait-cutout.webp" alt={`Portrait of ${profile.name}`} width="1000" height="1452" fetchPriority="high" />
      </motion.div>

      <div className="ed-wrap ed-hero-content">
        <motion.p className="ed-hero-intro"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.5 }}>
          I build production AI systems on real government data that are reliable, audited and useful.
        </motion.p>

        <motion.div className="ed-hero-name" style={{ y: nameY }}>
          <motion.span className="ed-hero-kicker"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            ©{new Date().getFullYear()} · {profile.role}
          </motion.span>
          <h1 aria-label={profile.name}><BigName text={profile.name.toUpperCase()} delay={0.3} /></h1>
        </motion.div>

        <motion.a
          href="#work"
          className="ed-float-card"
          style={{ x: cardX }}
          initial={{ opacity: 0, y: 40, rotate: 6 }}
          animate={{ opacity: 1, y: 0, rotate: 2 }}
          transition={{ duration: 1.1, ease, delay: 0.8 }}
          whileHover={{ rotate: 0, scale: 1.03 }}
        >
          <div className="ed-float-media"><ProjectCover art={featured.art} seed={`hero-${featured.id}`} /></div>
          <div className="ed-float-label"><span><i /> {featured.title.split(' ').slice(0, 2).join(' ')}</span><span>/AI</span></div>
        </motion.a>

        <motion.div className="ed-talk"
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 1.1 }}>
          <span className="ed-talk-label">Let's talk</span>
          <div className="ed-talk-row">
            <img src="/images/portrait.webp" alt="" width="48" height="48" />
            <div><strong>{profile.name.split(' ')[0]}</strong><small>{profile.role}</small></div>
            <Magnetic strength={0.4}>
              <a href="#contact" className="ed-talk-btn" aria-label="Go to contact"><ArrowUpRight /></a>
            </Magnetic>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
