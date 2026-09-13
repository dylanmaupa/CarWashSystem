import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Car, MapPin, RefreshCw, X, RotateCcw, Eye, ChevronRight, Droplets, Sparkles, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import { useMockBookings } from '../../hooks/useBookings';
import { format } from 'date-fns';
import type { Booking, BookingStatus } from '../../types';

const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'completed', label: 'Completed' },
  { key: 'declined', label: 'Declined' },
  { key: 'cancelled', label: 'Cancelled' },
];

const statusClasses: Record<string, string> = {
  pending: 'badge badge-pending',
  approved: 'badge badge-approved',
  completed: 'badge badge-completed',
  declined: 'badge badge-declined',
  cancelled: 'badge badge-cancelled',
};

const statusLabels: Record<string, string> = {
  pending: 'Pending Approval',
  approved: 'Approved',
  completed: 'Completed',
  declined: 'Declined',
  cancelled: 'Cancelled',
};

export const MyBookings: React.FC = () => {
  const { getCustomerBookings, updateBookingStatus } = useMockBookings();
  const bookings = getCustomerBookings('customer-1');

  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? bookings
    : bookings.filter(b => b.status === activeFilter);

  const counts: Record<string, number> = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    approved: bookings.filter(b => b.status === 'approved').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    declined: bookings.filter(b => b.status === 'declined').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const upcoming = bookings.filter(b => ['pending', 'approved'].includes(b.status));

  return (
    <CustomerLayout>
      <div className="page-content">
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-surface) 60%, var(--color-primary-light) 100%)',
          border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)',
          padding: '28px 32px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>MY BOOKINGS</div>
            <h1 className="page-title">My Bookings</h1>
            <p className="page-subtitle">Manage your car care appointments all in one place.</p>
          </div>
          <Link to="/book" className="btn btn-primary">+ Book New Service</Link>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, overflowX: 'auto' }}>
          {[
            { label: 'Upcoming', value: upcoming.length, icon: <Calendar size={22} color="var(--color-primary)" /> },
            { label: 'Pending Approval', value: counts.pending, icon: <Clock size={22} color="var(--color-warning)" /> },
            { label: 'Completed', value: counts.completed, icon: <CheckCircle size={22} color="var(--color-success)" /> },
            { label: 'Cancelled', value: counts.cancelled, icon: <XCircle size={22} color="var(--color-danger)" /> },
          ].map((s, i) => (
            <div key={i} style={{
              flex: '0 0 auto', background: 'white', border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)', padding: '14px 20px',
              display: 'flex', alignItems: 'center', gap: 12, minWidth: 140,
            }}>
              {s.icon}
              <div>
                <div style={{ fontWeight: 800, fontSize: 22, color: 'var(--color-navy)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Status Guide */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start',
        }}>
          {/* Left: Bookings List */}
          <div>
            {/* Filter Tabs */}
            <div className="filter-tabs" style={{ marginBottom: 20 }}>
              {STATUS_FILTERS.map(f => (
                <button key={f.key} className={`filter-tab ${activeFilter === f.key ? 'active' : ''}`}
                  onClick={() => setActiveFilter(f.key)}>
                  {f.label}
                  {counts[f.key] > 0 && <span className="tab-count">{counts[f.key]}</span>}
                </button>
              ))}
            </div>

            {/* Upcoming Section */}
            {(activeFilter === 'all' || activeFilter === 'pending' || activeFilter === 'approved') && (
              <>
                {upcoming.length > 0 && activeFilter === 'all' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                    <Calendar size={16} style={{ color: 'var(--color-primary)' }} />
                    <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>Upcoming Bookings</span>
                    <Link to="/calendar" style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>
                      View Calendar
                    </Link>
                  </div>
                )}
              </>
            )}

            {/* Booking Cards */}
            {filtered.length === 0 ? (
              <div className="card">
                <div className="empty-state">
                  <div className="empty-state-icon"><Calendar size={28} /></div>
                  <div className="empty-state-title">No bookings found</div>
                  <div className="empty-state-text">
                    {activeFilter === 'all' ? "You haven't made any bookings yet." : `No ${activeFilter} bookings.`}
                  </div>
                  <Link to="/book" className="btn btn-primary">Book a Service</Link>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {filtered.map(booking => (
                  <BookingCard key={booking.id} booking={booking}
                    onCancel={() => updateBookingStatus(booking.id, 'cancelled')} />
                ))}
              </div>
            )}
          </div>

          {/* Right: Status Guide + Help */}
          <div style={{ position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="card-title">Booking Status Guide</div>
              {[
                { status: 'pending', desc: 'Your request is being reviewed by our manager.' },
                { status: 'approved', desc: 'Your booking is confirmed.' },
                { status: 'completed', desc: 'Service completed. Thanks for choosing ShineWash!' },
                { status: 'declined', desc: 'Manager was unable to accept. Please rebook.' },
                { status: 'cancelled', desc: 'This booking was cancelled.' },
              ].map(item => (
                <div key={item.status} style={{ marginBottom: 12 }}>
                  <span className={statusClasses[item.status]}>
                    <span className="badge-dot" />
                    {statusLabels[item.status]}
                  </span>
                  <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4, lineHeight: 1.4 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="card">
              <div className="card-title">Need Help?</div>
              <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 14 }}>
                Have a question about your booking? We're here to help!
              </p>
              <Link to="/support" className="btn btn-primary btn-full">
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

const BookingCard: React.FC<{ booking: Booking; onCancel: () => void }> = ({ booking, onCancel }) => {
  const isUpcoming = ['pending', 'approved'].includes(booking.status);
  const isPast = ['completed', 'declined', 'cancelled'].includes(booking.status);

  return (
    <div style={{
      background: 'white', border: `1px solid ${booking.status === 'declined' ? 'var(--color-danger-mid)' : 'var(--color-border)'}`,
      borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
      transition: 'box-shadow 0.15s',
    }}>
      <div style={{ display: 'flex', gap: 0 }}>
        {/* Date Column */}
        <div style={{
          width: 72, background: booking.status === 'approved' ? 'var(--color-primary)' :
            booking.status === 'pending' ? 'var(--color-warning)' :
              booking.status === 'completed' ? 'var(--color-success)' : '#94A3B8',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '16px 8px', color: 'white', flexShrink: 0,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.8, textTransform: 'uppercase' }}>
            {format(new Date(booking.requested_date), 'MMM')}
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>
            {format(new Date(booking.requested_date), 'd')}
          </div>
          <div style={{ fontSize: 10, opacity: 0.8 }}>
            {format(new Date(booking.requested_date), 'EEE')}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: booking.service?.category === 'detailing' ? 'var(--color-success-light)' : 'var(--color-primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {booking.service?.category === 'detailing' ? <Sparkles size={16} color="var(--color-success)" /> : <Droplets size={16} color="var(--color-primary)" />}
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 15 }}>
                  {booking.service?.name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                  {booking.vehicle_make} {booking.vehicle_model} •{' '}
                  <span style={{
                    background: 'var(--color-navy)', color: 'white',
                    padding: '1px 6px', borderRadius: 3, fontSize: 11, fontWeight: 700,
                  }}>
                    {booking.vehicle_registration}
                  </span>
                </div>
              </div>
            </div>
            <span className={statusClasses[booking.status] || 'badge'}>
              {statusLabels[booking.status] || booking.status}
            </span>
          </div>

          <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
              <Clock size={13} /> {booking.requested_time}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
              <Calendar size={13} /> ~{booking.duration_minutes} min
            </div>
            {booking.location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-muted)' }}>
                <MapPin size={13} /> {booking.location}
              </div>
            )}
          </div>

          {/* Pay on site for approved */}
          {booking.status === 'approved' && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--color-success-light)', border: '1px solid var(--color-success-mid)',
              borderRadius: 6, padding: '3px 10px', fontSize: 11, color: '#134E4A', fontWeight: 600, marginBottom: 10,
            }}>
              <CreditCard size={12} /> Payment: Pay On-Site
            </div>
          )}

          {/* Decline reason */}
          {booking.status === 'declined' && booking.decline_reason && (
            <div style={{
              background: 'var(--color-danger-light)', borderRadius: 6, padding: '6px 10px',
              fontSize: 12, color: 'var(--color-danger)', marginBottom: 10,
            }}>
              Reason: {booking.decline_reason}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: 'flex', gap: 8 }}>
            <Link to={`/bookings/${booking.id}`} className="btn btn-outline btn-sm">
              <Eye size={13} /> View Details
            </Link>
            {isUpcoming && (
              <>
                <button className="btn btn-outline btn-sm">
                  <RefreshCw size={13} /> Reschedule
                </button>
                <button className="btn btn-danger btn-sm" onClick={onCancel}>
                  <X size={13} /> Cancel
                </button>
              </>
            )}
            {isPast && (
              <Link to="/book" className="btn btn-primary btn-sm">
                <RotateCcw size={13} /> Book Again
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
