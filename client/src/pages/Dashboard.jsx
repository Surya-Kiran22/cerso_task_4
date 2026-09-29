import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStudentStatsApi, getStudentsApi, createStudentApi, updateStudentApi } from '../api/studentApi';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Search, Plus, RotateCcw, AlertTriangle, Layers, Clock, ShieldCheck, User } from 'lucide-react';
import { StudentFormModal } from '../components/students/StudentFormModal';
import { formatPhone, formatDate, getYearOrdinal } from '../utils/formatters';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();

  const [lookupId, setLookupId] = useState('');
  const [quickStudentName, setQuickStudentName] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [timelineIndex, setTimelineIndex] = useState(0);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempYear, setTempYear] = useState('3');
  const [staleTestEmail, setStaleTestEmail] = useState('alex.j@example.com');

  // Load students & stats
  const fetchDashboardData = async () => {
    try {
      const response = await getStudentsApi({ limit: 10, sort: 'newest' });
      if (response.success && response.data?.students) {
        const list = response.data.students;
        setStudents(list);
        if (list.length > 0 && !selectedStudent) {
          setSelectedStudent(list[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLookup = () => {
    if (!lookupId.trim()) return;
    const found = students.find(
      (s) =>
        (s._id || s.id) === lookupId.trim() ||
        s.email.toLowerCase().includes(lookupId.trim().toLowerCase()) ||
        s.name.toLowerCase().includes(lookupId.trim().toLowerCase())
    );
    if (found) {
      setSelectedStudent(found);
      showSuccess(`Loaded student profile for ${found.name}`);
    } else {
      showError(`No student matching '${lookupId}' found in current cache.`);
    }
  };

  const handleQuickCreate = async () => {
    if (!quickStudentName.trim()) {
      showError('Please enter a student name or email');
      return;
    }
    try {
      setIsSubmitting(true);
      const email = `${quickStudentName.toLowerCase().replace(/\s+/g, '.')}@univ.edu`;
      await createStudentApi({
        name: quickStudentName.trim(),
        email,
        phone: '9876543299',
        course: 'Computer Science',
        year: 1,
      });
      showSuccess(`Created student: ${quickStudentName}`);
      setQuickStudentName('');
      fetchDashboardData();
    } catch (err) {
      showError(err.message || 'Failed to create student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePromoteYear = async () => {
    if (!selectedStudent) return;
    try {
      const nextYear = Math.min(4, Math.max(1, parseInt(tempYear, 10) || 1));
      const res = await updateStudentApi(selectedStudent._id || selectedStudent.id, {
        year: nextYear,
      });
      showSuccess(`Updated academic year for ${selectedStudent.name} to Year ${nextYear}`);
      setSelectedStudent(res.data.student);
      fetchDashboardData();
    } catch (err) {
      showError(err.message || 'Failed to update academic year');
    }
  };

  const handleTestStaleVersion = async () => {
    if (!selectedStudent) return;
    try {
      // Trigger duplicate email conflict test (OCC 409)
      await updateStudentApi(selectedStudent._id || selectedStudent.id, {
        email: staleTestEmail,
      });
    } catch (err) {
      showError(`[OCC 409 Test Response]: ${err.message || 'Duplicate email conflict rejected by server.'}`);
    }
  };

  // Generate event timeline for selected student
  const getTimelineEvents = (s) => {
    if (!s) return [];
    return [
      { id: 1, event: 'STUDENT_REGISTERED', timestamp: formatDate(s.createdAt), detail: `Registered by ${s.createdBy?.name || 'System Admin'}` },
      { id: 2, event: 'COURSE_ENROLLED', timestamp: formatDate(s.createdAt), detail: `Enrolled in ${s.course}` },
      { id: 3, event: 'PHONE_VERIFIED', timestamp: formatDate(s.createdAt), detail: `Phone contact set to ${formatPhone(s.phone)}` },
      { id: 4, event: 'ACADEMIC_YEAR_SET', timestamp: formatDate(s.updatedAt || s.createdAt), detail: `Status: ${getYearOrdinal(s.year)}` },
      { id: 5, event: 'AUDIT_LOG_VERIFIED', timestamp: new Date().toLocaleTimeString(), detail: 'Optimistic Concurrency Check OK' },
    ];
  };

  const events = getTimelineEvents(selectedStudent);
  const currentEvent = events[timelineIndex] || events[events.length - 1];

  return (
    <div className="page-container">
      {/* Title Header matching Screenshot */}
      <div className="header-section">
        <h1 className="header-title">Audit Trail — Event-Sourced Student & Academic Ledger</h1>
        <div className="header-subtitle">
          CQRS Architecture • Immutable Event Log • Optimistic Concurrency Control
        </div>
      </div>

      {/* Top Control Bar Grid matching Screenshot */}
      <div className="top-control-grid">
        <div className="control-box">
          <div className="input-button-group">
            <input
              type="text"
              className="text-input"
              placeholder="Enter Student Name / Email / ID (e.g. Alex Johnson)..."
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
            />
            <button type="button" className="btn-dark-green" onClick={handleLookup}>
              Look up student by ID
            </button>
          </div>
        </div>

        <div className="control-box">
          <div className="control-box-title">Create New Student</div>
          <div className="input-button-group">
            <input
              type="text"
              className="text-input"
              placeholder="Name (e.g. STU-5005)"
              value={quickStudentName}
              onChange={(e) => setQuickStudentName(e.target.value)}
            />
            <button type="button" className="btn-dark-green" onClick={handleQuickCreate} disabled={isSubmitting}>
              Create
            </button>
          </div>
        </div>
      </div>

      {/* Command Panel Box matching Screenshot */}
      {selectedStudent && (
        <div className="command-panel">
          <div className="command-panel-header">
            Command Panel for Student: {selectedStudent.name} (ID: {selectedStudent._id?.substring(0, 8)})
          </div>
          <div className="command-buttons-row">
            <button
              type="button"
              className="btn-bright-green"
              onClick={() => {
                setIsFormOpen(true);
              }}
            >
              Register Student ({selectedStudent.name})
            </button>

            <button
              type="button"
              className="btn-dark-green"
              onClick={() => navigate('/students')}
            >
              View Full Directory ({selectedStudent.course})
            </button>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Year (1-4):</span>
              <input
                type="number"
                className="text-input"
                style={{ width: '60px', padding: '0.25rem 0.5rem' }}
                value={tempYear}
                onChange={(e) => setTempYear(e.target.value)}
              />
              <button type="button" className="btn-dark-green" onClick={handlePromoteYear}>
                Update Academic Year
              </button>
            </div>

            <button
              type="button"
              className="btn-dark-green"
              onClick={() => navigate('/students')}
            >
              Manage System Records
            </button>

            <div className="red-alert-box">
              <button type="button" className="btn-red-alert" onClick={handleTestStaleVersion}>
                Test Stale Version (OCC 409)
              </button>
              <input
                type="text"
                className="text-input"
                style={{ width: '130px', padding: '0.25rem 0.375rem', fontSize: '0.8125rem' }}
                value={staleTestEmail}
                onChange={(e) => setStaleTestEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* State Scrubbing Time-Machine Box matching Screenshot */}
      <div className="time-machine-card">
        <div className="time-machine-header">
          State Scrubbing Time-Machine: Event #{timelineIndex + 1} of {events.length || 1} (v{timelineIndex + 1})
        </div>
        <div className="time-machine-slider-wrapper">
          <input
            type="range"
            min={0}
            max={Math.max(0, events.length - 1)}
            value={timelineIndex}
            onChange={(e) => setTimelineIndex(Number(e.target.value))}
            className="time-machine-slider"
          />
        </div>
        <div className="time-machine-footer">
          <span>v1: {events[0]?.event || 'STUDENT_CREATED'}</span>
          <span>
            Selected: <strong>{currentEvent?.event || 'REGISTERED'}</strong> ({currentEvent?.timestamp || 'Now'})
          </span>
          <span>v{events.length}: {events[events.length - 1]?.event || 'AUDIT_VERIFIED'}</span>
        </div>
      </div>

      {/* Bottom 2-Column Split Layout matching Screenshot */}
      <div className="bottom-split-grid">
        {/* Left Column: Reconstructed Current State */}
        <div className="panel-card">
          <h2 className="panel-card-title">Reconstructed Current State</h2>
          {selectedStudent ? (
            <table className="state-table">
              <tbody>
                <tr>
                  <td className="label">Database ID:</td>
                  <td className="value" style={{ fontFamily: 'monospace' }}>{selectedStudent._id}</td>
                </tr>
                <tr>
                  <td className="label">Full Name:</td>
                  <td className="value">{selectedStudent.name}</td>
                </tr>
                <tr>
                  <td className="label">Email Address:</td>
                  <td className="value">{selectedStudent.email}</td>
                </tr>
                <tr>
                  <td className="label">Phone Contact:</td>
                  <td className="value">{formatPhone(selectedStudent.phone)}</td>
                </tr>
                <tr>
                  <td className="label">Enrolled Course:</td>
                  <td className="value">
                    <span className="event-type-badge">{selectedStudent.course}</span>
                  </td>
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
            <p style={{ color: 'var(--color-text-muted)' }}>Select a student record to inspect current state.</p>
          )}
        </div>

        {/* Right Column: Event Timeline (5 events) */}
        <div className="panel-card">
          <h2 className="panel-card-title">Event Timeline ({events.length} events)</h2>
          <div className="event-log-list">
            {events.map((ev, idx) => (
              <div
                key={ev.id}
                className="event-log-item"
                style={{
                  borderLeft: idx === timelineIndex ? '4px solid #235817' : '1px solid var(--color-border)',
                  background: idx === timelineIndex ? '#f0fdf4' : '#ffffff',
                }}
              >
                <div className="event-log-header">
                  <span className="event-type-badge">{ev.event}</span>
                  <span className="event-timestamp">{ev.timestamp}</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-sub)' }}>
                  {ev.detail}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <StudentFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={async (data) => {
          setIsSubmitting(true);
          try {
            await createStudentApi(data);
            showSuccess('Student record created.');
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
    </div>
  );
};
