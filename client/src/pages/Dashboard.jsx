import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentStatsApi, getStudentsApi, createStudentApi, updateStudentApi, deleteStudentApi } from '../api/studentApi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Users, BookOpen, Calendar, Plus, ArrowRight, Award, Search, Trash2, Edit3, Eye } from 'lucide-react';
import { StudentFormModal } from '../components/students/StudentFormModal';
import { StudentDetailModal } from '../components/students/StudentDetailModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { formatPhone, formatDate, getYearOrdinal } from '../utils/formatters';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [quickName, setQuickName] = useState('');
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [yearUpdateVal, setYearUpdateVal] = useState('3');

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [statsRes, studentsRes] = await Promise.all([
        getStudentStatsApi(),
        getStudentsApi({ limit: 10, sort: 'newest' }),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (studentsRes.success && studentsRes.data?.students) {
        const list = studentsRes.data.students;
        setStudents(list);
        if (list.length > 0 && !selectedStudent) {
          setSelectedStudent(list[0]);
          setYearUpdateVal(String(list[0].year || 1));
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSearchLookup = () => {
    if (!searchQuery.trim()) return;
    const found = students.find(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
        s.phone.includes(searchQuery.trim())
    );
    if (found) {
      setSelectedStudent(found);
      setYearUpdateVal(String(found.year || 1));
      showSuccess(`Loaded student profile for ${found.name}`);
    } else {
      navigate(`/students?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleQuickCreate = async () => {
    if (!quickName.trim()) {
      showError('Please enter a student name');
      return;
    }
    try {
      setIsSubmitting(true);
      const email = `${quickName.trim().toLowerCase().replace(/\s+/g, '.')}@studentms.edu`;
      await createStudentApi({
        name: quickName.trim(),
        email,
        phone: '9876543299',
        course: 'Computer Science',
        year: 1,
      });
      showSuccess(`Student record created for ${quickName}`);
      setQuickName('');
      fetchDashboardData();
    } catch (err) {
      showError(err.message || 'Failed to create student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateYear = async () => {
    if (!selectedStudent) return;
    const yr = Math.min(4, Math.max(1, parseInt(yearUpdateVal, 10) || 1));
    try {
      const res = await updateStudentApi(selectedStudent._id || selectedStudent.id, { year: yr });
      showSuccess(`Updated ${selectedStudent.name}'s academic year to Year ${yr}`);
      setSelectedStudent(res.data.student);
      fetchDashboardData();
    } catch (err) {
      showError(err.message || 'Failed to update year');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    try {
      setIsDeleting(true);
      await deleteStudentApi(deletingStudent._id || deletingStudent.id);
      showSuccess(`Deleted student record for ${deletingStudent.name}`);
      setDeletingStudent(null);
      if (selectedStudent?._id === deletingStudent._id) {
        setSelectedStudent(null);
      }
      fetchDashboardData();
    } catch (err) {
      showError(err.message || 'Failed to delete student');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header Banner */}
      <div className="header-section">
        <h1 className="header-title">Student Management System — Overview & Portal</h1>
        <div className="header-subtitle">
          Student Administration • Enrollment Metrics • Academic Year Distribution
        </div>
      </div>

      {/* Top Control Bar Grid matching screenshot layout */}
      <div className="top-control-grid">
        <div className="control-box">
          <div className="input-button-group">
            <input
              type="text"
              className="text-input"
              placeholder="Lookup Student by Name, Email, or Phone (e.g. Alex Johnson)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchLookup()}
            />
            <button type="button" className="btn-dark-green" onClick={handleSearchLookup}>
              Search Student
            </button>
          </div>
        </div>

        <div className="control-box">
          <div className="control-box-title">Quick Add Student</div>
          <div className="input-button-group">
            <input
              type="text"
              className="text-input"
              placeholder="Full Name (e.g. Sarah Connor)"
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickCreate()}
            />
            <button type="button" className="btn-dark-green" onClick={handleQuickCreate} disabled={isSubmitting}>
              Add Student
            </button>
          </div>
        </div>
      </div>

      {/* Command Action Bar Panel */}
      {selectedStudent && (
        <div className="command-panel">
          <div className="command-panel-header">
            Quick Actions for Selected Student: <strong>{selectedStudent.name}</strong> ({selectedStudent.course} - {getYearOrdinal(selectedStudent.year)})
          </div>
          <div className="command-buttons-row">
            <button
              type="button"
              className="btn-bright-green"
              onClick={() => setIsFormOpen(true)}
            >
              Add New Student
            </button>

            <button
              type="button"
              className="btn-dark-green"
              onClick={() => navigate('/students')}
            >
              Open Full Directory ({stats?.totalStudents || 0} Total)
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Year (1-4):</span>
              <input
                type="number"
                className="text-input"
                style={{ width: '60px', padding: '0.25rem 0.5rem' }}
                value={yearUpdateVal}
                onChange={(e) => setYearUpdateVal(e.target.value)}
                min="1"
                max="4"
              />
              <button type="button" className="btn-dark-green" onClick={handleUpdateYear}>
                Update Year
              </button>
            </div>

            <button
              type="button"
              className="btn-dark-green"
              onClick={() => setViewingStudent(selectedStudent)}
            >
              View Complete Profile
            </button>

            <button
              type="button"
              className="btn-red-alert"
              onClick={() => setDeletingStudent(selectedStudent)}
            >
              Delete Student Record
            </button>
          </div>
        </div>
      )}

      {/* Overview Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.5rem',
        }}
      >
        <div className="control-box" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.totalStudents || 0}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Total Students</div>
          </div>
        </div>

        <div className="control-box" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats?.courseStats?.length || 0}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Active Courses</div>
          </div>
        </div>

        <div className="control-box" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{stats?.courseStats?.[0]?.course || 'N/A'}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Top Course ({stats?.courseStats?.[0]?.count || 0})</div>
          </div>
        </div>

        <div className="control-box" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '4px', background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={24} />
          </div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>4 Years</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>Academic Levels</div>
          </div>
        </div>
      </div>

      {/* Bottom 2-Column Split Grid */}
      <div className="bottom-split-grid" style={{ marginBottom: '1.5rem' }}>
        {/* Course Breakdown Panel */}
        <div className="panel-card">
          <h2 className="panel-card-title">Students per Course Breakdown</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            {stats?.courseStats?.map((c) => {
              const pct = Math.round((c.count / (stats.totalStudents || 1)) * 100);
              return (
                <div key={c.course}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                    <span>{c.course}</span>
                    <span style={{ color: 'var(--color-text-muted)' }}>{c.count} students ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--color-bg-subtle)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: '#235817', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Student Details Panel */}
        <div className="panel-card">
          <h2 className="panel-card-title">Selected Student Profile</h2>
          {selectedStudent ? (
            <table className="state-table">
              <tbody>
                <tr>
                  <td className="label">Full Name:</td>
                  <td className="value">{selectedStudent.name}</td>
                </tr>
                <tr>
                  <td className="label">Email Address:</td>
                  <td className="value">{selectedStudent.email}</td>
                </tr>
                <tr>
                  <td className="label">Phone Number:</td>
                  <td className="value">{formatPhone(selectedStudent.phone)}</td>
                </tr>
                <tr>
                  <td className="label">Course:</td>
                  <td className="value"><span className="event-type-badge">{selectedStudent.course}</span></td>
                </tr>
                <tr>
                  <td className="label">Academic Year:</td>
                  <td className="value">{getYearOrdinal(selectedStudent.year)}</td>
                </tr>
                <tr>
                  <td className="label">Created By:</td>
                  <td className="value">{selectedStudent.createdBy?.name || 'System Admin'}</td>
                </tr>
                <tr>
                  <td className="label">Registration Date:</td>
                  <td className="value">{formatDate(selectedStudent.createdAt)}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <p style={{ color: 'var(--color-text-muted)' }}>No student selected.</p>
          )}
        </div>
      </div>

      {/* Recent Students Table Panel */}
      <div className="panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 className="panel-card-title" style={{ margin: 0, border: 'none', padding: 0 }}>
            Recent Student Registrations
          </h2>
          <button type="button" className="btn-dark-green" onClick={() => navigate('/students')}>
            View All ({stats?.totalStudents || 0})
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="state-table" style={{ width: '100%' }}>
            <thead>
              <tr style={{ background: 'var(--color-bg-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '0.625rem 0.75rem', fontSize: '0.8125rem', fontWeight: 700 }}>Student Name</th>
                <th style={{ padding: '0.625rem 0.75rem', fontSize: '0.8125rem', fontWeight: 700 }}>Email</th>
                <th style={{ padding: '0.625rem 0.75rem', fontSize: '0.8125rem', fontWeight: 700 }}>Phone</th>
                <th style={{ padding: '0.625rem 0.75rem', fontSize: '0.8125rem', fontWeight: 700 }}>Course</th>
                <th style={{ padding: '0.625rem 0.75rem', fontSize: '0.8125rem', fontWeight: 700 }}>Year</th>
                <th style={{ padding: '0.625rem 0.75rem', fontSize: '0.8125rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id || s.id} style={{ background: selectedStudent?._id === s._id ? '#f0fdf4' : 'transparent' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{s.name}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--color-text-sub)' }}>{s.email}</td>
                  <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>{formatPhone(s.phone)}</td>
                  <td style={{ padding: '0.75rem' }}><span className="event-type-badge">{s.course}</span></td>
                  <td style={{ padding: '0.75rem' }}>{getYearOrdinal(s.year)}</td>
                  <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.375rem' }}>
                      <button
                        type="button"
                        className="btn-dark-green"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => {
                          setSelectedStudent(s);
                          setYearUpdateVal(String(s.year || 1));
                        }}
                      >
                        Select
                      </button>
                      <button
                        type="button"
                        className="btn-red-alert"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => setDeletingStudent(s)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <StudentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={async (data) => {
          setIsSubmitting(true);
          try {
            await createStudentApi(data);
            showSuccess('Student created successfully!');
            setIsFormOpen(false);
            fetchDashboardData();
          } catch (err) {
            showError(err.message || 'Creation failed');
          } finally {
            setIsSubmitting(false);
          }
        }}
        isLoading={isSubmitting}
      />

      <StudentDetailModal
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        student={viewingStudent}
      />

      <ConfirmDialog
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student Record"
        message={`Are you sure you want to delete '${deletingStudent?.name}'?`}
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
};
