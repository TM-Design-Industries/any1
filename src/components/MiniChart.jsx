import { useMemo } from 'react';
import { generateChart } from '../data/mockData';

export default function MiniChart({ base, change, width = 80, height = 32 }) {
  const data = useMemo(() => generateChart(base, change), [base, change]);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  // fill path
  const firstX = 0;
  const lastX = width;
  const fillPts = `${firstX},${height} ${pts} ${lastX},${height}`;

  const lineColor = change >= 0 ? '#8B9E6E' : '#C0564A';
  const fillColor = change >= 0 ? '#8B9E6E18' : '#E0555518';

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <polygon points={fillPts} fill={fillColor} />
      <polyline
        points={pts}
        fill="none"
        stroke={lineColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* last dot */}
      {(() => {
        const lastPt = pts.split(' ').pop().split(',');
        return (
          <circle
            cx={parseFloat(lastPt[0])}
            cy={parseFloat(lastPt[1])}
            r={2.5}
            fill={lineColor}
          />
        );
      })()}
    </svg>
  );
}

