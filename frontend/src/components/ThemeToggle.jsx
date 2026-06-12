import React, { useEffect, useState } from 'react';

// Reads saved theme or defaults to 'auto'
function getInitialTheme() {
  try {
    return localStorage.getItem('ep-theme') || 'auto';
  } catch {
    return 'auto';
  }
}

function applyTheme(theme) {
  const html = document.documentElement;
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    html.setAttribute('data-theme', theme);
  }
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
    try { localStorage.setItem('ep-theme', theme); } catch {}

    // For 'auto', also listen to system changes
    if (theme === 'auto') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('auto');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  const options = [
    { value: 'light', label: '☀️ Light' },
    { value: 'dark',  label: '🌙 Dark'  },
    { value: 'auto',  label: '⚙️ Auto'  },
  ];

  return (
    <select
      className="theme-selector"
      value={theme}
      onChange={e => setTheme(e.target.value)}
      aria-label="Theme Selector"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}
