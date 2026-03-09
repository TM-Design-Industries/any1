import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { mockUsers, USER_TYPES } from '../data/mockData';
import UserCard from '../components/UserCard';
import BottomNav from '../components/BottomNav';
import { Bell, X, Target, TrendingUp, TrendingDown, Zap, Clock, Users, ChevronRight, Activity } from 'lucide-react';

const filters = ['All', 'Trending', 'Rising', 'Falling'];

const MOCK_NOTIFS = [
  { id: 'n1', type: 'invest', text: 'Oren Cohen backed you', time: '2m ago', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face', link: '/user/3', read: false },
  { id: 'n2', type: 'follow', text: 'Noa Ben David started following you', time: '15m ago', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face', link: '/user/6', read: false },
  { id: 'n3', type: 'price', text: 'Your portfolio is up 8.3% today', time: '1h ago', avatar: null, link: '/portfolio', read: false },
  { id: 'n4', type: 'mission', text: 'Maya Levi applied to your design mission', time: '2h ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', link: '/missions', read: true },
  { id: 'n5', type: 'price', text: "Ahavat Gordon up 11.7% - you backed them", time: '3h ago', avatar: '/gordon.jpg', link: '/user/15', read: true },
];

const NOTIF_COLOR = { invest: '#C9A84C', follow: '#7B6FBF', price: '#C9A84C', mission: '#4BBFB5', milestone: '#B5A898' };

const LIVE_EVENTS = [
  { id: 'e1', text: 'Someone backed Dovi Frances', time: '12s ago', color: '#C9A84C' },
  { id: 'e2', text: 'Omer Adam up 9.3% today', time: '1m ago', color: '#7A9E7E' },
  { id: 'e3', text: 'New mission posted by Tamir Mizrahi', time: '3m ago', color: '#8B85C1' },
  { id: 'e4', text: 'Ahavat Gordon crossed 50 backers', time: '7m ago', color: '#B8714F' },
  { id: 'e5', text: 'Eyal Shani hit all-time high valuation', time: '12m ago', color: '#C9A84C' },
  { id: 'e6', text: '3 new people joined Any1', time: '18m ago', color: '#7A6E62' },
  { id: 'e7', text: 'Yehuda Levi mission completed', time: '22m ago', color: '#4BBFB5' },
  { id: 'e8', text: 'Dovi Frances backed Tamir Mizrahi', time: '31m ago', color: '#C9A84C' },
];

function useLivePrices(users) {
  const [prices, setPrices] = useState(() => Object.fromEntries(users.map(u => [u.id, u.marketCap])));
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev };
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const delta = (Math.random() - 0.47) * randomUser.marketCap * 0.006;
        next[randomUser.id] = Math.max(1000, prev[randomUser.id] + delta);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [users]);
  return prices;
}

function TickerTape({ events, theme }) {
  return (
    <div style={{ overflow: 'hidden', background: theme.surface, borderBottom: `1px solid ${theme.border}`, height: 32, display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', animation: 'tickerScroll 30s linear infinite' }}>
        {[...events, ...events].map((e, i) => (
          <span key={i} style={{ fontSize: 11, color: e.color, fontWeight: 600, letterSpacing: '0.03em' }}>
            <span style={{ color: theme.border2, marginRight: 8 }}>•</span>
            {e.text}
            <span style={{ color: theme.border2, marginLeft: 16 }}>{e.time}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function OpportunityCard({ user, navigate, theme }) {
  return (
    <div
      onClick={() => navigate(`/user/${user.id}`)}
      style={{
        background: `linear-gradient(135deg, ${theme.surface} 0%, ${theme.bg} 100%)`,
        border: `1px solid ${theme.accent}44`,
        borderRadius: 16, padding: '14px 16px',
        cursor: 'pointer', flexShrink: 0, width: 200,
        position: 'relative', overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 10, right: 10, background: `${theme.accent}22`, borderRadius: 6, padding: '2px 8px' }}>
        <span style={{ fontSize: 9, color: theme.accent, fontWeight: 700, letterSpacing: '0.08em' }}>WINDOW OPEN</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <img src={user.avatar} alt="" style={{ width: 38, height: 38, borderRadius: '50%', border: `1.5px solid ${theme.accent}44` }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{user.name.split(' ')[0]}</div>
          <div style={{ fontSize: 10, color: theme.muted }}>{user.type}</div>
        </div>
      </div>
      <div style={{ fontSize: 11, color: theme.text2, marginBottom: 8, lineHeight: 1.4 }}>
        Up {user.change}% this week. Early backers positioned well.
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 800, color: theme.accent }}>${(user.marketCap / 1000).toFixed(0)}k</span>
        <span style={{ fontSize: 11, color: theme.up, fontWeight: 600 }}>+{user.change}%</span>
      </div>
    </div>
  );
}

export default function Home({ onSettingsOpen }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('all');
  const livePrices = useLivePrices(mockUsers);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState(MOCK_NOTIFS);
  const [readNotifs, setReadNotifs] = useState([]);
  const [liveIdx, setLiveIdx] = useState(0);
  const [showThesis, setShowThesis] = useState(() => !localStorage.getItem('any1_thesis_done'));
  const [thesisStep, setThesisStep] = useState(0);
  const [selectedThesis, setSelectedThesis] = useState([]);

  const unreadCount = notifs.filter(n => !n.read && !readNotifs.includes(n.id)).length;

  useEffect(() => {
    const t = setInterval(() => setLiveIdx(i => (i + 1) % LIVE_EVENTS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const markAllRead = () => setReadNotifs(notifs.map(n => n.id));

  const enriched = mockUsers.map(u => ({
    ...u,
    marketCap: Math.round(livePrices[u.id] || u.marketCap),
    liveChange: ((livePrices[u.id] - u.marketCap) / u.marketCap * 100 + u.change),
  }));

  const filtered = enriched
    .filter(u => typeFilter === 'all' || u.type === typeFilter)
    .filter(u => {
      if (filter === 'Rising') return u.liveChange > 1;
      if (filter === 'Falling') return u.liveChange < 0;
      if (filter === 'Trending') return u.investors > 20;
      return true;
    })
    .sort((a, b) => {
      if (filter === 'Trending') return b.investors - a.investors;
      if (filter === 'Rising') return b.liveChange - a.liveChange;
      return b.marketCap - a.marketCap;
    });

  const totalMarketCap = enriched.reduce((s, u) => s + u.marketCap, 0);
  const upCount = enriched.filter(u => u.liveChange > 0).length;
  const topMovers = [...enriched].sort((a, b) => b.liveChange - a.liveChange).slice(0, 3);
  const windows = [...enriched].filter(u => u.liveChange > 3 && u.investors < 80).slice(0, 4);
  const leaderboard = [...enriched].sort((a, b) => b.liveChange - a.liveChange).slice(0, 5);
  const rankColors = [theme.accent, theme.text2, theme.text2, theme.muted, theme.muted];

  const THESIS_OPTIONS = [
    { id: 'tech', label: 'Tech & AI', color: '#7B6FBF' },
    { id: 'arts', label: 'Arts & Culture', color: '#B8714F' },
    { id: 'sport', label: 'Sport & Fitness', color: '#4BBFB5' },
    { id: 'business', label: 'Business & VC', color: theme.accent },
    { id: 'food', label: 'Food & Lifestyle', color: '#D4A843' },
    { id: 'media', label: 'Media & TV', color: '#8B85C1' },
  ];

  const toggleThesis = (id) => setSelectedThesis(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const finishThesis = () => {
    localStorage.setItem('any1_thesis_done', '1');
    localStorage.setItem('any1_thesis', JSON.stringify(selectedThesis));
    setShowThesis(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, paddingBottom: 90, position: 'relative' }}>
      <style>{`
        @keyframes tickerScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>

      {/* Header */}
      <div style={{ padding: '54px 20px 0', background: theme.bg, borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: 28, fontWeight: 900, color: theme.text, letterSpacing: '-1px' }}>
              any<span style={{ color: theme.accent }}>1</span>
            </span>
            <div style={{ fontSize: 10, color: theme.muted, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 1 }}>
              The Human Market
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 8, padding: '5px 10px' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: theme.up, animation: 'pulse 1.5s infinite' }} />
              <span style={{ fontSize: 10, color: theme.up, fontWeight: 700, letterSpacing: '0.06em' }}>LIVE</span>
            </div>
            <button onClick={() => setShowNotifs(v => !v)} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 10, padding: 8, cursor: 'pointer', position: 'relative' }}>
              <Bell size={18} color={showNotifs ? theme.accent : theme.muted} />
              {unreadCount > 0 && (
                <div style={{ position: 'absolute', top: 4, right: 4, width: 16, height: 16, borderRadius: '50%', background: theme.down, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff' }}>
                  {unreadCount}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Market summary */}
        <div style={{ background: theme.surface, borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, border: `1px solid ${theme.border}` }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: theme.text }}>${(totalMarketCap / 1000000).toFixed(1)}M</div>
            <div style={{ fontSize: 9, color: theme.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Total Value</div>
          </div>
          <div style={{ width: 1, height: 30, background: theme.border }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: theme.text }}>{enriched.length}</div>
            <div style={{ fontSize: 9, color: theme.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>People</div>
          </div>
          <div style={{ width: 1, height: 30, background: theme.border }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: theme.up }}>{upCount} up</div>
            <div style={{ fontSize: 9, color: theme.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Today</div>
          </div>
          <div style={{ width: 1, height: 30, background: theme.border }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: theme.accent }}>24/7</div>
            <div style={{ fontSize: 9, color: theme.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Open</div>
          </div>
        </div>

        {/* Type filters */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 10 }}>
          {[{ id: 'all', label: 'All', color: theme.accent }, ...Object.values(USER_TYPES)].map(t => (
            <button key={t.id} onClick={() => setTypeFilter(t.id)} style={{
              background: typeFilter === t.id ? `${t.color}22` : 'transparent',
              border: `1px solid ${typeFilter === t.id ? t.color : theme.border}`,
              borderRadius: 20, padding: '5px 14px',
              color: typeFilter === t.id ? t.color : theme.muted,
              fontSize: 11, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 6, paddingBottom: 14 }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              background: filter === f ? theme.accent : 'transparent',
              color: filter === f ? theme.bg : theme.muted,
              border: `1px solid ${filter === f ? theme.accent : theme.border}`,
              borderRadius: 16, padding: '5px 14px',
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
            }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <TickerTape events={LIVE_EVENTS} theme={theme} />

      {/* Notification panel */}
      {showNotifs && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 140 }} onClick={() => setShowNotifs(false)} />
          <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 430, zIndex: 150, background: theme.bg, borderBottom: `1px solid ${theme.border}`, maxHeight: '70vh', overflowY: 'auto', animation: 'slideDown 0.25s ease' }}>
            <div style={{ padding: '54px 16px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: theme.text }}>Notifications</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={markAllRead} style={{ background: 'none', border: `1px solid ${theme.border}`, borderRadius: 8, padding: '4px 10px', fontSize: 11, color: theme.muted, cursor: 'pointer' }}>Mark all read</button>
                  <button onClick={() => setShowNotifs(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} color={theme.muted} /></button>
                </div>
              </div>
              {notifs.map(n => {
                const isRead = n.read || readNotifs.includes(n.id);
                return (
                  <div key={n.id} onClick={() => { setShowNotifs(false); navigate(n.link); }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: `1px solid ${theme.border}`, opacity: isRead ? 0.5 : 1, cursor: 'pointer' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: isRead ? theme.border2 : NOTIF_COLOR[n.type], flexShrink: 0 }} />
                    {n.avatar ? <img src={n.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0 }} /> : <div style={{ width: 36, height: 36, borderRadius: '50%', background: theme.surface2, flexShrink: 0 }} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: theme.text, fontWeight: isRead ? 400 : 600 }}>{n.text}</div>
                      <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>{n.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      <div style={{ padding: '20px 16px 0' }}>
        {/* Windows of Opportunity */}
        {windows.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={14} color={theme.accent} />
                <span style={{ fontSize: 11, fontWeight: 700, color: theme.accent, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Windows of Opportunity</span>
              </div>
              <span style={{ fontSize: 10, color: theme.muted }}>Rising - fewer backers</span>
            </div>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
              {windows.map(u => <OpportunityCard key={u.id} user={u} navigate={navigate} theme={theme} />)}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={14} color={theme.muted} />
              <span style={{ fontSize: 11, fontWeight: 700, color: theme.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>This Week</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
            {leaderboard.map((user, idx) => (
              <div key={user.id} onClick={() => navigate(`/user/${user.id}`)} style={{ flexShrink: 0, width: 86, background: theme.surface, border: `1px solid ${idx === 0 ? theme.accent + '44' : theme.border}`, borderRadius: 14, padding: '12px 8px', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: rankColors[idx], marginBottom: 8 }}>#{idx + 1}</div>
                <img src={user.avatar} alt="" style={{ width: 38, height: 38, borderRadius: '50%', border: `1.5px solid ${rankColors[idx]}55`, display: 'block', margin: '0 auto 8px' }} />
                <div style={{ fontSize: 10, fontWeight: 600, color: theme.text2, marginBottom: 4 }}>{user.name.split(' ')[0]}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: theme.accent }}>+{user.liveChange.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Missions CTA */}
        <div onClick={() => navigate('/missions')} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, padding: '16px 18px', marginBottom: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: '#8B85C122', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Target size={22} color="#8B85C1" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: theme.text, marginBottom: 2 }}>Prove your value</div>
            <div style={{ fontSize: 12, color: theme.muted }}>4 missions match your profile - complete one to raise your valuation</div>
          </div>
          <ChevronRight size={18} color={theme.muted} />
        </div>

        {/* People list */}
        {filtered.map((user, i) => (
          <UserCard key={user.id} user={{ ...user, change: parseFloat(user.liveChange.toFixed(1)) }} animate={true} index={i} />
        ))}
      </div>

      {/* Thesis modal */}
      {showThesis && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', backdropFilter: 'blur(12px)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: 430, margin: '0 auto', background: theme.surface, borderRadius: '24px 24px 0 0', padding: '32px 24px 48px', border: `1px solid ${theme.border}` }}>
            <div style={{ width: 36, height: 4, background: theme.border2, borderRadius: 2, margin: '0 auto 28px' }} />
            <div style={{ fontSize: 22, fontWeight: 800, color: theme.text, marginBottom: 6 }}>What do you believe in?</div>
            <div style={{ fontSize: 14, color: theme.muted, marginBottom: 24, lineHeight: 1.5 }}>
              Your investment thesis shapes who you discover. Pick what resonates.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 28 }}>
              {THESIS_OPTIONS.map(t => (
                <button key={t.id} onClick={() => toggleThesis(t.id)} style={{
                  background: selectedThesis.includes(t.id) ? `${t.color}22` : theme.surface2,
                  border: `1.5px solid ${selectedThesis.includes(t.id) ? t.color : theme.border2}`,
                  borderRadius: 20, padding: '9px 18px',
                  color: selectedThesis.includes(t.id) ? t.color : theme.muted,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>
                  {t.label}
                </button>
              ))}
            </div>
            <button onClick={finishThesis} style={{
              width: '100%',
              background: selectedThesis.length > 0 ? theme.accent : theme.surface2,
              color: selectedThesis.length > 0 ? theme.bg : theme.muted,
              border: 'none', borderRadius: 14, padding: 16,
              fontSize: 15, fontWeight: 800, cursor: 'pointer',
            }}>
              {selectedThesis.length > 0 ? 'Build my market' : 'Skip for now'}
            </button>
          </div>
        </div>
      )}

      <BottomNav onSettingsOpen={onSettingsOpen} />
    </div>
  );
}
