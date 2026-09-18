import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Droplets, Menu, X } from 'lucide-react';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/welcome' },
    { label: 'Services', path: '/services' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'About', path: '/about' },
  ];

  return (
    <div style={{
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: '#080808', color: '#fff', overflowX: 'hidden', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* ══════════════ NAVBAR ══════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 clamp(24px, 5vw, 80px)', height: 68,
        background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Logo */}
        <Link to="/welcome" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, background: '#fff', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Droplets size={16} color="#080808" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
            ShineWash
          </span>
        </Link>

        {/* Center links (Desktop) */}
        <div className="desktop-nav-links" style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
          {navLinks.map(item => (
            <Link key={item.label} to={item.path} style={{
              fontSize: 14, textDecoration: 'none',
              fontWeight: 500, transition: 'color 0.2s',
              color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.55)',
            }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.55)')}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* CTA (Desktop) */}
          <Link to="/register" className="desktop-nav-links" style={{
            padding: '10px 22px', fontSize: 14, fontWeight: 600,
            color: '#fff', textDecoration: 'none', borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.25)',
            transition: 'all 0.2s',
            background: 'transparent',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#080808'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
          >
            Get a quote
          </Link>

          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-btn" 
            style={{ display: 'none', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 4 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: 68, left: 0, right: 0, background: '#080808', zIndex: 199,
          borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px 32px',
          display: 'flex', flexDirection: 'column', gap: 24,
          animation: 'fadeIn 0.2s ease',
        }}>
          {navLinks.map(item => (
            <Link key={item.label} to={item.path} 
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: 18, textDecoration: 'none', fontWeight: 600,
                color: location.pathname === item.path ? '#fff' : 'rgba(255,255,255,0.6)',
              }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ height: 1, background: 'rgba(255,255,255,0.1)' }} />
          <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: 16, textDecoration: 'none', fontWeight: 600, color: '#fff' }}>
            Sign In
          </Link>
          <Link to="/register" onClick={() => setMobileMenuOpen(false)} style={{
            padding: '12px', fontSize: 16, fontWeight: 600, textAlign: 'center',
            color: '#080808', textDecoration: 'none', borderRadius: 8, background: '#fff',
          }}>
            Get a quote
          </Link>
        </div>
      )}

      {/* ══════════════ CONTENT ══════════════ */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '32px clamp(24px,5vw,80px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, background: '#080808',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: '#fff', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Droplets size={13} color="#080808" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>ShineWash</span>
        </div>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>© {new Date().getFullYear()} ShineWash · Clean Cars. Brighter Days.</p>
        <div style={{ display: 'flex', gap: 24 }}>
          <Link to="/login"    style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Sign In</Link>
          <Link to="/register" style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>Register</Link>
        </div>
      </footer>
    </div>
  );
};
