import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Briefcase, User } from 'lucide-react';

const tabs = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Discover', path: '/discover' },
  { icon: Briefcase, label: 'Portfolio', path: '/portfolio' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 430,
      background: '#1C1814ee',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid #1F1F1F',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0 20px',
      zIndex: 100,
    }}>
      {tabs.map(({ icon: Icon, label, path }) => {
        const active = location.pathname === path;
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: '4px 16px',
            }}
          >
            <Icon
              size={22}
              color={active ? '#8B9E6E' : '#444444'}
              strokeWidth={active ? 2.5 : 1.8}
            />
            <span style={{
              fontSize: 10,
              color: active ? '#8B9E6E' : '#444444',
              fontWeight: active ? 600 : 400,
              letterSpacing: '0.05em',
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

