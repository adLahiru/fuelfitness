'use client';

import React from 'react';
import Link from 'next/link';
import { Activity, Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const quickLinks = [
  { label: 'Shop All Supplements', href: '/catalogue' },
  { label: 'Premium Protein', href: '/catalogue?category=protein' },
  { label: 'Pre-Workout', href: '/catalogue?category=preworkout' },
  { label: 'Our Story', href: '/about' },
  { label: 'Track Order', href: '/orders' },
];

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
];

export function Footer() {
  return (
    <footer className="relative bg-[#0a0a0a] glow-top pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-[#00ff88]" />
              <span className="font-heading font-bold text-xl tracking-wider text-white">
                FUEL<span className="text-[#00ff88]">FITNESS</span>
              </span>
            </Link>

            <p className="text-white/60 text-sm leading-relaxed">
              Premium supplements engineered for peak performance. Fuel your body with nature&apos;s
              most potent ingredients, backed by science.
            </p>

            <div className="flex items-center gap-4 mt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:text-[#00ff88] hover:border hover:border-[#00ff88]/40 transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6 tracking-wider">
              QUICK LINKS
            </h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-[#00ff88] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6 tracking-wider">
              CONTACT US
            </h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-sm text-white/60">
                <MapPin className="w-5 h-5 text-[#00ff88] shrink-0" />
                <span>
                  123 Fitness Boulevard, Suite 400
                  <br />
                  Neo City, NC 90210
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Phone className="w-5 h-5 text-[#00ff88] shrink-0" />
                <span>+1 (800) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/60">
                <Mail className="w-5 h-5 text-[#00ff88] shrink-0" />
                <span>support@nexusfit.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-6 tracking-wider">
              NEWSLETTER
            </h4>
            <p className="text-white/60 text-sm mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <Input placeholder="Enter your email" type="email" required />
              <Button variant="primary" fullWidth>
                SUBSCRIBE
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} FuelFitness Supplements. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/40">
            <Link href="#" className="hover:text-[#00ff88] transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-[#00ff88] transition-colors">
              Terms of Service
            </Link>
            <span className="text-white/20">|</span>
            <Link href="/admin/login" className="hover:text-[#00ff88] transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}