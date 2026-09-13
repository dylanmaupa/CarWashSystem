import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Users, Settings, BarChart2,
  Bell, ChevronDown, Search, Droplets, LogOut, User,
  ClipboardList, Wrench, Car,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const managerNavItems: NavItem[] = [
  { to: '/manager', icon: <LayoutDashboard size={18} />, label: 'Overview' },
  { to: '/manager/requests', icon: <ClipboardList size={18} />, label: 'Booking Requests', badge: 3 },
  { to: '/manager/calendar', icon: <Calendar size={18} />, label: 'Calendar' },
  { to: '/manager/customers', icon: <Users size={18} />, label: 'Customers' },
  { to: '/manager/services', icon: <Wrench size={18} />, label: 'Services' },
  { to: '/manager/reports', icon: <BarChart2 size={18} />, label: 'Reports' },
  { to: '/manager/settings', icon: <Settings size={18} />, label: 'Settings' },
];

export const ManagerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : 'M';

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-brand">
            <div className="sidebar-logo-icon">
              <Droplets size={18} />
            </div>
            <div>
              <div className="sidebar-logo-text">
                Shine<span>Wash</span>
              </div>
              <div className="sidebar-logo-tagline">Manager Portal</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Management</div>
          {managerNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/manager'}
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
            >
              {item.icon}
              {item.label}
              {item.badge && (
                <span className="sidebar-badge">{item.badge}</span>
              )}
            </NavLink>
          ))}

          <div className="sidebar-section-label" style={{ marginTop: 16 }}>Account</div>
          <button className="sidebar-nav-item" onClick={handleLogout}>
            <LogOut size={18} />
            Sign Out
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-promo">
            <div style={{ marginBottom: 6 }}><Car size={20} color="var(--color-primary)" /></div>
            <div className="sidebar-promo-title">Cleaner Cars</div>
            <div className="sidebar-promo-text">Happier People. The ShineWash Way.</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="topbar">
          <div className="topbar-search">
            <Search size={16} className="topbar-search-icon" />
            <input
              className="topbar-search-input"
              placeholder="Search bookings, customers, vehicles..."
            />
          </div>

          <div className="topbar-actions">
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', background: 'var(--color-bg)',
              borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)',
              fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)',
            }}>
              <Calendar size={14} />
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>

            <button className="topbar-icon-btn">
              <Bell size={18} />
              <span className="topbar-notif-dot" />
            </button>

            <div
              className="topbar-user"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{ position: 'relative' }}
            >
              <div className="topbar-user-avatar" style={{ background: 'linear-gradient(135deg, #0F172A, #1D4ED8)' }}>
                {initials}
              </div>
              <div>
                <div className="topbar-user-name">
                  {user?.first_name} {user?.last_name}
                </div>
                <div className="topbar-user-role">Manager</div>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--color-text-subtle)' }} />

              {userMenuOpen && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0, background: 'white',
                  border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)', minWidth: 160, zIndex: 200, overflow: 'hidden',
                }}>
                  <NavLink to="/manager/settings" className="sidebar-nav-item" style={{ borderRadius: 0 }} onClick={() => setUserMenuOpen(false)}>
                    <User size={16} /> Profile
                  </NavLink>
                  <button className="sidebar-nav-item" style={{ borderRadius: 0, color: 'var(--color-danger)' }} onClick={handleLogout}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
