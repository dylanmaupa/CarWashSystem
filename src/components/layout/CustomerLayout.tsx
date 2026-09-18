import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, BookOpen, LogOut,
  Droplets, Bell, ChevronDown, User, Search,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem { to: string; icon: React.ReactNode; label: string; }

const navItems: NavItem[] = [
  { to: '/dashboard', icon: <LayoutDashboard size={17} />, label: 'Dashboard' },
  { to: '/book',      icon: <Droplets size={17} />,         label: 'Book Service' },
  { to: '/bookings',  icon: <BookOpen size={17} />,         label: 'My Bookings' },
  { to: '/calendar',  icon: <Calendar size={17} />,         label: 'Calendar' },
];

export const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate('/login'); };
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : 'U';

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#080808', fontFamily: "'Inter', -apple-system, sans-serif", overflow: 'hidden' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: 230, flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: '#080808',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        padding: '0',
        zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, background: '#fff', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Droplets size={16} color="#080808" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>ShineWash</span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0 12px', marginBottom: 8 }}>
            Menu
          </p>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
                fontSize: 14, fontWeight: 500,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                transition: 'all 0.15s',
                letterSpacing: '-0.01em',
              })}
              onMouseEnter={e => {
                const el = e.currentTarget;
                if (!el.classList.contains('active')) { el.style.color = 'rgba(255,255,255,0.8)'; el.style.background = 'rgba(255,255,255,0.04)'; }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                if (!el.classList.contains('active')) { el.style.color = 'rgba(255,255,255,0.45)'; el.style.background = 'transparent'; }
              }}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer — Sign Out */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              width: '100%', padding: '10px 12px', borderRadius: 8,
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.35)',
              transition: 'all 0.15s', letterSpacing: '-0.01em',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#ff6b6b'; e.currentTarget.style.background = 'rgba(255,107,107,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'transparent'; }}
          >
            <LogOut size={17} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* TOPBAR */}
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', height: 64, flexShrink: 0,
          background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 14px', flex: 1, maxWidth: 340 }}>
            <Search size={14} color="rgba(255,255,255,0.3)" />
            <input
              placeholder="Search bookings, vehicles..."
              style={{ background: 'none', border: 'none', outline: 'none', fontSize: 14, color: '#fff', width: '100%' }}
            />
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Bell */}
            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={18} color="rgba(255,255,255,0.5)" />
              <div style={{ position: 'absolute', top: -2, right: -2, width: 7, height: 7, borderRadius: '50%', background: '#2563EB', border: '1.5px solid #080808' }} />
            </div>

            {/* User */}
            <div
              onClick={() => setUserMenuOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', position: 'relative' }}
            >
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563EB, #0D9488)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>{initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', lineHeight: 1.2 }}>{user?.first_name} {user?.last_name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1 }}>Customer</div>
              </div>
              <ChevronDown size={13} color="rgba(255,255,255,0.35)" />

              {/* Dropdown */}
              {userMenuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 12px)', right: 0,
                  background: '#111', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
                  minWidth: 180, overflow: 'hidden', zIndex: 300,
                }}>
                  <NavLink to="/account" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 14, color: 'rgba(255,255,255,0.8)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <User size={15} /> My Account
                  </NavLink>
                  <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', width: '100%', fontSize: 14, color: '#ff6b6b', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.08)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main style={{ flex: 1, overflowY: 'auto', background: '#080808' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
