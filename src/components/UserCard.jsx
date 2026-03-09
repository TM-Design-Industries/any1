import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import MiniChart from './MiniChart';
import TypeBadge from './TypeBadge';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { USER_TYPES } from '../data/mockData';

const SESSION_ONLINE = {};

export default function UserCard({ user, animate = false, index = 0 }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const positive = user.change >= 0;
  const typeInfo = USER_TYPES[user.type];

  const isOnline = useMemo(() => {
    if (SESSION_ONLINE[user.id] === undefined) SESSION_ONLINE[user.id] = Math.random() > 0.5;
    return SESSION_ONLINE[user.id];
  }, [user.id]);

  const isHot = user.change > 5;
  const isNew = user.id === '6' || user.id === '8';
  const mutualText = user.investors > 20 ? `${user.investors} people you follow invested` : null;

  return (
    <div
      onClick={() => navigate(`/user/${user.id}`)}
      style={{
        background: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: 20,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 10,
        animation: animate ? `slideUp 0.35s ease ${index * 0.07}s both` : 'none',
      }}
    >
      {user.cover && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(${user.cover})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'blur(40px)', opacity: 0.12,
          transform: 'scale(1.1)', pointerEvents: 'none',
        }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${typeInfo?.color || theme.accent}99, transparent)`, zIndex: 1 }} />

      <div style={{ position: 'relative', zIndex: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(isHot || isNew) && (
          <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 6 }}>
            {isHot && <span style={{ background: `${theme.down}22`, border: `1px solid ${theme.down}55`, borderRadius: 8, padding: '2px 7px', fontSize: 10, color: theme.down, fontWeight: 700 }}>Hot</span>}
            {isNew && <span style={{ background: `${theme.accent}22`, border: `1px solid ${theme.accent}55`, borderRadius: 8, padding: '2px 7px', fontSize: 10, color: theme.accent, fontWeight: 700 }}>New</span>}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ position: 'relative', flexShrink: 0, width: 52, height: 52 }}>
            <img src={user.avatar} alt={user.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', border: `2px solid ${typeInfo?.color || theme.accent}44` }} />
            <div style={{ position: 'absolute', bottom: -5, right: -5, zIndex: 3 }}>
              <TypeBadge type={user.type} size="xs" />
            </div>
            {isOnline && <div style={{ position: 'absolute', top: 1, right: 1, width: 9, height: 9, borderRadius: '50%', background: theme.up, border: `2px solid ${theme.bg}`, zIndex: 2 }} />}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: theme.text, marginBottom: 1 }}>{user.name}</div>
            <div style={{ fontSize: 12, color: theme.muted, marginBottom: 4 }}>{user.handle}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={10} color={theme.accent} fill={theme.accent} />
              <span style={{ fontSize: 11, color: theme.accent, fontWeight: 600 }}>{user.reputation}</span>
              <span style={{ fontSize: 11, color: theme.border2, marginLeft: 4 }}>rep</span>
              {isOnline && <span style={{ fontSize: 10, color: theme.up, marginLeft: 6 }}>online</span>}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
            <MiniChart base={user.marketCap} change={user.change} width={70} height={28} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 700, color: positive ? theme.accent : theme.down }}>
              {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {positive ? '+' : ''}{user.change}%
            </div>
          </div>
        </div>

        <div style={{ fontSize: 13, color: theme.muted, lineHeight: 1.4 }}>{user.bio}</div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {user.tags?.slice(0, 3).map(tag => (
              <span key={tag} style={{ fontSize: 10, color: theme.muted, background: theme.surface2, border: `1px solid ${theme.border}`, borderRadius: 6, padding: '3px 8px' }}>{tag}</span>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: theme.text }}>${user.marketCap.toLocaleString()}</div>
            {mutualText && <div style={{ fontSize: 10, color: theme.muted, textAlign: 'right' }}>{mutualText}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}