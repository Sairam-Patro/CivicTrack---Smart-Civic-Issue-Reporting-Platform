import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Search, MapPin, ThumbsUp, MessageCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix leaflet default icon issue with vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const CATEGORIES = ['All', 'Potholes', 'Garbage', 'Streetlights', 'Drainage', 'Water'];

const SAMPLE_ISSUES = [
  { id: 1, title: 'Pothole on Main Road', category: 'Potholes', priority: 'High', location: 'Brahmapur, Ward 12', lat: 19.2948, lng: 84.7941, upvotes: 128, comments: 5 },
  { id: 2, title: 'Overflowing Garbage Bin', category: 'Garbage', priority: 'Medium', location: 'Sector 4, Ward 3', lat: 19.2890, lng: 84.7900, upvotes: 67, comments: 2 },
  { id: 3, title: 'Street Light Out', category: 'Streetlights', priority: 'Low', location: 'MG Road, Ward 7', lat: 19.3000, lng: 84.8000, upvotes: 44, comments: 1 },
  { id: 4, title: 'Clogged Drain', category: 'Drainage', priority: 'High', location: 'Civil Lines, Ward 5', lat: 19.2850, lng: 84.7860, upvotes: 89, comments: 4 },
];

const PRIORITY_COLORS = { High: '#E95532', Medium: '#f59e0b', Low: '#07845F' };

function createColorIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

export default function ExploreIssuesSection() {
  const [locationSearch, setLocationSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedIssue, setSelectedIssue] = useState(SAMPLE_ISSUES[0]);

  const filtered = activeCategory === 'All'
    ? SAMPLE_ISSUES
    : SAMPLE_ISSUES.filter(i => i.category === activeCategory);

  function handleSearch(e) {
    e.preventDefault();
    // In production: call API with locationSearch
  }

  return (
    <section style={{ padding: '5rem 0', background: '#FCFAF5' }} id="explore">
      <div className="container">
        <div className="explore-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>

          {/* ── Left: Search + Filters + Issue Card ── */}
          <div>
            <h2 className="section-title" style={{ marginBottom: '0.5rem' }}>Explore Issues Near You</h2>
            <p className="section-sub" style={{ marginBottom: '1.5rem' }}>
              See reported problems around your area and support the ones that matter.
            </p>

            {/* Location Search */}
            <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem',
                border: '1.5px solid #e2e8f0', borderRadius: '10px', padding: '0.6rem 0.9rem',
                background: '#fff'
              }}>
                <Search size={16} style={{ color: '#5a6a7e', flexShrink: 0 }} />
                <input
                  value={locationSearch}
                  onChange={e => setLocationSearch(e.target.value)}
                  placeholder="Enter location..."
                  style={{ border: 'none', outline: 'none', fontSize: '0.9rem', width: '100%', fontFamily: 'Inter, sans-serif', color: '#102544' }}
                />
              </div>
              <button type="submit" className="btn btn-green" style={{ padding: '0.6rem 1.25rem' }}>
                Search
              </button>
            </form>

            {/* Category Filters */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: '0.4rem 0.9rem',
                    borderRadius: '100px',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    transition: 'all 0.2s',
                    background: activeCategory === cat ? '#07845F' : '#f0f2f5',
                    color: activeCategory === cat ? '#fff' : '#5a6a7e',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Issue Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filtered.map(issue => (
                <div
                  key={issue.id}
                  onClick={() => setSelectedIssue(issue)}
                  style={{
                    background: '#fff', borderRadius: '14px', padding: '1rem 1.1rem',
                    boxShadow: selectedIssue?.id === issue.id ? '0 4px 20px rgba(7,132,95,0.18)' : '0 2px 8px rgba(16,37,68,0.07)',
                    border: selectedIssue?.id === issue.id ? '1.5px solid #07845F' : '1.5px solid transparent',
                    cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#102544' }}>{issue.title}</span>
                    </div>
                    <div style={{
                      display: 'inline-block', background: `${PRIORITY_COLORS[issue.priority]}18`,
                      color: PRIORITY_COLORS[issue.priority], fontSize: '0.7rem', fontWeight: 700,
                      padding: '0.2rem 0.6rem', borderRadius: '20px', marginBottom: '0.5rem'
                    }}>
                      {issue.priority} Priority
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#5a6a7e' }}>
                        <MapPin size={12} /> {issue.location}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#5a6a7e' }}>
                        <ThumbsUp size={12} /> {issue.upvotes} upvotes
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: '#5a6a7e' }}>
                        <MessageCircle size={12} /> {issue.comments} comments
                      </span>
                    </div>
                  </div>
                  <Link
                    to={`/issues/${issue.id}`}
                    onClick={e => e.stopPropagation()}
                    style={{ color: '#07845F', flexShrink: 0, padding: '0.25rem' }}
                  >
                    <ChevronRight size={20} />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Map ── */}
          <div style={{ position: 'sticky', top: '80px' }}>
            <div style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(16,37,68,0.12)', height: '500px' }}>
              <MapContainer
                center={[19.2948, 84.7941]}
                zoom={14}
                style={{ width: '100%', height: '100%' }}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {SAMPLE_ISSUES.map(issue => (
                  <Marker
                    key={issue.id}
                    position={[issue.lat, issue.lng]}
                    icon={createColorIcon(PRIORITY_COLORS[issue.priority])}
                    eventHandlers={{ click: () => setSelectedIssue(issue) }}
                  >
                    <Popup>
                      <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '160px' }}>
                        <strong style={{ fontSize: '0.85rem' }}>{issue.title}</strong><br />
                        <span style={{ fontSize: '0.75rem', color: PRIORITY_COLORS[issue.priority], fontWeight: 600 }}>{issue.priority} Priority</span><br />
                        <span style={{ fontSize: '0.75rem', color: '#5a6a7e' }}>{issue.location}</span><br />
                        <span style={{ fontSize: '0.75rem' }}>👍 {issue.upvotes} upvotes</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>

            {/* Selected issue pop card */}
            {selectedIssue && (
              <div style={{
                background: '#fff', borderRadius: '14px', padding: '1rem 1.1rem',
                boxShadow: '0 8px 24px rgba(16,37,68,0.12)',
                marginTop: '1rem',
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem'
              }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '10px', overflow: 'hidden', flexShrink: 0, background: '#f0f2f5' }}>
                  <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&h=80&fit=crop" alt="issue" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#102544', marginBottom: '0.2rem' }}>{selectedIssue.title}</div>
                  <div style={{
                    display: 'inline-block', background: `${PRIORITY_COLORS[selectedIssue.priority]}18`,
                    color: PRIORITY_COLORS[selectedIssue.priority], fontSize: '0.7rem', fontWeight: 700,
                    padding: '0.15rem 0.6rem', borderRadius: '20px', marginBottom: '0.4rem'
                  }}>
                    {selectedIssue.priority} Priority
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#5a6a7e', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={11} /> {selectedIssue.location}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><ThumbsUp size={11} /> {selectedIssue.upvotes}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MessageCircle size={11} /> {selectedIssue.comments}</span>
                  </div>
                </div>
                <Link to={`/issues/${selectedIssue.id}`} style={{ color: '#07845F' }}>
                  <ChevronRight size={20} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .explore-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
