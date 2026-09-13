import React, { useState } from 'react';
import { BarChart2, TrendingUp, Calendar, CheckCircle } from 'lucide-react';
import { ManagerLayout } from '../../components/layout/ManagerLayout';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const bookingsOverTime = [
  { month: 'Apr', bookings: 42 }, { month: 'May', bookings: 58 },
  { month: 'Jun', bookings: 65 }, { month: 'Jul', bookings: 72 },
  { month: 'Aug', bookings: 68 }, { month: 'Sep', bookings: 84 },
];

const serviceMix = [
  { name: 'Standard Car Wash', value: 38, color: '#2563EB' },
  { name: 'Premium Car Wash', value: 22, color: '#60A5FA' },
  { name: 'Interior Detailing', value: 24, color: '#0D9488' },
  { name: 'Full Detail Package', value: 16, color: '#2DD4BF' },
];

const approvalData = [
  { week: 'W1', approved: 18, declined: 4 },
  { week: 'W2', approved: 22, declined: 3 },
  { week: 'W3', approved: 19, declined: 6 },
  { week: 'W4', approved: 25, declined: 2 },
];

const peakTimes = [
  { hour: '8am', bookings: 12 }, { hour: '9am', bookings: 28 },
  { hour: '10am', bookings: 35 }, { hour: '11am', bookings: 30 },
  { hour: '12pm', bookings: 20 }, { hour: '1pm', bookings: 18 },
  { hour: '2pm', bookings: 25 }, { hour: '3pm', bookings: 32 },
  { hour: '4pm', bookings: 22 }, { hour: '5pm', bookings: 14 },
];

const occupancy = [
  { day: 'Mon', rate: 72 }, { day: 'Tue', rate: 85 },
  { day: 'Wed', rate: 68 }, { day: 'Thu', rate: 92 },
  { day: 'Fri', rate: 88 }, { day: 'Sat', rate: 95 },
];

type ReportRange = '7d' | '30d' | '90d';

export const Reports: React.FC = () => {
  const [range, setRange] = useState<ReportRange>('30d');

  const kpis = [
    { label: 'Total Bookings', value: '84', change: '+12%', icon: <Calendar size={22} />, color: 'blue' },
    { label: 'Approval Rate', value: '88%', change: '+5%', icon: <CheckCircle size={22} />, color: 'teal' },
    { label: 'Avg Daily Appointments', value: '5.8', change: '+0.4', icon: <TrendingUp size={22} />, color: 'orange' },
    { label: 'Most Popular Service', value: 'Car Wash', change: '38% of all', icon: <BarChart2 size={22} />, color: 'purple' },
    { label: 'Completed Services', value: '74', change: '88.1%', icon: <CheckCircle size={22} />, color: 'teal' },
    { label: 'Cancellation Rate', value: '6.2%', change: '-1.1%', icon: <BarChart2 size={22} />, color: 'red' },
  ];

  return (
    <ManagerLayout>
      <div className="page-content">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 className="page-title">Reports & Analytics</h1>
            <p className="page-subtitle">Operational insights for your car wash business.</p>
          </div>
          <div className="filter-tabs">
            {(['7d','30d','90d'] as ReportRange[]).map(r => (
              <button key={r} className={`filter-tab ${range === r ? 'active' : ''}`}
                onClick={() => setRange(r)}>
                {r === '7d' ? 'Last 7 Days' : r === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* No payment note */}
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', background: 'var(--color-bg)', border: '1px solid var(--color-border)', borderRadius: 8, padding: '8px 14px', marginBottom: 24, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <BarChart2 size={14} color="var(--color-primary)" /> These reports show operational data only. No revenue or payment analytics are tracked — payments happen on-site.
        </div>

        {/* KPI Grid */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(6, 1fr)', marginBottom: 28 }}>
          {kpis.map(kpi => (
            <div key={kpi.label} className="stat-card" style={{ flexDirection: 'column', gap: 10 }}>
              <div className={`stat-icon ${kpi.color}`} style={{ width: 40, height: 40 }}>{kpi.icon}</div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)', letterSpacing: -0.5 }}>{kpi.value}</div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', fontWeight: 500, marginBottom: 3 }}>{kpi.label}</div>
                <div style={{ fontSize: 11, color: kpi.change.startsWith('-') && kpi.label !== 'Cancellation Rate' ? 'var(--color-danger)' : 'var(--color-success)', fontWeight: 600 }}>
                  {kpi.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Bookings Over Time */}
          <div className="card">
            <div className="card-title">Bookings Over Time</div>
            <div className="chart-wrapper" style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 12 }} />
                  <Line type="monotone" dataKey="bookings" stroke="var(--color-primary)" strokeWidth={2.5} dot={{ fill: 'var(--color-primary)', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Service Mix */}
          <div className="card">
            <div className="card-title">Service Mix</div>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', height: 200 }}>
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie data={serviceMix} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                    {serviceMix.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {serviceMix.map(s => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                    <span style={{ color: 'var(--color-text)' }}>{s.name}</span>
                    <span style={{ fontWeight: 700, color: 'var(--color-navy)', marginLeft: 'auto' }}>{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
          {/* Approval vs Decline */}
          <div className="card">
            <div className="card-title">Approval vs Decline Rate</div>
            <div className="chart-wrapper" style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={approvalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="approved" name="Approved" fill="var(--color-success)" radius={[4,4,0,0]} />
                  <Bar dataKey="declined" name="Declined" fill="var(--color-danger)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Peak Booking Times */}
          <div className="card">
            <div className="card-title">Peak Booking Times</div>
            <div className="chart-wrapper" style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={peakTimes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="bookings" fill="var(--color-primary)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily Occupancy */}
          <div className="card">
            <div className="card-title">Daily Occupancy Rate</div>
            <div className="chart-wrapper" style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancy}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="rate" name="Occupancy %" fill="var(--color-success)" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </ManagerLayout>
  );
};
