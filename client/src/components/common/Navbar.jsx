import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Menu, GraduationCap, LogOut } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'A';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button
          type="button"
          className="menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div className="navbar-brand">
          <GraduationCap size={28} color="var(--color-primary-green)" />
          <span>EduTrack Pro</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="user-profile">
          <div className="user-avatar" title={user?.email}>
            {getInitials(user?.name)}
          </div>
          <div className="user-details">
            <span className="user-name">{user?.name || 'System Admin'}</span>
            <span className="user-email">{user?.email || 'admin@studentms.com'}</span>
          </div>
        </div>

        <button
          type="button"
          className="btn-logout"
          onClick={logout}
          title="Sign out"
          aria-label="Sign out"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};
