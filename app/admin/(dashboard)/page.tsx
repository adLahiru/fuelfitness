'use client';

import React from 'react';
import Link from 'next/link';
import { DollarSign, ShoppingCart, Package, Users, ArrowRight, AlertCircle } from 'lucide-react';
import { useOrders } from '@/contexts/OrdersContext';
import { useProducts } from '@/contexts/ProductsContext';
import { useAdmin } from '@/contexts/AdminContext';
import { StatusBadge } from '@/components/ui/StatusBadge';

function StatCard({ icon: Icon, title, value, color }: { icon: React.ElementType; title: string; value: string | number; color: string }) {
  return (
    <div className="bg-background-secondary border border-border p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-full bg-background flex items-center justify-center border border-border ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm text-text-secondary mb-1">{title}</p>
        <h3 className="text-2xl font-heading font-bold text-white">{value}</h3>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { orders } = useOrders();
  const { products } = useProducts();
  const { members } = useAdmin();
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingPayments = orders.filter((o) => o.status === 'Payment Pending');
  const recentOrders = [...orders].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const stats = [
    { title: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-neon' },
    { title: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'text-white' },
    { title: 'Products', value: products.length, icon: Package, color: 'text-white' },
    { title: 'Admin Members', value: members.length, icon: Users, color: 'text-white' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-bold text-white mb-2">DASHBOARD</h1>
        <p className="text-text-secondary">Overview of your store&apos;s performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Action Needed */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-background-secondary border border-border p-6">
            <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
              <AlertCircle className="w-5 h-5 text-status-warning" />
              <h2 className="text-lg font-heading font-bold text-white">ACTION NEEDED</h2>
            </div>
            {pendingPayments.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-text-secondary mb-4">
                  You have <span className="text-status-warning font-bold">{pendingPayments.length}</span> orders awaiting payment verification.
                </p>
                {pendingPayments.slice(0, 3).map((order) => (
                  <div key={order.id} className="bg-background border border-border p-3 text-sm flex justify-between items-center">
                    <div>
                      <p className="font-bold text-white">{order.id}</p>
                      <p className="text-text-secondary">${order.total.toFixed(2)}</p>
                    </div>
                    <Link href="/admin/orders" className="text-neon hover:underline">Verify</Link>
                  </div>
                ))}
                {pendingPayments.length > 3 && (
                  <Link href="/admin/orders" className="text-sm text-text-secondary hover:text-neon block text-center mt-4">View all pending</Link>
                )}
              </div>
            ) : (
              <p className="text-sm text-text-secondary text-center py-8">No pending actions required.</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-background-secondary border border-border p-6">
          <div className="flex justify-between items-center mb-6 border-b border-border pb-4">
            <h2 className="text-lg font-heading font-bold text-white">RECENT ORDERS</h2>
            <Link href="/admin/orders" className="text-sm text-neon hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-background/50 transition-colors">
                    <td className="py-4 font-medium text-white">{order.id}</td>
                    <td className="py-4 text-text-secondary">{order.date}</td>
                    <td className="py-4 text-white">{order.customerName || 'Guest'}</td>
                    <td className="py-4"><StatusBadge status={order.status} /></td>
                    <td className="py-4 text-right font-bold text-white">${order.total.toFixed(2)}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-text-secondary">No orders yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
