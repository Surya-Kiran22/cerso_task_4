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
      return <ArrowUp size={14} color="var(--color-primary-green)" />;
    }
    if (sort === `-${field}` || sort === `${field}_desc`) {
      return <ArrowDown size={14} color="var(--color-primary-green)" />;
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
    <div className="table-card desktop-table">
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ cursor: 'pointer', minWidth: '220px' }} onClick={() => handleHeaderClick('name')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Student Name</span>
                  {renderSortIcon('name')}
                </div>
              </th>
              <th style={{ minWidth: '160px' }}>Phone Contact</th>
              <th style={{ cursor: 'pointer', minWidth: '180px' }} onClick={() => handleHeaderClick('course')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Course</span>
                  {renderSortIcon('course')}
                </div>
              </th>
              <th style={{ cursor: 'pointer', minWidth: '120px' }} onClick={() => handleHeaderClick('year')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Year</span>
                  {renderSortIcon('year')}
                </div>
              </th>
              <th style={{ textAlign: 'right', minWidth: '140px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id || student.id}>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 700, color: 'var(--color-text-title)' }}>
                      {student.name}
                    </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
                      {student.email}
                    </span>
                  </div>
                </td>
                <td>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.875rem', fontWeight: 600 }}>
                    {formatPhone(student.phone)}
                  </span>
                </td>
                <td>
                  <span className="badge-course">{student.course}</span>
                </td>
                <td>
                  <span className="badge-year">{getYearOrdinal(student.year)}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.375rem' }}>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => onView(student)}
                      title="View Student Details"
                      aria-label={`View details for ${student.name}`}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => onEdit(student)}
                      title="Edit Student"
                      aria-label={`Edit ${student.name}`}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      type="button"
                      className="btn-icon danger"
                      onClick={() => onDelete(student)}
                      title="Delete Student"
                      aria-label={`Delete ${student.name}`}
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
    </div>
  );
};
