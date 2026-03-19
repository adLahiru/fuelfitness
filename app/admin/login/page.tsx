'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Activity } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAdmin();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-background-secondary border border-border p-8 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <Activity className="w-12 h-12 text-neon mb-4" />
          <h1 className="text-2xl font-heading font-bold text-white tracking-wider text-center">ADMIN PORTAL</h1>
          <p className="text-text-secondary text-sm mt-2 text-center">Authorized personnel only.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Admin Email" type="email" placeholder="admin@nexusfit.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" fullWidth className="mt-8">ACCESS SECURE PORTAL</Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-text-secondary">Default login: admin@nexusfit.com / any password</p>
        </div>
      </div>
    </div>
  );
}
