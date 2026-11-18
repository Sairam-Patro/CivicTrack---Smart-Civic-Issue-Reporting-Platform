import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, ThumbsUp, MessageCircle, Search, RefreshCw, AlertCircle, Filter } from 'lucide-react';
import api from '../services/api';

const CATEGORIES = ['All', 'Potholes', 'Garbage', 'Streetlights', 'Drainage', 'Water Supply', 'Encroachments', 'Other'];

const PRIORITY_COLORS = { High: '#E95532', Medium: '#f59e0b', Low: '#07845F' };
const STATUS_COLORS   = {
  Pending:      '#E95532',
  'In Progress':'#f59e0b',
  Resolved:     '#07845F',
  Closed:       '#5a6a7e',
  Rejected:     '#dc2626',
};

const POLL_MS = 30_000; // refresh every 30s

function SkeletonCard() {
  return (
    <div style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(16,37,68,0.06)', border: '1.5px solid #f0f2f5' }}>
      {[80, 50, 100, 60].map((w, i) => (
        <div key={i} style={{ height: i === 0 ? 18 : 13, width: `${w}%`, background: '#f0f2f5', borderRadius: 6, marginBottom: i < 3 ? '0.75rem' : 0, animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
    </div>
  );
}

export default function IssuesPage() {
  const [searchParams] = useSearchParams();
  const [issues, setIssues]   = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Filters
  const [search,   setSearch]   = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState('All');
  const [sortBy,   setSortBy]   = useState('date');
  const [page,     setPage]     = useState(1);

  const fetchIssues = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 12, sort: sortBy === 'upvotes' ? '-upvoteCount' : '-createdAt' };
      if (category !== 'All') params.category = category;
      if (search.trim())      params.q        = search.trim();
      const { data } = await api.get('/issues', { params });
      setIssues(data.issues || []);
      setTotal(data.total || 0);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load issues. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [category, search, sortBy, page]);

  // Initial + dependency fetch
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  // Polling every 30s (silent)
  useEffect(() => {
    const timer = setInterval(() => fetchIssues(true), POLL_MS);
    return () => clearInterval(timer);
  }, [fetchIssues]);

  // Reset page when filter changes
  useEffect(() => { setPage(1); }, [category, search, sortBy]);

  const totalPages = Math.ceil(total / 12);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, background: '#f5f7fa', padding: '2.5rem 0 4rem' }}>
        <div className="container">

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: '2rem', color: '#102544', marginBottom: '0.25rem' }}>Browse Issues</h1>
              <p style={{ color: '#5a6a7e', fontSize: '0.9rem' }}>
                {loading ? 'Loading…' : `${total} civic issue${total !== 1 ? 's' : ''} reported in your community`}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              {lastUpdated && (
                <span style={{ fontSize: '0.75rem', color: '#8fa0b4' }}>
                  Updated {lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <button
                onClick={() => fetchIssues()}
                title="Refresh"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: '#fff', color: '#5a6a7e', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
              >
                <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Refresh
              </button>
              <Link to="/report-issue" className="btn btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem' }}>
                + Report Issue
              </Link>
            </div>
          </div>

          {/* Filters Row */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0.5rem 0.9rem', background: '#fff', flex: 1, maxWidth: '320px' }}>
              <Search size={15} style={{ color: '#5a6a7e', flexShrink: 0 }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search issues, locations..."
                style={{ border: 'none', outline: 'none', fontSize: '0.875rem', width: '100%', fontFamily: 'Inter, sans-serif', color: '#102544', background: 'transparent' }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8fa0b4', lineHeight: 1 }}>✕</button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 0.9rem', border: '1.5px solid #e2e8f0', borderRadius: '10px', background: '#fff' }}>
              <Filter size={14} style={{ color: '#5a6a7e' }} />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{ border: 'none', outline: 'none', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif', background: 'transparent', color: '#102544', cursor: 'pointer' }}
              >
                <option value="date">Latest First</option>
                <option value="upvotes">Most Upvoted</option>
              </select>
            </div>
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  padding: '0.4rem 0.9rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: category === c ? '#07845F' : '#fff',
                  color: category === c ? '#fff' : '#5a6a7e',
                  boxShadow: category === c ? '0 2px 8px rgba(7,132,95,0.3)' : '0 1px 4px rgba(16,37,68,0.05)',
                }}
              >{c}</button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '12px', marginBottom: '1.5rem', color: '#dc2626' }}>
              <AlertCircle size={18} />
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{error}</span>
              <button onClick={() => fetchIssues()} style={{ marginLeft: 'auto', fontSize: '0.8rem', fontWeight: 600, color: '#dc2626', background: 'none', border: '1px solid #fca5a5', borderRadius: '6px', padding: '0.3rem 0.7rem', cursor: 'pointer' }}>Retry</button>
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : issues.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#8fa0b4' }}>
              <Search size={48} style={{ marginBottom: '1rem', color: '#e2e8f0' }} />
              <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No issues found</p>
              <p style={{ fontSize: '0.9rem' }}>Try adjusting filters or be the first to report!</p>
              <Link to="/report-issue" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>Report an Issue</Link>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {issues.map(issue => (
                  <IssueCard key={issue._id} issue={issue} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '2.5rem' }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: page === 1 ? '#f8fafc' : '#fff', color: page === 1 ? '#c0cad6' : '#102544', cursor: page === 1 ? 'default' : 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem' }}>
                    ← Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1).map((p, i, arr) => (
                    <span key={p}>
                      {i > 0 && arr[i - 1] !== p - 1 && <span style={{ padding: '0.5rem 0.25rem', color: '#8fa0b4' }}>…</span>}
                      <button
                        onClick={() => setPage(p)}
                        style={{ padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1.5px solid', borderColor: p === page ? '#07845F' : '#e2e8f0', background: p === page ? '#07845F' : '#fff', color: p === page ? '#fff' : '#102544', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '0.875rem' }}>
                        {p}
                      </button>
                    </span>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1.5px solid #e2e8f0', background: page === totalPages ? '#f8fafc' : '#fff', color: page === totalPages ? '#c0cad6' : '#102544', cursor: page === totalPages ? 'default' : 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.875rem' }}>
                    Next →
                  </button>
                </div>
              )}
            </>
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

function IssueCard({ issue }) {
  const pColor = PRIORITY_COLORS[issue.priority] || '#5a6a7e';
  const sColor = STATUS_COLORS[issue.status]   || '#5a6a7e';
  const date   = new Date(issue.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Link to={`/issues/${issue._id}`} style={{ textDecoration: 'none' }}>
      <div
        style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(16,37,68,0.07)', border: '1.5px solid transparent', transition: 'all 0.22s', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column' }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#07845F'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(7,132,95,0.14)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(16,37,68,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        {/* Badges */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px', background: `${pColor}18`, color: pColor }}>{issue.priority} Priority</span>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px', background: `${sColor}18`, color: sColor }}>{issue.status}</span>
          <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px', background: '#f0f2f5', color: '#5a6a7e' }}>{issue.category}</span>
        </div>

        {/* Title */}
        <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#102544', lineHeight: 1.35, marginBottom: '0.5rem', flex: 1 }}>{issue.title}</h3>

        {/* Location */}
        {issue.location?.address && (
          <div style={{ fontSize: '0.78rem', color: '#5a6a7e', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
            <MapPin size={12} style={{ flexShrink: 0, color: '#E95532' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.location.address}</span>
          </div>
        )}

        {/* Reporter */}
        {issue.reportedBy?.name && (
          <div style={{ fontSize: '0.75rem', color: '#8fa0b4', marginBottom: '0.75rem' }}>
            By <span style={{ fontWeight: 600, color: '#5a6a7e' }}>{issue.reportedBy.name}</span>
          </div>
        )}

        {/* Footer stats */}
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.78rem', color: '#8fa0b4', borderTop: '1px solid #f0f2f5', paddingTop: '0.75rem', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ThumbsUp size={12} /> {issue.upvoteCount ?? 0}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MessageCircle size={12} /> {issue.commentCount ?? 0}</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.72rem' }}>{date}</span>
        </div>
      </div>
    </Link>
  );
}
