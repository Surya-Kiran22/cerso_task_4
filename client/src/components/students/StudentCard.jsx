import React from 'react';
import { Eye, Edit3, Trash2, Phone, Mail, GraduationCap } from 'lucide-react';
import { formatPhone, getYearOrdinal } from '../../utils/formatters';

export const StudentCard = ({ student, onView, onEdit, onDelete }) => {
  return (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, color: 'var(--color-text-main)' }}>
            {student.name}
          </h3>
          <span className="badge badge-course" style={{ marginTop: '0.25rem' }}>
            {student.course}
          </span>
        </div>
        <span className="badge badge-year">{getYearOrdinal(student.year)}</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '1rem 0', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Mail size={16} color="var(--color-text-light)" />
          <span>{student.email}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Phone size={16} color="var(--color-text-light)" />
          <span style={{ fontFamily: 'monospace' }}>{formatPhone(student.phone)}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onView(student)}
        >
          <Eye size={14} />
          <span>View</span>
        </button>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={() => onEdit(student)}
        >
          <Edit3 size={14} />
          <span>Edit</span>
        </button>
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(student)}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};
