import React from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle, Clock, Calendar, Car, MapPin, FileText,
  RefreshCw, X, HelpCircle, ChevronRight, Droplets, Sparkles, CreditCard,
} from 'lucide-react';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import { useMockBookings } from '../../hooks/useBookings';
import { format } from 'date-fns';

const statusClasses: Record<string, string> = {
  pending: 'badge badge-pending', approved: 'badge badge-approved',
  completed: 'badge badge-completed', declined: 'badge badge-declined', cancelled: 'badge badge-cancelled',
};
const statusLabels: Record<string, string> = {
  pending: 'Pending Approval', approved: 'Approved',
  completed: 'Completed', declined: 'Declined', cancelled: 'Cancelled',
};

type TimelineStep = { label: string; key: string };
const TIMELINE_STEPS: TimelineStep[] = [
  { key: 'submitted', label: 'Request Submitted' },
  { key: 'pending', label: 'Pending Approval' },
  { key: 'approved', label: 'Approved' },
  { key: 'service_day', label: 'Service Day' },
  { key: 'completed', label: 'Completed' },
];

const getTimelineProgress = (status: string) => {
  if (status === 'pending') return 1;
  if (status === 'approved') return 2;
  if (status === 'completed') return 4;
  if (status === 'declined' || status === 'cancelled') return 1;
  return 0;
};

export const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAllBookings } = useMockBookings();
  const booking = getAllBookings().find(b => b.id === id);

  if (!booking) {
    return (
      <CustomerLayout>
        <div className="page-content">
          <div className="empty-state">
            <div className="empty-state-title">Booking not found</div>
            <Link to="/bookings" className="btn btn-primary" style={{ marginTop: 16 }}>Back to My Bookings</Link>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  const progress = getTimelineProgress(booking.status);

  return (
    <CustomerLayout>
      <div className="page-content">
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 20 }}>
            <Link to="/bookings" style={{ color: 'var(--color-primary)', fontWeight: 500 }}>My Bookings</Link>
            <ChevronRight size={14} />
            <span>Booking #{booking.id.toUpperCase()}</span>
          </div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
            <div>
              <h1 className="page-title">Booking Details</h1>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>
                #{booking.id.toUpperCase()}
              </p>
            </div>
            <span className={statusClasses[booking.status]}>
              <span className="badge-dot" />
              {statusLabels[booking.status]}
            </span>
          </div>

          {/* Timeline */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title">Booking Progress</div>
            <div className="booking-timeline">
              {TIMELINE_STEPS.map((step, i) => {
                const isDone = i < progress;
                const isCurrent = i === progress;
                const isDeclined = (booking.status === 'declined' || booking.status === 'cancelled') && i === 1;
                return (
                  <div key={step.key} className={`timeline-step ${isDone ? 'done' : isCurrent ? 'current' : ''}`}>
                    <div className="timeline-dot" style={isDeclined ? { borderColor: 'var(--color-danger)', background: 'var(--color-danger)', color: 'white' } : {}}>
                      {isDone ? <CheckCircle size={16} /> : isDeclined ? <X size={14} /> : <span style={{ fontSize: 12, fontWeight: 700 }}>{i + 1}</span>}
                    </div>
                    <span className="timeline-label" style={isDeclined ? { color: 'var(--color-danger)' } : {}}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
            {/* Left: Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Service Info */}
              <div className="card">
                <div className="card-title">Service Details</div>
                <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 48, height: 48, background: booking.service?.category === 'wash' ? 'var(--color-primary-light)' : 'var(--color-success-light)',
                    borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {booking.service?.category === 'wash' ? <Droplets size={24} color="var(--color-primary)" /> : <Sparkles size={24} color="var(--color-success)" />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--color-navy)', marginBottom: 4 }}>{booking.service?.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 8 }}>{booking.service?.description}</div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <span style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Clock size={14} /> ~{booking.duration_minutes} min
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)' }}>
                        {booking.service?.price_info}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="card">
                <div className="card-title">Vehicle Details</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {[
                    { label: 'Make', value: booking.vehicle_make },
                    { label: 'Model', value: booking.vehicle_model },
                    { label: 'Type', value: booking.vehicle_type.charAt(0).toUpperCase() + booking.vehicle_type.slice(1) },
                    { label: 'Colour', value: booking.vehicle_colour },
                  ].map(field => (
                    <div key={field.label}>
                      <div style={{ fontSize: 11, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 3 }}>{field.label}</div>
                      <div style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{field.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>
                  <div style={{ fontSize: 11, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Registration Number</div>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: 'var(--color-navy)', color: 'white',
                    padding: '6px 16px', borderRadius: 6, fontWeight: 800, fontSize: 16, letterSpacing: 2,
                  }}>
                    <Car size={16} /> {booking.vehicle_registration}
                  </div>
                </div>
                {booking.vehicle_year && (
                  <div style={{ marginTop: 10 }}>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Year: <strong>{booking.vehicle_year}</strong></span>
                  </div>
                )}
                {booking.vehicle_notes && (
                  <div style={{ marginTop: 14, padding: '10px 14px', background: 'var(--color-bg)', borderRadius: 8, fontSize: 13, color: 'var(--color-text-muted)' }}>
                    <strong style={{ color: 'var(--color-text)' }}>Notes:</strong> {booking.vehicle_notes}
                  </div>
                )}
              </div>

              {/* Date, Time, Location */}
              <div className="card">
                <div className="card-title">Appointment Details</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { Icon: Calendar, label: 'Date', value: format(new Date(booking.requested_date), 'EEEE, MMMM d, yyyy'), color: 'var(--color-primary)' },
                    { Icon: Clock, label: 'Time', value: `${booking.requested_time} · ~${booking.duration_minutes} min`, color: 'var(--color-warning)' },
                    { Icon: MapPin, label: 'Location', value: booking.location || 'ShineWash Main Branch', color: 'var(--color-danger)' },
                  ].map(({ Icon, label, value, color }) => (
                    <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <div style={{ width: 36, height: 36, background: 'var(--color-bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} style={{ color }} />
                      </div>
                      <div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-subtle)', textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
                        <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 14 }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              {booking.manager_notes && (
                <div className="card">
                  <div className="card-title"><FileText size={16} /> Special Instructions</div>
                  <p style={{ fontSize: 14, color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{booking.manager_notes}</p>
                </div>
              )}

              {/* Decline Reason */}
              {booking.status === 'declined' && (
                <div style={{
                  background: 'var(--color-danger-light)', border: '1px solid var(--color-danger-mid)',
                  borderRadius: 'var(--radius-md)', padding: 16,
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-danger)', marginBottom: 6 }}>Booking Declined</div>
                  <p style={{ fontSize: 13, color: '#7F1D1D', lineHeight: 1.5, marginBottom: 12 }}>
                    {booking.decline_reason || 'This booking was declined by the manager.'}
                  </p>
                  <Link to="/book" className="btn btn-primary btn-sm">Choose Another Date & Time</Link>
                </div>
              )}
            </div>

            {/* Right: Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Pay On-Site */}
              <div className="pay-onsite-notice" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
                  <CreditCard size={18} /> Payment Method
                </div>
                <div style={{ fontSize: 13 }}>
                  <strong>Pay On-Site</strong><br />
                  <span style={{ opacity: 0.8 }}>No online payment required. Payment is made at the car wash.</span>
                </div>
              </div>

              {/* Action Buttons */}
              {['pending', 'approved'].includes(booking.status) && (
                <div className="card">
                  <div className="card-title" style={{ marginBottom: 14 }}>Actions</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button className="btn btn-outline btn-full">
                      <RefreshCw size={16} /> Reschedule Booking
                    </button>
                    <button className="btn btn-danger btn-full">
                      <X size={16} /> Cancel Booking
                    </button>
                    <Link to="/support" className="btn btn-ghost btn-full">
                      <HelpCircle size={16} /> Contact Support
                    </Link>
                  </div>
                </div>
              )}

              {booking.status === 'completed' && (
                <div className="card">
                  <div className="card-title" style={{ marginBottom: 14 }}>Book Again</div>
                  <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 14 }}>
                    Enjoyed the service? Book the same service again quickly.
                  </p>
                  <Link to="/book" className="btn btn-primary btn-full">
                    Book Same Service
                  </Link>
                </div>
              )}

              {/* Calendar Sync */}
              {booking.status === 'approved' && (
                <div style={{
                  background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-mid)',
                  borderRadius: 'var(--radius-md)', padding: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--color-primary)', marginBottom: 6 }}>
                    <CheckCircle size={16} /> Added to Calendar
                  </div>
                  <p style={{ fontSize: 12, color: '#1E40AF', lineHeight: 1.5 }}>
                    This appointment is synced to your calendar and the manager's schedule.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
