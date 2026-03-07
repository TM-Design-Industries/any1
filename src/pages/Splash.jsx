import { useEffect, useState } from 'react';

// 5 person silhouettes at different positions
const PEOPLE = [
  { x: 50, y: 50, delay: 0 },
  { x: 18, y: 28, delay: 0.08 },
  { x: 82, y: 24, delay: 0.16 },
  { x: 14, y: 72, delay: 0.12 },
  { x: 86, y: 70, delay: 0.04 },
];

const COLORS = ['#8B9E6E', '#D4A843', '#7B6FF7', '#4BBFB5', '#D4663A'];

function PersonDot({ x, y, delay, converging, color }) {
  return (
    <div style={{
      position: 'absolute',
      left: converging ? '50%' : `${x}%`,
      top: converging ? '50%' : `${y}%`,
      transform: 'translate(-50%, -50%)',
      transition: `all 0.7s cubic-bezier(0.4, 0, 0.2, 1) ${delay}s`,
      opacity: converging ? 0 : 1,
      pointerEvents: 'none',
    }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="7" r="3.5" fill={color} opacity="0.9" />
        <path d="M5 20C5 16.686 8.134 14 12 14C15.866 14 19 16.686 19 20"
          stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      </svg>
    </div>
  );
}

export default function Splash({ onDone }) {
  // phase 0 → people visible
  // phase 1 → people converge (0.5s)
  // phase 2 → logo + tagline appear
  // phase 3 → auto-done
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);   // start converging
    const t2 = setTimeout(() => setPhase(2), 1100);  // show logo+tagline
    const t3 = setTimeout(() => setPhase(3), 2200);  // auto-exit
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    if (phase === 3) onDone();
  }, [phase, onDone]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#1C1814',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>

      {/* People layer - fades out as logo appears */}
      <div style={{
        position: 'absolute',
        inset: 0,
        opacity: phase >= 2 ? 0 : 1,
        transition: 'opacity 0.4s ease',
        pointerEvents: 'none',
      }}>
        {PEOPLE.map((p, i) => (
          <PersonDot
            key={i}
            x={p.x} y={p.y} delay={p.delay}
            converging={phase >= 1}
            color={COLORS[i]}
          />
        ))}
      </div>

      {/* Logo + tagline - appears after people converge */}
      <div style={{
        textAlign: 'center',
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? 'scale(1)' : 'scale(0.85)',
        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 14,
      }}>
        {/* Logo */}
        <div style={{
          fontSize: 48,
          fontWeight: 300,
          color: '#F2EDE6',
          letterSpacing: '-2px',
          lineHeight: 1,
        }}>
          any<span style={{ fontWeight: 900, color: '#8B9E6E' }}>1</span>
        </div>

        {/* Tagline - small, under logo */}
        <div style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#7A6E62',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          opacity: phase >= 2 ? 1 : 0,
          transition: 'opacity 0.4s ease 0.15s',
        }}>
          People Power People
        </div>
      </div>
    </div>
  );
}
