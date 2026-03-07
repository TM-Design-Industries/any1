import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
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

function AppRouter() {
  const [splashDone, setSplashDone] = useState(() => {
    return !!sessionStorage.getItem('any1_splash');
  });
  const [hasUser, setHasUser] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('any1_user');
    setHasUser(!!stored);
    setReady(true);
  }, []);

  const handleSplashDone = () => {
    sessionStorage.setItem('any1_splash', '1');
    setSplashDone(true);
  };

  if (!ready) return null;

  // Show splash once per session (only for new users or first visit)
  if (!splashDone && !hasUser) {
    return <Splash onDone={handleSplashDone} />;
  }

  if (!hasUser) {
    return (
      <Routes>
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<Onboarding />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/" element={<Home />} />
      <Route path="/discover" element={<Discover />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/user/:id" element={<UserPage />} />
      <Route path="/portfolio/:id" element={<UserPortfolio />} />
      <Route path="/missions" element={<Missions />} />
      <Route path="/chat/:id" element={<Chat />} />
      <Route path="/market" element={<Market />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{
        maxWidth: 430,
        margin: '0 auto',
        minHeight: '100vh',
        background: '#0A0A0A',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        position: 'relative',
      }}>
        <AppRouter />
      </div>
    </BrowserRouter>
  );
}
