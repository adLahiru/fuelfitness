'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types/store';
import { useCart } from '@/contexts/CartContext';
import { Button } from './Button';
import { StarRating } from './StarRating';
import { QuantitySelector } from './QuantitySelector';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState<number>(1);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail as null | string | number;
      setIsActive(id === product.id);
    };

    window.addEventListener('ff:product-select', handler as EventListener);
    return () => window.removeEventListener('ff:product-select', handler as EventListener);
  }, [product.id]);

  return (
    <div
      className="group flex flex-col bg-background-secondary border border-border hover:border-neon/50 transition-colors duration-300 overflow-hidden"
      tabIndex={0}
      onClick={() => {
        const next = isActive ? null : product.id;
        window.dispatchEvent(new CustomEvent('ff:product-select', { detail: next }));
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const next = isActive ? null : product.id;
          window.dispatchEvent(new CustomEvent('ff:product-select', { detail: next }));
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-pressed={isActive}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-background p-6 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-t from-background-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
        <Link href={`/product/${product.id}`} className="absolute inset-0 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            style={{ willChange: 'transform' }}
            className={`w-full h-full object-contain transform transition-transform duration-500 ${
              isHovered || isActive ? 'scale-110' : 'scale-100'
            }`}
          />
        </Link>

        {/* Quick Add Panel */}
        <div className="absolute bottom-0 left-0 right-0 px-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
          <div className="bg-background-secondary border border-border p-3 rounded-md flex items-center gap-3">
            <QuantitySelector
              quantity={qty}
              onIncrease={() => setQty((q) => q + 1)}
              onDecrease={() => setQty((q) => Math.max(1, q - 1))}
              size="sm"
            />
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={(e) => {
                e.preventDefault();
                addToCart(product, qty);
                setQty(1);
              }}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add {qty}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs text-neon mb-2 font-heading tracking-wider">{product.brand}</div>
        <h3 className="text-lg font-bold text-text-primary mb-2 line-clamp-2 flex-grow">
          <Link href={`/product/${product.id}`} className="hover:underline">
            {product.name}
          </Link>
        </h3>

        <StarRating rating={product.rating} reviews={product.reviews} />

        <div className="flex items-center justify-between mt-4">
          <span className="text-xl font-heading font-bold text-text-primary">
            ${product.price.toFixed(2)}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-text-secondary hover:text-neon hover:border-neon hover:shadow-neon transition-opacity duration-300 md:hidden opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Global listener: ensure only one product card stays active at a time.
// Each instance registers a listener in its own effect above.
// We need to add a top-level effect to subscribe/unsubscribe per-instance.
