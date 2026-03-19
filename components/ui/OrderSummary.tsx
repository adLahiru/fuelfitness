'use client';

import React from 'react';
import { CartItem } from '@/types/store';

interface OrderSummaryProps {
  items: CartItem[];
  totalPrice: number;
  showShipping?: boolean;
  shippingText?: string;
}

export function OrderSummary({ items, totalPrice, showShipping = true, shippingText = 'Calculated at checkout' }: OrderSummaryProps) {
  return (
    <div className="bg-background-secondary border border-border p-6">
      <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-border pb-4">
        ORDER SUMMARY
      </h2>

      <div className="flex flex-col gap-4 mb-6 max-h-60 overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <span className="text-text-secondary">{item.quantity}x</span>
              <span className="text-white line-clamp-1">{item.name}</span>
            </div>
            <span className="text-white shrink-0">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {showShipping && (
        <div className="flex flex-col gap-2 text-sm mb-4 border-t border-border pt-4">
          <div className="flex justify-between text-text-secondary">
            <span>Subtotal</span>
            <span className="text-white">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-text-secondary">
            <span>Shipping</span>
            <span className="text-white">{shippingText}</span>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center border-t border-border pt-4">
        <span className="font-bold text-white">Total</span>
        <span className="text-2xl font-heading font-bold text-neon">
          ${totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
