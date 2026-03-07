import { USER_TYPES } from '../data/mockData';

// Clean minimal SVG icons - black on color bg
const Icons = {
  investor: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 2L13 6L8 14L3 6L8 2Z" fill="black" fillOpacity="0.7" />
      <path d="M3 6H13M6 6L8 2M10 6L8 2M6 6L8 14M10 6L8 14" stroke="black" strokeWidth="0.8" strokeOpacity="0.25" strokeLinejoin="round" />
    </svg>
  ),
  founder: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 2L12 8H9.5V14H6.5V8H4L8 2Z" fill="black" fillOpacity="0.7" />
    </svg>
  ),
  surfer: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M2 9C4 6 6 5 8 7C10 9 12 8 14 5" stroke="black" strokeWidth="1.8" strokeOpacity="0.7" strokeLinecap="round" />
      <path d="M2 12C4 9 6 8 8 10C10 12 12 11 14 8" stroke="black" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
    </svg>
  ),
  expert: ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L9.5 6H14L10.5 8.5L12 13L8 10.5L4 13L5.5 8.5L2 6H6.5L8 1.5Z" fill="black" fillOpacity="0.7" />
    </svg>
  ),
};

export default function TypeBadge({ type, size = 'sm' }) {
  const t = USER_TYPES[type];
  if (!t) return null;

  const sizes = { xs: 18, sm: 22, md: 30, lg: 40 };
  const outerSize = sizes[size] || sizes.sm;
  const iconSize = Math.round(outerSize * 0.58);
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
        boxShadow: `0 1px 4px ${t.color}44`,
      }}
    >
      {Icon ? <Icon size={iconSize} /> : null}
    </div>
  );
}
