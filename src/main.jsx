import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Two designs live side by side while you choose:
//   /            -> editorial version (light + orange)
//   /?v=classic  -> dark neural-network version
const classic = new URLSearchParams(location.search).get('v') === 'classic';

const load = classic
  ? () => Promise.all([import('./App.jsx'), import('./styles.css')])
  : () => Promise.all([import('./editorial/App.jsx')]);

load().then(([{ default: App }]) => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
