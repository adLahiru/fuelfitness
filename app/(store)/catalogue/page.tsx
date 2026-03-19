'use client';

import React, { Suspense, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { useProducts } from '@/contexts/ProductsContext';

const categories = ['All', 'Protein', 'Pre-Workout', 'Creatine', 'Vitamins', 'Amino Acids'];
const priceRanges = ['All', 'Under $30', '$30 - $50', 'Over $50'];
const brands = ['All', 'NEXUS'];

function FilterGroup({ title, options, selected, onSelect }: { title: string; options: string[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <div>
      <h3 className="font-heading font-bold text-white mb-4 tracking-wider border-b border-border pb-2">{title}</h3>
      <ul className="flex flex-col gap-2">
        {options.map((opt) => (
          <li key={opt}>
            <button
              onClick={() => onSelect(opt)}
              className={`text-sm hover:text-neon transition-colors ${selected === opt ? 'text-neon font-semibold' : 'text-text-secondary'}`}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CatalogueContent() {
  const { products } = useProducts();
  const searchParams = useSearchParams();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const categoryParam = searchParams.get('category');

  const [filters, setFilters] = useState({
    category: categoryParam || 'All',
    priceRange: 'All',
    brand: 'All',
  });

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (filters.category !== 'All' && product.category !== filters.category) return false;
      if (filters.brand !== 'All' && product.brand !== filters.brand) return false;
      if (filters.priceRange === 'Under $30' && product.price >= 30) return false;
      if (filters.priceRange === '$30 - $50' && (product.price < 30 || product.price > 50)) return false;
      if (filters.priceRange === 'Over $50' && product.price <= 50) return false;
      return true;
    });
  }, [filters, products]);

  const updateFilter = (type: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [type]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: 'All', priceRange: 'All', brand: 'All' });
  };

  const FilterSidebar = () => (
    <div className="flex flex-col gap-8">
      <div className="flex justify-end">
        <button onClick={clearFilters} className="text-sm text-neon hover:text-white underline underline-offset-2">
          Clear Filters
        </button>
      </div>
      <FilterGroup title="CATEGORIES" options={categories} selected={filters.category} onSelect={(v) => updateFilter('category', v)} />
      <FilterGroup title="PRICE RANGE" options={priceRanges} selected={filters.priceRange} onSelect={(v) => updateFilter('priceRange', v)} />
      <FilterGroup title="BRANDS" options={brands} selected={filters.brand} onSelect={(v) => updateFilter('brand', v)} />
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2">
            OUR <span className="text-neon">SUPPLEMENTS</span>
          </h1>
          <p className="text-text-secondary">Showing {filteredProducts.length} products</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="md:hidden flex items-center gap-2 text-white bg-background-secondary border border-border px-4 py-2"
            onClick={() => setIsMobileFiltersOpen(true)}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <button onClick={clearFilters} className="hidden md:inline text-neon hover:text-white underline underline-offset-4">
            Clear Filters
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0 sticky top-28">
          <FilterSidebar />
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden flex">
            <div className="w-4/5 max-w-sm bg-background-secondary h-full border-r border-border p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-heading font-bold text-xl text-white">Filters</h2>
                <button onClick={() => setIsMobileFiltersOpen(false)} className="text-text-secondary hover:text-neon">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <FilterSidebar />
            </div>
            <div className="flex-1" onClick={() => setIsMobileFiltersOpen(false)} />
          </div>
        )}

        {/* Product Grid */}
        <div className="flex-1 w-full">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-border border-dashed bg-background-secondary/50">
              <Filter className="w-12 h-12 text-text-secondary mb-4" />
              <h3 className="text-xl font-heading font-bold text-white mb-2">No products found</h3>
              <p className="text-text-secondary mb-6">Try adjusting your filters to find what you&apos;re looking for.</p>
              <button onClick={clearFilters} className="text-neon hover:text-white underline underline-offset-4">
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CataloguePage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CatalogueContent />
    </Suspense>
  );
}
