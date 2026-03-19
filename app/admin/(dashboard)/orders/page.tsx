'use client';

import React, { useState } from 'react';
import { CheckCircle, Truck, Search, Eye, X } from 'lucide-react';
import { useOrders } from '@/contexts/OrdersContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Order, OrderStatus } from '@/types/store';

const statuses: OrderStatus[] = ['Payment Pending', 'Payment Verified', 'Order Confirmed', 'Preparing Shipment', 'Shipped', 'Delivered'];

function OrderDetailsView({ order: initialOrder, onClose, onUpdateStatus, onVerifyPayment, onSaveTracking }: {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onVerifyPayment: (id: string) => void;
  onSaveTracking: (id: string, tracking: string) => void;
}) {
  const [order, setOrder] = useState(initialOrder);
  const [trackingInput, setTrackingInput] = useState('');

  const handleStatusChange = (status: OrderStatus) => {
    onUpdateStatus(order.id, status);
    setOrder({ ...order, status });
  };

  const handleVerify = () => {
    onVerifyPayment(order.id);
    setOrder({ ...order, status: 'Payment Verified' });
  };

  const handleSaveTracking = () => {
    if (trackingInput) {
      onSaveTracking(order.id, trackingInput);
      setOrder({ ...order, trackingNumber: trackingInput });
      setTrackingInput('');
    }
  };

  return (
    <div className="bg-background-secondary border border-border p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-white">ORDER {order.id}</h2>
          <p className="text-text-secondary">{order.date}</p>
        </div>
        <button onClick={onClose} className="text-text-secondary hover:text-white cursor-pointer"><X className="w-6 h-6" /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Customer Details</h3>
            <p className="text-white font-medium">{order.customerName || 'Guest Customer'}</p>
            <p className="text-text-secondary text-sm">{order.customerEmail}</p>
            <p className="text-text-secondary text-sm mt-2">{order.shippingAddress}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Order Status</h3>
            <div className="flex items-center gap-4">
              <select
                className="bg-background border border-border px-3 py-2 text-white focus:border-neon focus:outline-none"
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
              >
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {order.status === 'Payment Pending' && (
                <Button size="sm" onClick={handleVerify}><CheckCircle className="w-4 h-4 mr-2" /> Verify Payment</Button>
              )}
            </div>
          </div>

          {['Preparing Shipment', 'Shipped', 'Delivered'].includes(order.status) && (
            <div>
              <h3 className="text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Tracking Info</h3>
              {order.trackingNumber ? (
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-neon" />
                  <span className="font-mono text-white">{order.trackingNumber}</span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input placeholder="Enter tracking number" value={trackingInput} onChange={(e) => setTrackingInput(e.target.value)} />
                  <Button onClick={handleSaveTracking}>Save</Button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-background border border-border p-6">
          <h3 className="text-sm font-bold text-text-secondary mb-4 uppercase tracking-wider border-b border-border pb-2">Order Items</h3>
          <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">{item.quantity}x</span>
                  <span className="text-white line-clamp-1">{item.name}</span>
                </div>
                <span className="text-white shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <span className="font-bold text-white">Total</span>
            <span className="text-xl font-heading font-bold text-neon">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus, updateOrderTracking } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleVerifyPayment = (id: string) => updateOrderStatus(id, 'Payment Verified');

  if (selectedOrder) {
    return (
      <OrderDetailsView
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onUpdateStatus={updateOrderStatus}
        onVerifyPayment={handleVerifyPayment}
        onSaveTracking={updateOrderTracking}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">ORDERS</h1>
        <p className="text-text-secondary">Manage customer orders and verify payments.</p>
      </div>

      <div className="bg-background-secondary border border-border p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input placeholder="Search by Order ID or Customer..." icon={<Search className="w-4 h-4" />} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select
            className="bg-background border border-border px-4 py-3 text-text-primary focus:outline-none focus:border-neon"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-text-secondary border-b border-border">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Total</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-background/50 transition-colors">
                  <td className="py-4 font-medium text-white">{order.id}</td>
                  <td className="py-4 text-text-secondary">{order.date}</td>
                  <td className="py-4 text-white">{order.customerName || 'Guest'}</td>
                  <td className="py-4"><StatusBadge status={order.status} /></td>
                  <td className="py-4 text-right font-bold text-white">${order.total.toFixed(2)}</td>
                  <td className="py-4 text-right">
                    <Button size="sm" variant="outline" onClick={() => setSelectedOrder(order)}>
                      <Eye className="w-4 h-4 mr-2" /> View
                    </Button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-text-secondary">No orders found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
