import React, { useState } from 'react';
import { User, Clock, Bell, RefreshCw, Shield, Building2, CreditCard, Check } from 'lucide-react';
import { ManagerLayout } from '../../components/layout/ManagerLayout';

const SETTINGS_TABS = ['Business Info', 'Operating Hours', 'Booking Settings', 'Notifications', 'Manager Account'];

export const ManagerSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Business Info');
  const [saved, setSaved] = useState(false);

  const [businessInfo, setBusinessInfo] = useState({
    name: 'ShineWash Car Wash & Detailing', address: '12 Klipfontein Rd, Johannesburg, 2091',
    phone: '+27 11 123 4567', email: 'support@shinewash.co.za', website: 'www.shinewash.co.za',
    operating_since: '2018',
  });

  const [hours, setHours] = useState({
    monday: { open: '07:00', close: '18:00', is_open: true },
    tuesday: { open: '07:00', close: '18:00', is_open: true },
    wednesday: { open: '07:00', close: '18:00', is_open: true },
    thursday: { open: '07:00', close: '18:00', is_open: true },
    friday: { open: '07:00', close: '17:00', is_open: true },
    saturday: { open: '08:00', close: '14:00', is_open: true },
    sunday: { open: '', close: '', is_open: false },
  });

  const [bookingSettings, setBookingSettings] = useState({
    advance_days: 30, min_notice_hours: 2, max_concurrent: 2,
    require_approval: true, allow_cancellations: true, cancellation_notice_hours: 24,
  });

  const [notifSettings, setNotifSettings] = useState({
    email_on_new_request: true, sms_on_new_request: false,
    email_on_cancellation: true, send_reminders: true, reminder_hours: 24,
  });

  const [managerProfile, setManagerProfile] = useState({
    first_name: 'Mike', last_name: 'Chen', email: 'mike.chen@shinewash.com', phone: '+27 82 123 4567',
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const dayLabels: Record<string, string> = { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' };

  return (
    <ManagerLayout>
      <div className="page-content">
        <div style={{ marginBottom: 28 }}>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your business settings, hours, and preferences.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
          {/* Settings Navigation */}
          <div>
            <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              {[
                { key: 'Business Info', icon: <Building2 size={16} /> },
                { key: 'Operating Hours', icon: <Clock size={16} /> },
                { key: 'Booking Settings', icon: <RefreshCw size={16} /> },
                { key: 'Notifications', icon: <Bell size={16} /> },
                { key: 'Manager Account', icon: <User size={16} /> },
              ].map(tab => (
                <button key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`sidebar-nav-item ${activeTab === tab.key ? 'active' : ''}`}
                  style={{ borderRadius: 0, width: '100%', justifyContent: 'flex-start', padding: '12px 16px', borderBottom: '1px solid var(--color-border-light)' }}>
                  {tab.icon} {tab.key}
                </button>
              ))}
            </div>
          </div>

          {/* Settings Panel */}
          <div className="card">
            {/* Business Info */}
            {activeTab === 'Business Info' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <Building2 size={20} style={{ color: 'var(--color-primary)' }} />
                  <h2 style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 18 }}>Business Information</h2>
                </div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Business Name</label>
                  <input className="form-input" value={businessInfo.name} onChange={e => setBusinessInfo({ ...businessInfo, name: e.target.value })} />
                </div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Address</label>
                  <input className="form-input" value={businessInfo.address} onChange={e => setBusinessInfo({ ...businessInfo, address: e.target.value })} />
                </div>
                <div className="form-grid-2">
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={businessInfo.phone} onChange={e => setBusinessInfo({ ...businessInfo, phone: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ marginBottom: 16 }}>
                    <label className="form-label">Email</label>
                    <input className="form-input" value={businessInfo.email} onChange={e => setBusinessInfo({ ...businessInfo, email: e.target.value })} />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Website</label>
                  <input className="form-input" value={businessInfo.website} onChange={e => setBusinessInfo({ ...businessInfo, website: e.target.value })} />
                </div>

                {/* No payment note */}
                <div style={{ background: 'var(--color-success-light)', border: '1px solid var(--color-success-mid)', borderRadius: 8, padding: '12px 14px', fontSize: 12, color: '#134E4A', marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CreditCard size={16} /> <span><strong>Payment model:</strong> All payments are made on-site at the car wash. No online payment processor is configured for this business.</span>
                </div>
              </div>
            )}

            {/* Operating Hours */}
            {activeTab === 'Operating Hours' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <Clock size={20} style={{ color: 'var(--color-primary)' }} />
                  <h2 style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 18 }}>Operating Hours</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.entries(hours).map(([day, config]) => (
                    <div key={day} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 14px', background: 'var(--color-bg)', borderRadius: 8 }}>
                      <label className="toggle-switch">
                        <input type="checkbox" checked={config.is_open}
                          onChange={e => setHours({ ...hours, [day]: { ...config, is_open: e.target.checked } })} />
                        <span className="toggle-slider" />
                      </label>
                      <div style={{ width: 100, fontWeight: 600, color: config.is_open ? 'var(--color-navy)' : 'var(--color-text-subtle)', fontSize: 14 }}>
                        {dayLabels[day]}
                      </div>
                      {config.is_open ? (
                        <>
                          <input type="time" className="form-input" style={{ width: 110, padding: '6px 10px' }}
                            value={config.open} onChange={e => setHours({ ...hours, [day]: { ...config, open: e.target.value } })} />
                          <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>to</span>
                          <input type="time" className="form-input" style={{ width: 110, padding: '6px 10px' }}
                            value={config.close} onChange={e => setHours({ ...hours, [day]: { ...config, close: e.target.value } })} />
                        </>
                      ) : (
                        <span className="badge badge-cancelled" style={{ marginLeft: 8 }}>
                          <span className="badge-dot" /> Closed
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Settings */}
            {activeTab === 'Booking Settings' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <RefreshCw size={20} style={{ color: 'var(--color-primary)' }} />
                  <h2 style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 18 }}>Booking Settings</h2>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {[
                    { key: 'advance_days', label: 'Booking window (days in advance)', type: 'number', max: 90 },
                    { key: 'min_notice_hours', label: 'Minimum notice required (hours)', type: 'number', max: 72 },
                    { key: 'max_concurrent', label: 'Max concurrent bookings per slot', type: 'number', max: 5 },
                    { key: 'cancellation_notice_hours', label: 'Cancellation notice required (hours)', type: 'number', max: 72 },
                  ].map(field => (
                    <div key={field.key} className="form-group">
                      <label className="form-label">{field.label}</label>
                      <input className="form-input" type="number" max={field.max}
                        value={bookingSettings[field.key as keyof typeof bookingSettings] as number}
                        onChange={e => setBookingSettings({ ...bookingSettings, [field.key]: parseInt(e.target.value) })} />
                    </div>
                  ))}
                  {[
                    { key: 'require_approval', label: 'Require manager approval for all bookings', desc: 'Customers\' bookings will always be in "Pending" state until approved.' },
                    { key: 'allow_cancellations', label: 'Allow customers to cancel bookings', desc: 'Customers can cancel their pending or approved bookings.' },
                  ].map(toggle => (
                    <div key={toggle.key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, padding: '16px', background: 'var(--color-bg)', borderRadius: 8 }}>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-navy)', marginBottom: 3 }}>{toggle.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{toggle.desc}</div>
                      </div>
                      <label className="toggle-switch" style={{ flexShrink: 0 }}>
                        <input type="checkbox" checked={bookingSettings[toggle.key as keyof typeof bookingSettings] as boolean}
                          onChange={e => setBookingSettings({ ...bookingSettings, [toggle.key]: e.target.checked })} />
                        <span className="toggle-slider" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'Notifications' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <Bell size={20} style={{ color: 'var(--color-primary)' }} />
                  <h2 style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 18 }}>Notification Settings</h2>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
                  Configure how and when you receive alerts about bookings.
                </p>
                {[
                  { key: 'email_on_new_request', label: 'Email for new booking request', desc: 'Receive an email when a customer submits a booking.' },
                  { key: 'sms_on_new_request', label: 'SMS for new booking request', desc: 'Receive a text message for urgent new booking requests.' },
                  { key: 'email_on_cancellation', label: 'Email for booking cancellations', desc: 'Get notified when a customer cancels their booking.' },
                  { key: 'send_reminders', label: 'Send appointment reminders to customers', desc: 'Automatically notify customers 24–48 hours before their appointment.' },
                ].map(pref => (
                  <div key={pref.key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 14, padding: '14px 16px', background: 'var(--color-bg)', borderRadius: 8, marginBottom: 10 }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-navy)', marginBottom: 2 }}>{pref.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{pref.desc}</div>
                    </div>
                    <label className="toggle-switch" style={{ flexShrink: 0 }}>
                      <input type="checkbox" checked={notifSettings[pref.key as keyof typeof notifSettings] as boolean}
                        onChange={e => setNotifSettings({ ...notifSettings, [pref.key]: e.target.checked })} />
                      <span className="toggle-slider" />
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* Manager Account */}
            {activeTab === 'Manager Account' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <User size={20} style={{ color: 'var(--color-primary)' }} />
                  <h2 style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 18 }}>Manager Account</h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, padding: '16px', background: 'var(--color-bg)', borderRadius: 12 }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #0F172A, #1D4ED8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 22 }}>
                    {managerProfile.first_name[0]}{managerProfile.last_name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-navy)' }}>{managerProfile.first_name} {managerProfile.last_name}</div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>Manager / Administrator</div>
                    <span className="badge badge-approved" style={{ marginTop: 6 }}><span className="badge-dot" /> Active</span>
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginBottom: 14 }}>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input className="form-input" value={managerProfile.first_name} onChange={e => setManagerProfile({ ...managerProfile, first_name: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input className="form-input" value={managerProfile.last_name} onChange={e => setManagerProfile({ ...managerProfile, last_name: e.target.value })} />
                  </div>
                </div>
                <div className="form-grid-2" style={{ marginBottom: 20 }}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" value={managerProfile.email} onChange={e => setManagerProfile({ ...managerProfile, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input className="form-input" value={managerProfile.phone} onChange={e => setManagerProfile({ ...managerProfile, phone: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, padding: '14px 16px', background: 'var(--color-bg)', borderRadius: 10, alignItems: 'center' }}>
                  <Shield size={20} style={{ color: 'var(--color-primary)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-navy)', marginBottom: 2 }}>Password</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Last changed 30 days ago</div>
                  </div>
                  <button className="btn btn-outline btn-sm">Change Password</button>
                </div>
              </div>
            )}

            {/* Save Bar */}
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--color-border)', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline">Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {saved ? <><Check size={16} /> Settings Saved!</> : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
};
