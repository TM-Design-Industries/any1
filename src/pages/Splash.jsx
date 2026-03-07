import { useEffect, useState } from 'react';

const PEOPLE = [
  { x: 50, y: 50, delay: 0 },
  { x: 20, y: 30, delay: 0.1 },
  { x: 80, y: 25, delay: 0.2 },
  { x: 15, y: 70, delay: 0.15 },
  { x: 85, y: 68, delay: 0.05 },
];

function PersonIcon({ x, y, delay, converging, color }) {
  return (
    <div style={{
      position: 'absolute',
      left: converging ? '50%' : `${x}%`,
      top: converging ? '50%' : `${y}%`,
      transform: 'translate(-50%, -50%)',
      transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
      opacity: converging ? 0 : 1,
    }}>
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="7" r="4" fill={color} />
        <path d="M4 20C4 16.686 7.582 14 12 14C16.418 14 20 16.686 20 20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

const COLORS = ['#F5C842', '#7C6FF7', '#2EC4B6', '#E8622A', '#F5C842'];

export default function Splash({ onDone }) {
  const [phase, setPhase] = useState(0);
  // phase 0: people appear
  // phase 1: people converge to center
  // phase 2: logo appears
  // phase 3: logo fades, tagline appears
  // phase 4: call to action

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800);
    const t2 = setTimeout(() => setPhase(2), 1700);
    const t3 = setTimeout(() => setPhase(3), 2600);
    const t4 = setTimeout(() => setPhase(4), 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      {/* People animation layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: phase >= 2 ? 0 : 1,
        transition: 'opacity 0.5s ease',
      }}>
        {PEOPLE.map((p, i) => (
          <PersonIcon
            key={i}
            x={p.x} y={p.y} delay={p.delay}
            converging={phase >= 1}
            color={COLORS[i]}
          />
        ))}
      </div>

      {/* Logo */}
      <div style={{
        opacity: phase >= 2 ? (phase >= 3 ? 0 : 1) : 0,
        transform: phase >= 2 ? 'scale(1)' : 'scale(0.6)',
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        fontSize: 52,
        fontWeight: 300,
        color: '#FFF',
        letterSpacing: '-1px',
        position: 'absolute',
      }}>
        any<span style={{ fontWeight: 900 }}>1</span>
      </div>

      {/* Tagline + CTA */}
      <div style={{
        textAlign: 'center',
        opacity: phase >= 4 ? 1 : 0,
        transform: phase >= 4 ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.7s ease',
        padding: '0 32px',
      }}>
        {/* Animated tagline */}
        <div style={{ marginBottom: 12 }}>
          {['People', 'Power', 'People.'].map((word, i) => (
            <div key={i} style={{
              fontSize: i === 1 ? 52 : 44,
              fontWeight: 900,
              color: i === 1 ? '#2EC4B6' : '#FFF',
              letterSpacing: '-2px',
              lineHeight: 1.05,
              opacity: phase >= 4 ? 1 : 0,
              transform: phase >= 4 ? 'translateY(0)' : 'translateY(16px)',
              transition: `all 0.5s ease ${i * 0.12}s`,
            }}>
              {word}
            </div>
          ))}
        </div>

        <div style={{
          fontSize: 15,
          color: '#555',
          marginBottom: 48,
          lineHeight: 1.5,
          opacity: phase >= 4 ? 1 : 0,
          transition: 'opacity 0.5s ease 0.4s',
        }}>
          Invest in people before the world notices them.
        </div>

        <button
          onClick={onDone}
          style={{
            background: '#2EC4B6',
            color: '#0A0A0A',
            border: 'none',
            borderRadius: 18,
            padding: '16px 48px',
            fontSize: 17,
            fontWeight: 800,
            cursor: 'pointer',
            letterSpacing: '-0.3px',
            boxShadow: '0 8px 32px #2EC4B644',
            opacity: phase >= 4 ? 1 : 0,
            transition: 'opacity 0.5s ease 0.6s',
          }}
        >
          Enter the Market
        </button>
      </div>
    </div>
  );
}
