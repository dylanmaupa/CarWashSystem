import React, { useState } from 'react';
import { Search, Filter, Plus, X, Users, CheckCircle, RefreshCw, UserPlus, Phone, Mail, Calendar } from 'lucide-react';
import { ManagerLayout } from '../../components/layout/ManagerLayout';
import { format } from 'date-fns';

const MOCK_CUSTOMERS = [
  { id: 'c1', first_name: 'Sarah', last_name: 'Johnson', email: 'sarah.j@email.com', phone: '(555) 123-4567', bookings: 12, lastBooking: '2026-09-13', preferredService: 'Car Wash — Exterior', status: 'active' },
  { id: 'c2', first_name: 'David', last_name: 'Lee', email: 'david.lee@email.com', phone: '(555) 987-6543', bookings: 8, lastBooking: '2026-09-12', preferredService: 'Detailing — Full Interior', status: 'active' },
  { id: 'c3', first_name: 'Emily', last_name: 'Rodriguez', email: 'emily.r@email.com', phone: '(555) 765-4321', bookings: 5, lastBooking: '2026-09-10', preferredService: 'Car Wash — Exterior', status: 'active' },
  { id: 'c4', first_name: 'Tom', last_name: 'Kim', email: 'tom.k@email.com', phone: '(555) 234-5678', bookings: 15, lastBooking: '2026-09-08', preferredService: 'Detailing — Full Service', status: 'active' },
  { id: 'c5', first_name: 'Lisa', last_name: 'Martinez', email: 'lisa.m@email.com', phone: '(555) 345-6789', bookings: 4, lastBooking: '2026-09-05', preferredService: 'Car Wash — Exterior', status: 'active' },
  { id: 'c6', first_name: 'Robert', last_name: 'Kim', email: 'robert.k@email.com', phone: '(555) 456-7890', bookings: 10, lastBooking: '2026-09-01', preferredService: 'Ceramic Wax — Premium', status: 'active' },
  { id: 'c7', first_name: 'Anna', last_name: 'Patel', email: 'anna.p@email.com', phone: '(555) 567-8901', bookings: 3, lastBooking: '2026-08-28', preferredService: 'Car Wash — Exterior', status: 'inactive' },
  { id: 'c8', first_name: 'Alex', last_name: 'Carter', email: 'alex.carter@email.com', phone: '(555) 678-9012', bookings: 7, lastBooking: '2026-09-11', preferredService: 'Detailing — Interior', status: 'active' },
];

const CUSTOMER_BOOKINGS: Record<string, { service: string; date: string; status: string }[]> = {
  'c1': [
    { service: 'Car Wash — Exterior', date: '2026-09-13', status: 'completed' },
    { service: 'Detailing — Full Interior', date: '2026-09-01', status: 'completed' },
    { service: 'Car Wash — Exterior', date: '2026-08-20', status: 'completed' },
  ],
};

export const Customers: React.FC = () => {
  const [customers] = useState(MOCK_CUSTOMERS);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>('c1');

  const filtered = customers.filter(c =>
    `${c.first_name} ${c.last_name} ${c.email}`.toLowerCase().includes(search.toLowerCase())
  );

  const selected = customers.find(c => c.id === selectedId);
  const selectedBookings = selectedId ? (CUSTOMER_BOOKINGS[selectedId] || []) : [];
  const initials = (c: typeof MOCK_CUSTOMERS[0]) => `${c.first_name[0]}${c.last_name[0]}`;

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    repeat: customers.filter(c => c.bookings > 5).length,
    newThis: 4,
  };

  return (
    <ManagerLayout>
      <div style={{ display: 'flex', height: 'calc(100vh - 68px)', overflow: 'hidden' }}>
        {/* Main */}
        <div style={{ flex: 1, overflow: 'auto', padding: 32 }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <h1 className="page-title">Customers</h1>
            <p className="page-subtitle">Manage your customers, view their history, and build lasting relationships.</p>
          </div>

          {/* Stats */}
          <div className="stats-grid stats-grid-4" style={{ marginBottom: 24 }}>
            {[
              { label: 'Total Customers', value: stats.total, icon: <Users size={22} color="var(--color-primary)" />, note: '↑ 12% vs last month' },
              { label: 'Active This Month', value: stats.active, icon: <CheckCircle size={22} color="var(--color-success)" />, note: '↑ 18% vs last month' },
              { label: 'Repeat Customers', value: stats.repeat, icon: <RefreshCw size={22} color="var(--color-primary)" />, note: '↑ 24% vs last month' },
              { label: 'New Customers', value: stats.newThis, icon: <UserPlus size={22} color="var(--color-warning)" />, note: '↑ 7% vs last month' },
            ].map(s => (
              <div key={s.label} className="stat-card">
                {s.icon}
                <div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-success)', fontWeight: 600 }}>{s.note}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Search + Add */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
            <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>All Customers ({filtered.length})</div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
              <div className="search-bar" style={{ width: 260 }}>
                <Search size={14} className="search-bar-icon" />
                <input className="search-input" placeholder="Search by name, phone, email, or vehicle..."
                  value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <button className="btn btn-outline btn-sm"><Filter size={14} /> Filters</button>
              <button className="btn btn-primary btn-sm"><Plus size={14} /> Add Customer</button>
            </div>
          </div>

          {/* Table */}
          <div style={{ background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th><input type="checkbox" /></th>
                  <th>Customer</th>
                  <th>Contact Details</th>
                  <th>Total Bookings ↕</th>
                  <th>Last Booking ↕</th>
                  <th>Preferred Service</th>
                  <th>Status ↕</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className={c.id === selectedId ? 'selected' : ''}
                    onClick={() => setSelectedId(c.id === selectedId ? null : c.id)}>
                    <td onClick={e => e.stopPropagation()}><input type="checkbox" /></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%',
                          background: 'linear-gradient(135deg, var(--color-primary), #7C3AED)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'white', fontWeight: 700, fontSize: 13, flexShrink: 0,
                        }}>
                          {initials(c)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 13 }}>{c.first_name} {c.last_name}</div>
                          <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>#{c.id.toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 13, color: 'var(--color-text)' }}>{c.phone}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{c.email}</div>
                    </td>
                    <td><span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{c.bookings}</span></td>
                    <td style={{ fontSize: 13 }}>{format(new Date(c.lastBooking), 'MMM d, yyyy')}</td>
                    <td style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{c.preferredService}</td>
                    <td>
                      <span className={`badge ${c.status === 'active' ? 'badge-approved' : 'badge-cancelled'}`}>
                        <span className="badge-dot" />
                        {c.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <button className="btn btn-ghost btn-sm">⋮</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '12px 20px', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-muted)', alignItems: 'center' }}>
              <span>Showing 1–{filtered.length} of {customers.length} customers</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-outline btn-sm">‹</button>
                <button className="btn btn-primary btn-sm">1</button>
                <button className="btn btn-outline btn-sm">2</button>
                <button className="btn btn-outline btn-sm">›</button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Detail Panel */}
        {selected && (
          <div style={{ width: 300, borderLeft: '1px solid var(--color-border)', padding: '24px 20px', overflowY: 'auto', background: 'var(--color-surface)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
              <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 14 }}>Customer Details</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setSelectedId(null)}>✕</button>
            </div>

            <div style={{ textAlign: 'center', marginBottom: 18 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-primary), #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 22, margin: '0 auto 10px' }}>
                {initials(selected)}
              </div>
              <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 15 }}>{selected.first_name} {selected.last_name}</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 2 }}>#{selected.id.toUpperCase()}</div>
              <span className={`badge ${selected.status === 'active' ? 'badge-approved' : 'badge-cancelled'}`} style={{ marginTop: 8 }}>
                <span className="badge-dot" />{selected.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Contact */}
            {[
              { icon: <Phone size={14} color="var(--color-primary)" />, value: selected.phone },
              { icon: <Mail size={14} color="var(--color-primary)" />, value: selected.email },
              { icon: <Calendar size={14} color="var(--color-primary)" />, value: `Customer since Jan 2024` },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 12, color: 'var(--color-text-muted)', alignItems: 'center' }}>
                <span style={{ flexShrink: 0 }}>{row.icon}</span>{row.value}
              </div>
            ))}

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '16px 0' }}>
              <div style={{ background: 'var(--color-bg)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--color-navy)' }}>{selected.bookings}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Total Bookings</div>
              </div>
              <div style={{ background: 'var(--color-bg)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontWeight: 800, fontSize: 20, color: 'var(--color-navy)' }}>6</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Months Active</div>
              </div>
            </div>

            <hr className="divider" />

            <div style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 13, marginBottom: 10 }}>Recent Bookings</div>
            {selectedBookings.length === 0 ? (
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center', padding: '12px 0' }}>No bookings yet</div>
            ) : (
              selectedBookings.map((b, i) => (
                <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-navy)' }}>{b.service}</div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{format(new Date(b.date), 'MMM d, yyyy')}</div>
                  </div>
                  <span className="badge badge-completed" style={{ fontSize: 10 }}>
                    <span className="badge-dot" />Completed
                  </span>
                </div>
              ))
            )}

            <button className="btn btn-primary btn-sm btn-full" style={{ marginTop: 14 }}>
              View All Bookings →
            </button>
          </div>
        )}
      </div>
    </ManagerLayout>
  );
};
