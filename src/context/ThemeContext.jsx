import { createContext, useContext, useState, useEffect } from 'react';

// Stone palette - derived from two anchor colors:
// Dark anchor:  #1A1816 (very dark warm stone / charcoal-brown)
// Light anchor: #E6E3DE (warm stone, off-white)
// Accent: #BFA24A (muted gold-beige, not too loud)

export const DARK = {
  bg:       '#1A1816',
  surface:  '#232019',
  surface2: '#2A261F',
  text:     '#EAE6DF',
  text2:    '#B8B0A5',
  muted:    '#6E6860',
  border:   '#2D2924',
  border2:  '#38332C',
  accent:   '#BFA24A',
  up:       '#5A8560',
  down:     '#A34840',
  navBg:    'rgba(26,24,22,0.97)',
};

export const LIGHT = {
  bg:       '#E6E3DE',
  surface:  '#DAD7D1',
  surface2: '#CECBC4',
  text:     '#1A1816',
  text2:    '#3A3630',
  muted:    '#66605A',
  border:   '#C0BDB6',
  border2:  '#AEAAA2',
  accent:   '#8F7020',
  up:       '#3A6840',
  down:     '#883530',
  navBg:    'rgba(230,227,222,0.97)',
};

const ThemeContext = createContext(null);

function applyThemeVars(theme) {
  const root = document.documentElement;
  Object.entries(theme).forEach(([key, val]) => {
    if (typeof val === 'string') {
      root.style.setProperty(`--t-${key}`, val);
    }
  });
}

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('any1_theme') || 'dark'; } catch { return 'dark'; }
  });

  const theme = mode === 'dark' ? DARK : LIGHT;

  useEffect(() => {
    // Apply CSS variables to root for global coverage
    applyThemeVars(theme);
    // Also set body/root background
    document.body.style.background = theme.bg;
    document.body.style.color = theme.text;
    document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    const root = document.getElementById('root');
    if (root) {
      root.style.background = theme.bg;
      root.style.transition = 'background 0.3s ease';
    }
  }, [theme, mode]);

  const toggleTheme = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    try { localStorage.setItem('any1_theme', next); } catch {}
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { theme: DARK, mode: 'dark', toggleTheme: () => {} };
  }
  return ctx;
}