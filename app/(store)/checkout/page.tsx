'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, CheckCircle, Upload } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useOrders } from '@/contexts/OrdersContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { OrderSummary } from '@/components/ui/OrderSummary';

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center mb-8">
      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step >= 1 ? 'bg-neon text-black' : 'bg-background-secondary text-text-secondary border border-border'}`}>1</div>
      <div className={`h-1 flex-1 mx-2 ${step >= 2 ? 'bg-neon' : 'bg-border'}`} />
      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${step >= 2 ? 'bg-neon text-black' : 'bg-background-secondary text-text-secondary border border-border'}`}>2</div>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addOrder } = useOrders();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', address: '', city: '', state: '', zip: '', phone: '',
  });

  useEffect(() => {
    if (!isAuthenticated) router.push('/auth?redirect=/checkout');
    if (items.length === 0 && !isSuccess) router.push('/catalogue');
  }, [isAuthenticated, items.length, router, isSuccess]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      if (!file) { alert('Please upload a payment receipt.'); return; }
      setIsSubmitting(true);
      setTimeout(() => {
        addOrder({
          total: totalPrice,
          items: items,
          customerName: `${formData.firstName} ${formData.lastName}`,
          customerEmail: user?.email || '',
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
          paymentReceiptUrl: file.name,
        });
        setIsSubmitting(false);
        setIsSuccess(true);
        clearCart();
      }, 1500);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 bg-status-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-status-success" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-white mb-4">ORDER SUBMITTED</h1>
        <p className="text-text-secondary mb-8">
          Your payment receipt has been submitted successfully. Our admin team will verify your payment and process your order shortly.
        </p>
        <Button onClick={() => router.push('/orders')}>TRACK ORDER STATUS</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-8">
        SECURE <span className="text-neon">CHECKOUT</span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        <div className="flex-1 w-full">
          <StepIndicator step={step} />

          <form onSubmit={handleSubmit} className="bg-background-secondary border border-border p-6 md:p-8">
            {step === 1 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-heading font-bold text-white border-b border-border pb-4">DELIVERY DETAILS</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="First Name" required value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} />
                  <Input label="Last Name" required value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} />
                </div>
                <Input label="Street Address" required value={formData.address} onChange={(e) => updateField('address', e.target.value)} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input label="City" required value={formData.city} onChange={(e) => updateField('city', e.target.value)} />
                  <Input label="State/Province" required value={formData.state} onChange={(e) => updateField('state', e.target.value)} />
                  <Input label="ZIP/Postal Code" required value={formData.zip} onChange={(e) => updateField('zip', e.target.value)} />
                </div>
                <Input label="Phone Number" type="tel" required value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
                <Button type="submit" fullWidth size="lg" className="mt-4">CONTINUE TO PAYMENT</Button>
              </div>
            ) : (
              <div className="space-y-6">
                <h2 className="text-xl font-heading font-bold text-white border-b border-border pb-4">PAYMENT INSTRUCTIONS</h2>

                <div className="bg-status-warning/10 border border-status-warning/30 p-4 flex gap-4 items-start">
                  <AlertCircle className="w-6 h-6 text-status-warning shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-status-warning mb-1">Manual Bank Transfer</h4>
                    <p className="text-sm text-text-secondary">
                      Please transfer the exact total amount to the bank account below. Your order will not ship until we receive the funds.
                    </p>
                  </div>
                </div>

                <div className="bg-background border border-border p-4 space-y-2 font-mono text-sm">
                  <div className="flex justify-between"><span className="text-text-secondary">Bank Name:</span> <span className="text-white">NeoBank Global</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Account Name:</span> <span className="text-white">FuelFitness Supplements LLC</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Account Number:</span> <span className="text-neon font-bold">1234-5678-9012</span></div>
                  <div className="flex justify-between"><span className="text-text-secondary">Routing Number:</span> <span className="text-white">098765432</span></div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h3 className="font-bold text-white mb-4">Upload Payment Receipt</h3>
                  <div className="border-2 border-dashed border-border hover:border-neon transition-colors p-8 text-center bg-background cursor-pointer relative">
                    <input type="file" accept="image/*,.pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                    <Upload className="w-8 h-8 text-text-secondary mx-auto mb-2" />
                    {file ? (
                      <p className="text-neon font-medium">{file.name}</p>
                    ) : (
                      <>
                        <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
                        <p className="text-sm text-text-secondary">PNG, JPG or PDF (max. 5MB)</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>BACK</Button>
                  <Button type="submit" fullWidth isLoading={isSubmitting}>SUBMIT ORDER</Button>
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <OrderSummary items={items} totalPrice={totalPrice} shippingText="Free" />
        </div>
      </div>
    </div>
  );
}
