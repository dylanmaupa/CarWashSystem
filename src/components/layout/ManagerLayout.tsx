import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, Settings, BarChart2,
  Bell, ChevronDown, Search, Droplets, LogOut, User,
  ClipboardList, Wrench, Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem { to: string; icon: React.ReactNode; label: string; badge?: number; }

const managerNavItems: NavItem[] = [
  { to: '/manager',           icon: <LayoutDashboard size={17} />, label: 'Overview' },
  { to: '/manager/requests',  icon: <ClipboardList size={17} />,   label: 'Booking Requests', badge: 3 },
  { to: '/manager/calendar',  icon: <Calendar size={17} />,         label: 'Calendar' },
  { to: '/manager/customers', icon: <Users size={17} />,            label: 'Customers' },
  { to: '/manager/services',  icon: <Wrench size={17} />,           label: 'Services' },
  { to: '/manager/reports',   icon: <BarChart2 size={17} />,        label: 'Reports' },
  { to: '/manager/settings',  icon: <Settings size={17} />,         label: 'Settings' },
];

export const ManagerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => { await logout(); navigate('/login'); };
  const initials = user ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase() : 'M';

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#080808', fontFamily: "'Inter', -apple-system, sans-serif", overflow: 'hidden' }}>

      {/* Mobile Overlay */}
      <div 
        className={`sidebar-mobile-overlay ${sidebarOpen ? 'sidebar-open' : ''}`} 
        onClick={() => setSidebarOpen(false)} 
      />

      {/* ── SIDEBAR ── */}
      <aside className={sidebarOpen ? 'sidebar-open' : ''} style={{
        width: 230, flexShrink: 0, display: 'flex', flexDirection: 'column',
        background: '#080808', borderRight: '1px solid rgba(255,255,255,0.06)',
        zIndex: 300,
      }}>
        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Droplets size={16} color="#080808" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>ShineWash</div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: 1 }}>Manager Portal</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', padding: '0 12px', marginBottom: 8 }}>
            Management
          </p>
          {managerNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/manager'}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
                fontSize: 14, fontWeight: 500,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                transition: 'all 0.15s',
              })}
              onMouseEnter={e => {
                const el = e.currentTarget;
                if (!el.style.background.includes('0.08')) { el.style.color = 'rgba(255,255,255,0.8)'; el.style.background = 'rgba(255,255,255,0.04)'; }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                if (!el.style.background.includes('0.08')) { el.style.color = 'rgba(255,255,255,0.45)'; el.style.background = 'transparent'; }
              }}
            >
              {item.icon}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge ? (
                <span style={{ background: '#FBBF24', color: '#080808', fontSize: 10, fontWeight: 700, borderRadius: 20, padding: '2px 6px', minWidth: 18, textAlign: 'center' }}>
                  {item.badge}
                </span>
              ) : null}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px', borderRadius: 8, background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.35)', transition: 'all 0.15s' }}
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
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', height: 64, flexShrink: 0, background: 'rgba(8,8,8,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <button className="mobile-menu-btn" 
              style={{ display: 'none', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: 4, marginRight: 16 }}
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            {/* Search */}
            <div className="desktop-search" style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '8px 14px', flex: 1, maxWidth: 400 }}>
              <Search size={14} color="rgba(255,255,255,0.3)" />
              <input placeholder="Search bookings, customers, vehicles..." style={{ background: 'none', border: 'none', outline: 'none', fontSize: 14, color: '#fff', width: '100%' }} />
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>

            <div style={{ position: 'relative', cursor: 'pointer' }}>
              <Bell size={18} color="rgba(255,255,255,0.5)" />
              <div style={{ position: 'absolute', top: -2, right: -2, width: 7, height: 7, borderRadius: '50%', background: '#FBBF24', border: '1.5px solid #080808' }} />
            </div>

            <div onClick={() => setUserMenuOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', position: 'relative' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #0F172A, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>{initials}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{user?.first_name} {user?.last_name}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Manager</div>
              </div>
              <ChevronDown size={13} color="rgba(255,255,255,0.35)" />

              {userMenuOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 12px)', right: 0, background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, boxShadow: '0 16px 48px rgba(0,0,0,0.6)', minWidth: 180, overflow: 'hidden', zIndex: 300 }}>
                  <NavLink to="/manager/settings" onClick={() => setUserMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', fontSize: 14, color: 'rgba(255,255,255,0.8)', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <User size={15} /> Profile
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

        <main style={{ flex: 1, overflowY: 'auto', background: '#080808' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
