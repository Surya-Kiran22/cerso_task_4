import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { User, Mail, Phone, BookOpen, Calendar, ShieldCheck, Clock } from 'lucide-react';
import { formatPhone, formatDate, getYearOrdinal } from '../../utils/formatters';

export const StudentDetailModal = ({ isOpen, onClose, student, onEdit }) => {
  if (!student) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Student Details" maxWidth="500px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '1rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-primary-light)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 700,
            }}
          >
            {student.name ? student.name[0].toUpperCase() : 'S'}
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{student.name}</h3>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
              <span className="badge badge-course">{student.course}</span>
              <span className="badge badge-year">{getYearOrdinal(student.year)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Mail size={18} color="var(--color-primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Email Address</div>
              <div style={{ fontWeight: 500 }}>{student.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Phone size={18} color="var(--color-primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Phone Number</div>
              <div style={{ fontWeight: 500, fontFamily: 'monospace' }}>{formatPhone(student.phone)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={18} color="var(--color-primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Registration Date</div>
              <div style={{ fontWeight: 500 }}>{formatDate(student.createdAt)}</div>
            </div>
          </div>

          {student.createdBy && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <ShieldCheck size={18} color="var(--color-success)" />
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Added By</div>
                <div style={{ fontWeight: 500 }}>
                  {student.createdBy.name || 'System Admin'} ({student.createdBy.email || 'N/A'})
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justify: 'flex-end',
            gap: '0.75rem',
            marginTop: '1rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          {onEdit && (
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onEdit(student);
              }}
            >
              Edit Student
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};
