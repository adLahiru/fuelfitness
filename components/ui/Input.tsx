'use client';

import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-text-secondary">{label}</label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full bg-background-secondary border border-border rounded-none
              px-4 py-3 text-text-primary placeholder:text-text-secondary/50
              focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon
              transition-all duration-200
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-status-warning focus:border-status-warning focus:ring-status-warning' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <span className="text-xs text-status-warning mt-1">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
