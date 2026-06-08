import React from 'react';
import './StatCard.css';

const StatCard = ({ icon: Icon, title, value, trend, color = 'blue' }) => {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-icon">
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
        {trend && (
          <span className={`stat-trend ${trend.type}`}>
            {trend.value}
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;
