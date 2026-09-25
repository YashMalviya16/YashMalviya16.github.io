import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { projects } from '../data.js';
import { Close, External, GitHub } from './Icons.jsx';
import Reveal, { ease } from './Reveal.jsx';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI / ML' },
  { id: 'bi', label: 'BI / Analytics' },
];
const KIND = { ai: 'AI / ML', bi: 'BI / Analytics' };

function ProjectModal({ project, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return (
    <motion.div
      className="modal-backdrop"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.35, ease }}
      >
        <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close project details">
          <Close />
        </button>
        <div className="modal-media">
          <img src={project.image} alt="" width="960" height="540" />
        </div>
        <div className="modal-body">
          <span className="card-kind">{KIND[project.category]}</span>
          <h3 id="modal-title">{project.title}</h3>
          <p>{project.summary}</p>
          <ul>
            {project.details.map((d) => <li key={d}>{d}</li>)}
          </ul>
          <ul className="chips" aria-label="Tools">
            {project.tags.map((t) => <li className="chip" key={t}>{t}</li>)}
          </ul>
          <div className="modal-actions">
            {project.link ? (
              <a className="btn btn-primary" href={project.link} target="_blank" rel="noopener">
                <GitHub /> View on GitHub <External />
              </a>
            ) : (
              project.linkLabel && <span className="muted-note">{project.linkLabel}. Access available on request.</span>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState(null);
  const close = useCallback(() => setOpenId(null), []);
  const shown = projects.filter((p) => filter === 'all' || p.category === filter);
  const openProject = projects.find((p) => p.id === openId);

  return (
    <section id="projects">
      <div className="container">
        <div className="projects-top">
          <Reveal className="section-head">
            <span className="eyebrow">Projects</span>
            <h2>Selected work.</h2>
            <p className="lead">Research, machine learning and analytics projects. Select a project to see the details.</p>
          </Reveal>

          <Reveal className="filters" role="group" aria-label="Filter projects">
            {FILTERS.map((f) => (
              <button key={f.id} aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {filter === f.id && (
                  <motion.span layoutId="filter-pill" className="filter-pill" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />
                )}
                <span>{f.label}</span>
              </button>
            ))}
          </Reveal>
        </div>

        <motion.div className="project-grid" layout>
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <motion.article
                key={p.id}
                layout
                className="card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.5, ease, delay: (i % 3) * 0.06 }}
              >
                <div className="card-media">
                  <img src={p.image} alt="" width="960" height="600" loading="lazy" decoding="async" />
                </div>
                <div className="card-body">
                  <span className="card-kind">{KIND[p.category]}</span>
                  <h3>
                    <button className="card-link" onClick={() => setOpenId(p.id)} aria-haspopup="dialog">
                      {p.title}
                    </button>
                  </h3>
                  <p>{p.summary}</p>
                  <ul className="chips">
                    {p.tags.slice(0, 3).map((t) => <li className="chip" key={t}>{t}</li>)}
                  </ul>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <AnimatePresence>
        {openProject && <ProjectModal project={openProject} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
