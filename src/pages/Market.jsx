import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, TrendingUp, TrendingDown } from 'lucide-react';
import { mockUsers } from '../data/mockData';
import TypeBadge from '../components/TypeBadge';
import MiniChart from '../components/MiniChart';
import { generateChart } from '../data/mockData';
import BottomNav from '../components/BottomNav';
import { useTheme } from '../context/ThemeContext';

function useLivePrices(users) {
  const [prices, setPrices] = useState(() => Object.fromEntries(users.map(u => [u.id, u.marketCap])));
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev };
        const u = users[Math.floor(Math.random() * users.length)];
        const delta = (Math.random() - 0.47) * u.marketCap * 0.006;
        next[u.id] = Math.max(1000, prev[u.id] + delta);
        return next;
      });
    }, 900);
    return () => clearInterval(interval);
  }, [users]);
  return prices;
}

const TABS = ['All', 'Gainers', 'Losers', 'Most Backed'];

export default function Market({ onSettingsOpen }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [tab, setTab] = useState('All');
  const [query, setQuery] = useState('');
  const livePrices = useLivePrices(mockUsers);
  const [flash, setFlash] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      const u = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      setFlash(f => ({ ...f, [u.id]: true }));
      setTimeout(() => setFlash(f => ({ ...f, [u.id]: false })), 600);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const enriched = mockUsers.map(u => ({
    ...u,
    livePrice: Math.round(livePrices[u.id] || u.marketCap),
    liveChange: ((livePrices[u.id] - u.marketCap) / u.marketCap * 100 + u.change),
  }));

  let users = [...enriched];
  if (tab === 'Gainers') users = users.filter(u => u.liveChange > 0).sort((a, b) => b.liveChange - a.liveChange);
  else if (tab === 'Losers') users = users.filter(u => u.liveChange < 0).sort((a, b) => a.liveChange - b.liveChange);
  else if (tab === 'Most Backed') users = users.sort((a, b) => b.investors - a.investors);
  else users = users.sort((a, b) => b.livePrice - a.livePrice);

  if (query) users = users.filter(u => u.name.toLowerCase().includes(query.toLowerCase()) || u.handle.toLowerCase().includes(query.toLowerCase()));

  const totalCap = enriched.reduce((s, u) => s + u.livePrice, 0);
  const topGainer = [...enriched].sort((a, b) => b.liveChange - a.liveChange)[0];
  const topLoser = [...enriched].sort((a, b) => a.liveChange - b.liveChange)[0];
  const mostBacked = [...enriched].sort((a, b) => b.investors - a.investors)[0];

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, paddingBottom: 90 }}>
      <style>{`
        @keyframes flashGreen { 0%,100% { background: transparent; } 50% { background: ${theme.up}18; } }
        @keyframes flashRed { 0%,100% { background: transparent; } 50% { background: ${theme.down}18; } }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>

      <div style={{ padding: '54px 20px 0', borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.text, letterSpacing: '-0.5px' }}>Human Market</div>
            <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>Live valuations - 24/7</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '5px 10px' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.up, animation: 'pulse 1.5s infinite' }} />
            <span style={{ fontSize: 10, color: theme.up, fontWeight: 700 }}>LIVE</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', margin: '14px 0' }}>
          {[
            { label: 'Market Cap', value: `$${(totalCap / 1000000).toFixed(1)}M`, color: theme.text },
            { label: 'Top Gainer', value: `${topGainer?.name.split(' ')[0]} +${topGainer?.liveChange.toFixed(1)}%`, color: theme.up },
            { label: 'Top Loser', value: `${topLoser?.name.split(' ')[0]} ${topLoser?.liveChange.toFixed(1)}%`, color: theme.down },
            { label: 'Most Backed', value: `${mostBacked?.name.split(' ')[0]} (${mostBacked?.investors})`, color: theme.accent },
          ].map(s => (
            <div key={s.label} style={{ flexShrink: 0, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 10, padding: '8px 12px' }}>
              <div style={{ fontSize: 9, color: theme.muted, marginBottom: 3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{s.label}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: s.color, whiteSpace: 'nowrap' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ position: 'relative', marginBottom: 14 }}>
          <Search size={14} color={theme.muted} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search people..." style={{ width: '100%', background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 12, padding: '11px 14px 11px 34px', color: theme.text, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'flex', gap: 4, paddingBottom: 14 }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? theme.accent : 'transparent',
              color: tab === t ? theme.bg : theme.muted,
              border: `1px solid ${tab === t ? theme.accent : theme.border}`,
              borderRadius: 16, padding: '5px 14px', fontSize: 11, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 60px 56px', padding: '10px 20px', borderBottom: `1px solid ${theme.border}` }}>
        {['Person', 'Valuation', 'Change', 'Backed'].map(h => (
          <div key={h} style={{ fontSize: 9, color: theme.muted, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: h !== 'Person' ? 'right' : 'left' }}>{h}</div>
        ))}
      </div>

      {users.map((user, idx) => {
        const positive = user.liveChange >= 0;
        const isFlashing = flash[user.id];
        return (
          <div key={user.id} onClick={() => navigate(`/user/${user.id}`)} style={{
            display: 'grid', gridTemplateColumns: '1fr 80px 60px 56px',
            padding: '12px 20px', borderBottom: `1px solid ${theme.border}`,
            cursor: 'pointer',
            animation: isFlashing ? (positive ? 'flashGreen 0.6s ease' : 'flashRed 0.6s ease') : 'none',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 10, color: theme.border2, fontWeight: 600, width: 16 }}>{idx + 1}</span>
              <img src={user.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', border: `1.5px solid ${user.color}44` }} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{user.name}</div>
                <div style={{ fontSize: 10, color: theme.muted }}>{user.handle}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>${(user.livePrice / 1000).toFixed(0)}k</div>
              <div style={{ marginTop: 3 }}>
                <MiniChart data={generateChart(user.marketCap, user.change, 12)} color={positive ? theme.up : theme.down} width={56} height={18} />
              </div>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: positive ? theme.up : theme.down }}>
                {positive ? '+' : ''}{user.liveChange.toFixed(1)}%
              </span>
            </div>
            <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: 12, color: theme.text2, fontWeight: 600 }}>{user.investors}</span>
            </div>
          </div>
        );
      })}

      <BottomNav onSettingsOpen={onSettingsOpen} />
    </div>
  );
}