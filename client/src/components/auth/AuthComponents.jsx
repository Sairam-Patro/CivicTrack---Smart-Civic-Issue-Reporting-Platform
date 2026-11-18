import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// ── Generic text/email/tel input ────────────────────────────────────────────
export function AuthInput({ label, id, icon: Icon, error, ...inputProps }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: '0.82rem', fontWeight: 600, color: '#102544' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#8fa0b4', pointerEvents: 'none' }}>
            <Icon size={15} />
          </div>
        )}
        <input
          id={id}
          style={{
            width: '100%',
            border: `1.5px solid ${error ? '#ef4444' : '#dce3ec'}`,
            borderRadius: '10px',
            padding: `0.72rem ${Icon ? '2.5rem' : '0.9rem'} 0.72rem ${Icon ? '2.5rem' : '0.9rem'}`,
            fontSize: '0.875rem',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            color: '#102544',
            background: '#fff',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => {
            e.target.style.borderColor = '#07845F';
            e.target.style.boxShadow = '0 0 0 3px rgba(7,132,95,0.12)';
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? '#ef4444' : '#dce3ec';
            e.target.style.boxShadow = 'none';
          }}
          {...inputProps}
        />
      </div>
      {error && <span style={{ fontSize: '0.73rem', color: '#ef4444', marginTop: '0.1rem' }}>{error}</span>}
    </div>
  );
}

// ── Password input with show/hide ───────────────────────────────────────────
export function PasswordInput({ label, id, icon: Icon, error, value, onChange, placeholder, ...rest }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {label && (
        <label htmlFor={id} style={{ fontSize: '0.82rem', fontWeight: 600, color: '#102544' }}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#8fa0b4', pointerEvents: 'none' }}>
            <Icon size={15} />
          </div>
        )}
        <input
          id={id}
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            border: `1.5px solid ${error ? '#ef4444' : '#dce3ec'}`,
            borderRadius: '10px',
            padding: `0.72rem 2.5rem 0.72rem ${Icon ? '2.5rem' : '0.9rem'}`,
            fontSize: '0.875rem',
            fontFamily: 'Inter, sans-serif',
            outline: 'none',
            color: '#102544',
            background: '#fff',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => {
            e.target.style.borderColor = '#07845F';
            e.target.style.boxShadow = '0 0 0 3px rgba(7,132,95,0.12)';
          }}
          onBlur={e => {
            e.target.style.borderColor = error ? '#ef4444' : '#dce3ec';
            e.target.style.boxShadow = 'none';
          }}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow(v => !v)}
          style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#8fa0b4', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
          tabIndex={-1}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
      {error && <span style={{ fontSize: '0.73rem', color: '#ef4444', marginTop: '0.1rem' }}>{error}</span>}
    </div>
  );
}

// ── Password strength indicator ─────────────────────────────────────────────
export function PasswordStrength({ password }) {
  function getStrength(pw) {
    if (!pw) return { score: 0, label: '', color: '#dce3ec' };
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[a-z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    const map = [
      { label: '', color: '#dce3ec' },
      { label: 'Weak', color: '#ef4444' },
      { label: 'Fair', color: '#f59e0b' },
      { label: 'Medium', color: '#f59e0b' },
      { label: 'Strong', color: '#22c55e' },
      { label: 'Very Strong', color: '#07845F' },
    ];
    return { score: s, ...map[s] };
  }

  const { score, label, color } = getStrength(password);
  const checks = [
    { text: 'At least 8 characters', ok: password.length >= 8 },
    { text: 'One uppercase letter', ok: /[A-Z]/.test(password) },
    { text: 'One lowercase letter', ok: /[a-z]/.test(password) },
    { text: 'One number', ok: /[0-9]/.test(password) },
    { text: 'One special character', ok: /[^A-Za-z0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div style={{ marginTop: '0.5rem' }}>
      {/* Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div style={{ flex: 1, height: 5, background: '#e9edf2', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(score / 5) * 100}%`, background: color, borderRadius: 3, transition: 'width 0.3s, background 0.3s' }} />
        </div>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color, minWidth: 60, textAlign: 'right' }}>{label}</span>
      </div>
      {/* Requirements */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem 0.5rem' }}>
        {checks.map(c => (
          <div key={c.text} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.65rem', color: c.ok ? '#07845F' : '#94a3b8' }}>
              {c.ok ? '●' : '○'}
            </span>
            <span style={{ fontSize: '0.68rem', color: c.ok ? '#07845F' : '#94a3b8', fontWeight: c.ok ? 600 : 400 }}>{c.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Primary auth button ─────────────────────────────────────────────────────
export function AuthButton({ children, loading, ...props }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      disabled={loading}
      style={{
        width: '100%',
        padding: '0.88rem',
        background: loading ? '#5a9e87' : hovered ? '#0da077' : '#07845F',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontWeight: 700,
        fontSize: '0.95rem',
        fontFamily: 'Inter, sans-serif',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.55rem',
        boxShadow: loading ? 'none' : hovered ? '0 6px 20px rgba(7,132,95,0.40)' : '0 3px 10px rgba(7,132,95,0.25)',
        transform: hovered && !loading ? 'translateY(-1px)' : 'none',
        letterSpacing: '0.01em',
      }}
      {...props}
    >
      {loading ? (
        <>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Processing...
        </>
      ) : (
        <>
          {children}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
