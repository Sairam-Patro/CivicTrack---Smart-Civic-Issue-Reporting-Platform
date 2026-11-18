import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Building2, Leaf, Users, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, background: '#FCFAF5' }}>
        {/* Hero */}
        <section style={{ background: 'linear-gradient(135deg, #102544 0%, #1a3a6e 100%)', color: '#fff', padding: '5rem 0', textAlign: 'center' }}>
          <div className="container">
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(7,132,95,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={36} style={{ color: '#07845F' }} />
              </div>
            </div>
            <h1 style={{ fontWeight: 900, fontSize: '2.5rem', marginBottom: '1rem' }}>About CivicTrack</h1>
            <p style={{ fontSize: '1.1rem', color: '#94a3b8', maxWidth: '560px', margin: '0 auto', lineHeight: 1.7 }}>
              Bridging the gap between citizens and local government for cleaner, smarter, more livable cities.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section style={{ padding: '5rem 0' }}>
          <div className="container" style={{ maxWidth: '860px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: '1.8rem', color: '#102544', marginBottom: '1rem' }}>Our Mission</h2>
                <p style={{ color: '#5a6a7e', lineHeight: 1.8, marginBottom: '1rem' }}>
                  CivicTrack is a public-interest platform that empowers citizens to report local infrastructure problems and track their resolution in real time.
                </p>
                <p style={{ color: '#5a6a7e', lineHeight: 1.8 }}>
                  We believe that when communities are engaged and governments are accountable, cities become better for everyone. Our platform makes civic participation easy, transparent and impactful.
                </p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {[
                  { icon: <Users size={24} />, label: 'Community First', color: '#07845F' },
                  { icon: <Target size={24} />, label: 'Accountability', color: '#E95532' },
                  { icon: <Heart size={24} />, label: 'Transparency', color: '#7c3aed' },
                  { icon: <Leaf size={24} />, label: 'Sustainability', color: '#0ea5e9' },
                ].map((v, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 12px rgba(16,37,68,0.07)', textAlign: 'center' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${v.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: v.color, margin: '0 auto 0.75rem' }}>{v.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#102544' }}>{v.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
