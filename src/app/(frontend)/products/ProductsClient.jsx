'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, X, Search } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import SkeletonCard from '@/components/ui/SkeletonCard';

const sortOptions = [
  { value: 'default',   label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating',    label: 'Top Rated' },
  { value: 'newest',    label: 'Newest' },
];

const priceRanges = [
  { label: 'Under ₹25,000',       min: 0,       max: 25000 },
  { label: '₹25,000 – ₹75,000',  min: 25000,   max: 75000 },
  { label: '₹75,000 – ₹2,00,000', min: 75000,  max: 200000 },
  { label: 'Above ₹2,00,000',     min: 200000, max: Infinity },
];

function FilterSidebar({ filters, setFilters, onClose, mobile, categories, types, purities }) {
  const toggle = (key, value) => {
    setFilters((prev) => {
      const set = new Set(prev[key]);
      set.has(value) ? set.delete(value) : set.add(value);
      return { ...prev, [key]: set };
    });
  };

  const CheckItem = ({ label, checked, onChange }) => (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <div
        onClick={onChange}
        className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-all ${
          checked ? 'bg-primary border-primary-hover' : 'border-gray-300 group-hover:border-primary'
        }`}
      >
        {checked && <span className="text-on-dark text-[9px]">✓</span>}
      </div>
      <span className="text-sm text-text group-hover:text-primary-hover transition-colors">{label}</span>
    </label>
  );

  return (
    <div className={mobile ? 'p-5' : 'sticky top-28'}>
      {mobile && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-serif text-lg font-bold">Filters</h3>
          <button onClick={onClose}><X size={18} /></button>
        </div>
      )}

      {/* Category */}
      <div className="mb-7">
        <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary-hover mb-3">Category</h4>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <CheckItem
              key={cat}
              label={cat}
              checked={filters.categories.has(cat)}
              onChange={() => toggle('categories', cat)}
            />
          ))}
        </div>
      </div>
      <div className="gold-divider mb-7" />

      {/* Type */}
      <div className="mb-7">
        <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary-hover mb-3">Type</h4>
        <div className="space-y-2.5">
          {types.map((t) => (
            <CheckItem
              key={t}
              label={t}
              checked={filters.types.has(t)}
              onChange={() => toggle('types', t)}
            />
          ))}
        </div>
      </div>
      <div className="gold-divider mb-7" />

      {/* Price Range */}
      <div className="mb-7">
        <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary-hover mb-3">Price Range</h4>
        <div className="space-y-2.5">
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="priceRange"
                checked={filters.priceRange?.label === range.label}
                onChange={() => setFilters((p) => ({ ...p, priceRange: range }))}
                className="accent-primary"
              />
              <span className="text-sm text-text group-hover:text-primary-hover transition-colors">
                {range.label}
              </span>
            </label>
          ))}
          {filters.priceRange && (
            <button
              onClick={() => setFilters((p) => ({ ...p, priceRange: null }))}
              className="text-xs text-primary hover:underline"
            >
              Clear price filter
            </button>
          )}
        </div>
      </div>
      <div className="gold-divider mb-7" />

      {/* Purity */}
      <div className="mb-7">
        <h4 className="text-[10px] font-bold tracking-[0.25em] uppercase text-primary-hover mb-3">Purity</h4>
        <div className="space-y-2.5">
          {purities.map((p) => (
            <CheckItem
              key={p}
              label={p}
              checked={filters.purities.has(p)}
              onChange={() => toggle('purities', p)}
            />
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => setFilters({ categories: new Set(), types: new Set(), purities: new Set(), priceRange: null })}
        className="w-full border border-text text-text text-xs font-semibold tracking-widest uppercase py-2.5 hover:bg-surface-dark hover:text-on-dark transition-all duration-300"
      >
        Clear All Filters
      </button>
    </div>
  );
}

function ProductsContent({ products, categories, types, purities }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialSearch   = searchParams.get('search')   || '';

  const [filters, setFilters] = useState({
    categories: initialCategory ? new Set([initialCategory]) : new Set(),
    types:      new Set(),
    purities:   new Set(),
    priceRange: null,
  });
  const [sort, setSort] = useState('default');
  const [search, setSearch] = useState(initialSearch);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync filters when URL params change
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const q   = searchParams.get('search')   || '';
    setFilters({
      categories: cat ? new Set([cat]) : new Set(),
      types:      new Set(),
      purities:   new Set(),
      priceRange: null,
    });
    setSearch(q);
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (filters.categories.size > 0)
      result = result.filter((p) => filters.categories.has(p.category));

    if (filters.types.size > 0)
      result = result.filter((p) => filters.types.has(p.type));

    if (filters.purities.size > 0)
      result = result.filter((p) => filters.purities.has(p.purity));

    if (filters.priceRange)
      result = result.filter(
        (p) => p.price >= filters.priceRange.min && p.price < filters.priceRange.max
      );

    if (search.trim())
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          (p.category && p.category.toLowerCase().includes(search.toLowerCase())) ||
          (p.type && p.type.toLowerCase().includes(search.toLowerCase()))
      );

    switch (sort) {
      case 'price-asc':  result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating':     result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }

    return result;
  }, [filters, sort, search, products]);

  const activeFilterCount =
    filters.categories.size + filters.types.size + filters.purities.size + (filters.priceRange ? 1 : 0);

  return (
    <div className="min-h-screen bg-bg pt-24">
      <div className="bg-surface-dark py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase text-accent mb-2">Our Catalogue</p>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-on-dark mb-2">
            {initialCategory || 'All Collections'}
          </h1>
          <p className="text-sm text-muted">
            {filtered.length} {filtered.length === 1 ? 'piece' : 'pieces'} curated for you
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-6 lg:hidden">
          <button
            id="mobile-filter-btn"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2 border border-text px-4 py-2.5 text-xs font-semibold tracking-widest uppercase"
          >
            <SlidersHorizontal size={14} />
            Filters {activeFilterCount > 0 && <span className="bg-primary text-on-dark text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
          </button>
          <div className="relative flex-1">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full border border-border px-3 py-2.5 text-xs appearance-none bg-card pr-8"
            >
              {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-base font-bold text-text">Filters</h3>
                {activeFilterCount > 0 && (
                  <span className="text-[10px] text-primary font-semibold">{activeFilterCount} active</span>
                )}
              </div>
              <FilterSidebar 
                filters={filters} 
                setFilters={setFilters} 
                categories={categories}
                types={types}
                purities={purities}
              />
            </div>
          </aside>

          <div className="flex-1">
            <div className="hidden lg:flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-border bg-card text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div className="ml-auto relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-border bg-card px-4 py-2.5 text-xs appearance-none pr-8 cursor-pointer focus:outline-none focus:border-primary"
                >
                  {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              </div>
            </div>

            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {[...filters.categories].map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilters((p) => { const s = new Set(p.categories); s.delete(c); return { ...p, categories: s }; })}
                    className="flex items-center gap-1.5 bg-primary/10 text-primary-hover text-[11px] font-medium px-3 py-1.5"
                  >
                    {c} <X size={10} />
                  </button>
                ))}
                {[...filters.types].map((t) => (
                  <button
                    key={t}
                    onClick={() => setFilters((p) => { const s = new Set(p.types); s.delete(t); return { ...p, types: s }; })}
                    className="flex items-center gap-1.5 bg-primary/10 text-primary-hover text-[11px] font-medium px-3 py-1.5"
                  >
                    {t} <X size={10} />
                  </button>
                ))}
                {[...filters.purities].map((p) => (
                  <button
                    key={p}
                    onClick={() => setFilters((prev) => { const s = new Set(prev.purities); s.delete(p); return { ...prev, purities: s }; })}
                    className="flex items-center gap-1.5 bg-primary/10 text-primary-hover text-[11px] font-medium px-3 py-1.5"
                  >
                    {p} <X size={10} />
                  </button>
                ))}
                {filters.priceRange && (
                  <button
                    onClick={() => setFilters((p) => ({ ...p, priceRange: null }))}
                    className="flex items-center gap-1.5 bg-primary/10 text-primary-hover text-[11px] font-medium px-3 py-1.5"
                  >
                    {filters.priceRange.label} <X size={10} />
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-5xl mb-4">◇</div>
                <h3 className="font-serif text-2xl font-bold text-text mb-2">No pieces found</h3>
                <p className="text-sm text-muted mb-6">Try adjusting your filters or search term.</p>
                <button
                  onClick={() => { setFilters({ categories: new Set(), types: new Set(), purities: new Set(), priceRange: null }); setSearch(''); }}
                  className="btn-gold-outline"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                layout
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04, duration: 0.4 }}
                      layout
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-72 bg-card z-50 overflow-y-auto"
            >
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                mobile
                onClose={() => setMobileFiltersOpen(false)}
                categories={categories}
                types={types}
                purities={purities}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductsClient({ products, categories, types, purities }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg pt-24 flex items-center justify-center"><div className="text-primary font-serif text-xl">Loading...</div></div>}>
      <ProductsContent products={products} categories={categories} types={types} purities={purities} />
    </Suspense>
  );
}
