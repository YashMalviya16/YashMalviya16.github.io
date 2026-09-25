import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { profile } from '../data.js';
import { GitHub, LinkedIn } from './Icons.jsx';
import Magnetic from './Magnetic.jsx';
import { ease } from './Reveal.jsx';

function LocalTime() {
  const fmt = () =>
    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York' });
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 15000);
    return () => clearInterval(id);
  }, []);
  return <span>{time} ET</span>;
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <motion.div
          className="footer-name"
          aria-hidden="true"
          initial={{ y: '40%', opacity: 0 }}
          whileInView={{ y: '0%', opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease }}
        >
          {profile.name}
        </motion.div>
        <div className="footer-row">
          <p>© {new Date().getFullYear()} {profile.name} · <LocalTime /></p>
          <div className="hero-social">
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
            <Magnetic strength={0.5}>
              <a className="icon-link" href="#top" aria-label="Back to top">↑</a>
            </Magnetic>
          </div>
        </div>
      </div>
    </footer>
  );
}
