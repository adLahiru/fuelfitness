'use client';

import React, { useState } from 'react';
import { Search, Package, CheckCircle, Clock, Truck, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { OrderStatus, Order } from '@/types/store';
import { useOrders } from '@/contexts/OrdersContext';
import { useAuth } from '@/contexts/AuthContext';

const timelineSteps: { status: OrderStatus; icon: React.ElementType; desc: string }[] = [
  { status: 'Payment Pending', icon: Clock, desc: 'Awaiting payment receipt upload' },
  { status: 'Payment Verified', icon: CheckCircle, desc: 'Admin verified payment' },
  { status: 'Order Confirmed', icon: Package, desc: 'Order is being processed' },
  { status: 'Preparing Shipment', icon: Package, desc: 'Packing your supplements' },
  { status: 'Shipped', icon: Truck, desc: 'Handed over to courier' },
  { status: 'Delivered', icon: MapPin, desc: 'Delivered to your address' },
];

function TrackingTimeline({ currentStepIndex }: { currentStepIndex: number }) {
  return (
    <div className="relative mb-12 pl-4 md:pl-0">
      <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-border md:hidden" />
      <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-4 relative">
        <div className="hidden md:block absolute top-6 left-10 right-10 h-0.5 bg-border z-0" />
        {timelineSteps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const Icon = step.icon;
          return (
            <div key={step.status} className="relative z-10 flex md:flex-col items-start md:items-center gap-4 md:gap-3 flex-1">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-300 ${isCompleted ? 'bg-neon border-neon text-black shadow-neon' : 'bg-background border-border text-text-secondary'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="md:text-center pt-2 md:pt-0">
                <h4 className={`font-bold text-sm mb-1 ${isCompleted ? 'text-white' : 'text-text-secondary'}`}>{step.status}</h4>
                <p className="text-xs text-text-secondary hidden md:block">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { orders } = useOrders();
  const { user } = useAuth();
  const [searchId, setSearchId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const userOrders = orders.filter((o) => o.customerEmail === user?.email);

  React.useEffect(() => {
    if (!hasSearched) {
      setSelectedOrder(userOrders.length > 0 ? userOrders[0] : null);
    }
  }, [userOrders.length, hasSearched]);

  const displayOrder = searchedOrder || selectedOrder;
  const currentStepIndex = displayOrder ? timelineSteps.findIndex((step) => step.status === displayOrder.status) : -1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      setHasSearched(true);
      const found = orders.find((o) => o.id.toLowerCase() === searchId.toLowerCase());
      setSearchedOrder(found || null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
          TRACK <span className="text-neon">ORDER</span>
        </h1>
        <p className="text-text-secondary max-w-xl mx-auto">
          Enter your order ID below to check the current status of your shipment.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 max-w-xl mx-auto mb-16">
        <Input placeholder="e.g. NX-8492-771" value={searchId} onChange={(e) => setSearchId(e.target.value)} icon={<Search className="w-5 h-5" />} className="flex-1" />
        <Button type="submit">TRACK</Button>
      </form>

      {hasSearched && !searchedOrder && (
        <div className="text-center py-8 bg-background-secondary border border-border">
          <p className="text-status-warning">No order found with ID: {searchId}</p>
        </div>
      )}

      {userOrders.length > 0 && (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {userOrders.map((o) => (
            <button
              key={o.id}
              onClick={() => { setSearchedOrder(null); setHasSearched(false); setSelectedOrder(o); }}
              className={`text-left p-3 border rounded-md bg-background-secondary hover:border-neon transition-colors ${displayOrder?.id === o.id ? 'ring-2 ring-neon' : ''}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Order #{o.id}</div>
                  <div className="text-xs text-text-secondary">{o.date}</div>
                </div>
                <div className="text-right">
                  {o.trackingNumber ? (
                    <div className="font-mono text-sm text-neon">{o.trackingNumber}</div>
                  ) : (
                    <div className="text-xs text-text-secondary">No tracking yet</div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {displayOrder && (
        <div className="bg-background-secondary border border-border p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-6 mb-8 gap-4">
            <div>
              <h2 className="text-xl font-heading font-bold text-white mb-1">Order #{displayOrder.id}</h2>
              <p className="text-sm text-text-secondary">Placed on {displayOrder.date}</p>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-neon text-neon text-sm font-medium bg-neon/10">
              {displayOrder.status}
            </div>
          </div>

          <TrackingTimeline currentStepIndex={currentStepIndex} />

          {displayOrder.trackingNumber && (
            <div className="bg-background border border-border p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-background-secondary border border-border flex items-center justify-center">
                  <Truck className="w-6 h-6 text-neon" />
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Tracking Number</p>
                  <p className="font-mono font-bold text-white tracking-wider">{displayOrder.trackingNumber}</p>
                </div>
              </div>
              <Button variant="outline">TRACK ON COURIER WEBSITE</Button>
            </div>
          )}

          <div>
            <h3 className="font-heading font-bold text-white mb-4">Items in this order</h3>
            <div className="space-y-3">
              {displayOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-text-secondary">{item.quantity}x</span>
                    <span className="text-white">{item.name}</span>
                  </div>
                  <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-border">
              <span className="font-bold text-white">Total Amount</span>
              <span className="text-xl font-heading font-bold text-neon">${displayOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
