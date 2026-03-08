import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers, myPortfolio, generateChart } from '../data/mockData';
import BottomNav from '../components/BottomNav';
import MiniChart from '../components/MiniChart';
import {
  TrendingUp, TrendingDown, BarChart2, X,
  ArrowUpRight, ArrowDownLeft, RefreshCw,
  Plus, ChevronDown, Zap, Star, Users
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/* ─── Insight generator ─────────────────────────── */
function generateInsight(pos) {
  const u = pos.user;
  const pnl = pos.pnlPct;
  const signal =
    pnl > 10 ? 'STRONG BELIEF' :
    pnl > 0  ? 'HOLD STEADY'   :
    pnl > -10? 'WATCH CLOSELY' : 'RECONSIDER';
  const signalColor = pnl > 10 ? '#7A9E7E' : pnl > 0 ? '#C9A84C' : pnl > -10 ? '#D4A843' : '#C0564A';
  const lines = [];
  if (u.change > 5)       lines.push(`Up ${u.change}% this week — strong momentum.`);
  else if (u.change < 0)  lines.push(`Down ${Math.abs(u.change)}% this week — monitor activity.`);
  else                    lines.push(`Stable week (+${u.change}%).`);
  if (u.investors > 100)  lines.push(`${u.investors} people believe in them — high community trust.`);
  else if (u.investors < 20) lines.push(`Only ${u.investors} backers — early stage, high potential.`);
  if (u.missions > 3)     lines.push(`Active on ${u.missions} missions — consistently delivering.`);
  if (pnl > 15)           lines.push(`Your belief is up ${pnl.toFixed(1)}% — well-timed entry.`);
  else if (pnl < -10)     lines.push(`Your belief is down ${Math.abs(pnl).toFixed(1)}% — reassess your thesis.`);
  return { lines, signal, signalColor };
}

/* ─── Potential section ─────────────────────────── */
function PotentialBar({ balance, totalValue, theme }) {
  const myProfile = mockUsers.find(u => u.id === '1');
  const myVal    = myProfile?.marketCap || 50000;
  const myChange = myProfile?.change    || 0;

  // "Unlock potential" scenarios
  const scenarios = [
    {
      label: 'Complete 2 missions',
      delta: 0.18,
      icon: Zap,
      color: '#C9A84C',
      desc: 'Missions signal execution. +18% valuation boost.',
    },
    {
      label: 'Gain 10 more backers',
      delta: 0.12,
      icon: Users,
      color: '#7B6FBF',
      desc: 'Social proof multiplies your perceived value.',
    },
    {
      label: 'Post weekly update',
      delta: 0.08,
      icon: Star,
      color: '#4BBFB5',
      desc: 'Consistent visibility grows backer confidence.',
    },
  ];

  const maxPotential = myVal * (1 + scenarios.reduce((s, sc) => s + sc.delta, 0));

  return (
    <div style={{ padding: '0 16px 20px' }}>
      {/* My valuation now */}
      <div style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: 18, padding: '16px',
        marginBottom: 10,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 11, color: theme.muted, marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>My current value</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: theme.text, letterSpacing: '-0.5px' }}>
              ${(myVal / 1000).toFixed(0)}k
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: myChange >= 0 ? '#7A9E7E18' : '#C0564A18', borderRadius: 10, padding: '6px 12px', border: `1px solid ${myChange >= 0 ? '#7A9E7E44' : '#C0564A44'}` }}>
            {myChange >= 0 ? <TrendingUp size={14} color="#7A9E7E" /> : <TrendingDown size={14} color="#C0564A" />}
            <span style={{ fontSize: 14, fontWeight: 700, color: myChange >= 0 ? '#7A9E7E' : '#C0564A' }}>
              {myChange >= 0 ? '+' : ''}{myChange}%
            </span>
          </div>
        </div>

        {/* Value bar */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: theme.muted }}>Current</span>
            <span style={{ fontSize: 10, color: '#C9A84C' }}>Potential</span>
          </div>
          <div style={{ position: 'relative', height: 8, background: `${theme.accent}22`, borderRadius: 4, overflow: 'visible' }}>
            {/* current fill */}
            <div style={{
              position: 'absolute', top: 0, left: 0,
              width: `${(myVal / maxPotential) * 100}%`,
              height: '100%', background: theme.accent,
              borderRadius: 4, transition: 'width 0.6s ease',
            }} />
            {/* potential marker */}
            <div style={{
              position: 'absolute', top: '50%', right: 0,
              transform: 'translateY(-50%)',
              width: 12, height: 12, borderRadius: '50%',
              background: '#C9A84C', border: `2px solid ${theme.bg}`,
              boxShadow: '0 0 8px #C9A84C88',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: theme.text }}>${(myVal / 1000).toFixed(0)}k</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#C9A84C' }}>${(maxPotential / 1000).toFixed(0)}k</span>
          </div>
        </div>
      </div>

      {/* Scenarios */}
      <div style={{ fontSize: 11, color: theme.muted, marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 2px' }}>
        Unlock your potential
      </div>
      {scenarios.map((s, i) => {
        const Icon = s.icon;
        const uplift = (myVal * s.delta / 1000).toFixed(0);
        return (
          <div key={i} style={{
            background: theme.surface,
            border: `1px solid ${s.color}22`,
            borderRadius: 14, padding: '12px 14px',
            marginBottom: 8,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={15} color={s.color} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: theme.muted, lineHeight: 1.4 }}>{s.desc}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: s.color }}>+${uplift}k</div>
              <div style={{ fontSize: 10, color: theme.muted }}>+{(s.delta * 100).toFixed(0)}%</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main ──────────────────────────────────────── */
export default function Portfolio({ onSettingsOpen }) {
  const navigate  = useNavigate();
  const { theme } = useTheme();
  const [insightPos, setInsightPos] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [tab, setTab]   = useState('all');
  const [sort, setSort] = useState('value'); // value | return | name

  const balance = parseFloat(localStorage.getItem('any1_balance') || '1029.58');

  /* Build positions */
  const positions = useMemo(() => {
    const lsPortfolio = JSON.parse(localStorage.getItem('any1_portfolio') || '[]');
    const combined = [...myPortfolio];
    lsPortfolio.forEach(lp => {
      if (!combined.find(p => p.userId === lp.userId))
        combined.push({ userId: lp.userId, shares: lp.shares || 1, buyPrice: lp.buyPrice, currentPrice: lp.currentPrice || lp.buyPrice });
    });
    return combined.map(p => {
      const user = mockUsers.find(u => u.id === p.userId);
      if (!user) return null;
      const currentPrice = p.currentPrice || user.marketCap;
      const pnlAmt = (currentPrice - p.buyPrice) / 1000 * p.shares;
      const pnlPct = ((currentPrice - p.buyPrice) / p.buyPrice) * 100;
      const value  = currentPrice / 1000 * p.shares;
      return { ...p, user, value, pnl: pnlAmt, pnlPct, currentPrice };
    }).filter(Boolean);
  }, [refreshKey]);

  const backerCards = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('any1_backer_cards') || '[]'); } catch { return []; }
  }, [refreshKey]);

  const totalValue = positions.reduce((s, p) => s + p.value, 0);
  const totalPnl   = positions.reduce((s, p) => s + p.pnl,   0);
  const totalAccount = totalValue + balance;
  const portfolioPct = totalAccount > 0 ? (totalValue / totalAccount) * 100 : 0;
  const cashPct      = totalAccount > 0 ? (balance    / totalAccount) * 100 : 100;

  const now     = new Date();
  const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}, ${String(now.getDate()).padStart(2,'0')}/${String(now.getMonth()+1).padStart(2,'0')}/${now.getFullYear()}`;

  /* Filter + sort */
  let filtered = [...positions];
  if (tab === 'up')   filtered = filtered.filter(p => p.pnl >= 0);
  if (tab === 'down') filtered = filtered.filter(p => p.pnl  < 0);
  if (sort === 'value')  filtered.sort((a, b) => b.value  - a.value);
  if (sort === 'return') filtered.sort((a, b) => b.pnlPct - a.pnlPct);
  if (sort === 'name')   filtered.sort((a, b) => a.user.name.localeCompare(b.user.name));

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, paddingBottom: 100, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* ── TOP BAR ── */}
      <div style={{ padding: '52px 20px 0', background: theme.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>My Portfolio</div>
          <button onClick={() => setRefreshKey(k => k+1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <RefreshCw size={17} color={theme.muted} />
          </button>
        </div>

        {/* Total Value */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 12, color: theme.muted, marginBottom: 4 }}>Your Total Value</div>
          <div style={{ fontSize: 36, fontWeight: 900, color: theme.text, letterSpacing: '-1.5px', lineHeight: 1 }}>
            ${totalAccount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 12, color: theme.muted, marginTop: 6 }}>Last update at {timeStr}</div>
        </div>

        {/* Split bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 2, marginBottom: 12 }}>
            <div style={{ width: `${portfolioPct}%`, background: theme.accent, transition: 'width 0.5s ease' }} />
            <div style={{ flex: 1, background: `${theme.muted}44` }} />
          </div>
          <div style={{ display: 'flex', gap: 28 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 3, height: 34, background: theme.accent, borderRadius: 2, marginTop: 1, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, color: theme.text, lineHeight: 1 }}>
                  {portfolioPct.toFixed(1)}<span style={{ fontSize: 13, color: theme.muted, fontWeight: 500 }}>%</span>
                </div>
                <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>People Portfolio</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
              <div style={{ width: 3, height: 34, background: theme.muted, borderRadius: 2, marginTop: 1, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 20, fontWeight: 900, color: theme.text, lineHeight: 1 }}>
                  {cashPct.toFixed(1)}<span style={{ fontSize: 13, color: theme.muted, fontWeight: 500 }}>%</span>
                </div>
                <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>Available Cash</div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 stat cards */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[
            { label: 'Portfolio',    value: `$${totalValue.toFixed(0)}`,                   color: theme.text },
            { label: 'Total return', value: `${totalPnl >= 0 ? '+' : ''}$${totalPnl.toFixed(2)}`, color: totalPnl >= 0 ? theme.up : theme.down },
            { label: 'Cash',         value: `$${balance.toFixed(0)}`,                      color: theme.accent },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: '11px 12px' }}>
              <div style={{ fontSize: 9, color: theme.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MY POTENTIAL ── */}
      <PotentialBar balance={balance} totalValue={totalValue} theme={theme} />

      {/* ── PORTFOLIO LIST ── */}
      <div style={{ padding: '0 16px' }}>
        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>
            People I back <span style={{ fontSize: 13, color: theme.muted, fontWeight: 500 }}>({positions.length})</span>
          </div>
          {/* Sort selector */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '5px 10px', color: theme.muted, fontSize: 12, cursor: 'pointer', outline: 'none' }}
          >
            <option value="value">By value</option>
            <option value="return">By return</option>
            <option value="name">By name</option>
          </select>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          {[
            { id: 'all',  label: `All (${positions.length})` },
            { id: 'up',   label: `Gaining (${positions.filter(p => p.pnl >= 0).length})` },
            { id: 'down', label: `Falling (${positions.filter(p => p.pnl  < 0).length})` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? theme.accent : theme.surface,
              color:      tab === t.id ? '#221E1A'   : theme.muted,
              border: `1px solid ${tab === t.id ? theme.accent : theme.border}`,
              borderRadius: 20, padding: '6px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Column headers */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 70px 70px 30px',
          padding: '0 4px 8px', borderBottom: `1px solid ${theme.border}`,
        }}>
          {['Person', 'Return', 'Value', ''].map((h, i) => (
            <div key={i} style={{ fontSize: 10, color: theme.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: i > 0 ? 'right' : 'left' }}>{h}</div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '36px 0', color: theme.muted, fontSize: 14 }}>
            No positions in this view.
          </div>
        )}
        {filtered.map(pos => {
          const positive = pos.pnl >= 0;
          return (
            <div key={pos.userId} style={{
              display: 'grid', gridTemplateColumns: '1fr 70px 70px 30px',
              alignItems: 'center', padding: '11px 4px',
              borderBottom: `1px solid ${theme.border}`,
            }}>
              {/* Person */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                onClick={() => navigate(`/user/${pos.userId}`)}>
                <img src={pos.user.avatar} alt="" style={{
                  width: 40, height: 40, borderRadius: '50%',
                  border: `1.5px solid ${pos.user.color || theme.accent}44`,
                  objectFit: 'cover', flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 1 }}>
                    {pos.user.name}
                  </div>
                  <div style={{ fontSize: 10, color: theme.muted }}>
                    {pos.shares} {pos.shares === 1 ? 'share' : 'shares'}
                  </div>
                </div>
              </div>

              {/* Return */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: positive ? theme.up : theme.down }}>
                  {positive ? '+' : ''}{pos.pnlPct.toFixed(1)}%
                </div>
                <div style={{ fontSize: 10, color: theme.muted }}>
                  {positive ? '+' : ''}${pos.pnl.toFixed(2)}
                </div>
              </div>

              {/* Value + spark */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: theme.text }}>${pos.value.toFixed(2)}</div>
                <MiniChart
                  data={generateChart(pos.user.marketCap, pos.user.change, 10)}
                  color={positive ? theme.up : theme.down}
                  width={52} height={16}
                />
              </div>

              {/* Insight btn */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setInsightPos(pos)} style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: theme.surface, border: `1px solid ${theme.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                  <BarChart2 size={12} color={theme.accent} />
                </button>
              </div>
            </div>
          );
        })}

        {/* Cash footer row */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 4px', borderTop: `2px solid ${theme.border}`,
          marginTop: 6,
        }}>
          <div>
            <div style={{ fontSize: 11, color: theme.muted, marginBottom: 2 }}>Available Cash</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: theme.text }}>
              ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <button onClick={() => navigate('/discover')} style={{
            background: theme.accent, color: '#221E1A',
            border: 'none', borderRadius: 24,
            padding: '12px 22px', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Plus size={15} /> Back someone
          </button>
        </div>

        {/* Backer Cards */}
        {backerCards.length > 0 && (
          <div style={{ marginTop: 28, marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: theme.muted, marginBottom: 14, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              My Backer Cards
            </div>
            {backerCards.map((card, i) => {
              const user       = mockUsers.find(u => u.id === card.userId);
              const currentCap = user?.marketCap || card.valuationAtBuy;
              const retPct     = ((currentCap - card.valuationAtBuy) / card.valuationAtBuy * 100).toFixed(1);
              const isPos      = parseFloat(retPct) >= 0;
              return (
                <div key={i}
                  onClick={() => navigate(`/user/${card.userId}`)}
                  style={{
                    background: `linear-gradient(135deg, ${theme.surface} 0%, ${theme.bg} 100%)`,
                    border: `1px solid ${theme.accent}33`,
                    borderRadius: 18, padding: '16px 18px',
                    marginBottom: 10, cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${theme.accent}, transparent)` }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <img src={card.avatar || user?.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: `1.5px solid ${theme.accent}44` }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: theme.text }}>I believed in {card.name}</div>
                      <div style={{ fontSize: 11, color: theme.muted }}>on {card.date}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 10, color: theme.muted, marginBottom: 2 }}>Entry valuation</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: theme.text2 }}>${(card.valuationAtBuy / 1000).toFixed(0)}k</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: theme.muted, marginBottom: 2 }}>Amount</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: theme.accent }}>${card.amount}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, color: theme.muted, marginBottom: 2 }}>Since entry</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: isPos ? theme.up : theme.down }}>
                        {isPos ? '+' : ''}{retPct}%
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── INSIGHT PANEL ── */}
      {insightPos && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: '#000000aa', zIndex: 200 }}
            onClick={() => setInsightPos(null)} />
          <div style={{
            position: 'fixed', bottom: 0,
            left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 430,
            background: theme.surface,
            borderRadius: '24px 24px 0 0',
            padding: '28px 20px 52px',
            zIndex: 201,
            border: `1px solid ${theme.accent}33`,
            boxShadow: '0 -8px 40px #00000088',
            animation: 'slideUp 0.3s ease',
          }}>
            {/* Drag handle */}
            <div style={{ width: 40, height: 4, borderRadius: 2, background: theme.border, margin: '0 auto 20px' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={insightPos.user.avatar} alt="" style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover', border: `1.5px solid ${theme.accent}44` }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: theme.text }}>{insightPos.user.name}</div>
                  <div style={{ fontSize: 11, color: theme.muted }}>Belief Analysis</div>
                </div>
              </div>
              <button onClick={() => setInsightPos(null)} style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <X size={14} color={theme.muted} />
              </button>
            </div>

            {(() => {
              const { lines, signal, signalColor } = generateInsight(insightPos);
              return (
                <>
                  <div style={{ background: `${signalColor}18`, border: `1px solid ${signalColor}44`, borderRadius: 10, padding: '10px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: signalColor, letterSpacing: '0.06em' }}>{signal}</span>
                    <span style={{ fontSize: 14, color: insightPos.pnl >= 0 ? theme.up : theme.down, fontWeight: 700 }}>
                      {insightPos.pnl >= 0 ? '+' : ''}{insightPos.pnlPct.toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                    {lines.map((line, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: theme.accent, marginTop: 6, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: theme.text2, lineHeight: 1.5 }}>{line}</span>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setInsightPos(null); navigate(`/user/${insightPos.userId}`); }}
                style={{ flex: 1, background: theme.accent, color: '#221E1A', border: 'none', borderRadius: 14, padding: '13px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <ArrowUpRight size={15} /> Back more
              </button>
              <button onClick={() => setInsightPos(null)}
                style={{ flex: 1, background: theme.bg, color: theme.down, border: `1px solid ${theme.down}33`, borderRadius: 14, padding: '13px 0', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
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
