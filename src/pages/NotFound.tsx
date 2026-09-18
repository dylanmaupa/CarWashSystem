import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--color-bg, #080808)',
      color: 'var(--color-text, #fff)',
      textAlign: 'center',
      padding: '24px'
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: 'rgba(255, 255, 255, 0.05)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24, color: 'var(--color-danger, #EF4444)'
      }}>
        <AlertCircle size={32} />
      </div>
      <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 800, marginBottom: 16, letterSpacing: '-0.03em' }}>
        Page Not Found
      </h1>
      <p style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.6)', maxWidth: 400, marginBottom: 32, lineHeight: 1.6 }}>
        The page you are looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Link to="/" style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '12px 24px', background: 'var(--color-primary, #fff)',
        color: 'var(--color-bg, #080808)', fontWeight: 600,
        borderRadius: 12, textDecoration: 'none'
      }}>
        <ArrowLeft size={18} /> Back to Home
      </Link>
    </div>
  );
};
