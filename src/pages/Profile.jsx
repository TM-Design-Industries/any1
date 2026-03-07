import { useState, useMemo } from 'react';
import { myProfile, myPortfolio } from '../data/mockData';
import BottomNav from '../components/BottomNav';
import MiniChart from '../components/MiniChart';
import TypeBadge from '../components/TypeBadge';
import { TrendingUp, Lock, Users, Edit2, CheckCircle, Plus, ChevronDown, ChevronUp, Star } from 'lucide-react';

const PRESET_TAGS = ['Fintech', 'Design', 'Engineering', 'Marketing', 'VC', 'Web3', 'CleanTech', 'Media', 'Hardware', 'Growth', 'SaaS', 'OSS'];

const LEVEL_SYSTEM = [
  { min: 0, max: 20, name: 'Newcomer', color: '#7A6E62' },
  { min: 21, max: 40, name: 'Explorer', color: '#4BBFB5' },
  { min: 41, max: 60, name: 'Contributor', color: '#7B6FBF' },
  { min: 61, max: 80, name: 'Builder', color: '#D4A843' },
  { min: 81, max: 100, name: 'Amplifier', color: '#8B9E6E' },
  { min: 101, max: Infinity, name: 'Legend', color: '#C0564A' },
];

const XP_ACTIONS = [
  { action: 'Complete a mission', xp: '+50' },
  { action: 'Get invested by someone', xp: '+20' },
  { action: 'Apply for a mission', xp: '+10' },
  { action: 'Mission accepted', xp: '+30' },
  { action: '7-day streak', xp: '+25' },
  { action: 'Refer a friend', xp: '+40' },
];

const COVER_PRESETS = {
  founder: [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop',
  ],
  investor: [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
  ],
  surfer: [
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=400&fit=crop',
  ],
};

const POST_TYPES = [
  { id: 'update', label: 'Update', color: '#7B6FBF' },
  { id: 'milestone', label: 'Milestone', color: '#8B9E6E' },
  { id: 'insight', label: 'Insight', color: '#D4A843' },
  { id: 'work', label: 'Work', color: '#4BBFB5' },
  { id: 'thought', label: 'Thought', color: '#B5A898' },
];

export default function Profile() {
  const [userData, setUserData] = useState(() => {
    try {
      const stored = localStorage.getItem('any1_user');
      if (stored) return { ...myProfile, ...JSON.parse(stored) };
    } catch {}
    return myProfile;
  });

  const user = userData;

  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editLocation, setEditLocation] = useState(user.location || 'Tel Aviv');
  const [editTags, setEditTags] = useState(user.tags || []);
  const [editCover, setEditCover] = useState(user.cover || '');
  const [savedToast, setSavedToast] = useState(false);

  // Collateral modal
  const [showCollateral, setShowCollateral] = useState(false);
  const [collateralSlider, setCollateralSlider] = useState(user.collateral || 3000);
  const [lockDone, setLockDone] = useState(false);

  // FAB
  const [showFAB, setShowFAB] = useState(false);
  const [postType, setPostType] = useState('update');
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState('');
  const [postToast, setPostToast] = useState(false);

  // Reputation section
  const [showXPTable, setShowXPTable] = useState(false);

  const appliedMissions = JSON.parse(localStorage.getItem('any1_applied_missions') || '[]');

  // Level calculation
  const rep = user.reputation || 32;
  const level = LEVEL_SYSTEM.find(l => rep >= l.min && rep <= l.max) || LEVEL_SYSTEM[0];
  const nextLevel = LEVEL_SYSTEM[LEVEL_SYSTEM.indexOf(level) + 1];
  const progress = nextLevel ? ((rep - level.min) / (nextLevel.min - level.min)) * 100 : 100;

  // Badges
  const badges = useMemo(() => {
    const all = [];
    all.push({ label: 'Verified', icon: '✓', color: '#8B9E6E', earned: true });
    all.push({ label: 'Early Adopter', icon: '🚀', color: '#7B6FBF', earned: true });
    if (myPortfolio.length > 0) all.push({ label: 'First Investment', icon: '💰', color: '#D4A843', earned: true });
    if (appliedMissions.length > 0) all.push({ label: 'Active Surfer', icon: '🏄', color: '#4BBFB5', earned: true });
    return all;
  }, [appliedMissions.length]);

  // Any1 Score calculation
  const collateral = user.collateral || 3000;
  const investors = user.investors || 5;
  const missions = user.missions || 1;
  const any1Score = Math.min(1000, Math.round(
    (collateral / 1000 * 0.4) +
    (rep * 0.3) +
    (investors * 2 * 0.15) +
    (missions * 3 * 0.15)
  ));

  const scoreBreakdown = [
    {
      label: 'Collateral',
      value: Math.round(collateral / 1000 * 0.4),
      max: 20,
      color: '#8B9E6E',
    },
    {
      label: 'Reputation',
      value: Math.round(rep * 0.3),
      max: 30,
      color: '#D4A843',
    },
    {
      label: 'Investors',
      value: Math.round(investors * 2 * 0.15),
      max: 30,
      color: '#7B6FBF',
    },
    {
      label: 'Missions',
      value: Math.round(missions * 3 * 0.15),
      max: 20,
      color: '#4BBFB5',
    },
  ];

  // Simulated preview market cap with collateral
  const previewMarketCap = Math.round(collateralSlider * 2.8 + 1000);

  const saveEdit = () => {
    const updated = {
      ...user,
      name: editName,
      bio: editBio,
      location: editLocation,
      tags: editTags,
      cover: editCover,
    };
    setUserData(updated);
    const stored = JSON.parse(localStorage.getItem('any1_user') || '{}');
    localStorage.setItem('any1_user', JSON.stringify({ ...stored, ...updated }));
    setEditMode(false);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const toggleEditTag = (tag) => {
    if (editTags.includes(tag)) {
      setEditTags(editTags.filter(t => t !== tag));
    } else if (editTags.length < 5) {
      setEditTags([...editTags, tag]);
    }
  };

  const confirmCollateral = () => {
    const stored = JSON.parse(localStorage.getItem('any1_user') || '{}');
    const updated = { ...stored, collateral: collateralSlider };
    localStorage.setItem('any1_user', JSON.stringify(updated));
    setUserData(prev => ({ ...prev, collateral: collateralSlider }));
    setLockDone(true);
    setTimeout(() => { setLockDone(false); setShowCollateral(false); }, 2000);
  };

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

  const localPosts = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('any1_posts') || '[]'); } catch { return []; }
  }, [postToast]);

  const typeColor = user.type === 'investor' ? '#D4A843' : user.type === 'founder' ? '#7B6FBF' : '#4BBFB5';

  return (
    <div style={{ minHeight: '100vh', background: '#221E1A', paddingBottom: 90 }}>
      {/* Hero */}
      <div style={{
        padding: '54px 20px 24px',
        borderBottom: '1px solid #1F1F1F',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(ellipse at top left, ${typeColor}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <div style={{ position: 'relative' }}>
            <img src={user.avatar} alt={user.name} style={{
              width: 72, height: 72, borderRadius: '50%',
              border: `2px solid ${typeColor}66`,
            }} />
            <div style={{ position: 'absolute', bottom: -4, right: -4 }}>
              <TypeBadge type={user.type} size="xs" />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            {editMode ? (
              <input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                style={{
                  width: '100%', background: '#332D27', border: `1px solid ${typeColor}`,
                  borderRadius: 10, padding: '8px 12px', color: '#F2EDE6', fontSize: 18,
                  fontWeight: 800, outline: 'none', marginBottom: 6,
                }}
              />
            ) : (
              <div style={{ fontSize: 20, fontWeight: 800, color: '#F2EDE6', marginBottom: 2 }}>{user.name}</div>
            )}
            <div style={{ fontSize: 13, color: '#7A6E62', marginBottom: 6 }}>{user.handle}</div>
            {editMode ? (
              <textarea
                value={editBio}
                onChange={e => setEditBio(e.target.value)}
                rows={2}
                style={{
                  width: '100%', background: '#332D27', border: '1px solid #252525',
                  borderRadius: 10, padding: '8px 12px', color: '#B5A898',
                  fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'inherit',
                }}
              />
            ) : (
              <div style={{ fontSize: 13, color: '#B5A898' }}>{user.bio}</div>
            )}
          </div>
          <button
            onClick={() => editMode ? saveEdit() : setEditMode(true)}
            style={{
              background: editMode ? '#8B9E6E' : '#2A2520',
              color: editMode ? '#221E1A' : '#7A6E62',
              border: `1px solid ${editMode ? '#8B9E6E' : '#332C24'}`,
              borderRadius: 10, padding: '6px 12px',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
              flexShrink: 0,
            }}
          >
            {editMode ? <><CheckCircle size={12} /> Save</> : <><Edit2 size={12} /> Edit</>}
          </button>
        </div>

        {/* Location edit */}
        {editMode && (
          <div style={{ marginBottom: 12 }}>
            <input
              value={editLocation}
              onChange={e => setEditLocation(e.target.value)}
              placeholder="Location"
              style={{
                width: '100%', background: '#332D27', border: '1px solid #252525',
                borderRadius: 10, padding: '8px 12px', color: '#F2EDE6',
                fontSize: 13, outline: 'none',
              }}
            />
          </div>
        )}

        {/* Tags */}
        {editMode ? (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#7A6E62', marginBottom: 8 }}>Tags (tap to toggle)</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {PRESET_TAGS.map(tag => {
                const sel = editTags.includes(tag);
                return (
                  <button
                    key={tag}
                    onClick={() => toggleEditTag(tag)}
                    style={{
                      fontSize: 11,
                      color: sel ? typeColor : '#7A6E62',
                      background: sel ? `${typeColor}15` : '#332D27',
                      border: `1px solid ${sel ? typeColor : '#3E3528'}`,
                      borderRadius: 6, padding: '4px 10px',
                      cursor: 'pointer', transition: 'all 0.15s',
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
            {user.tags?.map(tag => (
              <span key={tag} style={{
                fontSize: 11, color: typeColor,
                background: `${typeColor}15`,
                border: `1px solid ${typeColor}33`,
                borderRadius: 6, padding: '3px 10px',
              }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Cover presets in edit mode */}
        {editMode && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#7A6E62', marginBottom: 8 }}>Cover image</div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
              {(COVER_PRESETS[user.type] || COVER_PRESETS.founder).map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  onClick={() => setEditCover(url)}
                  style={{
                    width: 100, height: 56, borderRadius: 10,
                    objectFit: 'cover', cursor: 'pointer', flexShrink: 0,
                    border: editCover === url ? `2px solid ${typeColor}` : '2px solid transparent',
                    opacity: editCover === url ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { label: 'Market Cap', value: `$${user.marketCap.toLocaleString()}` },
            { label: 'Collateral', value: `$${(user.collateral || 3000).toLocaleString()}` },
            { label: 'Investors', value: user.investors },
          ].map(s => (
            <div key={s.label} style={{
              flex: 1, background: '#2A2520', border: '1px solid #1F1F1F',
              borderRadius: 12, padding: '12px 10px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#F2EDE6', marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#7A6E62', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>

        {/* Any1 Score (TASK-16) */}
        <div style={{
          background: '#2A2520', border: '1px solid #1F1F1F',
          borderRadius: 20, padding: 20, marginBottom: 16,
        }}>
          <div style={{ fontSize: 11, color: '#7A6E62', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>
            Any1 Score
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 52, fontWeight: 900, color: '#F2EDE6', letterSpacing: '-2px', lineHeight: 1 }}>
              {any1Score}
            </div>
            <div style={{ fontSize: 14, color: '#7A6E62', marginBottom: 8 }}>/ 1000</div>
            <div style={{ flex: 1 }}>
              <MiniChart base={any1Score} change={12} width={80} height={28} />
            </div>
          </div>

          {scoreBreakdown.map(item => (
            <div key={item.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: '#7A6E62' }}>{item.label}</span>
                <span style={{ fontSize: 12, color: item.color, fontWeight: 600 }}>{item.value}</span>
              </div>
              <div style={{ background: '#332D27', borderRadius: 4, height: 4, overflow: 'hidden' }}>
                <div style={{
                  width: `${Math.min(100, (item.value / item.max) * 100)}%`,
                  height: '100%', background: item.color, borderRadius: 4,
                  transition: 'width 0.8s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div style={{
          background: '#2A2520', border: '1px solid #1F1F1F',
          borderRadius: 16, padding: '16px', marginBottom: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 12, color: '#7A6E62', marginBottom: 4 }}>MY VALUE</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#F2EDE6', letterSpacing: '-0.5px' }}>
                ${user.marketCap.toLocaleString()}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8B9E6E', fontWeight: 600, fontSize: 14 }}>
              <TrendingUp size={14} />
              +{user.change}%
            </div>
          </div>
          <MiniChart base={user.marketCap} change={user.change} width={320} height={60} />
        </div>

        {/* Reputation System (TASK-06) */}
        <div style={{
          background: '#2A2520', border: '1px solid #1F1F1F',
          borderRadius: 16, padding: 16, marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star size={14} color="#D4A843" fill="#D4A843" />
                <span style={{ fontSize: 18, fontWeight: 800, color: '#F2EDE6' }}>{rep}</span>
                <span style={{ fontSize: 11, color: '#7A6E62' }}>rep</span>
              </div>
              <div style={{ fontSize: 12, color: level.color, fontWeight: 600, marginTop: 2 }}>
                {level.name}
              </div>
            </div>
            {nextLevel && (
              <div style={{ fontSize: 11, color: '#7A6E62', textAlign: 'right' }}>
                <div>Next: {nextLevel.name}</div>
                <div style={{ color: nextLevel.color }}>{nextLevel.min - rep} more</div>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div style={{ background: '#332D27', borderRadius: 8, height: 8, overflow: 'hidden', marginBottom: 14 }}>
            <div style={{
              width: `${progress}%`, height: '100%',
              background: `linear-gradient(90deg, ${level.color}, ${nextLevel?.color || level.color})`,
              borderRadius: 8, transition: 'width 1s ease',
            }} />
          </div>

          {/* Badges */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
            {badges.map(badge => (
              <div
                key={badge.label}
                title={badge.label}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: `${badge.color}18`, border: `1px solid ${badge.color}44`,
                  borderRadius: 20, padding: '5px 10px',
                  cursor: 'default',
                }}
              >
                <span style={{ fontSize: 14 }}>{badge.icon}</span>
                <span style={{ fontSize: 11, color: badge.color, fontWeight: 600 }}>{badge.label}</span>
              </div>
            ))}
          </div>

          {/* How to earn more */}
          <button
            onClick={() => setShowXPTable(v => !v)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
              color: '#7A6E62', fontSize: 12, padding: 0,
            }}
          >
            {showXPTable ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            How to earn more rep
          </button>

          {showXPTable && (
            <div style={{ marginTop: 12, animation: 'slideUp 0.2s ease' }}>
              {XP_ACTIONS.map(row => (
                <div key={row.action} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '8px 0', borderBottom: '1px solid #1A1A1A',
                }}>
                  <span style={{ fontSize: 12, color: '#B5A898' }}>{row.action}</span>
                  <span style={{ fontSize: 12, color: '#8B9E6E', fontWeight: 700 }}>{row.xp}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
          <button
            onClick={() => setShowCollateral(true)}
            style={{
              flex: 1, background: '#8B9E6E', color: '#221E1A',
              border: 'none', borderRadius: 14, padding: '14px',
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <Lock size={14} />
            Add Collateral
          </button>
          <button style={{
            flex: 1, background: '#332D27', color: '#B5A898',
            border: '1px solid #1F1F1F', borderRadius: 14, padding: '14px',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            <Users size={14} />
            My Investors
          </button>
        </div>

        {/* KYC notice */}
        <div style={{
          background: '#8B9E6E11', border: '1px solid #8B9E6E33',
          borderRadius: 12, padding: '12px 16px',
          display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B9E6E', flexShrink: 0 }} />
          <div style={{ fontSize: 12, color: '#8B9E6E' }}>
            Verify your identity to unlock full investing features
          </div>
        </div>

        {/* My posts */}
        {localPosts.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, color: '#7A6E62', marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              My Posts
            </div>
            {localPosts.slice(0, 3).map(post => (
              <div key={post.id} style={{
                background: '#2A2520', border: '1px solid #1A1A1A',
                borderRadius: 16, padding: '14px 16px', marginBottom: 10,
              }}>
                <div style={{ fontSize: 13, color: '#CCC', lineHeight: 1.5, marginBottom: 8 }}>{post.text}</div>
                <div style={{ fontSize: 11, color: '#7A6E62' }}>{post.time} - {post.type}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
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
        <Plus size={24} color="#221E1A" strokeWidth={3} />
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
              background: '#2A2520', borderRadius: '24px 24px 0 0',
              padding: '24px 20px 40px', border: '1px solid #1F1F1F',
              animation: 'slideUpFull 0.3s ease',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: 36, height: 4, background: '#3E3528', borderRadius: 2, margin: '0 auto 20px' }} />
            <div style={{ fontSize: 17, fontWeight: 700, color: '#F2EDE6', marginBottom: 16 }}>Create Post</div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 16, scrollbarWidth: 'none' }}>
              {POST_TYPES.map(pt => (
                <button
                  key={pt.id}
                  onClick={() => setPostType(pt.id)}
                  style={{
                    background: postType === pt.id ? `${pt.color}22` : '#332D27',
                    border: `1px solid ${postType === pt.id ? pt.color : '#3E3528'}`,
                    borderRadius: 20, padding: '7px 14px',
                    color: postType === pt.id ? pt.color : '#7A6E62',
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
                width: '100%', background: '#332D27', border: '1px solid #252525',
                borderRadius: 14, padding: '14px 16px', color: '#F2EDE6',
                fontSize: 15, outline: 'none', resize: 'none',
                fontFamily: 'inherit', marginBottom: 8,
              }}
            />
            <div style={{ fontSize: 11, color: postText.length > 250 ? '#C0564A' : '#7A6E62', textAlign: 'right', marginBottom: 12 }}>
              {postText.length}/280
            </div>
            <input
              value={postImage}
              onChange={e => setPostImage(e.target.value)}
              placeholder="Image URL (optional)"
              style={{
                width: '100%', background: '#332D27', border: '1px solid #252525',
                borderRadius: 12, padding: '12px 16px', color: '#F2EDE6',
                fontSize: 14, outline: 'none', marginBottom: 16,
              }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setShowFAB(false)}
                style={{
                  flex: 1, background: '#332D27', color: '#7A6E62',
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
                  background: postText.trim() ? '#8B9E6E' : '#332D27',
                  color: postText.trim() ? '#221E1A' : '#7A6E62',
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

      {/* Collateral modal (TASK-15) */}
      {showCollateral && (
        <div style={{
          position: 'fixed', inset: 0, background: '#000000cc',
          backdropFilter: 'blur(8px)', zIndex: 200,
          display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{
            width: '100%', maxWidth: 430, margin: '0 auto',
            background: '#2A2520', borderRadius: '24px 24px 0 0',
            padding: '24px 20px 40px', border: '1px solid #1F1F1F',
            animation: 'slideUpFull 0.3s ease',
          }}>
            <div style={{ width: 36, height: 4, background: '#3E3528', borderRadius: 2, margin: '0 auto 20px' }} />

            {lockDone ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16, animation: 'matchPop 0.6s ease' }}>🔒</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#F2EDE6', marginBottom: 8 }}>
                  ${collateralSlider.toLocaleString()} locked!
                </div>
                <div style={{ fontSize: 14, color: '#8B9E6E' }}>
                  Market cap updated to ~${previewMarketCap.toLocaleString()}
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 17, fontWeight: 700, color: '#F2EDE6', marginBottom: 6 }}>Add Collateral</div>
                <div style={{ fontSize: 13, color: '#7A6E62', marginBottom: 24 }}>
                  Lock funds to increase your market cap
                </div>

                <div style={{ textAlign: 'center', marginBottom: 8 }}>
                  <div style={{ fontSize: 36, fontWeight: 900, color: '#F2EDE6', letterSpacing: '-1px' }}>
                    ${collateralSlider.toLocaleString()}
                  </div>
                </div>

                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={500}
                  value={collateralSlider}
                  onChange={e => setCollateralSlider(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#8B9E6E', marginBottom: 20 }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#7A6E62', marginBottom: 24 }}>
                  <span>$0</span>
                  <span>$50,000</span>
                </div>

                {/* Live preview */}
                <div style={{
                  background: '#332D27', borderRadius: 14, padding: '14px 16px', marginBottom: 20,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div>
                    <div style={{ fontSize: 11, color: '#7A6E62', marginBottom: 4 }}>Est. Market Cap</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#F2EDE6' }}>
                      ~${previewMarketCap.toLocaleString()}
                    </div>
                  </div>
                  <TrendingUp size={20} color="#8B9E6E" />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setShowCollateral(false)}
                    style={{
                      flex: 1, background: '#332D27', color: '#7A6E62',
                      border: '1px solid #252525', borderRadius: 14,
                      padding: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmCollateral}
                    style={{
                      flex: 2, background: '#8B9E6E', color: '#221E1A',
                      border: 'none', borderRadius: 14,
                      padding: 14, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}
                  >
                    <Lock size={14} />
                    Lock ${collateralSlider.toLocaleString()}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Toasts */}
      {savedToast && (
        <div style={{
          position: 'fixed', bottom: 110, left: '50%', transform: 'translateX(-50%)',
          background: '#8B9E6E', color: '#221E1A',
          borderRadius: 20, padding: '10px 20px',
          fontSize: 13, fontWeight: 700, zIndex: 300,
          display: 'flex', alignItems: 'center', gap: 6,
          animation: 'slideUp 0.3s ease',
        }}>
          <CheckCircle size={14} />
          Saved!
        </div>
      )}

      {postToast && (
        <div style={{
          position: 'fixed', bottom: 110, left: '50%', transform: 'translateX(-50%)',
          background: '#8B9E6E', color: '#221E1A',
          borderRadius: 20, padding: '10px 20px',
          fontSize: 13, fontWeight: 700, zIndex: 300,
          display: 'flex', alignItems: 'center', gap: 6,
          animation: 'slideUp 0.3s ease',
        }}>
          <CheckCircle size={14} />
          Posted!
        </div>
      )}

      <BottomNav />
    </div>
  );
}


