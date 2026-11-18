import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, ThumbsUp, MessageCircle, ArrowLeft, Calendar, User } from 'lucide-react';

const PRIORITY_COLORS = { High: '#E95532', Medium: '#f59e0b', Low: '#07845F' };
const STATUS_COLORS = { Pending: '#E95532', 'In Progress': '#f59e0b', Resolved: '#07845F' };

const DEMO_ISSUES = {
  1: {
    id: 1, title: 'Pothole on Main Road', category: 'Potholes', priority: 'High', location: 'Brahmapur, Ward 12',
    upvotes: 128, comments: 5, status: 'Pending', date: '2024-10-28',
    description: 'There is a large pothole on on Main Road near the Gandhi Park junction that is causing accidents and damage to vehicles. The hole is approximately 2 feet wide and 6 inches deep. Multiple vehicles have been damaged.',
    reportedBy: 'Rahul Sharma',
    ward: 'Ward 12',
    comments_list: [
      { user: 'Priya K.', text: 'This has been here for months! Very dangerous at night.', date: '2024-10-29' },
      { user: 'Admin', text: 'Issue has been forwarded to PWD department.', date: '2024-10-30' },
    ]
  },
};

export default function IssueDetailPage() {
  const { id } = useParams();
  const issue = DEMO_ISSUES[id] || DEMO_ISSUES[1];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, background: '#FCFAF5', padding: '2.5rem 0' }}>
        <div className="container" style={{ maxWidth: '760px' }}>
          <Link to="/issues" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#5a6a7e', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '1.5rem', fontWeight: 500 }}>
            <ArrowLeft size={16} /> Back to Issues
          </Link>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '20px', background: `${PRIORITY_COLORS[issue.priority]}18`, color: PRIORITY_COLORS[issue.priority] }}>{issue.priority} Priority</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.75rem', borderRadius: '20px', background: `${STATUS_COLORS[issue.status]}18`, color: STATUS_COLORS[issue.status] }}>{issue.status}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.75rem', borderRadius: '20px', background: '#f0f2f5', color: '#5a6a7e' }}>{issue.category}</span>
            </div>

            <h1 style={{ fontWeight: 800, fontSize: '1.6rem', color: '#102544', marginBottom: '0.5rem' }}>{issue.title}</h1>

            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginBottom: '1.25rem', color: '#5a6a7e', fontSize: '0.83rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14} /> {issue.location}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={14} /> {issue.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><User size={14} /> {issue.reportedBy}</span>
            </div>

            <p style={{ color: '#5a6a7e', lineHeight: 1.7, marginBottom: '1.5rem' }}>{issue.description}</p>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-green" style={{ gap: '0.4rem' }}>
                <ThumbsUp size={16} /> Upvote ({issue.upvotes})
              </button>
            </div>
          </div>

          {/* Comments */}
          <div className="card">
            <h3 style={{ fontWeight: 700, color: '#102544', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageCircle size={18} style={{ color: '#07845F' }} /> Comments ({issue.comments_list?.length || 0})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              {issue.comments_list?.map((c, i) => (
                <div key={i} style={{ background: '#f8fafc', borderRadius: '12px', padding: '0.85rem 1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#102544' }}>{c.user}</span>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{c.date}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: '#5a6a7e', lineHeight: 1.5 }}>{c.text}</p>
                </div>
              ))}
            </div>
            <textarea placeholder="Add a comment..." rows={3}
              style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', outline: 'none', color: '#102544', resize: 'vertical', marginBottom: '0.75rem' }} />
            <button className="btn btn-primary">Post Comment</button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
