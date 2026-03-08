import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const DARK = {
  bg:       '#1C1A18',
  surface:  '#252320',
  surface2: '#161412',
  border:   '#2E2B27',
  border2:  '#3A3630',
  text:     '#EDE9E3',
  text2:    '#A89F94',
  muted:    '#706660',
  accent:   '#C2A45A',
  up:       '#6B9470',
  down:     '#B85449',
  navBg:    '#161412F0',
  headerBg: '#1C1A18',
  inputBg:  '#161412',
  cardBg:   '#252320',
  isDark:   true,
};

export const LIGHT = {
  bg:       '#F2EFE9',
  surface:  '#E8E4DC',
  surface2: '#F8F5F0',
  border:   '#D8D3C8',
  border2:  '#C9C3B6',
  text:     '#1E1C19',
  text2:    '#4A4540',
  muted:    '#847870',
  accent:   '#C2A45A',
  up:       '#4A7A50',
  down:     '#9B3E35',
  navBg:    '#E8E4DCF0',
  headerBg: '#F2EFE9',
  inputBg:  '#E8E4DC',
  cardBg:   '#E8E4DC',
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