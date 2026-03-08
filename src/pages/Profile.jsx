import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { mockUsers, USER_TYPES, generateChart } from '../data/mockData';
import BottomNav from '../components/BottomNav';
import MiniChart from '../components/MiniChart';
import TypeBadge from '../components/TypeBadge';
import {
  Edit2, CheckCircle, Plus, Star, TrendingUp, TrendingDown,
  MapPin, Calendar, Users, Target, MessageSquare, Share2,
  Camera, FileText, Briefcase, DollarSign, X, ChevronDown, ChevronUp
} from 'lucide-react';

// Tamir Mizrahi is the logged-in user
const ME = mockUsers.find(u => u.id === '1');

const LEVEL_SYSTEM = [
  { min: 0,   max: 20,       name: 'Newcomer',    color: '#7A6E62' },
  { min: 21,  max: 40,       name: 'Explorer',    color: '#4BBFB5' },
  { min: 41,  max: 60,       name: 'Contributor', color: '#7B6FBF' },
  { min: 61,  max: 80,       name: 'Builder',     color: '#D4A843' },
  { min: 81,  max: 100,      name: 'Amplifier',   color: '#C9A84C' },
  { min: 101, max: Infinity, name: 'Legend',      color: '#C0564A' },
];

const POST_TYPES = [
  { id: 'update',    label: 'Update',    color: '#7B6FBF' },
  { id: 'milestone', label: 'Milestone', color: '#C9A84C' },
  { id: 'insight',   label: 'Insight',   color: '#D4A843' },
  { id: 'work',      label: 'Work',      color: '#4BBFB5' },
];

const ACTIONS = [
  { id: 'post',      label: 'Write Post',         icon: FileText,    color: '#7B6FBF' },
  { id: 'work',      label: 'Upload Work',         icon: Briefcase,   color: '#4BBFB5' },
  { id: 'mission',   label: 'Add Mission',         icon: Target,      color: '#D4A843' },
  { id: 'ask',       label: 'Request Backing',     icon: DollarSign,  color: '#C9A84C' },
  { id: 'share',     label: 'Share Profile',       icon: Share2,      color: '#B5A898' },
  { id: 'message',   label: 'Open DMs',            icon: MessageSquare, color: '#8B85C1' },
];

export default function Profile({ onSettingsOpen }) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const base = ME || {};
  const [userData, setUserData] = useState(() => {
    try {
      const stored = localStorage.getItem('any1_user');
      if (stored) return { ...base, ...JSON.parse(stored) };
    } catch {}
    return base;
  });

  const user = userData;
  const typeInfo = USER_TYPES[user.type] || {};
  const rep = user.reputation || 0;
  const level = LEVEL_SYSTEM.find(l => rep >= l.min && rep <= l.max) || LEVEL_SYSTEM[0];
  const nextLevel = LEVEL_SYSTEM[LEVEL_SYSTEM.indexOf(level) + 1];
  const progress = nextLevel ? ((rep - level.min) / (nextLevel.min - level.min)) * 100 : 100;
  const positive = (user.change || 0) >= 0;

  // Modals
  const [editMode, setEditMode] = useState(false);
  const [publicView, setPublicView] = useState(false);
  const [avatar, setAvatar] = useState(() => localStorage.getItem('any1_avatar') || user?.avatar);
  const [cover, setCover] = useState(() => localStorage.getItem('any1_cover') || null);
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editLocation, setEditLocation] = useState(user.location || '');
  const [savedToast, setSavedToast] = useState(false);

  const [activeAction, setActiveAction] = useState(null);
  const [postType, setPostType] = useState('update');
  const [postText, setPostText] = useState('');
  const [actionDone, setActionDone] = useState(false);

  const [tab, setTab] = useState('ventures');
  const [showXP, setShowXP] = useState(false);

  const [myPosts, setMyPosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('any1_my_posts') || '[]'); } catch { return []; }
  });

  const allPosts = [...(user.posts || []), ...myPosts];

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target.result;
      setAvatar(b64);
      localStorage.setItem('any1_avatar', b64);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const b64 = ev.target.result;
      setCover(b64);
      localStorage.setItem('any1_cover', b64);
    };
    reader.readAsDataURL(file);
  };

  const saveEdit = () => {
    const updated = { ...user, bio: editBio, location: editLocation };
    setUserData(updated);
    const stored = JSON.parse(localStorage.getItem('any1_user') || '{}');
    localStorage.setItem('any1_user', JSON.stringify({ ...stored, bio: editBio, location: editLocation }));
    setEditMode(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const submitAction = () => {
    if (activeAction === 'post' || activeAction === 'work') {
      if (!postText.trim()) return;
      const newPost = { id: Date.now().toString(), type: activeAction === 'work' ? 'work' : postType, text: postText.trim(), time: 'just now', likes: 0, comments: 0 };
      const updated = [newPost, ...myPosts];
      setMyPosts(updated);
      localStorage.setItem('any1_my_posts', JSON.stringify(updated));
    }
    setActionDone(true);
    setTimeout(() => { setActiveAction(null); setPostText(''); setActionDone(false); }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#221E1A', paddingBottom: 90 }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } } @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }`}</style>

      {/* Cover */}
      <div style={{ position: 'relative', height: 200 }}>
        <img src={user.cover} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(10,10,10,0.85) 100%)' }} />

        {/* Edit cover button */}
        <button onClick={() => setEditMode(true)} style={{ position: 'absolute', top: 52, right: 16, background: '#221E1Acc', backdropFilter: 'blur(8px)', border: '1px solid #ffffff22', borderRadius: 10, padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Edit2 size={13} color="#F2EDE6" />
          <span style={{ fontSize: 12, color: '#F2EDE6', fontWeight: 600 }}>Edit</span>
        </button>

        <div style={{ position: 'absolute', bottom: -36, left: 20, display: 'flex', alignItems: 'flex-end', gap: 0 }}>
          <div style={{ position: 'relative', width: 76, height: 76 }}>
            <div style={{ width: 76, height: 76, borderRadius: '50%', border: '3px solid #221E1A', overflow: 'hidden' }}>
              <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', bottom: -4, right: -4 }}>
              <TypeBadge type={user.type} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={{ padding: '44px 20px 16px', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#F2EDE6' }}>{user.name}</div>
            <div style={{ fontSize: 13, color: '#7A6E62' }}>{user.handle}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setActiveAction('share')} style={{ background: '#2A2520', border: '1px solid #3E3528', borderRadius: 10, padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
              <Share2 size={13} color="#7A6E62" />
              <span style={{ fontSize: 12, color: '#7A6E62', fontWeight: 600 }}>Share</span>
            </button>
          </div>
        </div>

        <div style={{ fontSize: 14, color: '#B5A898', lineHeight: 1.5, marginBottom: 12 }}>{user.bio}</div>

        <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#7A6E62' }}><MapPin size={12} /> {user.location}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#7A6E62' }}><Calendar size={12} /> {user.joined}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#D4A843' }}><Star size={12} fill="#D4A843" /> {rep} rep</span>
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {user.tags?.map(tag => (
            <span key={tag} style={{ fontSize: 11, color: typeInfo.color, background: `${typeInfo.color}15`, border: `1px solid ${typeInfo.color}33`, borderRadius: 6, padding: '3px 10px' }}>{tag}</span>
          ))}
        </div>

        {/* IPO Stats */}
        <div style={{ display: 'flex', borderTop: '1px solid #1A1A1A', paddingTop: 14 }}>
          {[
            { label: 'Valuation', value: `$${(user.marketCap / 1000).toFixed(0)}k`, color: '#F2EDE6' },
            { label: 'Collateral', value: `$${(user.collateral / 1000).toFixed(0)}k`, color: '#F2EDE6' },
            { label: 'Backers', value: user.investors, color: '#C9A84C' },
            { label: 'Missions', value: user.missions, color: '#F2EDE6' },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: 1, textAlign: 'center', borderRight: i < 3 ? '1px solid #1A1A1A' : 'none' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: s.color, marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#7A6E62' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rep bar */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #1A1A1A', background: '#1A1612' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Star size={14} color="#D4A843" fill="#D4A843" />
            <span style={{ fontSize: 16, fontWeight: 800, color: '#F2EDE6' }}>{rep}</span>
            <span style={{ fontSize: 12, color: level.color, fontWeight: 600 }}>{level.name}</span>
          </div>
          {nextLevel && <span style={{ fontSize: 11, color: '#7A6E62' }}>{nextLevel.min - rep} to {nextLevel.name}</span>}
        </div>
        <div style={{ background: '#332D27', borderRadius: 6, height: 6, overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg, ${level.color}, ${nextLevel?.color || level.color})`, borderRadius: 6 }} />
        </div>
      </div>

      {/* Value chart */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #1A1A1A', background: '#1A1612' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 11, color: '#7A6E62', letterSpacing: '0.08em', textTransform: 'uppercase' }}>My Valuation</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#F2EDE6' }}>${(user.marketCap / 1000).toFixed(0)}k</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: positive ? '#7A9E7E' : '#C0564A', display: 'flex', alignItems: 'center', gap: 3 }}>
              {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {positive ? '+' : ''}{user.change}%
            </span>
          </div>
        </div>
        <MiniChart data={generateChart(user.marketCap, user.change)} color={positive ? '#C9A84C' : '#C0564A'} width={390} height={56} />
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ fontSize: 11, color: '#7A6E62', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>Quick Actions</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {ACTIONS.map(action => {
            const Icon = action.icon;
            return (
              <button key={action.id} onClick={() => { setActiveAction(action.id); setActionDone(false); setPostText(''); }} style={{ background: '#1A1612', border: `1px solid ${action.color}33`, borderRadius: 14, padding: '14px 8px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${action.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={16} color={action.color} />
                </div>
                <span style={{ fontSize: 11, color: '#B5A898', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1A1A1A', position: 'sticky', top: 0, background: '#221E1A', zIndex: 10 }}>
        {['ventures', 'posts'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, background: 'none', border: 'none',
            borderBottom: tab === t ? `2px solid ${typeInfo.color}` : '2px solid transparent',
            color: tab === t ? '#F2EDE6' : '#7A6E62',
            padding: '13px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
          }}>
            {t === 'ventures' ? 'My Ventures' : `Posts (${allPosts.length})`}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Ventures tab */}
        {tab === 'ventures' && (
          <div>
            {user.ventures?.map((v, i) => {
              const colors = { active: '#C9A84C', completed: '#4BBFB5', bootstrapped: '#7A9E7E' };
              const c = colors[v.status] || '#7A6E62';
              return (
                <div key={i} style={{ background: '#1A1612', border: '1px solid #2A2520', borderRadius: 16, padding: '16px', marginBottom: 10, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${typeInfo.color}88, transparent)` }} />
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#F2EDE6', marginBottom: 3 }}>{v.name}</div>
                      <div style={{ fontSize: 12, color: '#7A6E62' }}>{v.role} · {v.year}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: c, background: `${c}18`, borderRadius: 6, padding: '3px 9px', textTransform: 'capitalize' }}>{v.status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#C9A84C', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <TrendingUp size={12} /> {v.raised}
                  </div>
                </div>
              );
            })}
            <button onClick={() => setActiveAction('mission')} style={{ width: '100%', background: 'transparent', border: '1px dashed #2A2520', borderRadius: 14, padding: 14, color: '#7A6E62', fontSize: 13, cursor: 'pointer', marginTop: 4 }}>
              + Add new venture or mission
            </button>
          </div>
        )}

        {/* Posts tab */}
        {tab === 'posts' && (
          <div>
            <button onClick={() => setActiveAction('post')} style={{ width: '100%', background: '#1A1612', border: '1px solid #C9A84C33', borderRadius: 14, padding: '13px 16px', marginBottom: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}>
              <img src={user.avatar} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
              <span style={{ fontSize: 14, color: '#7A6E62' }}>Share something with your backers...</span>
            </button>
            {allPosts.length === 0 && <div style={{ textAlign: 'center', color: '#7A6E62', padding: '40px 0', fontSize: 14 }}>No posts yet. Share something!</div>}
            {allPosts.map((post, i) => (
              <div key={post.id || i} style={{ background: '#1A1612', border: '1px solid #2A2520', borderRadius: 16, padding: '16px', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <img src={user.avatar} alt="" style={{ width: 34, height: 34, borderRadius: '50%' }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#F2EDE6' }}>{user.name}</div>
                    <div style={{ fontSize: 10, color: '#7A6E62' }}>{post.time}</div>
                  </div>
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: typeInfo.color, background: `${typeInfo.color}15`, borderRadius: 4, padding: '2px 8px', fontWeight: 600, textTransform: 'uppercase' }}>{post.type}</span>
                </div>
                <div style={{ fontSize: 14, color: '#B5A898', lineHeight: 1.5 }}>{post.text}</div>
                <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                  <span style={{ fontSize: 12, color: '#7A6E62' }}>♡ {post.likes}</span>
                  <span style={{ fontSize: 12, color: '#7A6E62' }}>💬 {post.comments}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit profile modal */}
      {editMode && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: 430, margin: '0 auto', background: '#1E1B17', borderRadius: '24px 24px 0 0', padding: '28px 20px 48px', border: '1px solid #2A2520', animation: 'slideUp 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#F2EDE6' }}>Edit Profile</div>
              <button onClick={() => setEditMode(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} color="#7A6E62" /></button>
            </div>
            <div style={{ fontSize: 11, color: '#7A6E62', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Bio</div>
            <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={4} style={{ width: '100%', background: '#2A2520', border: '1px solid #3E3528', borderRadius: 12, padding: '12px 14px', color: '#F2EDE6', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', marginBottom: 14, boxSizing: 'border-box' }} />
            <div style={{ fontSize: 11, color: '#7A6E62', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Location</div>
            <input value={editLocation} onChange={e => setEditLocation(e.target.value)} style={{ width: '100%', background: '#2A2520', border: '1px solid #3E3528', borderRadius: 12, padding: '12px 14px', color: '#F2EDE6', fontSize: 14, outline: 'none', marginBottom: 20, boxSizing: 'border-box' }} />
            <button onClick={saveEdit} style={{ width: '100%', background: '#C9A84C', color: '#221E1A', border: 'none', borderRadius: 14, padding: 15, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>Save changes</button>
          </div>
        </div>
      )}

      {/* Action modals */}
      {activeAction && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: 430, margin: '0 auto', background: '#1E1B17', borderRadius: '24px 24px 0 0', padding: '28px 20px 48px', border: '1px solid #2A2520', animation: 'slideUp 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#F2EDE6' }}>
                {ACTIONS.find(a => a.id === activeAction)?.label}
              </div>
              <button onClick={() => setActiveAction(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} color="#7A6E62" /></button>
            </div>

            {actionDone ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <CheckCircle size={44} color="#C9A84C" style={{ display: 'block', margin: '0 auto 12px' }} />
                <div style={{ fontSize: 16, fontWeight: 700, color: '#F2EDE6' }}>Done!</div>
              </div>
            ) : (
              <>
                {(activeAction === 'post' || activeAction === 'work') && (
                  <>
                    {activeAction === 'post' && (
                      <div style={{ display: 'flex', gap: 8, marginBottom: 14, overflowX: 'auto', scrollbarWidth: 'none' }}>
                        {POST_TYPES.map(pt => (
                          <button key={pt.id} onClick={() => setPostType(pt.id)} style={{ background: postType === pt.id ? `${pt.color}22` : '#2A2520', border: `1px solid ${postType === pt.id ? pt.color : '#3E3528'}`, borderRadius: 20, padding: '6px 14px', color: postType === pt.id ? pt.color : '#7A6E62', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>{pt.label}</button>
                        ))}
                      </div>
                    )}
                    <textarea value={postText} onChange={e => setPostText(e.target.value.slice(0, 280))} placeholder={activeAction === 'work' ? 'Describe your work...' : "What's on your mind?"} rows={4} style={{ width: '100%', background: '#2A2520', border: '1px solid #3E3528', borderRadius: 12, padding: '12px 14px', color: '#F2EDE6', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', marginBottom: 8, boxSizing: 'border-box' }} />
                    <div style={{ fontSize: 11, color: '#7A6E62', textAlign: 'right', marginBottom: 14 }}>{postText.length}/280</div>
                  </>
                )}

                {activeAction === 'mission' && (
                  <>
                    <textarea value={postText} onChange={e => setPostText(e.target.value)} placeholder="Describe the mission — what you need, deliverable, reward..." rows={5} style={{ width: '100%', background: '#2A2520', border: '1px solid #3E3528', borderRadius: 12, padding: '12px 14px', color: '#F2EDE6', fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'inherit', marginBottom: 14, boxSizing: 'border-box' }} />
                  </>
                )}

                {activeAction === 'ask' && (
                  <div style={{ background: '#2A2520', borderRadius: 14, padding: '16px', marginBottom: 16 }}>
                    <div style={{ fontSize: 14, color: '#B5A898', lineHeight: 1.6 }}>
                      A "Request Backing" post will be shared with your followers, inviting them to invest in you at your current valuation of <span style={{ color: '#C9A84C', fontWeight: 700 }}>${(user.marketCap / 1000).toFixed(0)}k</span>.
                    </div>
                  </div>
                )}

                {activeAction === 'share' && (
                  <div style={{ background: '#2A2520', borderRadius: 14, padding: '16px', marginBottom: 16, textAlign: 'center' }}>
                    <div style={{ fontSize: 14, color: '#F2EDE6', fontWeight: 700, marginBottom: 8 }}>any1.vercel.app/user/1</div>
                    <div style={{ fontSize: 12, color: '#7A6E62' }}>Share your profile link</div>
                  </div>
                )}

                {activeAction === 'message' && (
                  <div style={{ background: '#2A2520', borderRadius: 14, padding: '16px', marginBottom: 16 }}>
                    <div style={{ fontSize: 14, color: '#7A6E62', lineHeight: 1.6 }}>DMs from backers and followers will appear here. Feature coming soon.</div>
                  </div>
                )}

                <button onClick={submitAction} style={{ width: '100%', background: '#C9A84C', color: '#221E1A', border: 'none', borderRadius: 14, padding: 15, fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                  {activeAction === 'post' ? 'Post' : activeAction === 'work' ? 'Upload' : activeAction === 'mission' ? 'Post Mission' : activeAction === 'ask' ? 'Send Request' : 'Done'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Saved toast */}
      {savedToast && (
        <div style={{ position: 'fixed', bottom: 110, left: '50%', transform: 'translateX(-50%)', background: '#C9A84C', color: '#221E1A', borderRadius: 20, padding: '10px 20px', fontSize: 13, fontWeight: 700, zIndex: 400, display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 8px 24px #C9A84C44', animation: 'slideUp 0.3s ease' }}>
          <CheckCircle size={14} /> Profile updated
        </div>
      )}

      <BottomNav onSettingsOpen={onSettingsOpen} />
    </div>
  );
}
