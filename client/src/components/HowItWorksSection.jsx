import { ChevronRight } from 'lucide-react';

const STEPS = [
  {
    num: 1, icon: '📝', title: 'Report the Issue',
    desc: 'Add details, photos and location of the problem.',
    color: '#3b82f6', bg: '#eff6ff',
  },
  {
    num: 2, icon: '📍', title: 'Get it on the Map',
    desc: 'Your issue is verified and shown on the live map.',
    color: '#07845F', bg: '#ecfdf5',
  },
  {
    num: 3, icon: '👥', title: 'Community Support',
    desc: 'Citizens can upvote issues in their area.',
    color: '#E95532', bg: '#fef0ec',
  },
  {
    num: 4, icon: '⚙️', title: 'Authorities Take Action',
    desc: 'Issues are assigned to the right department.',
    color: '#7c3aed', bg: '#f5f3ff',
  },
  {
    num: 5, icon: '✅', title: 'Track to Resolution',
    desc: "Get updates and see proof when it's resolved.",
    color: '#0ea5e9', bg: '#f0f9ff',
  },
];

export default function HowItWorksSection() {
  return (
    <section style={{ background: '#f0f7f4', padding: '5rem 0' }} id="how-it-works">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '3rem', alignItems: 'center' }}>

          {/* Left heading */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#07845F', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
              HOW IT WORKS
            </div>
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>
              From a Report<br />to a Real Change
            </h2>
            <div style={{ width: '40px', height: '3px', background: '#07845F', borderRadius: '2px', marginBottom: '1rem' }} />
            <p className="section-sub">
              A simple process that connects citizens with authorities and helps solve civic issues.
            </p>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', gap: '0', alignItems: 'stretch', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <div style={{
                  background: '#fff', borderRadius: '16px', padding: '1.25rem 1rem',
                  boxShadow: '0 2px 12px rgba(16,37,68,0.08)',
                  textAlign: 'center', width: '155px',
                  position: 'relative', flexShrink: 0
                }}>
                  {/* Number badge */}
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: step.color, color: '#fff',
                    fontSize: '0.75rem', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)',
                    boxShadow: `0 3px 8px ${step.color}40`
                  }}>
                    {step.num}
                  </div>

                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%',
                    background: step.bg, margin: '0.75rem auto 0.75rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    {step.icon}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#102544', marginBottom: '0.35rem', lineHeight: 1.3 }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#5a6a7e', lineHeight: 1.5 }}>
                    {step.desc}
                  </div>
                </div>

                {/* Arrow between steps */}
                {i < STEPS.length - 1 && (
                  <div style={{ color: '#07845F', padding: '0 0.25rem', flexShrink: 0 }}>
                    <ChevronRight size={22} strokeWidth={2.5} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .how-grid { grid-template-columns: 1fr !important; }
          .steps-row { flex-direction: column !important; align-items: center !important; }
          .step-arrow { transform: rotate(90deg); }
        }
      `}</style>
    </section>
  );
}
