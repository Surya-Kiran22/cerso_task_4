import React from 'react';
import { Eye, Edit3, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { formatPhone, getYearOrdinal } from '../../utils/formatters';

export const StudentTable = ({
  students = [],
  onView,
  onEdit,
  onDelete,
  sort,
  onSortChange,
}) => {
  const renderSortIcon = (field) => {
    if (!sort) return <ArrowUpDown size={14} style={{ opacity: 0.4 }} />;
    if (sort === field || sort === `${field}_asc`) {
      return <ArrowUp size={14} color="var(--color-primary)" />;
    }
    if (sort === `-${field}` || sort === `${field}_desc`) {
      return <ArrowDown size={14} color="var(--color-primary)" />;
    }
    return <ArrowUpDown size={14} style={{ opacity: 0.4 }} />;
  };

  const handleHeaderClick = (field) => {
    if (sort === `${field}_asc` || sort === field) {
      onSortChange(`${field}_desc`);
    } else {
      onSortChange(`${field}_asc`);
    }
  };

  return (
    <div className="table-container desktop-table">
      <table className="data-table">
        <thead>
          <tr>
            <th className="sortable" onClick={() => handleHeaderClick('name')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Student</span>
                {renderSortIcon('name')}
              </div>
            </th>
            <th>Phone</th>
            <th className="sortable" onClick={() => handleHeaderClick('course')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Course</span>
                {renderSortIcon('course')}
              </div>
            </th>
            <th className="sortable" onClick={() => handleHeaderClick('year')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Year</span>
                {renderSortIcon('year')}
              </div>
            </th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id || student.id}>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-main)' }}>
                    {student.name}
                  </span>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                    {student.email}
                  </span>
                </div>
              </td>
              <td>
                <span style={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>
                  {formatPhone(student.phone)}
                </span>
              </td>
              <td>
                <span className="badge badge-course">{student.course}</span>
              </td>
              <td>
                <span className="badge badge-year">{getYearOrdinal(student.year)}</span>
              </td>
              <td>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.375rem' }}>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => onView(student)}
                    title="View Student Details"
                    aria-label={`View details for ${student.name}`}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => onEdit(student)}
                    title="Edit Student"
                    aria-label={`Edit ${student.name}`}
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost btn-sm"
                    onClick={() => onDelete(student)}
                    title="Delete Student"
                    aria-label={`Delete ${student.name}`}
                    style={{ color: 'var(--color-danger)' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
