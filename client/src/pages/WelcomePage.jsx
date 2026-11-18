/**
 * WelcomePage — temporary placeholder page.
 * Shows the project name and tagline.
 * Will be replaced by the actual homepage in a future phase.
 */
function WelcomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #0891b2 100%)',
        color: '#ffffff',
        fontFamily: 'Inter, system-ui, sans-serif',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      {/* Badge */}
      <div
        style={{
          display: 'inline-block',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '999px',
          padding: '0.35rem 1rem',
          fontSize: '0.8rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
          backdropFilter: 'blur(4px)',
        }}
      >
        🚧 Foundation Phase — Setup Complete
      </div>

      {/* Heading */}
      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          marginBottom: '1rem',
        }}
      >
        CivicTrack
      </h1>

      <p
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
          fontWeight: 500,
          opacity: 0.85,
          marginBottom: '0.75rem',
        }}
      >
        Smart Civic Issue Reporting Platform
      </p>

      <p
        style={{
          fontSize: '1.15rem',
          fontStyle: 'italic',
          opacity: 0.7,
          marginBottom: '2.5rem',
        }}
      >
        "Report Today. Better Tomorrow."
      </p>

      {/* Status Pills */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: '⚛️ React + Vite', color: '#22c55e' },
          { label: '🟢 Express Running', color: '#22c55e' },
          { label: '🍃 MongoDB Ready', color: '#f59e0b' },
        ].map(({ label, color }) => (
          <span
            key={label}
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: `1px solid ${color}55`,
              borderRadius: '8px',
              padding: '0.4rem 0.9rem',
              fontSize: '0.875rem',
              color,
              fontWeight: 600,
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default WelcomePage;
