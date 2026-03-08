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
  const { theme } = useTheme();

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
  return (
    <div style={{
      maxWidth: 430,
      margin: '0 auto',
      minHeight: '100vh',
      background: theme.bg,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      position: 'relative',
      transition: 'background 0.3s ease',
    }}>
      <AppRouter />
    </div>
  );
}
