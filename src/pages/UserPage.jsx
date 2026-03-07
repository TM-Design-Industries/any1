import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { mockUsers, USER_TYPES } from '../data/mockData';
import MiniChart from '../components/MiniChart';
import TypeBadge from '../components/TypeBadge';
import {
  ArrowLeft, TrendingUp, TrendingDown, Heart, MessageCircle,
  MapPin, Calendar, Star, Users, Briefcase, Lock,
  Share2, CheckCircle, Clock, XCircle, MessageSquare, ChevronDown, ChevronUp
} from 'lucide-react';

const STATUS_STYLE = {
  active:    { color: '#8B9E6E', bg: '#8B9E6E18', label: 'Active' },
  completed: { color: '#4BBFB5', bg: '#5FBFB518', label: 'Done' },
  acquired:  { color: '#D4A843', bg: '#C9A84C18', label: 'Acquired' },
  exited:    { color: '#D4A843', bg: '#C9A84C18', label: 'Exited' },
  closed:    { color: '#7A6E62',    bg: '#66666618', label: 'Closed' },
};

const POST_TYPE_COLOR = {
  update:    '#7B6FBF',
  milestone: '#8B9E6E',
  insight:   '#D4A843',
  work:      '#4BBFB5',
  thought:   '#B5A898',
};

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

export default function UserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = mockUsers.find(u => u.id === id);
  const [tab, setTab] = useState('dashboard');
  const [investing, setInvesting] = useState(false);
  const [amount, setAmount] = useState('');
  const [invested, setInvested] = useState(false);
  const [following, setFollowing] = useState(false);
  const [likedPosts, setLikedPosts] = useState({});
  const [showXPTable, setShowXPTable] = useState(false);

  if (!user) return null;

  const positive = user.change >= 0;
  const typeInfo = USER_TYPES[user.type];
  const rep = user.reputation;

  const level = LEVEL_SYSTEM.find(l => rep >= l.min && rep <= l.max) || LEVEL_SYSTEM[0];
  const nextLevel = LEVEL_SYSTEM[LEVEL_SYSTEM.indexOf(level) + 1];
  const progress = nextLevel ? ((rep - level.min) / (nextLevel.min - level.min)) * 100 : 100;

  const badges = [];
  badges.push({ label: 'Verified', icon: '✓', color: '#8B9E6E', earned: true });
  badges.push({ label: 'Early Adopter', icon: '🚀', color: '#7B6FBF', earned: true });
  if ((user.investments?.length || user.ventures?.length) > 0) {
    badges.push({ label: 'First Investment', icon: '💰', color: '#D4A843', earned: true });
  }
  if (user.missions > 0) {
    badges.push({ label: 'Active Surfer', icon: '🏄', color: '#4BBFB5', earned: true });
  }

  const toggleLike = (postId) => {
    setLikedPosts(p => ({ ...p, [postId]: !p[postId] }));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#1C1814', paddingBottom: 40, position: 'relative' }}>

      {/* Floating Invest button - always visible */}
      {!invested && (
        <button
          onClick={() => setInvesting(true)}
          style={{
            position: 'fixed',
            top: 52,
            right: 16,
            zIndex: 200,
            background: '#F5C842',
            color: '#1C1814',
            border: 'none',
            borderRadius: 22,
            padding: '10px 20px',
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 20px #F5C84266',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            letterSpacing: '-0.2px',
          }}
        >
          💰 Invest
        </button>
      )}
      {invested && (
        <div
          style={{
            position: 'fixed',
            top: 52,
            right: 16,
            zIndex: 200,
            background: '#1A2A1A',
            color: '#2EC4B6',
            border: '1px solid #2EC4B644',
            borderRadius: 22,
            padding: '10px 20px',
            fontSize: 13,
            fontWeight: 700,
            boxShadow: '0 4px 20px #2EC4B622',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          ✓ Invested
        </div>
      )}

      {/* Cover image */}
      <div style={{ position: 'relative', height: 200 }}>
        <img
          src={user.cover}
          alt="cover"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(10,10,10,0.9) 100%)',
        }} />

        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: 52, left: 16,
            background: '#1C1814cc', backdropFilter: 'blur(8px)',
            border: '1px solid #ffffff22', borderRadius: 10,
            padding: 8, cursor: 'pointer',
          }}
        >
          <ArrowLeft size={18} color="#F2EDE6" />
        </button>



        <div style={{ position: 'absolute', bottom: -36, left: 20 }}>
          <div style={{ position: 'relative', width: 76, height: 76 }}>
            <div style={{
              width: 76, height: 76, borderRadius: '50%',
              border: '3px solid #1C1814',
              overflow: 'hidden',
            }}>
              <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {/* TypeBadge bottom-right, no overlap */}
            <div style={{ position: 'absolute', bottom: -4, right: -4, zIndex: 3 }}>
              <TypeBadge type={user.type} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile header */}
      <div style={{ padding: '44px 20px 16px', borderBottom: '1px solid #1A1A1A' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#F2EDE6', marginBottom: 2 }}>{user.name}</div>
            <div style={{ fontSize: 13, color: '#7A6E62' }}>{user.handle}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => navigate(`/chat/${id}`)}
              style={{
                background: '#2E2820',
                color: '#8B9E6E',
                border: '1px solid #8B9E6E44',
                borderRadius: 20, padding: '7px 12px',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <MessageSquare size={13} />
              Message
            </button>
            <button
              onClick={() => setFollowing(f => !f)}
              style={{
                background: following ? '#2E2820' : typeInfo.color,
                color: following ? typeInfo.color : '#1C1814',
                border: `1px solid ${typeInfo.color}`,
                borderRadius: 20, padding: '7px 14px',
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              {following ? 'Following' : 'Follow'}
            </button>

          </div>
        </div>

        <div style={{ fontSize: 14, color: '#B5A898', lineHeight: 1.5, marginBottom: 12 }}>
          {user.bio}
        </div>

        <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#7A6E62' }}>
            <MapPin size={12} /> {user.location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#7A6E62' }}>
            <Calendar size={12} /> {user.joined}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#D4A843' }}>
            <Star size={12} fill="#D4A843" /> {user.reputation} rep
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {user.tags?.map(tag => (
            <span key={tag} style={{
              fontSize: 11, color: typeInfo.color,
              background: `${typeInfo.color}15`,
              border: `1px solid ${typeInfo.color}33`,
              borderRadius: 6, padding: '3px 10px',
            }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 0, borderTop: '1px solid #1A1A1A', paddingTop: 14 }}>
          {[
            { label: 'Market Cap', value: `$${user.marketCap.toLocaleString()}` },
            { label: 'Collateral', value: `$${user.collateral.toLocaleString()}` },
            { label: 'Investors', value: user.investors },
            { label: 'Missions', value: user.missions },
          ].map((s, i) => (
            <div key={s.label} style={{
              flex: 1, textAlign: 'center',
              borderRight: i < 3 ? '1px solid #1A1A1A' : 'none',
            }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#F2EDE6', marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: '#7A6E62', letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Reputation section */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #1A1A1A', background: '#0D0D0D' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Star size={14} color="#D4A843" fill="#D4A843" />
            <span style={{ fontSize: 16, fontWeight: 800, color: '#F2EDE6' }}>{rep}</span>
            <span style={{ fontSize: 12, color: level.color, fontWeight: 600 }}>{level.name}</span>
          </div>
          {nextLevel && (
            <span style={{ fontSize: 11, color: '#7A6E62' }}>
              {nextLevel.min - rep} to {nextLevel.name}
            </span>
          )}
        </div>

        <div style={{ background: '#2E2820', borderRadius: 6, height: 6, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{
            width: `${progress}%`, height: '100%',
            background: `linear-gradient(90deg, ${level.color}, ${nextLevel?.color || level.color})`,
            borderRadius: 6,
          }} />
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          {badges.map(badge => (
            <div
              key={badge.label}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: `${badge.color}18`, border: `1px solid ${badge.color}33`,
                borderRadius: 16, padding: '4px 8px',
              }}
            >
              <span style={{ fontSize: 12 }}>{badge.icon}</span>
              <span style={{ fontSize: 10, color: badge.color, fontWeight: 600 }}>{badge.label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowXPTable(v => !v)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            color: '#7A6E62', fontSize: 11, padding: 0,
          }}
        >
          {showXPTable ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          How to earn more rep
        </button>

        {showXPTable && (
          <div style={{ marginTop: 10, animation: 'slideUp 0.2s ease' }}>
            {XP_ACTIONS.map(row => (
              <div key={row.action} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '7px 0', borderBottom: '1px solid #1A1A1A',
              }}>
                <span style={{ fontSize: 11, color: '#B5A898' }}>{row.action}</span>
                <span style={{ fontSize: 11, color: '#8B9E6E', fontWeight: 700 }}>{row.xp}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart strip */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #1A1A1A', background: '#0D0D0D' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: '#7A6E62', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Value Chart</span>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 13, fontWeight: 700,
            color: positive ? '#8B9E6E' : '#C0564A',
          }}>
            {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {positive ? '+' : ''}{user.change}%
          </span>
        </div>
        <MiniChart base={user.marketCap} change={user.change} width={350} height={56} />
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', borderBottom: '1px solid #1A1A1A',
        position: 'sticky', top: 0, background: '#1C1814', zIndex: 10,
      }}>
        {['dashboard', 'posts'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, background: 'none', border: 'none',
              borderBottom: tab === t ? `2px solid ${typeInfo.color}` : '2px solid transparent',
              color: tab === t ? '#F2EDE6' : '#7A6E62',
              padding: '13px 0',
              fontSize: 13, fontWeight: 600,
              cursor: 'pointer', textTransform: 'capitalize',
              letterSpacing: '0.03em',
            }}
          >
            {t === 'dashboard' ? (user.type === 'investor' ? 'Portfolio' : user.type === 'founder' ? 'Ventures' : 'Projects') : 'Posts'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ padding: '16px 16px 0' }}>

        {tab === 'dashboard' && (
          <div>
            {user.type === 'investor' && user.investments && (
              <div>
                <div style={{ fontSize: 11, color: '#7A6E62', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
                  {user.investments.length} investments
                </div>
                {user.investments.map((inv, i) => {
                  const st = STATUS_STYLE[inv.status] || STATUS_STYLE.active;
                  const isPos = inv.return.startsWith('+') || inv.return === 'Exited';
                  return (
                    <div key={i} style={{
                      background: '#252019', border: '1px solid #1A1A1A',
                      borderRadius: 16, padding: '14px 16px', marginBottom: 10,
                      display: 'flex', alignItems: 'center', gap: 12,
                      position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{
                        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
                        background: st.color,
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 15, color: '#F2EDE6' }}>{inv.name}</span>
                          <span style={{
                            fontSize: 10, fontWeight: 600,
                            color: st.color, background: st.bg,
                            borderRadius: 4, padding: '2px 7px',
                          }}>{st.label}</span>
                        </div>
                        <div style={{ fontSize: 12, color: '#7A6E62' }}>{inv.role} - {inv.amount}</div>
                      </div>
                      <div style={{
                        fontSize: 15, fontWeight: 800,
                        color: isPos ? '#8B9E6E' : '#C0564A',
                      }}>
                        {inv.return}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {user.type === 'founder' && user.ventures && (
              <div>
                <div style={{ fontSize: 11, color: '#7A6E62', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
                  {user.ventures.length} ventures
                </div>
                {user.ventures.map((v, i) => {
                  const st = STATUS_STYLE[v.status] || STATUS_STYLE.active;
                  return (
                    <div key={i} style={{
                      background: '#252019', border: '1px solid #1A1A1A',
                      borderRadius: 16, padding: '16px', marginBottom: 10,
                      position: 'relative', overflow: 'hidden',
                    }}>
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                        background: `linear-gradient(90deg, ${typeInfo.color}88, transparent)`,
                      }} />
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 17, fontWeight: 800, color: '#F2EDE6', marginBottom: 2 }}>{v.name}</div>
                          <div style={{ fontSize: 12, color: '#7A6E62' }}>{v.role} - {v.year}</div>
                        </div>
                        <span style={{
                          fontSize: 10, fontWeight: 600,
                          color: st.color, background: st.bg,
                          borderRadius: 6, padding: '3px 9px',
                        }}>{st.label}</span>
                      </div>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        fontSize: 13, color: '#8B9E6E', fontWeight: 600,
                      }}>
                        <TrendingUp size={13} />
                        {v.raised}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {user.type === 'surfer' && user.projects && (
              <div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  <div style={{
                    flex: 1, background: '#252019', border: '1px solid #1A1A1A',
                    borderRadius: 14, padding: '12px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#4BBFB5' }}>
                      {user.projects.filter(p => p.status === 'active').length}
                    </div>
                    <div style={{ fontSize: 11, color: '#7A6E62', marginTop: 2 }}>Active</div>
                  </div>
                  <div style={{
                    flex: 1, background: '#252019', border: '1px solid #1A1A1A',
                    borderRadius: 14, padding: '12px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#B5A898' }}>
                      {user.projects.filter(p => p.status === 'completed').length}
                    </div>
                    <div style={{ fontSize: 11, color: '#7A6E62', marginTop: 2 }}>Completed</div>
                  </div>
                  <div style={{
                    flex: 1, background: '#252019', border: '1px solid #1A1A1A',
                    borderRadius: 14, padding: '12px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#D4A843' }}>
                      {user.reputation}
                    </div>
                    <div style={{ fontSize: 11, color: '#7A6E62', marginTop: 2 }}>Rep Score</div>
                  </div>
                </div>

                {user.projects.map((p, i) => {
                  const st = STATUS_STYLE[p.status] || STATUS_STYLE.active;
                  const Icon = p.status === 'active' ? CheckCircle : p.status === 'completed' ? Clock : XCircle;
                  return (
                    <div key={i} style={{
                      background: '#252019', border: '1px solid #1A1A1A',
                      borderRadius: 14, padding: '13px 16px', marginBottom: 8,
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      <Icon size={16} color={st.color} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#F2EDE6', marginBottom: 2 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: '#7A6E62' }}>{p.role} - {p.deliverable}</div>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 600,
                        color: st.color, background: st.bg,
                        borderRadius: 4, padding: '2px 7px',
                      }}>{st.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {tab === 'posts' && (
          <div>
            {!user.posts?.length ? (
              <div style={{ textAlign: 'center', color: '#7A6E62', padding: '48px 0', fontSize: 14 }}>
                No posts yet.
              </div>
            ) : (
              user.posts.map(post => (
                <div key={post.id} style={{
                  background: '#252019', border: '1px solid #1A1A1A',
                  borderRadius: 18, marginBottom: 14, overflow: 'hidden',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 10px' }}>
                    <img src={user.avatar} alt={user.name} style={{
                      width: 36, height: 36, borderRadius: '50%',
                      border: `1.5px solid ${typeInfo.color}44`,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: '#F2EDE6' }}>{user.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 11, color: '#7A6E62' }}>{post.time}</span>
                        <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#3E3528' }} />
                        <span style={{
                          fontSize: 10, fontWeight: 600,
                          color: POST_TYPE_COLOR[post.type] || '#7A6E62',
                          textTransform: 'uppercase', letterSpacing: '0.06em',
                        }}>{post.type}</span>
                      </div>
                    </div>
                    <TypeBadge type={user.type} size="xs" />
                  </div>

                  <div style={{ padding: '0 16px 12px', fontSize: 14, color: '#CCC', lineHeight: 1.55 }}>
                    {post.text}
                  </div>

                  {post.image && (
                    <img
                      src={post.image}
                      alt=""
                      style={{ width: '100%', maxHeight: 220, objectFit: 'cover' }}
                    />
                  )}

                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 0,
                    padding: '10px 16px', borderTop: '1px solid #1A1A1A',
                  }}>
                    <button
                      onClick={() => toggleLike(post.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: likedPosts[post.id] ? '#C0564A' : '#7A6E62',
                        fontSize: 13, fontWeight: 500, marginRight: 20, padding: 0,
                      }}
                    >
                      <Heart
                        size={16}
                        fill={likedPosts[post.id] ? '#C0564A' : 'none'}
                        color={likedPosts[post.id] ? '#C0564A' : '#7A6E62'}
                      />
                      {post.likes + (likedPosts[post.id] ? 1 : 0)}
                    </button>
                    <button style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#7A6E62', fontSize: 13, fontWeight: 500,
                      marginRight: 20, padding: 0,
                    }}>
                      <MessageCircle size={16} />
                      {post.comments}
                    </button>
                    <button style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#7A6E62', fontSize: 13, marginLeft: 'auto', padding: 0,
                    }}>
                      <Share2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Invest modal */}
      {investing && !invested && (
        <div style={{
          position: 'fixed', inset: 0, background: '#000000cc',
          backdropFilter: 'blur(8px)', zIndex: 200,
          display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{
            width: '100%', maxWidth: 430, margin: '0 auto',
            background: '#252019', borderRadius: '24px 24px 0 0',
            padding: '24px 20px 40px',
            border: '1px solid #1F1F1F',
            animation: 'slideUp 0.3s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <img src={user.avatar} alt="" style={{ width: 44, height: 44, borderRadius: '50%' }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#F2EDE6' }}>Invest in {user.name}</div>
                <div style={{ fontSize: 12, color: '#7A6E62' }}>Market cap: ${user.marketCap.toLocaleString()}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {['0.10', '1.00', '5.00', '10.00'].map(v => (
                <button key={v} onClick={() => setAmount(v)} style={{
                  flex: 1,
                  background: amount === v ? '#8B9E6E22' : '#2E2820',
                  border: `1px solid ${amount === v ? '#8B9E6E' : '#3E3528'}`,
                  borderRadius: 10, padding: '9px 4px',
                  color: amount === v ? '#8B9E6E' : '#7A6E62',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}>${v}</button>
              ))}
            </div>
            <input
              type="number"
              placeholder="Custom amount..."
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{
                width: '100%', background: '#2E2820',
                border: '1px solid #252525', borderRadius: 12,
                padding: '13px 16px', color: '#F2EDE6',
                fontSize: 15, outline: 'none', marginBottom: 14,
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setInvesting(false); setAmount(''); }} style={{
                flex: 1, background: '#2E2820', color: '#7A6E62',
                border: '1px solid #252525', borderRadius: 14,
                padding: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}>Cancel</button>
              <button
                onClick={() => { if (amount) { setInvested(true); setInvesting(false); } }}
                style={{
                  flex: 2,
                  background: amount ? '#8B9E6E' : '#2E2820',
                  color: amount ? '#1C1814' : '#7A6E62',
                  border: 'none', borderRadius: 14,
                  padding: 14, fontSize: 15, fontWeight: 700,
                  cursor: amount ? 'pointer' : 'default',
                }}
              >
                {amount ? `Invest $${amount}` : 'Enter amount'}
              </button>
            </div>
          </div>
        </div>
      )}

      {invested && (
        <div style={{
          position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
          background: '#8B9E6E', color: '#1C1814',
          borderRadius: 20, padding: '12px 24px',
          fontSize: 14, fontWeight: 700,
          zIndex: 300, display: 'flex', alignItems: 'center', gap: 8,
          animation: 'slideUp 0.3s ease',
          boxShadow: '0 8px 32px #8B9E6E44',
        }}>
          <CheckCircle size={16} />
          Invested in {user.name.split(' ')[0]}!
        </div>
      )}
    </div>
  );
}

