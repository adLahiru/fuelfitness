'use client';

import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20">
      <div className="w-24 h-24 rounded-full bg-background-secondary border border-border flex items-center justify-center mb-6">
        {icon}
      </div>
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">{title}</h2>
      {description && <p className="text-text-secondary max-w-md mb-8">{description}</p>}
      {action}
    </div>
  );
}
