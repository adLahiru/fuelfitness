'use client';

import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  size?: 'sm' | 'md';
}

export function QuantitySelector({ quantity, onIncrease, onDecrease, size = 'md' }: QuantitySelectorProps) {
  const btnSize = size === 'sm' ? 'w-7 h-7 text-sm' : 'w-8 h-8';
  const textSize = size === 'sm' ? 'w-8 text-sm' : 'w-10';

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className={`${btnSize} rounded-md bg-background border border-border flex items-center justify-center text-text-secondary hover:text-neon transition-colors`}
      >
        -
      </button>
      <div className={`${textSize} text-center font-medium`}>{quantity}</div>
      <button
        onClick={onIncrease}
        aria-label="Increase quantity"
        className={`${btnSize} rounded-md bg-background border border-border flex items-center justify-center text-text-secondary hover:text-neon transition-colors`}
      >
        +
      </button>
    </div>
  );
}
