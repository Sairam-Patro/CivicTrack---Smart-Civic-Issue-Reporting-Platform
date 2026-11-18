import { AlertCircle, CheckCircle, Clock, Users, Shield, Zap, TrendingUp, MapPin } from 'lucide-react';

/* ── Floating status card ─────────────────────────────────────────────────── */
function FloatCard({ icon: Icon, label, sub, color, top, left, right, delay = '0s' }) {
  return (
    <div style={{
      position: 'absolute',
      top, left, right,
      background: 'rgba(255,255,255,0.97)',
      borderRadius: '10px',
      padding: '0.42rem 0.75rem',
      boxShadow: '0 4px 18px rgba(16,37,68,0.25)',
      display: 'flex', alignItems: 'center', gap: '0.5rem',
      border: '1px solid rgba(255,255,255,0.9)',
      animation: 'floatUp 3s ease-in-out infinite',
      animationDelay: delay,
      zIndex: 10,
      maxWidth: 185,
      pointerEvents: 'none',
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: '50%', background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <Icon size={12} color="#fff" />
      </div>
      <div>
        <div style={{ fontSize: '0.67rem', fontWeight: 700, color: '#102544', whiteSpace: 'nowrap' }}>{label}</div>
        <div style={{ fontSize: '0.59rem', color: '#5a6a7e', whiteSpace: 'nowrap' }}>{sub}</div>
      </div>
    </div>
  );
}

/* ── Feature pill ─────────────────────────────────────────────────────────── */
function FeaturePill({ icon: Icon, text, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%', background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
      }}>
        <Icon size={13} color="#fff" />
      </div>
      <span style={{ fontSize: '0.76rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{text}</span>
    </div>
  );
}

/* ── Main illustration component ──────────────────────────────────────────── */
export default function CivicIllustration({ variant = 'login' }) {
  const isLogin = variant === 'login';

  return (
    <div style={{
      width: '100%',
      height: '100%',             /* fills the 100vh flex child */
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: isLogin
        ? 'linear-gradient(170deg, #0d2a4a 0%, #0b3d28 100%)'
        : 'linear-gradient(170deg, #082040 0%, #055238 100%)',
    }}>

      {/* ── IMAGE ZONE: 58% of panel height ─────────────────────────────── */}
      <div style={{ flex: '0 0 58%', position: 'relative', overflow: 'hidden' }}>
        <img
          src={isLogin ? '/civic-login.png' : '/civic-register.png'}
          alt={isLogin ? 'Citizen reporting a civic issue' : 'Clean city community'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center',
            display: 'block',
          }}
        />
        {/* Gradient overlay: darkens edges so cards pop, image stays clear */}
        <div style={{
          position: 'absolute', inset: 0,
          background: [
            'linear-gradient(to bottom,',
            '  rgba(8,22,45,0.20) 0%,',
            '  transparent 35%,',
            '  transparent 60%,',
            '  rgba(8,22,45,0.50) 100%)',
          ].join(''),
          pointerEvents: 'none',
        }} />

        {/* Floating status cards — inside image zone only */}
        {isLogin ? (
          <>
            <FloatCard icon={AlertCircle} label="Pothole Reported"  sub="Pending Review"    color="#E95532" top="10%" right="5%"  delay="0s"   />
            <FloatCard icon={Clock}       label="Streetlight"       sub="In Progress"       color="#F59E0B" top="38%" left="4%"   delay="1s"   />
            <FloatCard icon={CheckCircle} label="Garbage Issue"     sub="Resolved ✓"        color="#07845F" top="60%" right="5%"  delay="2s"   />
            <FloatCard icon={Users}       label="Community Support" sub="128 Upvotes"       color="#102544" top="80%" left="4%"   delay="3s"   />
            <div style={{ position:'absolute', top:'28%', left:'44%', animation:'bouncePin 2.2s ease-in-out infinite', zIndex:8 }}>
              <MapPin size={20} color="#E95532" fill="rgba(233,85,50,0.3)" />
            </div>
          </>
        ) : (
          <>
            <FloatCard icon={CheckCircle} label="Road Repaired"     sub="Ward 12 — Done"    color="#07845F" top="10%" right="5%"  delay="0s"   />
            <FloatCard icon={Users}       label="Active Citizens"   sub="2,841 this month"  color="#102544" top="42%" left="4%"   delay="1.2s" />
            <FloatCard icon={TrendingUp}  label="Issues Solved"     sub="+340 this week"    color="#E95532" top="68%" right="5%"  delay="2.4s" />
            <div style={{ position:'absolute', top:'28%', left:'48%', animation:'bouncePin 2.2s ease-in-out infinite', zIndex:8 }}>
              <MapPin size={18} color="#07845F" fill="rgba(7,132,95,0.3)" />
            </div>
          </>
        )}
      </div>

      {/* ── BRANDING ZONE: 42% of panel height ──────────────────────────── */}
      <div style={{
        flex: '0 0 42%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-evenly',
        padding: '1.1rem 1.6rem 1.2rem',
        background: isLogin
          ? 'linear-gradient(180deg, #0b3428 0%, #082040 100%)'
          : 'linear-gradient(180deg, #063d28 0%, #061e38 100%)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        overflow: 'hidden',
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div style={{
            width: 34, height: 34, background: '#07845F', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: '0 2px 8px rgba(7,132,95,0.4)',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <rect x="3"  y="3"  width="7" height="7" rx="1.5" fill="white" opacity="0.95"/>
              <rect x="14" y="3"  width="7" height="7" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="3"  y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.6"/>
              <rect x="14" y="14" width="7" height="7" rx="1.5" fill="white" opacity="0.95"/>
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.1 }}>CivicTrack</div>
            <div style={{ fontSize: '0.58rem', color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>Report Today. Better Tomorrow.</div>
          </div>
        </div>

        {/* Heading */}
        <div>
          {isLogin ? (
            <>
              <h2 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                Your City. Your Voice.<br />
                <span style={{ color: '#4ade80' }}>Your Impact.</span>
              </h2>
              <p style={{ fontSize: 'clamp(0.68rem, 1.1vw, 0.76rem)', color: 'rgba(255,255,255,0.62)', lineHeight: 1.6, maxWidth: 280 }}>
                Be part of a community that reports problems, supports local improvements and builds cleaner, safer neighborhoods.
              </p>
            </>
          ) : (
            <>
              <h2 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.4rem)', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                Join Your<br />
                <span style={{ color: '#4ade80' }}>Community</span>
              </h2>
              <p style={{ fontSize: 'clamp(0.68rem, 1.1vw, 0.76rem)', color: 'rgba(255,255,255,0.62)', lineHeight: 1.6, maxWidth: 280 }}>
                Create your account and become a part of positive change — for a cleaner, safer and smarter India.
              </p>
            </>
          )}
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {isLogin ? (
            <>
              <FeaturePill icon={AlertCircle} text="Report Civic Issues"       color="#E95532" />
              <FeaturePill icon={Users}       text="Support Your Community"    color="#1e4d7a" />
              <FeaturePill icon={CheckCircle} text="Track Real Solutions"      color="#07845F" />
            </>
          ) : (
            <>
              <FeaturePill icon={Shield} text="Make a Real Impact"             color="#E95532" />
              <FeaturePill icon={Users}  text="Be Part of Active Communities"  color="#1e4d7a" />
              <FeaturePill icon={Zap}   text="Build a Sustainable Future"      color="#07845F" />
            </>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-6px); }
        }
        @keyframes bouncePin {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
