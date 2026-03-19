'use client';

import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviews: number;
  size?: 'sm' | 'md';
}

export function StarRating({ rating, reviews, size = 'sm' }: StarRatingProps) {
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-1">
      <Star className={`${iconSize} fill-neon text-neon`} />
      <span className={`${size === 'sm' ? 'text-sm' : 'text-base'} font-medium text-text-primary`}>
        {rating}
      </span>
      <span className={`${size === 'sm' ? 'text-sm' : 'text-base'} text-text-secondary`}>
        ({reviews})
      </span>
    </div>
  );
}
