import { useState } from 'react';
import { X, Sun, Moon, DollarSign, ChevronRight, Shield, Bell, HelpCircle, LogOut } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SettingsDrawer({ open, onClose }) {
  const { theme, mode, toggleTheme } = useTheme();
  const [depositOpen, setDepositOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDone, setDepositDone] = useState(false);
  const [balance, setBalance] = useState(() => parseFloat(localStorage.getItem('any1_balance') || '1029.58'));

  const handleDeposit = () => {
    if (!depositAmount) return;
    const newBal = balance + parseFloat(depositAmount);
    setBalance(newBal);
    localStorage.setItem('any1_balance', newBal.toString());
    setDepositDone(true);
    setTimeout(() => { setDepositOpen(false); setDepositAmount(''); setDepositDone(false); }, 1800);
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: '#000000aa', zIndex: 600 }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 280, background: theme.surface,
        zIndex: 601, display: 'flex', flexDirection: 'column',
        boxShadow: '8px 0 40px #00000066',
        animation: 'slideRight 0.25s ease',
      }}>
        <style>{`@keyframes slideRight { from { transform: translateX(-100%); } to { transform: translateX(0); } } @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }`}</style>

        {/* Header */}
        <div style={{ padding: '54px 20px 20px', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>Settings</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color={theme.muted} /></button>
        </div>

        {/* Balance strip */}
        <div style={{ margin: '16px 20px', background: `${theme.accent}18`, border: `1px solid ${theme.accent}44`, borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: theme.muted, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Available Balance</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: theme.accent }}>${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>

        {/* Menu items */}
        <div style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>

          {/* Deposit */}
          <button onClick={() => setDepositOpen(true)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 12px', background: depositOpen ? `${theme.accent}15` : 'none', border: 'none', borderRadius: 14, cursor: 'pointer', marginBottom: 4 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: `${theme.accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} color={theme.accent} />
            </div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>Increase my value</div>
              <div style={{ fontSize: 11, color: theme.muted }}>Add funds to grow your standing</div>
            </div>
            <ChevronRight size={16} color={theme.muted} />
          </button>

          {/* Theme toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 12px', marginBottom: 4 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: `${mode === 'dark' ? '#7B6FBF' : '#D4A843'}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {mode === 'dark' ? <Moon size={18} color="#7B6FBF" /> : <Sun size={18} color="#D4A843" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{mode === 'dark' ? 'Dark mode' : 'Light mode'}</div>
              <div style={{ fontSize: 11, color: theme.muted }}>Switch appearance</div>
            </div>
            {/* Toggle switch */}
            <div onClick={toggle} style={{ width: 46, height: 26, borderRadius: 13, background: mode === 'dark' ? '#7B6FBF' : '#D4A843', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: 3, left: mode === 'dark' ? 22 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.3s', boxShadow: '0 1px 4px #00000033' }} />
            </div>
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: theme.border, margin: '8px 12px 12px' }} />

          {[
            { icon: Bell,        label: 'Notifications',  sub: 'Manage alerts',    color: '#B8714F' },
            { icon: Shield,      label: 'Privacy',        sub: 'Control your data', color: '#5AABA2' },
            { icon: HelpCircle,  label: 'Help & Feedback',sub: 'Get support',       color: '#8B85C1' },
          ].map(item => {
            const Icon = item.icon;
            return (
              <button key={item.label} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '14px 12px', background: 'none', border: 'none', borderRadius: 14, cursor: 'pointer', marginBottom: 2 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={item.color} />
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: theme.text }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: theme.muted }}>{item.sub}</div>
                </div>
                <ChevronRight size={16} color={theme.muted} />
              </button>
            );
          })}
        </div>

        {/* Version */}
        <div style={{ padding: '16px 20px 34px', borderTop: `1px solid ${theme.border}`, textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: theme.muted }}>any1 · v0.1.0 · People Power People</div>
        </div>
      </div>

      {/* Deposit modal */}
      {depositOpen && (
        <div style={{ position: 'fixed', inset: 0, background: '#000000cc', backdropFilter: 'blur(8px)', zIndex: 700, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: 430, margin: '0 auto', background: theme.surface, borderRadius: '24px 24px 0 0', padding: '28px 20px 48px', border: `1px solid ${theme.accent}33`, animation: 'slideUp 0.3s ease', boxShadow: '0 -8px 40px #C9A84C22' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: theme.text }}>Increase my value</div>
              <button onClick={() => setDepositOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} color={theme.muted} /></button>
            </div>
            <div style={{ fontSize: 13, color: theme.muted, marginBottom: 24, lineHeight: 1.5 }}>
              Adding funds increases your collateral, which grows your standing on any1 and signals confidence in yourself to others.
            </div>

            {depositDone ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 36, fontWeight: 900, color: theme.accent, marginBottom: 8 }}>${(balance).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
                <div style={{ fontSize: 14, color: theme.muted }}>Value updated</div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 11, color: theme.muted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Amount</div>
                <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                  {['100', '500', '1000', '5000'].map(v => (
                    <button key={v} onClick={() => setDepositAmount(v)} style={{
                      flex: 1, background: depositAmount === v ? `${theme.accent}22` : theme.bg,
                      border: `1px solid ${depositAmount === v ? theme.accent : theme.border2}`,
                      borderRadius: 10, padding: '10px 4px',
                      color: depositAmount === v ? theme.accent : theme.muted,
                      fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    }}>${v}</button>
                  ))}
                </div>
                <input type="number" placeholder="Custom amount..." value={depositAmount} onChange={e => setDepositAmount(e.target.value)} style={{ width: '100%', background: theme.bg, border: `1px solid ${theme.border2}`, borderRadius: 12, padding: '13px 16px', color: theme.text, fontSize: 15, outline: 'none', marginBottom: 16, boxSizing: 'border-box', fontFamily: 'inherit' }} />
                <button onClick={handleDeposit} style={{ width: '100%', background: depositAmount ? theme.accent : theme.border, color: depositAmount ? '#221E1A' : theme.muted, border: 'none', borderRadius: 14, padding: 15, fontSize: 15, fontWeight: 700, cursor: depositAmount ? 'pointer' : 'default' }}>
                  {depositAmount ? `Add $${depositAmount} to my value` : 'Enter amount'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
