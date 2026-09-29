import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { InputField } from '../components/common/InputField';
import { GraduationCap, Mail, Lock, Sparkles } from 'lucide-react';
import { validateEmail, validatePassword } from '../utils/validators';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      if (name === 'email') setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
      if (name === 'password') setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === 'email') setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    if (name === 'password') setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
  };

  const handleFillDemo = () => {
    setFormData({
      email: 'admin@studentms.com',
      password: 'Admin@123456',
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      setTouched({ email: true, password: true });
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      showSuccess('Welcome back! Logged in successfully.');
      navigate(from, { replace: true });
    } catch (err) {
      showError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: '#f8fafc',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          background: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
          padding: '2.5rem 2rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '8px',
              background: '#ecfdf5',
              color: '#235817',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              border: '1px solid #a7f3d0',
            }}
          >
            <GraduationCap size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Welcome Back
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Sign in to access your student management dashboard
          </p>
        </div>

        {/* Demo Account Quick Box */}
        <div
          style={{
            background: '#f1f5f9',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '0.75rem 1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8125rem',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>Demo Account</div>
            <div style={{ color: '#64748b' }}>admin@studentms.com</div>
          </div>
          <button
            type="button"
            className="btn-dark-green"
            onClick={handleFillDemo}
            style={{ padding: '0.375rem 0.75rem', fontSize: '0.8125rem' }}
          >
            <Sparkles size={14} />
            <span>Auto Fill</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <InputField
            id="login-email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="admin@studentms.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            required
            icon={Mail}
          />

          <InputField
            id="login-password"
            name="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            required
            icon={Lock}
          />

          <button
            type="submit"
            className="btn-dark-green"
            disabled={isLoading}
            style={{
              width: '100%',
              marginTop: '0.5rem',
              padding: '0.75rem',
              fontSize: '0.9375rem',
              fontWeight: 700,
            }}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#235817', fontWeight: 700 }}>
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
