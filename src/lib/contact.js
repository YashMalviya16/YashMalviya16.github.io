import { profile } from '../data.js';

// Sends a contact-form message. With a Web3Forms key it posts directly; without one it opens the
// visitor's email app with the message filled in. Returns { ok, msg }.
export async function submitContact({ name, email, message, botcheck }) {
  if (botcheck) return { ok: true, msg: '' };

  if (!profile.web3formsKey) {
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n${name}\n${email}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    return { ok: true, msg: 'Your email app should open with the message ready to send.' };
  }

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name, email, message, access_key: profile.web3formsKey, subject: `Portfolio enquiry from ${name}` }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return { ok: true, msg: 'Thanks! Your message has been sent. I will reply soon.' };
  } catch {
    return { ok: false, msg: `Something went wrong. Please email me directly at ${profile.email}.` };
  }
}
