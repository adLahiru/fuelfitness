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
  const [navBg, setNavBg] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navTextColor, setNavTextColor] = useState<string | null>(null);
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

    const footer = document.querySelector('footer');
    const isCatalogue = pathname?.startsWith('/catalogue');

    let heroBottom = getHeroBottom();

    const update = () => {
      heroBottom = getHeroBottom();
      // Ensure separator remains visible when near the top of the page
      const nearTop = window.scrollY < 50;
      let visible = nearTop || window.scrollY < heroBottom;

      // On the catalogue page, hide the navbar separator when the footer is visible
      if (isCatalogue && footer) {
        const fr = footer.getBoundingClientRect();
        const footerVisible = fr.top <= window.innerHeight - 20; // small buffer
        if (footerVisible) visible = false;
      }

      setShowSeparator(visible);
    };

    update();
    // also run a delayed update to catch dynamically-rendered sections
    const t = window.setTimeout(update, 60);
    // minor rAF to catch paint timing
    const raf = requestAnimationFrame(update);
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [pathname]);

  // When the hero separator is gone (user scrolled past hero), match navbar background
  // to the section currently under the fixed header. Include the footer as well.
  useEffect(() => {
    if (showSeparator) {
      setNavBg(null);
      return;
    }

    if (typeof window === 'undefined') return;

    const headerEl = document.querySelector('header') as HTMLElement | null;
    const headerH = () => headerEl?.offsetHeight ?? 64;

    const collectTargets = (): HTMLElement[] => {
      const secs = Array.from(document.querySelectorAll('section')) as HTMLElement[];
      const footer = document.querySelector('footer') as HTMLElement | null;
      if (footer) secs.push(footer);
      return secs;
    };

    const getBgFor = (el: HTMLElement) => {
      const data = el.getAttribute('data-nav-bg');
      if (data) return data;
      const style = window.getComputedStyle(el).backgroundColor;
      if (!style || style === 'rgba(0, 0, 0, 0)' || style === 'transparent') {
        return 'rgba(10,10,10,0.95)';
      }
      return style;
    };

    const parseRgb = (cssColor: string) => {
      // supports rgb(), rgba(), and hex via temporary element
      if (!cssColor) return null;
      const ctx = document.createElement('div');
      ctx.style.color = cssColor;
      document.body.appendChild(ctx);
      const computed = window.getComputedStyle(ctx).color;
      document.body.removeChild(ctx);
      const m = computed.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([0-9.]+))?\)/);
      if (!m) return null;
      return { r: +m[1], g: +m[2], b: +m[3], a: m[4] ? +m[4] : 1 };
    };

    const luminance = (r: number, g: number, b: number) => {
      const toLin = (v: number) => {
        v = v / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
    };

    const update = () => {
      const targets = collectTargets();
      if (!targets.length) return;
      const hh = headerH();
      // prefer the element directly under the header
      let found: HTMLElement | null = null;
      for (const t of targets) {
        // skip hero sections when matching
        if (t instanceof HTMLElement && t.hasAttribute('data-hero')) continue;
        const r = t.getBoundingClientRect();
        if (r.top <= hh + 4 && r.bottom > hh + 4) {
          found = t;
          break;
        }
      }
      if (!found) {
        // fallback: pick the element with largest visible area
        let maxVisible = 0;
        for (const t of targets) {
          if (t instanceof HTMLElement && t.hasAttribute('data-hero')) continue;
          const r = t.getBoundingClientRect();
          const visible = Math.max(0, Math.min(window.innerHeight, r.bottom) - Math.max(0, r.top));
          if (visible > maxVisible) {
            maxVisible = visible;
            found = t;
          }
        }
      }
      if (found) {
        const raw = getBgFor(found);
        setNavBg(raw);
        const rgb = parseRgb(raw);
        if (rgb) {
          const L = luminance(rgb.r, rgb.g, rgb.b);
          // pick white text on dark backgrounds, black text on light backgrounds
          setNavTextColor(L < 0.5 ? '#ffffff' : '#000000');
        } else {
          setNavTextColor('#ffffff');
        }
      }
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [showSeparator, pathname]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showSeparator ? 'glow-bottom py-6' : 'py-4'
      }`}
      style={{
        background: showSeparator ? 'rgba(10,10,10,0.95)' : (navBg ?? 'rgba(10,10,10,0.95)'),
        color: navTextColor ?? (showSeparator ? '#ffffff' : undefined)
      }}
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