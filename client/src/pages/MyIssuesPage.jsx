import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FileText, Clock, CheckCircle, AlertCircle, RefreshCw, ThumbsUp, MessageCircle, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const STATUS_CONFIG = {
  Pending:      { color: '#E95532', bg: '#fef3f0', Icon: AlertCircle },
  'In Progress':{ color: '#f59e0b', bg: '#fffbeb', Icon: Clock },
  Resolved:     { color: '#07845F', bg: '#f0fdf4', Icon: CheckCircle },
  Closed:       { color: '#5a6a7e', bg: '#f4f6f8', Icon: FileText },
  Rejected:     { color: '#dc2626', bg: '#fef2f2', Icon: AlertCircle },
};

const POLL_MS = 30_000;

function SkeletonRow() {
  return (
    <div style={{ background: '#fff', borderRadius: '14px', padding: '1.1rem 1.4rem', border: '1.5px solid #f0f2f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
      <div style={{ flex: 1 }}>
        <div style={{ height: 15, width: '60%', background: '#f0f2f5', borderRadius: 6, marginBottom: '0.5rem', animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: 12, width: '40%', background: '#f0f2f5', borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
      <div style={{ height: 26, width: 90, background: '#f0f2f5', borderRadius: 20, animation: 'pulse 1.5s ease-in-out infinite' }} />
    </div>
  );
}

export default function MyIssuesPage() {
  const { isLoggedIn } = useAuth();

  const [issues,      setIssues]      = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchIssues = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/users/my-issues');
      setIssues(Array.isArray(data) ? data : []);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err?.response?.data?.message || 'Could not load your issues.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchIssues();
    const timer = setInterval(() => fetchIssues(true), POLL_MS);
    return () => clearInterval(timer);
  }, [isLoggedIn, fetchIssues]);

  if (!isLoggedIn) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
          <FileText size={48} style={{ color: '#e2e8f0' }} />
          <h2 style={{ fontWeight: 700, color: '#102544' }}>Login Required</h2>
          <p style={{ color: '#5a6a7e' }}>Please login to see your reported issues.</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const STATUSES = ['All', 'Pending', 'In Progress', 'Resolved', 'Closed', 'Rejected'];
  const displayed = filterStatus === 'All' ? issues : issues.filter(i => i.status === filterStatus);

  const counts = {
    total:      issues.length,
    pending:    issues.filter(i => i.status === 'Pending').length,
    inProgress: issues.filter(i => i.status === 'In Progress').length,
    resolved:   issues.filter(i => i.status === 'Resolved').length,
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f7fa' }}>
      <Navbar />
      <main style={{ flex: 1, padding: '2.5rem 0 4rem' }}>
        <div className="container" style={{ maxWidth: 900 }}>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: '1.75rem', color: '#102544', marginBottom: '0.25rem' }}>My Issues</h1>
              <p style={{ color: '#5a6a7e', fontSize: '0.9rem' }}>
                {loading ? 'Loading…' : `${issues.length} issue${issues.length !== 1 ? 's' : ''} reported`}
                {lastUpdated && !loading && (
                  <span style={{ color: '#b0bcc8', marginLeft: '0.5rem', fontSize: '0.78rem' }}>
                    · updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                )}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={() => fetchIssues()}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#5a6a7e', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
              </button>
              <Link to="/report-issue" className="btn btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem' }}>
                + Report New Issue
              </Link>
            </div>
          </div>

          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.75rem' }}>
            {[
              { label: 'Total',       value: counts.total,      color: '#102544', bg: '#f4f6f8' },
              { label: 'Pending',     value: counts.pending,    color: '#E95532', bg: '#fef3f0' },
              { label: 'In Progress', value: counts.inProgress, color: '#f59e0b', bg: '#fffbeb' },
              { label: 'Resolved',    value: counts.resolved,   color: '#07845F', bg: '#f0fdf4' },
            ].map(({ label, value, color, bg }) => (
              <div key={label} style={{ background: bg, borderRadius: '14px', padding: '1rem 1.25rem', border: `1.5px solid ${color}20` }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1 }}>{loading ? '—' : value}</div>
                <div style={{ fontSize: '0.78rem', color: '#5a6a7e', fontWeight: 500, marginTop: '0.35rem' }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Status Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            {STATUSES.map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} style={{
                padding: '0.35rem 0.85rem', borderRadius: '100px', fontSize: '0.78rem', fontWeight: 600,
                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                background: filterStatus === s ? '#07845F' : '#fff',
                color: filterStatus === s ? '#fff' : '#5a6a7e',
                boxShadow: filterStatus === s ? '0 2px 8px rgba(7,132,95,0.25)' : '0 1px 3px rgba(16,37,68,0.07)',
              }}>{s}</button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '12px', marginBottom: '1.25rem', color: '#dc2626' }}>
              <AlertCircle size={18} />
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{error}</span>
              <button onClick={() => fetchIssues()} style={{ marginLeft: 'auto', fontSize: '0.8rem', fontWeight: 600, color: '#dc2626', background: 'none', border: '1px solid #fca5a5', borderRadius: '6px', padding: '0.3rem 0.7rem', cursor: 'pointer' }}>Retry</button>
            </div>
          )}

          {/* Issues List */}
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}
            </div>
          ) : displayed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', color: '#8fa0b4', background: '#fff', borderRadius: '20px', border: '1.5px solid #f0f2f5' }}>
              <FileText size={48} style={{ marginBottom: '1rem', color: '#e2e8f0' }} />
              <p style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                {filterStatus === 'All' ? "You haven't reported any issues yet." : `No ${filterStatus} issues.`}
              </p>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>Help your community by reporting civic problems.</p>
              <Link to="/report-issue" className="btn btn-primary">Report Your First Issue</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {displayed.map(issue => <IssueRow key={issue._id} issue={issue} />)}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes spin  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}

function IssueRow({ issue }) {
  const s    = STATUS_CONFIG[issue.status] || STATUS_CONFIG['Pending'];
  const date = new Date(issue.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Link to={`/issues/${issue._id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{ background: '#fff', borderRadius: '14px', padding: '1.1rem 1.4rem', border: '1.5px solid #f0f2f5', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', transition: 'all 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#07845F'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(7,132,95,0.1)'; e.currentTarget.style.transform = 'translateX(3px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f2f5'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateX(0)'; }}
      >
        {/* Status Icon */}
        <div style={{ width: 40, height: 40, borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <s.Icon size={18} color={s.color} />
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#102544', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.25rem' }}>
            {issue.title}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#8fa0b4', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: '#f0f2f5', padding: '0.15rem 0.5rem', borderRadius: '4px', fontWeight: 600, color: '#5a6a7e' }}>{issue.category}</span>
            {issue.location?.address && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                <MapPin size={11} color="#E95532" />{issue.location.address}
              </span>
            )}
            <span>{date}</span>
          </div>
        </div>

        {/* Counts */}
        <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem', color: '#8fa0b4', flexShrink: 0 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><ThumbsUp size={12} />{issue.upvoteCount ?? 0}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MessageCircle size={12} />{issue.commentCount ?? 0}</span>
        </div>

        {/* Status Badge */}
        <span style={{
          display: 'flex', alignItems: 'center', gap: '0.3rem',
          padding: '0.35rem 0.75rem', borderRadius: '20px',
          background: s.bg, color: s.color,
          fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          <s.Icon size={12} /> {issue.status}
        </span>
      </div>
    </Link>
  );
}
