import React from 'react';
import { useToast } from '../../hooks/useToast';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastIcon = ({ type }) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 size={20} color="var(--color-success)" />;
    case 'error':
      return <AlertCircle size={20} color="var(--color-danger)" />;
    case 'warning':
      return <AlertTriangle size={20} color="var(--color-warning)" />;
    default:
      return <Info size={20} color="var(--color-info)" />;
  }
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <ToastIcon type={toast.type} />
          <div style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>
            {toast.message}
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              padding: '2px',
            }}
            aria-label="Dismiss toast"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
