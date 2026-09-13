import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Car, Bell, HelpCircle,
  User, BookOpen, LogOut, ChevronDown, Search, Droplets, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}

const customerNavItems: NavItem[] = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/book', icon: <Droplets size={18} />, label: 'Book Service' },
  { to: '/bookings', icon: <BookOpen size={18} />, label: 'My Bookings' },
  { to: '/calendar', icon: <Calendar size={18} />, label: 'Calendar' },
  { to: '/vehicles', icon: <Car size={18} />, label: 'Vehicles' },
  { to: '/notifications', icon: <Bell size={18} />, label: 'Notifications', badge: 3 },
  { to: '/support', icon: <HelpCircle size={18} />, label: 'Support' },
  { to: '/account', icon: <User size={18} />, label: 'Account' },
];

export const CustomerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = user
    ? `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    : 'U';

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-brand">
            <div className="sidebar-logo-icon">
              <Droplets size={18} />
            </div>
            <div>
              <div className="sidebar-logo-text">
                Shine<span>Wash</span>
              </div>
              <div className="sidebar-logo-tagline">Clean Cars. Brighter Days.</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          <div className="sidebar-section-label">Menu</div>
          {customerNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
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

        {/* Footer Promo */}
        <div className="sidebar-footer">
          <div className="sidebar-promo">
            <div style={{ marginBottom: 6 }}><Sparkles size={20} color="var(--color-primary)" /></div>
            <div className="sidebar-promo-title">A cleaner car.</div>
            <div className="sidebar-promo-text">A brighter you. Good Cars. Happier People.</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-search">
            <Search size={16} className="topbar-search-icon" />
            <input
              className="topbar-search-input"
              placeholder="Search bookings, vehicles..."
            />
          </div>

          <div className="topbar-actions">
            <NavLink to="/notifications" className="topbar-icon-btn">
              <Bell size={18} />
              <span className="topbar-notif-dot" />
            </NavLink>

            <div
              className="topbar-user"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              style={{ position: 'relative' }}
            >
              <div className="topbar-user-avatar">{initials}</div>
              <div>
                <div className="topbar-user-name">
                  {user?.first_name} {user?.last_name}
                </div>
                <div className="topbar-user-role">Customer</div>
              </div>
              <ChevronDown size={14} style={{ color: 'var(--color-text-subtle)' }} />

              {userMenuOpen && (
                <div style={{
                  position: 'absolute', top: '110%', right: 0, background: 'white',
                  border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-md)', minWidth: 160, zIndex: 200, overflow: 'hidden',
                }}>
                  <NavLink to="/account" className="sidebar-nav-item" style={{ borderRadius: 0 }} onClick={() => setUserMenuOpen(false)}>
                    <User size={16} /> My Account
                  </NavLink>
                  <button className="sidebar-nav-item" style={{ borderRadius: 0, color: 'var(--color-danger)' }} onClick={handleLogout}>
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
