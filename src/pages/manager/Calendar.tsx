import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, RefreshCw, X, Car, Droplets, Sparkles, Calendar, MapPin, FileText, Edit2 } from 'lucide-react';
import { ManagerLayout } from '../../components/layout/ManagerLayout';
import { useMockBookings } from '../../hooks/useBookings';
import { format, startOfWeek, addDays, addMonths, subMonths, startOfMonth, getDaysInMonth, getDay, isSameDay } from 'date-fns';

type CalView = 'day' | 'week' | 'month';

const BAYS = ['Bay 1 — Exterior Wash', 'Bay 2 — Detailing', 'Bay 3 — Premium'];
const WEEK_HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

const blockColor = (status: string, category?: string) => {
  if (status === 'pending') return { bg: 'var(--color-warning-mid)', border: 'var(--color-warning)', text: '#92400E' };
  if (status === 'declined' || status === 'cancelled') return { bg: 'var(--color-danger-mid)', border: 'var(--color-danger)', text: '#7F1D1D' };
  if (category === 'detailing') return { bg: 'var(--color-success-mid)', border: 'var(--color-success)', text: '#134E4A' };
  return { bg: 'var(--color-primary-mid)', border: 'var(--color-primary)', text: '#1E40AF' };
};

export const ManagerCalendar: React.FC = () => {
  const { getAllBookings } = useMockBookings();
  const bookings = getAllBookings();
  const [view, setView] = useState<CalView>('week');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);

  const selectedBooking = selectedBookingId ? bookings.find(b => b.id === selectedBookingId) : null;

  // Week view
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Month view
  const monthStart = startOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);
  const startDow = getDay(monthStart);

  const getBookingsForDay = (d: Date) => bookings.filter(b => {
    const bd = new Date(b.requested_date); bd.setHours(0,0,0,0);
    const dd = new Date(d); dd.setHours(0,0,0,0);
    return isSameDay(bd, dd);
  });

  const navigate = (dir: 1 | -1) => {
    if (view === 'week') setCurrentDate(addDays(currentDate, dir * 7));
    else if (view === 'month') setCurrentDate(addMonths(currentDate, dir));
    else setCurrentDate(addDays(currentDate, dir));
  };

  const today = new Date(); today.setHours(0,0,0,0);

  return (
    <ManagerLayout>
      <div style={{ display: 'flex', height: 'calc(100vh - 68px)', overflow: 'hidden' }}>
        <div style={{ flex: 1, overflow: 'auto', padding: 32, paddingRight: selectedBooking ? 0 : 32 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h1 className="page-title">Service Calendar</h1>
              <p className="page-subtitle">Manage technician schedules, assign bays, and keep your day running smoothly.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button className="btn btn-outline btn-sm" onClick={() => setCurrentDate(new Date())}>Today</button>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate(-1)}><ChevronLeft size={16} /></button>
              <span style={{ fontWeight: 700, color: 'var(--color-navy)', minWidth: 180, textAlign: 'center' }}>
                {view === 'week' ? `${format(weekStart, 'MMM d')} – ${format(addDays(weekStart, 6), 'MMM d, yyyy')}` :
                  view === 'month' ? format(currentDate, 'MMMM yyyy') :
                  format(currentDate, 'EEEE, MMMM d, yyyy')}
              </span>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate(1)}><ChevronRight size={16} /></button>

              {/* View switcher */}
              <div className="filter-tabs">
                {(['day','week','month'] as CalView[]).map(v => (
                  <button key={v} className={`filter-tab ${view === v ? 'active' : ''}`}
                    onClick={() => setView(v)}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Week View */}
          {view === 'week' && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              {/* Header row */}
              <div style={{ display: 'grid', gridTemplateColumns: '140px repeat(7, 1fr)', borderBottom: '2px solid var(--color-border)' }}>
                <div style={{ padding: '12px 14px', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', background: 'var(--color-bg)' }}>
                  Technicians / Bays
                </div>
                {weekDays.map(day => {
                  const isToday = isSameDay(day, today);
                  return (
                    <div key={day.toString()} style={{
                      padding: '10px 8px', textAlign: 'center', fontSize: 12,
                      background: isToday ? 'var(--color-primary)' : 'var(--color-bg)',
                      color: isToday ? 'white' : 'var(--color-text)',
                      borderLeft: '1px solid var(--color-border)',
                    }}>
                      <div style={{ fontWeight: 600, textTransform: 'uppercase', fontSize: 10, opacity: isToday ? 0.8 : 0.6 }}>
                        {format(day, 'EEE')}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>{format(day, 'd')}</div>
                    </div>
                  );
                })}
              </div>

              {/* Bay rows */}
              {BAYS.map(bay => (
                <div key={bay} style={{ display: 'grid', gridTemplateColumns: '140px repeat(7, 1fr)', borderBottom: '1px solid var(--color-border)' }}>
                  <div style={{ padding: '12px 14px', background: 'var(--color-bg)', borderRight: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Car size={16} color="var(--color-primary)" />
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text)', lineHeight: 1.3 }}>{bay}</span>
                  </div>
                  {weekDays.map(day => {
                    const dayBookings = getBookingsForDay(day);
                    const relevant = dayBookings.slice(0, 2);
                    return (
                      <div key={day.toString()} style={{ padding: 6, borderLeft: '1px solid var(--color-border)', minHeight: 80, background: isSameDay(day, today) ? 'rgba(37,99,235,0.02)' : 'white' }}>
                        {relevant.map(b => {
                          const colors = blockColor(b.status, b.service?.category);
                          return (
                            <div key={b.id}
                              onClick={() => setSelectedBookingId(b.id === selectedBookingId ? null : b.id)}
                              className="cal-block"
                              style={{ background: colors.bg, borderLeft: `3px solid ${colors.border}`, color: colors.text, cursor: 'pointer', padding: '4px 6px', borderRadius: 5, marginBottom: 3, fontSize: 11, fontWeight: 600, minHeight: 'auto' }}>
                              <div>{b.requested_time}</div>
                              <div style={{ fontWeight: 700, opacity: 0.9 }}>{b.service?.name}</div>
                              <div style={{ opacity: 0.7 }}>{b.vehicle_registration}</div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Month View */}
          {view === 'month' && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '2px solid var(--color-border)' }}>
                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
                  <div key={d} style={{ padding: '12px 0', textAlign: 'center', fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', background: 'var(--color-bg)', borderLeft: '1px solid var(--color-border)' }}>
                    {d}
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                {Array.from({ length: (startDow === 0 ? 6 : startDow - 1) }).map((_, i) => (
                  <div key={`e${i}`} style={{ minHeight: 100, borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', background: '#FAFAFA' }} />
                ))}
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                  const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const dayBks = getBookingsForDay(d);
                  const isT = isSameDay(d, today);
                  return (
                    <div key={day} style={{ minHeight: 100, padding: 6, borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', background: isT ? 'rgba(37,99,235,0.03)' : 'white' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: isT ? 700 : 500, background: isT ? 'var(--color-primary)' : 'transparent', color: isT ? 'white' : 'var(--color-text)', marginBottom: 4 }}>
                        {day}
                      </div>
                      {dayBks.slice(0, 2).map(b => {
                        const colors = blockColor(b.status, b.service?.category);
                        return (
                          <div key={b.id} onClick={() => setSelectedBookingId(b.id)}
                            style={{ padding: '2px 5px', borderRadius: 3, fontSize: 10, fontWeight: 600, background: colors.bg, color: colors.text, borderLeft: `2px solid ${colors.border}`, marginBottom: 2, cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {b.requested_time} {b.vehicle_registration}
                          </div>
                        );
                      })}
                      {dayBks.length > 2 && <div style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>+{dayBks.length - 2} more</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Day View */}
          {view === 'day' && (
            <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', background: 'var(--color-primary)', color: 'white', fontWeight: 700, fontSize: 15 }}>
                {format(currentDate, 'EEEE, MMMM d, yyyy')}
              </div>
              {WEEK_HOURS.map(hour => {
                const dayBks = getBookingsForDay(currentDate).filter(b => b.requested_time.startsWith(hour.replace(':', ':')));
                return (
                  <div key={hour} style={{ display: 'flex', borderBottom: '1px solid var(--color-border)' }}>
                    <div style={{ width: 80, padding: '14px 16px', fontSize: 12, color: 'var(--color-text-muted)', fontWeight: 600, background: 'var(--color-bg)', borderRight: '1px solid var(--color-border)', flexShrink: 0 }}>
                      {hour}
                    </div>
                    <div style={{ flex: 1, padding: 8, minHeight: 60, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {dayBks.map(b => {
                        const colors = blockColor(b.status, b.service?.category);
                        return (
                          <div key={b.id} onClick={() => setSelectedBookingId(b.id)}
                            style={{ padding: '8px 12px', borderRadius: 8, background: colors.bg, borderLeft: `3px solid ${colors.border}`, color: colors.text, cursor: 'pointer', fontSize: 12 }}>
                            <div style={{ fontWeight: 700 }}>{b.service?.name}</div>
                            <div>{b.vehicle_make} {b.vehicle_model}</div>
                            <div style={{ fontWeight: 800, fontSize: 11 }}>{b.vehicle_registration}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="legend" style={{ marginTop: 16 }}>
            <div className="legend-item"><div className="legend-dot event-blue" /> Confirmed Car Wash</div>
            <div className="legend-item"><div className="legend-dot event-teal" /> Confirmed Detailing</div>
            <div className="legend-item"><div className="legend-dot event-orange" /> Pending Request</div>
            <div className="legend-item"><div className="legend-dot event-red" /> Unavailable / Conflict</div>
            <div className="legend-item"><div className="legend-dot event-grey" /> No Booking</div>
          </div>
        </div>

        {/* Booking Detail Side Panel */}
        {selectedBooking && (
          <div style={{ width: 320, borderLeft: '1px solid var(--color-border)', padding: '24px 20px', overflowY: 'auto', background: 'var(--color-surface)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 15 }}>Booking Details</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedBookingId(null)}>✕</button>
            </div>
            <span className={`badge badge-${selectedBooking.status}`} style={{ marginBottom: 14 }}>
              <span className="badge-dot" />
              {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)} · #{selectedBooking.id.toUpperCase()}
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
              {[
                { icon: selectedBooking.service?.category === 'wash' ? <Droplets size={16} color="var(--color-primary)" /> : <Sparkles size={16} color="var(--color-success)" />, label: selectedBooking.service?.name, sub: `~${selectedBooking.duration_minutes} min` },
                { icon: <Calendar size={16} color="var(--color-primary)" />, label: format(new Date(selectedBooking.requested_date), 'EEE, MMM d, yyyy'), sub: selectedBooking.requested_time },
                { icon: <Car size={16} color="var(--color-text-muted)" />, label: `${selectedBooking.vehicle_year || ''} ${selectedBooking.vehicle_make} ${selectedBooking.vehicle_model}`.trim(), sub: `${selectedBooking.vehicle_colour} · ${selectedBooking.vehicle_registration}` },
                { icon: <MapPin size={16} color="var(--color-danger)" />, label: selectedBooking.location || 'ShineWash Main Branch', sub: '' },
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ flexShrink: 0, marginTop: 2 }}>{row.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-navy)' }}>{row.label}</div>
                    {row.sub && <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{row.sub}</div>}
                  </div>
                </div>
              ))}
            </div>

            {selectedBooking.vehicle_notes && (
              <div style={{ marginTop: 12, background: 'var(--color-bg)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', gap: 6, alignItems: 'center' }}>
                <FileText size={14} color="var(--color-text-muted)" /> {selectedBooking.vehicle_notes}
              </div>
            )}

            <hr className="divider" />
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-outline btn-sm btn-full" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                <Edit2 size={13} /> Edit Booking
              </button>
              <button className="btn btn-danger btn-sm btn-full">
                <X size={13} /> Cancel
              </button>
            </div>

            <div style={{ marginTop: 16, background: 'var(--color-success-light)', border: '1px solid var(--color-success-mid)', borderRadius: 'var(--radius-md)', padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--color-success)', marginBottom: 6, fontSize: 13 }}>
                <RefreshCw size={14} /> Calendar Sync
              </div>
              <p style={{ fontSize: 11, color: '#134E4A', lineHeight: 1.5 }}>
                Approved bookings are automatically added to both calendars. When you approve a booking, it instantly appears on the customer's calendar and your manager calendar.
              </p>
              <div style={{ marginTop: 8, padding: '5px 10px', background: 'var(--color-success-mid)', borderRadius: 6, fontSize: 10, color: '#134E4A', fontWeight: 700 }}>
                <CheckCircle size={10} style={{ display: 'inline', marginRight: 4 }} />
                Approved bookings are synced in real time.
              </div>
            </div>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
};
