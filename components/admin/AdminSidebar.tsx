'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, LayoutDashboard, Package, ShoppingCart, Users, Settings } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Members', path: '/admin/members', icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-background-secondary border-r border-border hidden md:flex flex-col shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-neon" />
          <span className="font-heading font-bold text-xl tracking-wider text-white">
            FUEL<span className="text-neon">ADMIN</span>
          </span>
        </div>
      </div>

      <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = item.exact ? pathname === item.path : pathname.startsWith(item.path);
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive ? 'bg-neon/10 text-neon font-medium border border-neon/20' : 'text-text-secondary hover:text-white hover:bg-background'}
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-text-secondary hover:text-white hover:bg-background transition-colors"
        >
          <Settings className="w-5 h-5" />
          Storefront
        </Link>
      </div>
    </aside>
  );
}
