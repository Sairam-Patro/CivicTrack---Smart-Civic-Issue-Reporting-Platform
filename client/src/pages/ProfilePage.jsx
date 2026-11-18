import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Phone, MapPin, Shield, Edit3, Save, X,
  FileText, CheckCircle, Clock, AlertCircle, LogOut, Camera, RefreshCw,
  ThumbsUp, MessageCircle, TrendingUp,
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

/* ─── helpers ─────────────────────────────────────────── */
function getInitials(name = '') {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('');
}

const ROLE_LABELS = { citizen: 'Citizen', officer: 'Officer', admin: 'Admin' };
const ROLE_COLORS = { citizen: '#07845F', officer: '#3b82f6', admin: '#E95532' };

const STATUS_CONFIG = {
  Pending:       { color: '#E95532', bg: '#fef3f0', Icon: AlertCircle },
  'In Progress': { color: '#f59e0b', bg: '#fffbeb', Icon: Clock },
  Resolved:      { color: '#07845F', bg: '#f0fdf4', Icon: CheckCircle },
  Closed:        { color: '#5a6a7e', bg: '#f4f6f8', Icon: FileText },
  Rejected:      { color: '#dc2626', bg: '#fef2f2', Icon: AlertCircle },
};

const POLL_MS = 30_000;

/* ─── skeleton ─────────────────────────────────────────── */
function Skeleton({ h = 16, w = '100%', r = 8 }) {
  return <div style={{ height: h, width: w, background: '#f0f2f5', borderRadius: r, animation: 'pulse 1.5s ease-in-out infinite' }} />;
}

/* ─── main ─────────────────────────────────────────────── */
export default function ProfilePage() {
  const { user: ctxUser, isLoggedIn, login, logout } = useAuth();
  const navigate = useNavigate();

  const [profile,     setProfile]     = useState(null);
  const [myIssues,    setMyIssues]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [editing,     setEditing]     = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [form,        setForm]        = useState({ name: '', phone: '', ward: '' });
  const [msg,         setMsg]         = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const isMounted = useRef(true);

  /* ── redirect if not logged in ── */
  useEffect(() => { if (!isLoggedIn) navigate('/login'); }, [isLoggedIn, navigate]);

  /* ── fetch data ── */
  const fetchAll = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const [profRes, issuesRes] = await Promise.all([
        api.get('/users/profile'),
        api.get('/users/my-issues'),
      ]);
      if (!isMounted.current) return;
      setProfile(profRes.data);
      setMyIssues(Array.isArray(issuesRes.data) ? issuesRes.data : []);
      setForm({ name: profRes.data.name || '', phone: profRes.data.phone || '', ward: profRes.data.ward || '' });
      setLastUpdated(new Date());
    } catch {
      if (isMounted.current) setError('Could not load profile. Please try again.');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    if (isLoggedIn) {
      fetchAll();
      const timer = setInterval(() => fetchAll(true), POLL_MS);
      return () => { isMounted.current = false; clearInterval(timer); };
    }
  }, [isLoggedIn, fetchAll]);

  /* ── save profile ── */
  async function handleSave() {
    setSaving(true); setMsg(null);
    try {
      const res = await api.patch('/users/profile', form);
      setProfile(res.data);
      login({ ...ctxUser, name: res.data.name, email: res.data.email }, localStorage.getItem('ct_token'));
      setEditing(false);
      setMsg({ type: 'success', text: '✓ Profile updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed.' });
    } finally { setSaving(false); }
  }

  function handleLogout() { logout(); navigate('/'); }

  if (!isLoggedIn) return null;

  /* ── derived ── */
  const displayName = profile?.name || ctxUser?.name || 'User';
  const initials    = getInitials(displayName);
  const joinDate    = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : '—';

  const stats = {
    total:      myIssues.length,
    pending:    myIssues.filter(i => i.status === 'Pending').length,
    inProgress: myIssues.filter(i => i.status === 'In Progress').length,
    resolved:   myIssues.filter(i => i.status === 'Resolved').length,
    totalUpvotes: myIssues.reduce((sum, i) => sum + (i.upvoteCount || 0), 0),
  };

  /* ── render ── */
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f7fa' }}>
      <Navbar />

      <main style={{ flex: 1, padding: '2.5rem 0 4rem' }}>
        <div className="container" style={{ maxWidth: 980 }}>

          {/* ── Page Header ── */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: '1.75rem', color: '#102544', marginBottom: '0.2rem' }}>My Profile</h1>
              <p style={{ color: '#5a6a7e', fontSize: '0.875rem' }}>
                Manage your account · civic contributions
                {lastUpdated && !loading && (
                  <span style={{ color: '#b0bcc8', marginLeft: '0.5rem', fontSize: '0.76rem' }}>
                    · updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => fetchAll()}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#5a6a7e', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
            >
              <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              Refresh
            </button>
          </div>

          {/* ── Alert ── */}
          {msg && (
            <div style={{ padding: '0.8rem 1rem', borderRadius: '10px', marginBottom: '1.25rem', background: msg.type === 'error' ? '#fef2f2' : '#f0fdf4', border: `1.5px solid ${msg.type === 'error' ? '#fecaca' : '#bbf7d0'}`, color: msg.type === 'error' ? '#dc2626' : '#15803d', fontSize: '0.875rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {msg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
              {msg.text}
              <button onClick={() => setMsg(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '1rem' }}>✕</button>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <div style={{ padding: '1rem 1.25rem', borderRadius: '12px', marginBottom: '1.25rem', background: '#fef2f2', border: '1.5px solid #fecaca', color: '#dc2626', fontSize: '0.9rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertCircle size={18} />
              {error}
              <button onClick={() => fetchAll()} style={{ marginLeft: 'auto', fontSize: '0.8rem', fontWeight: 600, color: '#dc2626', background: 'none', border: '1px solid #fca5a5', borderRadius: '6px', padding: '0.3rem 0.7rem', cursor: 'pointer' }}>Retry</button>
            </div>
          )}

          {/* ── Two-column Grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }} className="profile-grid">

            {/* ── LEFT COLUMN ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

              {/* Avatar Card */}
              <div style={{ background: '#fff', borderRadius: '20px', padding: '2rem 1.5rem 1.5rem', boxShadow: '0 2px 16px rgba(16,37,68,0.07)', textAlign: 'center', border: '1px solid #e9edf2' }}>
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1rem' }}>
                  <div style={{ width: 96, height: 96, borderRadius: '50%', background: 'linear-gradient(135deg, #07845F 0%, #0da077 50%, #34d399 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#fff', boxShadow: '0 6px 24px rgba(7,132,95,0.3)', border: '4px solid #fff', margin: '0 auto', letterSpacing: '0.05em' }}>
                    {loading ? <User size={36} color="#fff" /> : initials}
                  </div>
                  <button title="Change photo (coming soon)" style={{ position: 'absolute', bottom: 2, right: 2, width: 28, height: 28, borderRadius: '50%', background: '#102544', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Camera size={13} color="#fff" />
                  </button>
                </div>

                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                    <Skeleton h={18} w="70%" />
                    <Skeleton h={14} w="50%" />
                  </div>
                ) : (
                  <>
                    <h2 style={{ fontWeight: 800, fontSize: '1.15rem', color: '#102544', marginBottom: '0.2rem' }}>{displayName}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginBottom: '0.4rem' }}>
                      <Shield size={13} color={ROLE_COLORS[profile?.role] || '#07845F'} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: ROLE_COLORS[profile?.role], textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        {ROLE_LABELS[profile?.role] || 'Citizen'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#b0bcc8', marginBottom: '0.5rem' }}>
                      {profile?.email}
                    </div>
                    <div style={{ fontSize: '0.73rem', color: '#8fa0b4', marginBottom: '1.25rem', borderTop: '1px solid #f0f2f5', paddingTop: '0.75rem' }}>
                      Member since {joinDate}
                    </div>
                  </>
                )}

                <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: '10px', background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fecaca', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}>
                  <LogOut size={15} /> Logout
                </button>
              </div>

              {/* Stats Card */}
              <div style={{ background: '#fff', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 2px 16px rgba(16,37,68,0.07)', border: '1px solid #e9edf2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#102544', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Statistics</h3>
                  <TrendingUp size={16} color="#07845F" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {[
                    { label: 'Total Reported',  value: stats.total,        color: '#102544', bg: '#f4f6f8',  Icon: FileText },
                    { label: 'Pending',          value: stats.pending,      color: '#E95532', bg: '#fef3f0',  Icon: AlertCircle },
                    { label: 'In Progress',      value: stats.inProgress,   color: '#f59e0b', bg: '#fffbeb',  Icon: Clock },
                    { label: 'Resolved',         value: stats.resolved,     color: '#07845F', bg: '#f0fdf4',  Icon: CheckCircle },
                    { label: 'Total Upvotes',    value: stats.totalUpvotes, color: '#3b82f6', bg: '#eff6ff',  Icon: ThumbsUp },
                  ].map(({ label, value, color, bg, Icon }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0.8rem', borderRadius: '10px', background: bg }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <Icon size={13} color={color} />
                        <span style={{ fontSize: '0.8rem', color: '#5a6a7e', fontWeight: 500 }}>{label}</span>
                      </div>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color }}>{loading ? '—' : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Account Info Card */}
              <div style={{ background: '#fff', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 2px 16px rgba(16,37,68,0.07)', border: '1px solid #e9edf2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#102544' }}>Account Information</h3>
                  {!editing ? (
                    <button onClick={() => { setEditing(true); setMsg(null); }} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.9rem', borderRadius: '8px', background: '#f0fdf8', color: '#07845F', border: '1.5px solid #07845F30', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                      <Edit3 size={14} /> Edit Profile
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => { setEditing(false); setMsg(null); setForm({ name: profile?.name || '', phone: profile?.phone || '', ward: profile?.ward || '' }); }} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.85rem', borderRadius: '8px', background: '#f4f6f8', color: '#5a6a7e', border: '1.5px solid #e2e8f0', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                        <X size={14} /> Cancel
                      </button>
                      <button onClick={handleSave} disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.45rem 0.9rem', borderRadius: '8px', background: '#07845F', color: '#fff', border: 'none', fontSize: '0.82rem', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', opacity: saving ? 0.75 : 1 }}>
                        <Save size={14} /> {saving ? 'Saving…' : 'Save Changes'}
                      </button>
                    </div>
                  )}
                </div>

                {loading ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} h={52} r={10} />)}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <FieldBox label="Full Name"      Icon={User}   editing={editing}       value={form.name}  display={profile?.name  || '—'}              onChange={v => setForm(f => ({ ...f, name: v }))}  placeholder="Your full name" />
                    <FieldBox label="Email Address"  Icon={Mail}   editing={false}          value={profile?.email || ''}  display={profile?.email || '—'}   readOnly hint="Email cannot be changed" />
                    <FieldBox label="Phone Number"   Icon={Phone}  editing={editing}       value={form.phone} display={profile?.phone || 'Not provided'}   onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+91 XXXXX XXXXX" />
                    <FieldBox label="Ward / Area"    Icon={MapPin} editing={editing}       value={form.ward}  display={profile?.ward  || 'Not provided'}    onChange={v => setForm(f => ({ ...f, ward: v }))}  placeholder="Your ward / locality" />
                    <FieldBox label="City"           Icon={MapPin} editing={false}          value={profile?.city  || ''}  display={profile?.city  || 'Not provided'} readOnly />
                    <FieldBox label="State"          Icon={MapPin} editing={false}          value={profile?.state || ''}  display={profile?.state || 'Not provided'} readOnly />
                  </div>
                )}
              </div>

              {/* Recent Issues Card */}
              <div style={{ background: '#fff', borderRadius: '20px', padding: '1.75rem', boxShadow: '0 2px 16px rgba(16,37,68,0.07)', border: '1px solid #e9edf2' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem', color: '#102544' }}>Recent Issues</h3>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {!loading && myIssues.length > 0 && (
                      <span style={{ fontSize: '0.78rem', color: '#8fa0b4', background: '#f4f6f8', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 600 }}>
                        {myIssues.length} total
                      </span>
                    )}
                    <Link to="/my-issues" style={{ fontSize: '0.82rem', color: '#07845F', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
                  </div>
                </div>

                {loading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} h={56} r={10} />)}
                  </div>
                ) : myIssues.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2.5rem', color: '#8fa0b4' }}>
                    <FileText size={40} style={{ marginBottom: '0.75rem', color: '#e2e8f0' }} />
                    <p style={{ fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.75rem' }}>No issues reported yet.</p>
                    <Link to="/report-issue" className="btn btn-primary" style={{ display: 'inline-block', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
                      Report Your First Issue
                    </Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {myIssues.slice(0, 6).map(issue => <RecentIssueRow key={issue._id} issue={issue} />)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @media (max-width: 860px) { .profile-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

/* ── FieldBox ─────────────────────────────────────── */
function FieldBox({ label, Icon, editing, value, display, onChange, placeholder, readOnly, hint }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8fa0b4', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', background: readOnly ? '#f8fafc' : editing ? '#fff' : '#f8fafc', border: `1.5px solid ${editing && !readOnly ? '#07845F' : '#e9edf2'}`, borderRadius: '10px', padding: '0.6rem 0.85rem', transition: 'border-color 0.2s' }}>
        <Icon size={14} color={editing && !readOnly ? '#07845F' : '#b0bcc8'} style={{ flexShrink: 0 }} />
        {editing && !readOnly ? (
          <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || ''} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.875rem', color: '#102544', width: '100%', fontFamily: 'Inter, sans-serif' }} />
        ) : (
          <span style={{ fontSize: '0.875rem', color: display === 'Not provided' || display === '—' ? '#c0cad6' : '#102544', fontWeight: 500 }}>{display}</span>
        )}
      </div>
      {hint && <span style={{ fontSize: '0.68rem', color: '#c0cad6' }}>{hint}</span>}
    </div>
  );
}

/* ── RecentIssueRow ───────────────────────────────── */
function RecentIssueRow({ issue }) {
  const s    = STATUS_CONFIG[issue.status] || STATUS_CONFIG['Pending'];
  const date = new Date(issue.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Link to={`/issues/${issue._id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0.9rem', borderRadius: '12px', border: '1.5px solid #f0f2f5', background: '#fafbfc', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#07845F'; e.currentTarget.style.background = '#f0fdf8'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f2f5'; e.currentTarget.style.background = '#fafbfc'; }}
      >
        <div style={{ width: 34, height: 34, borderRadius: '9px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <s.Icon size={15} color={s.color} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#102544', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.title}</div>
          <div style={{ fontSize: '0.72rem', color: '#8fa0b4', marginTop: '0.1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ background: '#f0f2f5', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 600, color: '#5a6a7e' }}>{issue.category}</span>
            <span>{date}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: '#8fa0b4' }}><ThumbsUp size={11} />{issue.upvoteCount ?? 0}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: '#8fa0b4' }}><MessageCircle size={11} />{issue.commentCount ?? 0}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.6rem', borderRadius: '20px', background: s.bg, color: s.color, fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
            {issue.status}
          </span>
        </div>
      </div>
    </Link>
  );
}
