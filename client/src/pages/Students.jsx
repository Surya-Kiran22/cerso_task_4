import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getStudentsApi, createStudentApi, updateStudentApi, deleteStudentApi } from '../api/studentApi';
import { StudentTable } from '../components/students/StudentTable';
import { StudentCard } from '../components/students/StudentCard';
import { StudentFormModal } from '../components/students/StudentFormModal';
import { StudentDetailModal } from '../components/students/StudentDetailModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Pagination } from '../components/common/Pagination';
import { TableSkeleton } from '../components/common/Skeleton';
import { Button } from '../components/common/Button';
import { InputField } from '../components/common/InputField';
import { SelectField } from '../components/common/SelectField';
import { useDebounce } from '../hooks/useDebounce';
import { useToast } from '../hooks/useToast';
import { Search, Plus, Filter, RotateCcw, UserX } from 'lucide-react';
import { COURSES, YEARS, SORT_OPTIONS } from '../utils/constants';

export const Students = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess, showError } = useToast();

  // State management
  const [students, setStudents] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const [courseFilter, setCourseFilter] = useState('All');
  const [yearFilter, setYearFilter] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [isLoading, setIsLoading] = useState(true);

  // Modal controls
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverFormErrors, setServerFormErrors] = useState(null);

  const [viewingStudent, setViewingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch students function
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getStudentsApi({
        search: debouncedSearch,
        course: courseFilter === 'All' ? '' : courseFilter,
        year: yearFilter === 'All' ? '' : yearFilter,
        sort: sortOption,
        page,
        limit,
      });

      if (response.success && response.data) {
        setStudents(response.data.students || []);
        setPagination(response.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
      }
    } catch (err) {
      showError(err.message || 'Failed to fetch students data');
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, courseFilter, yearFilter, sortOption, page, limit, showError]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handle URL query action params (e.g. from Dashboard click)
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add') {
      setEditingStudent(null);
      setIsFormOpen(true);
      searchParams.delete('action');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  // Reset page when filters/search change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleCourseFilterChange = (e) => {
    setCourseFilter(e.target.value);
    setPage(1);
  };

  const handleYearFilterChange = (e) => {
    setYearFilter(e.target.value);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setCourseFilter('All');
    setYearFilter('All');
    setSortOption('newest');
    setPage(1);
  };

  // Student Actions
  const handleCreateOrUpdate = async (formData) => {
    setIsSubmitting(true);
    setServerFormErrors(null);
    try {
      if (editingStudent) {
        await updateStudentApi(editingStudent._id || editingStudent.id, formData);
        showSuccess('Student details updated successfully!');
      } else {
        await createStudentApi(formData);
        showSuccess('New student record created successfully!');
      }
      setIsFormOpen(false);
      setEditingStudent(null);
      fetchStudents();
    } catch (err) {
      if (err.errors && Array.isArray(err.errors)) {
        setServerFormErrors(err.errors);
      }
      showError(err.message || 'Failed to save student details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      await deleteStudentApi(deletingStudent._id || deletingStudent.id);
      showSuccess(`Student '${deletingStudent.name}' deleted successfully.`);
      setDeletingStudent(null);
      fetchStudents();
    } catch (err) {
      showError(err.message || 'Failed to delete student');
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters = searchQuery !== '' || courseFilter !== 'All' || yearFilter !== 'All';

  return (
    <div>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-text-main)' }}>
            Student Management
          </h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            View, search, filter, and manage registered student profiles
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => {
            setEditingStudent(null);
            setServerFormErrors(null);
            setIsFormOpen(true);
          }}
        >
          Add Student
        </Button>
      </div>

      {/* Search & Filter Toolbar Card */}
      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          {/* Debounced Search Bar */}
          <div style={{ gridColumn: 'span 2 / span 2' }}>
            <InputField
              id="student-search-input"
              type="text"
              placeholder="Search by student name, email, or phone..."
              value={searchQuery}
              onChange={handleSearchChange}
              icon={Search}
              className="form-group-compact"
              style={{ margin: 0 }}
            />
          </div>

          {/* Course Filter Dropdown */}
          <SelectField
            id="course-filter-select"
            value={courseFilter}
            onChange={handleCourseFilterChange}
            options={['All', ...COURSES]}
            placeholder={null}
            style={{ margin: 0 }}
            aria-label="Filter by course"
          />

          {/* Year Filter Dropdown */}
          <SelectField
            id="year-filter-select"
            value={yearFilter}
            onChange={handleYearFilterChange}
            options={[
              { value: 'All', label: 'All Years' },
              ...YEARS.map((y) => ({ value: y.value, label: y.label })),
            ]}
            placeholder={null}
            style={{ margin: 0 }}
            aria-label="Filter by year"
          />

          {/* Sort Dropdown */}
          <SelectField
            id="sort-select"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            options={SORT_OPTIONS}
            placeholder={null}
            style={{ margin: 0 }}
            aria-label="Sort students"
          />
        </div>

        {hasActiveFilters && (
          <div
            style={{
              marginTop: '1rem',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              Active filters applied
            </span>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={handleResetFilters}
              style={{ color: 'var(--color-primary)' }}
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Content Section: Table / Mobile Cards / Empty State */}
      {isLoading ? (
        <TableSkeleton rows={8} cols={5} />
      ) : students.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--color-bg-alt)',
              color: 'var(--color-text-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <UserX size={32} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No Students Found
          </h2>
          <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', fontSize: '0.9375rem', marginBottom: '1.5rem' }}>
            {hasActiveFilters
              ? 'No student records matched your search query or selected filter criteria.'
              : 'There are currently no students registered in the database.'}
          </p>
          {hasActiveFilters ? (
            <Button variant="secondary" onClick={handleResetFilters}>
              Clear Search & Filters
            </Button>
          ) : (
            <Button
              variant="primary"
              icon={Plus}
              onClick={() => {
                setEditingStudent(null);
                setIsFormOpen(true);
              }}
            >
              Add First Student
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <StudentTable
            students={students}
            onView={(s) => setViewingStudent(s)}
            onEdit={(s) => {
              setEditingStudent(s);
              setServerFormErrors(null);
              setIsFormOpen(true);
            }}
            onDelete={(s) => setDeletingStudent(s)}
            sort={sortOption}
            onSortChange={(newSort) => setSortOption(newSort)}
          />

          {/* Mobile Card Grid View */}
          <div className="mobile-cards">
            {students.map((s) => (
              <StudentCard
                key={s._id || s.id}
                student={s}
                onView={(st) => setViewingStudent(st)}
                onEdit={(st) => {
                  setEditingStudent(st);
                  setServerFormErrors(null);
                  setIsFormOpen(true);
                }}
                onDelete={(st) => setDeletingStudent(st)}
              />
            ))}
          </div>

          {/* Server-side Pagination Bar */}
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={limit}
            onPageChange={(p) => setPage(p)}
            onLimitChange={(l) => {
              setLimit(l);
              setPage(1);
            }}
          />
        </>
      )}

      {/* Modals & Dialogs */}
      <StudentFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingStudent(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={editingStudent}
        isLoading={isSubmitting}
        serverErrors={serverFormErrors}
      />

      <StudentDetailModal
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        student={viewingStudent}
        onEdit={(st) => {
          setEditingStudent(st);
          setIsFormOpen(true);
        }}
      />

      <ConfirmDialog
        isOpen={!!deletingStudent}
        onClose={() => setDeletingStudent(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student Record"
        message={`Are you sure you want to permanently delete '${deletingStudent?.name}'? This operation cannot be undone.`}
        confirmText="Delete Permanently"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
