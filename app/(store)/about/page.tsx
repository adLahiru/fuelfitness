'use client';

import React from 'react';
import { Shield, Target, Zap } from 'lucide-react';

const values = [
  { icon: Target, title: 'OUR MISSION', desc: 'To provide athletes with the highest quality, scientifically-backed nutritional supplements that deliver real, measurable results without compromise.' },
  { icon: Shield, title: 'QUALITY ASSURANCE', desc: 'Every batch is third-party tested for purity and potency. We use zero artificial dyes, no hidden fillers, and fully transparent labels.' },
  { icon: Zap, title: 'INNOVATION', desc: 'We continuously research and develop new formulas based on the latest clinical studies in sports nutrition and human performance.' },
];

function ValueCard({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-4">
      <Icon className="w-10 h-10 text-neon" />
      <h3 className="text-xl font-heading font-bold text-white">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{desc}</p>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative py-24 bg-background-secondary overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2000"
            alt="Gym background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white mb-6">
              ENGINEERED FOR <br />
              <span className="text-neon text-glow">EXCELLENCE</span>
            </h1>
            <p className="text-lg text-text-secondary leading-relaxed">
              FuelFitness was born from a simple frustration: the supplement industry was full of proprietary blends, under-dosed ingredients, and false promises. We decided to change that.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((v, idx) => (
              <ValueCard key={idx} {...v} />
            ))}
          </div>
        </div>
      </section>

      {/* Image Grid */}
      <section className="py-12 bg-background-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="aspect-video relative overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=1000"
                alt="Training"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-neon/10 mix-blend-overlay" />
            </div>
            <div className="aspect-video relative overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=1000"
                alt="Supplements"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-neon/10 mix-blend-overlay" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
