import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { mockUsers } from '../data/mockData';

const MOCK_CONVOS = {
  '1': [
    { id: 1, from: 'them', text: 'Hey, saw you checked out my profile. What do you think of PayFlow?', time: '2h ago' },
    { id: 2, from: 'me', text: 'Really impressed by the traction. 1k merchants in 8 months is no joke.', time: '2h ago' },
    { id: 3, from: 'them', text: "Thanks! We're just getting started. Love to connect more.", time: '1h ago' },
  ],
  '2': [
    { id: 1, from: 'them', text: 'Hi! I noticed you invested in one of my portfolio companies.', time: '1d ago' },
    { id: 2, from: 'me', text: "Yes! I'm a big believer in design-led products.", time: '1d ago' },
  ],
  '3': [
    { id: 1, from: 'them', text: 'Appreciate you following my journey. Any questions about the fund?', time: '3d ago' },
  ],
  '5': [
    { id: 1, from: 'them', text: 'Great to connect. Always looking for OSS contributors.', time: '5h ago' },
    { id: 2, from: 'me', text: 'Love your work on the auth module. Very clean code.', time: '4h ago' },
    { id: 3, from: 'them', text: "Thanks! Let's collaborate on something.", time: '3h ago' },
    { id: 4, from: 'me', text: 'Absolutely. Reach out anytime.', time: '2h ago' },
  ],
};

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = mockUsers.find(u => u.id === id);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const storageKey = `any1_chat_${id}`;
  const [messages, setMessages] = useState(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) return JSON.parse(stored);
    } catch {}
    return MOCK_CONVOS[id] || [
      { id: 1, from: 'them', text: "Hey! Great to connect on Any1.", time: '1h ago' },
    ];
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newMsg = {
      id: Date.now(),
      from: 'me',
      text: input.trim(),
      time: timeStr,
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setInput('');
  };

  if (!user) return null;

  return (
    <div style={{
      minHeight: '100vh', background: '#221E1A',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '54px 16px 14px',
        background: '#221E1A',
        borderBottom: '1px solid #1F1F1F',
        display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: '#2A2520', border: '1px solid #1F1F1F',
            borderRadius: 10, padding: 8, cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={18} color="#F2EDE6" />
        </button>
        <img src={user.avatar} alt="" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#F2EDE6' }}>{user.name}</div>
          <div style={{ fontSize: 12, color: '#8B9E6E', display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#8B9E6E' }} />
            Active now
          </div>
        </div>
        <button
          onClick={() => navigate(`/user/${id}`)}
          style={{
            background: '#2A2520', border: '1px solid #1F1F1F',
            borderRadius: 10, padding: '6px 12px', cursor: 'pointer',
            fontSize: 12, color: '#7A6E62',
          }}
        >
          Profile
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              display: 'flex',
              justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start',
              animation: 'slideUp 0.2s ease',
            }}
          >
            {msg.from === 'them' && (
              <img src={user.avatar} alt="" style={{
                width: 28, height: 28, borderRadius: '50%',
                marginRight: 8, flexShrink: 0, alignSelf: 'flex-end',
              }} />
            )}
            <div style={{ maxWidth: '75%' }}>
              <div style={{
                background: msg.from === 'me' ? '#8B9E6E' : '#332D27',
                color: msg.from === 'me' ? '#221E1A' : '#F2EDE6',
                borderRadius: msg.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '10px 14px',
                fontSize: 14, lineHeight: 1.5,
                fontWeight: msg.from === 'me' ? 500 : 400,
              }}>
                {msg.text}
              </div>
              <div style={{
                fontSize: 10, color: '#7A6E62',
                textAlign: msg.from === 'me' ? 'right' : 'left',
                marginTop: 4, paddingRight: 4, paddingLeft: 4,
              }}>
                {msg.time}{msg.from === 'me' && ' ✓✓'}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <div style={{
        padding: '12px 16px 32px',
        background: '#221E1A',
        borderTop: '1px solid #1F1F1F',
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Message..."
          style={{
            flex: 1, background: '#332D27',
            border: '1px solid #252525', borderRadius: 20,
            padding: '12px 16px', color: '#F2EDE6',
            fontSize: 14, outline: 'none',
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            width: 44, height: 44, borderRadius: '50%',
            background: input.trim() ? '#8B9E6E' : '#332D27',
            border: `1px solid ${input.trim() ? '#8B9E6E' : '#3E3528'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'default',
            flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
        >
          <Send size={16} color={input.trim() ? '#221E1A' : '#7A6E62'} />
        </button>
      </div>
    </div>
  );
}


