import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, MapPin, RefreshCw, X, RotateCcw, Eye,
  ChevronRight, Droplets, Sparkles, CheckCircle, XCircle, CreditCard,
} from 'lucide-react';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import { useMockBookings } from '../../hooks/useBookings';
import { format } from 'date-fns';
import type { Booking } from '../../types';

/* ─── colour helpers ─── */
const STATUS_CFG: Record<string, { bg: string; color: string; label: string }> = {
  pending:   { bg: 'rgba(251,191,36,0.15)',   color: '#FBBF24', label: 'Pending Approval' },
  approved:  { bg: 'rgba(96,165,250,0.15)',   color: '#60A5FA', label: 'Approved' },
  completed: { bg: 'rgba(52,211,153,0.15)',   color: '#34D399', label: 'Completed' },
  declined:  { bg: 'rgba(248,113,113,0.15)',  color: '#F87171', label: 'Declined' },
  cancelled: { bg: 'rgba(156,163,175,0.15)',  color: '#9CA3AF', label: 'Cancelled' },
};

const StatusBadge = ({ status }: { status: string }) => {
  const c = STATUS_CFG[status] || { bg: 'rgba(255,255,255,0.1)', color: '#fff', label: status };
  return (
    <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color }}>
      {c.label}
    </span>
  );
};

const DATE_COLOR: Record<string, string> = {
  pending:   '#FBBF24',
  approved:  '#60A5FA',
  completed: '#34D399',
  declined:  '#F87171',
  cancelled: '#6B7280',
};

const FILTERS = ['all', 'pending', 'approved', 'completed', 'declined', 'cancelled'];

export const MyBookings: React.FC = () => {
  const { getCustomerBookings, updateBookingStatus } = useMockBookings();
  const bookings = getCustomerBookings('customer-1');
  const [filter, setFilter] = useState('all');

  const counts: Record<string, number> = {
    all: bookings.length,
    pending:   bookings.filter(b => b.status === 'pending').length,
    approved:  bookings.filter(b => b.status === 'approved').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    declined:  bookings.filter(b => b.status === 'declined').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <CustomerLayout>
      <div style={{ padding: '32px 32px 48px', maxWidth: 1100, margin: '0 auto', fontFamily: "'Inter', -apple-system, sans-serif" }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>MY BOOKINGS</p>
            <h1 style={{ fontSize: 'clamp(24px,3vw,32px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff' }}>My Bookings</h1>
          </div>
          <Link to="/book" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', fontSize: 14, fontWeight: 600, background: '#fff', color: '#080808', borderRadius: 10, textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'none'; }}
          >
            + Book New Service
          </Link>
        </div>

        {/* STAT STRIP */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          {[
            { label: 'Upcoming',        value: bookings.filter(b => ['pending','approved'].includes(b.status)).length, color: '#60A5FA', icon: <Calendar size={18} /> },
            { label: 'Pending',         value: counts.pending,   color: '#FBBF24', icon: <Clock size={18} /> },
            { label: 'Completed',       value: counts.completed, color: '#34D399', icon: <CheckCircle size={18} /> },
            { label: 'Declined/Cancel', value: counts.declined + counts.cancelled, color: '#F87171', icon: <XCircle size={18} /> },
          ].map(s => (
            <div key={s.label} style={{ flex: '1 1 140px', background: '#0f0f0f', border: `1px solid ${s.color}33`, borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff' }}>{s.value}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 3 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 24 }}>
          {/* LEFT — booking list */}
          <div>
            {/* Filter pills */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
              {FILTERS.map(f => {
                const active = filter === f;
                return (
                  <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${active ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}`, background: active ? 'rgba(255,255,255,0.1)' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: 13, fontWeight: active ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                    {counts[f] > 0 && <span style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 10, padding: '1px 6px', fontSize: 11, fontWeight: 700 }}>{counts[f]}</span>}
                  </button>
                );
              })}
            </div>

            {/* Booking cards */}
            {filtered.length === 0 ? (
              <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '48px 24px', textAlign: 'center' }}>
                <Calendar size={32} color="rgba(255,255,255,0.15)" style={{ margin: '0 auto 12px' }} />
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>No bookings found</p>
                <Link to="/book" style={{ fontSize: 13, color: '#60A5FA', fontWeight: 600, textDecoration: 'none' }}>Book a service →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {filtered.map(b => (
                  <BookingCard key={b.id} booking={b} onCancel={() => updateBookingStatus(b.id, 'cancelled')} />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — status guide */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Status Guide</div>
              {Object.entries(STATUS_CFG).map(([key, c]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 5, fontSize: 11, fontWeight: 600, background: c.bg, color: c.color, flexShrink: 0, marginTop: 2 }}>{c.label}</span>
                </div>
              ))}
            </div>

            <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 10 }}>Need Help?</div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 16 }}>Have a question about your booking?</p>
              <Link to="/support" style={{ display: 'block', textAlign: 'center', padding: '10px 0', fontSize: 13, fontWeight: 600, background: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: 8, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', transition: 'background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};

/* ─── Booking Card Component ─── */
const BookingCard: React.FC<{ booking: Booking; onCancel: () => void }> = ({ booking, onCancel }) => {
  const isUpcoming = ['pending', 'approved'].includes(booking.status);
  const isPast = ['completed', 'declined', 'cancelled'].includes(booking.status);
  const dateColor = DATE_COLOR[booking.status] || '#6B7280';

  return (
    <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', display: 'flex', transition: 'border-color 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.14)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
    >
      {/* Date strip */}
      <div style={{ width: 72, background: `${dateColor}18`, borderRight: `3px solid ${dateColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 8px', color: dateColor, flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.8, textTransform: 'uppercase' }}>{format(new Date(booking.requested_date), 'MMM')}</div>
        <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1 }}>{format(new Date(booking.requested_date), 'd')}</div>
        <div style={{ fontSize: 10, opacity: 0.8 }}>{format(new Date(booking.requested_date), 'EEE')}</div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: booking.service?.category === 'detailing' ? 'rgba(52,211,153,0.15)' : 'rgba(96,165,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {booking.service?.category === 'detailing' ? <Sparkles size={15} color="#34D399" /> : <Droplets size={15} color="#60A5FA" />}
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#fff', fontSize: 14 }}>{booking.service?.name}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                {booking.vehicle_make} {booking.vehicle_model} ·{' '}
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '1px 6px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>{booking.vehicle_registration}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div style={{ display: 'flex', gap: 20, marginBottom: 12, flexWrap: 'wrap' }}>
          {[
            { I: Clock,   text: booking.requested_time },
            { I: Calendar, text: `~${booking.duration_minutes} min` },
            { I: MapPin,  text: booking.location },
          ].map(({ I, text }) => text ? (
            <span key={text} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              <I size={12} /> {text}
            </span>
          ) : null)}
        </div>

        {booking.status === 'approved' && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 6, padding: '3px 10px', fontSize: 11, color: '#34D399', fontWeight: 600, marginBottom: 10 }}>
            <CreditCard size={11} /> Pay On-Site
          </div>
        )}
        {booking.status === 'declined' && booking.decline_reason && (
          <div style={{ background: 'rgba(248,113,113,0.1)', borderRadius: 6, padding: '6px 10px', fontSize: 12, color: '#F87171', marginBottom: 10 }}>
            Reason: {booking.decline_reason}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/bookings/${booking.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: '#fff', borderRadius: 8, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', transition: 'background 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
          >
            <Eye size={12} /> View
          </Link>
          {isUpcoming && (
            <>
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', fontSize: 12, fontWeight: 600, background: 'rgba(255,255,255,0.06)', color: '#fff', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              >
                <RefreshCw size={12} /> Reschedule
              </button>
              <button onClick={onCancel} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', fontSize: 12, fontWeight: 600, background: 'rgba(248,113,113,0.12)', color: '#F87171', borderRadius: 8, border: '1px solid rgba(248,113,113,0.2)', cursor: 'pointer', transition: 'background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.2)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(248,113,113,0.12)'; }}
              >
                <X size={12} /> Cancel
              </button>
            </>
          )}
          {isPast && (
            <Link to="/book" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 14px', fontSize: 12, fontWeight: 600, background: '#fff', color: '#080808', borderRadius: 8, textDecoration: 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
            >
              <RotateCcw size={12} /> Book Again
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
