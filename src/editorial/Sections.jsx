import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView, useScroll, useTransform } from 'motion/react';
import { about, achievements, experience, education, kpis, organizations, process, profile } from '../data.js';
import { submitContact } from '../lib/contact.js';
import { lockScroll } from '../lib/smoothScroll.js';
import { ArrowUpRight, BlurHeading, ease, FadeUp, glyphs, Pill, Plus } from './ui.jsx';

/* ---------- organisations strip ---------- */
export function Orgs() {
  const row = organizations.map((o) => <span key={o} className="ed-org">{o}</span>);
  return (
    <div className="ed-orgs">
      <div className="ed-wrap ed-orgs-row">
        <p className="ed-orgs-label">Experience<br />across</p>
        <div className="ed-orgs-marquee" aria-label={organizations.join(', ')}>
          <div className="ed-orgs-track" aria-hidden="true">{row}{row}</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- intro / about ---------- */
export function Intro() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const spin = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const imgY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const photoY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  return (
    <section id="about" className="ed-section" ref={ref}>
      <div className="ed-wrap">
        <div className="ed-intro-top">
          <div>
            <Pill>Applied AI, done right</Pill>
            <BlurHeading text="My impact through|applied AI" />
          </div>
          <motion.span className="ed-asterisk" style={{ rotate: spin }} aria-hidden="true">{glyphs[1]}</motion.span>
          <motion.div className="ed-intro-img" style={{ y: imgY }}>
            <img src="/images/synthetic-ehr.webp" alt="" loading="lazy" />
          </motion.div>
        </div>

        <div className="ed-intro-grid">
          <motion.div className="ed-intro-photo" style={{ y: photoY }}>
            <img src="/images/portrait.webp" alt={profile.name} loading="lazy" />
          </motion.div>
          <div>
            <FadeUp as="p" className="ed-intro-lead">
              Hi, I'm {profile.name.split(' ')[0]}, a {profile.role} at the {profile.org}. {about.statement}
            </FadeUp>
            {about.bio.map((b, i) => <FadeUp as="p" className="ed-intro-body" key={i} delay={0.1 + i * 0.1}>{b}</FadeUp>)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- impact in numbers ---------- */

// Counts up to values like '$1.2M', '35K', '99.89%', '<2%' the first time they scroll into view.
function KpiValue({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const m = String(value).match(/^([^\d]*)([\d.,]+)(.*)$/);
  const target = m ? parseFloat(m[2].replace(/,/g, '')) : 0;
  const decimals = m && m[2].includes('.') ? m[2].split('.')[1].length : 0;
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || !m) return;
    const c = animate(0, target, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: setN });
    return () => c.stop();
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <strong ref={ref}>
      {m ? <>{m[1]}{n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{m[3]}</> : value}
    </strong>
  );
}

export function Kpis() {
  return (
    <section id="impact" className="ed-section ed-kpi-section">
      <div className="ed-wrap">
        <div className="ed-split-head">
          <div>
            <Pill>Impact</Pill>
            <BlurHeading text="Impact in|numbers" />
          </div>
          <FadeUp as="p" className="ed-muted">Measured results from production AI, research and analytics work, 2021 to today.</FadeUp>
        </div>

        <div className="ed-kpis">
          {kpis.map((k, i) => (
            <motion.article
              key={k.label}
              className={`ed-kpi ${k.featured ? 'is-featured' : ''}`}
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, ease, delay: (i % 4) * 0.08 }}
              whileHover={{ y: -6 }}
            >
              <span className="ed-kpi-label"><i aria-hidden="true" /> {k.label}</span>
              <KpiValue value={k.value} />
              <p className="ed-kpi-context">{k.context}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- process ---------- */
export function Process() {
  return (
    <section className="ed-section">
      <div className="ed-wrap is-center">
        <Pill>How I work</Pill>
        <BlurHeading text="A process|that ships" center />
        <div className="ed-process">
          {process.map((step, i) => (
            <motion.article
              key={step.title}
              className="ed-process-card"
              initial={{ opacity: 0, y: 60, rotate: i % 2 ? 3 : -3 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.9, ease, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <span className="ed-glyph">{glyphs[i]}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
              <span className="ed-process-num">0{i + 1}</span>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- experience (service-style rows with organisation photos) ---------- */

// Your photo of the organisation, drifting inside its frame as you scroll; an orange name tile until you add one.
function OrgPhoto({ photo, short, alt }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <div className="ed-org-photo" ref={ref}>
      {photo ? (
        <motion.img src={photo} alt={alt} loading="lazy" style={{ y, scale: 1.18 }} />
      ) : (
        <div className="ed-org-tile" aria-hidden="true">
          <span>{short}</span>
        </div>
      )}
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="ed-section">
      <div className="ed-wrap">
        <div className="ed-split-head">
          <div>
            <Pill>Experience</Pill>
            <BlurHeading text="Where I've|built things" />
          </div>
          <FadeUp as="p" className="ed-muted">From retail forecasting to public-sector AI: five years of taking data work into production.</FadeUp>
        </div>

        <ol className="ed-rows">
          {experience.map((job, i) => (
            <motion.li key={job.role + job.org} className="ed-row"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease }}>
              <span className="ed-row-num">{String(i + 1).padStart(3, '0')}</span>
              <div className="ed-row-main">
                <span className="ed-row-period">{job.period}</span>
                <h3 className={i === 0 ? 'is-accent' : undefined}>{job.role}</h3>
                <p className="ed-row-org">{job.org}</p>
                <ul className="ed-tags">{job.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
              </div>
              <OrgPhoto photo={job.photo} short={job.short} alt={job.org} />
            </motion.li>
          ))}
          {education.map((ed, i) => (
            <motion.li key={ed.degree} className="ed-row is-edu"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease }}>
              <span className="ed-row-num">{String(experience.length + i + 1).padStart(3, '0')}</span>
              <div className="ed-row-main">
                <span className="ed-row-period">{ed.period}</span>
                <h3>{ed.degree}</h3>
                <p className="ed-row-org">{ed.school} · {ed.detail}</p>
              </div>
              <OrgPhoto photo={ed.photo} short={ed.short} alt={ed.school} />
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- achievements (dark) ---------- */

// Full-size photo viewer for the highlights.
function Lightbox({ item, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const prev = document.activeElement;
    closeRef.current?.focus();
    lockScroll(true);
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener('keydown', onKey);
      prev?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <motion.div className="ed-lightbox" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose} data-lenis-prevent
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.figure onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease }}>
        <img src={item.photo} alt={item.caption || item.title} />
        <figcaption>
          <strong>{item.title}</strong> · {item.meta}{item.year && ` · ${item.year}`}
          {item.caption && <span>{item.caption}</span>}
        </figcaption>
      </motion.figure>
      <button ref={closeRef} className="ed-modal-close" onClick={onClose} aria-label="Close photo"><Plus /></button>
    </motion.div>
  );
}

export function Achievements() {
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  return (
    <section className="ed-section ed-dark">
      <div className="ed-wrap">
        <div className="ed-ach-head">
          <Pill dark>Honors & community</Pill>
          <BlurHeading text={`${profile.name.split(' ')[0]}'s|highlights`} />
        </div>
        <div className="ed-ach-grid">
          {achievements.map((a, i) => (
            <motion.article key={a.title} className="ed-ach"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.8, ease, delay: (i % 2) * 0.1 }}>
              {a.photo ? (
                <button className="ed-ach-tile has-photo" onClick={() => setOpen(a)} aria-label={`View photo: ${a.title}`}>
                  <img src={a.photo} alt="" loading="lazy" style={{ objectPosition: a.focus }} />
                  <span className="ed-ach-view" aria-hidden="true">View <ArrowUpRight /></span>
                </button>
              ) : (
                <div className="ed-ach-tile">
                  <motion.span className="ed-glyph" whileHover={{ rotate: 90 }} transition={{ duration: 0.5, ease }}>{glyphs[i % glyphs.length]}</motion.span>
                </div>
              )}
              <div className="ed-ach-body">
                <h3>{a.title}</h3>
                <dl>
                  <div><dt>{a.kind}</dt><dd>{a.meta}</dd></div>
                  {a.year && <div><dt>Year</dt><dd>{a.year}</dd></div>}
                </dl>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
      <AnimatePresence>{open && <Lightbox item={open} onClose={close} />}</AnimatePresence>
    </section>
  );
}

/* ---------- toolkit (pricing-style) ---------- */
export function Toolkit() {
  const [tab, setTab] = useState(0);
  const group = about.skills[tab];

  return (
    <section className="ed-section">
      <div className="ed-wrap">
        <div className="ed-split-head">
          <div>
            <Pill>Toolkit</Pill>
            <BlurHeading text="Tools for|every stage" />
          </div>
        </div>

        <div className="ed-toolkit">
          <div className="ed-tool-list" role="tablist" aria-label="Skill groups">
            <span className="ed-tool-list-head">Capabilities</span>
            {about.skills.map((g, i) => (
              <button key={g.group} role="tab" aria-selected={tab === i} onClick={() => setTab(i)}>
                <span>{g.group}</span>
                <small>{g.items.length}</small>
              </button>
            ))}
          </div>

          <div className="ed-tool-card" role="tabpanel" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={group.group} className="ed-tool-inner"
                initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(8px)' }} transition={{ duration: 0.45, ease }}>
                <div>
                  <span className="ed-pill is-dark"><i /> {group.group}</span>
                  <p className="ed-tool-count"><strong>{group.items.length}</strong> tools</p>
                  <p className="ed-tool-note">Pick a capability on the left to see what I reach for.</p>
                  <a href="#contact" className="ed-btn is-accent">Work with me <ArrowUpRight /></a>
                </div>
                <ul className="ed-checklist">
                  {group.items.map((it, i) => (
                    <motion.li key={it} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.04 }}>
                      {it}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- contact ---------- */
export function Contact() {
  const [status, setStatus] = useState({ state: 'idle', msg: '' });

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ state: 'sending', msg: 'Sending…' });
    const res = await submitContact(Object.fromEntries(new FormData(form)));
    if (res.ok && profile.web3formsKey) form.reset();
    setStatus({ state: res.ok ? 'ok' : 'err', msg: res.msg });
  }

  return (
    <section id="contact" className="ed-section">
      <div className="ed-wrap">
        <FadeUp className="ed-contact">
          <div className="ed-contact-bg" aria-hidden="true"><i /><i /><i /></div>
          <form className="ed-form" onSubmit={onSubmit}>
            <p className="ed-form-logo">{profile.name}<sup>●</sup></p>
            <p className="ed-form-title">Reach out to me</p>
            <label>Name<input name="name" autoComplete="name" required minLength={2} placeholder="Jane Smith" /></label>
            <label>Email<input name="email" type="email" autoComplete="email" required placeholder="jane@company.com" /></label>
            <label>Message<textarea name="message" required minLength={10} placeholder="Tell me about your project" /></label>
            <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <button className="ed-btn is-accent is-block" type="submit" disabled={status.state === 'sending'}>Submit</button>
            <p className={`ed-form-status ${status.state}`} role="status" aria-live="polite">{status.msg}</p>
          </form>
          <div className="ed-contact-copy">
            <span className="ed-pill is-glass"><i /> Contact</span>
            <BlurHeading text="Let's build|together" className="is-light" />
            <p>Applied AI in the public sector, research collaborations, speaking or judging: I'd love to hear from you.</p>
            <a href={`mailto:${profile.email}`} className="ed-contact-mail">{profile.email} <ArrowUpRight /></a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------- footer ---------- */
export function Footer() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const y = useTransform(scrollYProgress, [0, 1], ['60%', '0%']);

  return (
    <footer className="ed-footer" ref={ref}>
      <div className="ed-wrap">
        <div className="ed-footer-top">
          <p className="ed-footer-pitch">
            Focused on building AI that is reliable, governed and genuinely useful, to <strong>help public services work better</strong> for the people who rely on them.
          </p>
          <div className="ed-footer-contact">
            {profile.showPhone && <small>{profile.phone}</small>}
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </div>
        </div>

        <div className="ed-footer-bottom">
          <div className="ed-footer-cols">
            <div>
              <small>Navigation</small>
              <a href="#top">Home</a><a href="#about">About</a><a href="#experience">Experience</a><a href="#work">Work</a><a href="#contact">Contact</a>
            </div>
            <div>
              <small>Elsewhere</small>
              <a href={profile.links.linkedin} target="_blank" rel="noopener">LinkedIn <ArrowUpRight /></a>
              <a href={profile.links.github} target="_blank" rel="noopener">GitHub <ArrowUpRight /></a>
              <a href={profile.resume} target="_blank" rel="noopener">Résumé <ArrowUpRight /></a>
            </div>
          </div>
          <div className="ed-footer-name-wrap" aria-hidden="true">
            <motion.div className="ed-footer-name" style={{ y }}>{profile.name}<sup>●</sup></motion.div>
          </div>
        </div>
        <p className="ed-copy">© {new Date().getFullYear()} {profile.name}. Built with React & Motion.</p>
      </div>
    </footer>
  );
}
