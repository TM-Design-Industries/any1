import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { mockUsers } from '../data/mockData';
import BottomNav from '../components/BottomNav';
import { TrendingUp, TrendingDown, RefreshCw, Plus, ChevronRight, Zap, Star } from 'lucide-react';

const MOCK_POSITIONS = [
  { userId: '2', shares: 3, buyPrice: 185000, currentPrice: 210000 },
  { userId: '4', shares: 2, buyPrice: 220000, currentPrice: 198000 },
  { userId: '5', shares: 1, buyPrice: 95000,  currentPrice: 118000 },
  { userId: '7', shares: 4, buyPrice: 310000, currentPrice: 345000 },
  { userId: '9', shares: 2, buyPrice: 155000, currentPrice: 162000 },
];

function MiniSparkline({ positive }) {
  const w = 48, h = 20;
  const pts = positive
    ? [0,15,11,13,6,10,2,8,18,5,14,2].map((y,i) => `${i*(w/11)},${y}`)
    : [0,5,11,7,6,10,2,13,18,16,14,18].map((y,i) => `${i*(w/11)},${y}`);
  const color = positive ? '#6B9470' : '#B85449';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline points={pts.join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Portfolio({ onSettingsOpen }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [timeStr] = useState(() => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  const balance = parseFloat(localStorage.getItem('any1_balance') || '1000');
  const backerCards = JSON.parse(localStorage.getItem('any1_backer_cards') || '[]');

  // Build positions from mock + backer cards
  const positions = MOCK_POSITIONS.map(pos => {
    const user = mockUsers.find(u => u.id === pos.userId);
    if (!user) return null;
    const value = pos.shares * (pos.currentPrice / 1000);
    const cost = pos.shares * (pos.buyPrice / 1000);
    const pnl = value - cost;
    const pnlPct = ((value - cost) / cost) * 100;
    const dailyPnl = value * (user.change / 100);
    return { user, pos, value, cost, pnl, pnlPct, dailyPnl, positive: pnl >= 0, dailyPositive: user.change >= 0 };
  }).filter(Boolean);

  // Add backer cards as positions
  backerCards.forEach(card => {
    const user = mockUsers.find(u => u.id === card.userId);
    if (!user || positions.find(p => p.user.id === card.userId)) return;
    const value = card.amount * 1.12;
    const pnl = value - card.amount;
    positions.push({ user, pos: { shares: 1, buyPrice: card.valuationAtBuy, currentPrice: user.marketCap }, value, cost: card.amount, pnl, pnlPct: 12, dailyPnl: value * (user.change / 100), positive: true, dailyPositive: user.change >= 0 });
  });

  const totalValue = positions.reduce((s, p) => s + p.value, 0);
  const totalPnl = positions.reduce((s, p) => s + p.pnl, 0);
  const totalDailyPnl = positions.reduce((s, p) => s + p.dailyPnl, 0);
  const portfolioPct = totalValue / (totalValue + balance) * 100;
  const potentialValue = totalValue * 1.23;
  const potentialProgress = Math.min(95, (totalValue / potentialValue) * 100);

  const handleDeposit = () => {
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;
    const newBal = balance + amt;
    localStorage.setItem('any1_balance', newBal.toString());
    setShowDeposit(false);
    setDepositAmount('');
    window.location.reload();
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, paddingBottom: 100, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Header */}
      <div style={{ padding: '52px 20px 0', background: theme.bg }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>People I Believe In</div>
          <RefreshCw size={17} color={theme.muted} style={{ cursor: 'pointer' }} />
        </div>

        {/* Total value */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: theme.muted, marginBottom: 4 }}>Total Value</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <div style={{ fontSize: 38, fontWeight: 900, color: theme.text, letterSpacing: '-1.5px', lineHeight: 1 }}>
              ${(totalValue + balance).toFixed(0)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {totalDailyPnl >= 0 ? <TrendingUp size={13} color={theme.up} /> : <TrendingDown size={13} color={theme.down} />}
              <span style={{ fontSize: 13, fontWeight: 700, color: totalDailyPnl >= 0 ? theme.up : theme.down }}>
                {totalDailyPnl >= 0 ? '+' : ''}${Math.abs(totalDailyPnl).toFixed(0)} today
              </span>
            </div>
          </div>
          <div style={{ fontSize: 12, color: theme.muted, marginTop: 4 }}>Last updated {timeStr}</div>
        </div>

        {/* Split bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ width: `${portfolioPct}%`, background: theme.accent, transition: 'width 0.5s ease' }} />
            <div style={{ flex: 1, background: `${theme.muted}44` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: theme.accent }} />
              <span style={{ fontSize: 11, color: theme.muted }}>People <span style={{ color: theme.text, fontWeight: 700 }}>${totalValue.toFixed(0)}</span></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: `${theme.muted}44` }} />
              <span style={{ fontSize: 11, color: theme.muted }}>Cash <span style={{ color: theme.text, fontWeight: 700 }}>${balance.toFixed(0)}</span></span>
            </div>
          </div>
        </div>

        {/* Potential Value card */}
        <div style={{
          background: `linear-gradient(135deg, ${theme.surface} 0%, ${theme.surface2} 100%)`,
          border: `1px solid ${theme.accent}33`,
          borderRadius: 16, padding: '16px 18px', marginBottom: 24, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${theme.accent}, transparent)` }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Zap size={14} color={theme.accent} fill={theme.accent} />
            <span style={{ fontSize: 12, fontWeight: 700, color: theme.accent, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your Potential</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: theme.muted, marginBottom: 2 }}>Current</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>${totalValue.toFixed(0)}</div>
            </div>
            <div style={{ color: theme.muted, fontSize: 18 }}>→</div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: theme.accent, marginBottom: 2 }}>Potential</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: theme.accent }}>${potentialValue.toFixed(0)}</div>
            </div>
          </div>
          {/* Progress bar */}
          <div style={{ position: 'relative', height: 6, background: `${theme.accent}22`, borderRadius: 3 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${potentialProgress}%`, background: theme.accent, borderRadius: 3, transition: 'width 1s ease' }} />
          </div>
          <div style={{ fontSize: 11, color: theme.muted, marginTop: 8, lineHeight: 1.5 }}>
            Based on your activity, missions completed, and market trends - you could reach <span style={{ color: theme.accent, fontWeight: 700 }}>${potentialValue.toFixed(0)}</span> in ~30 days
          </div>
        </div>
      </div>

      {/* Portfolio list */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>
            People I Support <span style={{ fontSize: 13, color: theme.muted, fontWeight: 500 }}>({positions.length})</span>
          </div>
          <select style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '5px 10px', color: theme.muted, fontSize: 12, cursor: 'pointer', outline: 'none' }}>
            <option>Best performers</option>
            <option>Most recent</option>
            <option>Highest value</option>
          </select>
        </div>

        {/* Column headers */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 72px 72px 64px', padding: '0 4px 8px', borderBottom: `1px solid ${theme.border}` }}>
          {['Person', 'Value', 'Daily', 'Total P/L'].map((h, i) => (
            <div key={h} style={{ fontSize: 10, color: theme.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', textAlign: i > 0 ? 'right' : 'left' }}>{h}</div>
          ))}
        </div>

        {positions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 0', color: theme.muted, fontSize: 14 }}>
            <Star size={32} color={theme.border2} style={{ display: 'block', margin: '0 auto 12px' }} />
            You haven't backed anyone yet.<br />Go to Discover and start believing!
          </div>
        ) : positions.map(p => (
          <div
            key={p.user.id}
            onClick={() => navigate(`/user/${p.user.id}`)}
            style={{
              display: 'grid', gridTemplateColumns: '1fr 72px 72px 64px',
              alignItems: 'center', padding: '12px 4px',
              borderBottom: `1px solid ${theme.border}`,
              cursor: 'pointer', transition: 'background 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = theme.surface2}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {/* Person */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={p.user.avatar} alt="" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', border: `1.5px solid ${p.user.color || theme.accent}44`, flexShrink: 0 }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.text, marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.user.name}
                </div>
                <div style={{ fontSize: 10, color: theme.muted }}>{p.user.handle}</div>
              </div>
            </div>

            {/* Current value */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>${p.value.toFixed(0)}</div>
              <MiniSparkline positive={p.dailyPositive} />
            </div>

            {/* Daily P/L */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: p.dailyPositive ? theme.up : theme.down }}>
                {p.dailyPositive ? '+' : ''}${Math.abs(p.dailyPnl).toFixed(0)}
              </div>
              <div style={{ fontSize: 10, color: p.dailyPositive ? theme.up : theme.down }}>
                {p.dailyPositive ? '+' : ''}{p.user.change}%
              </div>
            </div>

            {/* Total P/L */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: p.positive ? theme.up : theme.down }}>
                {p.positive ? '+' : ''}${Math.abs(p.pnl).toFixed(0)}
              </div>
              <div style={{ fontSize: 10, color: p.positive ? theme.up : theme.down }}>
                {p.positive ? '+' : ''}{p.pnlPct.toFixed(1)}%
              </div>
            </div>
          </div>
        ))}

        {/* Summary row */}
        {positions.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 4px', borderTop: `2px solid ${theme.border}`, marginTop: 4 }}>
            <div>
              <div style={{ fontSize: 11, color: theme.muted, marginBottom: 2 }}>Total Return</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: totalPnl >= 0 ? theme.up : theme.down }}>
                {totalPnl >= 0 ? '+' : ''}${totalPnl.toFixed(0)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: theme.muted, marginBottom: 2 }}>People I Believe In</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>${totalValue.toFixed(0)}</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer - balance + add funds */}
      <div style={{ position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, padding: '14px 20px', background: theme.navBg, backdropFilter: 'blur(12px)', borderTop: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div>
          <div style={{ fontSize: 11, color: theme.muted }}>Available Balance</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>${balance.toFixed(0)}</div>
        </div>
        <button onClick={() => setShowDeposit(true)} style={{ background: theme.accent, color: '#1C1A18', border: 'none', borderRadius: 14, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={15} />Add Funds
        </button>
      </div>

      {/* Deposit modal */}
      {showDeposit && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: 430, margin: '0 auto', background: theme.surface, borderRadius: '24px 24px 0 0', padding: '28px 20px 48px', border: `1px solid ${theme.accent}33`, animation: 'slideUp 0.3s ease' }}>
            <div style={{ width: 36, height: 4, background: theme.border2, borderRadius: 2, margin: '0 auto 24px' }} />
            <div style={{ fontSize: 18, fontWeight: 800, color: theme.text, marginBottom: 6 }}>Grow Your Value</div>
            <div style={{ fontSize: 13, color: theme.muted, marginBottom: 24, lineHeight: 1.5 }}>
              Adding funds increases your standing in the any1 ecosystem. More value = more impact.
            </div>
            <div style={{ fontSize: 11, color: theme.muted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Amount</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {['50', '100', '500', '1000'].map(v => (
                <button key={v} onClick={() => setDepositAmount(v)} style={{ flex: 1, background: depositAmount === v ? `${theme.accent}22` : theme.surface2, border: `1px solid ${depositAmount === v ? theme.accent : theme.border2}`, borderRadius: 10, padding: '10px 4px', color: depositAmount === v ? theme.accent : theme.muted, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>${v}</button>
              ))}
            </div>
            <input type="number" placeholder="Custom amount..." value={depositAmount} onChange={e => setDepositAmount(e.target.value)} style={{ width: '100%', background: theme.surface2, border: `1px solid ${theme.border2}`, borderRadius: 12, padding: '13px 16px', color: theme.text, fontSize: 15, outline: 'none', marginBottom: 16, boxSizing: 'border-box', fontFamily: 'inherit' }} />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowDeposit(false)} style={{ flex: 1, background: theme.surface2, color: theme.muted, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleDeposit} style={{ flex: 2, background: depositAmount ? theme.accent : theme.surface2, color: depositAmount ? '#1C1A18' : theme.muted, border: 'none', borderRadius: 14, padding: 14, fontSize: 15, fontWeight: 700, cursor: depositAmount ? 'pointer' : 'default' }}>
                {depositAmount ? `Add $${depositAmount}` : 'Enter amount'}
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav onSettingsOpen={onSettingsOpen} />
    </div>
  );
}
