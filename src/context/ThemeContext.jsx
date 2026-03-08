import { createContext, useContext, useState, useEffect } from 'react';

const DARK = {
  bg: '#1C1A18', surface: '#252220', surface2: '#2A2520',
  text: '#F2EDE6', text2: '#C8BFB4', muted: '#7A6E62',
  border: '#2E2A24', border2: '#3E3528',
  accent: '#C9A84C', up: '#6B9470', down: '#B85449',
  navBg: 'rgba(26,22,18,0.96)',
};

const LIGHT = {
  bg: '#E3E2E1', surface: '#D8D6D4', surface2: '#CECCC9',
  text: '#1C1A18', text2: '#3A3530', muted: '#6B6560',
  border: '#C8C5C0', border2: '#B8B4AE',
  accent: '#9E7A28', up: '#3D6B42', down: '#8B3B32',
  navBg: 'rgba(227,226,225,0.96)',
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => localStorage.getItem('any1_theme') || 'dark');
  const theme = mode === 'dark' ? DARK : LIGHT;

  useEffect(() => {
    document.body.style.background = theme.bg;
    document.body.style.margin = '0';
    document.body.style.padding = '0';
  }, [theme]);

  const toggleTheme = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    localStorage.setItem('any1_theme', next);
  };

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
