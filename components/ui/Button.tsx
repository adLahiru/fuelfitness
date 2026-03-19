'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-heading font-semibold tracking-wider transition-all duration-300 overflow-hidden cursor-pointer';

  const variants = {
    primary: 'bg-neon text-black hover:bg-white hover:shadow-neon-strong',
    secondary:
      'bg-background-secondary text-neon border border-neon/30 hover:border-neon hover:shadow-neon',
    outline:
      'bg-transparent text-text-primary border border-border hover:border-neon hover:text-neon',
    ghost: 'bg-transparent text-text-secondary hover:text-neon hover:bg-neon/10',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const classes = `
    ${baseStyles}
    ${variants[variant]}
    ${sizes[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <button className={classes} disabled={disabled || isLoading} {...props}>
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  );
}
