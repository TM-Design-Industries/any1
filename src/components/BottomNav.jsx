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
      background: '#1C1814F0',
      backdropFilter: 'blur(20px)',
      borderTop: '1px solid #332C24',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      padding: '10px 0 24px',
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
              justifyContent: 'center',
              gap: 5,
              padding: '4px 0',
            }}
          >
            <Icon
              size={20}
              color={active ? '#8B9E6E' : '#5A4E44'}
              strokeWidth={active ? 2.2 : 1.6}
            />
            <span style={{
              fontSize: 10,
              color: active ? '#8B9E6E' : '#5A4E44',
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
