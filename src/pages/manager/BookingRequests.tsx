import React, { useState } from 'react';
import { CheckCircle, XCircle, X, RefreshCw, AlertTriangle, Search, Car, Calendar, Clock, MapPin, RefreshCcw, Droplets, Sparkles, FileText } from 'lucide-react';
import { ManagerLayout } from '../../components/layout/ManagerLayout';
import { useMockBookings } from '../../hooks/useBookings';
import { format } from 'date-fns';
import type { Booking } from '../../types';
import { DECLINE_REASONS } from '../../types';

type FilterTab = 'all' | 'pending' | 'approved' | 'declined' | 'conflict';

const MOCK_CUSTOMERS: Record<string, { first_name: string; last_name: string; email: string; phone: string }> = {
  'customer-1': { first_name: 'Alex', last_name: 'Carter', email: 'alex.carter@email.com', phone: '(555) 123-4567' },
  'customer-2': { first_name: 'Sarah', last_name: 'Johnson', email: 'sarah.j@email.com', phone: '(555) 234-5678' },
  'customer-3': { first_name: 'David', last_name: 'Lee', email: 'david.lee@email.com', phone: '(555) 345-6789' },
};

export const BookingRequests: React.FC = () => {
  const { getAllBookings, updateBookingStatus, checkConflict } = useMockBookings();
  const all = getAllBookings();

  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [declineId, setDeclineId] = useState<string | null>(null);
  const [approvedMsg, setApprovedMsg] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const pending = all.filter(b => b.status === 'pending');
  const approved = all.filter(b => b.status === 'approved');
  const declined = all.filter(b => b.status === 'declined');
  const conflicted = pending.filter(b => checkConflict(b.requested_date, b.requested_time, b.id));

  const filtered = (() => {
    let base = all;
    if (activeTab === 'pending') base = pending;
    else if (activeTab === 'approved') base = approved;
    else if (activeTab === 'declined') base = declined;
    else if (activeTab === 'conflict') base = conflicted;
    if (search) {
      const s = search.toLowerCase();
      base = base.filter(b =>
        `${b.vehicle_make} ${b.vehicle_model} ${b.vehicle_registration}`.toLowerCase().includes(s) ||
        (MOCK_CUSTOMERS[b.customer_id]?.first_name + ' ' + MOCK_CUSTOMERS[b.customer_id]?.last_name).toLowerCase().includes(s)
      );
    }
    return base;
  })();

  const selected = selectedId ? all.find(b => b.id === selectedId) : null;
  const selectedCustomer = selected ? MOCK_CUSTOMERS[selected.customer_id] : null;
  const hasConflict = selected ? checkConflict(selected.requested_date, selected.requested_time, selected.id) : false;

  const handleApprove = (id: string) => {
    updateBookingStatus(id, 'approved');
    setApprovedMsg(id);
    setTimeout(() => setApprovedMsg(null), 3000);
    if (selectedId === id) setSelectedId(null);
  };

  const openDeclineModal = (id: string) => {
    setDeclineId(id);
    setDeclineReason('');
    setShowDeclineModal(true);
  };

  const handleDecline = () => {
    if (!declineId) return;
    updateBookingStatus(declineId, 'declined', { decline_reason: declineReason });
    setShowDeclineModal(false);
    setDeclineReason('');
    if (selectedId === declineId) setSelectedId(null);
  };

  const vehicleTypeLabel = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

  return (
    <ManagerLayout>
      <div style={{ display: 'flex', height: 'calc(100vh - 68px)', overflow: 'hidden' }}>
        {/* Main Table Area */}
        <div style={{ flex: 1, overflow: 'auto', padding: 32 }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h1 className="page-title">Booking Requests</h1>
            <p className="page-subtitle">Review and manage customer booking requests.</p>
          </div>

          {/* Approved toast */}
          {approvedMsg && (
            <div style={{
              background: 'var(--color-success)', color: 'white', borderRadius: 10,
              padding: '12px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10,
              fontWeight: 600, fontSize: 14,
            }}>
              <CheckCircle size={18} /> Booking Approved — Customer has been notified and calendars are synced.
            </div>
          )}

          {/* KPI Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
            {[
              { label: 'Pending Requests', value: pending.length, color: 'var(--color-warning)', icon: <Clock size={22} color="var(--color-warning)" /> },
              { label: 'Approved Bookings', value: approved.length, color: 'var(--color-success)', icon: <CheckCircle size={22} color="var(--color-success)" /> },
              { label: 'Declined Requests', value: declined.length, color: 'var(--color-danger)', icon: <XCircle size={22} color="var(--color-danger)" /> },
              { label: 'Conflicts Detected', value: conflicted.length, color: 'var(--color-danger)', icon: <AlertTriangle size={22} color="var(--color-danger)" /> },
            ].map(k => (
              <div key={k.label} style={{ background: 'white', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
                {k.icon}
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)', lineHeight: 1 }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>{k.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Filters + Search */}
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
            <div className="filter-tabs">
              {[
                { key: 'all', label: 'All', count: all.length },
                { key: 'pending', label: 'Pending', count: pending.length },
                { key: 'approved', label: 'Approved', count: approved.length },
                { key: 'declined', label: 'Declined', count: declined.length },
                { key: 'conflict', label: 'Conflict', count: conflicted.length },
              ].map(t => (
                <button key={t.key} className={`filter-tab ${activeTab === t.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.key as FilterTab)}>
                  {t.label}
                  {t.count > 0 && <span className="tab-count">{t.count}</span>}
                </button>
              ))}
            </div>
            <div className="search-bar" style={{ maxWidth: 260 }}>
              <Search size={14} className="search-bar-icon" />
              <input className="search-input" placeholder="Search by name, vehicle or reg..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {/* Table */}
          <div style={{ background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Customer</th>
                  <th>Vehicle</th>
                  <th>Service</th>
                  <th>Requested Date & Time</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(booking => {
                  const cust = MOCK_CUSTOMERS[booking.customer_id];
                  const conflict = checkConflict(booking.requested_date, booking.requested_time, booking.id);
                  const isSelected = booking.id === selectedId;
                  return (
                    <tr key={booking.id} className={isSelected ? 'selected' : ''}
                      onClick={() => setSelectedId(isSelected ? null : booking.id)}>
                      <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>
                            {cust ? `${cust.first_name[0]}${cust.last_name[0]}` : 'C'}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 13 }}>
                              {cust ? `${cust.first_name} ${cust.last_name}` : 'Unknown'}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>#{booking.id.toUpperCase()}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 13 }}>
                          {booking.vehicle_make} {booking.vehicle_model}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 1 }}>
                          {booking.vehicle_colour} • {vehicleTypeLabel(booking.vehicle_type)}
                        </div>
                        <div style={{ display: 'inline-flex', marginTop: 3, padding: '1px 7px', background: 'var(--color-navy)', color: 'white', borderRadius: 3, fontSize: 10, fontWeight: 800, letterSpacing: 1 }}>
                          {booking.vehicle_registration}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 13 }}>
                          {booking.service?.name || 'Service'}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>~{booking.duration_minutes} min</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 13 }}>
                          {format(new Date(booking.requested_date), 'EEE, MMM d, yyyy')}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{booking.requested_time}</div>
                      </td>
                      <td>
                        {booking.status !== 'pending' ? (
                          <span className={`badge badge-${booking.status}`}>
                            <span className="badge-dot" />
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        ) : conflict ? (
                          <div>
                            <span className="badge badge-conflict">
                              <AlertTriangle size={11} /> Time Conflict
                            </span>
                            <div style={{ fontSize: 10, color: 'var(--color-danger)', marginTop: 2 }}>
                              Conflicts with another booking.
                            </div>
                          </div>
                        ) : (
                          <div>
                            <span className="badge badge-available">
                              <CheckCircle size={11} /> No Conflicts
                            </span>
                            <div style={{ fontSize: 10, color: 'var(--color-success)', marginTop: 2 }}>
                              Slot available.
                            </div>
                          </div>
                        )}
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        {booking.status === 'pending' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                            <button className="btn btn-success btn-sm" style={{ height: 30, fontSize: 12 }}
                              onClick={() => handleApprove(booking.id)}>
                              <CheckCircle size={12} /> Approve
                            </button>
                            <button className="btn btn-danger btn-sm" style={{ height: 30, fontSize: 12 }}
                              onClick={() => { setDeclineId(booking.id); setShowDeclineModal(true); }}>
                              <X size={12} /> Decline
                            </button>
                            <button className="btn btn-outline btn-sm" style={{ height: 30, fontSize: 12 }}>
                              <RefreshCw size={12} /> Reschedule
                            </button>
                          </div>
                        )}
                        {booking.status !== 'pending' && (
                          <span className="text-muted text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 14 }}>
                No booking requests found.
              </div>
            )}
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--color-border)', fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Showing {filtered.length} of {all.length} requests</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-outline btn-sm">‹</button>
                <button className="btn btn-primary btn-sm">1</button>
                <button className="btn btn-outline btn-sm">›</button>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        {selected && (
          <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                  {selectedCustomer?.first_name[0] || 'C'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>
                    {selectedCustomer ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}` : 'Customer'}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>#{selected.id.toUpperCase()}</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedId(null)}><X size={16} /></button>
            </div>

            {/* Booking Info */}
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 14 }}>Booking Information</div>
            {[
              { icon: <Calendar size={14} />, value: format(new Date(selected.requested_date), 'EEE, MMM d, yyyy') },
              { icon: <Clock size={14} />, value: `${selected.requested_time} (~${selected.duration_minutes} min)` },
              { icon: <Car size={14} />, value: `${selected.vehicle_year || ''} ${selected.vehicle_make} ${selected.vehicle_model}` },
              { icon: <span style={{ fontSize: 11, fontWeight: 800, background: 'var(--color-navy)', color: 'white', padding: '2px 5px', borderRadius: 3 }}>{selected.vehicle_registration}</span>, value: `${selected.vehicle_colour} · ${vehicleTypeLabel(selected.vehicle_type)}` },
              { icon: selected.service?.category === 'wash' ? <Droplets size={14} color="var(--color-primary)" /> : <Sparkles size={14} color="var(--color-success)" />, value: selected.service?.name || 'Service' },
              { icon: <MapPin size={14} />, value: selected.location || 'ShineWash Main Branch' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, color: 'var(--color-text-muted)', fontSize: 13 }}>
                <span style={{ color: 'var(--color-primary)', flexShrink: 0 }}>{row.icon}</span>
                {row.value}
              </div>
            ))}

            {selected.vehicle_notes && (
              <div style={{ background: 'var(--color-bg)', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 14, display: 'flex', gap: 6, alignItems: 'center' }}>
                <FileText size={14} color="var(--color-text-muted)" /> {selected.vehicle_notes}
              </div>
            )}

            {/* Conflict Status */}
            {selected.status === 'pending' && (
              <div style={{
                borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: 16,
                background: hasConflict ? 'var(--color-danger-light)' : 'var(--color-success-light)',
                border: `1px solid ${hasConflict ? 'var(--color-danger-mid)' : 'var(--color-success-mid)'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: hasConflict ? 'var(--color-danger)' : 'var(--color-success)', marginBottom: 4 }}>
                  {hasConflict ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
                  {hasConflict ? 'Time Conflict' : 'No Scheduling Conflicts'}
                </div>
                <div style={{ fontSize: 12, color: hasConflict ? '#7F1D1D' : '#134E4A' }}>
                  {hasConflict ? 'This time slot is already booked. Please reschedule or decline.' : 'This booking can be safely approved.'}
                </div>
              </div>
            )}

            {/* Calendar Sync Info */}
            <div style={{ background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-mid)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: 20 }}>
              <div style={{ fontWeight: 700, color: 'var(--color-primary)', fontSize: 12, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <RefreshCcw size={14} /> Automatic Calendar Sync
              </div>
              <div style={{ fontSize: 11, color: '#1E40AF', lineHeight: 1.5 }}>
                When you approve this booking, it's instantly added to both the customer's calendar and your manager calendar.
              </div>
            </div>

            {/* Action Buttons */}
            {selected.status === 'pending' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className="btn btn-primary btn-full" style={{ height: 44, fontSize: 14 }}
                  onClick={() => handleApprove(selected.id)}>
                  <CheckCircle size={16} /> Approve Booking
                </button>
                <button className="btn btn-danger btn-full"
                  onClick={() => openDeclineModal(selected.id)}>
                  <X size={16} /> Decline
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="modal-overlay" onClick={() => setShowDeclineModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-navy)' }}>Decline Booking Request</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowDeclineModal(false)}><X size={16} /></button>
            </div>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 }}>
              Select a reason for declining. This message will be sent to the customer with an invitation to rebook.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {DECLINE_REASONS.map(r => (
                <label key={r.value} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
                  borderRadius: 8, border: '1px solid var(--color-border)', cursor: 'pointer',
                  background: declineReason === r.label ? 'var(--color-primary-light)' : 'white',
                  borderColor: declineReason === r.label ? 'var(--color-primary)' : 'var(--color-border)',
                }}>
                  <input type="radio" name="decline" checked={declineReason === r.label} onChange={() => setDeclineReason(r.label)} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-navy)' }}>{r.label}</span>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => setShowDeclineModal(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDecline}>Confirm Decline</button>
            </div>
          </div>
        </div>
      )}
    </ManagerLayout>
  );
};
