import CivicIllustration from './CivicIllustration';

/**
 * AuthLayout — True split-screen that always fits 100vh.
 * Left panel: fixed illustration, never scrolls.
 * Right panel: scrollable only when form overflows.
 */
export default function AuthLayout({ children, variant = 'login' }) {
  return (
    <>
      {/* Outer wrapper: exactly viewport height, no body-level scroll */}
      <div style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: '#FCFAF5',
      }}>

        {/* ── LEFT: illustration panel (45% wide, never scrolls) ── */}
        <div
          className="auth-left-panel"
          style={{
            width: '45%',
            flexShrink: 0,
            height: '100vh',
            overflow: 'hidden',
          }}
        >
          <CivicIllustration variant={variant} />
        </div>

        {/* ── RIGHT: form panel (55% wide, scrolls if needed) ── */}
        <div
          style={{
            flex: 1,
            height: '100vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            background: '#FCFAF5',
          }}
        >
          {children}
        </div>
      </div>

      <style>{`
        /* On tablets / mobile: hide illustration, go full width */
        @media (max-width: 900px) {
          .auth-left-panel { display: none !important; }
        }
        /* Remove any default body scroll on auth pages */
        body { overflow: hidden; }
      `}</style>
    </>
  );
}
