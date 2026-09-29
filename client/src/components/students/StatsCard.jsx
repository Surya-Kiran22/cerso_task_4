import React from 'react';

export const StatsCard = ({ title, value, icon: Icon, variant = 'primary', subtext }) => {
  return (
    <div className="card stat-card">
      <div className={`stat-icon ${variant}`}>
        {Icon && <Icon size={26} />}
      </div>
      <div>
        <div className="stat-val">{value}</div>
        <div className="stat-label">{title}</div>
        {subtext && <span style={{ fontSize: '0.75rem', color: 'var(--color-text-light)' }}>{subtext}</span>}
      </div>
    </div>
  );
};
