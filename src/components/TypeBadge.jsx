import { USER_TYPES } from '../data/mockData';

const Icons = {
  investor: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3L20 9L12 21L4 9L12 3Z" fill="black" fillOpacity="0.85" strokeLinejoin="round" />
      <path d="M4 9H20M8 9L12 3M16 9L12 3M8 9L12 21M16 9L12 21" stroke="black" strokeWidth="1.2" strokeOpacity="0.3" strokeLinejoin="round" />
    </svg>
  ),
  founder: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3L19 12H14V21H10V12H5L12 3Z" fill="black" fillOpacity="0.85" />
      <rect x="10" y="17" width="4" height="4" fill="black" fillOpacity="0.3" />
    </svg>
  ),
  surfer: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 14C5 10 8 8 11 10C14 12 17 10 21 7" stroke="black" strokeWidth="2.5" strokeOpacity="0.85" strokeLinecap="round" />
      <path d="M3 18C5 14 8 12 11 14C14 16 17 14 21 11" stroke="black" strokeWidth="1.5" strokeOpacity="0.4" strokeLinecap="round" />
    </svg>
  ),
  // Expert: single bold star — master of one craft
  expert: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L14.4 9.2H22L16 13.6L18.4 20.8L12 16.4L5.6 20.8L8 13.6L2 9.2H9.6L12 2Z"
        fill="black"
        fillOpacity="0.85"
      />
    </svg>
  ),
};

export default function TypeBadge({ type, size = 'sm' }) {
  const t = USER_TYPES[type];
  if (!t) return null;

  const sizes = { xs: 18, sm: 24, md: 32, lg: 42 };
  const outerSize = sizes[size] || sizes.sm;
  const iconSize = Math.round(outerSize * 0.55);
  const Icon = Icons[type];

  return (
    <div
      title={t.label}
      style={{
        width: outerSize,
        height: outerSize,
        borderRadius: '50%',
        background: t.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        boxShadow: `0 2px 8px ${t.color}66`,
      }}
    >
      {Icon ? <Icon size={iconSize} /> : null}
    </div>
  );
}
