import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { InputField } from '../components/common/InputField';
import { GraduationCap, User, Mail, Lock } from 'lucide-react';
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validators';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      validateSingleField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateSingleField(name, value);
  };

  const validateSingleField = (name, value) => {
    let err = null;
    switch (name) {
      case 'name':
        err = validateName(value);
        break;
      case 'email':
        err = validateEmail(value);
        break;
      case 'password':
        err = validatePassword(value);
        break;
      case 'confirmPassword':
        err = validateConfirmPassword(value, formData.password);
        break;
      default:
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameErr = validateName(formData.name);
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);
    const confirmErr = validateConfirmPassword(formData.confirmPassword, formData.password);

    if (nameErr || emailErr || passErr || confirmErr) {
      setErrors({
        name: nameErr,
        email: emailErr,
        password: passErr,
        confirmPassword: confirmErr,
      });
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password, formData.confirmPassword);
      showSuccess('Account registered successfully! Welcome.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        const serverErrs = {};
        err.errors.forEach((eItem) => {
          if (eItem.field) serverErrs[eItem.field] = eItem.message;
        });
        setErrors((prev) => ({ ...prev, ...serverErrs }));
      }
      showError(err.message || 'Registration failed. Please check your inputs.');
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
          maxWidth: '460px',
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
            Create an Account
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Register as an administrator to manage students
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <InputField
            id="register-name"
            name="name"
            label="Full Name"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            required
            icon={User}
          />

          <InputField
            id="register-email"
            name="email"
            type="email"
            label="Email Address"
            placeholder="john.doe@example.com"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            required
            icon={Mail}
          />

          <InputField
            id="register-password"
            name="password"
            type="password"
            label="Password"
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            required
            icon={Lock}
          />

          <InputField
            id="register-confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            placeholder="Re-enter password"
            value={formData.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.confirmPassword}
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#235817', fontWeight: 700 }}>
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
