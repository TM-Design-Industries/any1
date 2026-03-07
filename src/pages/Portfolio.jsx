import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers, myPortfolio, generateChart } from '../data/mockData';
import BottomNav from '../components/BottomNav';
import MiniChart from '../components/MiniChart';
import { TrendingUp, TrendingDown, RefreshCw, Star } from 'lucide-react';

const CHART_TABS = ['1D', '1W', '1M'];

function PortfolioChart({ positions, tab }) {
  const width = 340;
  const height = 100;

  const data = useMemo(() => {
    const points = tab === '1D' ? 20 : tab === '1W' ? 40 : 60;
    const totalBase = positions.reduce((s, p) => s + p.value, 0);
    let val = totalBase * 0.88;
    const arr = [];
    for (let i = 0; i < points; i++) {
      val += (Math.random() - 0.44) * totalBase * 0.015;
      arr.push(Math.max(val, totalBase * 0.5));
    }
    arr.push(totalBase);
    return arr;
  }, [tab, positions]);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  const firstY = height - ((data[0] - min) / range) * (height - 8) - 4;
  const fillPts = `0,${height} ${pts} ${width},${height}`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={fillPts} fill="url(#chartGrad)" />
      <polyline
        points={pts}
        fill="none"
        stroke="#C9A84C"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {(() => {
        const lastPt = pts.split(' ').pop().split(',');
        return (
          <circle
            cx={parseFloat(lastPt[0])}
            cy={parseFloat(lastPt[1])}
            r={3.5}
            fill="#C9A84C"
          />
        );
      })()}
    </svg>
  );
}

export default function Portfolio() {
  const navigate = useNavigate();
  const [chartTab, setChartTab] = useState('1D');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setRefreshKey(k => k + 1);
    }, 1200);
  };

  const positions = useMemo(() => myPortfolio.map(p => {
    const user = mockUsers.find(u => u.id === p.userId);
    const value = p.shares * (p.currentPrice / 1000);
    const cost = p.shares * (p.buyPrice / 1000);
    const pnl = value - cost;
    const pnlPct = ((value - cost) / cost) * 100;
    return { ...p, user, value, cost, pnl, pnlPct };
  }), [refreshKey]);

  const totalValue = positions.reduce((s, p) => s + p.value, 0);
  const totalCost = positions.reduce((s, p) => s + p.cost, 0);
  const totalPnl = totalValue - totalCost;
  const totalPct = ((totalValue - totalCost) / totalCost) * 100;

  const bestPos = [...positions].sort((a, b) => b.pnlPct - a.pnlPct)[0];
  const sortedPos = [...positions].sort((a, b) => b.pnlPct - a.pnlPct);

  return (
    <div style={{ minHeight: '100vh', background: '#221E1A', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ padding: '54px 20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#F2EDE6' }}>Portfolio</div>
          <button
            onClick={handleRefresh}
            style={{
              background: '#2A2520', border: '1px solid #1F1F1F',
              borderRadius: 10, padding: 8, cursor: 'pointer',
            }}
          >
            <RefreshCw
              size={16}
              color="#7A6E62"
              style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }}
            />
          </button>
        </div>

        {/* Hero card */}
        <div style={{
          background: '#2A2520',
          border: '1px solid #1F1F1F',
          borderRadius: 20,
          padding: '24px 20px 16px',
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: totalPnl >= 0 ? '#C9A84C' : '#C0564A', opacity: 0.7,
          }} />
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: 200, height: 200,
            borderRadius: '50%',
            background: totalPnl >= 0 ? '#C9A84C08' : '#E0555508',
            transform: 'translate(60px, -60px)',
          }} />

          <div style={{ fontSize: 11, color: '#7A6E62', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Total Portfolio Value
          </div>
          <div style={{ fontSize: 42, fontWeight: 900, color: '#F2EDE6', letterSpacing: '-1.5px', marginBottom: 6 }}>
            ${totalValue.toFixed(2)}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: totalPnl >= 0 ? '#C9A84C' : '#C0564A',
            fontSize: 16, fontWeight: 700, marginBottom: 20,
          }}>
            {totalPnl >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
            <span style={{ fontSize: 14 }}>({totalPct >= 0 ? '+' : ''}{totalPct.toFixed(1)}%)</span>
          </div>

          {/* Chart tabs */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            {CHART_TABS.map(t => (
              <button
                key={t}
                onClick={() => setChartTab(t)}
                style={{
                  background: chartTab === t ? '#C9A84C22' : 'transparent',
                  border: `1px solid ${chartTab === t ? '#C9A84C' : '#332C24'}`,
                  borderRadius: 8, padding: '4px 12px',
                  color: chartTab === t ? '#C9A84C' : '#7A6E62',
                  fontSize: 11, fontWeight: 700, cursor: 'pointer',
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <PortfolioChart positions={positions} tab={chartTab} />
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{ fontSize: 11, color: '#7A6E62', marginBottom: 14, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {positions.length} positions
        </div>

        {sortedPos.map((pos, i) => {
          const isBest = pos.userId === bestPos?.userId;
          return (
            <div key={pos.userId}>
              {isBest && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Star size={12} color="#D4A843" fill="#D4A843" />
                  <span style={{ fontSize: 11, color: '#D4A843', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    Best Performer
                  </span>
                </div>
              )}
              <div
                onClick={() => navigate(`/portfolio/${pos.userId}`)}
                style={{
                  background: isBest ? '#1A1400' : '#2A2520',
                  border: `1px solid ${isBest ? '#C9A84C44' : '#332C24'}`,
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: pos.user.color, opacity: isBest ? 0.8 : 0.4,
                }} />

                <img src={pos.user.avatar} alt={pos.user.name} style={{
                  width: 44, height: 44, borderRadius: '50%',
                  border: `1.5px solid ${pos.user.color}44`,
                }} />

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#F2EDE6', marginBottom: 2 }}>
                    {pos.user.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#7A6E62' }}>
                    {pos.shares} shares
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <MiniChart base={pos.user.marketCap} change={pos.user.change} width={60} height={24} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#F2EDE6' }}>
                    ${pos.value.toFixed(2)}
                  </div>
                  <div style={{
                    fontSize: 12, fontWeight: 600,
                    color: pos.pnl >= 0 ? '#C9A84C' : '#C0564A',
                  }}>
                    {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)} ({pos.pnl >= 0 ? '+' : ''}{pos.pnlPct.toFixed(1)}%)
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add position */}
        <button
          onClick={() => navigate('/discover')}
          style={{
            width: '100%', background: 'transparent',
            border: '1px dashed #1F1F1F', borderRadius: 16,
            padding: 16, color: '#7A6E62', fontSize: 14,
            cursor: 'pointer', marginTop: 6,
          }}
        >
          + Add position
        </button>
      </div>

      <BottomNav />
    </div>
  );
}



