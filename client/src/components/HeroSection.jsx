import { Link } from 'react-router-dom';
import { ArrowRight, Map, Shield, Users, Landmark } from 'lucide-react';

const FLOATING_CARDS = [
  { icon: '💡', label: 'Streetlight', status: 'In Progress', statusColor: '#f59e0b', bg: '#fff' },
  { icon: '🗑️', label: 'Garbage Overflow', status: 'Resolved', statusColor: '#07845F', bg: '#fff' },
  { icon: '🚧', label: 'Pothole', status: 'Pending', statusColor: '#E95532', bg: '#fff' },
];

const FEATURES = [
  { icon: <Shield size={18} />, label: 'Real Problems', sub: 'Real Action', color: '#07845F' },
  { icon: <Users size={18} />, label: 'Active', sub: 'Communities', color: '#7c3aed' },
  { icon: <Landmark size={18} />, label: 'Connected with', sub: 'Local Authorities', color: '#E95532' },
];

export default function HeroSection() {
  return (
    <section style={{
      background: 'linear-gradient(135deg, #FCFAF5 0%, #f0f7f4 100%)',
      padding: '3rem 0 0',
      overflow: 'hidden',
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center'
    }}>
      <div className="container hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', width: '100%' }}>

        {/* ── Left Side ── */}
        <div className="animate-fade-up" style={{ paddingBottom: '3rem' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(233,85,50,0.1)', borderRadius: '100px',
            padding: '0.35rem 0.9rem', marginBottom: '1.25rem'
          }}>
            <span style={{ fontSize: '0.9rem' }}>🏛️</span>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#E95532' }}>A Citizen to Government Platform</span>
          </div>

          {/* Heading */}
          <h1 style={{ fontWeight: 900, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.15, color: '#102544', marginBottom: '1rem' }}>
            Together for<br />Cleaner, Safer{' '}
            <span style={{ color: '#E95532' }}>Cities</span>
          </h1>

          {/* Description */}
          <p style={{ fontSize: '1.0625rem', color: '#5a6a7e', lineHeight: 1.7, maxWidth: '480px', marginBottom: '1.75rem' }}>
            Report civic issues, track their progress, support important problems and be part of a cleaner, smarter and more livable community.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <Link to="/report-issue" className="btn btn-primary" style={{ fontSize: '1rem', padding: '0.85rem 1.75rem' }}>
              <ArrowRight size={18} />
              Report an Issue
              <ArrowRight size={16} />
            </Link>
            <Link to="/map" className="btn btn-outline" style={{ fontSize: '1rem', padding: '0.85rem 1.75rem' }}>
              <Map size={18} />
              View Live Map
            </Link>
          </div>

          {/* Feature Highlights */}
          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: `${f.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: f.color, flexShrink: 0
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#102544', lineHeight: 1.1 }}>{f.label}</div>
                  <div style={{ fontSize: '0.72rem', color: '#5a6a7e', lineHeight: 1.1 }}>{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Side: Illustration ── */}
        <div className="animate-fade-up delay-200 hero-illustration" style={{ position: 'relative', height: '520px' }}>
          {/* Main illustration */}
          <div style={{
            width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden',
            position: 'relative', boxShadow: '0 20px 60px rgba(16,37,68,0.15)'
          }}>
            <img
              src="/hero-illustration.png"
              alt="Citizen reporting a civic issue using smartphone in a modern city"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={e => {
                e.target.parentElement.style.background = 'linear-gradient(135deg,#e8f5f0 0%,#d1ece6 100%)';
                e.target.style.display = 'none';
              }}
            />

            {/* Handwritten slogan overlay */}
            <div style={{
              position: 'absolute', top: '1rem', right: '1rem',
              fontFamily: 'Georgia, serif', fontStyle: 'italic',
              fontSize: '1.1rem', color: '#102544', lineHeight: 1.6,
              textShadow: '0 1px 2px rgba(255,255,255,0.7)'
            }}>
              Report.<br />Track.<br />Support.<br />
              <span style={{ fontWeight: 700 }}>Build a Better City.</span>
            </div>

            {/* Report badge */}
            <div style={{
              position: 'absolute', bottom: '30%', left: '38%',
              background: '#E95532', color: '#fff',
              padding: '0.3rem 0.75rem', borderRadius: '20px',
              fontSize: '0.78rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem',
              boxShadow: '0 4px 12px rgba(233,85,50,0.4)'
            }}>
              📷 Report
            </div>
          </div>

          {/* Floating Status Cards */}
          {FLOATING_CARDS.map((card, i) => (
            <div key={i} style={{
              position: 'absolute',
              right: '-1.25rem',
              top: `${20 + i * 26}%`,
              background: '#fff',
              borderRadius: '12px',
              padding: '0.6rem 0.9rem',
              boxShadow: '0 6px 24px rgba(16,37,68,0.14)',
              display: 'flex', alignItems: 'center', gap: '0.6rem',
              minWidth: '175px',
              animation: `fadeInUp 0.6s ease ${0.3 + i * 0.15}s both`,
              zIndex: 10
            }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: `${card.statusColor}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', flexShrink: 0
              }}>
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#102544' }}>{card.label}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 600, color: card.statusColor }}>{card.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-illustration { height: 300px !important; }
          .hero-illustration > div:last-child { display: none; }
        }
        @media (max-width: 640px) {
          .hero-illustration { display: none !important; }
        }
      `}</style>
    </section>
  );
}
