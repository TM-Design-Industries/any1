import { useNavigate, useLocation } from 'react-router-dom';
import { Search, PieChart, Activity, User, Menu } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const tabs = [
  { icon: Menu,     label: 'Settings',  path: '/settings',  special: 'hamburger' },
  { icon: Search,   label: 'Discover',  path: '/discover' },
  { icon: PieChart, label: 'Portfolio', path: '/portfolio', special: 'center' },
  { icon: Activity, label: 'Live',      path: '/' },
  { icon: User,     label: 'Profile',   path: '/profile' },
];

export default function BottomNav({ onSettingsOpen }) {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 430);
  useEffect(() => { const h = () => setWidth(window.innerWidth); window.addEventListener('resize',h); return () => window.removeEventListener('resize',h); }, []);
  if (width >= 768) return null;
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
      paddingBottom: 'env(safe-area-inset-bottom, 20px)',
      paddingTop: 0,
      zIndex: 100,
      alignItems: 'end',
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

        if (isCenter) {
          return (
            <button
              key={path}
              onClick={handleClick}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'flex-end',
                padding: '0 0 10px',
              }}
            >
              {/* Elevated disc - sits on top of nav bar */}
              <div style={{
                width: 48, height: 48,
                borderRadius: '50%',
                background: active ? theme.accent : theme.surface2,
                border: `1.5px solid ${active ? theme.accent : theme.border2}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 0,
                boxShadow: active
                  ? `0 2px 16px ${theme.accent}55`
                  : `0 2px 8px rgba(0,0,0,0.2)`,
                transform: 'translateY(-8px)',
                transition: 'all 0.2s ease',
              }}>
                <Icon
                  size={20}
                  color={active ? '#1E1C19' : theme.muted}
                  strokeWidth={active ? 2.3 : 1.7}
                />
              </div>
              <span style={{
                fontSize: 10,
                color: active ? theme.accent : theme.muted,
                fontWeight: active ? 600 : 400,
                letterSpacing: '0.04em',
                marginTop: -4,
                transform: 'translateY(-4px)',
              }}>
                {label}
              </span>
            </button>
          );
        }

        return (
          <button
            key={path}
            onClick={handleClick}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'flex-end',
              padding: '10px 0 10px',
              gap: 4,
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
