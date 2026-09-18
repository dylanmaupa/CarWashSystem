import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Calendar, Clock, Car,
  RefreshCw, Droplets, Sparkles, CheckCircle,
} from 'lucide-react';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import { useMockBookings } from '../../hooks/useBookings';
import { format, getDaysInMonth, getDay, addMonths, subMonths, isSameDay, startOfMonth } from 'date-fns';

/* ─── colour by status/category ─── */
const serviceColor = (category?: string, status?: string) => {
  if (status === 'pending')   return '#FBBF24';
  if (category === 'detailing') return '#34D399';
  return '#60A5FA';
};

export const CustomerCalendar: React.FC = () => {
  const { getCustomerBookings } = useMockBookings();
  const bookings = getCustomerBookings('customer-1');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const monthStart   = startOfMonth(currentMonth);
  const daysInMonth  = getDaysInMonth(currentMonth);
  const startDow     = getDay(monthStart);
  const today        = new Date(); today.setHours(0, 0, 0, 0);

  const getBookingsForDay = (day: number) => {
    const d = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return bookings.filter(b => {
      const bd = new Date(b.requested_date); bd.setHours(0, 0, 0, 0);
      return isSameDay(bd, d);
    });
  };

  const selectedDateBookings = selectedDate
    ? bookings.filter(b => {
        const bd = new Date(b.requested_date); bd.setHours(0, 0, 0, 0);
        const sd = new Date(selectedDate); sd.setHours(0, 0, 0, 0);
        return isSameDay(bd, sd);
      })
    : [];

  return (
    <CustomerLayout>
      <div style={{ padding: '32px 32px 48px', maxWidth: 1100, margin: '0 auto', fontFamily: "'Inter', -apple-system, sans-serif" }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 8 }}>CALENDAR</p>
            <h1 style={{ fontSize: 'clamp(24px,3vw,32px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff' }}>Your Schedule</h1>
          </div>
          <Link to="/book" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', fontSize: 14, fontWeight: 600, background: '#fff', color: '#080808', borderRadius: 10, textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'none'; }}
          >
            + Book Service
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 24, alignItems: 'start' }}>

          {/* CALENDAR GRID */}
          <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 24 }}>
            {/* Month nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'background 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              >
                <ChevronLeft size={16} />
              </button>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{format(currentMonth, 'MMMM yyyy')}</h2>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => setCurrentMonth(new Date())} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', transition: 'background 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                >
                  Today
                </button>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} style={{ width: 34, height: 34, borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'background 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4, marginBottom: 4 }}>
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', padding: '6px 0' }}>{d}</div>
              ))}
            </div>

            {/* Grid cells */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
              {Array.from({ length: startDow }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                dayDate.setHours(0, 0, 0, 0);
                const isToday    = isSameDay(dayDate, today);
                const isSelected = selectedDate && isSameDay(dayDate, selectedDate);
                const dayBookings = getBookingsForDay(day);

                return (
                  <div key={day} onClick={() => setSelectedDate(dayDate)} style={{
                    minHeight: 72, padding: '6px 4px', borderRadius: 8, cursor: 'pointer',
                    border: `1.5px solid ${isSelected ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.04)'}`,
                    background: isSelected ? 'rgba(255,255,255,0.06)' : isToday ? 'rgba(255,255,255,0.04)' : 'transparent',
                    transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isToday ? 'rgba(255,255,255,0.04)' : 'transparent'; }}
                  >
                    <div style={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: isToday ? 700 : 400, margin: '0 auto 4px', background: isToday ? '#fff' : 'transparent', color: isToday ? '#080808' : 'rgba(255,255,255,0.65)' }}>
                      {day}
                    </div>
                    {dayBookings.map(b => (
                      <div key={b.id} onClick={e => { e.stopPropagation(); setSelectedDate(dayDate); setSelectedBookingId(b.id); }} style={{ marginTop: 2, padding: '2px 5px', borderRadius: 4, fontSize: 10, fontWeight: 600, background: serviceColor(b.service?.category, b.status) + '22', color: serviceColor(b.service?.category, b.status), borderLeft: `3px solid ${serviceColor(b.service?.category, b.status)}`, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {b.requested_time} {b.service?.name}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: 20, marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap' }}>
              {[['#60A5FA','Car Wash (Approved)'],['#34D399','Detailing (Approved)'],['#FBBF24','Pending'],['#F87171','Declined']].map(([col,lab]) => (
                <div key={lab} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: col }} />
                  {lab}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 88 }}>
            {/* Selected date */}
            <div style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 22 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 14 }}>
                {selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Select a date'}
              </div>
              {selectedDateBookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No bookings on this day</div>
              ) : (
                selectedDateBookings.map(b => {
                  const col = serviceColor(b.service?.category, b.status);
                  const isActive = selectedBookingId === b.id;
                  return (
                    <div key={b.id} onClick={() => setSelectedBookingId(b.id === selectedBookingId ? null : b.id)} style={{ padding: 14, borderRadius: 10, border: `1.5px solid ${isActive ? col : 'rgba(255,255,255,0.08)'}`, marginBottom: 10, cursor: 'pointer', background: isActive ? col + '12' : 'rgba(255,255,255,0.03)', transition: 'all 0.15s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        {b.service?.category === 'wash' ? <Droplets size={14} color={col} /> : <Sparkles size={14} color={col} />}
                        <span style={{ fontWeight: 600, color: '#fff', fontSize: 13 }}>{b.service?.name}</span>
                      </div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'flex', gap: 10 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} /> {b.requested_time}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Car size={11} /> {b.vehicle_make} {b.vehicle_model}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Sync info */}
            <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: 16, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: '#34D399', marginBottom: 8, fontSize: 13 }}>
                <RefreshCw size={14} /> Calendar Sync Active
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, marginBottom: 10 }}>
                Approved bookings are automatically synced to both calendars.
              </p>
              <div style={{ padding: '6px 10px', background: 'rgba(52,211,153,0.12)', borderRadius: 6, fontSize: 11, color: '#34D399', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={12} /> Sync is active and working
              </div>
            </div>

            <Link to="/book" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 0', fontSize: 14, fontWeight: 600, background: '#fff', color: '#080808', borderRadius: 10, textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
            >
              <Calendar size={15} /> Book Another Service
            </Link>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
