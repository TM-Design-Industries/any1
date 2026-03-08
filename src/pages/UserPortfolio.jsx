import { useParams, useNavigate } from 'react-router-dom';
import { mockUsers, myPortfolio } from '../data/mockData';
import MiniChart from '../components/MiniChart';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function UserPortfolio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const user = mockUsers.find(u => u.id === id);
  const pos = myPortfolio.find(p => p.userId === id);

  if (!user || !pos) return null;

  const value = pos.shares * (pos.currentPrice / 1000);
  const cost = pos.shares * (pos.buyPrice / 1000);
  const pnl = value - cost;
  const pnlPct = ((value - cost) / cost) * 100;
  const positive = pnl >= 0;

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, paddingBottom: 40 }}>
      <div style={{
        padding: '54px 20px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: `1px solid ${theme.border}`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(ellipse at top right, ${user.color}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <button onClick={() => navigate(-1)} style={{
          background: theme.surface, border: `1px solid ${theme.border}`,
          borderRadius: 10, padding: 8, cursor: 'pointer',
        }}>
          <ArrowLeft size={18} color={theme.text} />
        </button>
        <div style={{ fontSize: 16, fontWeight: 600, color: theme.text }}>
          My position in {user.name.split(' ')[0]}
        </div>
      </div>

      <div style={{ padding: '24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <img src={user.avatar} alt={user.name} style={{ width: 56, height: 56, borderRadius: '50%', border: `2px solid ${user.color}55` }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: theme.text }}>{user.name}</div>
            <div style={{ fontSize: 13, color: theme.muted }}>{user.handle}</div>
          </div>
        </div>

        <div style={{
          background: positive ? `${theme.accent}11` : `${theme.down}11`,
          border: `1px solid ${positive ? theme.accent : theme.down}33`,
          borderRadius: 20, padding: '24px 20px', marginBottom: 16,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontSize: 12, color: theme.muted, marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>My Return</div>
          <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-1.5px', color: positive ? theme.accent : theme.down, marginBottom: 4 }}>
            {positive ? '+' : ''}{pnlPct.toFixed(2)}%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: positive ? theme.accent : theme.down, fontSize: 15, fontWeight: 600 }}>
            {positive ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
            {positive ? '+' : ''}${pnl.toFixed(2)}
          </div>
        </div>

        <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <MiniChart base={user.marketCap} change={user.change} width={320} height={70} />
        </div>

        {[
          { label: 'Shares held', value: pos.shares },
          { label: 'Current value', value: `$${value.toFixed(2)}` },
          { label: 'Cost basis', value: `$${cost.toFixed(2)}` },
          { label: 'Current market cap', value: `$${user.marketCap.toLocaleString()}` },
          { label: 'Entry market cap', value: `$${pos.buyPrice.toLocaleString()}` },
        ].map(row => (
          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${theme.border}` }}>
            <span style={{ color: theme.muted, fontSize: 14 }}>{row.label}</span>
            <span style={{ color: theme.text, fontSize: 14, fontWeight: 600 }}>{row.value}</span>
          </div>
        ))}

        <button style={{
          width: '100%', marginTop: 24, background: theme.surface,
          color: theme.down, border: `1px solid ${theme.down}33`,
          borderRadius: 14, padding: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>
          Sell Position
        </button>
      </div>
    </div>
  );
}