import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, TrendingUp, TrendingDown } from 'lucide-react';
import { mockUsers } from '../data/mockData';
import TypeBadge from '../components/TypeBadge';

const TABS = ['All', 'Gainers', 'Losers'];

export default function Market() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('All');
  const [query, setQuery] = useState('');

  const totalCap = mockUsers.reduce((s, u) => s + u.marketCap, 0);

  let users = [...mockUsers];
  if (tab === 'Gainers') users = users.filter(u => u.change > 0);
  if (tab === 'Losers') users = users.filter(u => u.change < 0);
  if (query) users = users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.handle.toLowerCase().includes(query.toLowerCase())
  );
  users.sort((a, b) => b.marketCap - a.marketCap);

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{
        padding: '54px 20px 16px',
        borderBottom: '1px solid #1F1F1F',
        background: '#0A0A0A',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: '#111', border: '1px solid #1F1F1F',
              borderRadius: 10, padding: 8, cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} color="#FFF" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#FFF' }}>Any1 Market</div>
            <div style={{ fontSize: 12, color: '#555' }}>
              ${(totalCap / 1000).toFixed(1)}k total cap - {mockUsers.length} people
            </div>
          </div>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: '#111', border: '1px solid #1F1F1F',
          borderRadius: 14, padding: '10px 14px', marginBottom: 12,
        }}>
          <Search size={16} color="#444" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by name or handle..."
            style={{
              flex: 1, background: 'none', border: 'none',
              color: '#FFF', fontSize: 14, outline: 'none',
            }}
          />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6 }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? '#8B9E6E' : '#111',
                color: tab === t ? '#0A0A0A' : '#555',
                border: `1px solid ${tab === t ? '#8B9E6E' : '#1F1F1F'}`,
                borderRadius: 16, padding: '6px 16px',
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '10px 16px',
        borderBottom: '1px solid #1A1A1A',
      }}>
        <span style={{ width: 32, fontSize: 10, color: '#444', letterSpacing: '0.06em' }}>#</span>
        <span style={{ flex: 1, fontSize: 10, color: '#444', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Name</span>
        <span style={{ width: 80, fontSize: 10, color: '#444', textAlign: 'right', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Cap</span>
        <span style={{ width: 60, fontSize: 10, color: '#444', textAlign: 'right', letterSpacing: '0.06em', textTransform: 'uppercase' }}>24h</span>
      </div>

      {/* Rows */}
      <div>
        {users.map((user, idx) => {
          const positive = user.change >= 0;
          return (
            <div
              key={user.id}
              onClick={() => navigate(`/user/${user.id}`)}
              style={{
                display: 'flex', alignItems: 'center',
                padding: '12px 16px',
                borderBottom: '1px solid #111',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
            >
              <span style={{ width: 32, fontSize: 13, color: '#444', fontWeight: 600 }}>
                {idx + 1}
              </span>

              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ position: 'relative' }}>
                  <img src={user.avatar} alt="" style={{
                    width: 38, height: 38, borderRadius: '50%',
                    border: `1.5px solid ${user.color}44`,
                  }} />
                  <div style={{ position: 'absolute', bottom: -2, right: -2 }}>
                    <TypeBadge type={user.type} size="xs" />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#FFF' }}>{user.name}</div>
                  <div style={{ fontSize: 11, color: '#444' }}>{user.handle}</div>
                </div>
              </div>

              <div style={{ width: 80, textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#FFF' }}>
                  ${(user.marketCap / 1000).toFixed(1)}k
                </div>
              </div>

              <div style={{ width: 60, textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <div style={{
                  fontSize: 13, fontWeight: 700,
                  color: positive ? '#8B9E6E' : '#E05555',
                  display: 'flex', alignItems: 'center', gap: 2,
                }}>
                  {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {positive ? '+' : ''}{user.change}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
