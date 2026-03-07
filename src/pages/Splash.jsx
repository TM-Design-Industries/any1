import { useEffect, useState } from 'react';

function PersonIcon({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="10" r="5" fill="#F2EDE6" />
      <path d="M6 28C6 22.477 10.477 18 16 18C21.523 18 26 22.477 26 28"
        stroke="#F2EDE6" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

const CHARS = ['a', 'n', 'y', '1'];

// 4 positions on a circle (radius ~52px), starting top-left going clockwise
const CIRCLE_R = 52;
const circlePos = [
  { x: -CIRCLE_R * Math.cos(Math.PI * 0.75), y: -CIRCLE_R * Math.sin(Math.PI * 0.75) }, // top-left
  { x:  CIRCLE_R * Math.cos(Math.PI * 0.25), y: -CIRCLE_R * Math.sin(Math.PI * 0.25) }, // top-right
  { x:  CIRCLE_R * Math.cos(Math.PI * 0.75), y:  CIRCLE_R * Math.sin(Math.PI * 0.75) }, // bottom-right
  { x: -CIRCLE_R * Math.cos(Math.PI * 0.25), y:  CIRCLE_R * Math.sin(Math.PI * 0.25) }, // bottom-left
];

// After half-rotation (180°), positions are mirrored
const halfRotPos = [
  { x:  CIRCLE_R * Math.cos(Math.PI * 0.75), y:  CIRCLE_R * Math.sin(Math.PI * 0.75) }, // was top-left → bottom-right
  { x: -CIRCLE_R * Math.cos(Math.PI * 0.25), y:  CIRCLE_R * Math.sin(Math.PI * 0.25) }, // was top-right → bottom-left
  { x: -CIRCLE_R * Math.cos(Math.PI * 0.75), y: -CIRCLE_R * Math.sin(Math.PI * 0.75) }, // was bottom-right → top-left
  { x:  CIRCLE_R * Math.cos(Math.PI * 0.25), y: -CIRCLE_R * Math.sin(Math.PI * 0.25) }, // was bottom-left → top-right
];

// Final row - evenly spaced, centered
const rowPos = [
  { x: -54, y: 0 },
  { x: -18, y: 0 },
  { x:  18, y: 0 },
  { x:  54, y: 0 },
];

export default function Splash({ onDone }) {
  // phase 0: icons on circle, visible
  // phase 1: half-rotation (arc to mirrored positions)
  // phase 2: snap into row
  // phase 3: icons morph to letters
  // phase 4: logo visible — hold 1.5s
  // phase 5: done
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);   // start half-rotation
    const t2 = setTimeout(() => setPhase(2), 950);   // snap to row
    const t3 = setTimeout(() => setPhase(3), 1350);  // morph to letters
    const t4 = setTimeout(() => setPhase(4), 1750);  // logo fully visible
    const t5 = setTimeout(() => setPhase(5), 3300);  // hold 1.5s, then exit
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  useEffect(() => {
    if (phase === 5) onDone();
  }, [phase, onDone]);

  const getPos = (i) => {
    if (phase === 0) return circlePos[i];
    if (phase === 1) return halfRotPos[i];
    return rowPos[i];
  };

  const getTransition = (i) => {
    if (phase === 0) return 'none';
    if (phase === 1) return `transform 0.55s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.04}s`;
    if (phase === 2) return `transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.04}s`;
    return `transform 0.3s ease ${i * 0.04}s`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#221E1A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>
      <div style={{ position: 'relative', width: 240, height: 100 }}>
        {[0, 1, 2, 3].map(i => {
          const pos = getPos(i);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
                transition: getTransition(i),
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Person icon */}
              <div style={{
                position: 'absolute',
                opacity: phase >= 3 ? 0 : 1,
                transition: 'opacity 0.25s ease',
              }}>
                <PersonIcon size={30} />
              </div>

              {/* Letter */}
              <div style={{
                position: 'absolute',
                opacity: phase >= 3 ? 1 : 0,
                transition: `opacity 0.3s ease ${i * 0.06}s`,
                fontSize: i === 3 ? 38 : 32,
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

        {/* Tagline - appears with logo */}
        <div style={{
          position: 'absolute',
          bottom: -28,
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          opacity: phase >= 4 ? 1 : 0,
          transition: 'opacity 0.4s ease',
          fontSize: 10,
          fontWeight: 600,
          color: '#7A6E62',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
        }}>
          People Power People
        </div>
      </div>
    </div>
  );
}

