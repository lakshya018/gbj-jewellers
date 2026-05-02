'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function TrendingCarousel({ trending = [] }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section className="py-20 lg:py-28 bg-card overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-subtitle text-left">Handpicked</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-text">
                Trending Now
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={() => scroll('left')}
                disabled={!canScrollLeft}
                className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 ${
                  canScrollLeft
                    ? 'border-primary text-primary hover:bg-accent hover:text-on-dark'
                    : 'border-border text-muted cursor-not-allowed'
                }`}
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => scroll('right')}
                disabled={!canScrollRight}
                className={`w-10 h-10 border flex items-center justify-center transition-all duration-300 ${
                  canScrollRight
                    ? 'border-primary text-primary hover:bg-accent hover:text-on-dark'
                    : 'border-border text-muted cursor-not-allowed'
                }`}
                aria-label="Scroll right"
              >
                <ChevronRight size={18} />
              </button>
              <Link
                href="/products"
                id="trending-view-all"
                className="ml-2 flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-text hover:text-primary transition-colors"
              >
                View All <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Scrollable Row */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-2"
        >
          {trending.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              className="flex-shrink-0 w-[260px] sm:w-[280px]"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest uppercase text-primary border border-primary px-6 py-3"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
