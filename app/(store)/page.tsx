'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, Award, Zap, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useProducts } from '@/contexts/ProductsContext';

/* ─── Sub-components for the Home page ─── */

const features = [
  { icon: ShieldCheck, title: 'Authentic Products', desc: '100% verified genuine supplements directly from manufacturers.' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Same-day dispatch and express shipping nationwide.' },
  { icon: Award, title: 'Premium Quality', desc: 'Lab-tested ingredients for maximum efficacy and safety.' },
  { icon: Star, title: 'Trusted Brand', desc: 'Over 50,000+ satisfied athletes and fitness enthusiasts.' },
];

function FeatureCard({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 glass-panel group hover:border-neon/50 transition-colors">
      <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center mb-6 group-hover:shadow-neon transition-shadow">
        <Icon className="w-8 h-8 text-neon" />
      </div>
      <h3 className="text-lg font-heading font-bold text-white mb-3">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

const reviews = [
  { name: 'Marcus T.', role: 'Powerlifter', text: "The pre-workout is insane. Clean energy, no crash, and the pumps are unreal. Best I've ever used." },
  { name: 'Sarah J.', role: 'CrossFit Athlete', text: 'Recovery time cut in half since switching to their Iso-Surge protein. Tastes amazing too.' },
  { name: 'David L.', role: 'Bodybuilder', text: "Finally a brand that doesn't hide behind proprietary blends. You know exactly what you're getting." },
];

function TestimonialCard({ name, role, text }: { name: string; role: string; text: string }) {
  return (
    <div className="bg-background p-8 border border-border relative">
      <div className="flex justify-center gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-neon text-neon" />
        ))}
      </div>
      <p className="text-text-secondary italic mb-6">&quot;{text}&quot;</p>
      <h4 className="font-heading font-bold text-white">{name}</h4>
      <span className="text-sm text-neon">{role}</span>
    </div>
  );
}

/* ─── Home Page ─── */

export default function HomePage() {
  const { products } = useProducts();
  const featuredProducts = products.slice(0, 4);

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section data-hero className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2000"
            alt="Athlete training"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-dim/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neon/30 bg-background/50 backdrop-blur-sm mb-8">
            <Zap className="w-4 h-4 text-neon" />
            <span className="text-sm font-medium text-neon tracking-wider uppercase">
              Next Gen Nutrition
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black text-white mb-6 tracking-tight leading-tight">
            FUEL YOUR <br />
            <span className="text-neon text-glow">PERFORMANCE</span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Premium, science-backed supplements engineered for athletes who demand the absolute best from their bodies. No compromises.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/catalogue">
              <Button size="lg" className="w-full sm:w-auto group">
                BROWSE SUPPLEMENTS
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                OUR STORY
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section data-nav-bg="var(--color-background-secondary)" className="py-20 bg-background-secondary border-y border-border relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <FeatureCard key={idx} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section data-nav-bg="var(--color-background)" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <SectionHeading title="BEST" highlight="SELLERS" subtitle="Our most popular formulas, trusted by professionals and proven to deliver results." />
            <Link href="/catalogue">
              <Button variant="ghost" className="group">
                View All Products
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section data-nav-bg="var(--color-background-secondary)" className="py-24 bg-background-secondary border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading title="ATHLETE" highlight="REVIEWS" centered className="mb-16" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <TestimonialCard key={idx} {...review} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
