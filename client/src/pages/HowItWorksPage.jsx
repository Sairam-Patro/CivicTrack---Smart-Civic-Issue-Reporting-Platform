import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HowItWorksSection from '../components/HowItWorksSection';

export default function HowItWorksPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, background: '#FCFAF5' }}>
        <section style={{ background: 'linear-gradient(135deg, #102544 0%, #1a3a6e 100%)', color: '#fff', padding: '4rem 0', textAlign: 'center' }}>
          <div className="container">
            <h1 style={{ fontWeight: 900, fontSize: '2.5rem', marginBottom: '0.75rem' }}>How CivicTrack Works</h1>
            <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: '480px', margin: '0 auto' }}>
              A simple 5-step process that connects citizens with authorities and drives real change.
            </p>
          </div>
        </section>
        <HowItWorksSection />
      </main>
      <Footer />
    </div>
  );
}
