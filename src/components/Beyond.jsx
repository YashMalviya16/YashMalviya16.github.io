import { motion } from 'motion/react';
import { leadership } from '../data.js';
import Reveal, { SplitHeading, ease } from './Reveal.jsx';

// Leadership, community and side practice, as full-width rows with an accent sweep on hover.
export default function Beyond() {
  return (
    <section id="beyond">
      <div className="container">
        <div className="section-head">
          <Reveal as="span" className="eyebrow">Leadership & beyond</Reveal>
          <SplitHeading text="Outside the notebook." />
        </div>

        <ol className="beyond-list">
          {leadership.map((item, i) => (
            <motion.li
              key={item.role + item.org}
              className="beyond-row"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, ease, delay: i * 0.06 }}
            >
              <span className="beyond-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="beyond-main">
                <h3>{item.role}</h3>
                <p className="beyond-org">{item.org}</p>
                {item.detail && <p className="beyond-detail">{item.detail}</p>}
              </div>
              <span className="beyond-when">{item.when}</span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
