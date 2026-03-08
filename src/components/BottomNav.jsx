import { useNavigate, useLocation } from 'react-router-dom';
import { Search, PieChart, Activity, User, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const tabs = [
  { icon: Menu,     label: 'Settings',   path: '/settings',   special: 'hamburger' },
  { icon: Search,   label: 'Discover',   path: '/discover' },
  { icon: PieChart, label: 'Portfolio',  path: '/portfolio',  special: 'center' },
  { icon: Activity, label: 'Live',       path: '/' },
  { icon: User,     label: 'Profile',    path: '/profile' },
];

export default function BottomNav({ onSettingsOpen }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      background: theme.navBg,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderTop: `1px solid ${theme.border}`,
      borderRadius: '16px 16px 0 0',
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      padding: '10px 0 28px',
      zIndex: 100,
    }}>
      {tabs.map(({ icon: Icon, label, path, special }) => {
        const active = path === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(path) && path !== '/settings';
        const isCenter = special === 'center';
        const isHamburger = special === 'hamburger';

        const handleClick = () => {
          if (isHamburger && onSettingsOpen) onSettingsOpen();
          else navigate(path);
        };

        return (
          <button
            key={path}
            onClick={handleClick}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              gap: 4, padding: '4px 0', position: 'relative',
            }}
          >
            {isCenter ? (
              <div style={{
                width: 50, height: 50, borderRadius: '50%',
                background: active ? theme.accent : `${theme.accent}22`,
                border: `2px solid ${theme.accent}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: -20,
                boxShadow: active ? `0 4px 20px ${theme.accent}66` : '0 2px 12px rgba(0,0,0,0.3)',
              }}>
                <Icon size={22} color={active ? '#1C1A18' : theme.accent} strokeWidth={active ? 2.4 : 1.8} />
              </div>
            ) : (
              <Icon size={20} color={active ? theme.accent : theme.muted} strokeWidth={active ? 2.2 : 1.6} />
            )}
            {!isCenter && (
              <span style={{
                fontSize: 10, color: active ? theme.accent : theme.muted,
                fontWeight: active ? 600 : 400, letterSpacing: '0.04em',
              }}>
                {label}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
