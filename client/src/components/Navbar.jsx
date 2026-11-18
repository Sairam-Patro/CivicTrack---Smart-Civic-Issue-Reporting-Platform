import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Building2, Leaf, User, LogOut, FileText, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Report Issue', to: '/report-issue' },
  { label: 'Map', to: '/map' },
  { label: 'About', to: '/about' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Contact', to: '/contact' },
];

/** Returns initials from a name string */
function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() ?? '')
    .join('');
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuth();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function onClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/issues?q=${encodeURIComponent(searchQuery.trim())}`);
  }

  function handleLogout() {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  }

  const displayName = user?.name || user?.fullName || user?.username || 'User';
  const initials = getInitials(displayName);

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e9edf2',
      position: 'sticky', top: 0, zIndex: 1000,
      boxShadow: '0 1px 8px rgba(16,37,68,0.07)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', height: '68px', gap: '1.25rem' }}>

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ position: 'relative', width: '38px', height: '38px' }}>
            <Building2 size={28} strokeWidth={1.8} style={{ color: '#07845F', position: 'absolute', top: 0, left: 0 }} />
            <Leaf size={14} style={{ color: '#07845F', position: 'absolute', bottom: 0, right: 0, fill: '#07845F' }} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem', color: '#102544', lineHeight: 1.1 }}>CivicTrack</div>
            <div style={{ fontSize: '0.62rem', color: '#5a6a7e', fontWeight: 500 }}>Report Today. Better Tomorrow.</div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'flex', gap: '0.125rem', marginLeft: '0.5rem' }} className="desktop-nav">
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              style={({ isActive }) => ({
                padding: '0.4rem 0.75rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: isActive ? '#E95532' : '#102544',
                textDecoration: 'none',
                borderRadius: '6px',
                borderBottom: isActive ? '2px solid #E95532' : '2px solid transparent',
                transition: 'color 0.15s',
                whiteSpace: 'nowrap',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: '#f4f6f8', borderRadius: '8px', padding: '0.4rem 0.75rem',
          flex: 1, maxWidth: '280px', marginLeft: 'auto'
        }} className="desktop-nav">
          <Search size={15} style={{ color: '#5a6a7e', flexShrink: 0 }} />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search issues, locations..."
            style={{
              border: 'none', background: 'transparent', outline: 'none',
              fontSize: '0.84rem', color: '#102544', width: '100%',
              fontFamily: 'Inter, sans-serif'
            }}
          />
        </form>

        {/* Auth Section */}
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, alignItems: 'center' }} className="desktop-nav">
          {isLoggedIn ? (
            /* ── User Avatar + Dropdown ── */
            <div ref={dropdownRef} style={{ position: 'relative' }}>
              <button
                id="user-menu-btn"
                onClick={() => setDropdownOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: 'none', border: '1.5px solid #e2e8f0',
                  borderRadius: '50px', padding: '0.3rem 0.75rem 0.3rem 0.3rem',
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: dropdownOpen ? '0 0 0 3px rgba(7,132,95,0.12)' : 'none',
                  borderColor: dropdownOpen ? '#07845F' : '#e2e8f0',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#07845F'; }}
                onMouseLeave={e => { if (!dropdownOpen) e.currentTarget.style.borderColor = '#e2e8f0'; }}
              >
                {/* Avatar circle with initials */}
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #07845F, #0da077)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: 700, color: '#fff',
                  flexShrink: 0, letterSpacing: '0.05em',
                }}>
                  {initials || <User size={16} color="#fff" />}
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#102544', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {displayName}
                </span>
                <ChevronDown size={14} style={{ color: '#5a6a7e', transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                  background: '#fff', borderRadius: '14px',
                  boxShadow: '0 8px 32px rgba(16,37,68,0.14), 0 1px 4px rgba(16,37,68,0.06)',
                  border: '1px solid #e9edf2',
                  minWidth: 210, overflow: 'hidden',
                  animation: 'dropdownFade 0.15s ease',
                  zIndex: 100,
                }}>
                  {/* User info header */}
                  <div style={{
                    padding: '1rem 1.1rem 0.75rem',
                    borderBottom: '1px solid #f0f2f5',
                    background: 'linear-gradient(135deg, #f0fdf8, #f8fffe)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: 'linear-gradient(135deg, #07845F, #0da077)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.85rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                      }}>
                        {initials || <User size={18} color="#fff" />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#102544', lineHeight: 1.2 }}>
                          {displayName}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#5a6a7e', marginTop: '0.15rem' }}>
                          {user?.email || user?.phone || 'CivicTrack Member'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div style={{ padding: '0.4rem 0' }}>
                    <Link
                      to="/profile"
                      id="dropdown-my-profile"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.65rem',
                        padding: '0.65rem 1.1rem',
                        textDecoration: 'none', color: '#102544',
                        fontSize: '0.875rem', fontWeight: 500,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f4f6f8'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: '8px', background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={15} color="#3b82f6" />
                      </div>
                      My Profile
                    </Link>

                    <Link
                      to="/my-issues"
                      id="dropdown-my-issues"
                      onClick={() => setDropdownOpen(false)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.65rem',
                        padding: '0.65rem 1.1rem',
                        textDecoration: 'none', color: '#102544',
                        fontSize: '0.875rem', fontWeight: 500,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f4f6f8'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: '8px', background: '#f0fdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={15} color="#07845F" />
                      </div>
                      My Issues
                    </Link>

                    <div style={{ height: '1px', background: '#f0f2f5', margin: '0.25rem 0' }} />

                    <button
                      id="dropdown-logout"
                      onClick={handleLogout}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.65rem',
                        padding: '0.65rem 1.1rem',
                        background: 'none', border: 'none', width: '100%', textAlign: 'left',
                        color: '#dc2626', fontSize: '0.875rem', fontWeight: 500,
                        cursor: 'pointer', transition: 'background 0.15s',
                        fontFamily: 'Inter, sans-serif',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: 32, height: 32, borderRadius: '8px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LogOut size={15} color="#dc2626" />
                      </div>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Guest: Login + Sign Up + Admin ── */
            <>
              <Link
                to="/admin/login"
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: '#07845F',
                  border: '1.5px solid #07845F',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#07845F'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#07845F'; }}
              >
                <span>Admin Login 🛡️</span>
              </Link>
              <Link to="/login" className="btn btn-outline" style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem' }}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.875rem' }}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#102544', marginLeft: 'auto' }}
          className="hamburger"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: '#fff', borderTop: '1px solid #e9edf2',
          padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'
        }}>
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '0.75rem 0.5rem',
                fontSize: '1rem', fontWeight: 600,
                color: isActive ? '#E95532' : '#102544',
                textDecoration: 'none',
                borderBottom: '1px solid #f0f2f5'
              })}
            >
              {link.label}
            </NavLink>
          ))}
          <form onSubmit={(e) => { handleSearch(e); setMenuOpen(false); }} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search issues..."
              style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.6rem 0.75rem', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', outline: 'none' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1rem' }}>Go</button>
          </form>

          {/* Mobile Auth */}
          {isLoggedIn ? (
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {/* User info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.75rem', background: '#f0fdf8', borderRadius: '10px' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #07845F, #0da077)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700, color: '#fff', flexShrink: 0,
                }}>
                  {initials || <User size={16} color="#fff" />}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#102544' }}>{displayName}</div>
                  <div style={{ fontSize: '0.72rem', color: '#5a6a7e' }}>{user?.email || user?.phone || ''}</div>
                </div>
              </div>
              <Link to="/profile" className="btn btn-outline" style={{ justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>My Profile</Link>
              <Link to="/my-issues" className="btn btn-outline" style={{ justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>My Issues</Link>
              <button onClick={handleLogout} className="btn" style={{ justifyContent: 'center', background: '#fef2f2', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: '8px', padding: '0.5rem 1rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontSize: '0.875rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Link to="/login" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 1024px) { .desktop-nav { display: none !important; } .hamburger { display: flex !important; } }
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
