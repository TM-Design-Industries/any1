import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const TYPES = [
  {
    id: 'investor',
    label: 'Investor',
    color: '#F5C842',
    desc: 'Back people with capital',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <path d="M12 3L20 9L12 21L4 9L12 3Z" fill="#F5C842" />
        <path d="M4 9H20M8 9L12 3M16 9L12 3M8 9L12 21M16 9L12 21" stroke="#1C1814" strokeWidth="1.2" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'founder',
    label: 'Founder',
    color: '#7C6FF7',
    desc: 'Build with vision, own your company',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <path d="M12 3L19 12H14V21H10V12H5L12 3Z" fill="#7C6FF7" />
      </svg>
    ),
  },
  {
    id: 'surfer',
    label: 'Surfer',
    color: '#2EC4B6',
    desc: 'Multi-project, stay flexible',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <path d="M3 12C5 8 8 6 11 8C14 10 17 8 21 5" stroke="#2EC4B6" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M3 17C5 13 8 11 11 13C14 15 17 13 21 10" stroke="#2EC4B6" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'expert',
    label: 'Expert',
    color: '#E8622A',
    desc: 'Master of one craft',
    icon: (
      <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L14.4 9.2H22L16 13.6L18.4 20.8L12 16.4L5.6 20.8L8 13.6L2 9.2H9.6L12 2Z" fill="#E8622A" />
      </svg>
    ),
  },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [type, setType] = useState(null);
  const [name, setName] = useState('');

  const selectedType = TYPES.find(t => t.id === type);
  const canGo = type && name.trim().length > 0;

  const handleGo = () => {
    if (!canGo) return;
    const userData = {
      type,
      name: name.trim(),
      bio: '',
      reputation: 32,
      joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      collateral: 3000,
      investors: 5,
      marketCap: 8500,
      missions: 1,
      handle: '@' + name.trim().toLowerCase().replace(/\s+/g, ''),
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face',
      cover: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop',
      location: 'Tel Aviv',
      color: selectedType?.color || '#2EC4B6',
      tags: [],
    };
    localStorage.setItem('any1_user', JSON.stringify(userData));
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1C1814',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ flex: 1, padding: '60px 24px 24px', display: 'flex', flexDirection: 'column', gap: 36 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 300, color: '#F2EDE6', letterSpacing: '-1px' }}>
            any<span style={{ fontWeight: 900, color: selectedType?.color || '#2EC4B6' }}>1</span>
          </div>
        </div>

        {/* Name input */}
        <div>
          <div style={{ fontSize: 11, color: '#7A6E62', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Your name
          </div>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Tamir Mizrahi"
            autoFocus
            style={{
              width: '100%',
              background: '#252019',
              border: `1px solid ${name ? (selectedType?.color || '#2EC4B6') : '#222'}`,
              borderRadius: 14,
              padding: '14px 16px',
              color: '#F2EDE6',
              fontSize: 16,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.2s ease',
            }}
          />
        </div>

        {/* Role selection */}
        <div>
          <div style={{ fontSize: 11, color: '#7A6E62', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Who are you?
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {TYPES.map(t => (
              <button
                key={t.id}
                onClick={() => setType(t.id)}
                style={{
                  background: type === t.id ? `${t.color}12` : '#252019',
                  border: `1.5px solid ${type === t.id ? t.color : '#1E1E1E'}`,
                  borderRadius: 16,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  boxShadow: type === t.id ? `0 0 20px ${t.color}22` : 'none',
                }}
              >
                <div style={{
                  width: 40, height: 40,
                  borderRadius: '50%',
                  background: `${t.color}18`,
                  border: `1px solid ${t.color}33`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {t.icon}
                </div>
                <div>
                  <div style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: type === t.id ? t.color : '#F2EDE6',
                    marginBottom: 2,
                  }}>
                    {t.label}
                  </div>
                  <div style={{ fontSize: 12, color: '#7A6E62' }}>{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '16px 24px 48px' }}>
        <button
          onClick={handleGo}
          disabled={!canGo}
          style={{
            width: '100%',
            background: canGo ? (selectedType?.color || '#2EC4B6') : '#181818',
            color: canGo ? '#1C1814' : '#3E3528',
            border: 'none',
            borderRadius: 16,
            padding: '16px',
            fontSize: 16,
            fontWeight: 800,
            cursor: canGo ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'all 0.25s ease',
            boxShadow: canGo ? `0 8px 24px ${selectedType?.color || '#2EC4B6'}44` : 'none',
            letterSpacing: '-0.2px',
          }}
        >
          Let's go
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

