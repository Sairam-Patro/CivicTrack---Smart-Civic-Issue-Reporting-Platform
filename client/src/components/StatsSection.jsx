import { Users, FileText, CheckCircle, Landmark } from 'lucide-react';

const STATS = [
  { icon: <Users size={24} />, value: '10,000+', label: 'Active Citizens', color: '#E95532', bg: '#fef0ec' },
  { icon: <FileText size={24} />, value: '5,000+', label: 'Issues Reported', color: '#3b82f6', bg: '#eff6ff' },
  { icon: <CheckCircle size={24} />, value: '3,200+', label: 'Issues Resolved', color: '#07845F', bg: '#ecfdf5' },
  { icon: <Landmark size={24} />, value: '20+', label: 'Local Bodies Connected', color: '#7c3aed', bg: '#f5f3ff' },
];

export default function StatsSection() {
  return (
    <section style={{ padding: '0 0 3rem' }}>
      <div className="container">
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          boxShadow: '0 4px 32px rgba(16,37,68,0.10)',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          overflow: 'hidden',
        }}
        className="stats-grid">
          {STATS.map((s, i) => (
            <div key={i} style={{
              padding: '1.75rem 1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              borderRight: i < STATS.length - 1 ? '1px solid #f0f2f5' : 'none',
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '50%',
                background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.color, flexShrink: 0
              }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#102544', lineHeight: 1.1 }}>{s.value}</div>
                <div style={{ fontSize: '0.82rem', color: '#5a6a7e', fontWeight: 500, marginTop: '0.15rem' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.5rem' }}>
          * Statistics shown are for demonstration purposes only and will reflect real data once connected to the database.
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
