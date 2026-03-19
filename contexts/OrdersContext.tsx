'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { Order, OrderStatus } from '@/types/store';

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => Order;
  updateOrderStatus: (id: string, status: OrderStatus) => void;
  updateOrderTracking: (id: string, trackingNumber: string) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const initialOrders: Order[] = [
  {
    id: 'NX-8492-771',
    date: 'Oct 24, 2023',
    status: 'Shipped',
    total: 129.97,
    trackingNumber: 'TRK9982736451',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    items: [
      { id: '1', name: 'Iso-Surge Whey Protein Isolate', category: 'Protein', price: 59.99, rating: 4.9, reviews: 1245, image: '', brand: 'NEXUS', quantity: 1 },
      { id: '2', name: 'Neuro-Stim Pre-Workout', category: 'Pre-Workout', price: 39.99, rating: 4.8, reviews: 892, image: '', brand: 'NEXUS', quantity: 1 },
      { id: '3', name: 'Creapure Micronized Creatine', category: 'Creatine', price: 29.99, rating: 5.0, reviews: 2104, image: '', brand: 'NEXUS', quantity: 1 },
    ],
  },
];

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem('nexusfit_orders');
    if (storedOrders) {
      try {
        const parsed = JSON.parse(storedOrders);
        if (parsed.length > 0) {
          setOrders(parsed);
        } else {
          setOrders(initialOrders);
        }
      } catch (e) {
        console.error('Failed to parse orders', e);
        setOrders(initialOrders);
      }
    } else {
      setOrders(initialOrders);
    }
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('nexusfit_orders', JSON.stringify(orders));
    }
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: `NX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      status: 'Payment Pending',
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const updateOrderTracking = (id: string, trackingNumber: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, trackingNumber } : o)));
  };

  return (
    <OrdersContext.Provider value={{ orders, addOrder, updateOrderStatus, updateOrderTracking }}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}
