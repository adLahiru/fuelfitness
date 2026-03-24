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
  const [isAtTop, setIsAtTop] = useState(true);
  const [showSeparator, setShowSeparator] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { isAuthenticated, user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsAtTop(window.scrollY < 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keep the separator visible while the user is inside the hero (first) section.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hero = document.querySelector('section[data-hero]') || document.querySelector('section');
    if (!hero) return;

    const getHeroBottom = () => {
      const r = hero.getBoundingClientRect();
      return r.bottom + window.scrollY - 4; // small threshold
    };

    let heroBottom = getHeroBottom();

    const update = () => {
      heroBottom = getHeroBottom();
      setShowSeparator(window.scrollY < heroBottom);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm transition-all duration-300 ${
        showSeparator ? 'glow-bottom py-6' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Activity className="w-8 h-8 text-[#00ff88] group-hover:animate-pulse" />
            <span className="font-heading font-bold text-2xl tracking-wider text-white transition-all">
              FUEL<span className="text-[#00ff88]">FITNESS</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm font-medium uppercase tracking-wider transition-colors ${
                  pathname === link.path
                    ? 'text-[#00ff88]'
                    : 'text-white/80 hover:text-[#00ff88]'
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
              className="text-white/80 hover:text-[#00ff88] transition-colors hidden sm:flex items-center gap-2"
            >
              <User className="w-5 h-5" />
              {isAuthenticated && user ? (
                <span className="text-sm">Hi, {user.name}</span>
              ) : (
                <span className="text-sm">Login / Signup</span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative text-white/80 hover:text-[#00ff88] transition-colors group"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#00ff88] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white/80 hover:text-[#00ff88]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10 p-4 flex flex-col gap-4 shadow-xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`text-lg font-medium uppercase tracking-wider p-2 border-b border-white/10 ${
                pathname === link.path ? 'text-[#00ff88]' : 'text-white/80'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href={isAuthenticated ? '/orders' : '/auth'}
            className="text-lg font-medium uppercase tracking-wider p-2 text-white/80 flex items-center gap-2"
          >
            <User className="w-5 h-5" />
            {isAuthenticated ? 'My Account' : 'Login / Signup'}
          </Link>
        </div>
      )}
    </header>
  );
}