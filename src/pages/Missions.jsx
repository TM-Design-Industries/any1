import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Users, Clock, CheckCircle, Filter } from 'lucide-react';
import { mockUsers } from '../data/mockData';

const MISSION_TYPES = {
  design: { color: '#7B6FBF', bg: '#7B6FBF18' },
  engineering: { color: '#5FBFB5', bg: '#5FBFB518' },
  marketing: { color: '#C9A84C', bg: '#C9A84C18' },
  writing: { color: '#8B9E6E', bg: '#8B9E6E18' },
  strategy: { color: '#E05555', bg: '#E0555518' },
};

export const mockMissions = [
  {
    id: 'm1',
    title: 'Design landing page for PayFlow',
    description: 'We need a conversion-focused landing page for our fintech product. Looking for a designer who understands B2B SaaS and knows how to make complex things simple. Full creative freedom, we trust the process. Deliverable: Figma file + handoff notes. Timeline: 2 weeks.',
    creatorId: '1',
    type: 'design',
    reward: '$500',
    applicants: 7,
    deadline: 'Mar 20',
    status: 'open',
    tags: ['Figma', 'B2B', 'Fintech'],
  },
  {
    id: 'm2',
    title: 'Backend engineer for auth system',
    description: 'Need a senior engineer to build a JWT-based auth system with refresh tokens, MFA support, and rate limiting. Stack: Node.js + Supabase. Must have experience with security best practices. This is a 2-week contract with potential for ongoing work.',
    creatorId: '5',
    type: 'engineering',
    reward: 'Rev Share',
    applicants: 3,
    deadline: 'Mar 25',
    status: 'open',
    tags: ['Node.js', 'Auth', 'Backend'],
  },
  {
    id: 'm3',
    title: 'Growth strategy for EU expansion',
    description: 'We are expanding to Germany and France and need a growth strategist who has done this before. Looking for someone with actual experience in EU market entry, GDPR compliance awareness, and localization strategy. 4-week engagement.',
    creatorId: '8',
    type: 'strategy',
    reward: 'Equity',
    applicants: 12,
    deadline: 'Apr 1',
    status: 'inprogress',
    tags: ['EU', 'Growth', 'Strategy'],
  },
  {
    id: 'm4',
    title: 'Content writer for tech blog',
    description: 'Looking for a tech writer to produce 4 long-form articles per month on Web3, AI, and startup topics. Must have a distinct voice and be able to interview founders. Paid per article, with performance bonuses for top-performing pieces.',
    creatorId: '4',
    type: 'writing',
    reward: '$500',
    applicants: 19,
    deadline: 'Mar 18',
    status: 'open',
    tags: ['Web3', 'AI', 'Long-form'],
  },
  {
    id: 'm5',
    title: 'Social media campaign for Togather',
    description: 'We need a growth surfer to run our social media for 6 weeks: LinkedIn + Twitter + Instagram. Should be comfortable writing in English and Hebrew, understand community-first brands, and have experience with crypto/Web3 audiences.',
    creatorId: '6',
    type: 'marketing',
    reward: 'Rev Share',
    applicants: 5,
    deadline: 'Mar 30',
    status: 'open',
    tags: ['Social', 'Web3', 'Community'],
  },
  {
    id: 'm6',
    title: 'CleanTech pitch deck design',
    description: 'Veteran investor looking for a designer to refresh a pitch deck for a CleanTech portfolio company raising Series A. Must understand investor communication, data visualization, and have a sharp eye for storytelling. Quick turnaround: 1 week.',
    creatorId: '7',
    type: 'design',
    reward: '$500',
    applicants: 8,
    deadline: 'Mar 22',
    status: 'completed',
    tags: ['Pitch Deck', 'CleanTech', 'Series A'],
  },
];

const STATUS = {
  open: { label: 'Open', color: '#8B9E6E', bg: '#8B9E6E18' },
  inprogress: { label: 'In Progress', color: '#C9A84C', bg: '#C9A84C18' },
  completed: { label: 'Completed', color: '#555', bg: '#55555518' },
};

const FILTERS = ['All', 'Design', 'Engineering', 'Marketing', 'Writing', 'Strategy'];

export default function Missions() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [showApply, setShowApply] = useState(false);
  const [whyText, setWhyText] = useState('');
  const [applied, setApplied] = useState(() => {
    try { return JSON.parse(localStorage.getItem('any1_applied_missions') || '[]'); } catch { return []; }
  });
  const [missionApplicants, setMissionApplicants] = useState(() =>
    Object.fromEntries(mockMissions.map(m => [m.id, m.applicants]))
  );

  const filtered = mockMissions.filter(m =>
    filter === 'All' || m.type === filter.toLowerCase()
  );

  const submitApply = (missionId) => {
    if (!whyText.trim()) return;
    const newApplied = [...applied, missionId];
    setApplied(newApplied);
    localStorage.setItem('any1_applied_missions', JSON.stringify(newApplied));
    setMissionApplicants(prev => ({ ...prev, [missionId]: (prev[missionId] || 0) + 1 }));
    setShowApply(false);
    setWhyText('');
  };

  const creator = selected ? mockUsers.find(u => u.id === selected.creatorId) : null;
  const typeStyle = selected ? MISSION_TYPES[selected.type] : null;

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', paddingBottom: 40 }}>
      {/* Header */}
      <div style={{
        padding: '54px 20px 16px',
        borderBottom: '1px solid #1F1F1F',
        background: '#0A0A0A',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: '#111', border: '1px solid #1F1F1F',
              borderRadius: 10, padding: 8, cursor: 'pointer',
            }}
          >
            <ArrowLeft size={18} color="#FFF" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#FFF' }}>Missions</div>
          </div>
          <div style={{
            background: '#8B9E6E22', border: '1px solid #8B9E6E44',
            borderRadius: 12, padding: '4px 10px',
            fontSize: 12, color: '#8B9E6E', fontWeight: 700,
          }}>
            {mockMissions.filter(m => m.status === 'open').length} open
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? '#8B9E6E' : '#111',
                color: filter === f ? '#0A0A0A' : '#555',
                border: `1px solid ${filter === f ? '#8B9E6E' : '#1F1F1F'}`,
                borderRadius: 16, padding: '6px 14px',
                fontSize: 11, fontWeight: 700,
                cursor: 'pointer', whiteSpace: 'nowrap',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Mission list */}
      <div style={{ padding: '16px 16px 0' }}>
        {filtered.map(mission => {
          const creator = mockUsers.find(u => u.id === mission.creatorId);
          const typeStyle = MISSION_TYPES[mission.type];
          const status = STATUS[mission.status];
          const isApplied = applied.includes(mission.id);

          return (
            <div
              key={mission.id}
              onClick={() => setSelected(mission)}
              style={{
                background: '#111', border: '1px solid #1F1F1F',
                borderRadius: 20, padding: 16,
                marginBottom: 12, cursor: 'pointer',
                position: 'relative', overflow: 'hidden',
                animation: 'slideUp 0.3s ease both',
              }}
            >
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, ${typeStyle.color}88, transparent)`,
              }} />

              {/* Creator row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                {creator && (
                  <img src={creator.avatar} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} />
                )}
                <span style={{ fontSize: 12, color: '#555' }}>{creator?.name}</span>
                <span style={{
                  fontSize: 10, color: typeStyle.color,
                  background: typeStyle.bg, borderRadius: 6,
                  padding: '2px 7px', fontWeight: 600, marginLeft: 'auto',
                }}>
                  {mission.type}
                </span>
              </div>

              <div style={{ fontSize: 16, fontWeight: 800, color: '#FFF', marginBottom: 6, lineHeight: 1.3 }}>
                {mission.title}
              </div>

              <div style={{ fontSize: 13, color: '#666', marginBottom: 12, lineHeight: 1.4 }}>
                {mission.description.substring(0, 100)}...
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {mission.tags.map(tag => (
                  <span key={tag} style={{
                    fontSize: 10, color: '#555', background: '#1A1A1A',
                    borderRadius: 6, padding: '2px 8px', border: '1px solid #252525',
                  }}>{tag}</span>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: 14 }}>
                  <span style={{ fontSize: 12, color: '#555', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Users size={11} /> {missionApplicants[mission.id]} applicants
                  </span>
                  <span style={{ fontSize: 12, color: '#555', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> {mission.deadline}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#8B9E6E' }}>{mission.reward}</span>
                  {isApplied ? (
                    <span style={{
                      fontSize: 11, color: '#8B9E6E',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <CheckCircle size={12} /> Applied
                    </span>
                  ) : mission.status !== 'completed' && (
                    <button
                      onClick={e => { e.stopPropagation(); setSelected(mission); setShowApply(true); }}
                      style={{
                        background: '#8B9E6E', color: '#0A0A0A',
                        border: 'none', borderRadius: 10,
                        padding: '6px 12px', fontSize: 12, fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Apply
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mission detail modal */}
      {selected && !showApply && (
        <div style={{
          position: 'fixed', inset: 0, background: '#000000cc',
          backdropFilter: 'blur(8px)', zIndex: 200,
          display: 'flex', alignItems: 'flex-end',
        }} onClick={() => setSelected(null)}>
          <div
            style={{
              width: '100%', maxWidth: 430, margin: '0 auto',
              background: '#111', borderRadius: '24px 24px 0 0',
              padding: '24px 20px 40px',
              border: '1px solid #1F1F1F',
              animation: 'slideUpFull 0.3s ease',
              maxHeight: '85vh', overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: 36, height: 4, background: '#333', borderRadius: 2, margin: '0 auto 20px' }} />

            {/* Type badge */}
            <div style={{
              display: 'inline-block',
              background: MISSION_TYPES[selected.type].bg,
              color: MISSION_TYPES[selected.type].color,
              fontSize: 11, fontWeight: 700,
              borderRadius: 8, padding: '3px 10px',
              marginBottom: 12,
            }}>
              {selected.type.toUpperCase()}
            </div>

            <div style={{ fontSize: 20, fontWeight: 800, color: '#FFF', marginBottom: 16, lineHeight: 1.3 }}>
              {selected.title}
            </div>

            {/* Creator */}
            {creator && (
              <div
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  marginBottom: 20, cursor: 'pointer',
                  padding: '12px', background: '#1A1A1A', borderRadius: 14,
                }}
                onClick={() => { navigate(`/user/${creator.id}`); setSelected(null); }}
              >
                <img src={creator.avatar} alt="" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#FFF' }}>{creator.name}</div>
                  <div style={{ fontSize: 12, color: '#555' }}>View profile</div>
                </div>
                <ArrowLeft size={14} color="#555" style={{ marginLeft: 'auto', transform: 'rotate(180deg)' }} />
              </div>
            )}

            <div style={{ fontSize: 14, color: '#888', lineHeight: 1.6, marginBottom: 20 }}>
              {selected.description}
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Reward', value: selected.reward, color: '#8B9E6E' },
                { label: 'Applicants', value: missionApplicants[selected.id], color: '#FFF' },
                { label: 'Deadline', value: selected.deadline, color: '#FFF' },
              ].map(s => (
                <div key={s.label} style={{
                  flex: 1, background: '#1A1A1A', borderRadius: 12,
                  padding: '12px 10px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: '#555', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
              {selected.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: 11, color: '#666', background: '#1A1A1A',
                  borderRadius: 8, padding: '4px 10px',
                }}>{tag}</span>
              ))}
            </div>

            {applied.includes(selected.id) ? (
              <div style={{
                background: '#8B9E6E22', border: '1px solid #8B9E6E44',
                borderRadius: 14, padding: 16,
                display: 'flex', alignItems: 'center', gap: 8,
                justifyContent: 'center',
              }}>
                <CheckCircle size={16} color="#8B9E6E" />
                <span style={{ color: '#8B9E6E', fontWeight: 600 }}>Applied successfully</span>
              </div>
            ) : selected.status === 'completed' ? (
              <div style={{
                background: '#1A1A1A', borderRadius: 14, padding: 16,
                textAlign: 'center', color: '#555', fontSize: 14,
              }}>
                This mission is completed
              </div>
            ) : (
              <button
                onClick={() => setShowApply(true)}
                style={{
                  width: '100%', background: '#8B9E6E', color: '#0A0A0A',
                  border: 'none', borderRadius: 14,
                  padding: 16, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                }}
              >
                Apply for this Mission
              </button>
            )}
          </div>
        </div>
      )}

      {/* Apply modal */}
      {showApply && selected && (
        <div style={{
          position: 'fixed', inset: 0, background: '#000000cc',
          backdropFilter: 'blur(8px)', zIndex: 300,
          display: 'flex', alignItems: 'flex-end',
        }}>
          <div style={{
            width: '100%', maxWidth: 430, margin: '0 auto',
            background: '#111', borderRadius: '24px 24px 0 0',
            padding: '24px 20px 40px',
            border: '1px solid #1F1F1F',
            animation: 'slideUpFull 0.3s ease',
          }}>
            <div style={{ width: 36, height: 4, background: '#333', borderRadius: 2, margin: '0 auto 20px' }} />
            <div style={{ fontSize: 18, fontWeight: 700, color: '#FFF', marginBottom: 6 }}>
              Apply to mission
            </div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 20 }}>
              {selected.title}
            </div>

            <div style={{ fontSize: 12, color: '#555', marginBottom: 8 }}>Why are you a great fit?</div>
            <textarea
              value={whyText}
              onChange={e => setWhyText(e.target.value)}
              placeholder="Tell them what makes you the right person for this mission..."
              rows={5}
              style={{
                width: '100%', background: '#1A1A1A',
                border: '1px solid #252525', borderRadius: 14,
                padding: '14px 16px', color: '#FFF', fontSize: 14,
                outline: 'none', resize: 'none', fontFamily: 'inherit',
                marginBottom: 14,
              }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => { setShowApply(false); setWhyText(''); }}
                style={{
                  flex: 1, background: '#1A1A1A', color: '#555',
                  border: '1px solid #252525', borderRadius: 14,
                  padding: 14, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => submitApply(selected.id)}
                disabled={!whyText.trim()}
                style={{
                  flex: 2,
                  background: whyText.trim() ? '#8B9E6E' : '#1A1A1A',
                  color: whyText.trim() ? '#0A0A0A' : '#444',
                  border: 'none', borderRadius: 14,
                  padding: 14, fontSize: 15, fontWeight: 700,
                  cursor: whyText.trim() ? 'pointer' : 'default',
                }}
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
