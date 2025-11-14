import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { API_BASE_URL, STORAGE_KEYS } from './utils/constants';

const root = ReactDOM.createRoot(document.getElementById('root'));

// Dev helper: if running locally and no token present, perform a short auto-login
// This makes the dev server immediately show protected pages for demos.
async function ensureDevLogin() {
  try {
    const hasToken = !!localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (process.env.NODE_ENV === 'development' && !hasToken) {
      // Use the known demo admin credentials. Only for local dev/demo.
      const resp = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@example.com', password: 'pass123' }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.token) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
          localStorage.setItem(STORAGE_KEYS.ROLE, data.role || 'admin');
          localStorage.setItem(STORAGE_KEYS.USER_ID, data.userId || data.userId);
          localStorage.setItem(STORAGE_KEYS.USER_NAME, data.userName || 'Admin');
        }
      }
    }
  } catch (err) {
    // ignore — render app anyway
    // console.error('Auto-login failed', err);
  }
}

ensureDevLogin().finally(() => {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
