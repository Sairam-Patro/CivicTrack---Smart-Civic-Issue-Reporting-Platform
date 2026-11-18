import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsSection from '../components/StatsSection';
import HowItWorksSection from '../components/HowItWorksSection';
import ExploreIssuesSection from '../components/ExploreIssuesSection';
import CivicAssistantSection from '../components/CivicAssistantSection';
import CivicAssistant from '../components/CivicAssistant';
import Footer from '../components/Footer';

/**
 * HomePage — Main landing page for CivicTrack.
 * Matches reference image layout closely.
 */
export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <main style={{ flex: 1 }}>
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <ExploreIssuesSection />
        <CivicAssistantSection />
      </main>

      <Footer />

      {/* Floating Chatbot */}
      <CivicAssistant />
    </div>
  );
}
