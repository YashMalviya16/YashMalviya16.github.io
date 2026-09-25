import { profile } from '../data.js';
import { GitHub, LinkedIn } from './Icons.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <div className="hero-social">
          <a className="icon-link" href={profile.links.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn">
            <LinkedIn />
          </a>
          <a className="icon-link" href={profile.links.github} target="_blank" rel="noopener" aria-label="GitHub">
            <GitHub />
          </a>
        </div>
      </div>
    </footer>
  );
}
