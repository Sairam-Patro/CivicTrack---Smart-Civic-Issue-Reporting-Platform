import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Building2 } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import { AuthInput, AuthButton } from '../components/auth/AuthComponents';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!email) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address'); return; }
    setError('');
    setLoading(true);
    // Simulate API call (endpoint not yet implemented)
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  }

  return (
    <AuthLayout variant="login">
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1.1rem 2.5rem' }}>
        <Link to="/login" style={{ fontSize: '0.82rem', color: '#07845F', fontWeight: 700, textDecoration: 'none' }}>
          ← Back to Login
        </Link>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 3rem' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Icon */}
          <div style={{
            width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #07845F, #0da077)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem',
            boxShadow: '0 4px 14px rgba(7,132,95,0.3)',
          }}>
            <Mail size={22} color="#fff" />
          </div>

          {!sent ? (
            <>
              <h1 style={{ fontWeight: 800, fontSize: '1.75rem', color: '#102544', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                Forgot Password?
              </h1>
              <p style={{ color: '#5a6a7e', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                No worries! Enter your registered email and we'll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <AuthInput
                  id="forgot-email"
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="Enter your registered email"
                  error={error}
                  autoComplete="email"
                />
                <AuthButton loading={loading}>Send Reset Link</AuthButton>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ width: 60, height: 60, background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', border: '2px solid #bbf7d0' }}>
                <span style={{ fontSize: '1.8rem' }}>✉️</span>
              </div>
              <h2 style={{ fontWeight: 800, fontSize: '1.4rem', color: '#102544', marginBottom: '0.6rem' }}>Check Your Inbox</h2>
              <p style={{ color: '#5a6a7e', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
              </p>
              <Link to="/login" style={{ color: '#07845F', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>
                ← Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
