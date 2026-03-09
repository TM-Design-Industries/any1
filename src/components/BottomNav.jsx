import { useNavigate, useLocation } from 'react-router-dom';
import { Search, PieChart, Activity, User, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const tabs = [
  { icon: Menu,     label: 'Settings',  path: '/settings',  special: 'hamburger' },
  { icon: Search,   label: 'Discover',  path: '/discover' },
  { icon: PieChart, label: 'Portfolio', path: '/portfolio' },
  { icon: Activity, label: 'Live',      path: '/' },
  { icon: User,     label: 'Profile',   path: '/profile' },
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
      borderRadius: '14px 14px 0 0',
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      paddingBottom: 'env(safe-area-inset-bottom, 16px)',
      paddingTop: 6,
      zIndex: 100,
    }}>
      {tabs.map(({ icon: Icon, label, path, special }) => {
        const active = path === '/'
          ? location.pathname === '/'
          : location.pathname.startsWith(path) && path !== '/settings';
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
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '8px 0 6px',
              gap: 4,
              transition: 'opacity 0.15s',
            }}
          >
            <Icon
              size={20}
              color={active ? theme.accent : theme.muted}
              strokeWidth={active ? 2.2 : 1.6}
            />
            <span style={{
              fontSize: 10,
              color: active ? theme.accent : theme.muted,
              fontWeight: active ? 600 : 400,
              letterSpacing: '0.04em',
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}