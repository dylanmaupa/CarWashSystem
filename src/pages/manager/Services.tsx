import React, { useState } from 'react';
import { Plus, Edit2, ToggleLeft, ToggleRight, Clock, Check, CreditCard, Droplets, Sparkles, X } from 'lucide-react';
import { ManagerLayout } from '../../components/layout/ManagerLayout';
import { MOCK_SERVICES } from '../../types';
import type { Service } from '../../types';

export const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', category: 'wash' as 'wash' | 'detailing', duration_minutes: 30, price_info: '' });

  const toggle = (id: string) => setServices(prev => prev.map(s => s.id === id ? { ...s, is_active: !s.is_active } : s));
  const openEdit = (s: Service) => { setForm({ name: s.name, description: s.description, category: s.category, duration_minutes: s.duration_minutes, price_info: s.price_info || '' }); setEditId(s.id); setShowAdd(true); };
  const handleSave = () => {
    if (editId) {
      setServices(prev => prev.map(s => s.id === editId ? { ...s, ...form } : s));
    } else {
      const newSvc: Service = { ...form, id: `svc-${Date.now()}`, is_active: true, created_at: new Date().toISOString() };
      setServices(prev => [...prev, newSvc]);
    }
    setShowAdd(false); setEditId(null);
  };

  const categoryColor = (cat: string) => cat === 'wash' ? 'var(--color-primary)' : 'var(--color-success)';
  const categoryBg = (cat: string) => cat === 'wash' ? 'var(--color-primary-light)' : 'var(--color-success-light)';

  return (
    <ManagerLayout>
      <div className="page-content">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <div>
            <h1 className="page-title">Services</h1>
            <p className="page-subtitle">Manage available services, durations, and pricing information.</p>
          </div>
          <button className="btn btn-primary" onClick={() => { setForm({ name: '', description: '', category: 'wash', duration_minutes: 30, price_info: '' }); setEditId(null); setShowAdd(true); }}>
            <Plus size={16} /> Add Service
          </button>
        </div>

        {/* Pay on-site banner */}
        <div className="pay-onsite-notice" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
          <CreditCard size={22} style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 700 }}>Pricing is for informational purposes only</div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>All payments are made on-site at the car wash. No online checkout or payment processing is used.</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: showAdd ? '1fr 380px' : '1fr', gap: 24 }}>
          {/* Service Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {services.map(svc => (
              <div key={svc.id} style={{
                background: 'white', border: `1.5px solid ${svc.is_active ? 'var(--color-border)' : 'var(--color-danger-mid)'}`,
                borderRadius: 'var(--radius-lg)', padding: 24, position: 'relative',
                boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s', opacity: svc.is_active ? 1 : 0.65,
              }}>
                {/* Active/Inactive badge */}
                <div style={{ position: 'absolute', top: 16, right: 16 }}>
                  <span className={`badge ${svc.is_active ? 'badge-approved' : 'badge-cancelled'}`}>
                    {svc.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Icon + Name */}
                <div style={{ width: 52, height: 52, background: categoryBg(svc.category), borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                  {svc.category === 'wash' ? <Droplets size={24} color="var(--color-primary)" /> : <Sparkles size={24} color="var(--color-success)" />}
                </div>

                <h3 style={{ fontWeight: 800, color: 'var(--color-navy)', fontSize: 16, marginBottom: 6 }}>{svc.name}</h3>
                <p style={{ fontSize: 13, color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: 14 }}>{svc.description}</p>

                {/* Meta */}
                <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--color-text-muted)' }}>
                    <Clock size={14} /> ~{svc.duration_minutes} min
                  </div>
                  {svc.price_info && (
                    <div style={{ fontSize: 13, fontWeight: 700, color: categoryColor(svc.category) }}>
                      {svc.price_info} <span style={{ fontWeight: 400, fontSize: 11, color: 'var(--color-text-muted)' }}>(on-site)</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 0, padding: '4px', background: 'var(--color-bg)', borderRadius: 8 }}>
                  <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 700, background: categoryBg(svc.category), color: categoryColor(svc.category) }}>
                    {svc.category === 'wash' ? 'Car Wash' : 'Detailing'}
                  </span>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => openEdit(svc)}>
                    <Edit2 size={13} /> Edit
                  </button>
                  <button className={`btn btn-sm ${svc.is_active ? 'btn-danger' : 'btn-success'}`}
                    onClick={() => toggle(svc.id)}>
                    {svc.is_active ? <ToggleLeft size={13} /> : <ToggleRight size={13} />}
                    {svc.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}

            {/* Add New Card */}
            <div onClick={() => setShowAdd(true)}
              style={{
                border: '2px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 24,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', gap: 10, minHeight: 200, transition: 'all 0.2s',
                background: 'var(--color-bg)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-primary)'; (e.currentTarget as HTMLElement).style.background = 'var(--color-primary-light)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border)'; (e.currentTarget as HTMLElement).style.background = 'var(--color-bg)'; }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
                <Plus size={24} />
              </div>
              <div style={{ fontWeight: 700, color: 'var(--color-navy)' }}>Add New Service</div>
              <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Create a new service offering</div>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showAdd && (
            <div style={{ position: 'sticky', top: 88 }}>
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h3 style={{ fontWeight: 700, color: 'var(--color-navy)' }}>{editId ? 'Edit Service' : 'Add New Service'}</h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}><X size={16} /></button>
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label">Service Name</label>
                  <input className="form-input" placeholder="e.g. Standard Car Wash"
                    value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" rows={3} placeholder="Describe what this service includes..."
                    value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label">Category</label>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {[{ v: 'wash', label: 'Car Wash', icon: <Droplets size={14} color="var(--color-primary)" /> }, { v: 'detailing', label: 'Detailing', icon: <Sparkles size={14} color="var(--color-success)" /> }].map(cat => (
                      <button key={cat.v} type="button"
                        onClick={() => setForm({ ...form, category: cat.v as 'wash' | 'detailing' })}
                        style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: `2px solid ${form.category === cat.v ? (cat.v === 'wash' ? 'var(--color-primary)' : 'var(--color-success)') : 'var(--color-border)'}`, background: form.category === cat.v ? (cat.v === 'wash' ? 'var(--color-primary-light)' : 'var(--color-success-light)') : 'white', fontWeight: 600, fontSize: 13, cursor: 'pointer', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        {cat.icon} {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginBottom: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Duration (min)</label>
                    <input className="form-input" type="number" placeholder="30"
                      value={form.duration_minutes}
                      onChange={e => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 30 })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Price Info <span className="form-label-optional">(Display only)</span></label>
                    <input className="form-input" placeholder="From R150"
                      value={form.price_info} onChange={e => setForm({ ...form, price_info: e.target.value })} />
                  </div>
                </div>

                <div style={{ background: 'var(--color-warning-light)', border: '1px solid var(--color-warning-mid)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: '#92400E', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <CreditCard size={14} style={{ flexShrink: 0 }} /> Price is for display purposes only. Customers pay on-site — no online checkout.
                </div>

                <button className="btn btn-primary btn-full" onClick={handleSave} disabled={!form.name}>
                  <Check size={16} /> {editId ? 'Save Changes' : 'Create Service'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ManagerLayout>
  );
};
