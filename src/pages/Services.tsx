import React, { useEffect, useRef } from 'react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { MOCK_SERVICES } from '../types';
import { Droplets, Sparkles, Clock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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

export const Services: React.FC = () => {
  const headerRef = useReveal();
  const gridRef = useReveal();

  return (
    <PublicLayout>
      <div style={{ paddingTop: 140, paddingBottom: 100, background: '#080808', minHeight: '100vh', flex: 1 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)' }}>
          {/* Header */}
          <div ref={headerRef} className="lx-reveal" style={{ textAlign: 'center', marginBottom: 80 }}>
            <h1 style={{
              fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800,
              letterSpacing: '-0.04em', color: '#fff', marginBottom: 20,
            }}>
              Our Services
            </h1>
            <p style={{
              fontSize: 'clamp(16px, 2vw, 18px)', color: 'rgba(255,255,255,0.55)',
              maxWidth: 600, margin: '0 auto', lineHeight: 1.6,
            }}>
              From a quick exterior rinse to a comprehensive full detail. We have the perfect package to make your car shine.
            </p>
          </div>

          {/* Services Grid */}
          <div ref={gridRef} className="lx-reveal" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24,
          }}>
            {MOCK_SERVICES.map(svc => (
              <div key={svc.id} style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column',
                transition: 'transform 0.2s, background 0.2s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12, marginBottom: 24,
                  background: svc.category === 'wash' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(13, 148, 136, 0.15)',
                  color: svc.category === 'wash' ? '#3B82F6' : '#14B8A6',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {svc.category === 'wash' ? <Droplets size={24} /> : <Sparkles size={24} />}
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                  {svc.name}
                </h3>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, flex: 1, marginBottom: 32 }}>
                  {svc.description}
                </p>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.08)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                    <Clock size={14} /> ~{svc.duration_minutes} mins
                  </div>
                  <div style={{ fontWeight: 700, color: '#fff' }}>
                    {svc.price_info}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: 100 }}>
            <Link to="/register" className="lx-btn-primary lx-btn-lg" style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '16px 40px', fontSize: 16, fontWeight: 700,
              background: '#fff', color: '#080808', borderRadius: 12, textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}>
              Book a Service <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </div>
      <style>{`
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
      `}</style>
    </PublicLayout>
  );
};
