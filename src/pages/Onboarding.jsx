import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const TYPES = [
  {
    id: 'investor',
    label: 'Investor',
    color: '#7A9E7E',
    desc: 'Back people with capital',
    icon: (
      <svg width={18} height={18} viewBox="0 0 16 16" fill="none">
        <path d="M8 2L13 6L8 14L3 6L8 2Z" fill="black" fillOpacity="0.7" />
        <path d="M3 6H13M6 6L8 2M10 6L8 2M6 6L8 14M10 6L8 14" stroke="black" strokeWidth="0.7" strokeOpacity="0.25" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: 'founder',
    label: 'Founder',
    color: '#8B85C1',
    desc: 'Build with vision, own your company',
    icon: (
      <svg width={18} height={18} viewBox="0 0 16 16" fill="none">
        <path d="M8 2L12 8H9.5V14H6.5V8H4L8 2Z" fill="black" fillOpacity="0.7" />
      </svg>
    ),
  },
  {
    id: 'surfer',
    label: 'Surfer',
    color: '#5AABA2',
    desc: 'Multi-project, stay flexible',
    icon: (
      <svg width={18} height={18} viewBox="0 0 16 16" fill="none">
        <path d="M2 9C4 6 6 5 8 7C10 9 12 8 14 5" stroke="black" strokeWidth="1.8" strokeOpacity="0.7" strokeLinecap="round" />
        <path d="M2 12C4 9 6 8 8 10C10 12 12 11 14 8" stroke="black" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'expert',
    label: 'Expert',
    color: '#B8714F',
    desc: 'Master of one craft',
    icon: (
      <svg width={18} height={18} viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5L9.5 6H14L10.5 8.5L12 13L8 10.5L4 13L5.5 8.5L2 6H6.5L8 1.5Z" fill="black" fillOpacity="0.7" />
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
      color: selectedType?.color || '#5AABA2',
      tags: [],
    };
    localStorage.setItem('any1_user', JSON.stringify(userData));
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#221E1A',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ flex: 1, padding: '60px 24px 24px', display: 'flex', flexDirection: 'column', gap: 36 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 300, color: '#F2EDE6', letterSpacing: '-1px' }}>
            any<span style={{ fontWeight: 900, color: selectedType?.color || '#5AABA2' }}>1</span>
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
              background: '#2A2520',
              border: `1px solid ${name ? (selectedType?.color || '#5AABA2') : '#222'}`,
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
                  background: type === t.id ? `${t.color}12` : '#2A2520',
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
            background: canGo ? (selectedType?.color || '#5AABA2') : '#181818',
            color: canGo ? '#221E1A' : '#3E3528',
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
            boxShadow: canGo ? `0 8px 24px ${selectedType?.color || '#5AABA2'}44` : 'none',
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




