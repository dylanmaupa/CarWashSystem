import React, { useEffect, useRef } from 'react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { MOCK_SERVICES } from '../types';
import { Check } from 'lucide-react';
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

export const Pricing: React.FC = () => {
  const headerRef = useReveal();
  const pricingRef = useReveal();

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
              Simple, Transparent Pricing
            </h1>
            <p style={{
              fontSize: 'clamp(16px, 2vw, 18px)', color: 'rgba(255,255,255,0.55)',
              maxWidth: 600, margin: '0 auto', lineHeight: 1.6,
            }}>
              No hidden fees, no surprises. Choose the package that suits your car's needs.
            </p>
          </div>

          {/* Pricing Grid */}
          <div ref={pricingRef} className="lx-reveal" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24,
          }}>
            {MOCK_SERVICES.map((svc) => {
              const isPopular = svc.category === 'wash' && svc.duration_minutes === 45; // Just making one "Popular"
              return (
                <div key={svc.id} style={{
                  background: isPopular ? 'linear-gradient(160deg, #1a1a1a 0%, #111 100%)' : 'rgba(255,255,255,0.03)',
                  border: isPopular ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 24, padding: '40px 32px', display: 'flex', flexDirection: 'column',
                  position: 'relative', overflow: 'hidden',
                }}>
                  {isPopular && (
                    <div style={{
                      position: 'absolute', top: 16, right: 16,
                      background: 'rgba(255,255,255,0.1)', color: '#fff',
                      fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
                    }}>
                      Most Popular
                    </div>
                  )}
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                    {svc.name}
                  </h3>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 24 }}>
                    {svc.price_info}
                  </div>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 32 }}>
                    {svc.description}
                  </p>
                  
                  {/* Mock Features list for visual consistency */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                    <div style={{ display: 'flex', gap: 12, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                      <Check size={18} color={svc.category === 'wash' ? '#3B82F6' : '#14B8A6'} style={{ flexShrink: 0 }} />
                      Takes ~{svc.duration_minutes} minutes
                    </div>
                    <div style={{ display: 'flex', gap: 12, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                      <Check size={18} color={svc.category === 'wash' ? '#3B82F6' : '#14B8A6'} style={{ flexShrink: 0 }} />
                      Professional staff
                    </div>
                    <div style={{ display: 'flex', gap: 12, color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                      <Check size={18} color={svc.category === 'wash' ? '#3B82F6' : '#14B8A6'} style={{ flexShrink: 0 }} />
                      Premium products used
                    </div>
                  </div>

                  <Link to="/register" className={isPopular ? "lx-btn-primary" : "lx-btn-ghost"} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '14px 0', fontSize: 15, fontWeight: 600,
                    background: isPopular ? '#fff' : 'transparent',
                    color: isPopular ? '#080808' : 'rgba(255,255,255,0.8)',
                    border: isPopular ? 'none' : '1px solid rgba(255,255,255,0.18)',
                    borderRadius: 12, textDecoration: 'none', width: '100%',
                  }}>
                    Select Package
                  </Link>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: 80, padding: '40px 24px', background: 'rgba(255,255,255,0.03)', borderRadius: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
             <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 16 }}>Need a custom quote?</h2>
             <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
               For commercial fleets or specialized restoration work, please contact us directly.
             </p>
             <Link to="/support" style={{ color: '#fff', textDecoration: 'underline', fontWeight: 600 }}>Contact our team</Link>
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
        .lx-btn-ghost { transition: all 0.2s ease !important; }
        .lx-btn-ghost:hover {
          background: rgba(255,255,255,0.06) !important;
          border-color: rgba(255,255,255,0.35) !important;
          transform: translateY(-2px) !important;
        }
      `}</style>
    </PublicLayout>
  );
};
