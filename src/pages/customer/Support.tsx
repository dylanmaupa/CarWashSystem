import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, MessageSquare, Phone, Mail, Ticket, CreditCard, CheckCircle } from 'lucide-react';
import { CustomerLayout } from '../../components/layout/CustomerLayout';

const FAQS = [
  { q: 'How do I book a service?', a: 'Click "Book Service" in the sidebar, then follow the 5-step booking wizard. Choose your service, enter your vehicle details, select a date and time, add any special instructions, and submit your request.' },
  { q: 'How do I reschedule my booking?', a: 'Go to "My Bookings", find your booking, and click the "Reschedule" button. You can select a new date and time. Your manager will confirm the new slot.' },
  { q: 'How do I cancel my booking?', a: 'Go to "My Bookings", find your upcoming booking, and click "Cancel". Pending or approved bookings can be cancelled at any time before the service date.' },
  { q: 'When do I pay for my service?', a: null, highlight: true },
  { q: 'How long does manager approval take?', a: 'Most booking requests are reviewed within a few hours during business hours. You\'ll receive a notification as soon as the manager approves or declines your request.' },
  { q: 'Can I save my vehicle for future bookings?', a: 'Yes! During the booking process you\'ll see an option to "Save this vehicle to my profile". You can also manage your saved vehicles in the Vehicles section — but it\'s always optional.' },
  { q: 'What happens after my booking is approved?', a: 'Once approved, the appointment is automatically added to both your calendar and the manager\'s service calendar. You\'ll receive a confirmation notification.' },
  { q: 'Do I need to enter my vehicle details every time?', a: 'Only if you choose to. You can save vehicles to your profile for quicker future bookings, or enter new vehicle details manually each time. Both options are always available.' },
];

export const Support: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [ticket, setTicket] = useState({ subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const filteredFaqs = FAQS.filter(faq =>
    faq.q.toLowerCase().includes(search.toLowerCase()) ||
    (faq.a && faq.a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <CustomerLayout>
      <div className="page-content">
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, var(--color-navy) 0%, #1D4ED8 100%)',
            borderRadius: 'var(--radius-xl)', padding: '40px 48px', marginBottom: 32,
            color: 'white', textAlign: 'center',
          }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 10 }}>Help & Support</h1>
            <p style={{ fontSize: 15, opacity: 0.75, marginBottom: 28 }}>
              Find answers, get in touch, or submit a support request.
            </p>
            <div style={{ position: 'relative', maxWidth: 500, margin: '0 auto' }}>
              <Search size={18} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)' }} />
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search help articles..."
                style={{
                  width: '100%', height: 48, background: 'rgba(255,255,255,0.15)',
                  border: '1.5px solid rgba(255,255,255,0.25)', borderRadius: 'var(--radius-full)',
                  padding: '0 20px 0 48px', fontSize: 15, color: 'white', outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Contact Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            {[
              { icon: <MessageSquare size={22} />, title: 'Live Chat', desc: 'Chat with our support team in real time.', action: 'Start Chat', color: 'var(--color-primary)', bg: 'var(--color-primary-light)' },
              { icon: <Phone size={22} />, title: 'Phone Support', desc: '+27 11 123 4567 — Mon–Sat, 7am–6pm', action: 'Call Now', color: 'var(--color-success)', bg: 'var(--color-success-light)' },
              { icon: <Mail size={22} />, title: 'Email Support', desc: 'support@shinewash.co.za', action: 'Send Email', color: '#7C3AED', bg: '#F5F3FF' },
            ].map(card => (
              <div key={card.title} className="card" style={{ textAlign: 'center', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'}>
                <div style={{ width: 52, height: 52, background: card.bg, borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', color: card.color }}>
                  {card.icon}
                </div>
                <div style={{ fontWeight: 700, color: 'var(--color-navy)', marginBottom: 6 }}>{card.title}</div>
                <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 14 }}>{card.desc}</div>
                <button className="btn btn-outline btn-sm btn-full">{card.action}</button>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
            {/* FAQs */}
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-navy)', marginBottom: 16 }}>
                Frequently Asked Questions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filteredFaqs.map((faq, i) => (
                  <div key={i} className="faq-item">
                    <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                      {faq.q}
                      {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    {openFaq === i && (
                      <div className="faq-answer">
                        {faq.highlight ? (
                          <div>
                            <div className="pay-onsite-notice" style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                              <CreditCard size={20} style={{ flexShrink: 0 }} />
                              <div>
                                <div style={{ fontWeight: 700, marginBottom: 3 }}>Payment is made On-Site at the car wash.</div>
                                <div>No online payment is required. Simply arrive for your appointment and pay after or during your service. We accept cash and card payments on-site.</div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          faq.a
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {filteredFaqs.length === 0 && (
                  <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                    No results found for "{search}"
                  </div>
                )}
              </div>
            </div>

            {/* Submit Ticket */}
            <div style={{ position: 'sticky', top: 88 }}>
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, background: 'var(--color-warning-light)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-warning)' }}>
                    <Ticket size={18} />
                  </div>
                  <h3 style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 15 }}>Submit a Ticket</h3>
                </div>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 18 }}>
                  Can't find an answer? Submit a support request and we'll get back to you within 24 hours.
                </p>
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'center' }}><CheckCircle size={40} color="var(--color-success)" /></div>
                    <div style={{ fontWeight: 700, color: 'var(--color-navy)', marginBottom: 6 }}>Ticket Submitted!</div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>We'll get back to you within 24 hours.</div>
                  </div>
                ) : (
                  <>
                    <div className="form-group" style={{ marginBottom: 14 }}>
                      <label className="form-label">Subject</label>
                      <input className="form-input" placeholder="Briefly describe your issue"
                        value={ticket.subject} onChange={e => setTicket({ ...ticket, subject: e.target.value })} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 16 }}>
                      <label className="form-label">Message</label>
                      <textarea className="form-textarea" rows={4} placeholder="Provide as much detail as possible..."
                        value={ticket.message} onChange={e => setTicket({ ...ticket, message: e.target.value })} />
                    </div>
                    <button className="btn btn-primary btn-full"
                      disabled={!ticket.subject || !ticket.message}
                      onClick={() => setSubmitted(true)}>
                      Submit Ticket
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
};
