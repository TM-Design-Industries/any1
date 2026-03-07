import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import MiniChart from './MiniChart';
import TypeBadge from './TypeBadge';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';
import { USER_TYPES } from '../data/mockData';

// Fixed online status per session per user
const SESSION_ONLINE = {};

export default function UserCard({ user, animate = false, index = 0 }) {
  const navigate = useNavigate();
  const positive = user.change >= 0;
  const typeInfo = USER_TYPES[user.type];

  // Fixed per-session online status
  const isOnline = useMemo(() => {
    if (SESSION_ONLINE[user.id] === undefined) {
      SESSION_ONLINE[user.id] = Math.random() > 0.5;
    }
    return SESSION_ONLINE[user.id];
  }, [user.id]);

  const isHot = user.change > 5;
  const isNew = user.id === '6' || user.id === '8';
  const mutualText = user.investors > 20 ? `${user.investors} people you follow invested` : null;

  return (
    <div
      onClick={() => navigate(`/user/${user.id}`)}
      style={{
        background: '#252019',
        border: '1px solid #1F1F1F',
        borderRadius: 20,
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 10,
        animation: animate ? `slideUp 0.35s ease ${index * 0.07}s both` : 'none',
      }}
    >
      {/* Blurred cover background */}
      {user.cover && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: `url(${user.cover})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(40px)',
          opacity: 0.15,
          transform: 'scale(1.1)',
          pointerEvents: 'none',
        }} />
      )}

      {/* dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(10,10,10,0.75)',
        pointerEvents: 'none',
      }} />

      {/* color bar top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${typeInfo?.color || user.color}99, transparent)`,
        zIndex: 1,
      }} />

      <div style={{ position: 'relative', zIndex: 1, padding: '18px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Badges row */}
        {(isHot || isNew) && (
          <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 6 }}>
            {isHot && (
              <span style={{
                background: '#E0555522', border: '1px solid #E0555555',
                borderRadius: 8, padding: '2px 7px',
                fontSize: 10, color: '#C0564A', fontWeight: 700,
              }}>
                🔥 Hot
              </span>
            )}
            {isNew && (
              <span style={{
                background: '#C9A84C22', border: '1px solid #C9A84C55',
                borderRadius: 8, padding: '2px 7px',
                fontSize: 10, color: '#D4A843', fontWeight: 700,
              }}>
                New
              </span>
            )}
          </div>
        )}

        {/* Row 1: avatar + info + chart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Avatar with type badge + online dot */}
          <div style={{ position: 'relative', flexShrink: 0, width: 52, height: 52 }}>
            <img
              src={user.avatar}
              alt={user.name}
              style={{
                width: 52, height: 52, borderRadius: '50%',
                objectFit: 'cover',
                border: `2px solid ${typeInfo?.color || user.color}44`,
              }}
            />
            {/* Type badge - bottom right of avatar */}
            <div style={{ position: 'absolute', bottom: -5, right: -5, zIndex: 3 }}>
              <TypeBadge type={user.type} size="xs" />
            </div>
            {/* Online indicator - top right, no overlap with badge */}
            {isOnline && (
              <div style={{
                position: 'absolute', top: 1, right: 1,
                width: 9, height: 9, borderRadius: '50%',
                background: '#4CAF50',
                border: '2px solid #111',
                zIndex: 2,
              }} />
            )}
          </div>

          {/* Name + handle + rep */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#F2EDE6', marginBottom: 1 }}>
              {user.name}
            </div>
            <div style={{ fontSize: 12, color: '#7A6E62', marginBottom: 4 }}>{user.handle}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Star size={10} color="#D4A843" fill="#D4A843" />
              <span style={{ fontSize: 11, color: '#D4A843', fontWeight: 600 }}>{user.reputation}</span>
              <span style={{ fontSize: 11, color: '#3E3528', marginLeft: 4 }}>rep</span>
              {isOnline && (
                <span style={{ fontSize: 10, color: '#4CAF50', marginLeft: 6 }}>online</span>
              )}
            </div>
          </div>

          {/* Chart + change */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
            <MiniChart base={user.marketCap} change={user.change} width={70} height={28} />
            <div style={{
              display: 'flex', alignItems: 'center', gap: 3,
              fontSize: 12, fontWeight: 700,
              color: positive ? '#8B9E6E' : '#C0564A',
            }}>
              {positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {positive ? '+' : ''}{user.change}%
            </div>
          </div>
        </div>

        {/* Row 2: bio */}
        <div style={{ fontSize: 13, color: '#7A6E62', lineHeight: 1.4 }}>
          {user.bio}
        </div>

        {/* Row 3: tags + market cap */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {user.tags?.slice(0, 3).map(tag => (
              <span key={tag} style={{
                fontSize: 10, color: '#7A6E62',
                background: '#2E2820', border: '1px solid #252525',
                borderRadius: 6, padding: '3px 8px',
                letterSpacing: '0.03em',
              }}>
                {tag}
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#F2EDE6' }}>
              ${user.marketCap.toLocaleString()}
            </div>
            {mutualText && (
              <div style={{ fontSize: 10, color: '#7A6E62', textAlign: 'right' }}>
                {mutualText}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


