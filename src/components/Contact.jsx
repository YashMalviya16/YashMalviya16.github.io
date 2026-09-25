import { useState } from 'react';
import { profile } from '../data.js';
import { GitHub, LinkedIn, Mail, Phone, Pin } from './Icons.jsx';
import Magnetic from './Magnetic.jsx';
import Reveal, { SplitHeading } from './Reveal.jsx';

export default function Contact() {
  const [status, setStatus] = useState({ state: 'idle', msg: '' });

  async function onSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (data.botcheck) return;

    if (!profile.web3formsKey) {
      // No form service configured: hand the message to the visitor's email app.
      const subject = encodeURIComponent(`Portfolio enquiry from ${data.name}`);
      const body = encodeURIComponent(`${data.message}\n\n${data.name}\n${data.email}`);
      window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
      setStatus({ state: 'ok', msg: 'Your email app should open with the message ready to send.' });
      return;
    }

    setStatus({ state: 'sending', msg: 'Sending…' });
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, access_key: profile.web3formsKey, subject: `Portfolio enquiry from ${data.name}` }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      form.reset();
      setStatus({ state: 'ok', msg: 'Thanks! Your message has been sent. I will reply soon.' });
    } catch {
      setStatus({ state: 'err', msg: `Something went wrong. Please email me directly at ${profile.email}.` });
    }
  }

  const items = [
    { icon: <Mail />, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: <LinkedIn />, label: 'LinkedIn', value: 'yash-malviya', href: profile.links.linkedin },
    { icon: <GitHub />, label: 'GitHub', value: 'YashMalviya16', href: profile.links.github },
    profile.showPhone && { icon: <Phone />, label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/[^\d+]/g, '')}` },
    { icon: <Pin />, label: 'Based in', value: profile.location },
  ].filter(Boolean);

  return (
    <section id="contact" className="alt">
      <div className="container">
        <Reveal as="span" className="eyebrow">Contact</Reveal>
        <SplitHeading as="h2" className="mega" text="Let's talk." />
        <Reveal className="mega-cta" delay={0.2}>
          <Magnetic strength={0.25}>
            <a className="btn btn-primary btn-xl" href={`mailto:${profile.email}`} data-cursor="Email">
              <Mail /> {profile.email}
            </a>
          </Magnetic>
        </Reveal>
      </div>
      <div className="container contact-grid">
        <Reveal>
          <p className="lead">Applied AI in the public sector, research collaborations, speaking or judging: I'd love to hear from you. The fastest way to reach me is email or LinkedIn.</p>

          <ul className="contact-list">
            {items.map((it) => {
              const inner = (
                <>
                  {it.icon}
                  <span><small>{it.label}</small>{it.value}</span>
                </>
              );
              const external = it.href?.startsWith('http');
              return (
                <li key={it.label}>
                  {it.href
                    ? <a href={it.href} {...(external && { target: '_blank', rel: 'noopener' })}>{inner}</a>
                    : <div>{inner}</div>}
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={0.1}>
          <form className="form" onSubmit={onSubmit}>
            <div className="form-row">
              <div className="field">
                <label htmlFor="name">Name</label>
                <input id="name" name="name" autoComplete="name" required minLength={2} />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </div>
            </div>
            <div className="field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required minLength={10} />
            </div>
            <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <div>
              <button className="btn btn-primary" type="submit" disabled={status.state === 'sending'}>
                Send message
              </button>
            </div>
            <p className={`form-status ${status.state}`} role="status" aria-live="polite">{status.msg}</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
