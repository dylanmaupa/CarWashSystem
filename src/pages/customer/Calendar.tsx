import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Clock, Car, RefreshCw, Droplets, Sparkles, CheckCircle } from 'lucide-react';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import { useMockBookings } from '../../hooks/useBookings';
import { format, startOfMonth, getDaysInMonth, getDay, addMonths, subMonths, isSameDay } from 'date-fns';

const statusColor: Record<string, string> = {
  pending: 'var(--color-warning)',
  approved: 'var(--color-primary)',
  completed: 'var(--color-success)',
  declined: 'var(--color-danger)',
  cancelled: '#94A3B8',
};

const serviceColor = (category?: string, status?: string) => {
  if (status === 'pending') return 'var(--color-warning)';
  if (category === 'detailing') return 'var(--color-success)';
  return 'var(--color-primary)';
};

export const CustomerCalendar: React.FC = () => {
  const { getCustomerBookings } = useMockBookings();
  const bookings = getCustomerBookings('customer-1');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(currentMonth);
  const startDow = getDay(monthStart);
  const today = new Date(); today.setHours(0,0,0,0);

  const getBookingsForDay = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return bookings.filter(b => {
      const bd = new Date(b.requested_date); bd.setHours(0,0,0,0);
      return isSameDay(bd, d);
    });
  };

  const selectedDateBookings = selectedDate
    ? bookings.filter(b => {
        const bd = new Date(b.requested_date); bd.setHours(0,0,0,0);
        const sd = new Date(selectedDate); sd.setHours(0,0,0,0);
        return isSameDay(bd, sd);
      })
    : [];

  const selectedBookingDetail = selectedBooking
    ? bookings.find(b => b.id === selectedBooking)
    : null;

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
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>CALENDAR</div>
            <h1 className="page-title">Your Car Care Schedule</h1>
            <p className="page-subtitle">Stay organized. A cleaner car. A brighter drive.</p>
          </div>
          <Link to="/book" className="btn btn-primary">+ Book Service</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
          {/* Calendar */}
          <div className="card">
            {/* Month Nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft size={16} />
              </button>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-navy)' }}>
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline btn-sm" onClick={() => setCurrentMonth(new Date())}>Today</button>
                <button className="btn btn-ghost btn-sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Day Headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', padding: '6px 0' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
              {Array.from({ length: startDow }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                dayDate.setHours(0,0,0,0);
                const isToday = isSameDay(dayDate, today);
                const isSelected = selectedDate && isSameDay(dayDate, selectedDate);
                const dayBookings = getBookingsForDay(day);
                return (
                  <div key={day}
                    onClick={() => setSelectedDate(dayDate)}
                    style={{
                      minHeight: 70, padding: '6px 4px', borderRadius: 8, cursor: 'pointer',
                      border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'transparent'}`,
                      background: isSelected ? 'var(--color-primary-light)' : isToday ? 'var(--color-bg)' : 'transparent',
                      transition: 'all 0.15s',
                    }}>
                    <div style={{
                      width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: isToday ? 700 : 500, margin: '0 auto 4px',
                      background: isToday ? 'var(--color-primary)' : 'transparent',
                      color: isToday ? 'white' : 'var(--color-text)',
                    }}>
                      {day}
                    </div>
                    {dayBookings.map(b => (
                      <div key={b.id}
                        onClick={e => { e.stopPropagation(); setSelectedDate(dayDate); setSelectedBooking(b.id); }}
                        style={{
                          marginTop: 2, padding: '2px 5px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                          background: serviceColor(b.service?.category, b.status) + '22',
                          color: serviceColor(b.service?.category, b.status),
                          borderLeft: `3px solid ${serviceColor(b.service?.category, b.status)}`,
                          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                        }}>
                        {b.requested_time} {b.service?.name}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div className="legend" style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--color-border)' }}>
              <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--color-primary)' }} /> Car Wash (Approved)</div>
              <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--color-success)' }} /> Detailing (Approved)</div>
              <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--color-warning)' }} /> Pending Approval</div>
              <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--color-danger)' }} /> Unavailable / Cancelled</div>
            </div>
          </div>

          {/* Right Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 88 }}>
            {/* Selected Date Panel */}
            <div className="card">
              <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 15, marginBottom: 14 }}>
                {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
              </div>
              {selectedDateBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--color-text-muted)', fontSize: 13 }}>
                  No bookings on this day
                </div>
              ) : (
                selectedDateBookings.map(b => (
                  <div key={b.id}
                    onClick={() => setSelectedBooking(b.id === selectedBooking ? null : b.id)}
                    style={{
                      padding: 14, borderRadius: 10, border: `2px solid ${b.id === selectedBooking ? serviceColor(b.service?.category, b.status) : 'var(--color-border)'}`,
                      marginBottom: 10, cursor: 'pointer', background: b.id === selectedBooking ? serviceColor(b.service?.category, b.status) + '10' : 'var(--color-bg)',
                      transition: 'all 0.15s',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      {b.service?.category === 'wash' ? <Droplets size={16} color="var(--color-primary)" /> : <Sparkles size={16} color="var(--color-success)" />}
                      <span style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 13 }}>{b.service?.name}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {b.requested_time}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> ~{b.duration_minutes} min</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Car size={13} /> {b.vehicle_make} {b.vehicle_model} · {b.vehicle_registration}
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <span className={`badge badge-${b.status}`}>
                        {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calendar Sync Info */}
            <div style={{
              background: 'var(--color-success-light)', border: '1px solid var(--color-success-mid)',
              borderRadius: 'var(--radius-md)', padding: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--color-success)', marginBottom: 8 }}>
                <RefreshCw size={16} /> Calendars Stay in Sync
              </div>
              <p style={{ fontSize: 12, color: '#134E4A', lineHeight: 1.5 }}>
                Once your appointment is approved, it will be automatically added to both your calendar and our manager's calendar.
              </p>
              <div style={{ marginTop: 10, padding: '6px 10px', background: 'var(--color-success-mid)', borderRadius: 6, fontSize: 11, color: '#134E4A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={14} /> Approved bookings are synced in real time.
              </div>
            </div>

            {/* Book Button */}
            <Link to="/book" className="btn btn-primary btn-full">
              <Calendar size={16} /> Book Another Service
            </Link>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
