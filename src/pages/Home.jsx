import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockUsers, USER_TYPES } from '../data/mockData';
import UserCard from '../components/UserCard';
import BottomNav from '../components/BottomNav';
import { Bell, X, Target, BarChart2, Plus, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';

const filters = ['All', 'Trending', 'Rising', 'Falling'];

// ---- Mock notifications ----
const MOCK_NOTIFS = [
  { id: 'n1', type: 'invest', text: 'Oren Cohen invested $50 in you', time: '2m ago', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face', link: '/user/3', read: false },
  { id: 'n2', type: 'follow', text: 'Noa Ben David started following you', time: '15m ago', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face', link: '/user/6', read: false },
  { id: 'n3', type: 'price', text: 'Your portfolio is up 8.3% today', time: '1h ago', avatar: null, link: '/portfolio', read: false },
  { id: 'n4', type: 'mission', text: 'Maya Levi applied to your design mission', time: '2h ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', link: '/missions', read: true },
  { id: 'n5', type: 'invest', text: 'Shira Katz invested $20 in you', time: '3h ago', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', link: '/user/4', read: true },
  { id: 'n6', type: 'price', text: "Tamir's value dropped 5% - review position", time: '4h ago', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=face', link: '/portfolio/1', read: true },
  { id: 'n7', type: 'milestone', text: 'Dana Shapir completed a mission at Wolt', time: '5h ago', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face', link: '/user/8', read: true },
  { id: 'n8', type: 'follow', text: 'Dor Shapira started following you', time: '1d ago', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face', link: '/user/5', read: true },
  { id: 'n9', type: 'invest', text: 'Your rep score crossed 30!', time: '1d ago', avatar: null, link: '/profile', read: true },
];

const NOTIF_COLOR = {
  invest: '#C9A84C',
  follow: '#7B6FBF',
  price: '#8B9E6E',
  mission: '#5FBFB5',
  milestone: '#888',
};

// POST types for FAB
const POST_TYPES = [
  { id: 'update', label: 'Update', color: '#7B6FBF' },
  { id: 'milestone', label: 'Milestone', color: '#8B9E6E' },
  { id: 'insight', label: 'Insight', color: '#C9A84C' },
  { id: 'work', label: 'Work', color: '#5FBFB5' },
  { id: 'thought', label: 'Thought', color: '#888' },
];

// simulate live price ticks
function useLivePrices(users) {
  const [prices, setPrices] = useState(() =>
    Object.fromEntries(users.map(u => [u.id, u.marketCap]))
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const next = { ...prev };
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const delta = (Math.random() - 0.48) * randomUser.marketCap * 0.008;
        next[randomUser.id] = Math.max(1000, prev[randomUser.id] + delta);
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, [users]);
  return prices;
}

export default function Home() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('all');
  const livePrices = useLivePrices(mockUsers);

  // Notifications
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs] = useState(() => {
    try {
      const stored = localStorage.getItem('any1_notifs_dismissed');
      const dismissed = stored ? JSON.parse(stored) : [];
      return MOCK_NOTIFS.filter(n => !dismissed.includes(n.id));
    } catch { return MOCK_NOTIFS; }
  });
  const [readNotifs, setReadNotifs] = useState(() => {
    try { return JSON.parse(localStorage.getItem('any1_notifs_read') || '[]'); } catch { return []; }
  });

  const unreadCount = notifs.filter(n => !n.read && !readNotifs.includes(n.id)).length;

  const markAllRead = () => {
    const ids = notifs.map(n => n.id);
    setReadNotifs(ids);
    localStorage.setItem('any1_notifs_read', JSON.stringify(ids));
  };

  const dismissNotif = (id) => {
    const newNotifs = notifs.filter(n => n.id !== id);
    setNotifs(newNotifs);
    const dismissed = MOCK_NOTIFS.filter(n => !newNotifs.find(x => x.id === n.id)).map(n => n.id);
    localStorage.setItem('any1_notifs_dismissed', JSON.stringify(dismissed));
  };

  // Weekly Digest
  const [showDigest, setShowDigest] = useState(() => {
    const today = new Date().toDateString();
    return localStorage.getItem('any1_digest_seen') !== today;
  });

  const dismissDigest = () => {
    localStorage.setItem('any1_digest_seen', new Date().toDateString());
    setShowDigest(false);
  };

  // FAB / Create Post
  const [showFAB, setShowFAB] = useState(false);
  const [postType, setPostType] = useState('update');
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState('');
  const [postToast, setPostToast] = useState(false);

  const submitPost = () => {
    if (!postText.trim()) return;
    const posts = JSON.parse(localStorage.getItem('any1_posts') || '[]');
    posts.unshift({
      id: Date.now().toString(),
      type: postType,
      text: postText.trim(),
      image: postImage.trim() || null,
      time: 'just now',
      likes: 0,
      comments: 0,
    });
    localStorage.setItem('any1_posts', JSON.stringify(posts));
    setShowFAB(false);
    setPostText('');
    setPostImage('');
    setPostToast(true);
    setTimeout(() => setPostToast(false), 2500);
  };

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
  const downCount = enriched.filter(u => u.liveChange < 0).length;

  // Leaderboard top 5
  const leaderboard = [...enriched]
    .sort((a, b) => b.liveChange - a.liveChange)
    .slice(0, 5);

  const rankColors = ['#C9A84C', '#AAAAAA', '#CD7F32', '#555', '#555'];
  const rankLabels = ['#1', '#2', '#3', '#4', '#5'];

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', paddingBottom: 90, position: 'relative' }}>

      {/* Header */}
      <div style={{
        padding: '54px 20px 0',
        background: 'linear-gradient(180deg, #0F0F0F 0%, #0A0A0A 100%)',
        borderBottom: '1px solid #1A1A1A',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 26, fontWeight: 900, color: '#FFF', letterSpacing: '-0.5px' }}>
            ANY<span style={{ color: '#8B9E6E' }}>1</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => navigate('/market')}
              style={{
                background: '#111', border: '1px solid #1F1F1F',
                borderRadius: 10, padding: '6px 12px', cursor: 'pointer',
                fontSize: 11, color: '#555', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <BarChart2 size={12} />
              Market
            </button>
            <button
              onClick={() => navigate('/missions')}
              style={{
                background: '#111', border: '1px solid #1F1F1F',
                borderRadius: 10, padding: '6px 12px', cursor: 'pointer',
                fontSize: 11, color: '#555', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <Target size={12} />
              Missions
            </button>
            <button
              onClick={() => setShowNotifs(v => !v)}
              style={{
                background: '#111', border: '1px solid #1F1F1F',
                borderRadius: 10, padding: 8, cursor: 'pointer',
                position: 'relative',
              }}
            >
              <Bell size={18} color={showNotifs ? '#8B9E6E' : '#555'} />
              {unreadCount > 0 && (
                <div style={{
                  position: 'absolute', top: 4, right: 4,
                  width: 16, height: 16, borderRadius: '50%',
                  background: '#E05555',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 800, color: '#FFF',
                }}>
                  {unreadCount}
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Stat bar (replaces ticker - TASK-11) */}
        <div style={{
          background: '#111', border: '1px solid #1A1A1A',
          borderRadius: 10, padding: '8px 14px',
          display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: 10, fontSize: 12, color: '#555',
        }}>
          <span style={{ color: '#FFF', fontWeight: 600 }}>Market:</span>
          <span>${(totalMarketCap / 1000).toFixed(0)}k total</span>
          <span style={{ color: '#333' }}>-</span>
          <span>{enriched.length} people</span>
          <span style={{ color: '#333' }}>-</span>
          <span style={{ color: '#8B9E6E' }}>+{upCount} up</span>
          <span style={{ color: '#E05555' }}>-{downCount} down today</span>
        </div>

        {/* Type filter */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', marginBottom: 10 }}>
          {[{ id: 'all', label: 'All', emoji: '✨', color: '#8B9E6E' }, ...Object.values(USER_TYPES)].map(t => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: typeFilter === t.id ? `${t.color}22` : 'transparent',
                border: `1px solid ${typeFilter === t.id ? t.color : '#1F1F1F'}`,
                borderRadius: 20, padding: '5px 12px',
                color: typeFilter === t.id ? t.color : '#444',
                fontSize: 11, fontWeight: 600,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              <span>{t.emoji}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Sort filter */}
        <div style={{ display: 'flex', gap: 6, paddingBottom: 14 }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? '#8B9E6E' : 'transparent',
                color: filter === f ? '#0A0A0A' : '#555',
                border: `1px solid ${filter === f ? '#8B9E6E' : '#1F1F1F'}`,
                borderRadius: 16, padding: '5px 14px',
                fontSize: 11, fontWeight: 700,
                cursor: 'pointer', letterSpacing: '0.03em',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Notification panel (TASK-03) */}
      {showNotifs && (
        <div style={{
          position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430, zIndex: 150,
          background: '#0A0A0A', borderBottom: '1px solid #1F1F1F',
          animation: 'slideDown 0.3s ease',
          maxHeight: '70vh', overflowY: 'auto',
        }}>
          <div style={{ padding: '54px 16px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#FFF' }}>Notifications</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={markAllRead}
                  style={{
                    background: 'none', border: '1px solid #1F1F1F',
                    borderRadius: 8, padding: '4px 10px',
                    fontSize: 11, color: '#555', cursor: 'pointer',
                  }}
                >
                  Mark all read
                </button>
                <button
                  onClick={() => setShowNotifs(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                >
                  <X size={18} color="#555" />
                </button>
              </div>
            </div>

            {notifs.map(notif => {
              const isRead = notif.read || readNotifs.includes(notif.id);
              return (
                <div
                  key={notif.id}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 0',
                    borderBottom: '1px solid #111',
                    opacity: isRead ? 0.6 : 1,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setShowNotifs(false);
                    navigate(notif.link);
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: isRead ? '#333' : NOTIF_COLOR[notif.type], flexShrink: 0 }} />
                  {notif.avatar ? (
                    <img src={notif.avatar} alt="" style={{ width: 38, height: 38, borderRadius: '50%', flexShrink: 0 }} />
                  ) : (
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%',
                      background: `${NOTIF_COLOR[notif.type]}22`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: NOTIF_COLOR[notif.type] }} />
                    </div>
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: '#FFF', lineHeight: 1.4, fontWeight: isRead ? 400 : 600 }}>
                      {notif.text}
                    </div>
                    <div style={{ fontSize: 11, color: '#444', marginTop: 2 }}>{notif.time}</div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); dismissNotif(notif.id); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                  >
                    <X size={14} color="#333" />
                  </button>
                </div>
              );
            })}

            {notifs.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#444', fontSize: 14 }}>
                All caught up!
              </div>
            )}

            <div style={{ height: 20 }} />
          </div>
        </div>
      )}

      {/* Overlay backdrop for notifications */}
      {showNotifs && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 140 }}
          onClick={() => setShowNotifs(false)}
        />
      )}

      {/* Feed */}
      <div style={{ padding: '12px 14px 0' }}>

        {/* Leaderboard (TASK-05) */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#FFF', marginBottom: 12 }}>
            This Week <span style={{ fontSize: 16 }}>🔥</span>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4 }}>
            {leaderboard.map((user, idx) => (
              <div
                key={user.id}
                onClick={() => navigate(`/user/${user.id}`)}
                style={{
                  flexShrink: 0,
                  width: 100,
                  background: idx === 0 ? '#1A1400' : '#111',
                  border: `1px solid ${idx === 0 ? '#C9A84C66' : '#1F1F1F'}`,
                  borderRadius: 16, padding: 12,
                  cursor: 'pointer',
                  textAlign: 'center',
                  animation: idx === 0 ? 'goldGlow 2s infinite' : 'none',
                }}
              >
                <div style={{
                  fontSize: 12, fontWeight: 800,
                  color: rankColors[idx],
                  marginBottom: 8,
                }}>
                  {rankLabels[idx]}
                </div>
                <img src={user.avatar} alt="" style={{
                  width: 44, height: 44, borderRadius: '50%',
                  border: `2px solid ${rankColors[idx]}66`,
                  marginBottom: 8,
                }} />
                <div style={{ fontSize: 11, fontWeight: 600, color: '#FFF', marginBottom: 4 }}>
                  {user.name.split(' ')[0]}
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#8B9E6E' }}>
                  +{user.liveChange.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User cards */}
        {filtered.map((user, i) => (
          <UserCard
            key={user.id}
            user={{ ...user, change: parseFloat(user.liveChange.toFixed(1)) }}
            animate={true}
            index={i}
          />
        ))}
      </div>

      {/* FAB button (TASK-13) */}
      <button
        onClick={() => setShowFAB(true)}
        style={{
          position: 'fixed', bottom: 90, right: 20,
          width: 56, height: 56, borderRadius: '50%',
          background: '#8B9E6E', border: 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 90,
          boxShadow: '0 4px 20px #8B9E6E55',
        }}
      >
        <Plus size={24} color="#0A0A0A" strokeWidth={3} />
      </button>

      {/* FAB modal */}
      {showFAB && (
        <div style={{
          position: 'fixed', inset: 0, background: '#000000cc',
          backdropFilter: 'blur(8px)', zIndex: 200,
          display: 'flex', alignItems: 'flex-end',
        }} onClick={() => setShowFAB(false)}>
          <div
            style={{
              width: '100%', maxWidth: 430, margin: '0 auto',
              background: '#111', borderRadius: '24px 24px 0 0',
              padding: '24px 20px 40px',
              border: '1px solid #1F1F1F',
              animation: 'slideUpFull 0.3s ease',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: 36, height: 4, background: '#333', borderRadius: 2, margin: '0 auto 20px' }} />
            <div style={{ fontSize: 17, fontWeight: 700, color: '#FFF', marginBottom: 16 }}>Create Post</div>

            {/* Post type chips */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, scrollbarWidth: 'none' }}>
              {POST_TYPES.map(pt => (
                <button
                  key={pt.id}
                  onClick={() => setPostType(pt.id)}
                  style={{
                    background: postType === pt.id ? `${pt.color}22` : '#1A1A1A',
                    border: `1px solid ${postType === pt.id ? pt.color : '#252525'}`,
                    borderRadius: 20, padding: '7px 14px',
                    color: postType === pt.id ? pt.color : '#555',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    whiteSpace: 'nowrap', flexShrink: 0,
                  }}
                >
                  {pt.label}
                </button>
              ))}
            </div>

            <textarea
              value={postText}
              onChange={e => setPostText(e.target.value.slice(0, 280))}
              placeholder="What's on your mind?"
              rows={4}
              style={{
                width: '100%', background: '#1A1A1A',
                border: '1px solid #252525', borderRadius: 14,
                padding: '14px 16px', color: '#FFF',
                fontSize: 15, outline: 'none', resize: 'none',
                fontFamily: 'inherit', marginBottom: 8,
              }}
            />
            <div style={{ fontSize: 11, color: postText.length > 250 ? '#E05555' : '#444', textAlign: 'right', marginBottom: 12 }}>
              {postText.length}/280
            </div>

            <input
              value={postImage}
              onChange={e => setPostImage(e.target.value)}
              placeholder="Image URL (optional)"
              style={{
                width: '100%', background: '#1A1A1A',
                border: '1px solid #252525', borderRadius: 12,
                padding: '12px 16px', color: '#FFF',
                fontSize: 14, outline: 'none', marginBottom: 16,
              }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowFAB(false)}
                style={{
                  flex: 1, background: '#1A1A1A', color: '#555',
                  border: '1px solid #252525', borderRadius: 14,
                  padding: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitPost}
                disabled={!postText.trim()}
                style={{
                  flex: 2,
                  background: postText.trim() ? '#8B9E6E' : '#1A1A1A',
                  color: postText.trim() ? '#0A0A0A' : '#444',
                  border: 'none', borderRadius: 14,
                  padding: 14, fontSize: 15, fontWeight: 700,
                  cursor: postText.trim() ? 'pointer' : 'default',
                }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posted toast */}
      {postToast && (
        <div style={{
          position: 'fixed', bottom: 110, left: '50%', transform: 'translateX(-50%)',
          background: '#8B9E6E', color: '#0A0A0A',
          borderRadius: 20, padding: '10px 20px',
          fontSize: 13, fontWeight: 700, zIndex: 300,
          display: 'flex', alignItems: 'center', gap: 6,
          animation: 'slideUp 0.3s ease',
          boxShadow: '0 8px 24px #8B9E6E44',
        }}>
          <CheckCircle size={14} />
          Posted!
        </div>
      )}

      {/* Weekly Digest overlay (TASK-08) */}
      {showDigest && (
        <div style={{
          position: 'fixed', inset: 0, background: '#000000ee',
          backdropFilter: 'blur(12px)', zIndex: 250,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: '#111', borderRadius: 24,
            padding: '32px 24px',
            border: '1px solid #1F1F1F',
            width: '100%', maxWidth: 390,
            animation: 'scaleIn 0.4s ease',
          }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#FFF', marginBottom: 4 }}>Your Week on Any1</div>
              <div style={{ fontSize: 13, color: '#555' }}>
                {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                { emoji: '📈', label: 'Portfolio grew', value: '+4.2%', color: '#8B9E6E' },
                { emoji: '💰', label: 'Best bet: Oren Cohen', value: '+12.3%', color: '#C9A84C' },
                { emoji: '👥', label: 'New followers', value: '3 people', color: '#7B6FBF' },
                { emoji: '🎯', label: 'Missions available', value: '4 open', color: '#5FBFB5' },
                { emoji: '⭐', label: 'Rep earned', value: '+15 points', color: '#C9A84C' },
              ].map(item => (
                <div key={item.label} style={{
                  background: '#1A1A1A', borderRadius: 14, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}>
                  <span style={{ fontSize: 20 }}>{item.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: '#555' }}>{item.label}</div>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: item.color }}>{item.value}</div>
                </div>
              ))}
            </div>

            <button
              onClick={dismissDigest}
              style={{
                width: '100%', background: '#8B9E6E', color: '#0A0A0A',
                border: 'none', borderRadius: 14,
                padding: 16, fontSize: 15, fontWeight: 800, cursor: 'pointer',
              }}
            >
              Let's go!
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
