import React, { useState } from 'react';
import { Bell, CheckCircle, Clock, AlertCircle, Calendar, Tag, Settings } from 'lucide-react';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import { format } from 'date-fns';

type NotifCategory = 'all' | 'unread' | 'booking' | 'reminder' | 'promotion';

interface Notif {
  id: string; type: string; title: string; message: string;
  is_read: boolean; created_at: string; category: 'booking' | 'reminder' | 'promotion';
}

const MOCK_NOTIFS: Notif[] = [
  { id: 'n1', type: 'booking_submitted', title: 'Booking Request Submitted', message: 'Your booking for Toyota Fortuner (ABC 1234) — Standard Car Wash on Sep 18 at 9:00 AM has been sent to the manager for approval.', is_read: false, created_at: new Date(Date.now() - 3600000).toISOString(), category: 'booking' },
  { id: 'n2', type: 'booking_approved', title: 'Booking Approved', message: 'Great news! Your Full Detail Package for BMW 3 Series (XYZ 5678) on Sep 20 at 10:00 AM has been approved. See you then!', is_read: false, created_at: new Date(Date.now() - 86400000).toISOString(), category: 'booking' },
  { id: 'n3', type: 'appointment_reminder', title: 'Appointment Tomorrow', message: 'Reminder: You have a Car Wash appointment tomorrow at 9:00 AM. Please arrive 5 minutes early.', is_read: false, created_at: new Date(Date.now() - 2 * 86400000).toISOString(), category: 'reminder' },
  { id: 'n4', type: 'booking_completed', title: 'Service Completed', message: 'Your Premium Car Wash for Ford Ranger (DEF 9012) has been completed. Thank you for choosing ShineWash!', is_read: true, created_at: new Date(Date.now() - 7 * 86400000).toISOString(), category: 'booking' },
  { id: 'n5', type: 'promotion', title: 'Weekend Special — 20% Off Detailing', message: 'Book a Full Detail Package this weekend and get 20% off. Limited slots available. Book now to secure your spot!', is_read: true, created_at: new Date(Date.now() - 3 * 86400000).toISOString(), category: 'promotion' },
];

const notifIcon = (type: string) => {
  if (type.includes('approved') || type.includes('completed')) return { icon: <CheckCircle size={18} />, bg: 'var(--color-success-light)', color: 'var(--color-success)' };
  if (type.includes('declined') || type.includes('cancelled')) return { icon: <AlertCircle size={18} />, bg: 'var(--color-danger-light)', color: 'var(--color-danger)' };
  if (type.includes('reminder')) return { icon: <Clock size={18} />, bg: 'var(--color-warning-light)', color: 'var(--color-warning)' };
  if (type.includes('promotion')) return { icon: <Tag size={18} />, bg: '#F5F3FF', color: '#7C3AED' };
  return { icon: <Bell size={18} />, bg: 'var(--color-primary-light)', color: 'var(--color-primary)' };
};

const TABS: { key: NotifCategory; label: string }[] = [
  { key: 'all', label: 'All' }, { key: 'unread', label: 'Unread' },
  { key: 'booking', label: 'Booking Updates' }, { key: 'reminder', label: 'Reminders' },
  { key: 'promotion', label: 'Promotions' },
];

export const Notifications: React.FC = () => {
  const [notifs, setNotifs] = useState<Notif[]>(MOCK_NOTIFS);
  const [activeTab, setActiveTab] = useState<NotifCategory>('all');

  const filtered = notifs.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.is_read;
    return n.category === activeTab;
  });

  const unreadCount = notifs.filter(n => !n.is_read).length;

  const markRead = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));

  const [prefs, setPrefs] = useState({ booking: true, reminders: true, promotions: false, system: true });

  return (
    <CustomerLayout>
      <div className="page-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 className="page-title">Notifications</h1>
            <p className="page-subtitle">
              {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.` : 'You\'re all caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button className="btn btn-outline" onClick={markAllRead}>
              <CheckCircle size={15} /> Mark all as read
            </button>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24 }}>
          {/* Notifications List */}
          <div>
            <div className="filter-tabs" style={{ marginBottom: 20 }}>
              {TABS.map(t => {
                const cnt = t.key === 'unread' ? unreadCount : t.key === 'all' ? notifs.length : notifs.filter(n => n.category === t.key).length;
                return (
                  <button key={t.key} className={`filter-tab ${activeTab === t.key ? 'active' : ''}`} onClick={() => setActiveTab(t.key)}>
                    {t.label}
                    {cnt > 0 && <span className="tab-count">{cnt}</span>}
                  </button>
                );
              })}
            </div>

            {filtered.length === 0 ? (
              <div className="card">
                <div className="empty-state">
                  <div className="empty-state-icon"><Bell size={26} /></div>
                  <div className="empty-state-title">No notifications</div>
                  <div className="empty-state-text">Nothing here yet — check back later.</div>
                </div>
              </div>
            ) : (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {filtered.map((notif, i) => {
                  const { icon, bg, color } = notifIcon(notif.type);
                  return (
                    <div key={notif.id}
                      className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
                      onClick={() => markRead(notif.id)}
                      style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--color-border-light)' : 'none' }}>
                      <div className="notification-icon-wrap" style={{ background: bg, color }}>
                        {icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ fontWeight: !notif.is_read ? 700 : 600, color: 'var(--color-navy)', fontSize: 14 }}>
                            {notif.title}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--color-text-subtle)', whiteSpace: 'nowrap', marginLeft: 12 }}>
                            {format(new Date(notif.created_at), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.4, margin: 0 }}>
                          {notif.message}
                        </p>
                      </div>
                      {!notif.is_read && (
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 6 }} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Preferences */}
          <div style={{ position: 'sticky', top: 88 }}>
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                <Settings size={16} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 15 }}>Notification Preferences</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 18 }}>
                Choose how you'd like to receive updates.
              </p>

              {[
                { key: 'booking', label: 'Booking Updates', desc: 'Approvals, declines, and status changes.' },
                { key: 'reminders', label: 'Appointment Reminders', desc: 'Reminders before your scheduled service.' },
                { key: 'promotions', label: 'Promotions', desc: 'Special offers and seasonal deals.' },
                { key: 'system', label: 'System Updates', desc: 'Platform news and account updates.' },
              ].map(pref => (
                <div key={pref.key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 13, marginBottom: 2 }}>{pref.label}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{pref.desc}</div>
                  </div>
                  <label className="toggle-switch" style={{ flexShrink: 0 }}>
                    <input type="checkbox"
                      checked={prefs[pref.key as keyof typeof prefs]}
                      onChange={e => setPrefs({ ...prefs, [pref.key]: e.target.checked })} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
