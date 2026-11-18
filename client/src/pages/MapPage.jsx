import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { MapPin, Filter } from 'lucide-react';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const PRIORITY_COLORS = { High: '#E95532', Medium: '#f59e0b', Low: '#07845F' };
const CATEGORIES = ['All', 'Potholes', 'Garbage', 'Streetlights', 'Drainage', 'Water Supply'];

function createColorIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
    iconSize: [28, 28], iconAnchor: [14, 14],
  });
}

const DEMO_ISSUES = [
  { id: 1, title: 'Pothole on Main Road', category: 'Potholes', priority: 'High', location: 'Brahmapur, Ward 12', lat: 19.2948, lng: 84.7941, upvotes: 128, status: 'Pending' },
  { id: 2, title: 'Overflowing Garbage Bin', category: 'Garbage', priority: 'Medium', location: 'Sector 4, Ward 3', lat: 19.2890, lng: 84.7900, upvotes: 67, status: 'In Progress' },
  { id: 3, title: 'Street Light Out', category: 'Streetlights', priority: 'Low', location: 'MG Road, Ward 7', lat: 19.3000, lng: 84.8000, upvotes: 44, status: 'Resolved' },
  { id: 4, title: 'Clogged Drain', category: 'Drainage', priority: 'High', location: 'Civil Lines, Ward 5', lat: 19.2850, lng: 84.7860, upvotes: 89, status: 'Pending' },
];

export default function MapPage() {
  const [issues, setIssues] = useState(DEMO_ISSUES);
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? issues : issues.filter(i => i.category === activeCategory);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, background: '#FCFAF5' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', height: 'calc(100vh - 68px)' }}>
          {/* Sidebar */}
          <div style={{ borderRight: '1px solid #e2e8f0', overflow: 'auto', padding: '1.25rem' }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#102544', marginBottom: '1rem' }}>
              Live Civic Map
            </h2>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setActiveCategory(c)} style={{
                  padding: '0.3rem 0.7rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600,
                  border: 'none', cursor: 'pointer',
                  background: activeCategory === c ? '#07845F' : '#f0f2f5',
                  color: activeCategory === c ? '#fff' : '#5a6a7e',
                }}>
                  {c}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filtered.map(issue => (
                <Link to={`/issues/${issue.id}`} key={issue.id} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: '#fff', borderRadius: '12px', padding: '0.9rem 1rem',
                    boxShadow: '0 2px 8px rgba(16,37,68,0.07)',
                    border: '1.5px solid transparent', transition: 'border-color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#07845F'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#102544', marginBottom: '0.3rem' }}>{issue.title}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '20px', background: `${PRIORITY_COLORS[issue.priority]}18`, color: PRIORITY_COLORS[issue.priority] }}>
                        {issue.priority}
                      </span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '0.15rem 0.5rem', borderRadius: '20px', background: '#f0f2f5', color: '#5a6a7e' }}>
                        {issue.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#5a6a7e', display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
                      <MapPin size={11} /> {issue.location}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Map */}
          <MapContainer center={[19.2948, 84.7941]} zoom={13} style={{ width: '100%', height: '100%' }} scrollWheelZoom>
            <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filtered.map(issue => (
              <Marker key={issue.id} position={[issue.lat, issue.lng]} icon={createColorIcon(PRIORITY_COLORS[issue.priority])}>
                <Popup>
                  <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '160px' }}>
                    <strong style={{ fontSize: '0.85rem' }}>{issue.title}</strong><br />
                    <span style={{ fontSize: '0.75rem', color: PRIORITY_COLORS[issue.priority], fontWeight: 600 }}>{issue.priority} Priority</span><br />
                    <span style={{ fontSize: '0.75rem', color: '#5a6a7e' }}>{issue.location}</span><br />
                    <Link to={`/issues/${issue.id}`} style={{ fontSize: '0.75rem', color: '#07845F', fontWeight: 600 }}>View Details →</Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </main>
    </div>
  );
}
