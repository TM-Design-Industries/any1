import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const DARK = {
  bg:       '#221E1A',
  surface:  '#2A2520',
  surface2: '#1A1612',
  border:   '#2A2520',
  border2:  '#3E3528',
  text:     '#F2EDE6',
  text2:    '#B5A898',
  muted:    '#7A6E62',
  accent:   '#C9A84C',
  up:       '#7A9E7E',
  down:     '#C0564A',
  navBg:    '#1A1612F0',
  headerBg: '#221E1A',
  inputBg:  '#1A1612',
  cardBg:   '#2A2520',
  isDark:   true,
};

export const LIGHT = {
  bg:       '#F0EDEA',
  surface:  '#E3E2E1',
  surface2: '#F5F3F1',
  border:   '#D4D0CB',
  border2:  '#C8C3BC',
  text:     '#2A2218',
  text2:    '#5A4E44',
  muted:    '#8C7E72',
  accent:   '#C9A84C',
  up:       '#4A7A4E',
  down:     '#A03428',
  navBg:    '#E3E2E1F0',
  headerBg: '#F0EDEA',
  inputBg:  '#E3E2E1',
  cardBg:   '#E3E2E1',
  isDark:   false,
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('any1_theme');
    return saved ? saved === 'dark' : true;
  });

  const theme = isDark ? DARK : LIGHT;

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem('any1_theme', next ? 'dark' : 'light');
  };

  // Apply bg to body
  useEffect(() => {
    document.body.style.background = theme.bg;
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
