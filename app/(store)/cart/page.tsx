'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-[60vh]">
        <EmptyState
          icon={<ShoppingBag className="w-10 h-10 text-text-secondary" />}
          title="YOUR CART IS EMPTY"
          description="Looks like you haven't added any supplements to your cart yet. Time to fuel up!"
          action={
            <Link href="/catalogue">
              <Button size="lg">BROWSE PRODUCTS</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-8">
        YOUR <span className="text-neon">CART</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Cart Items */}
        <div className="flex-1 w-full flex flex-col gap-6">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-background-secondary border border-border relative">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-contain bg-background p-2" />
              <div className="flex-1 flex flex-col gap-2 text-center sm:text-left">
                <div className="text-xs text-neon font-heading tracking-wider">{item.brand}</div>
                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                <div className="text-xl font-heading font-bold text-white">${item.price.toFixed(2)}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border bg-background">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-text-secondary hover:text-neon transition-colors">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-medium">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-text-secondary hover:text-neon transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="p-2 text-status-warning hover:text-red-500 transition-colors" aria-label="Remove item">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0 bg-background-secondary border border-border p-6 sticky top-28">
          <h2 className="text-xl font-heading font-bold text-white mb-6 border-b border-border pb-4">ORDER SUMMARY</h2>
          <div className="flex flex-col gap-4 mb-6 text-sm">
            <div className="flex justify-between text-text-secondary">
              <span>Subtotal</span>
              <span className="text-white">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-text-secondary">
              <span>Shipping</span>
              <span className="text-white">Calculated at checkout</span>
            </div>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-4 mb-8">
            <span className="font-bold text-white">Total</span>
            <span className="text-2xl font-heading font-bold text-neon">${totalPrice.toFixed(2)}</span>
          </div>
          <Button fullWidth size="lg" className="group" onClick={() => router.push('/checkout')}>
            PROCEED TO CHECKOUT
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}
