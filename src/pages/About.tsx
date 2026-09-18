import React, { useEffect, useRef } from 'react';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Sparkles, ShieldCheck, Clock, Users } from 'lucide-react';

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

export const About: React.FC = () => {
  const headerRef = useReveal();
  const contentRef = useReveal();
  const valuesRef = useReveal();

  return (
    <PublicLayout>
      <div style={{ paddingTop: 140, paddingBottom: 100, background: '#080808', minHeight: '100vh', flex: 1 }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)' }}>
          {/* Header */}
          <div ref={headerRef} className="lx-reveal" style={{ textAlign: 'center', marginBottom: 80 }}>
            <h1 style={{
              fontSize: 'clamp(40px, 6vw, 64px)', fontWeight: 800,
              letterSpacing: '-0.04em', color: '#fff', marginBottom: 20,
            }}>
              About ShineWash
            </h1>
            <p style={{
              fontSize: 'clamp(16px, 2vw, 18px)', color: 'rgba(255,255,255,0.55)',
              maxWidth: 600, margin: '0 auto', lineHeight: 1.6,
            }}>
              Redefining the car wash experience with premium service, expert care, and uncompromising quality.
            </p>
          </div>

          {/* Main Content */}
          <div ref={contentRef} className="lx-reveal" style={{ display: 'flex', flexDirection: 'column', gap: 60, marginBottom: 100 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40, alignItems: 'center' }}>
              <div>
                <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 24, letterSpacing: '-0.02em' }}>
                  Who We Are
                </h2>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 16 }}>
                  ShineWash was founded with a simple goal: to provide a hassle-free, professional car wash experience that respects your time and your vehicle.
                </p>
                <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
                  We understand that a car is more than just a mode of transport; it's an investment. Our team of dedicated professionals uses industry-leading equipment and premium products to ensure your vehicle gets the care it deserves.
                </p>
              </div>
              <div style={{
                height: 400, borderRadius: 24, background: 'rgba(255,255,255,0.05)',
                backgroundImage: 'url(/hero-car.jpg)', backgroundSize: 'cover', backgroundPosition: 'center',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              }} />
            </div>
          </div>

          {/* Core Values */}
          <div ref={valuesRef} className="lx-reveal">
            <h2 style={{ fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 40, letterSpacing: '-0.02em', textAlign: 'center' }}>
              Our Core Values
            </h2>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24,
            }}>
              {[
                { icon: <Sparkles size={24} />, title: 'Excellence', desc: 'We deliver nothing short of perfection, down to the finest detail.' },
                { icon: <ShieldCheck size={24} />, title: 'Trust', desc: 'Your vehicle is safe in the hands of our fully insured, trained staff.' },
                { icon: <Clock size={24} />, title: 'Efficiency', desc: 'We value your time with a streamlined booking and wash process.' },
                { icon: <Users size={24} />, title: 'Community', desc: 'Proudly serving and employing from our local community.' },
              ].map((val, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column',
                }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12, marginBottom: 24,
                    background: 'rgba(255, 255, 255, 0.1)', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {val.icon}
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12 }}>
                    {val.title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                    {val.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .lx-reveal {
          opacity: 0; transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .lx-revealed { opacity: 1 !important; transform: translateY(0) !important; }
      `}</style>
    </PublicLayout>
  );
};
