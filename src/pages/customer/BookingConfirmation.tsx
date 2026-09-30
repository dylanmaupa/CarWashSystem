import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, Car, MapPin, FileText, Droplets, Sparkles, CreditCard, Phone, Mail, MessageSquare } from 'lucide-react';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import { format } from 'date-fns';
import type { Booking, Service } from '../../types';

export const BookingConfirmation: React.FC = () => {
  const location = useLocation();
  const booking: Booking = location.state?.booking;
  const service: Service = location.state?.service;

  if (!booking) {
    return (
      <CustomerLayout>
        <div className="page-content">
          <div className="empty-state">
            <div className="empty-state-title">No booking found</div>
            <Link to="/book" className="btn btn-primary" style={{ marginTop: 16 }}>Book a Service</Link>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="page-content">
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          {/* Success Hero */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-success-light), #CCFBF1)',
            border: '1px solid var(--color-success-mid)', borderRadius: 'var(--radius-xl)',
            padding: 48, textAlign: 'center', marginBottom: 28,
          }}>
            <div style={{
              width: 80, height: 80, background: 'var(--color-success)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(13,148,136,0.3)',
            }}>
              <CheckCircle size={40} color="white" />
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--color-warning-mid)', color: '#92400E', borderRadius: 20,
              padding: '4px 14px', fontSize: 12, fontWeight: 700, marginBottom: 16,
            }}>
              <Clock size={14} /> Pending Approval
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 12 }}>
              Request Sent!
            </h1>
            <p style={{ fontSize: 16, color: 'var(--color-text-muted)', lineHeight: 1.6, maxWidth: 440, margin: '0 auto' }}>
              Your booking request has been sent to the manager for approval.
              Once approved, the appointment will automatically appear on both your calendar and the manager's calendar.
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-navy)' }}>Booking Details</h2>
              <span style={{
                fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--color-text-muted)',
                background: 'var(--color-bg)', padding: '4px 10px', borderRadius: 6,
              }}>
                #{booking.id.toUpperCase()}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {/* Service */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{
                  width: 40, height: 40, background: service?.category === 'wash' ? 'var(--color-primary-light)' : 'var(--color-success-light)',
                  borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {service?.category === 'wash' ? <Droplets size={20} color="var(--color-primary)" /> : <Sparkles size={20} color="var(--color-success)" />}
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 }}>Service</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{service?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>~{booking.duration_minutes} min</div>
                </div>
              </div>

              {/* Date */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, background: 'var(--color-bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={20} style={{ color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 }}>Date</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                    {format(new Date(booking.requested_date), 'MMMM d, yyyy')}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
                    {format(new Date(booking.requested_date), 'EEEE')}
                  </div>
                </div>
              </div>

              {/* Time */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, background: 'var(--color-bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Clock size={20} style={{ color: 'var(--color-warning)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 }}>Time</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{booking.requested_time}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>~{booking.duration_minutes} min duration</div>
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, background: 'var(--color-bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={20} style={{ color: 'var(--color-danger)' }} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 }}>Location</div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{booking.location}</div>
                </div>
              </div>
            </div>

            <hr className="divider" />

            {/* Vehicle Details */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 40, height: 40, background: 'var(--color-bg)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Car size={20} style={{ color: 'var(--color-text-muted)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 }}>Vehicle</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                    {booking.vehicle_make} {booking.vehicle_model}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
                    {booking.vehicle_colour} • {booking.vehicle_type.charAt(0).toUpperCase() + booking.vehicle_type.slice(1)}
                  </span>
                  <div style={{
                    padding: '3px 10px', background: 'rgba(255,255,255,0.12)', color: '#fff',
                    borderRadius: 4, fontSize: 12, fontWeight: 800, letterSpacing: 1.5,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}>
                    {booking.vehicle_registration}
                  </div>
                </div>
              </div>
            </div>

            {booking.vehicle_notes && (
              <div style={{ marginTop: 12, paddingLeft: 52 }}>
                <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 2 }}>Vehicle Notes</div>
                <div style={{ fontSize: 13, color: 'var(--color-text)' }}>{booking.vehicle_notes}</div>
              </div>
            )}
          </div>

          {/* Manager Contact */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <MessageSquare size={16} style={{ color: 'var(--color-primary)' }} />
              <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--color-navy)' }}>Need to reach out?</h2>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 14, lineHeight: 1.5 }}>
              While your booking is under review, feel free to contact the manager directly.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <a href="tel:+15550001234" style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-mid)',
                borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--color-primary)',
                textDecoration: 'none',
              }}>
                <Phone size={14} /> (555) 000-1234
              </a>
              <a href="mailto:manager@shinewash.com" style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px',
                background: 'var(--color-bg)', border: '1px solid var(--color-border)',
                borderRadius: 8, fontSize: 13, fontWeight: 600, color: 'var(--color-text-muted)',
                textDecoration: 'none',
              }}>
                <Mail size={14} /> manager@shinewash.com
              </a>
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', gap: 6, alignItems: 'center' }}>
              <Clock size={12} /> Business hours: Mon–Sat, 8:00 AM – 6:00 PM
            </div>
          </div>

          {/* Payment Notice */}
          <div className="pay-onsite-notice" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
            <CreditCard size={22} style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>Payment Method: Pay On-Site</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                No online payment required. Payment is made at the car wash after or during your service.
              </div>
            </div>
          </div>

          {/* Calendar Sync Info */}
          <div style={{
            background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-mid)',
            borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 28,
            display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: 13, color: '#1E40AF',
          }}>
            <Calendar size={18} style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>Automatic Calendar Sync</div>
              Once your booking is approved, it will automatically appear on your calendar and the manager's service calendar.
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <Link to="/bookings" className="btn btn-primary btn-lg">
              <FileText size={18} /> View My Bookings
            </Link>
            <Link to="/dashboard" className="btn btn-outline btn-lg">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
