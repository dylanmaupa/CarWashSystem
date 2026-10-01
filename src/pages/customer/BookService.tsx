import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, CheckCircle, Car, Calendar as CalIcon,
  Clock, FileText, AlertCircle, Info, Droplets, Sparkles, CreditCard, Check,
} from 'lucide-react';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../hooks/useBookings';
import { MOCK_SERVICES, VEHICLE_TYPES, TIME_SLOTS } from '../../types';
import type { VehicleType } from '../../types';
import { format, addDays, startOfMonth, getDaysInMonth, getDay } from 'date-fns';

const STEPS = ['Choose Service', 'Vehicle Details', 'Choose Date', 'Choose Time', 'Confirm'];

const UNAVAILABLE_TIMES = ['10:00 AM', '11:00 AM'];

const vehicleIcons: Record<VehicleType, React.ReactNode> = {
  sedan: <Car size={20} />,
  hatchback: <Car size={20} />,
  suv: <Car size={20} />,
  pickup: <Car size={20} />,
  van: <Car size={20} />,
  other: <Car size={20} />,
};

type BookingDraft = {
  service_id: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_type: VehicleType;
  vehicle_colour: string;
  vehicle_registration: string;
  vehicle_year: string;
  vehicle_notes: string;
  requested_date: string;
  requested_time: string;
  special_instructions: string;
  save_vehicle: boolean;
};

export const BookService: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createBooking } = useBookings();

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BookingDraft>({
    service_id: '', vehicle_make: '', vehicle_model: '', vehicle_type: 'sedan',
    vehicle_colour: '', vehicle_registration: '', vehicle_year: '', vehicle_notes: '',
    requested_date: '', requested_time: '', special_instructions: '', save_vehicle: false,
  });

  const [calMonth, setCalMonth] = useState(new Date());

  const selectedService = MOCK_SERVICES.find(s => s.id === draft.service_id);

  const canNext = () => {
    if (step === 0) return !!draft.service_id;
    if (step === 1) return !!(draft.vehicle_make && draft.vehicle_model && draft.vehicle_colour && draft.vehicle_registration);
    if (step === 2) return !!draft.requested_date;
    if (step === 3) return !!draft.requested_time;
    return true;
  };

  const handleSubmit = () => {
    if (!user) return;
    const booking = createBooking({
      customer_id: user.id,
      service_id: draft.service_id,
      vehicle_make: draft.vehicle_make,
      vehicle_model: draft.vehicle_model,
      vehicle_type: draft.vehicle_type,
      vehicle_colour: draft.vehicle_colour,
      vehicle_registration: draft.vehicle_registration,
      vehicle_year: draft.vehicle_year ? parseInt(draft.vehicle_year) : null,
      vehicle_notes: draft.vehicle_notes || null,
      requested_date: draft.requested_date,
      requested_time: draft.requested_time,
      duration_minutes: selectedService?.duration_minutes || 45,
      status: 'pending',
      manager_notes: null,
      decline_reason: null,
      location: 'ShineWash Main Branch',
    });
    navigate('/booking-confirmation', { state: { booking, service: selectedService } });
  };

  // Calendar logic
  const monthStart = startOfMonth(calMonth);
  const daysInMonth = getDaysInMonth(calMonth);
  const startDayOfWeek = getDay(monthStart);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isDateUnavailable = (day: number) => {
    const d = new Date(calMonth.getFullYear(), calMonth.getMonth(), day);
    return d < today || d.getDay() === 0; // Sundays closed
  };

  const isDateSelected = (day: number) => {
    if (!draft.requested_date) return false;
    const d = new Date(draft.requested_date);
    return d.getDate() === day && d.getMonth() === calMonth.getMonth() && d.getFullYear() === calMonth.getFullYear();
  };

  const isDateToday = (day: number) => {
    const d = new Date(calMonth.getFullYear(), calMonth.getMonth(), day);
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return d.getTime() === t.getTime();
  };

  const selectDate = (day: number) => {
    if (isDateUnavailable(day)) return;
    const d = new Date(calMonth.getFullYear(), calMonth.getMonth(), day);
    setDraft({ ...draft, requested_date: format(d, 'yyyy-MM-dd'), requested_time: '' });
  };

  return (
    <CustomerLayout>
      <div className="page-content">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            BOOK A SERVICE
          </div>
          <h1 className="page-title">Book Your Service</h1>
          <p className="page-subtitle">Follow the steps below to submit your booking request.</p>
        </div>

        {/* Step Progress */}
        <div className="step-progress" style={{ marginBottom: 32 }}>
          {STEPS.map((label, i) => (
            <div key={i} className={`step-item ${i < step ? 'completed' : i === step ? 'active' : ''}`}>
              <div className="step-circle">
                {i < step ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span className="step-label">{label}</span>
            </div>
          ))}
        </div>

        {/* Two-column: form + summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          {/* Main Form */}
          <div className="card">
            {/* STEP 0: Choose Service */}
            {step === 0 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 6 }}>Choose a Service</h2>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>
                  Select the service you'd like to book.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {MOCK_SERVICES.map(svc => (
                    <div key={svc.id}
                      onClick={() => setDraft({ ...draft, service_id: svc.id })}
                      style={{
                        border: `2px solid ${draft.service_id === svc.id ? (svc.category === 'wash' ? 'var(--color-primary)' : 'var(--color-success)') : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-lg)', padding: 20, cursor: 'pointer',
                        background: draft.service_id === svc.id
                          ? (svc.category === 'wash' ? 'var(--color-primary-light)' : 'var(--color-success-light)')
                          : 'var(--color-bg)',
                        transition: 'all 0.2s', position: 'relative',
                      }}>
                      {draft.service_id === svc.id && (
                        <div style={{
                          position: 'absolute', top: 12, right: 12,
                          color: svc.category === 'wash' ? 'var(--color-primary)' : 'var(--color-success)',
                        }}>
                          <CheckCircle size={18} />
                        </div>
                      )}
                      <div style={{ marginBottom: 10, display: 'flex', alignItems: 'center' }}>
                        {svc.category === 'wash' ? <Droplets size={26} color="var(--color-primary)" /> : <Sparkles size={26} color="var(--color-success)" />}
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--color-navy)', marginBottom: 4 }}>{svc.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 12, lineHeight: 1.4 }}>
                        {svc.description}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Clock size={12} /> ~{svc.duration_minutes} min
                        </span>
                        <span style={{
                          fontSize: 12, fontWeight: 700,
                          color: svc.category === 'wash' ? 'var(--color-primary)' : 'var(--color-success)',
                        }}>
                          {svc.price_info}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1: Vehicle Details */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 6 }}>Enter Vehicle Details</h2>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>
                  Tell us about the vehicle you're bringing in.
                </p>

                {/* Vehicle Type */}
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="form-label">Vehicle Type</label>
                  <div className="vehicle-type-grid">
                    {VEHICLE_TYPES.map(vt => (
                      <button key={vt.value}
                        type="button"
                        onClick={() => setDraft({ ...draft, vehicle_type: vt.value })}
                        className={`vehicle-type-btn ${draft.vehicle_type === vt.value ? 'selected' : ''}`}>
                        <span style={{ fontSize: 22 }}>{vehicleIcons[vt.value]}</span>
                        {vt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Vehicle Make</label>
                    <input className="form-input" placeholder="e.g. Toyota"
                      value={draft.vehicle_make}
                      onChange={e => setDraft({ ...draft, vehicle_make: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Vehicle Model</label>
                    <input className="form-input" placeholder="e.g. Fortuner"
                      value={draft.vehicle_model}
                      onChange={e => setDraft({ ...draft, vehicle_model: e.target.value })} required />
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginBottom: 16 }}>
                  <div className="form-group">
                    <label className="form-label">Vehicle Colour</label>
                    <input className="form-input" placeholder="e.g. White"
                      value={draft.vehicle_colour}
                      onChange={e => setDraft({ ...draft, vehicle_colour: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Registration Number</label>
                    <input className="form-input" placeholder="e.g. ABC 1234"
                      value={draft.vehicle_registration}
                      onChange={e => setDraft({ ...draft, vehicle_registration: e.target.value.toUpperCase() })} required />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">
                    Vehicle Year <span className="form-label-optional">(Optional)</span>
                  </label>
                  <input className="form-input" placeholder="e.g. 2022"
                    type="number" min="1980" max="2030"
                    value={draft.vehicle_year}
                    onChange={e => setDraft({ ...draft, vehicle_year: e.target.value })} />
                </div>

                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="form-label">
                    Additional Vehicle Notes <span className="form-label-optional">(Optional)</span>
                  </label>
                  <textarea className="form-textarea" placeholder="e.g. Scratch on rear bumper, please be careful around the alloys..."
                    rows={3} value={draft.vehicle_notes}
                    onChange={e => setDraft({ ...draft, vehicle_notes: e.target.value })} />
                </div>

                <label className="checkbox-label">
                  <input type="checkbox" checked={draft.save_vehicle}
                    onChange={e => setDraft({ ...draft, save_vehicle: e.target.checked })} />
                  <span>Save this vehicle to my profile for future bookings <em style={{ fontStyle: 'normal', color: 'var(--color-text-muted)', fontSize: 12 }}>(optional)</em></span>
                </label>
              </div>
            )}

            {/* STEP 2: Choose Date */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 6 }}>Choose a Date</h2>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>
                  Select an available date for your appointment.
                </p>

                {/* Calendar Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <button className="btn btn-ghost btn-sm"
                    onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1))}>
                    <ChevronLeft size={16} />
                  </button>
                  <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 16 }}>
                    {format(calMonth, 'MMMM yyyy')}
                  </span>
                  <button className="btn btn-ghost btn-sm"
                    onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1))}>
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="calendar-grid">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="calendar-day-header">{d}</div>
                  ))}
                  {Array.from({ length: startDayOfWeek }).map((_, i) => <div key={`e${i}`} />)}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const unavail = isDateUnavailable(day);
                    const selected = isDateSelected(day);
                    const todayDay = isDateToday(day);
                    return (
                      <div key={day}
                        onClick={() => selectDate(day)}
                        className={`calendar-day ${unavail ? 'calendar-day-unavailable' : ''} ${selected ? 'calendar-day-selected' : ''} ${todayDay ? 'calendar-day-today' : ''}`}>
                        <span className="calendar-day-number">{day}</span>
                        {day === 18 && !unavail && <div className="calendar-event-dot event-orange" style={{ marginTop: 2 }} />}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="legend" style={{ marginTop: 16 }}>
                  <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--color-primary)' }} /> Available</div>
                  <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--color-warning)' }} /> Pending</div>
                  <div className="legend-item"><div className="legend-dot" style={{ background: '#CBD5E1' }} /> Unavailable / Closed</div>
                </div>

                {draft.requested_date && (
                  <div style={{
                    marginTop: 16, padding: '10px 16px', background: 'var(--color-primary-light)',
                    borderRadius: 8, border: '1px solid var(--color-primary-mid)', fontSize: 13,
                    color: 'var(--color-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <Check size={16} /> Selected: {format(new Date(draft.requested_date), 'EEEE, MMMM d, yyyy')}
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Choose Time */}
            {step === 3 && (() => {
              const amSlots = TIME_SLOTS.filter(s => s.includes('AM'));
              const pmSlots = TIME_SLOTS.filter(s => s.includes('PM'));

              const SlotGroup = ({ label, slots, icon }: { label: string; slots: string[]; icon: React.ReactNode }) => (
                <div style={{ marginBottom: 28 }}>
                  {/* Group header */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14,
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 8,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'rgba(255,255,255,0.5)',
                    }}>{icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, color: '#fff', fontSize: 14, letterSpacing: '-0.01em' }}>{label}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>
                        {slots.filter(s => !UNAVAILABLE_TIMES.includes(s)).length} slots available
                      </div>
                    </div>
                    <div style={{
                      marginLeft: 'auto', height: 1, flex: 1,
                      background: 'rgba(255,255,255,0.06)',
                    }} />
                  </div>

                  {/* Slot cards */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: 10,
                  }}>
                    {slots.map(slot => {
                      const unavail = UNAVAILABLE_TIMES.includes(slot);
                      const isSelected = draft.requested_time === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={unavail}
                          onClick={() => !unavail && setDraft({ ...draft, requested_time: slot })}
                          style={{
                            position: 'relative',
                            padding: '16px 10px',
                            borderRadius: 12,
                            border: isSelected
                              ? '2px solid var(--color-primary)'
                              : unavail
                              ? '1.5px solid rgba(255,255,255,0.05)'
                              : '1.5px solid rgba(255,255,255,0.09)',
                            background: isSelected
                              ? 'var(--color-primary)'
                              : unavail
                              ? 'rgba(255,255,255,0.02)'
                              : 'rgba(255,255,255,0.04)',
                            cursor: unavail ? 'not-allowed' : 'pointer',
                            transition: 'all 0.18s cubic-bezier(0.4,0,0.2,1)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 4,
                            outline: 'none',
                            boxShadow: isSelected ? '0 0 0 4px rgba(96,165,250,0.18), 0 4px 20px rgba(96,165,250,0.25)' : 'none',
                            transform: isSelected ? 'translateY(-2px)' : 'none',
                            opacity: unavail ? 0.35 : 1,
                          }}
                          onMouseEnter={e => {
                            if (!unavail && !isSelected) {
                              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
                              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.2)';
                              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                            }
                          }}
                          onMouseLeave={e => {
                            if (!unavail && !isSelected) {
                              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.09)';
                              (e.currentTarget as HTMLButtonElement).style.transform = 'none';
                            }
                          }}
                        >
                          {/* Time text */}
                          <span style={{
                            fontSize: 17,
                            fontWeight: 800,
                            letterSpacing: '-0.03em',
                            color: isSelected ? '#fff' : unavail ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.85)',
                            textDecoration: unavail ? 'line-through' : 'none',
                            lineHeight: 1,
                          }}>
                            {slot.split(' ')[0]}
                          </span>
                          <span style={{
                            fontSize: 10,
                            fontWeight: 600,
                            letterSpacing: '0.06em',
                            color: isSelected ? 'rgba(255,255,255,0.75)' : unavail ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.35)',
                          }}>
                            {slot.split(' ')[1]}
                          </span>

                          {/* Full badge */}
                          {unavail && (
                            <span style={{
                              position: 'absolute', top: 6, right: 6,
                              background: 'rgba(239,68,68,0.18)',
                              color: '#F87171',
                              border: '1px solid rgba(239,68,68,0.25)',
                              borderRadius: 4,
                              fontSize: 9, fontWeight: 700,
                              padding: '1px 5px', letterSpacing: '0.05em',
                            }}>FULL</span>
                          )}

                          {/* Selected checkmark */}
                          {isSelected && (
                            <div style={{
                              position: 'absolute', top: 6, right: 6,
                              width: 16, height: 16,
                              borderRadius: '50%',
                              background: 'rgba(255,255,255,0.25)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                                <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );

              return (
                <div>
                  {/* Header */}
                  <div style={{ marginBottom: 28 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 4, letterSpacing: '-0.03em' }}>
                      Choose a Time
                    </h2>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                      Appointment for <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{format(new Date(draft.requested_date), 'EEEE, MMMM d')}</span>.
                      {selectedService && (
                        <> Service duration is approx. <span style={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{selectedService.duration_minutes} min</span>.</>
                      )}
                    </p>
                  </div>

                  {/* AM Group */}
                  <SlotGroup
                    label="Morning"
                    slots={amSlots}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                      </svg>
                    }
                  />

                  {/* PM Group */}
                  <SlotGroup
                    label="Afternoon"
                    slots={pmSlots}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                      </svg>
                    }
                  />

                  {/* Selection confirmation bar */}
                  {draft.requested_time && (
                    <div style={{
                      marginTop: 4,
                      padding: '14px 18px',
                      borderRadius: 12,
                      background: 'linear-gradient(135deg, rgba(96,165,250,0.12) 0%, rgba(96,165,250,0.06) 100%)',
                      border: '1px solid rgba(96,165,250,0.25)',
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: 'var(--color-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 12px rgba(96,165,250,0.3)',
                      }}>
                        <Clock size={16} color="white" />
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 1 }}>Selected time</div>
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                          {draft.requested_time}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setDraft({ ...draft, requested_time: '' })}
                        style={{
                          marginLeft: 'auto', background: 'none', border: 'none',
                          color: 'rgba(255,255,255,0.3)', cursor: 'pointer',
                          fontSize: 11, fontWeight: 600, padding: '4px 8px',
                          borderRadius: 6,
                          transition: 'color 0.15s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)'; }}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}


            {/* STEP 4: Special Instructions & Confirmation */}
            {step === 4 && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 6 }}>
                  Review & Confirm Booking
                </h2>
                <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 24 }}>
                  Add any special instructions and submit your request for manager approval.
                </p>

                <div className="form-group" style={{ marginBottom: 24 }}>
                  <label className="form-label">
                    Special Instructions <span className="form-label-optional">(Optional)</span>
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="e.g. Please focus on the trunk area, park near entrance B..."
                    value={draft.special_instructions}
                    onChange={e => setDraft({ ...draft, special_instructions: e.target.value })}
                  />
                </div>

                {/* Manager approval notice */}
                <div style={{
                  background: '#FEF3C7', border: '1px solid #FDE68A',
                  borderRadius: 'var(--radius-md)', padding: 16, marginBottom: 20,
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                }}>
                  <AlertCircle size={20} style={{ color: '#D97706', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#92400E', fontSize: 14, marginBottom: 2 }}>
                      Requires Manager Approval
                    </div>
                    <div style={{ fontSize: 13, color: '#92400E', lineHeight: 1.5 }}>
                      Submitting this request does not automatically confirm your appointment.
                      You will receive a notification once the manager approves or declines your booking.
                    </div>
                  </div>
                </div>

                {/* Pay on site */}
                <div className="pay-onsite-notice">
                  <span className="pay-onsite-icon"><CreditCard size={18} /></span>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 2 }}>Payment Method: Pay On-Site</div>
                    <div style={{ fontSize: 12, opacity: 0.8 }}>No online payment is required. Payment is made at the car wash.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
              <button className="btn btn-outline" onClick={() => setStep(Math.max(0, step - 1))}
                style={{ visibility: step === 0 ? 'hidden' : 'visible' }}>
                <ChevronLeft size={16} /> Back
              </button>

              {step < 4 ? (
                <button className="btn btn-primary"
                  disabled={!canNext()}
                  onClick={() => setStep(step + 1)}>
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button className="btn btn-primary btn-lg"
                  onClick={handleSubmit}>
                  <CheckCircle size={18} /> Send Booking Request
                </button>
              )}
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div style={{ position: 'sticky', top: 88 }}>
            <div className="card">
              <div className="card-title" style={{ marginBottom: 16 }}>Booking Summary</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Service */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: selectedService?.category === 'wash' ? 'var(--color-primary-light)' : 'var(--color-success-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {selectedService ? (selectedService.category === 'wash' ? <Droplets size={18} color="var(--color-primary)" /> : <Sparkles size={18} color="var(--color-success)" />) : '—'}
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 }}>Service</div>
                    <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 14 }}>
                      {selectedService?.name || <span style={{ color: 'var(--color-text-subtle)', fontWeight: 400 }}>Not selected</span>}
                    </div>
                    {selectedService && (
                      <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>~{selectedService.duration_minutes} min</div>
                    )}
                  </div>
                </div>

                <hr className="divider" style={{ margin: '4px 0' }} />

                {/* Vehicle */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Car size={18} style={{ color: 'var(--color-text-muted)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 }}>Vehicle</div>
                    {draft.vehicle_make ? (
                      <>
                        <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 14 }}>
                          {draft.vehicle_make} {draft.vehicle_model}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                          {draft.vehicle_colour} • {VEHICLE_TYPES.find(v => v.value === draft.vehicle_type)?.label}
                        </div>
                        {draft.vehicle_registration && (
                          <div style={{
                            display: 'inline-block', marginTop: 4, padding: '2px 8px',
                            background: 'rgba(255,255,255,0.1)', color: '#fff',
                            borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: 1,
                            border: '1px solid rgba(255,255,255,0.15)',
                          }}>
                            {draft.vehicle_registration}
                          </div>
                        )}
                      </>
                    ) : (
                      <span style={{ color: 'var(--color-text-subtle)', fontSize: 13 }}>Not entered</span>
                    )}
                  </div>
                </div>

                <hr className="divider" style={{ margin: '4px 0' }} />

                {/* Date & Time */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--color-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CalIcon size={18} style={{ color: 'var(--color-text-muted)' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 }}>Date & Time</div>
                    {draft.requested_date ? (
                      <>
                        <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 14 }}>
                          {format(new Date(draft.requested_date), 'MMM d, yyyy')}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                          {draft.requested_time || 'Time not selected'}
                        </div>
                      </>
                    ) : (
                      <span style={{ color: 'var(--color-text-subtle)', fontSize: 13 }}>Not selected</span>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 16 }} className="pay-onsite-notice">
                <CreditCard size={16} />
                <span>Payment: Pay On-Site only</span>
              </div>

              <div style={{
                marginTop: 14, padding: '10px 14px', background: 'var(--color-bg)',
                borderRadius: 8, border: '1px solid var(--color-border)',
                fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', gap: 8, alignItems: 'flex-start',
              }}>
                <Info size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                Booking confirmation is subject to manager approval. You'll be notified via notification.
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
