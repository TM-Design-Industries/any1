import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers, myPortfolio, generateChart } from '../data/mockData';
import BottomNav from '../components/BottomNav';
import MiniChart from '../components/MiniChart';
import { TrendingUp, TrendingDown, BarChart2, X, ArrowUpRight, ArrowDownLeft, RefreshCw, Star, Plus } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function generateInsight(pos) {
  const u = pos.user;
  const pnl = pos.pnlPct;
  const signal = pnl > 10 ? 'strong conviction' : pnl > 0 ? 'hold steady' : pnl > -10 ? 'watch closely' : 'consider stepping back';
  const lines = [];
  if (u.change > 5) lines.push(`Up ${u.change}% this week — strong momentum.`);
  else if (u.change < 0) lines.push(`Down ${Math.abs(u.change)}% this week — monitor activity.`);
  else lines.push(`Stable week (+${u.change}%).`);
  if (u.investors > 100) lines.push(`${u.investors} people believe in them — high community trust.`);
  else if (u.investors < 20) lines.push(`Only ${u.investors} backers — early stage, high potential.`);
  if (u.missions > 3) lines.push(`Active on ${u.missions} missions — consistently delivering.`);
  if (pnl > 15) lines.push(`Your belief is up ${pnl.toFixed(1)}% — well-timed entry.`);
  else if (pnl < -10) lines.push(`Your belief is down ${Math.abs(pnl).toFixed(1)}% — reassess your thesis.`);
  lines.push(`Signal: ${signal.toUpperCase()}.`);
  return lines;
}

export default function Portfolio({ onSettingsOpen }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [insightPos, setInsightPos] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [tab, setTab] = useState('all'); // all | up | down

  const balance = parseFloat(localStorage.getItem('any1_balance') || '1029.58');

  const positions = useMemo(() => {
    const lsPortfolio = JSON.parse(localStorage.getItem('any1_portfolio') || '[]');
    const combined = [...myPortfolio];
    lsPortfolio.forEach(lp => {
      if (!combined.find(p => p.userId === lp.userId)) {
        combined.push({ userId: lp.userId, shares: lp.shares || 1, buyPrice: lp.buyPrice, currentPrice: lp.currentPrice || lp.buyPrice });
      }
    });
    return combined.map(p => {
      const user = mockUsers.find(u => u.id === p.userId);
      if (!user) return null;
      const currentPrice = p.currentPrice || user.marketCap;
      const pnlAmt = (currentPrice - p.buyPrice) / 1000 * p.shares;
      const pnlPct = ((currentPrice - p.buyPrice) / p.buyPrice) * 100;
      const value = currentPrice / 1000 * p.shares;
      return { ...p, user, value, pnl: pnlAmt, pnlPct, currentPrice };
    }).filter(Boolean);
  }, [refreshKey]);

  const backerCards = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('any1_backer_cards') || '[]'); } catch { return []; }
  }, [refreshKey]);

  const totalValue = positions.reduce((s, p) => s + p.value, 0);
  const totalPnl = positions.reduce((s, p) => s + p.pnl, 0);
  const totalPct = totalValue > 0 ? (totalPnl / (totalValue - totalPnl)) * 100 : 0;
  const totalAccount = totalValue + balance;

  const portfolioPct = totalValue / totalAccount * 100;
  const cashPct = balance / totalAccount * 100;

  const sorted = [...positions].sort((a, b) => b.value - a.value);
  const filtered = tab === 'up' ? sorted.filter(p => p.pnl >= 0) : tab === 'down' ? sorted.filter(p => p.pnl < 0) : sorted;

  const now = new Date();
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}, ${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`;

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, paddingBottom: 100, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Header */}
      <div style={{ padding: '54px 20px 0', background: theme.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>My Portfolio</div>
          <button onClick={() => setRefreshKey(k => k + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <RefreshCw size={17} color={theme.muted} />
          </button>
        </div>

        {/* Total Value Hero */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: theme.muted, marginBottom: 4 }}>Your Total Value</div>
          <div style={{ fontSize: 38, fontWeight: 900, color: theme.text, letterSpacing: '-1.5px', lineHeight: 1 }}>
            ${totalAccount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 12, color: theme.muted, marginTop: 6 }}>Last update at {timeStr}</div>
        </div>

        {/* Split bar */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 2 }}>
            <div style={{ width: `${portfolioPct}%`, background: theme.accent, borderRadius: '4px 0 0 4px', transition: 'width 0.5s ease' }} />
            <div style={{ flex: 1, background: '#7A6E6244', borderRadius: '0 4px 4px 0' }} />
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 12 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 3, height: 32, background: theme.accent, borderRadius: 2, marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>{portfolioPct.toFixed(1)}<span style={{ fontSize: 13, fontWeight: 600, color: theme.muted }}>%</span></div>
                <div style={{ fontSize: 11, color: theme.muted }}>People Portfolio</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 3, height: 32, background: '#7A6E62', borderRadius: 2, marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>{cashPct.toFixed(1)}<span style={{ fontSize: 13, fontWeight: 600, color: theme.muted }}>%</span></div>
                <div style={{ fontSize: 11, color: theme.muted }}>Available Cash</div>
              </div>
            </div>
          </div>
        </div>

        {/* PnL summary */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{ flex: 1, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, color: theme.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Portfolio Value</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>${totalValue.toFixed(2)}</div>
          </div>
          <div style={{ flex: 1, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, color: theme.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Return</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: totalPnl >= 0 ? theme.up : theme.down }}>
              {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(2)}
            </div>
          </div>
          <div style={{ flex: 1, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ fontSize: 10, color: theme.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Cash</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.accent }}>${balance.toFixed(2)}</div>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {[
            { id: 'all', label: `All (${positions.length})` },
            { id: 'up', label: `Gaining (${positions.filter(p => p.pnl >= 0).length})` },
            { id: 'down', label: `Falling (${positions.filter(p => p.pnl < 0).length})` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? theme.accent : theme.surface,
              color: tab === t.id ? '#221E1A' : theme.muted,
              border: `1px solid ${tab === t.id ? theme.accent : theme.border}`,
              borderRadius: 20, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px 72px 36px', gap: 4, padding: '0 4px', marginBottom: 8 }}>
          <div style={{ fontSize: 10, color: theme.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Person</div>
          <div style={{ fontSize: 10, color: theme.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' }}>Return</div>
          <div style={{ fontSize: 10, color: theme.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'right' }}>Value</div>
          <div />
        </div>
      </div>

      {/* Positions list */}
      <div style={{ padding: '0 16px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: theme.muted, fontSize: 14 }}>No positions in this view.</div>
        )}
        {filtered.map((pos) => {
          const positive = pos.pnl >= 0;
          return (
            <div key={pos.userId} style={{ display: 'grid', gridTemplateColumns: '1fr 72px 72px 36px', gap: 4, alignItems: 'center', padding: '12px 4px', borderBottom: `1px solid ${theme.border}` }}>
              {/* Person */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate(`/user/${pos.userId}`)}>
                <img src={pos.user.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', border: `1.5px solid ${pos.user.color}44`, objectFit: 'cover', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 2 }}>{pos.user.name.split(' ')[0]} <span style={{ color: theme.muted, fontWeight: 400 }}>{pos.user.name.split(' ').slice(1).join(' ')}</span></div>
                  <div style={{ fontSize: 11, color: theme.muted }}>{pos.shares} {pos.shares === 1 ? 'share' : 'shares'} · ${(pos.currentPrice / 1000).toFixed(0)}k val</div>
                </div>
              </div>

              {/* Return */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: positive ? theme.up : theme.down }}>
                  {positive ? '+' : ''}{pos.pnlPct.toFixed(1)}%
                </div>
                <div style={{ fontSize: 10, color: theme.muted }}>{positive ? '+' : ''}${pos.pnl.toFixed(2)}</div>
              </div>

              {/* Value */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>${pos.value.toFixed(2)}</div>
                <MiniChart data={generateChart(pos.user.marketCap, pos.user.change, 10)} color={positive ? theme.up : theme.down} width={52} height={18} />
              </div>

              {/* Insight icon */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button onClick={() => setInsightPos(pos)} style={{ width: 28, height: 28, borderRadius: '50%', background: theme.surface, border: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <BarChart2 size={13} color={theme.accent} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Total Available Cash row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 4px', borderTop: `2px solid ${theme.border}`, marginTop: 4 }}>
          <div>
            <div style={{ fontSize: 12, color: theme.muted, marginBottom: 2 }}>Available Cash</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
          <button onClick={() => navigate('/discover')} style={{ background: theme.accent, color: '#221E1A', border: 'none', borderRadius: 22, padding: '11px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Back someone
          </button>
        </div>

        {/* Backer Cards */}
        {backerCards.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <div style={{ fontSize: 11, color: theme.muted, marginBottom: 14, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Backer Cards</div>
            {backerCards.map((card, i) => {
              const user = mockUsers.find(u => u.id === card.userId);
              const currentCap = user?.marketCap || card.valuationAtBuy;
              const returnPct = ((currentCap - card.valuationAtBuy) / card.valuationAtBuy * 100).toFixed(1);
              const isPos = parseFloat(returnPct) >= 0;
              return (
                <div key={i} onClick={() => navigate(`/user/${card.userId}`)} style={{
                  background: `linear-gradient(135deg, ${theme.surface} 0%, ${theme.bg} 100%)`,
                  border: `1px solid ${theme.accent}33`, borderRadius: 18,
                  padding: '16px 18px', marginBottom: 10, cursor: 'pointer', position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${theme.accent}, transparent)` }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <img src={card.avatar || user?.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', border: `1.5px solid ${theme.accent}44`, objectFit: 'cover' }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: theme.text }}>I believed in {card.name}</div>
                      <div style={{ fontSize: 11, color: theme.muted }}>on {card.date}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div><div style={{ fontSize: 10, color: theme.muted, marginBottom: 2 }}>Entry valuation</div><div style={{ fontSize: 12, fontWeight: 600, color: theme.text2 }}>${(card.valuationAtBuy / 1000).toFixed(0)}k</div></div>
                    <div style={{ textAlign: 'center' }}><div style={{ fontSize: 10, color: theme.muted, marginBottom: 2 }}>Amount</div><div style={{ fontSize: 12, fontWeight: 700, color: theme.accent }}>${card.amount}</div></div>
                    <div style={{ textAlign: 'right' }}><div style={{ fontSize: 10, color: theme.muted, marginBottom: 2 }}>Since entry</div><div style={{ fontSize: 15, fontWeight: 800, color: isPos ? theme.up : theme.down }}>{isPos ? '+' : ''}{returnPct}%</div></div>
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
          <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, background: theme.surface, borderRadius: '24px 24px 0 0', padding: '28px 20px 48px', zIndex: 201, border: `1px solid ${theme.accent}33`, boxShadow: '0 -8px 40px #00000088', animation: 'slideUp 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={insightPos.user.avatar} alt="" style={{ width: 42, height: 42, borderRadius: '50%', border: `1.5px solid ${insightPos.user.color}44`, objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: theme.text }}>{insightPos.user.name}</div>
                  <div style={{ fontSize: 11, color: theme.muted }}>Belief Analysis</div>
                </div>
              </div>
              <button onClick={() => setInsightPos(null)} style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={15} color={theme.muted} />
              </button>
            </div>

            {(() => {
              const pnl = insightPos.pnlPct;
              const signal = pnl > 10 ? { label: 'STRONG BELIEF', color: theme.up } : pnl > 0 ? { label: 'HOLD STEADY', color: theme.accent } : pnl > -10 ? { label: 'WATCH CLOSELY', color: '#D4A843' } : { label: 'RECONSIDER', color: theme.down };
              return (
                <div style={{ background: `${signal.color}18`, border: `1px solid ${signal.color}44`, borderRadius: 10, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: signal.color, letterSpacing: '0.06em' }}>{signal.label}</span>
                  <span style={{ fontSize: 13, color: insightPos.pnl >= 0 ? theme.up : theme.down, fontWeight: 700 }}>
                    {insightPos.pnl >= 0 ? '+' : ''}{insightPos.pnlPct.toFixed(1)}%
                  </span>
                </div>
              );
            })()}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {generateInsight(insightPos).map((line, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: theme.accent, marginTop: 6, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: theme.text2, lineHeight: 1.5 }}>{line}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setInsightPos(null); navigate(`/user/${insightPos.userId}`); }} style={{ flex: 1, background: theme.accent, color: '#221E1A', border: 'none', borderRadius: 14, padding: '13px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <ArrowUpRight size={15} /> Back more
              </button>
              <button onClick={() => setInsightPos(null)} style={{ flex: 1, background: theme.bg, color: theme.down, border: `1px solid ${theme.down}33`, borderRadius: 14, padding: '13px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <ArrowDownLeft size={15} /> Step back
              </button>
            </div>
          </div>
        </>
      )}

      <BottomNav onSettingsOpen={onSettingsOpen} />
    </div>
  );
}
