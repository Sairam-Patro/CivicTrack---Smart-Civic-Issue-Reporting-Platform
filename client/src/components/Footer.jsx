import { Link } from 'react-router-dom';
import { Building2, Leaf, Mail, Phone, MapPin } from 'lucide-react';

// Inline SVG brand icons (lucide-react v1 removed brand logos)
const FacebookIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const GitHubIcon = ({ size = 16 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub">
    <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.06 5.06 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.06 5.06 0 0 0 5 4.77 5.44 5.44 0 0 0 3.56 9c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function Footer() {
  return (
    <footer style={{ background: '#102544', color: '#cbd5e1', padding: '4rem 0 2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '2.5rem', marginBottom: '3rem' }}>

          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none', marginBottom: '1rem' }}>
              <div style={{ position: 'relative', width: '36px', height: '36px' }}>
                <Building2 size={26} strokeWidth={1.8} style={{ color: '#07845F', position: 'absolute', top: 0, left: 0 }} />
                <Leaf size={13} style={{ color: '#07845F', position: 'absolute', bottom: 0, right: 0, fill: '#07845F' }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>CivicTrack</div>
                <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 500 }}>Report Today. Better Tomorrow.</div>
              </div>
            </Link>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: '#94a3b8', maxWidth: '280px', marginBottom: '1.5rem' }}>
              Empowering citizens to report civic issues, track progress and build smarter, cleaner communities.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[FacebookIcon, TwitterIcon, InstagramIcon, GitHubIcon].map((Icon, i) => (
                <a key={i} href="#" style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#94a3b8', transition: 'background 0.2s', textDecoration: 'none'
                }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}>
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[['/', 'Home'], ['/report-issue', 'Report Issue'], ['/map', 'Live Map'], ['/issues', 'Browse Issues'], ['/about', 'About Us']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} style={{ fontSize: '0.875rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#07845F'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Help</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[['/how-it-works', 'How It Works'], ['/contact', 'Contact Support'], ['/login', 'Login'], ['/register', 'Register'], ['/admin/login', 'Admin Portal 🔒']].map(([to, label]) => (
                <li key={to}>
                  <Link to={to} style={{ fontSize: '0.875rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#07845F'}
                    onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#fff', fontWeight: 700, marginBottom: '1rem', fontSize: '0.95rem' }}>Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                [Mail, 'support@civictrack.in'],
                [Phone, '+91 98765 43210'],
                [MapPin, 'Brahmapur, Odisha, India'],
              ].map(([Icon, text], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Icon size={15} style={{ color: '#07845F', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>© 2024 CivicTrack. All rights reserved.</p>
          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Built for cleaner, smarter cities 🌿</p>
        </div>
      </div>
    </footer>
  );
}
