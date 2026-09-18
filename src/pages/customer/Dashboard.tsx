import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Clock, Car, Droplets, Sparkles, ArrowRight,
  Plus, ChevronRight, CheckCircle, Bell, MapPin, TrendingUp,
  Activity, Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMockBookings } from '../../hooks/useBookings';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import { format } from 'date-fns';

/* ══════════════════════════════════════════════
   REVEAL ON SCROLL HOOK
══════════════════════════════════════════════ */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ══════════════════════════════════════════════
   ANIMATED NUMBER COUNTER
══════════════════════════════════════════════ */
const CountUp: React.FC<{ value: number }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const dur = 900;
    let start: number | null = null;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      el.textContent = String(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { requestAnimationFrame(step); obs.disconnect(); } }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);
  return <span ref={ref}>0</span>;
};

/* ══════════════════════════════════════════════
   STATUS BADGE
══════════════════════════════════════════════ */
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cfg: Record<string, { bg: string; color: string; label: string }> = {
    pending:   { bg: 'rgba(245,158,11,0.15)',  color: '#F59E0B', label: 'Pending' },
    approved:  { bg: 'rgba(37,99,235,0.15)',   color: '#60A5FA', label: 'Approved' },
    completed: { bg: 'rgba(16,185,129,0.15)',  color: '#34D399', label: 'Completed' },
    declined:  { bg: 'rgba(239,68,68,0.15)',   color: '#F87171', label: 'Declined' },
    cancelled: { bg: 'rgba(156,163,175,0.15)', color: '#9CA3AF', label: 'Cancelled' },
  };
  const c = cfg[status] || { bg: 'rgba(255,255,255,0.1)', color: '#fff', label: status };
  return (
    <span style={{
      display: 'inline-block', padding: '3px 8px', borderRadius: 6,
      fontSize: 11, fontWeight: 600, background: c.bg, color: c.color,
      letterSpacing: '0.02em',
    }}>
      {c.label}
    </span>
  );
};

/* ══════════════════════════════════════════════
   SECTION HEADER
══════════════════════════════════════════════ */
const SectionHeader: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
    <h2 style={{ fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>{title}</h2>
    {action}
  </div>
);

/* ══════════════════════════════════════════════
   DARK CARD WRAPPER
══════════════════════════════════════════════ */
const Card: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{
    background: '#0f0f0f',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16, padding: '24px',
    ...style,
  }}>
    {children}
  </div>
);

/* ══════════════════════════════════════════════
   LINK TEXT — subtle arrow link
══════════════════════════════════════════════ */
const SeeAll: React.FC<{ to: string }> = ({ to }) => (
  <Link to={to} style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 500, transition: 'color 0.2s' }}
    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
  >
    View all <ArrowRight size={12} />
  </Link>
);

/* ══════════════════════════════════════════════
   HERO CANVAS — subtle white floating particles
══════════════════════════════════════════════ */
const HeroCanvas: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    type P = { x: number; y: number; r: number; vx: number; vy: number; o: number };
    const pts: P[] = [];
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 22; i++) pts.push({ x: Math.random() * c.width, y: Math.random() * c.height, r: 3 + Math.random() * 20, vx: (Math.random() - 0.5) * 0.25, vy: -0.15 - Math.random() * 0.3, o: 0.03 + Math.random() * 0.07 });
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height);
      pts.forEach(p => {
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        g.addColorStop(0, `rgba(255,255,255,${p.o})`);
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y + p.r < 0) { p.y = c.height + p.r; p.x = Math.random() * c.width; }
        if (p.x + p.r < 0) p.x = c.width + p.r;
        if (p.x - p.r > c.width) p.x = -p.r;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
};

/* ══════════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════════ */
export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getCustomerBookings } = useMockBookings();
  const bookings = getCustomerBookings('customer-1');
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  const upcoming  = bookings.filter(b => ['pending', 'approved'].includes(b.status));
  const pending   = bookings.filter(b => b.status === 'pending');
  const completed = bookings.filter(b => b.status === 'completed');
  const nextAppt  = upcoming[0];

  const today      = new Date();
  const daysInMon  = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const startDay   = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const days       = Array.from({ length: daysInMon }, (_, i) => i + 1);

  const statsRef    = useReveal();
  const quickRef    = useReveal();
  const bookingsRef = useReveal();
  const activityRef = useReveal();

  const stats = [
    { key: 'upcoming',  icon: <Calendar size={18} />,     value: upcoming.length,  label: 'Upcoming',  color: '#60A5FA' },
    { key: 'pending',   icon: <Clock size={18} />,         value: pending.length,   label: 'Pending',   color: '#FBBF24' },
    { key: 'completed', icon: <CheckCircle size={18} />,   value: completed.length, label: 'Completed', color: '#34D399' },
    { key: 'vehicles',  icon: <Car size={18} />,           value: 2,                label: 'Vehicles',  color: '#A78BFA' },
  ];

  const activity = [
    { icon: <Activity size={14} />, color: '#60A5FA', text: 'Booking request submitted', time: '2h ago' },
    { icon: <Bell size={14} />,     color: '#FBBF24', text: 'Reminder — tomorrow 9:00 AM', time: '1d ago' },
    { icon: <CheckCircle size={14} />, color: '#34D399', text: 'Car Detailing completed — BMW 3 Series', time: '3d ago' },
    { icon: <TrendingUp size={14} />,  color: '#34D399', text: 'Booking approved — Premium Car Wash', time: '5d ago' },
  ];

  return (
    <CustomerLayout>
      <div style={{ padding: '32px 32px 48px', maxWidth: 1200, margin: '0 auto' }}>

        {/* ══ HERO GREETING ══ */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 20, marginBottom: 24, background: 'linear-gradient(135deg, #0d0d0d 0%, #111 100%)', border: '1px solid rgba(255,255,255,0.07)', padding: '40px 40px 36px' }}>
          <HeroCanvas />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>
              {format(today, 'EEEE, MMMM d, yyyy')}
            </p>
            <h1 style={{ fontSize: 'clamp(26px,3vw,38px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1.15, marginBottom: 24 }}>
              Welcome back,<br />{user?.first_name}.
            </h1>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/book" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', fontSize: 14, fontWeight: 600, background: '#fff', color: '#080808', borderRadius: 10, textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'none'; }}>
                <Plus size={15} /> Book a Service
              </Link>
              <Link to="/bookings" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 22px', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10, textDecoration: 'none', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; }}>
                View Bookings <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* ══ STAT CARDS ══ */}
        <div
          ref={statsRef}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24, opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s ease, transform 0.6s ease' }}
        >
          {stats.map(s => (
            <div key={s.key}
              onMouseEnter={() => setHoveredStat(s.key)}
              onMouseLeave={() => setHoveredStat(null)}
              style={{
                background: hoveredStat === s.key ? '#141414' : '#0f0f0f',
                border: `1px solid ${hoveredStat === s.key ? s.color + '44' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 14, padding: '20px 22px',
                display: 'flex', flexDirection: 'column', gap: 14,
                cursor: 'default',
                transition: 'all 0.2s',
                boxShadow: hoveredStat === s.key ? `0 8px 32px ${s.color}18` : 'none',
              }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>
                  <CountUp value={s.value} />
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 6, fontWeight: 500 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ══ MAIN 2-COL GRID ══ */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>

          {/* ── LEFT ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Quick Book */}
            <div ref={quickRef} style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s 0.1s ease, transform 0.6s 0.1s ease' }}>
              <Card>
                <SectionHeader title="Quick Book" action={<SeeAll to="/book" />} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  {[
                    { to: '/book', Icon: Droplets, title: 'Car Wash',    sub: '30–45 min · Exterior clean', color: '#60A5FA' },
                    { to: '/book', Icon: Sparkles, title: 'Car Detailing', sub: '2–4 hrs · Full interior & exterior', color: '#34D399' },
                    { to: '/book', Icon: Zap,      title: 'Express Rinse', sub: '15 min · Quick exterior only',  color: '#FBBF24' },
                    { to: '/book', Icon: Activity, title: 'Premium Detail', sub: '4–6 hrs · Ceramic coat & polish', color: '#A78BFA' },
                  ].map(({ to, Icon, title, sub, color }) => (
                    <Link key={title} to={to} style={{ textDecoration: 'none' }}>
                      <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 18px', background: '#0a0a0a', transition: 'all 0.2s', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = color + '55'; e.currentTarget.style.background = color + '0d'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#0a0a0a'; e.currentTarget.style.transform = 'none'; }}
                      >
                        <div style={{ width: 40, height: 40, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, color }}>
                          <Icon size={20} />
                        </div>
                        <div style={{ fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 4 }}>{title}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{sub}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </Card>
            </div>

            {/* Upcoming Bookings */}
            <div ref={bookingsRef} style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s 0.15s ease, transform 0.6s 0.15s ease' }}>
              <Card>
                <SectionHeader title="Upcoming Bookings" action={<SeeAll to="/bookings" />} />
                {upcoming.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '36px 0' }}>
                    <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                      <Calendar size={24} color="rgba(255,255,255,0.2)" />
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.35)', marginBottom: 12 }}>No upcoming bookings</p>
                    <Link to="/book" style={{ fontSize: 13, color: '#60A5FA', fontWeight: 600, textDecoration: 'none' }}>Book a service →</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {upcoming.map((b, i) => (
                      <Link key={b.id} to={`/bookings/${b.id}`} style={{ textDecoration: 'none' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                          background: '#0a0a0a', borderRadius: 12,
                          border: '1px solid rgba(255,255,255,0.07)',
                          transition: 'all 0.18s', cursor: 'pointer',
                          animation: `slideIn 0.4s ${i * 0.06}s ease both`,
                        }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.16)'; e.currentTarget.style.background = '#111'; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = '#0a0a0a'; }}
                        >
                          {/* Icon */}
                          <div style={{ width: 44, height: 44, borderRadius: 12, background: b.service?.category === 'detailing' ? 'rgba(52,211,153,0.15)' : 'rgba(96,165,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: b.service?.category === 'detailing' ? '#34D399' : '#60A5FA' }}>
                            {b.service?.category === 'detailing' ? <Sparkles size={20} /> : <Droplets size={20} />}
                          </div>
                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: 14, color: '#fff', marginBottom: 3 }}>{b.service?.name}</div>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{b.vehicle_make} {b.vehicle_model} · {b.vehicle_registration}</div>
                          </div>
                          {/* Meta */}
                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 5 }}>{format(new Date(b.requested_date), 'MMM d')} · {b.requested_time}</div>
                            <StatusBadge status={b.status} />
                          </div>
                          <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Recent Activity */}
            <div ref={activityRef} style={{ opacity: 0, transform: 'translateY(20px)', transition: 'opacity 0.6s 0.2s ease, transform 0.6s 0.2s ease' }}>
              <Card>
                <SectionHeader title="Recent Activity" />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {activity.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: i < activity.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: item.color }}>
                        {item.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>{item.text}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 3 }}>{item.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* ── RIGHT ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Next Appointment */}
            {nextAppt && (
              <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(160deg, #111 0%, #0d0d0d 100%)' }}>
                <HeroCanvas />
                <div style={{ position: 'relative', zIndex: 1, padding: 24 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
                    Next Appointment
                  </p>
                  <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em', color: '#fff', marginBottom: 6 }}>{nextAppt.service?.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 22 }}>{nextAppt.vehicle_make} {nextAppt.vehicle_model}</div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
                    {[
                      { I: Calendar, text: format(new Date(nextAppt.requested_date), 'EEEE, MMM d') },
                      { I: Clock,    text: `${nextAppt.requested_time} · ~${nextAppt.duration_minutes} min` },
                      { I: MapPin,   text: nextAppt.location },
                    ].map(({ I, text }) => (
                      <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                        <I size={13} color="rgba(255,255,255,0.3)" /> {text}
                      </div>
                    ))}
                  </div>

                  <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 20 }} />

                  <Link to={`/bookings/${nextAppt.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px 0', fontSize: 13, fontWeight: 600, background: '#fff', color: '#080808', borderRadius: 10, textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'none'; }}
                  >
                    View Details <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            )}

            {/* Mini Calendar */}
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>{format(today, 'MMMM yyyy')}</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2, textAlign: 'center' }}>
                {['S','M','T','W','T','F','S'].map((d, i) => (
                  <div key={`${d}${i}`} style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.2)', padding: '3px 0', letterSpacing: '0.04em' }}>{d}</div>
                ))}
                {Array.from({ length: startDay }).map((_, i) => <div key={`e${i}`} />)}
                {days.map(day => {
                  const isToday = day === today.getDate();
                  const has = bookings.some(b => new Date(b.requested_date).getDate() === day && new Date(b.requested_date).getMonth() === today.getMonth());
                  return (
                    <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3px 0' }}>
                      <span style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: 12, fontWeight: isToday ? 700 : 400, background: isToday ? '#fff' : 'transparent', color: isToday ? '#080808' : 'rgba(255,255,255,0.45)' }}>
                        {day}
                      </span>
                      {has && <div style={{ width: 3, height: 3, borderRadius: '50%', background: '#60A5FA', marginTop: 1 }} />}
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Notifications */}
            <Card>
              <SectionHeader title="Notifications" action={
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', cursor: 'pointer', fontWeight: 500 }}>Mark all read</span>
              } />
              {[
                { I: Clock,       color: '#FBBF24', text: 'Booking pending — Toyota Fortuner', time: '2h ago', unread: true },
                { I: CheckCircle, color: '#34D399', text: 'BMW 3 Series detailing approved', time: '1d ago', unread: false },
                { I: Bell,        color: '#60A5FA', text: 'Appointment tomorrow at 9:00 AM', time: '2d ago', unread: false },
              ].map((n, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${n.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: n.color }}>
                    <n.I size={15} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: n.unread ? 600 : 400, color: n.unread ? '#fff' : 'rgba(255,255,255,0.55)' }}>{n.text}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 3 }}>{n.time}</div>
                  </div>
                  {n.unread && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#60A5FA', flexShrink: 0, marginTop: 5 }} />}
                </div>
              ))}
            </Card>

          </div>
        </div>

        {/* Scoped animations */}
        <style>{`
          @keyframes slideIn {
            from { opacity: 0; transform: translateX(-12px); }
            to   { opacity: 1; transform: translateX(0); }
          }
        `}</style>
      </div>
    </CustomerLayout>
  );
};
