import React from 'react';
import { getSeverityColor, getStatusColor } from '../utils/helpers';

export const StatusBadge = ({ type = 'status', value, size = 'md', className = '' }) => {
  if (!value) return null;

  const colorConfig = type === 'severity' ? getSeverityColor(value) : getStatusColor(value);
  
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold'
  }[size] || 'text-xs px-2.5 py-1 font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${colorConfig.bg} ${colorConfig.text} ${colorConfig.border} ${sizeClasses} ${className} tracking-wide transition-all`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colorConfig.dot || 'bg-current'} ${value?.toLowerCase() === 'critical' || value?.toLowerCase() === 'responding' ? 'animate-ping' : ''}`} />
      <span>{value}</span>
    </span>
  );
};
