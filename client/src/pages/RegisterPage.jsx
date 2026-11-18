import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, Building2 } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import { AuthInput, PasswordInput, PasswordStrength, AuthButton } from '../components/auth/AuthComponents';
import LocationCascade from '../components/auth/LocationCascade';

// ── Main component ──────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    state: '', district: '', city: '', ward: '',
    password: '', confirm: '', agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalMsg, setGlobalMsg] = useState(null);
  const navigate = useNavigate();

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }));
    if (errors[key]) setErrors(e => ({ ...e, [key]: '' }));
    setGlobalMsg(null);
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';

    if (!form.email) e.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address';

    if (!form.phone) e.phone = 'Mobile number is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s+/g, ''))) e.phone = 'Enter a valid 10-digit Indian mobile number';

    if (!form.state) e.state = 'Please select your state';
    if (!form.district) e.district = 'Please select your district';
    const cityVal = form.city?.startsWith('Other:') ? form.city.slice(6) : form.city;
    if (!cityVal?.trim()) e.city = 'City or town is required';

    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';

    if (!form.confirm) e.confirm = 'Please confirm your password';
    else if (form.password !== form.confirm) e.confirm = 'Passwords do not match';

    if (!form.agreeTerms) e.agreeTerms = 'You must accept the Terms and Privacy Policy';

    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    setGlobalMsg(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     form.name.trim(),
          email:    form.email.toLowerCase().trim(),
          phone:    form.phone.replace(/\s+/g, ''),
          state:    form.state,
          district: form.district?.startsWith('Other:') ? form.district.slice(6) : form.district,
          city:     form.city?.startsWith('Other:') ? form.city.slice(6) : form.city,
          ward:     form.ward.trim(),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed. Please try again.');
      localStorage.setItem('ct_token', data.token);
      if (data.user) localStorage.setItem('ct_user', JSON.stringify(data.user));
      setGlobalMsg({ type: 'success', text: 'Account created successfully! Redirecting...' });
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setGlobalMsg({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout variant="register">
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 2rem', borderBottom: '1px solid #f0f2f5', flexShrink: 0 }}>
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

          {/* Right side: switch to login */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#5a6a7e' }}>Already have an account?</span>
            <Link to="/login" style={{ fontSize: '0.8rem', color: '#07845F', fontWeight: 700, textDecoration: 'none' }}>Login →</Link>
          </div>
        </div>

      {/* Mobile branding */}
      <div className="auth-mobile-brand" style={{ padding: '0.8rem 1.8rem 0', display: 'none' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ width: 32, height: 32, background: '#07845F', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={16} color="#fff" />
          </div>
          <div style={{ fontWeight: 800, fontSize: '1rem', color: '#102544' }}>CivicTrack</div>
        </Link>
      </div>

        {/* Scrollable form area */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '1.2rem 2.5rem 2rem' }}>
          <div style={{ width: '100%', maxWidth: 470 }}>
            {/* Avatar icon */}
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'linear-gradient(135deg, #07845F, #0da077)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem',
              boxShadow: '0 3px 12px rgba(7,132,95,0.3)',
            }}>
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none">
                <path d="M16 11c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM8 11c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="#fff" opacity="0.9"/>
              </svg>
            </div>

            <h1 style={{ fontWeight: 800, fontSize: 'clamp(1.3rem,2.5vw,1.7rem)', color: '#102544', marginBottom: '0.25rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Join Your Community
            </h1>
            <p style={{ color: '#5a6a7e', fontSize: '0.82rem', lineHeight: 1.55, marginBottom: '1.1rem' }}>
              Create your account and become a part of positive change.
            </p>

            {/* Global alert */}
            {globalMsg && (
              <div style={{
                padding: '0.65rem 0.9rem', borderRadius: '9px', marginBottom: '0.85rem', fontSize: '0.81rem', fontWeight: 500,
                background: globalMsg.type === 'error' ? '#fef2f2' : '#f0fdf4',
                border: `1.5px solid ${globalMsg.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
                color: globalMsg.type === 'error' ? '#dc2626' : '#15803d',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}>
                {globalMsg.type === 'error' ? '⚠' : '✓'} {globalMsg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Full name */}
              <AuthInput
                id="reg-name"
                label="Full Name"
                icon={User}
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="Enter your full name"
                error={errors.name}
                autoComplete="name"
              />

              {/* Email + Mobile row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                <AuthInput
                  id="reg-email"
                  label="Email Address"
                  icon={Mail}
                  type="email"
                  value={form.email}
                  onChange={e => set('email', e.target.value)}
                  placeholder="Enter your email"
                  error={errors.email}
                  autoComplete="email"
                />
                <AuthInput
                  id="reg-phone"
                  label="Mobile Number"
                  icon={Phone}
                  type="tel"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value.replace(/[^0-9 ]/g, ''))}
                  placeholder="10-digit mobile number"
                  error={errors.phone}
                  autoComplete="tel"
                  maxLength={10}
                />
              </div>

              {/* Cascading location: State → District → City → Ward */}
              <LocationCascade
                state={form.state}
                district={form.district}
                city={form.city}
                ward={form.ward}
                onStateChange={v    => { set('state', v); set('district',''); set('city',''); }}
                onDistrictChange={v => { set('district', v); set('city',''); }}
                onCityChange={v     => set('city', v)}
                onWardChange={v     => set('ward', v)}
                errors={{ state: errors.state, district: errors.district, city: errors.city }}
              />


              {/* Password + Confirm row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                <div>
                  <PasswordInput
                    id="reg-password"
                    label="Password"
                    icon={Lock}
                    value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="Create a strong password"
                    error={errors.password}
                    autoComplete="new-password"
                  />
                  {form.password && (
                    <div style={{ marginTop: '0.4rem' }}>
                      <PasswordStrength password={form.password} />
                    </div>
                  )}
                </div>
                <PasswordInput
                  id="reg-confirm"
                  label="Confirm Password"
                  icon={Lock}
                  value={form.confirm}
                  onChange={e => set('confirm', e.target.value)}
                  placeholder="Confirm your password"
                  error={errors.confirm}
                  autoComplete="new-password"
                />
              </div>

              {/* Terms checkbox */}
              <div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.55rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    id="reg-terms"
                    checked={form.agreeTerms}
                    onChange={e => set('agreeTerms', e.target.checked)}
                    style={{ width: 14, height: 14, accentColor: '#07845F', cursor: 'pointer', marginTop: '2px', flexShrink: 0 }}
                  />
                  <span style={{ fontSize: '0.77rem', color: '#5a6a7e', lineHeight: 1.55 }}>
                    I agree to the{' '}
                    <Link to="/terms" style={{ color: '#07845F', fontWeight: 600, textDecoration: 'none' }}>Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" style={{ color: '#07845F', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</Link>
                  </span>
                </label>
                {errors.agreeTerms && <span style={{ fontSize: '0.71rem', color: '#ef4444', marginTop: '0.15rem', display: 'block', paddingLeft: '1.5rem' }}>{errors.agreeTerms}</span>}
              </div>

              {/* Submit */}
              <AuthButton loading={loading}>
                Create My Account
              </AuthButton>
            </form>

            <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#5a6a7e', marginTop: '1rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#07845F', fontWeight: 700, textDecoration: 'none' }}>Login</Link>
            </p>
          </div>
        </div>{/* /scrollable */}
      </div>{/* /inner wrapper */}

      <style>{`
        @media (max-width: 900px) {
          .auth-mobile-logo { display: flex !important; }
        }
        @media (max-width: 600px) {
          .reg-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </AuthLayout>
  );
}
