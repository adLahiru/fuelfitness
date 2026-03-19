'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { useProducts } from '@/contexts/ProductsContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/Button';
import { QuantitySelector } from '@/components/ui/QuantitySelector';

function ProductDescription({ description }: { description: string }) {
  const lines = description.split(/\r?\n/);
  const blocks: { type: 'p' | 'ul'; content?: string; items?: string[] }[] = [];
  let buffer: string[] = [];
  let listBuffer: string[] | null = null;

  const flushParagraph = () => {
    if (buffer.length > 0) {
      blocks.push({ type: 'p', content: buffer.join(' ').trim() });
      buffer = [];
    }
  };
  const flushList = () => {
    if (listBuffer && listBuffer.length > 0) {
      blocks.push({ type: 'ul', items: listBuffer.slice() });
      listBuffer = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (line === '') {
      flushList();
      flushParagraph();
      continue;
    }
    if (line.startsWith('-') || line.startsWith('\u2022')) {
      const item = line.replace(/^[-\u2022]\s?/, '').trim();
      if (!listBuffer) {
        flushParagraph();
        listBuffer = [];
      }
      listBuffer.push(item);
    } else {
      if (listBuffer) flushList();
      buffer.push(line);
    }
  }
  flushList();
  flushParagraph();

  return (
    <div className="prose prose-invert max-w-none text-text-secondary">
      {blocks.map((b, i) => {
        if (b.type === 'p') return <p key={i}>{b.content}</p>;
        return (
          <ul key={i} className="list-disc ml-6">
            {b.items?.map((it, idx) => <li key={idx}>{it}</li>)}
          </ul>
        );
      })}
    </div>
  );
}

function RelatedProductCard({ id, image, name, price }: { id: string; image: string; name: string; price: number }) {
  return (
    <Link href={`/product/${id}`} className="block bg-background-secondary border border-border p-3 rounded-md text-center hover:border-neon">
      <img src={image} alt={name} className="w-full h-24 object-contain mb-2" />
      <div className="text-sm font-medium text-white line-clamp-2">{name}</div>
      <div className="text-sm text-text-secondary">${price.toFixed(2)}</div>
    </Link>
  );
}

export default function ProductDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const { products } = useProducts();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === id);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <p className="text-center text-text-secondary">Product not found.</p>
      </div>
    );
  }

  const related = products
    .filter((p) => (p.category === product.category || p.brand === product.brand) && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <img src={product.image} alt={product.name} className="w-full object-contain rounded-md" />
        </div>
        <div className="md:col-span-2">
          <h1 className="text-2xl font-heading font-bold text-white mb-2">{product.name}</h1>
          <div className="text-sm text-neon font-medium mb-4">{product.brand}</div>
          <div className="text-2xl font-heading font-bold text-neon mb-6">${product.price.toFixed(2)}</div>

          {product.description && <ProductDescription description={product.description} />}

          <div className="flex items-center gap-3 my-6">
            <QuantitySelector
              quantity={qty}
              onIncrease={() => setQty((q) => q + 1)}
              onDecrease={() => setQty((q) => Math.max(1, q - 1))}
            />
            <Button onClick={() => addToCart(product, qty)}>
              <ShoppingCart className="w-4 h-4 mr-2" /> Add {qty}
            </Button>
          </div>

          <div className="mt-8">
            <h3 className="font-heading font-bold text-white mb-4">Related products</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.length === 0 && <div className="text-text-secondary">No related items found.</div>}
              {related.map((r) => (
                <RelatedProductCard key={r.id} id={r.id} image={r.image} name={r.name} price={r.price} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
