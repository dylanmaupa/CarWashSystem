import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, CheckCircle, Clock, Car, Bell, ArrowRight,
  Droplets, Plus, ChevronRight, MapPin, Star, Sparkles, CreditCard,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMockBookings } from '../../hooks/useBookings';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import { format } from 'date-fns';

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, string> = {
    pending: 'badge badge-pending',
    approved: 'badge badge-approved',
    completed: 'badge badge-completed',
    declined: 'badge badge-declined',
    cancelled: 'badge badge-cancelled',
  };
  const labels: Record<string, string> = {
    pending: 'Pending Approval', approved: 'Approved',
    completed: 'Completed', declined: 'Declined', cancelled: 'Cancelled',
  };
  return (
    <span className={map[status] || 'badge'}>
      {labels[status] || status}
    </span>
  );
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getCustomerBookings } = useMockBookings();
  const bookings = getCustomerBookings('customer-1');

  const upcoming = bookings.filter(b => ['pending', 'approved'].includes(b.status));
  const pending = bookings.filter(b => b.status === 'pending');
  const completed = bookings.filter(b => b.status === 'completed');

  const nextAppt = upcoming[0];

  // Mini calendar days
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const startDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const recentActivity = [
    { icon: <CheckCircle size={18} color="var(--color-primary)" />, text: 'Booking request submitted', time: '2 hours ago' },
    { icon: <Bell size={18} color="var(--color-warning)" />, text: 'Appointment reminder — tomorrow 9:00 AM', time: '1 day ago' },
    { icon: <CheckCircle size={18} color="var(--color-success)" />, text: 'Car Detailing completed — BMW 3 Series', time: '3 days ago' },
    { icon: <Calendar size={18} color="var(--color-success)" />, text: 'Booking approved — Premium Car Wash', time: '5 days ago' },
  ];

  return (
    <CustomerLayout>
      <div className="page-content">
        {/* Welcome Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-navy) 0%, #1D4ED8 100%)',
          borderRadius: 'var(--radius-xl)', padding: '32px 40px', marginBottom: 28,
          position: 'relative', overflow: 'hidden', color: 'white',
        }}>
          <div style={{
            position: 'absolute', right: -20, top: -20, width: 200, height: 200,
            background: 'rgba(255,255,255,0.04)', borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', right: 60, bottom: -60, width: 300, height: 300,
            background: 'rgba(255,255,255,0.03)', borderRadius: '50%',
          }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                {format(today, 'EEEE, MMMM d, yyyy')}
              </p>
              <h1 style={{ fontSize: 30, fontWeight: 800, marginBottom: 8, letterSpacing: -0.5 }}>
                Welcome back, {user?.first_name}
              </h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>
                Keep your car clean and your schedule on track.
              </p>
            </div>
            <Link to="/book"
              className="btn btn-primary"
              style={{
                background: 'white', color: 'var(--color-primary)', fontWeight: 700,
                padding: '0 24px', height: 48, fontSize: 15, flexShrink: 0,
              }}
            >
              <Plus size={18} /> Book a Service
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="stats-grid stats-grid-4" style={{ marginBottom: 28 }}>
          <div className="stat-card">
            <div className="stat-icon blue"><Calendar size={22} /></div>
            <div className="stat-content">
              <div className="stat-value">{upcoming.length}</div>
              <div className="stat-label">Upcoming Bookings</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><Clock size={22} /></div>
            <div className="stat-content">
              <div className="stat-value">{pending.length}</div>
              <div className="stat-label">Pending Approval</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal"><CheckCircle size={22} /></div>
            <div className="stat-content">
              <div className="stat-value">{completed.length}</div>
              <div className="stat-label">Completed Services</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple"><Car size={22} /></div>
            <div className="stat-content">
              <div className="stat-value">2</div>
              <div className="stat-label">Saved Vehicles</div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
          {/* Left Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Quick Book */}
            <div className="card">
              <div className="card-title">
                Quick Book a Service
                <Link to="/book" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>
                  View all →
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <Link to="/book" style={{ textDecoration: 'none' }}>
                  <div style={{
                    border: '2px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
                    padding: 20, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                    background: 'var(--color-bg)',
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)';
                      (e.currentTarget as HTMLElement).style.background = 'var(--color-primary-light)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                      (e.currentTarget as HTMLElement).style.background = 'var(--color-bg)';
                    }}
                  >
                    <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}><Droplets size={32} color="var(--color-primary)" /></div>
                    <div style={{ fontWeight: 700, color: 'var(--color-navy)', marginBottom: 4 }}>Car Wash</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>30–45 minutes • Exterior</div>
                  </div>
                </Link>
                <Link to="/book" style={{ textDecoration: 'none' }}>
                  <div style={{
                    border: '2px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
                    padding: 20, cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center',
                    background: 'var(--color-bg)',
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-success)';
                      (e.currentTarget as HTMLElement).style.background = 'var(--color-success-light)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)';
                      (e.currentTarget as HTMLElement).style.background = 'var(--color-bg)';
                    }}
                  >
                    <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}><Sparkles size={32} color="var(--color-success)" /></div>
                    <div style={{ fontWeight: 700, color: 'var(--color-navy)', marginBottom: 4 }}>Car Detailing</div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>2–4 hours • Full Detail</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="card">
              <div className="card-title">
                Upcoming Bookings
                <Link to="/bookings" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>
                  View all →
                </Link>
              </div>
              {upcoming.length === 0 ? (
                <div className="empty-state" style={{ padding: 32 }}>
                  <div className="empty-state-icon"><Calendar size={28} /></div>
                  <div className="empty-state-title">No upcoming bookings</div>
                  <div className="empty-state-text">Book your first service to get started</div>
                  <Link to="/book" className="btn btn-primary">Book a Service</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {upcoming.map(booking => (
                    <Link key={booking.id} to={`/bookings/${booking.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: '14px 16px', background: 'var(--color-bg)',
                        borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                        transition: 'all 0.15s', cursor: 'pointer',
                      }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'}
                      >
                        <div style={{
                          width: 48, height: 48, background: booking.service?.category === 'detailing'
                            ? 'var(--color-success-light)' : 'var(--color-primary-light)',
                          borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', flexShrink: 0,
                        }}>
                          {booking.service?.category === 'detailing' ? <Sparkles size={22} color="var(--color-success)" /> : <Droplets size={22} color="var(--color-primary)" />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, color: 'var(--color-navy)', marginBottom: 2 }}>
                            {booking.service?.name}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                            {booking.vehicle_make} {booking.vehicle_model} • {booking.vehicle_registration}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                            {format(new Date(booking.requested_date), 'MMM d')} • {booking.requested_time}
                          </div>
                          <StatusBadge status={booking.status} />
                        </div>
                        <ChevronRight size={16} style={{ color: 'var(--color-text-subtle)' }} />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="card">
              <div className="card-title">Recent Activity</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {recentActivity.map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 0', borderBottom: i < recentActivity.length - 1 ? '1px solid var(--color-border-light)' : 'none',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', background: 'var(--color-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text)' }}>{item.text}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Next Appointment */}
            {nextAppt && (
              <div style={{
                background: 'linear-gradient(135deg, var(--color-primary) 0%, #1D4ED8 100%)',
                borderRadius: 'var(--radius-lg)', padding: 24, color: 'white',
              }}>
                <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.7, marginBottom: 12 }}>
                  Next Appointment
                </div>
                <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>
                  {nextAppt.service?.name}
                </div>
                <div style={{ opacity: 0.85, fontSize: 13, marginBottom: 16 }}>
                  {nextAppt.vehicle_make} {nextAppt.vehicle_model} • {nextAppt.vehicle_registration}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, opacity: 0.9 }}>
                    <Calendar size={14} />
                    {format(new Date(nextAppt.requested_date), 'EEEE, MMMM d, yyyy')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, opacity: 0.9 }}>
                    <Clock size={14} />
                    {nextAppt.requested_time} • ~{nextAppt.duration_minutes} min
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, opacity: 0.9 }}>
                    <MapPin size={14} />
                    {nextAppt.location}
                  </div>
                </div>
                <div style={{
                  marginTop: 16, padding: '8px 12px', background: 'rgba(255,255,255,0.15)',
                  borderRadius: 8, fontSize: 12, textAlign: 'center', fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <CreditCard size={14} /> Payment: Pay On-Site
                </div>
                <Link to={`/bookings/${nextAppt.id}`}
                  className="btn"
                  style={{
                    marginTop: 14, background: 'rgba(255,255,255,0.2)', color: 'white',
                    width: '100%', fontSize: 13, border: '1px solid rgba(255,255,255,0.3)',
                  }}>
                  View Details <ArrowRight size={14} />
                </Link>
              </div>
            )}

            {/* Mini Calendar */}
            <div className="card">
              <div className="card-title">
                {format(today, 'MMMM yyyy')}
              </div>
              <div className="calendar-grid" style={{ gap: 2 }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <div key={d} className="calendar-day-header">{d}</div>
                ))}
                {Array.from({ length: startDay }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {days.map(day => {
                  const isToday = day === today.getDate();
                  const hasBooking = bookings.some(b =>
                    new Date(b.requested_date).getDate() === day &&
                    new Date(b.requested_date).getMonth() === today.getMonth()
                  );
                  return (
                    <div key={day} style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '4px 2px', borderRadius: 6, cursor: 'pointer',
                    }}>
                      <span style={{
                        width: 26, height: 26, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', borderRadius: '50%', fontSize: 12, fontWeight: 500,
                        background: isToday ? 'var(--color-primary)' : 'transparent',
                        color: isToday ? 'white' : 'var(--color-text)',
                      }}>
                        {day}
                      </span>
                      {hasBooking && (
                        <div style={{
                          width: 4, height: 4, borderRadius: '50%',
                          background: 'var(--color-primary)', marginTop: 2,
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notifications Panel */}
            <div className="card">
              <div className="card-title">
                Notifications
                <Link to="/notifications" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>
                  View all
                </Link>
              </div>
              {[
                { icon: <Clock size={16} color="var(--color-warning)" />, text: 'Booking pending — Toyota Fortuner', time: '2h ago', unread: true },
                { icon: <CheckCircle size={16} color="var(--color-success)" />, text: 'BMW 3 Series detailing approved', time: '1d ago', unread: false },
                { icon: <Bell size={16} color="var(--color-primary)" />, text: 'Appointment tomorrow at 9:00 AM', time: '2d ago', unread: false },
              ].map((n, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 12, padding: '10px 0',
                  borderBottom: i < 2 ? '1px solid var(--color-border-light)' : 'none',
                }}>
                  <div style={{ flexShrink: 0, marginTop: 2 }}>{n.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: n.unread ? 600 : 400, color: 'var(--color-text)' }}>
                      {n.text}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-subtle)' }}>{n.time}</div>
                  </div>
                  {n.unread && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-primary)', flexShrink: 0, marginTop: 4 }} />
                  )}
                </div>
              ))}
            </div>

            {/* Support Shortcut */}
            <Link to="/support" style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)', padding: 16, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'}
              >
                <div style={{
                  width: 40, height: 40, background: 'var(--color-primary-mid)',
                  borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: 'var(--color-primary)',
                }}>
                  <Star size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 14 }}>Need Help?</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Chat, call or email support</div>
                </div>
                <ChevronRight size={16} style={{ color: 'var(--color-text-subtle)', marginLeft: 'auto' }} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
