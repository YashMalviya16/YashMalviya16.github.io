import { motion } from 'motion/react';
import { about } from '../data.js';
import Reveal, { fadeUp, stagger } from './Reveal.jsx';
import { Counter, ScrollText } from './ScrollText.jsx';

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <Reveal as="span" className="eyebrow">About</Reveal>
        <ScrollText text={about.statement} className="statement" />

        <div className="about-grid">
          <Reveal className="about-bio">
            {about.bio.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}

            <div className="stats">
              {about.stats.map((s) => (
                <div className="stat" key={s.label}>
                  <Counter value={s.value} />
                  <span>{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <motion.div
            className="skills"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
          >
            {about.skills.map((g, gi) => (
              <motion.div key={g.group} variants={fadeUp}>
                <h3><span className="skill-index">0{gi + 1}</span>{g.group}</h3>
                <motion.ul className="chips" variants={stagger}>
                  {g.items.map((s) => (
                    <motion.li
                      className="chip"
                      key={s}
                      variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
                      whileHover={{ y: -3 }}
                    >
                      {s}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
