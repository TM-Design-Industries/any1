import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Portfolio from './pages/Portfolio';
import Profile from './pages/Profile';
import UserPage from './pages/UserPage';
import UserPortfolio from './pages/UserPortfolio';
import Onboarding from './pages/Onboarding';
import Splash from './pages/Splash';
import Missions from './pages/Missions';
import Chat from './pages/Chat';
import Market from './pages/Market';
import GlobalFloating from './components/GlobalFloating';
import SettingsDrawer from './components/SettingsDrawer';

function AppRouter() {
  const [splashDone, setSplashDone] = useState(false);
  const [hasUser, setHasUser] = useState(false);
  const [ready, setReady] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('any1_user');
    setHasUser(!!stored);
    setReady(true);
  }, []);

  if (!ready) return null;

  if (!splashDone) {
    return <Splash onDone={() => setSplashDone(true)} />;
  }

  if (!hasUser) {
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<Onboarding onComplete={() => setHasUser(true)} />} />
      </Routes>
    );
  }

  return (
    <>
      <GlobalFloating />
      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Home onSettingsOpen={() => setSettingsOpen(true)} />} />
        <Route path="/discover" element={<Discover onSettingsOpen={() => setSettingsOpen(true)} />} />
        <Route path="/portfolio" element={<Portfolio onSettingsOpen={() => setSettingsOpen(true)} />} />
        <Route path="/profile" element={<Profile onSettingsOpen={() => setSettingsOpen(true)} />} />
        <Route path="/user/:id" element={<UserPage />} />
        <Route path="/portfolio/:id" element={<UserPortfolio />} />
        <Route path="/missions" element={<Missions />} />
        <Route path="/chat/:id" element={<Chat />} />
        <Route path="/market" element={<Market />} />
        <Route path="/settings" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function AppInner() {
  const { theme } = useTheme();
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 430
  );

  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const isWide = windowWidth >= 768;

  return (
    <div style={{
      minHeight: '100vh',
      background: isWide ? '#0F0E0D' : theme.bg,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{
        width: '100%',
        maxWidth: 430,
        minHeight: '100vh',
        background: theme.bg,
        position: 'relative',
        transition: 'background 0.3s ease',
        boxShadow: isWide ? '0 0 80px rgba(0,0,0,0.7)' : 'none',
      }}>
        <AppRouter />
      </div>
    </div>
  );
}