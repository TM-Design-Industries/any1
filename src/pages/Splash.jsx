import { useEffect, useState } from 'react';

// Person icon - clean half-body silhouette, monochrome
function PersonIcon({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="10" r="5" fill="#F2EDE6" />
      <path d="M6 28C6 22.477 10.477 18 16 18C21.523 18 26 22.477 26 28" stroke="#F2EDE6" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// The 4 chars of "any1"
const CHARS = ['a', 'n', 'y', '1'];

export default function Splash({ onDone }) {
  const [phase, setPhase] = useState(0);
  // phase 0: icons appear in circle
  // phase 1: icons move into a row
  // phase 2: icons morph into letters
  // phase 3: done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 600);
    const t2 = setTimeout(() => setPhase(2), 1300);
    const t3 = setTimeout(() => setPhase(3), 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    if (phase === 3) onDone();
  }, [phase, onDone]);

  // Circle positions (centered around 0,0, in %)
  const circlePos = [
    { x: -18, y: -18 }, // top-left
    { x:  18, y: -18 }, // top-right
    { x: -18, y:  18 }, // bottom-left
    { x:  18, y:  18 }, // bottom-right
  ];

  // Row positions (evenly spaced)
  const rowPos = [
    { x: -45, y: 0 },
    { x: -15, y: 0 },
    { x:  15, y: 0 },
    { x:  45, y: 0 },
  ];

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
      <div style={{ position: 'relative', width: 200, height: 80 }}>
        {[0, 1, 2, 3].map(i => {
          const from = circlePos[i];
          const to = rowPos[i];
          const pos = phase >= 1 ? to : from;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                transition: phase >= 1
                  ? `transform 0.55s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.06}s`
                  : 'none',
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Person icon fades out, letter fades in */}
              <div style={{
                position: 'absolute',
                opacity: phase >= 2 ? 0 : 1,
                transition: 'opacity 0.3s ease',
              }}>
                <PersonIcon size={32} />
              </div>

              <div style={{
                position: 'absolute',
                opacity: phase >= 2 ? 1 : 0,
                transition: `opacity 0.35s ease ${i * 0.07}s`,
                fontSize: i === 3 ? 36 : 32,
                fontWeight: i === 3 ? 900 : 300,
                color: '#F2EDE6',
                letterSpacing: '-1px',
                lineHeight: 1,
                userSelect: 'none',
              }}>
                {CHARS[i]}
              </div>
            </div>
          );
        })}

        {/* Tagline under logo */}
        <div style={{
          position: 'absolute',
          bottom: -32,
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          opacity: phase >= 2 ? 1 : 0,
          transition: 'opacity 0.4s ease 0.3s',
          fontSize: 10,
          fontWeight: 600,
          color: '#7A6E62',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          People Power People
        </div>
      </div>
    </div>
  );
}
