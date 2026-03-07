import { useParams, useNavigate } from 'react-router-dom';
import { mockUsers, myPortfolio } from '../data/mockData';
import MiniChart from '../components/MiniChart';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';

export default function UserPortfolio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = mockUsers.find(u => u.id === id);
  const pos = myPortfolio.find(p => p.userId === id);

  if (!user || !pos) return null;

  const value = pos.shares * (pos.currentPrice / 1000);
  const cost = pos.shares * (pos.buyPrice / 1000);
  const pnl = value - cost;
  const pnlPct = ((value - cost) / cost) * 100;
  const positive = pnl >= 0;

  return (
    <div style={{ minHeight: '100vh', background: '#221E1A', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{
        padding: '54px 20px 16px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid #1F1F1F',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(ellipse at top right, ${user.color}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
        <button onClick={() => navigate(-1)} style={{
          background: '#332D27', border: '1px solid #1F1F1F',
          borderRadius: 10, padding: 8, cursor: 'pointer',
        }}>
          <ArrowLeft size={18} color="#F2EDE6" />
        </button>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#F2EDE6' }}>
          My position in {user.name.split(' ')[0]}
        </div>
      </div>

      <div style={{ padding: '24px 20px' }}>
        {/* User info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <img src={user.avatar} alt={user.name} style={{
            width: 56, height: 56, borderRadius: '50%',
            border: `2px solid ${user.color}55`,
          }} />
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#F2EDE6' }}>{user.name}</div>
            <div style={{ fontSize: 13, color: '#7A6E62' }}>{user.handle}</div>
          </div>
        </div>

        {/* PnL card */}
        <div style={{
          background: positive ? '#C9A84C11' : '#E0555511',
          border: `1px solid ${positive ? '#C9A84C33' : '#E0555533'}`,
          borderRadius: 20, padding: '24px 20px', marginBottom: 16,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ fontSize: 12, color: '#7A6E62', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            My Return
          </div>
          <div style={{
            fontSize: 40, fontWeight: 900, letterSpacing: '-1.5px',
            color: positive ? '#C9A84C' : '#C0564A', marginBottom: 4,
          }}>
            {positive ? '+' : ''}{pnlPct.toFixed(2)}%
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: positive ? '#C9A84C' : '#C0564A', fontSize: 15, fontWeight: 600 }}>
            {positive ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
            {positive ? '+' : ''}${pnl.toFixed(2)}
          </div>
        </div>

        {/* Chart */}
        <div style={{
          background: '#2A2520', border: '1px solid #1F1F1F',
          borderRadius: 16, padding: 16, marginBottom: 16,
        }}>
          <MiniChart base={user.marketCap} change={user.change} width={320} height={70} />
        </div>

        {/* Details */}
        {[
          { label: 'Shares held', value: pos.shares },
          { label: 'Current value', value: `$${value.toFixed(2)}` },
          { label: 'Cost basis', value: `$${cost.toFixed(2)}` },
          { label: 'Current market cap', value: `$${user.marketCap.toLocaleString()}` },
          { label: 'Entry market cap', value: `$${pos.buyPrice.toLocaleString()}` },
        ].map(row => (
          <div key={row.label} style={{
            display: 'flex', justifyContent: 'space-between',
            padding: '12px 0',
            borderBottom: '1px solid #1A1A1A',
          }}>
            <span style={{ color: '#7A6E62', fontSize: 14 }}>{row.label}</span>
            <span style={{ color: '#F2EDE6', fontSize: 14, fontWeight: 600 }}>{row.value}</span>
          </div>
        ))}

        {/* Sell button */}
        <button style={{
          width: '100%', marginTop: 24,
          background: '#332D27', color: '#C0564A',
          border: '1px solid #E0555533',
          borderRadius: 14, padding: 14,
          fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>
          Sell Position
        </button>
      </div>
    </div>
  );
}



