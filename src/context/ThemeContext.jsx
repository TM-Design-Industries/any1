import { createContext, useContext, useState, useEffect } from 'react';

// Stone palette - desaturated, earthy, derived from two anchor colors:
// Dark anchor: #1E1C19 (very dark warm stone)
// Light anchor: #E8E6E3 (light stone, not pure white)
// Accent: #C4A24A (muted gold-beige)

export const DARK = {
  bg:       '#1E1C19',
  surface:  '#272420',
  surface2: '#2D2A25',
  text:     '#EDE9E3',
  text2:    '#C4BDB4',
  muted:    '#7A7168',
  border:   '#302C27',
  border2:  '#3D3830',
  accent:   '#C4A24A',
  up:       '#5E8A63',
  down:     '#A84E45',
  navBg:    'rgba(30,28,25,0.97)',
};

export const LIGHT = {
  bg:       '#E8E6E3',
  surface:  '#DDDAD6',
  surface2: '#D3D0CB',
  text:     '#1E1C19',
  text2:    '#3B3730',
  muted:    '#6B6560',
  border:   '#C4C0BA',
  border2:  '#B4AFA8',
  accent:   '#9A7A28',
  up:       '#3A6B3E',
  down:     '#8B3B32',
  navBg:    'rgba(232,230,227,0.97)',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try { return localStorage.getItem('any1_theme') || 'dark'; } catch { return 'dark'; }
  });

  const theme = mode === 'dark' ? DARK : LIGHT;

  useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.color = theme.text;
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    // Force re-paint on root
    const root = document.getElementById('root');
    if (root) root.style.background = theme.bg;
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
    // fallback to dark if used outside provider
    return { theme: DARK, mode: 'dark', toggleTheme: () => {} };
  }
  return ctx;
}
