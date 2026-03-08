import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers, myPortfolio, generateChart } from '../data/mockData';
import BottomNav from '../components/BottomNav';
import MiniChart from '../components/MiniChart';
import { TrendingUp, TrendingDown, RefreshCw, Star, BarChart2, X, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

// Generate insight text per user
function generateInsight(pos) {
  const u = pos.user;
  const pnl = pos.pnlPct;
  const signal = pnl > 10 ? 'strong buy' : pnl > 0 ? 'hold' : pnl > -10 ? 'watch' : 'consider exiting';
  const lines = [];
  if (u.change > 5) lines.push(`Up ${u.change}% this week — momentum is strong.`);
  else if (u.change < 0) lines.push(`Down ${Math.abs(u.change)}% this week — watch for further decline.`);
  else lines.push(`Relatively stable this week (+${u.change}%).`);
  if (u.investors > 100) lines.push(`${u.investors} backers signals high community conviction.`);
  else if (u.investors < 20) lines.push(`Only ${u.investors} backers — still early, higher risk/reward.`);
  if (u.missions > 3) lines.push(`Active on ${u.missions} missions — proving value consistently.`);
  if (pnl > 15) lines.push(`Your position is up ${pnl.toFixed(1)}% — well timed entry.`);
  else if (pnl < -10) lines.push(`Your position is down ${Math.abs(pnl).toFixed(1)}% — reassess thesis.`);
  lines.push(`Recommendation: ${signal.toUpperCase()}.`);
  return lines;
}

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
  const [insightPos, setInsightPos] = useState(null);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setRefreshKey(k => k + 1);
    }, 1200);
  };

  // Merge mock portfolio + real user investments from localStorage
  const positions = useMemo(() => {
    const lsPortfolio = JSON.parse(localStorage.getItem('any1_portfolio') || '[]');
    const combined = [...myPortfolio];
    lsPortfolio.forEach(lp => {
      if (!combined.find(p => p.userId === lp.userId)) {
        combined.push({ userId: lp.userId, shares: lp.shares, buyPrice: lp.buyPrice, currentPrice: mockUsers.find(u => u.id === lp.userId)?.marketCap || lp.buyPrice });
      }
    });
    return combined.map(p => {
      const user = mockUsers.find(u => u.id === p.userId);
      if (!user) return null;
      const value = p.shares * (p.currentPrice / 1000);
      const cost = p.shares * (p.buyPrice / 1000);
      const pnl = value - cost;
      const pnlPct = ((value - cost) / cost) * 100;
      return { ...p, user, value, cost, pnl, pnlPct };
    }).filter(Boolean);
  }, [refreshKey]);

  const backerCards = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('any1_backer_cards') || '[]'); } catch { return []; }
  }, [refreshKey]);

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
                style={{
                  background: isBest ? '#1A1400' : '#2A2520',
                  border: `1px solid ${isBest ? '#C9A84C44' : '#332C24'}`,
                  borderRadius: 16, padding: 16, marginBottom: 10,
                  display: 'flex', alignItems: 'center', gap: 14,
                  position: 'relative', overflow: 'hidden',
                }}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: pos.user.color, opacity: isBest ? 0.8 : 0.4 }} />

                <img src={pos.user.avatar} alt={pos.user.name} onClick={() => navigate(`/user/${pos.userId}`)} style={{ width: 44, height: 44, borderRadius: '50%', border: `1.5px solid ${pos.user.color}44`, cursor: 'pointer' }} />

                <div style={{ flex: 1 }} onClick={() => navigate(`/user/${pos.userId}`)}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#F2EDE6', marginBottom: 2, cursor: 'pointer' }}>{pos.user.name}</div>
                  <div style={{ fontSize: 12, color: '#7A6E62' }}>{pos.shares} {pos.shares === 1 ? 'share' : 'shares'}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MiniChart data={generateChart(pos.user.marketCap, pos.user.change, 12)} color={pos.pnl >= 0 ? '#7A9E7E' : '#C0564A'} width={56} height={22} />
                    {/* Insight button */}
                    <button onClick={e => { e.stopPropagation(); setInsightPos(pos); }} style={{ width: 30, height: 30, borderRadius: '50%', background: '#1A1612', border: '1px solid #2A2520', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <BarChart2 size={14} color="#C9A84C" />
                    </button>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#F2EDE6' }}>${pos.value.toFixed(2)}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: pos.pnl >= 0 ? '#C9A84C' : '#C0564A' }}>
                    {pos.pnl >= 0 ? '+' : ''}${pos.pnl.toFixed(2)} ({pos.pnl >= 0 ? '+' : ''}{pos.pnlPct.toFixed(1)}%)
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Add position */}
        <button onClick={() => navigate('/discover')} style={{ width: '100%', background: 'transparent', border: '1px dashed #2A2520', borderRadius: 16, padding: 16, color: '#7A6E62', fontSize: 14, cursor: 'pointer', marginTop: 6 }}>
          + Back someone new
        </button>

        {/* Backer Cards */}
        {backerCards.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <div style={{ fontSize: 11, color: '#7A6E62', marginBottom: 14, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Your Backer Cards
            </div>
            {backerCards.map((card, i) => {
              const user = mockUsers.find(u => u.id === card.userId);
              const currentCap = user?.marketCap || card.valuationAtBuy;
              const returnPct = ((currentCap - card.valuationAtBuy) / card.valuationAtBuy * 100).toFixed(1);
              const isPos = parseFloat(returnPct) >= 0;
              return (
                <div key={i} onClick={() => navigate(`/user/${card.userId}`)} style={{
                  background: 'linear-gradient(135deg, #1E1B17 0%, #2A2218 100%)',
                  border: '1px solid #C9A84C33',
                  borderRadius: 18, padding: '18px 20px',
                  marginBottom: 12, cursor: 'pointer',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg, #C9A84C, transparent)' }} />
                  <div style={{ position: 'absolute', bottom: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: '#C9A84C08' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <img src={card.avatar || user?.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', border: '1.5px solid #C9A84C44' }} />
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: '#F2EDE6' }}>I backed {card.name}</div>
                      <div style={{ fontSize: 11, color: '#7A6E62' }}>on {card.date}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                      <div style={{ fontSize: 10, color: '#7A6E62', marginBottom: 2 }}>Valuation at entry</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#B5A898' }}>${(card.valuationAtBuy / 1000).toFixed(0)}k</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: '#7A6E62', marginBottom: 2 }}>Amount</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#C9A84C' }}>${card.amount}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: '#7A6E62', marginBottom: 2 }}>Since entry</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: isPos ? '#7A9E7E' : '#C0564A' }}>
                        {isPos ? '+' : ''}{returnPct}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Insight Panel */}
      {insightPos && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: '#000000aa', zIndex: 200 }} onClick={() => setInsightPos(null)} />
          <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: '#1E1B17', borderRadius: '24px 24px 0 0', padding: '28px 20px 48px', zIndex: 201, border: '1px solid #C9A84C33', boxShadow: '0 -8px 40px #00000088' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={insightPos.user.avatar} alt="" style={{ width: 42, height: 42, borderRadius: '50%', border: `1.5px solid ${insightPos.user.color}44` }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#F2EDE6' }}>{insightPos.user.name}</div>
                  <div style={{ fontSize: 11, color: '#7A6E62' }}>Portfolio Insight</div>
                </div>
              </div>
              <button onClick={() => setInsightPos(null)} style={{ background: '#2A2520', border: '1px solid #3E3528', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={15} color="#7A6E62" />
              </button>
            </div>

            {/* Signal badge */}
            {(() => {
              const pnl = insightPos.pnlPct;
              const signal = pnl > 10 ? { label: 'STRONG BUY', color: '#7A9E7E' } : pnl > 0 ? { label: 'HOLD', color: '#C9A84C' } : pnl > -10 ? { label: 'WATCH', color: '#D4A843' } : { label: 'CONSIDER EXIT', color: '#C0564A' };
              return (
                <div style={{ background: `${signal.color}18`, border: `1px solid ${signal.color}44`, borderRadius: 10, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: signal.color, letterSpacing: '0.06em' }}>{signal.label}</span>
                  <span style={{ fontSize: 13, color: insightPos.pnl >= 0 ? '#7A9E7E' : '#C0564A', fontWeight: 700 }}>
                    {insightPos.pnl >= 0 ? '+' : ''}{insightPos.pnlPct.toFixed(1)}% your return
                  </span>
                </div>
              );
            })()}

            {/* Insight lines */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {generateInsight(insightPos).map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9A84C', marginTop: 6, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: '#B5A898', lineHeight: 1.5 }}>{line}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setInsightPos(null); navigate(`/user/${insightPos.userId}`); }} style={{ flex: 1, background: '#C9A84C', color: '#221E1A', border: 'none', borderRadius: 14, padding: '13px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <ArrowUpRight size={15} /> Add more
              </button>
              <button onClick={() => setInsightPos(null)} style={{ flex: 1, background: '#2A2520', color: '#C0564A', border: '1px solid #C0564A33', borderRadius: 14, padding: '13px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <ArrowDownLeft size={15} /> Exit position
              </button>
            </div>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}



