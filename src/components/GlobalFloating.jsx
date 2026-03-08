import { useState } from 'react';
import { Bell, MessageCircle, X, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const MOCK_NOTIFS = [
  { id: 'n1', type: 'price', icon: TrendingUp,  text: 'Ahavat Gordon up 11.7%',       sub: 'You backed them',          time: '3m ago',  color: '#7A9E7E', link: '/user/15' },
  { id: 'n2', type: 'back',  icon: DollarSign,  text: 'Oren Cohen backed you',        sub: '+$50 to your valuation',   time: '12m ago', color: '#C9A84C', link: '/profile' },
  { id: 'n3', type: 'price', icon: TrendingDown,text: 'Eyal Shani down 2.1%',         sub: 'Portfolio impact: -$0.80', time: '1h ago',  color: '#C0564A', link: '/user/11' },
  { id: 'n4', type: 'price', icon: TrendingUp,  text: 'Omer Adam up 9.3% today',      sub: 'Market momentum',          time: '2h ago',  color: '#7A9E7E', link: '/user/14' },
];

const MOCK_MESSAGES = [
  { id: 'm1', from: 'Dovi Frances', avatar: '/dovi-frances.jpg', text: 'Interested in discussing a collaboration on your next project.', time: '5m ago',  read: false, link: '/user/12' },
  { id: 'm2', from: 'Yehuda Levi',  avatar: '/yehuda-levi.jpg',  text: 'Great work on the Air One project! Would love to connect.', time: '1h ago',  read: false, link: '/user/10' },
  { id: 'm3', from: 'Eyal Shani',   avatar: '/eyal-shani.jpg',   text: 'Looking for a designer for a new Miznon concept.',           time: '3h ago',  read: true,  link: '/user/11' },
];

export default function GlobalFloating() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [panel, setPanel] = useState(null); // null | 'notifs' | 'messages'
  const [readN, setReadN] = useState([]);
  const [readM, setReadM] = useState([]);

  const unreadN = MOCK_NOTIFS.filter(n => !readN.includes(n.id)).length;
  const unreadM = MOCK_MESSAGES.filter(m => !m.read && !readM.includes(m.id)).length;

  const openPanel = (p) => {
    setPanel(prev => prev === p ? null : p);
    if (p === 'notifs') setReadN(MOCK_NOTIFS.map(n => n.id));
    if (p === 'messages') setReadM(MOCK_MESSAGES.map(m => m.id));
  };

  return (
    <>
      {/* Floating buttons - top right */}
      <div style={{
        position: 'fixed', top: 52, right: 16, zIndex: 500,
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        {/* Messages */}
        <button onClick={() => openPanel('messages')} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: panel === 'messages' ? `${theme.accent}22` : `${theme.surface2}cc`,
          backdropFilter: 'blur(12px)',
          border: `1px solid ${panel === 'messages' ? theme.accent : theme.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative',
        }}>
          <MessageCircle size={16} color={panel === 'messages' ? theme.accent : theme.muted} strokeWidth={1.8} />
          {unreadM > 0 && (
            <div style={{ position: 'absolute', top: -2, right: -2, width: 14, height: 14, borderRadius: '50%', background: '#C0564A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#fff', border: `1.5px solid ${theme.bg}` }}>
              {unreadM}
            </div>
          )}
        </button>

        {/* Notifications */}
        <button onClick={() => openPanel('notifs')} style={{
          width: 36, height: 36, borderRadius: '50%',
          background: panel === 'notifs' ? `${theme.accent}22` : `${theme.surface2}cc`,
          backdropFilter: 'blur(12px)',
          border: `1px solid ${panel === 'notifs' ? theme.accent : theme.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', position: 'relative',
        }}>
          <Bell size={16} color={panel === 'notifs' ? theme.accent : theme.muted} strokeWidth={1.8} />
          {unreadN > 0 && (
            <div style={{ position: 'absolute', top: -2, right: -2, width: 14, height: 14, borderRadius: '50%', background: '#C0564A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#fff', border: `1.5px solid ${theme.bg}` }}>
              {unreadN}
            </div>
          )}
        </button>
      </div>

      {/* Overlay */}
      {panel && <div style={{ position: 'fixed', inset: 0, zIndex: 498 }} onClick={() => setPanel(null)} />}

      {/* Notifications panel */}
      {panel === 'notifs' && (
        <div style={{
          position: 'fixed', top: 94, right: 16, width: 300, maxHeight: '60vh',
          background: theme.surface, border: `1px solid ${theme.border}`,
          borderRadius: 18, zIndex: 499, overflow: 'hidden',
          boxShadow: '0 8px 40px #00000066',
          animation: 'fadeDown 0.2s ease',
        }}>
          <style>{`@keyframes fadeDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>
          <div style={{ padding: '14px 16px 10px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>Alerts</span>
            <button onClick={() => setPanel(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={15} color={theme.muted} /></button>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 'calc(60vh - 48px)' }}>
            {MOCK_NOTIFS.map(n => {
              const Icon = n.icon;
              return (
                <div key={n.id} onClick={() => { setPanel(null); navigate(n.link); }} style={{ display: 'flex', gap: 10, padding: '12px 16px', borderBottom: `1px solid ${theme.border}`, cursor: 'pointer' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${n.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={14} color={n.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: theme.text, fontWeight: 600, marginBottom: 2 }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: theme.muted }}>{n.sub} · {n.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Messages panel */}
      {panel === 'messages' && (
        <div style={{
          position: 'fixed', top: 94, right: 16, width: 300, maxHeight: '60vh',
          background: theme.surface, border: `1px solid ${theme.border}`,
          borderRadius: 18, zIndex: 499, overflow: 'hidden',
          boxShadow: '0 8px 40px #00000066',
          animation: 'fadeDown 0.2s ease',
        }}>
          <div style={{ padding: '14px 16px 10px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>Messages</span>
            <button onClick={() => setPanel(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={15} color={theme.muted} /></button>
          </div>
          <div style={{ overflowY: 'auto', maxHeight: 'calc(60vh - 48px)' }}>
            {MOCK_MESSAGES.map(m => {
              const isUnread = !m.read && !readM.includes(m.id);
              return (
                <div key={m.id} onClick={() => { setPanel(null); navigate(m.link); }} style={{ display: 'flex', gap: 10, padding: '12px 16px', borderBottom: `1px solid ${theme.border}`, cursor: 'pointer', background: isUnread ? `${theme.accent}08` : 'transparent' }}>
                  <img src={m.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: isUnread ? 700 : 600, color: theme.text }}>{m.from}</span>
                      <span style={{ fontSize: 10, color: theme.muted }}>{m.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: theme.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.text}</div>
                  </div>
                  {isUnread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: theme.accent, flexShrink: 0, marginTop: 4 }} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
