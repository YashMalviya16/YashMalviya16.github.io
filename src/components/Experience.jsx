import { motion } from 'motion/react';
import { education, experience } from '../data.js';
import Reveal, { fadeUp, stagger } from './Reveal.jsx';

function Timeline({ children }) {
  return (
    <motion.ol
      className="timeline"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={stagger}
    >
      {children}
    </motion.ol>
  );
}

export default function Experience() {
  return (
    <section id="experience" className="alt">
      <div className="container">
        <Reveal className="section-head">
          <span className="eyebrow">Experience</span>
          <h2>Where I've worked and studied.</h2>
        </Reveal>

        <div className="timeline-cols">
          <div>
            <h3 className="col-title">Work</h3>
            <Timeline>
              {experience.map((job) => (
                <motion.li className="tl-item" key={job.role + job.org} variants={fadeUp}>
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
                <motion.li className="tl-item" key={ed.degree} variants={fadeUp}>
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
