import React from 'react';
import { AlertCircle } from 'lucide-react';

export const InputField = ({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon: Icon = null,
  helperText = null,
  className = '',
  style = {},
  ...props
}) => {
  const inputId = id || name;
  const errorId = `${inputId}-error`;

  return (
    <div className={`form-group ${className}`} style={{ marginBottom: '1.25rem', ...style }}>
      {label && (
        <label
          htmlFor={inputId}
          className="form-label"
          style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.375rem' }}
        >
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
        {Icon && (
          <div
            style={{
              position: 'absolute',
              left: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              color: '#64748b',
              zIndex: 5,
            }}
          >
            <Icon size={18} />
          </div>
        )}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`form-input ${error ? 'is-invalid' : ''}`}
          style={{
            width: '100%',
            padding: '0.625rem 0.875rem',
            paddingLeft: Icon ? '2.5rem' : '0.875rem',
            borderRadius: '4px',
            border: error ? '1px solid #ef4444' : '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            color: '#0f172a',
            fontSize: '0.9375rem',
          }}
          {...props}
        />
      </div>
      {error && (
        <div id={errorId} className="form-error" role="alert" style={{ color: '#ef4444', fontSize: '0.8125rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
      {!error && helperText && <small style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>{helperText}</small>}
    </div>
  );
};
