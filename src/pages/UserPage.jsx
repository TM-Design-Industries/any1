import { useTheme } from '../context/ThemeContext';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { mockUsers, USER_TYPES, generateChart } from '../data/mockData';
import { mockTransactions } from '../data/mockTransactions';
import MiniChart from '../components/MiniChart';
import TypeBadge from '../components/TypeBadge';
import {
  ArrowLeft, TrendingUp, TrendingDown, Heart, MessageCircle,
  MapPin, Calendar, Star, Share2, CheckCircle, Clock, XCircle,
  MessageSquare, ChevronDown, ChevronUp, ArrowUpRight, ArrowDownLeft,
  Eye, EyeOff
} from 'lucide-react';

const STATUS_STYLE = {
  active:    { color: '#C9A84C', bg: '#C9A84C18', label: 'Active' },
  completed: { color: '#4BBFB5', bg: '#4BBFB518', label: 'Done' },
  acquired:  { color: '#D4A843', bg: '#C9A84C18', label: 'Acquired' },
  exited:    { color: '#D4A843', bg: '#C9A84C18', label: 'Exited' },
  closed:    { color: '#7A6E62', bg: '#66666618', label: 'Closed' },
};

const POST_TYPE_COLOR = {
  update: '#7B6FBF', milestone: '#C9A84C', insight: '#D4A843',
  work: '#4BBFB5', thought: '#B5A898',
};

const LEVEL_SYSTEM = [
  { min: 0,   max: 20,       name: 'Newcomer',    color: '#7A6E62' },
  { min: 21,  max: 40,       name: 'Explorer',    color: '#4BBFB5' },
  { min: 41,  max: 60,       name: 'Contributor', color: '#7B6FBF' },
  { min: 61,  max: 80,       name: 'Builder',     color: '#D4A843' },
  { min: 81,  max: 100,      name: 'Amplifier',   color: '#C9A84C' },
  { min: 101, max: Infinity, name: 'Legend',      color: '#C0564A' },
];

const XP_ACTIONS = [
  { action: 'Complete a mission',    xp: '+50' },
  { action: 'Get backed by someone', xp: '+20' },
  { action: 'Apply for a mission',   xp: '+10' },
  { action: 'Mission accepted',      xp: '+30' },
  { action: '7-day streak',          xp: '+25' },
  { action: 'Refer a friend',        xp: '+40' },
];

function TransactionsTab({ userId, navigate, theme }) {
  const txData = mockTransactions[userId];
  const isPublic = txData?.visibility === 'public';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
        {isPublic
          ? <><Eye size={14} color={theme.up} /><span style={{ fontSize: 12, color: theme.up, fontWeight: 600 }}>Public - this user shares their activity</span></>
          : <><EyeOff size={14} color={theme.muted} /><span style={{ fontSize: 12, color: theme.muted }}>Private user - transaction history not disclosed</span></>
        }
      </div>

      {!isPublic && (
        <div style={{ textAlign: 'center', padding: '40px 20px', background: theme.surface, borderRadius: 16, border: `1px solid ${theme.border}` }}>
          <EyeOff size={32} color={theme.border2} style={{ marginBottom: 12, display: 'block', margin: '0 auto 12px' }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: theme.muted, marginBottom: 8 }}>Activity is private</div>
          <div style={{ fontSize: 13, color: theme.border2, lineHeight: 1.5 }}>
            This user has chosen not to disclose their investment history.
          </div>
        </div>
      )}

      {isPublic && txData?.transactions?.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: theme.muted, fontSize: 14 }}>No transactions yet.</div>
      )}

      {isPublic && txData?.transactions?.map(tx => {
        const isBuy = tx.type === 'buy';
        const isPos = tx.return >= 0;
        return (
          <div key={tx.id} onClick={() => navigate(`/user/${tx.targetId}`)} style={{
            background: theme.surface, border: `1px solid ${theme.border}`,
            borderRadius: 14, padding: '14px 16px', marginBottom: 10,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: isBuy ? theme.up : theme.down }} />
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: isBuy ? `${theme.up}18` : `${theme.down}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {isBuy ? <ArrowUpRight size={16} color={theme.up} /> : <ArrowDownLeft size={16} color={theme.down} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: isBuy ? theme.up : theme.down, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{isBuy ? 'Backed' : 'Exited'}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>{tx.targetName}</span>
              </div>
              <div style={{ fontSize: 11, color: theme.muted }}>${tx.amount.toLocaleString()} at ${(tx.price / 1000).toFixed(0)}k valuation - {tx.date}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: isPos ? theme.up : theme.down }}>{isPos ? '+' : ''}{tx.return}%</div>
              <div style={{ fontSize: 10, color: theme.muted }}>return</div>
            </div>
          </div>
        );
      })}

      {isPublic && txData?.transactions?.length > 0 && (
        <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: '14px 16px', marginTop: 4 }}>
          <div style={{ fontSize: 11, color: theme.muted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Summary</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>{txData.transactions.length}</div>
              <div style={{ fontSize: 10, color: theme.muted }}>Total</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: theme.up }}>{txData.transactions.filter(t => t.type === 'buy').length}</div>
              <div style={{ fontSize: 10, color: theme.muted }}>Backed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: theme.down }}>{txData.transactions.filter(t => t.type === 'sell').length}</div>
              <div style={{ fontSize: 10, color: theme.muted }}>Exited</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: theme.accent }}>
                {(txData.transactions.reduce((s, t) => s + t.return, 0) / txData.transactions.length).toFixed(1)}%
              </div>
              <div style={{ fontSize: 10, color: theme.muted }}>Avg Return</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UserPage() {
  const { theme } = useTheme();
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
  const badges = [
    { label: 'Verified', color: theme.accent },
    { label: 'Early Adopter', color: '#7B6FBF' },
  ];
  if (user.missions > 0) badges.push({ label: 'Active', color: '#4BBFB5' });

  const toggleLike = (postId) => setLikedPosts(p => ({ ...p, [postId]: !p[postId] }));

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, paddingBottom: 40, position: 'relative' }}>
      <style>{`@keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

      {/* Back button */}
      {!invested && (
        <button onClick={() => setInvesting(true)} style={{
          position: 'fixed', top: 52, right: 16, zIndex: 200,
          background: theme.accent, color: theme.bg, border: 'none',
          borderRadius: 22, padding: '10px 20px',
          fontSize: 14, fontWeight: 800, cursor: 'pointer',
          boxShadow: `0 4px 20px ${theme.accent}55`,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          Back
        </button>
      )}
      {invested && (
        <div style={{
          position: 'fixed', top: 52, right: 16, zIndex: 200,
          background: `${theme.up}22`, color: theme.up,
          border: `1px solid ${theme.up}44`, borderRadius: 22,
          padding: '10px 20px', fontSize: 13, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <CheckCircle size={14} /> Backed
        </div>
      )}

      {/* Cover */}
      <div style={{ position: 'relative', height: 200 }}>
        <img src={user.cover} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(10,10,10,0.9) 100%)' }} />
        <button onClick={() => navigate(-1)} style={{
          position: 'absolute', top: 52, left: 16,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          border: '1px solid #ffffff22', borderRadius: 10, padding: 8, cursor: 'pointer',
        }}>
          <ArrowLeft size={18} color="#fff" />
        </button>
        <div style={{ position: 'absolute', bottom: -36, left: 20 }}>
          <div style={{ position: 'relative', width: 76, height: 76 }}>
            <div style={{ width: 76, height: 76, borderRadius: '50%', border: `3px solid ${theme.bg}`, overflow: 'hidden' }}>
              <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ position: 'absolute', bottom: -4, right: -4, zIndex: 3 }}>
              <TypeBadge type={user.type} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Profile header */}
      <div style={{ padding: '44px 20px 16px', borderBottom: `1px solid ${theme.border}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: theme.text, marginBottom: 2 }}>{user.name}</div>
            <div style={{ fontSize: 13, color: theme.muted }}>{user.handle}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => navigate(`/chat/${id}`)} style={{
              background: theme.surface2, color: theme.accent, border: `1px solid ${theme.accent}44`,
              borderRadius: 20, padding: '7px 12px', fontSize: 13, fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <MessageSquare size={13} /> Message
            </button>
            <button onClick={() => setFollowing(f => !f)} style={{
              background: following ? theme.surface2 : typeInfo.color,
              color: following ? typeInfo.color : theme.bg,
              border: `1px solid ${typeInfo.color}`,
              borderRadius: 20, padding: '7px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>
              {following ? 'Following' : 'Follow'}
            </button>
          </div>
        </div>

        <div style={{ fontSize: 14, color: theme.text2, lineHeight: 1.5, marginBottom: 12 }}>{user.bio}</div>

        <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: theme.muted }}>
            <MapPin size={12} /> {user.location}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: theme.muted }}>
            <Calendar size={12} /> {user.joined}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: theme.accent }}>
            <Star size={12} fill={theme.accent} color={theme.accent} /> {user.reputation} rep
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
          {user.tags?.map(tag => (
            <span key={tag} style={{
              fontSize: 11, color: typeInfo.color, background: `${typeInfo.color}15`,
              border: `1px solid ${typeInfo.color}33`, borderRadius: 6, padding: '3px 10px',
            }}>{tag}</span>
          ))}
        </div>

        <div style={{ display: 'flex', borderTop: `1px solid ${theme.border}`, paddingTop: 14 }}>
          {[
            { label: 'Market Cap', value: `$${(user.marketCap / 1000).toFixed(0)}k` },
            { label: 'Collateral', value: `$${(user.collateral / 1000).toFixed(0)}k` },
            { label: 'Backers', value: user.investors },
            { label: 'Missions', value: user.missions },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: 1, textAlign: 'center', borderRight: i < 3 ? `1px solid ${theme.border}` : 'none' }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: theme.text, marginBottom: 2 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: theme.muted, letterSpacing: '0.05em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rep bar */}
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${theme.border}`, background: theme.surface }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Star size={14} color={theme.accent} fill={theme.accent} />
            <span style={{ fontSize: 16, fontWeight: 800, color: theme.text }}>{rep}</span>
            <span style={{ fontSize: 12, color: level.color, fontWeight: 600 }}>{level.name}</span>
          </div>
          {nextLevel && <span style={{ fontSize: 11, color: theme.muted }}>{nextLevel.min - rep} to {nextLevel.name}</span>}
        </div>
        <div style={{ background: theme.surface2, borderRadius: 6, height: 6, overflow: 'hidden', marginBottom: 10 }}>
          <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg, ${level.color}, ${nextLevel?.color || level.color})`, borderRadius: 6 }} />
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          {badges.map(b => (
            <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 4, background: `${b.color}18`, border: `1px solid ${b.color}33`, borderRadius: 16, padding: '4px 8px' }}>
              <span style={{ fontSize: 10, color: b.color, fontWeight: 600 }}>{b.label}</span>
            </div>
          ))}
        </div>
        <button onClick={() => setShowXPTable(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: theme.muted, fontSize: 11, padding: 0 }}>
          {showXPTable ? <ChevronUp size={12} /> : <ChevronDown size={12} />} How to earn more rep
        </button>
        {showXPTable && (
          <div style={{ marginTop: 10 }}>
            {XP_ACTIONS.map(row => (
              <div key={row.action} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${theme.border}` }}>
                <span style={{ fontSize: 11, color: theme.text2 }}>{row.action}</span>
                <span style={{ fontSize: 11, color: theme.accent, fontWeight: 700 }}>{row.xp}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart */}
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${theme.border}`, background: theme.surface }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontSize: 12, color: theme.muted, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Value Chart</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: positive ? theme.accent : theme.down }}>
            {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {positive ? '+' : ''}{user.change}%
          </span>
        </div>
        <MiniChart data={generateChart(user.marketCap, user.change)} color={positive ? theme.accent : theme.down} width={390} height={56} />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${theme.border}`, position: 'sticky', top: 0, background: theme.bg, zIndex: 10 }}>
        {['dashboard', 'posts', 'transactions'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, background: 'none', border: 'none',
            borderBottom: tab === t ? `2px solid ${typeInfo.color}` : '2px solid transparent',
            color: tab === t ? theme.text : theme.muted,
            padding: '13px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          }}>
            {t === 'dashboard'
              ? (user.type === 'investor' ? 'Portfolio' : user.type === 'founder' ? 'Ventures' : 'Projects')
              : t === 'posts' ? 'Posts' : 'Transactions'}
          </button>
        ))}
      </div>

      <div style={{ padding: '16px 16px 0' }}>
        {/* Dashboard Tab */}
        {tab === 'dashboard' && (
          <div>
            {user.type === 'investor' && user.investments && (
              <div>
                <div style={{ fontSize: 11, color: theme.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>{user.investments.length} investments</div>
                {user.investments.map((inv, i) => {
                  const st = STATUS_STYLE[inv.status] || STATUS_STYLE.active;
                  const isPos = inv.return.startsWith('+') || inv.return === 'Exited';
                  return (
                    <div key={i} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, padding: '14px 16px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 12, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: st.color }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>{inv.name}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, color: st.color, background: st.bg, borderRadius: 4, padding: '2px 7px' }}>{st.label}</span>
                        </div>
                        <div style={{ fontSize: 12, color: theme.muted }}>{inv.role} - {inv.amount}</div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: isPos ? theme.accent : theme.down }}>{inv.return}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {user.type === 'founder' && user.ventures && (
              <div>
                <div style={{ fontSize: 11, color: theme.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>{user.ventures.length} ventures</div>
                {user.ventures.map((v, i) => {
                  const st = STATUS_STYLE[v.status] || STATUS_STYLE.active;
                  return (
                    <div key={i} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 16, padding: 16, marginBottom: 10, position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${typeInfo.color}88, transparent)` }} />
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div>
                          <div style={{ fontSize: 17, fontWeight: 800, color: theme.text, marginBottom: 2 }}>{v.name}</div>
                          <div style={{ fontSize: 12, color: theme.muted }}>{v.role} - {v.year}</div>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, color: st.color, background: st.bg, borderRadius: 6, padding: '3px 9px' }}>{st.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: theme.accent, fontWeight: 600 }}>
                        <TrendingUp size={13} /> {v.raised}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {(user.type === 'surfer' || user.type === 'expert') && user.projects && (
              <div>
                <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                  {[
                    { label: 'Active', value: user.projects.filter(p => p.status === 'active').length, color: '#4BBFB5' },
                    { label: 'Done', value: user.projects.filter(p => p.status === 'completed').length, color: theme.text2 },
                    { label: 'Rep', value: user.reputation, color: theme.accent },
                  ].map(s => (
                    <div key={s.label} style={{ flex: 1, background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 12, textAlign: 'center' }}>
                      <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.value}</div>
                      <div style={{ fontSize: 11, color: theme.muted, marginTop: 2 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                {user.projects.map((p, i) => {
                  const st = STATUS_STYLE[p.status] || STATUS_STYLE.active;
                  const Icon = p.status === 'active' ? CheckCircle : p.status === 'completed' ? Clock : XCircle;
                  return (
                    <div key={i} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 14, padding: '13px 16px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <Icon size={16} color={st.color} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: theme.text, marginBottom: 2 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: theme.muted }}>{p.role} - {p.deliverable}</div>
                      </div>
                      <span style={{ fontSize: 10, fontWeight: 600, color: st.color, background: st.bg, borderRadius: 4, padding: '2px 7px' }}>{st.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Posts Tab */}
        {tab === 'posts' && (
          <div>
            {!user.posts?.length ? (
              <div style={{ textAlign: 'center', color: theme.muted, padding: '48px 0', fontSize: 14 }}>No posts yet.</div>
            ) : (
              user.posts.map(post => (
                <div key={post.id} style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 18, marginBottom: 14, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px 10px' }}>
                    <img src={user.avatar} alt={user.name} style={{ width: 36, height: 36, borderRadius: '50%', border: `1.5px solid ${typeInfo.color}44` }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: theme.text }}>{user.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 11, color: theme.muted }}>{post.time}</span>
                        <span style={{ width: 3, height: 3, borderRadius: '50%', background: theme.border2, display: 'inline-block' }} />
                        <span style={{ fontSize: 10, fontWeight: 600, color: POST_TYPE_COLOR[post.type] || theme.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{post.type}</span>
                      </div>
                    </div>
                    <TypeBadge type={user.type} size="xs" />
                  </div>
                  <div style={{ padding: '0 16px 12px', fontSize: 14, color: theme.text2, lineHeight: 1.55 }}>{post.text}</div>
                  {post.image && <img src={post.image} alt="" style={{ width: '100%', maxHeight: 220, objectFit: 'cover' }} />}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '10px 16px', borderTop: `1px solid ${theme.border}` }}>
                    <button onClick={() => toggleLike(post.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: likedPosts[post.id] ? theme.down : theme.muted, fontSize: 13, fontWeight: 500, marginRight: 20, padding: 0 }}>
                      <Heart size={16} fill={likedPosts[post.id] ? theme.down : 'none'} color={likedPosts[post.id] ? theme.down : theme.muted} />
                      {post.likes + (likedPosts[post.id] ? 1 : 0)}
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: theme.muted, fontSize: 13, marginRight: 20, padding: 0 }}>
                      <MessageCircle size={16} /> {post.comments}
                    </button>
                    <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: theme.muted, fontSize: 13, marginLeft: 'auto', padding: 0 }}>
                      <Share2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {tab === 'transactions' && <TransactionsTab userId={user.id} navigate={navigate} theme={theme} />}
      </div>

      {/* Invest modal */}
      {investing && !invested && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: 430, margin: '0 auto', background: theme.surface, borderRadius: '24px 24px 0 0', padding: '28px 20px 44px', border: `1px solid ${theme.border}`, animation: 'slideUp 0.3s ease' }}>
            <div style={{ width: 36, height: 4, background: theme.border2, borderRadius: 2, margin: '0 auto 20px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <img src={user.avatar} alt="" style={{ width: 48, height: 48, borderRadius: '50%', border: `2px solid ${typeInfo.color}44` }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: theme.text }}>Back {user.name}</div>
                <div style={{ fontSize: 12, color: theme.muted }}>Current valuation: ${(user.marketCap / 1000).toFixed(0)}k - {user.change >= 0 ? '+' : ''}{user.change}%</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: theme.muted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Choose amount</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {['1', '5', '10', '50'].map(v => (
                <button key={v} onClick={() => setAmount(v)} style={{
                  flex: 1, background: amount === v ? `${theme.accent}22` : theme.surface2,
                  border: `1px solid ${amount === v ? theme.accent : theme.border2}`,
                  borderRadius: 10, padding: '10px 4px',
                  color: amount === v ? theme.accent : theme.muted,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}>${v}</button>
              ))}
            </div>
            <input type="number" placeholder="Custom amount ($)" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%', background: theme.surface2, border: `1px solid ${theme.border2}`, borderRadius: 12, padding: '13px 16px', color: theme.text, fontSize: 15, outline: 'none', marginBottom: 16, boxSizing: 'border-box' }} />
            <div style={{ background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 12, padding: '12px 16px', marginBottom: 16, fontSize: 12, color: theme.muted, lineHeight: 1.5 }}>
              You believe in {user.name.split(' ')[0]}. This backs their valuation and appears in your portfolio.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setInvesting(false); setAmount(''); }} style={{ flex: 1, background: theme.surface2, color: theme.muted, border: `1px solid ${theme.border}`, borderRadius: 14, padding: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => {
                if (!amount) return;
                const portfolio = JSON.parse(localStorage.getItem('any1_portfolio') || '[]');
                const existing = portfolio.find(p => p.userId === id);
                if (existing) { existing.shares = (existing.shares || 0) + 1; }
                else { portfolio.push({ userId: id, shares: 1, buyPrice: user.marketCap, currentPrice: user.marketCap }); }
                localStorage.setItem('any1_portfolio', JSON.stringify(portfolio));
                const cards = JSON.parse(localStorage.getItem('any1_backer_cards') || '[]');
                cards.push({ userId: id, name: user.name, avatar: user.avatar, amount: parseFloat(amount), valuationAtBuy: user.marketCap, date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) });
                localStorage.setItem('any1_backer_cards', JSON.stringify(cards));
                setInvested(true); setInvesting(false);
              }} style={{ flex: 2, background: amount ? theme.accent : theme.surface2, color: amount ? theme.bg : theme.muted, border: 'none', borderRadius: 14, padding: 14, fontSize: 15, fontWeight: 700, cursor: amount ? 'pointer' : 'default' }}>
                {amount ? `Back ${user.name.split(' ')[0]} - $${amount}` : 'Enter amount'}
              </button>
            </div>
          </div>
        </div>
      )}

      {invested && (
        <div style={{ position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)', background: theme.accent, color: theme.bg, borderRadius: 20, padding: '12px 24px', fontSize: 14, fontWeight: 700, zIndex: 300, display: 'flex', alignItems: 'center', gap: 8, animation: 'slideUp 0.3s ease', boxShadow: `0 8px 32px ${theme.accent}44` }}>
          <CheckCircle size={16} />
          You backed {user.name.split(' ')[0]}!
        </div>
      )}
    </div>
  );
}
