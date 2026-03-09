import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import BottomNav from './components/BottomNav';
import {
  Home as HomeIcon, Search, PieChart, Activity, User,
  TrendingUp, Zap, Users, BarChart2, Sun, Moon
} from 'lucide-react';

// ─── PC Side Nav ──────────────────────────────────────────────────────────────
function PCNav({ onSettingsOpen }) {
  const { theme, mode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { icon: Activity, label: 'Live Feed',  path: '/' },
    { icon: Search,   label: 'Discover',   path: '/discover' },
    { icon: PieChart, label: 'Portfolio',  path: '/portfolio' },
    { icon: Users,    label: 'Missions',   path: '/missions' },
    { icon: BarChart2,label: 'Market',     path: '/market' },
    { icon: User,     label: 'Profile',    path: '/profile' },
  ];

  return (
    <div style={{
      width: 220, flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
      background: theme.surface, borderRight: `1px solid ${theme.border}`,
      display: 'flex', flexDirection: 'column', padding: '24px 12px',
      boxSizing: 'border-box',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 12px 28px', fontSize: 22, fontWeight: 900, color: theme.accent, letterSpacing: '-0.5px' }}>
        any<span style={{ color: theme.text }}>1</span>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map(({ icon: Icon, label, path }) => {
          const active = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <button key={path} onClick={() => navigate(path)} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 14px', borderRadius: 12, border: 'none',
              background: active ? `${theme.accent}18` : 'transparent',
              cursor: 'pointer', width: '100%', textAlign: 'left',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.background = `${theme.border}88`; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
            >
              <Icon size={18} color={active ? theme.accent : theme.muted} strokeWidth={active ? 2.2 : 1.6} />
              <span style={{ fontSize: 14, fontWeight: active ? 700 : 400, color: active ? theme.accent : theme.text2 }}>
                {label}
              </span>
              {active && <div style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: theme.accent }} />}
            </button>
          );
        })}
      </div>

      {/* Bottom: theme toggle + settings */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <button onClick={toggleTheme} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
          borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer', width: '100%',
        }}>
          {mode === 'dark'
            ? <Moon size={17} color={theme.muted} />
            : <Sun size={17} color={theme.muted} />}
          <span style={{ fontSize: 13, color: theme.muted }}>{mode === 'dark' ? 'Dark mode' : 'Light mode'}</span>
        </button>
        <button onClick={onSettingsOpen} style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
          borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer', width: '100%',
        }}>
          <div style={{ width: 17, height: 17, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 3 }}>
            {[0,1,2].map(i => <div key={i} style={{ height: 1.5, background: theme.muted, borderRadius: 1 }} />)}
          </div>
          <span style={{ fontSize: 13, color: theme.muted }}>Settings</span>
        </button>
      </div>
    </div>
  );
}

// ─── PC Right Panel ───────────────────────────────────────────────────────────
function PCRight() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const trending = [
    { name: 'Dovi Frances', handle: '@dovif', change: +14.2, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face' },
    { name: 'Mika Reinholt', handle: '@mikar', change: +8.7, avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&h=60&fit=crop&crop=face' },
    { name: 'Omer Shlomo', handle: '@omers', change: -3.1, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face' },
  ];

  return (
    <div style={{
      width: 260, flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
      padding: '24px 16px', boxSizing: 'border-box', overflowY: 'auto',
    }}>
      {/* Trending */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, padding: '16px', marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
          <TrendingUp size={14} color={theme.accent} /> Trending today
        </div>
        {trending.map(p => (
          <div key={p.handle} onClick={() => navigate('/discover')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', cursor: 'pointer', borderBottom: `1px solid ${theme.border}` }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
            <img src={p.avatar} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: theme.text }}>{p.name}</div>
              <div style={{ fontSize: 11, color: theme.muted }}>{p.handle}</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: p.change >= 0 ? theme.up : theme.down }}>
              {p.change >= 0 ? '+' : ''}{p.change}%
            </div>
          </div>
        ))}
      </div>

      {/* Live activity */}
      <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, padding: '16px' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Zap size={14} color={theme.accent} fill={theme.accent} /> Live
        </div>
        {['Lior backed Maya for $50', 'Oren completed a mission', 'Noa is up 6% today'].map((t, i) => (
          <div key={i} style={{ fontSize: 12, color: theme.muted, padding: '7px 0', borderBottom: i < 2 ? `1px solid ${theme.border}` : 'none' }}>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── App Router ───────────────────────────────────────────────────────────────
function AppRouter({ onSettingsOpen }) {
  const [splashDone, setSplashDone] = useState(false);
  const [hasUser, setHasUser] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('any1_user');
    setHasUser(!!stored);
    setReady(true);
  }, []);

  if (!ready) return null;
  if (!splashDone) return <Splash onDone={() => setSplashDone(true)} />;
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
      <Route path="/" element={<Home onSettingsOpen={onSettingsOpen} />} />
      <Route path="/discover" element={<Discover onSettingsOpen={onSettingsOpen} />} />
      <Route path="/portfolio" element={<Portfolio onSettingsOpen={onSettingsOpen} />} />
      <Route path="/profile" element={<Profile onSettingsOpen={onSettingsOpen} />} />
      <Route path="/user/:id" element={<UserPage />} />
      <Route path="/portfolio/:id" element={<UserPortfolio />} />
      <Route path="/missions" element={<Missions />} />
      <Route path="/chat/:id" element={<Chat />} />
      <Route path="/market" element={<Market />} />
      <Route path="/settings" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// ─── App Shell ────────────────────────────────────────────────────────────────
function AppInner() {
  const { theme } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 430
  );

  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const isPC = windowWidth >= 768;

  if (!isPC) {
    // Mobile layout: full width, bottom nav
    return (
      <div style={{ minHeight: '100vh', background: theme.bg, fontFamily: "'Inter', -apple-system, sans-serif" }}>
        <GlobalFloating />
        <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
        <AppRouter onSettingsOpen={() => setSettingsOpen(true)} />
      </div>
    );
  }

  // PC layout: sidebar + center + right panel
  return (
    <div style={{
      minHeight: '100vh',
      background: theme.bg,
      display: 'flex',
      justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <div style={{ display: 'flex', width: '100%', maxWidth: 1280, minHeight: '100vh' }}>
        {/* Left sidebar */}
        <PCNav onSettingsOpen={() => setSettingsOpen(true)} />

        {/* Center content */}
        <div style={{
          flex: 1, minWidth: 0,
          borderLeft: `1px solid ${theme.border}`,
          borderRight: `1px solid ${theme.border}`,
          minHeight: '100vh',
          background: theme.bg,
          maxWidth: 600,
        }}>
          <GlobalFloating />
          <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
          <AppRouter onSettingsOpen={() => setSettingsOpen(true)} />
        </div>

        {/* Right panel */}
        <PCRight />
      </div>
    </div>
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
