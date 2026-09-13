import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, Eye, EyeOff, Mail, Lock, User, Key, CreditCard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await login(email, password);
    setLoading(false);
    if (error) { setError(error); return; }
    // Redirect based on role stored in auth
    const stored = localStorage.getItem('shinewash_demo_user');
    if (stored) {
      const user = JSON.parse(stored);
      navigate(user.role === 'manager' ? '/manager' : '/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const fillDemo = (role: 'customer' | 'manager') => {
    if (role === 'customer') {
      setEmail('alex.carter@email.com');
      setPassword('demo123');
    } else {
      setEmail('mike.chen@shinewash.com');
      setPassword('demo123');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'linear-gradient(135deg, #F0F5FF 0%, #E8F0FE 50%, #EFF6FF 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
    }}>
      {/* Background decoration */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-5%', width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(13,148,136,0.06) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>

      <div style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 60, height: 60, background: 'var(--color-primary)',
            borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
          }}>
            <Droplets size={28} color="white" />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 4 }}>
            Shine<span style={{ color: 'var(--color-primary)' }}>Wash</span>
          </h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 14 }}>Clean Cars. Brighter Days.</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'white', borderRadius: 20, boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
          border: '1px solid var(--color-border)', padding: 40,
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color-navy)', marginBottom: 6 }}>
            Welcome back
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 28 }}>
            Sign in to manage your bookings
          </p>

          {/* Demo Badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
            <button
              onClick={() => fillDemo('customer')}
              style={{
                flex: 1, padding: '8px 12px', background: 'var(--color-primary-light)',
                border: '1px solid var(--color-primary-mid)', borderRadius: 8,
                fontSize: 12, fontWeight: 600, color: 'var(--color-primary)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <User size={14} /> Demo Customer
            </button>
            <button
              onClick={() => fillDemo('manager')}
              style={{
                flex: 1, padding: '8px 12px', background: '#F5F3FF',
                border: '1px solid #DDD6FE', borderRadius: 8,
                fontSize: 12, fontWeight: 600, color: '#7C3AED', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <Key size={14} /> Demo Manager
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {error && (
              <div style={{
                background: 'var(--color-danger-light)', border: '1px solid var(--color-danger-mid)',
                borderRadius: 8, padding: '10px 14px', fontSize: 13, color: 'var(--color-danger)',
              }}>
                {error}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--color-text-subtle)',
                }} />
                <input
                  type="email"
                  className="form-input"
                  style={{ paddingLeft: 42 }}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--color-text-subtle)',
                }} />
                <input
                  type={showPw ? 'text' : 'password'}
                  className="form-input"
                  style={{ paddingLeft: 42, paddingRight: 44 }}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'var(--color-text-subtle)', cursor: 'pointer',
                  }}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--color-text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
              Create one
            </Link>
          </div>
        </div>

        {/* Pay on-site notice */}
        <div style={{
          textAlign: 'center', marginTop: 20, padding: '10px 16px',
          background: 'var(--color-success-light)', borderRadius: 8,
          border: '1px solid var(--color-success-mid)', fontSize: 12, color: '#134E4A',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <CreditCard size={14} /> No online payment required — all payments are made on-site at the car wash
        </div>
      </div>
    </div>
  );
};
