import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { AlertCircle, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <div className="card" style={{ maxWidth: '480px', padding: '3rem 2rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-danger-bg)',
            color: 'var(--color-danger)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <AlertCircle size={36} />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, color: 'var(--color-primary)' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, margin: '0.5rem 0' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', marginBottom: '2rem' }}>
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" icon={Home}>
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
