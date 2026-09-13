import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Bell, Calendar, Car, Shield, Camera, Sparkles, Check } from 'lucide-react';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import { useAuth } from '../../context/AuthContext';

export const Account: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    first_name: user?.first_name || 'Alex',
    last_name: user?.last_name || 'Carter',
    email: user?.email || 'alex.carter@email.com',
    phone: user?.phone || '(555) 123-4567',
  });
  const [notifPrefs, setNotifPrefs] = useState({
    email_reminders: true, sms_reminders: true,
    booking_approvals: true, promotions: false,
  });
  const [calPrefs, setCalPrefs] = useState({ auto_sync: true });
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const initials = `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();

  return (
    <CustomerLayout>
      <div className="page-content">
        <div style={{
          background: 'linear-gradient(135deg, var(--color-surface) 60%, var(--color-primary-light) 100%)',
          border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)',
          padding: '28px 40px', marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative', overflow: 'hidden',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>ACCOUNT SETTINGS</div>
            <h1 className="page-title">Manage Your Account</h1>
            <p className="page-subtitle">Keep your information up to date for a smoother ShineWash experience.</p>
          </div>
          <div style={{
            width: 200, height: 110, background: 'linear-gradient(135deg, #DBEAFE, #EFF6FF)',
            borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--color-primary)', gap: 10,
          }}>
            <Car size={32} />
            <Sparkles size={24} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
          {/* Left: Main Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Profile */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <User size={18} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>Profile Information</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>This information appears on your account and bookings.</div>
                </div>
              </div>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: 72, height: 72, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--color-primary), #7C3AED)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', fontWeight: 800, fontSize: 24,
                  }}>
                    {initials}
                  </div>
                  <button style={{
                    position: 'absolute', bottom: 0, right: 0, width: 26, height: 26,
                    background: 'var(--color-primary)', border: '2px solid white',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', cursor: 'pointer',
                  }}>
                    <Camera size={12} />
                  </button>
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 16 }}>{profile.first_name} {profile.last_name}</div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>{profile.email}</div>
                  <button style={{ fontSize: 12, color: 'var(--color-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', marginTop: 2 }}>
                    Change Photo
                  </button>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" value={profile.first_name}
                    onChange={e => setProfile({ ...profile, first_name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" value={profile.last_name}
                    onChange={e => setProfile({ ...profile, last_name: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <Mail size={18} style={{ color: 'var(--color-primary)' }} />
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>Contact Details</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Used for booking updates and important notices.</div>
                </div>
              </div>
              <div className="form-grid-2">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input className="form-input" type="email" value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input className="form-input" type="tel" value={profile.phone}
                    onChange={e => setProfile({ ...profile, phone: e.target.value })} />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <Lock size={18} style={{ color: 'var(--color-primary)' }} />
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>Password & Security</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Keep your account secure with a strong password.</div>
                  </div>
                </div>
                <button className="btn btn-outline">Update Password</button>
              </div>

              <hr className="divider" />

              {[
                { label: 'Password', value: '••••••••••', note: 'Last changed Jan 14, 2024' },
                { label: 'Two-Factor Authentication', value: 'Not enabled', note: '' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text)' }}>{item.label}</div>
                    {item.note && <div style={{ fontSize: 12, color: 'var(--color-text-subtle)' }}>{item.note}</div>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>{item.value}</span>
                    <button style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Enable →</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 88 }}>
            {/* Notification Preferences */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Bell size={16} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>Notification Preferences</span>
              </div>
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 16 }}>
                Choose how you'd like to receive updates.
              </p>
              {[
                { key: 'email_reminders', label: 'Email Reminders', desc: 'Booking confirmations and reminders.' },
                { key: 'sms_reminders', label: 'SMS Reminders', desc: 'Text messages about appointments.' },
                { key: 'booking_approvals', label: 'Booking Approvals', desc: 'Get notified when bookings are approved.' },
                { key: 'promotions', label: 'Promotions', desc: 'Special offers and discounts.' },
              ].map(pref => (
                <div key={pref.key} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-navy)', marginBottom: 1 }}>{pref.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{pref.desc}</div>
                  </div>
                  <label className="toggle-switch" style={{ flexShrink: 0 }}>
                    <input type="checkbox"
                      checked={notifPrefs[pref.key as keyof typeof notifPrefs]}
                      onChange={e => setNotifPrefs({ ...notifPrefs, [pref.key]: e.target.checked })} />
                    <span className="toggle-slider" />
                  </label>
                </div>
              ))}
            </div>

            {/* Calendar Sync */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <Calendar size={16} style={{ color: 'var(--color-primary)' }} />
                <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>Calendar Preferences</span>
              </div>
              {[
                { label: 'Google Calendar', status: 'Not connected' },
                { label: 'Outlook Calendar', status: 'Not connected' },
                { label: 'Apple Calendar', status: 'Not connected' },
              ].map(cal => (
                <div key={cal.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Calendar size={16} color="var(--color-primary)" />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text)' }}>{cal.label}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>{cal.status}</div>
                    </div>
                  </div>
                  <button className="btn btn-outline btn-sm">Connect</button>
                </div>
              ))}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-navy)' }}>Sync bookings to calendar</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Auto-add confirmed bookings.</div>
                </div>
                <label className="toggle-switch">
                  <input type="checkbox" checked={calPrefs.auto_sync} onChange={e => setCalPrefs({ auto_sync: e.target.checked })} />
                  <span className="toggle-slider" />
                </label>
              </div>
            </div>

            {/* Save Button */}
            <button className="btn btn-primary btn-lg btn-full" onClick={handleSave} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {saved ? <><Check size={16} /> Changes Saved!</> : 'Save Changes'}
            </button>
            <button className="btn btn-outline btn-full">Cancel</button>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
