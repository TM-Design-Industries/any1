import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NOTIFICATIONS = [
  { id: 'n1', text: 'Oren Cohen believed in you', sub: 'backed you for $10', time: '2m', link: '/user/3', read: false },
  { id: 'n2', text: 'Noa Ben David is following you', sub: 'started following', time: '15m', link: '/user/6', read: false },
  { id: 'n3', text: 'Your portfolio is up 8.3% today', sub: 'Great day!', time: '1h', link: '/portfolio', read: false },
  { id: 'n4', text: 'Maya Levi applied to your mission', sub: 'Design mission', time: '2h', link: '/missions', read: true },
  { id: 'n5', text: 'Ahavat Gordon up 11.7%', sub: 'you believed in them', time: '3h', link: '/user/15', read: true },
];

const MESSAGES = [
  { id: 'm1', from: 'Dovi Frances', text: 'Loved your last post', time: '5m', link: '/chat/2', read: false, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face' },
  { id: 'm2', from: 'Eyal Shani', text: 'Want to collaborate?', time: '1h', link: '/chat/4', read: false, avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&crop=face' },
  { id: 'm3', from: 'Omer Adam', text: 'Thanks for the support!', time: '2h', link: '/chat/5', read: true, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face' },
];

export default function GlobalFloating() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [panel, setPanel] = useState(null);
  const [readNotifs, setReadNotifs] = useState([]);
  const [readMsgs, setReadMsgs] = useState([]);

  const unreadNotifs = NOTIFICATIONS.filter(n => !n.read && !readNotifs.includes(n.id)).length;
  const unreadMsgs = MESSAGES.filter(m => !m.read && !readMsgs.includes(m.id)).length;

  const togglePanel = (p) => {
    if (panel === p) { setPanel(null); return; }
    setPanel(p);
    if (p === 'notifs') setReadNotifs(NOTIFICATIONS.map(n => n.id));
    if (p === 'messages') setReadMsgs(MESSAGES.map(m => m.id));
  };

  const btnStyle = (active) => ({
    width: 34, height: 34, borderRadius: '50%',
    background: active ? `${theme.accent}22` : `${theme.surface2}cc`,
    border: `1px solid ${active ? theme.accent : theme.border}`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', position: 'relative',
    backdropFilter: 'blur(8px)',
  });

  return (
    <>
      {/* Top-right floating icons */}
      <div style={{
        position: 'fixed', top: 52, right: 16,
        display: 'flex', gap: 8, zIndex: 200,
      }}>
        <button onClick={() => togglePanel('notifs')} style={btnStyle(panel === 'notifs')}>
          <Bell size={16} color={panel === 'notifs' ? theme.accent : theme.muted} strokeWidth={1.8} />
          {unreadNotifs > 0 && (
            <div style={{ position: 'absolute', top: -3, right: -3, width: 15, height: 15, borderRadius: '50%', background: theme.down, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#fff', border: `1.5px solid ${theme.bg}` }}>
              {unreadNotifs}
            </div>
          )}
        </button>

        <button onClick={() => togglePanel('messages')} style={btnStyle(panel === 'messages')}>
          <MessageCircle size={16} color={panel === 'messages' ? theme.accent : theme.muted} strokeWidth={1.8} />
          {unreadMsgs > 0 && (
            <div style={{ position: 'absolute', top: -3, right: -3, width: 15, height: 15, borderRadius: '50%', background: theme.down, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 800, color: '#fff', border: `1.5px solid ${theme.bg}` }}>
              {unreadMsgs}
            </div>
          )}
        </button>
      </div>

      {/* Notifications panel */}
      {panel === 'notifs' && (
        <div style={{
          position: 'fixed', top: 92, right: 12, width: 300, maxHeight: '60vh',
          background: theme.surface, border: `1px solid ${theme.border}`,
          borderRadius: 16, zIndex: 200, overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          animation: 'slideDown 0.2s ease',
        }}>
          <style>{`@keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>
          <div style={{ padding: '14px 16px 10px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>Alerts</span>
            <button onClick={() => setPanel(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={15} color={theme.muted} /></button>
          </div>
          {NOTIFICATIONS.map(n => (
            <div key={n.id} onClick={() => { setPanel(null); navigate(n.link); }} style={{ display: 'flex', gap: 10, padding: '12px 16px', borderBottom: `1px solid ${theme.border}`, cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = theme.surface2}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: n.read ? theme.border2 : theme.accent, marginTop: 5, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 13, color: theme.text, fontWeight: n.read ? 400 : 600, marginBottom: 2 }}>{n.text}</div>
                <div style={{ fontSize: 11, color: theme.muted }}>{n.sub} · {n.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messages panel */}
      {panel === 'messages' && (
        <div style={{
          position: 'fixed', top: 92, right: 12, width: 300, maxHeight: '60vh',
          background: theme.surface, border: `1px solid ${theme.border}`,
          borderRadius: 16, zIndex: 200, overflowY: 'auto',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          animation: 'slideDown 0.2s ease',
        }}>
          <div style={{ padding: '14px 16px 10px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>Messages</span>
            <button onClick={() => setPanel(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={15} color={theme.muted} /></button>
          </div>
          {MESSAGES.map(m => {
            const isUnread = !m.read && !readMsgs.includes(m.id);
            return (
              <div key={m.id} onClick={() => { setPanel(null); navigate(m.link); }} style={{ display: 'flex', gap: 10, padding: '12px 16px', borderBottom: `1px solid ${theme.border}`, cursor: 'pointer', background: isUnread ? `${theme.accent}08` : 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.background = theme.surface2}
                onMouseLeave={e => e.currentTarget.style.background = isUnread ? `${theme.accent}08` : 'transparent'}>
                <img src={m.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, objectFit: 'cover' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
      )}

      {/* Click outside to close */}
      {panel && (
        <div onClick={() => setPanel(null)} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />
      )}
    </>
  );
}
