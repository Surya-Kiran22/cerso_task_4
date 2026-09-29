import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getStudentByIdApi, deleteStudentApi } from '../api/studentApi';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { StudentFormModal } from '../components/students/StudentFormModal';
import { useToast } from '../hooks/useToast';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Edit3,
  Trash2,
  GraduationCap,
  Loader2,
} from 'lucide-react';
import { formatPhone, formatDate, getYearOrdinal } from '../utils/formatters';

export const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setIsLoading(true);
        const response = await getStudentByIdApi(id);
        if (response.success && response.data) {
          setStudent(response.data.student);
        }
      } catch (err) {
        showError(err.message || 'Student not found');
        navigate('/students');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchStudent();
  }, [id, navigate, showError]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteStudentApi(id);
      showSuccess(`Student record deleted.`);
      navigate('/students');
    } catch (err) {
      showError(err.message || 'Failed to delete student');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
        <Loader2 className="spinner" size={36} color="var(--color-primary)" />
      </div>
    );
  }

  if (!student) return null;

  return (
    <div>
      {/* Navigation Breadcrumb */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          to="/students"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--color-text-muted)',
            fontWeight: 500,
            fontSize: '0.875rem',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Students List</span>
        </Link>
      </div>

      {/* Main Student Profile Card */}
      <div className="card" style={{ padding: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justify: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px solid var(--color-border)',
            paddingBottom: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem',
                fontWeight: 700,
              }}
            >
              {student.name ? student.name[0].toUpperCase() : 'S'}
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{student.name}</h1>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.375rem' }}>
                <span className="badge badge-course">{student.course}</span>
                <span className="badge badge-year">{getYearOrdinal(student.year)}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Button variant="secondary" icon={Edit3} onClick={() => setIsEditOpen(true)}>
              Edit
            </Button>
            <Button variant="danger" icon={Trash2} onClick={() => setIsDeleteOpen(true)}>
              Delete
            </Button>
          </div>
        </div>

        {/* Detailed Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stat-icon info">
              <Mail size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                Email Address
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>{student.email}</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stat-icon primary">
              <Phone size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                Phone Number
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600, fontFamily: 'monospace' }}>
                {formatPhone(student.phone)}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="stat-icon warning">
              <Calendar size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                Date Created
              </div>
              <div style={{ fontSize: '1rem', fontWeight: 600 }}>{formatDate(student.createdAt)}</div>
            </div>
          </div>

          {student.createdBy && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="stat-icon success">
                <ShieldCheck size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                  Created By User
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                  {student.createdBy.name || 'System Admin'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Student Record"
        message={`Are you sure you want to permanently delete '${student.name}'?`}
        confirmText="Delete Permanently"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
};
