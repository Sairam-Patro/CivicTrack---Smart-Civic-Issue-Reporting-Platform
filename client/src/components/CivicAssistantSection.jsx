import { MessageCircle } from 'lucide-react';

export default function CivicAssistantSection() {
  return (
    <section style={{ padding: '4rem 0', background: '#f0f7f4' }} id="assistant">
      <div className="container">
        <div style={{
          background: '#fff', borderRadius: '24px', padding: '2.5rem',
          boxShadow: '0 8px 32px rgba(16,37,68,0.10)',
          display: 'grid', gridTemplateColumns: '1fr auto', gap: '2rem', alignItems: 'center'
        }}>
          {/* Left */}
          <div>
            <h2 style={{ fontWeight: 800, fontSize: '1.6rem', color: '#102544', marginBottom: '0.5rem' }}>
              Meet Your Civic Assistant
            </h2>
            <p style={{ color: '#5a6a7e', fontSize: '0.9rem', marginBottom: '1.25rem', maxWidth: '420px', lineHeight: 1.6 }}>
              Ask anything about reporting, tracking or using CivicTrack. Available 24/7 to guide you through the platform.
            </p>

            {/* Welcome Message */}
            <div style={{
              background: '#f0f7f4', borderRadius: '16px', padding: '1rem 1.25rem',
              display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.25rem',
              maxWidth: '460px'
            }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: '#102544', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.25rem', flexShrink: 0
              }}>
                🤖
              </div>
              <div style={{
                background: '#fff', borderRadius: '14px 14px 14px 4px',
                padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#102544', lineHeight: 1.6,
                boxShadow: '0 2px 8px rgba(16,37,68,0.07)'
              }}>
                Hi! I'm your <strong>Civic Assistant</strong> 👋<br />
                I can help you report issues, track complaints and guide you on how to use CivicTrack.
              </div>
            </div>

            <button
              onClick={() => document.querySelector('.chat-fab')?.click()}
              className="btn btn-green"
              style={{ gap: '0.5rem' }}
            >
              <MessageCircle size={18} />
              Chat Now →
            </button>
          </div>

          {/* Right: Robot illustration */}
          <div style={{
            width: '200px', height: '200px', flexShrink: 0,
            background: 'linear-gradient(135deg, #f0f7f4 0%, #e8f5f0 100%)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '6rem', boxShadow: '0 8px 32px rgba(7,132,95,0.15)'
          }}>
            🤖
          </div>
        </div>
      </div>
    </section>
  );
}
