'use client';

import React from 'react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const getStatusClasses = () => {
    switch (status) {
      case 'Payment Pending':
        return 'border-status-warning text-status-warning bg-status-warning/10';
      case 'Delivered':
        return 'border-status-success text-status-success bg-status-success/10';
      default:
        return 'border-neon text-neon bg-neon/10';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusClasses()} ${className}`}>
      {status}
    </span>
  );
}
