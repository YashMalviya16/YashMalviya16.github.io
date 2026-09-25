import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { education, experience } from '../data.js';
import Reveal, { SplitHeading, ease } from './Reveal.jsx';

// Vertical timeline whose accent line "draws" itself as you scroll through it.
function Timeline({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.6'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <ol className="timeline" ref={ref}>
      <motion.span className="timeline-progress" style={{ scaleY }} aria-hidden="true" />
      {children}
    </ol>
  );
}

const item = {
  initial: { opacity: 0, x: -24 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.7, ease },
};

export default function Experience() {
  return (
    <section id="experience" className="alt">
      <div className="container">
        <div className="section-head">
          <Reveal as="span" className="eyebrow">Experience</Reveal>
          <SplitHeading text="Where I've worked and studied." />
        </div>

        <div className="timeline-cols">
          <div>
            <h3 className="col-title">Work</h3>
            <Timeline>
              {experience.map((job) => (
                <motion.li className="tl-item" key={job.role + job.org} {...item}>
                  <span className="tl-dot" aria-hidden="true" />
                  <span className="tl-period">{job.period}</span>
                  <h4>{job.role}</h4>
                  <div className="tl-org">{job.org}</div>
                  <ul>
                    {job.points.map((p) => <li key={p}>{p}</li>)}
                  </ul>
                </motion.li>
              ))}
            </Timeline>
          </div>

          <div>
            <h3 className="col-title">Education</h3>
            <Timeline>
              {education.map((ed) => (
                <motion.li className="tl-item" key={ed.degree} {...item}>
                  <span className="tl-dot" aria-hidden="true" />
                  <span className="tl-period">{ed.period}</span>
                  <h4>{ed.degree}</h4>
                  <div className="tl-org">{ed.school}</div>
                  <p className="tl-detail">{ed.detail}</p>
                </motion.li>
              ))}
            </Timeline>
          </div>
        </div>
      </div>
    </section>
  );
}
