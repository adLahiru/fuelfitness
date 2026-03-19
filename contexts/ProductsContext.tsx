'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { Product } from '@/types/store';
import { mockProducts } from '@/data/mockProducts';

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedProducts = localStorage.getItem('nexusfit_products');
    if (storedProducts) {
      try {
        const parsed = JSON.parse(storedProducts);
        if (parsed.length > 0) {
          const merged = mockProducts.map((m) => {
            const found = parsed.find((p: Product) => p.id === m.id);
            if (found) {
              return { ...m, ...found } as Product;
            }
            return m;
          });
          const extras = parsed.filter(
            (p: Product) => !mockProducts.find((m) => m.id === p.id)
          );
          setProducts([...merged, ...extras]);
        } else {
          setProducts(mockProducts);
        }
      } catch (e) {
        console.error('Failed to parse products', e);
        setProducts(mockProducts);
      }
    } else {
      setProducts(mockProducts);
    }
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('nexusfit_products', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: `prod-${Date.now()}` };
    setProducts((prev) => [...prev, newProduct as Product]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
