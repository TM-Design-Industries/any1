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
  const [splashDone, setSplashDone] = useState(false);
  const [hasUser, setHasUser] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('any1_user');
    setHasUser(!!stored);
    setReady(true);
  }, []);

  const handleSplashDone = () => {
    setSplashDone(true);
  };

  if (!ready) return null;

  // Always show splash on every load/refresh
  if (!splashDone) {
    return <Splash onDone={handleSplashDone} />;
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
        background: '#221E1A',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        position: 'relative',
      }}>
        <AppRouter />
      </div>
    </BrowserRouter>
  );
}

