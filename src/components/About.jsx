import { motion } from 'motion/react';
import { about } from '../data.js';
import Reveal, { fadeUp, stagger } from './Reveal.jsx';

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">About</span>
          <h2>Turning messy data into models and decisions.</h2>
        </Reveal>

        <div className="about-grid">
          <Reveal className="about-bio">
            {about.bio.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}

            <div className="stats">
              {about.stats.map((s) => (
                <div className="stat" key={s.label}>
                  <strong>{s.value}</strong>
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
            {about.skills.map((g) => (
              <motion.div key={g.group} variants={fadeUp}>
                <h3>{g.group}</h3>
                <ul className="chips">
                  {g.items.map((s) => <li className="chip" key={s}>{s}</li>)}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
