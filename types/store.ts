export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  brand: string;
  description?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'admin';
}

export type OrderStatus =
  | 'Payment Pending'
  | 'Payment Verified'
  | 'Order Confirmed'
  | 'Preparing Shipment'
  | 'Shipped'
  | 'Delivered';

export interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: CartItem[];
  trackingNumber?: string;
  customerName?: string;
  customerEmail?: string;
  shippingAddress?: string;
  paymentReceiptUrl?: string;
}
