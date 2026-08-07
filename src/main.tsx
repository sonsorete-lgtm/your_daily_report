import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Force a clean module graph on reload — avoids stale HMR hook-count
// mismatches after changes to custom hooks.
if (import.meta.hot) import.meta.hot.invalidate();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
