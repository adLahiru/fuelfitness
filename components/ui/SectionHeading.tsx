'use client';

import React from 'react';

interface SectionHeadingProps {
  title: string;
  highlight?: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({ title, highlight, subtitle, centered = false, className = '' }: SectionHeadingProps) {
  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
        {title} {highlight && <span className="text-neon">{highlight}</span>}
      </h2>
      {subtitle && (
        <p className={`text-text-secondary ${centered ? 'max-w-xl mx-auto' : 'max-w-xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
