import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star, Edit2, Trash2, Car, Info, Sparkles, FileText, X } from 'lucide-react';
import { CustomerLayout } from '../../components/layout/CustomerLayout';
import type { SavedVehicle, VehicleType } from '../../types';
import { VEHICLE_TYPES } from '../../types';

const INITIAL_VEHICLES: SavedVehicle[] = [
  {
    id: 'v1', user_id: 'customer-1', make: 'Toyota', model: 'Fortuner',
    vehicle_type: 'suv', colour: 'White', registration_number: 'ABC 1234',
    year: 2022, notes: 'Focus on wheels and lower panels. Please use eco-friendly products.',
    is_default: true, created_at: new Date().toISOString(),
  },
  {
    id: 'v2', user_id: 'customer-1', make: 'BMW', model: '3 Series',
    vehicle_type: 'sedan', colour: 'Black', registration_number: 'XYZ 5678',
    year: 2021, notes: 'Extra care on the interior leather. Remove seat covers before cleaning.',
    is_default: false, created_at: new Date().toISOString(),
  },
];

type VehicleFormData = Omit<SavedVehicle, 'id' | 'user_id' | 'created_at'>;
const EMPTY_FORM: VehicleFormData = {
  make: '', model: '', vehicle_type: 'sedan', colour: '',
  registration_number: '', year: null, notes: null, is_default: false,
};

const VEHICLE_ICONS: Record<VehicleType, React.ReactNode> = {
  sedan: <Car size={20} />,
  hatchback: <Car size={20} />,
  suv: <Car size={20} />,
  pickup: <Car size={20} />,
  van: <Car size={20} />,
  other: <Car size={20} />,
};

export const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<SavedVehicle[]>(INITIAL_VEHICLES);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<VehicleFormData>(EMPTY_FORM);

  const openAdd = () => { setForm(EMPTY_FORM); setEditId(null); setShowForm(true); };
  const openEdit = (v: SavedVehicle) => {
    setForm({ make: v.make, model: v.model, vehicle_type: v.vehicle_type, colour: v.colour, registration_number: v.registration_number, year: v.year, notes: v.notes, is_default: v.is_default });
    setEditId(v.id); setShowForm(true);
  };
  const handleSave = () => {
    if (editId) {
      setVehicles(prev => prev.map(v => v.id === editId ? { ...v, ...form } : v));
    } else {
      const newV: SavedVehicle = { ...form, id: `v${Date.now()}`, user_id: 'customer-1', created_at: new Date().toISOString() };
      setVehicles(prev => [...prev, newV]);
    }
    setShowForm(false);
  };
  const handleRemove = (id: string) => setVehicles(prev => prev.filter(v => v.id !== id));
  const handleSetDefault = (id: string) => setVehicles(prev => prev.map(v => ({ ...v, is_default: v.id === id })));

  return (
    <CustomerLayout>
      <div className="page-content">
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--color-surface) 60%, var(--color-primary-light) 100%)',
          border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)',
          padding: '28px 32px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>VEHICLES</div>
            <h1 className="page-title">Manage Your Vehicles</h1>
            <p className="page-subtitle">Save vehicles for a faster booking experience.</p>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ background: 'var(--color-primary-light)', border: '1px solid var(--color-primary-mid)', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: 'var(--color-primary)', display: 'flex', gap: 8, alignItems: 'center', maxWidth: 220 }}>
              <Sparkles size={16} color="var(--color-primary)" style={{ flexShrink: 0 }} /> Your default vehicle will be suggested in future bookings.
            </div>
            <button className="btn btn-primary" onClick={openAdd}>
              <Plus size={16} /> Add New Vehicle
            </button>
          </div>
        </div>

        {/* Optional note */}
        <div style={{
          background: 'var(--color-warning-light)', border: '1px solid var(--color-warning-mid)',
          borderRadius: 'var(--radius-md)', padding: '12px 16px', marginBottom: 20,
          display: 'flex', gap: 10, alignItems: 'center', fontSize: 13, color: '#92400E',
        }}>
          <Info size={16} style={{ flexShrink: 0 }} />
          You can always enter a <strong style={{ margin: '0 3px' }}>different vehicle manually</strong> when making a booking. Saved vehicles are optional and for your convenience only.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: showForm ? '1fr 380px' : '1fr', gap: 24 }}>
          {/* Vehicle List */}
          <div>
            <div style={{ fontWeight: 700, color: 'var(--color-navy)', marginBottom: 16 }}>
              Your Vehicles ({vehicles.length})
            </div>
            {vehicles.length === 0 ? (
              <div className="card">
                <div className="empty-state">
                  <div className="empty-state-icon"><Car size={28} /></div>
                  <div className="empty-state-title">No saved vehicles</div>
                  <div className="empty-state-text">Save a vehicle to make future bookings faster.</div>
                  <button className="btn btn-primary" onClick={openAdd}>Add Your First Vehicle</button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {vehicles.map(v => (
                  <div key={v.id} className="vehicle-card" style={{ border: `2px solid ${v.is_default ? 'var(--color-primary)' : 'var(--color-border)'}`, background: v.is_default ? 'var(--color-primary-light)' : 'white' }}>
                    {/* Default badge */}
                    {v.is_default && (
                      <div style={{ position: 'absolute', top: 14, left: 14, display: 'flex', alignItems: 'center', gap: 4, background: 'var(--color-primary)', color: 'white', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                        <Star size={11} fill="white" /> Default
                      </div>
                    )}

                    {/* Vehicle Icon */}
                    <div style={{ width: 80, height: 70, background: v.is_default ? 'white' : 'var(--color-bg)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', flexShrink: 0 }}>
                      <Car size={32} />
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, paddingTop: v.is_default ? 20 : 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 17, color: 'var(--color-navy)', marginBottom: 4 }}>
                        {v.year ? `${v.year} ` : ''}{v.make} {v.model}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--color-text-muted)' }}>
                          <span style={{ width: 14, height: 14, borderRadius: '50%', background: v.colour.toLowerCase() === 'white' ? '#F1F5F9' : v.colour.toLowerCase() === 'black' ? '#1E293B' : v.colour.toLowerCase() === 'silver' ? '#94A3B8' : v.colour.toLowerCase() === 'blue' ? 'var(--color-primary)' : '#64748B', border: '1px solid var(--color-border)', display: 'inline-block' }} />
                          {v.colour}
                        </span>
                        <span style={{ fontSize: 13, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Car size={13} /> {VEHICLE_TYPES.find(t => t.value === v.vehicle_type)?.label}
                        </span>
                      </div>
                      <div style={{
                        display: 'inline-flex', padding: '3px 12px', background: 'var(--color-navy)',
                        color: 'white', borderRadius: 5, fontSize: 12, fontWeight: 800, letterSpacing: 1.5, marginBottom: 8,
                      }}>
                        {v.registration_number}
                      </div>
                      {v.notes && (
                        <div style={{ fontSize: 12, color: 'var(--color-text-muted)', lineHeight: 1.4, display: 'flex', gap: 6, alignItems: 'center' }}>
                          <FileText size={14} color="var(--color-text-muted)" style={{ flexShrink: 0 }} /> {v.notes}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
                      {!v.is_default && (
                        <button className="btn btn-outline btn-sm" onClick={() => handleSetDefault(v.id)}>
                          <Star size={13} /> Set as Default
                        </button>
                      )}
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(v)}>
                        <Edit2 size={13} /> Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleRemove(v.id)}>
                        <Trash2 size={13} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div style={{ position: 'sticky', top: 88 }}>
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h3 style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 16 }}>
                    {editId ? 'Edit Vehicle' : 'Add New Vehicle'}
                  </h3>
                  <button className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}><X size={16} /></button>
                </div>

                <div className="form-group" style={{ marginBottom: 16 }}>
                  <label className="form-label">Vehicle Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {VEHICLE_TYPES.map(vt => (
                      <button key={vt.value} type="button"
                        onClick={() => setForm({ ...form, vehicle_type: vt.value })}
                        className={`vehicle-type-btn ${form.vehicle_type === vt.value ? 'selected' : ''}`}>
                        <span style={{ fontSize: 20 }}>{VEHICLE_ICONS[vt.value]}</span>
                        {vt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-grid-2" style={{ marginBottom: 14 }}>
                  <div className="form-group">
                    <label className="form-label">Make</label>
                    <input className="form-input" placeholder="Toyota" value={form.make}
                      onChange={e => setForm({ ...form, make: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Model</label>
                    <input className="form-input" placeholder="Fortuner" value={form.model}
                      onChange={e => setForm({ ...form, model: e.target.value })} />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label">Year <span className="form-label-optional">(Optional)</span></label>
                  <input className="form-input" placeholder="2022" type="number"
                    value={form.year || ''}
                    onChange={e => setForm({ ...form, year: e.target.value ? parseInt(e.target.value) : null })} />
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label">Registration Number</label>
                  <input className="form-input" placeholder="ABC 1234"
                    value={form.registration_number}
                    onChange={e => setForm({ ...form, registration_number: e.target.value.toUpperCase() })} />
                </div>

                <div className="form-group" style={{ marginBottom: 14 }}>
                  <label className="form-label">Colour</label>
                  <input className="form-input" placeholder="White"
                    value={form.colour}
                    onChange={e => setForm({ ...form, colour: e.target.value })} />
                </div>

                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="form-label">Service Notes <span className="form-label-optional">(Optional)</span></label>
                  <textarea className="form-textarea" rows={3}
                    placeholder="e.g. Focus on wheels, no harsh chemicals..."
                    value={form.notes || ''}
                    onChange={e => setForm({ ...form, notes: e.target.value || null })} />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSave}
                    disabled={!form.make || !form.model || !form.registration_number}>
                    {editId ? 'Save Changes' : 'Save Vehicle'}
                  </button>
                  <button className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};
