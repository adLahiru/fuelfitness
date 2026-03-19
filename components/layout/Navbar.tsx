'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, User, Menu, X, Activity } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Catalogue', path: '/catalogue' },
  { name: 'About Us', path: '/about' },
  { name: 'Orders', path: '/orders' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/90 backdrop-blur-md border-b border-border py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Activity className="w-8 h-8 text-neon group-hover:animate-pulse" />
            <span className="font-heading font-bold text-2xl tracking-wider text-white group-hover:text-glow transition-all">
              FUEL<span className="text-neon">FITNESS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm font-medium uppercase tracking-wider transition-colors hover:text-neon ${
                  pathname === link.path ? 'text-neon text-glow-sm' : 'text-text-secondary'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href={isAuthenticated ? '/orders' : '/auth'}
              className="text-text-secondary hover:text-neon transition-colors hidden sm:flex items-center gap-2"
            >
              <User className="w-5 h-5" />
              {isAuthenticated && user ? (
                <span className="text-sm">Hi, {user.name}</span>
              ) : (
                <span className="text-sm">Login / Signup</span>
              )}
            </Link>
            <Link href="/cart" className="relative text-text-secondary hover:text-neon transition-colors group">
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-neon text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center group-hover:shadow-neon transition-shadow">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-text-secondary hover:text-neon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 flex flex-col gap-4 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`text-lg font-medium uppercase tracking-wider p-2 border-b border-border/50 ${
                pathname === link.path ? 'text-neon' : 'text-text-secondary'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href={isAuthenticated ? '/orders' : '/auth'}
            className="text-lg font-medium uppercase tracking-wider p-2 text-text-secondary flex items-center gap-2"
          >
            <User className="w-5 h-5" />
            {isAuthenticated ? 'My Account' : 'Login / Signup'}
          </Link>
        </div>
      )}
    </header>
  );
}
