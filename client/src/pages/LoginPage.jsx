import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Building2, Phone } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import { AuthInput, PasswordInput, AuthButton } from '../components/auth/AuthComponents';
import { useAuth } from '../context/AuthContext';

function isMobile(val) { return /^[6-9]\d{9}$/.test(val.replace(/\s+/g, '')); }
function isEmail(val)  { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val); }

export default function LoginPage() {
  const [form, setForm]       = useState({ credential: '', password: '', rememberMe: false });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);
  const [globalMsg, setGlobalMsg] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
    setGlobalMsg(null);
  }

  function validate() {
    const e = {};
    if (!form.credential.trim())
      e.credential = 'Email or mobile number is required';
    else if (!isEmail(form.credential) && !isMobile(form.credential))
      e.credential = 'Enter a valid email or 10-digit mobile number';
    if (!form.password)          e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({}); setLoading(true); setGlobalMsg(null);
    try {
      const payload = isMobile(form.credential)
        ? { phone: form.credential.replace(/\s+/g, ''), password: form.password }
        : { email: form.credential, password: form.password };
      const res  = await fetch('/api/auth/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed.');
      // Use context login so navbar updates instantly
      login(data.user || {}, data.token);
      navigate('/');
    } catch (err) {
      setGlobalMsg({ type: 'error', text: err.message });
    } finally { setLoading(false); }
  }

  const credIcon = isMobile(form.credential) ? Phone : Mail;

  return (
    <AuthLayout variant="login">

      {/* ── Inner wrapper: fills right panel exactly, never exceeds 100vh ── */}
      <div style={{
        display: 'flex', flexDirection: 'column',
        height: '100%',          /* matches the 100vh scrollable parent */
        minHeight: 0,
      }}>

        {/* Top bar */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '0.85rem 2rem',
          borderBottom: '1px solid #f0f2f5',
          flexShrink: 0,
        }}>
          {/* Logo — always visible, links to Home */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: '#07845F', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(7,132,95,0.3)' }}>
              <Building2 size={17} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#102544', lineHeight: 1.1 }}>CivicTrack</div>
              <div style={{ fontSize: '0.58rem', color: '#5a6a7e', fontWeight: 500 }}>Report Today. Better Tomorrow.</div>
            </div>
          </Link>

          {/* Right side: switch to register or admin */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/admin/login"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                padding: '0.4rem 0.85rem', borderRadius: '8px',
                background: '#f0fdf4', border: '1.5px solid #07845F',
                color: '#07845F', fontSize: '0.78rem', fontWeight: 700,
                textDecoration: 'none', transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#07845F'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.color = '#07845F'; }}
            >
              <span>Login as Admin 🛡️</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#5a6a7e' }}>New here?</span>
              <Link to="/register" style={{ fontSize: '0.8rem', color: '#07845F', fontWeight: 700, textDecoration: 'none' }}>
                Register →
              </Link>
            </div>
          </div>
        </div>

        {/* ── Scrollable form area ── */}
        <div style={{
          flex: 1, overflowY: 'auto',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.5rem 2.5rem',
        }}>
          <div style={{ width: '100%', maxWidth: 440 }}>

            {/* Avatar icon */}
            <div style={{
              width: 46, height: 46, borderRadius: '50%',
              background: 'linear-gradient(135deg, #07845F, #0da077)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '1rem', boxShadow: '0 3px 12px rgba(7,132,95,0.3)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" fill="#fff" opacity="0.9"/>
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.9"/>
              </svg>
            </div>

            {/* Heading */}
            <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.5rem, 3vw, 1.9rem)', color: '#102544', marginBottom: '0.3rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Welcome Back!
            </h1>
            <p style={{ color: '#5a6a7e', fontSize: '0.85rem', lineHeight: 1.55, marginBottom: '1.5rem' }}>
              Your community is counting on you. Log in and continue making a difference.
            </p>

            {/* Role Switcher Tabs */}
            <div style={{
              display: 'flex',
              background: '#f1f5f9',
              borderRadius: '12px',
              padding: '4px',
              marginBottom: '1.25rem',
              border: '1px solid #e2e8f0',
            }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '0.55rem 0.8rem',
                  borderRadius: '9px',
                  border: 'none',
                  background: '#fff',
                  color: '#102544',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                  cursor: 'default',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                }}
              >
                <span>👤 Citizen Login</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                style={{
                  flex: 1,
                  padding: '0.55rem 0.8rem',
                  borderRadius: '9px',
                  border: 'none',
                  background: 'transparent',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#07845F'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
              >
                <span>🛡️ Login as Admin</span>
              </button>
            </div>

            {/* Global alert */}
            {globalMsg && (
              <div style={{
                padding: '0.7rem 0.9rem', borderRadius: '9px', marginBottom: '1rem',
                fontSize: '0.82rem', fontWeight: 500,
                background: globalMsg.type === 'error' ? '#fef2f2' : '#f0fdf4',
                border: `1.5px solid ${globalMsg.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
                color: globalMsg.type === 'error' ? '#dc2626' : '#15803d',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                {globalMsg.type === 'error' ? '⚠' : '✓'} {globalMsg.text}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>

              <AuthInput
                id="login-credential"
                label="Email Address or Mobile Number"
                icon={credIcon}
                type="text"
                value={form.credential}
                onChange={e => set('credential', e.target.value)}
                placeholder="Enter your email or mobile number"
                error={errors.credential}
                autoComplete="username"
              />

              <PasswordInput
                id="login-password"
                label="Password"
                icon={Lock}
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="Enter your password"
                error={errors.password}
                autoComplete="current-password"
              />

              {/* Remember + Forgot */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    id="login-remember"
                    checked={form.rememberMe}
                    onChange={e => set('rememberMe', e.target.checked)}
                    style={{ width: 14, height: 14, accentColor: '#07845F', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.8rem', color: '#5a6a7e', fontWeight: 500 }}>Remember Me</span>
                </label>
                <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#07845F', fontWeight: 600, textDecoration: 'none' }}>
                  Forgot Password?
                </Link>
              </div>

              {/* Login button */}
              <AuthButton loading={loading}>Login to CivicTrack</AuthButton>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
                <div style={{ flex: 1, height: 1, background: '#e9edf2' }} />
                <span style={{ fontSize: '0.72rem', color: '#8fa0b4', fontWeight: 600, whiteSpace: 'nowrap' }}>OR CONTINUE WITH</span>
                <div style={{ flex: 1, height: 1, background: '#e9edf2' }} />
              </div>

              {/* Google */}
              <button
                type="button"
                style={{
                  width: '100%', padding: '0.75rem', background: '#fff',
                  border: '1.5px solid #dce3ec', borderRadius: '11px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.55rem',
                  fontSize: '0.85rem', fontWeight: 600, color: '#102544',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#c2cdd8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff';    e.currentTarget.style.borderColor = '#dce3ec'; }}
                onClick={() => alert('Google Sign-In coming soon!')}
              >
                <svg width="17" height="17" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              {/* Dedicated Official Admin Login Card */}
              <div style={{
                marginTop: '0.4rem',
                padding: '0.9rem',
                background: '#f8fafc',
                border: '1.5px dashed #cbd5e1',
                borderRadius: '12px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.4rem',
              }}>
                <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 500 }}>
                  Government Official or Municipal Administrator?
                </span>
                <Link
                  to="/admin/login"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.5rem 1.1rem',
                    background: '#102544',
                    color: '#fff',
                    borderRadius: '9px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    boxShadow: '0 2px 8px rgba(16,37,68,0.2)',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#07845F'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#102544'; }}
                >
                  <Building2 size={15} color="#fff" />
                  <span>Login as Admin (Official Portal) →</span>
                </Link>
              </div>
            </form>

            {/* Terms note */}
            <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#8fa0b4', marginTop: '1.1rem', lineHeight: 1.6 }}>
              By continuing, you agree to our{' '}
              <Link to="/terms"   style={{ color: '#07845F', fontWeight: 600, textDecoration: 'none' }}>Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" style={{ color: '#07845F', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>.
            </p>

            {/* Mobile: switch to register */}
            <p className="auth-mobile-link" style={{ textAlign: 'center', fontSize: '0.84rem', color: '#5a6a7e', marginTop: '1rem', display: 'none' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#07845F', fontWeight: 700, textDecoration: 'none' }}>Create Account</Link>
            </p>

          </div>
        </div>{/* /scrollable */}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .auth-mobile-logo { display: flex !important; }
          .auth-mobile-link { display: block !important; }
        }
        @media (max-width: 600px) {
          .login-form-pad { padding: 1rem 1.2rem !important; }
        }
      `}</style>
    </AuthLayout>
  );
}
