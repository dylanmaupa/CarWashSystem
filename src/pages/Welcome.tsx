import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Zap, CalendarCheck, ShieldCheck, Star } from 'lucide-react';
import { PublicLayout } from '../components/layout/PublicLayout';

/* ─────────────────────────────────────────────
   INTERSECTION REVEAL HOOK
───────────────────────────────────────────── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add('lx-revealed'); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ─────────────────────────────────────────────
   ANIMATED COUNTER
───────────────────────────────────────────── */
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let s: number | null = null;
    const d = 1800;
    const frame = (ts: number) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / d, 1);
      el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target) + suffix;
      if (p < 1) requestAnimationFrame(frame);
    };
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { requestAnimationFrame(frame); obs.disconnect(); }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

/* ─────────────────────────────────────────────
   HORIZONTAL ACCORDION FEATURE CARDS
───────────────────────────────────────────── */
interface AccordionCard { id: number; label: string; title: string; desc: string; icon: React.ReactNode; num: string; }

const AccordionCards: React.FC<{ cards: AccordionCard[] }> = ({ cards }) => {
  const [active, setActive] = useState<number>(0);

  return (
    <div className="accordion-feature-cards" style={{
      display: 'flex', gap: 8, height: 420,
      width: '100%', maxWidth: 1100, margin: '0 auto',
    }}>
      {cards.map((card) => {
        const isActive = active === card.id;
        return (
          <div
            key={card.id}
            onMouseEnter={() => setActive(card.id)}
            style={{
              flex: isActive ? '4 1 0%' : '1 1 0%',
              transition: 'flex 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
              borderRadius: 20,
              border: '1px solid rgba(255,255,255,0.08)',
              background: isActive
                ? 'linear-gradient(160deg, #1a1a1a 0%, #111 100%)'
                : 'rgba(255,255,255,0.03)',
              padding: '32px 28px',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Subtle glow on active */}
            {isActive && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: 20, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.03) 0%, transparent 70%)',
              }} />
            )}

            {/* Top: number + icon */}
            <div>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: '0.15em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 32,
                opacity: isActive ? 1 : 0.5,
                transition: 'opacity 0.4s',
              }}>
                {card.num}
              </div>

              {/* Vertical label (always visible) */}
              {!isActive && (
                <div style={{
                  writingMode: 'vertical-lr', textOrientation: 'mixed',
                  transform: 'rotate(180deg)',
                  fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.05em', marginTop: 8,
                  whiteSpace: 'nowrap',
                }}>
                  {card.label}
                </div>
              )}

              {/* Expanded content */}
              {isActive && (
                <div style={{ animation: 'lx-fadeIn 0.4s ease both' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'rgba(255,255,255,0.9)', marginBottom: 28,
                  }}>
                    {card.icon}
                  </div>
                  <h3 style={{
                    fontSize: 'clamp(18px,2vw,24px)', fontWeight: 700,
                    letterSpacing: '-0.03em', color: '#fff', marginBottom: 14, lineHeight: 1.2,
                  }}>
                    {card.title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75, maxWidth: 280 }}>
                    {card.desc}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom accent line */}
            <div style={{
              height: 2, borderRadius: 2,
              background: isActive
                ? 'linear-gradient(90deg, rgba(255,255,255,0.6), rgba(255,255,255,0.1))'
                : 'rgba(255,255,255,0.08)',
              transition: 'background 0.4s',
              marginTop: 24,
            }} />
          </div>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────
   MAIN WELCOME PAGE
───────────────────────────────────────────── */
export const Welcome: React.FC = () => {
  const statsRef    = useReveal();
  const featuresRef = useReveal();
  const stepsRef    = useReveal();

  const featureCards: AccordionCard[] = [
    {
      id: 0, num: '01', label: 'Instant Booking',
      title: 'Instant Booking',
      icon: <Zap size={22} />,
      desc: 'Book in under 60 seconds. Pick your service, choose a slot, and you\'re done. No phone calls, no waiting.',
    },
    {
      id: 1, num: '02', label: 'Flexible Schedule',
      title: 'Flexible Scheduling',
      icon: <CalendarCheck size={22} />,
      desc: 'View your full wash history and upcoming appointments in one clean, easy-to-read calendar view.',
    },
    {
      id: 2, num: '03', label: 'Trusted Pros',
      title: 'Trusted Professionals',
      icon: <ShieldCheck size={22} />,
      desc: 'Every wash is handled by trained staff with premium equipment. Backed by a satisfaction guarantee.',
    },
    {
      id: 3, num: '04', label: 'Premium Packages',
      title: 'Premium Packages',
      icon: <Star size={22} />,
      desc: 'From a quick exterior rinse to full interior detailing — a tier for every need and budget.',
    },
  ];

  return (
    <PublicLayout>

      {/* ══════════════ HERO ══════════════ */}
      <section style={{
        position: 'relative', minHeight: '100vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        background: '#080808',
      }}>
        {/* Hero car image — fills bottom half */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/hero-car.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center 60%',
          backgroundRepeat: 'no-repeat',
        }} />

        {/* Dark gradient overlay — heavier at top so text is readable */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, #080808 0%, rgba(8,8,8,0.82) 40%, rgba(8,8,8,0.25) 65%, rgba(8,8,8,0.85) 100%)',
        }} />

        {/* Hero text — sits at the top */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: 'clamp(110px, 14vh, 180px) clamp(24px, 5vw, 80px) 0',
        }}>
          <p style={{
            fontSize: 12, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)', marginBottom: 24,
            animation: 'lx-fadeUp 0.7s ease both',
          }}>
            Premium Car Wash Services
          </p>
          <h1 style={{
            fontSize: 'clamp(48px, 7.5vw, 96px)', fontWeight: 800,
            lineHeight: 1.0, letterSpacing: '-0.04em', color: '#fff',
            maxWidth: 780, marginBottom: 32,
            animation: 'lx-fadeUp 0.7s 0.1s ease both',
          }}>
            Your car deserves<br />a brilliant shine.
          </h1>
          <p style={{
            fontSize: 'clamp(15px, 1.5vw, 18px)', color: 'rgba(255,255,255,0.55)',
            maxWidth: 460, lineHeight: 1.7, marginBottom: 44,
            animation: 'lx-fadeUp 0.7s 0.2s ease both',
          }}>
            Experience the prestige of a professionally detailed car.<br />
            Book in seconds. Pay on-site. No hidden fees.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', animation: 'lx-fadeUp 0.7s 0.3s ease both' }}>
            <Link to="/register" className="lx-btn-primary" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', fontSize: 15, fontWeight: 600,
              background: '#fff', color: '#080808', borderRadius: 10, textDecoration: 'none',
            }}>
              Book a Service
            </Link>
            <Link to="/login" className="lx-btn-ghost" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 28px', fontSize: 15, fontWeight: 500,
              color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 10, textDecoration: 'none', background: 'transparent',
            }}>
              Let's connect <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        {/* Bottom fade into next section */}
        <div style={{ height: 80, position: 'relative', zIndex: 2 }} />
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <div ref={statsRef} className="lx-reveal stats-grid-4" style={{
        background: '#0f0f0f',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '64px clamp(24px, 5vw, 80px)',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 40, textAlign: 'center',
      }}>
        {[
          { v: 2400, s: '+', l: 'Cars washed' },
          { v: 98,   s: '%', l: 'Satisfaction rate' },
          { v: 5,    s: ' min', l: 'Avg. booking time' },
          { v: 12,   s: '',  l: 'Service packages' },
        ].map(({ v, s, l }) => (
          <div key={l}>
            <div style={{ fontSize: 'clamp(36px,4vw,52px)', fontWeight: 800, letterSpacing: '-0.05em', color: '#fff' }}>
              <Counter target={v} suffix={s} />
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginTop: 8, fontWeight: 500, letterSpacing: '0.02em' }}>{l}</div>
          </div>
        ))}
      </div>

      {/* ══════════════ FEATURES (ACCORDION CARDS) ══════════════ */}
      <section style={{ padding: 'clamp(80px, 10vh, 120px) clamp(24px, 5vw, 80px)', background: '#080808' }}>
        <div ref={featuresRef} className="lx-reveal">
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
              Why ShineWash
            </p>
            <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1.1 }}>
              Everything you need.<br />Nothing you don't.
            </h2>
          </div>
          <AccordionCards cards={featureCards} />
        </div>
      </section>

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section style={{ background: '#0f0f0f', borderTop: '1px solid rgba(255,255,255,0.06)', padding: 'clamp(80px,10vh,120px) clamp(24px,5vw,80px)' }}>
        <div ref={stepsRef} className="lx-reveal" style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ marginBottom: 72 }}>
            <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 16 }}>
              Process
            </p>
            <h2 style={{ fontSize: 'clamp(28px,4vw,48px)', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1.1 }}>
              Three steps.<br />One clean car.
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { n: '01', t: 'Create an account', d: 'Sign up in seconds. No credit card needed — your account is free forever. ' },
              { n: '02', t: 'Choose & book',     d: 'Browse packages, pick a time that suits you, and confirm your booking instantly.' },
              { n: '03', t: 'Drive out shining.', d: 'Show up at your booked time. Our team handles the rest. Pay on-site when done.' },
            ].map(({ n, t, d }, i) => (
              <div key={n} className="lx-step-row" style={{
                display: 'flex', alignItems: 'flex-start', gap: 48,
                padding: '40px 0',
                borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}>
                <div style={{ fontSize: 'clamp(52px,6vw,80px)', fontWeight: 900, letterSpacing: '-0.06em', color: 'rgba(255,255,255,0.06)', lineHeight: 1, flexShrink: 0, width: 100, textAlign: 'right' }}>
                  {n}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 'clamp(18px,2vw,24px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#fff', marginBottom: 12 }}>{t}</h3>
                  <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section style={{
        padding: 'clamp(100px, 14vh, 160px) clamp(24px, 5vw, 80px)',
        textAlign: 'center', background: '#080808',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}>
        <h2 style={{ fontSize: 'clamp(36px,6vw,72px)', fontWeight: 800, letterSpacing: '-0.05em', color: '#fff', lineHeight: 1.05, marginBottom: 24 }}>
          Ready for a<br />cleaner car?
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 48, maxWidth: 440, margin: '0 auto 48px' }}>
          Join hundreds of customers who trust ShineWash<br />for a spotless ride, every time.
        </p>
        <Link to="/register" className="lx-btn-primary lx-btn-lg" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '16px 40px', fontSize: 16, fontWeight: 700,
          background: '#fff', color: '#080808', borderRadius: 12, textDecoration: 'none',
          letterSpacing: '-0.01em',
        }}>
          Get started — it's free <ArrowUpRight size={18} />
        </Link>
        <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontWeight: 600 }}>Sign in →</Link>
        </p>
      </section>

      {/* ══════════════ SCOPED STYLES ══════════════ */}
      <style>{`
        @keyframes lx-fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lx-fadeIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .lx-reveal {
          opacity: 0; transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .lx-revealed { opacity: 1 !important; transform: translateY(0) !important; }

        .lx-btn-primary { transition: all 0.2s ease !important; }
        .lx-btn-primary:hover {
          background: rgba(255,255,255,0.85) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 16px 48px rgba(255,255,255,0.12) !important;
        }
        .lx-btn-ghost { transition: all 0.2s ease !important; }
        .lx-btn-ghost:hover {
          background: rgba(255,255,255,0.06) !important;
          border-color: rgba(255,255,255,0.35) !important;
          transform: translateY(-2px) !important;
        }
        .lx-btn-lg:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 20px 60px rgba(255,255,255,0.15) !important;
        }
        @media (max-width: 600px) {
          .lx-step-row { flex-direction: column; gap: 16px !important; padding: 32px 0 !important; }
          .lx-step-row > div:first-child { text-align: left !important; width: 100% !important; }
        }
        .lx-step-row { transition: background 0.2s; cursor: default; border-radius: 4px; }
        .lx-step-row:hover { background: rgba(255,255,255,0.02); }
      `}</style>
    </PublicLayout>
  );
};

