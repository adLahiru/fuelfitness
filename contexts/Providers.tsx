'use client';

import React from 'react';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { AdminProvider } from './AdminContext';
import { ProductsProvider } from './ProductsContext';
import { OrdersProvider } from './OrdersContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <ProductsProvider>
        <OrdersProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </OrdersProvider>
      </ProductsProvider>
    </AdminProvider>
  );
}
