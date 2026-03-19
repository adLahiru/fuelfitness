'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { useAdmin } from '@/contexts/AdminContext';
import { Activity, LogOut } from 'lucide-react';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, adminUser, logout } = useAdmin();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [isAuthenticated, router, pathname]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex bg-background text-text-primary selection:bg-neon selection:text-black">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Topbar */}
        <header className="h-16 bg-background-secondary border-b border-border flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 md:hidden">
            <Activity className="w-6 h-6 text-neon" />
            <span className="font-heading font-bold text-xl text-white">
              FUEL<span className="text-neon">ADMIN</span>
            </span>
          </div>
          <div className="hidden md:block">
            <h2 className="font-heading font-semibold text-white">Admin Portal</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="text-white font-medium">{adminUser?.name}</p>
              <p className="text-text-secondary text-xs capitalize">{adminUser?.role}</p>
            </div>
            <button
              onClick={() => { logout(); router.push('/admin/login'); }}
              className="p-2 text-text-secondary hover:text-neon transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
