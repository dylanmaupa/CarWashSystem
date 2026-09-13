import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, CheckCircle, Clock, XCircle, Calendar, BarChart2, RefreshCw, ChevronRight, Mail } from 'lucide-react';
import { ManagerLayout } from '../../components/layout/ManagerLayout';
import { useMockBookings } from '../../hooks/useBookings';
import { format } from 'date-fns';

export const ManagerOverview: React.FC = () => {
  const { getAllBookings } = useMockBookings();
  const all = getAllBookings();
  const pending = all.filter(b => b.status === 'pending');
  const approved = all.filter(b => b.status === 'approved');
  const declined = all.filter(b => b.status === 'declined');
  const completed = all.filter(b => b.status === 'completed');
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayAppts = all.filter(b => b.requested_date === todayStr && b.status === 'approved');

  const recentActivity = [
    { icon: <CheckCircle size={18} color="var(--color-success)" />, text: 'Booking #BK-002 approved — BMW 3 Series (XYZ 5678)', time: '15 min ago' },
    { icon: <Mail size={18} color="var(--color-primary)" />, text: 'New request from Sarah Johnson — Honda Civic (GHI 3456)', time: '42 min ago' },
    { icon: <XCircle size={18} color="var(--color-danger)" />, text: 'Booking #BK-006 declined — time conflict', time: '2 hrs ago' },
    { icon: <CheckCircle size={18} color="var(--color-success)" />, text: 'Ford Ranger (DEF 9012) service completed', time: '3 hrs ago' },
    { icon: <Mail size={18} color="var(--color-primary)" />, text: 'New request from David Lee — Tesla Model 3 (JKL 7890)', time: '4 hrs ago' },
  ];

  return (
    <ManagerLayout>
      <div className="page-content">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">Your service operations at a glance.</p>
        </div>

        {/* KPI Cards */}
        <div className="stats-grid stats-grid-5" style={{ marginBottom: 28 }}>
          {[
            { label: 'Pending Requests', value: pending.length, icon: <ClipboardList size={22} />, color: 'orange', note: 'Needs your approval' },
            { label: 'Approved Bookings', value: approved.length, icon: <CheckCircle size={22} />, color: 'teal', note: 'This week ↑ 20%' },
            { label: 'Declined Requests', value: declined.length, icon: <XCircle size={22} />, color: 'red', note: 'This week ↑ 8%' },
            { label: "Today's Appointments", value: todayAppts.length, icon: <Calendar size={22} />, color: 'blue', note: 'Scheduled' },
            { label: 'Completed Services', value: completed.length, icon: <BarChart2 size={22} />, color: 'purple', note: 'All time' },
          ].map(kpi => (
            <div key={kpi.label} className="stat-card">
              <div className={`stat-icon ${kpi.color}`}>{kpi.icon}</div>
              <div className="stat-content">
                <div className="stat-value">{kpi.value}</div>
                <div className="stat-label">{kpi.label}</div>
                <div className="stat-change" style={{ color: 'var(--color-text-subtle)', fontWeight: 400 }}>{kpi.note}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: 20 }}>
          {/* Pending Requests Quick List */}
          <div className="card">
            <div className="card-title">
              Pending Requests
              <Link to="/manager/requests" style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600 }}>
                View All →
              </Link>
            </div>
            {pending.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--color-text-muted)', fontSize: 13 }}>
                No pending requests
              </div>
            ) : (
              pending.map(b => (
                <div key={b.id} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--color-border-light)', alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, background: 'var(--color-warning-mid)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-warning)', flexShrink: 0 }}>
                    <Clock size={18} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-navy)', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {b.customer?.first_name || 'Customer'} — {b.vehicle_make} {b.vehicle_model}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                      {b.vehicle_registration} · {format(new Date(b.requested_date), 'MMM d')} · {b.requested_time}
                    </div>
                  </div>
                  <Link to="/manager/requests" className="btn btn-primary btn-sm">Review</Link>
                </div>
              ))
            )}
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="card-title">Recent Activity</div>
            {recentActivity.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, padding: '11px 0', borderBottom: i < recentActivity.length - 1 ? '1px solid var(--color-border-light)' : 'none', alignItems: 'flex-start' }}>
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: 'var(--color-text)', lineHeight: 1.4 }}>{item.text}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-subtle)', marginTop: 2 }}>{item.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Calendar Sync */}
            <div style={{
              background: 'linear-gradient(135deg, var(--color-success-light), #CCFBF1)',
              border: '1px solid var(--color-success-mid)', borderRadius: 'var(--radius-lg)', padding: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <RefreshCw size={18} style={{ color: 'var(--color-success)' }} />
                <span style={{ fontWeight: 700, color: 'var(--color-navy)' }}>Calendar Sync</span>
              </div>
              <p style={{ fontSize: 12, color: '#134E4A', lineHeight: 1.5, marginBottom: 10 }}>
                Approved bookings are automatically added to both calendars.
              </p>
              <div style={{ padding: '8px 12px', background: 'var(--color-success-mid)', borderRadius: 8, fontSize: 11, color: '#134E4A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={14} /> Sync is active and working
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 14 }}>Quick Actions</div>
              {[
                { to: '/manager/requests', label: 'Review Booking Requests', badge: pending.length, color: 'var(--color-warning)' },
                { to: '/manager/calendar', label: 'View Service Calendar', badge: null, color: 'var(--color-primary)' },
                { to: '/manager/customers', label: 'Manage Customers', badge: null, color: 'var(--color-success)' },
                { to: '/manager/reports', label: 'View Reports', badge: null, color: '#7C3AED' },
              ].map(action => (
                <Link key={action.to} to={action.to}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '10px 12px', borderRadius: 8, marginBottom: 6, background: 'var(--color-bg)',
                    border: '1px solid var(--color-border)', textDecoration: 'none',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = action.color}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-navy)' }}>{action.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {action.badge !== null && action.badge > 0 && (
                      <span className="sidebar-badge" style={{ background: action.color }}>{action.badge}</span>
                    )}
                    <ChevronRight size={14} style={{ color: 'var(--color-text-subtle)' }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
};
