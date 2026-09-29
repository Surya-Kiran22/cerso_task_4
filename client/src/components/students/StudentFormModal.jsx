import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { InputField } from '../common/InputField';
import { SelectField } from '../common/SelectField';
import { Button } from '../common/Button';
import { User, Mail, Phone, BookOpen, Calendar } from 'lucide-react';
import { COURSES, YEARS } from '../../utils/constants';
import {
  validateName,
  validateEmail,
  validatePhone,
  validateCourse,
  validateYear,
} from '../../utils/validators';

export const StudentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
  serverErrors = null,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    year: '',
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        course: initialData.course || '',
        year: initialData.year || '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        course: '',
        year: '',
      });
    }
    setTouched({});
    setErrors({});
  }, [initialData, isOpen]);

  // Sync server validation errors into field error state
  useEffect(() => {
    if (serverErrors && Array.isArray(serverErrors)) {
      const newErrors = {};
      serverErrors.forEach((err) => {
        if (err.field) {
          newErrors[err.field] = err.message;
        }
      });
      setErrors((prev) => ({ ...prev, ...newErrors }));
    }
  }, [serverErrors]);

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
    let error = null;
    switch (name) {
      case 'name':
        error = validateName(value);
        break;
      case 'email':
        error = validateEmail(value);
        break;
      case 'phone':
        error = validatePhone(value);
        break;
      case 'course':
        error = validateCourse(value);
        break;
      case 'year':
        error = validateYear(value);
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const validateAll = () => {
    const nameErr = validateName(formData.name);
    const emailErr = validateEmail(formData.email);
    const phoneErr = validatePhone(formData.phone);
    const courseErr = validateCourse(formData.course);
    const yearErr = validateYear(formData.year);

    const newErrors = {
      name: nameErr,
      email: emailErr,
      phone: phoneErr,
      course: courseErr,
      year: yearErr,
    };

    setErrors(newErrors);
    setTouched({ name: true, email: true, phone: true, course: true, year: true });

    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    onSubmit({
      ...formData,
      year: Number(formData.year),
    });
  };

  const isEdit = !!initialData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Student Details' : 'Add New Student'}
      maxWidth="540px"
    >
      <form onSubmit={handleSubmit} noValidate>
        <InputField
          id="student-name"
          name="name"
          label="Full Name"
          placeholder="e.g. Alex Johnson"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.name}
          required
          icon={User}
        />

        <InputField
          id="student-email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="e.g. alex.j@university.edu"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          required
          icon={Mail}
        />

        <InputField
          id="student-phone"
          name="phone"
          type="tel"
          label="Phone Number (10 Digits)"
          placeholder="e.g. 9876543210"
          value={formData.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone}
          required
          icon={Phone}
          maxLength={10}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <SelectField
            id="student-course"
            name="course"
            label="Course / Field of Study"
            placeholder="Select Course"
            value={formData.course}
            onChange={handleChange}
            onBlur={handleBlur}
            options={COURSES}
            error={errors.course}
            required
          />

          <SelectField
            id="student-year"
            name="year"
            label="Academic Year"
            placeholder="Select Year"
            value={formData.year}
            onChange={handleChange}
            onBlur={handleBlur}
            options={YEARS}
            error={errors.year}
            required
          />
        </div>

        <div
          style={{
            display: 'flex',
            justify: 'flex-end',
            gap: '0.75rem',
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEdit ? 'Save Changes' : 'Create Student'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
