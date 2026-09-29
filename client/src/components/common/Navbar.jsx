import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Menu, GraduationCap, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          style={{ padding: '0.5rem' }}
        >
          <Menu size={22} />
        </button>

        <div className="navbar-brand">
          <GraduationCap size={28} />
          <span>EduTrack Pro</span>
        </div>
      </div>

      <div className="navbar-user">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="user-avatar" title={user?.email}>
            {getInitials(user?.name)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.2 }}>
              {user?.name || 'User'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              {user?.email}
            </span>
          </div>
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={logout}
          title="Sign out"
          aria-label="Sign out"
          style={{ color: 'var(--color-danger)' }}
        >
          <LogOut size={18} />
          <span className="desktop-only">Logout</span>
        </button>
      </div>
    </header>
  );
};
