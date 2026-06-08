import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import './AlertCard.css';

const AlertCard = ({ type = 'info', title, message, details }) => {
  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    danger: XCircle,
    info: Info
  };

  const Icon = icons[type];

  return (
    <div className={`alert-card alert-${type}`}>
      <div className="alert-icon">
        <Icon size={20} />
      </div>
      <div className="alert-content">
        <h4 className="alert-title">{title}</h4>
        <p className="alert-message">{message}</p>
        {details && details.length > 0 && (
          <ul className="alert-details">
            {details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AlertCard;
