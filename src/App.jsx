import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { about } from './data.js';
import { startSmoothScroll } from './lib/smoothScroll.js';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import About from './components/About.jsx';
import Experience from './components/Experience.jsx';
import Projects from './components/Projects.jsx';
import Beyond from './components/Beyond.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import Cursor from './components/Cursor.jsx';
import Preloader, { shouldShowPreloader } from './components/Preloader.jsx';

const skills = about.skills.flatMap((g) => g.items);

export default function App() {
  const [loading, setLoading] = useState(shouldShowPreloader);
  const done = useCallback(() => setLoading(false), []);

  useEffect(() => startSmoothScroll(), []);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{loading && <Preloader key="preloader" onDone={done} />}</AnimatePresence>
      <Cursor />
      <div className="grain" aria-hidden="true" />
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar ready={!loading} />
      <main id="main">
        <Hero ready={!loading} />
        <Marquee items={skills} />
        <About />
        <Experience />
        <Projects />
        <Beyond />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
