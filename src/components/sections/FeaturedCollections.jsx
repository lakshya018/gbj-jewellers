'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function FeaturedCollections({ categories = [] }) {
  return (
    <section className="py-20 lg:py-28 bg-pearl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal>
          <p className="section-subtitle">Our Collections</p>
          <h2 className="section-title mb-4">Crafted for Every Occasion</h2>
          <div className="gold-divider max-w-xs mx-auto mb-14" />
        </ScrollReveal>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((col, i) => (
            <ScrollReveal key={col.id} delay={i * 0.1}>
              <Link
                href={`/products?category=${encodeURIComponent(col.category)}`}
                id={`collection-${col.id}`}
                className="group block relative overflow-hidden aspect-[3/4] bg-gray-100"
              >
                {/* Image */}
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.07 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <Image
                    src={col.image}
                    alt={col.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </motion.div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-gold-400 transition-all duration-500" />

                {/* Gold corner accents */}
                <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-gold-400 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-1 -translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-gold-400 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] tracking-[0.3em] text-gold-400 uppercase mb-1 font-medium">
                    {col.tagline}
                  </p>
                  <h3 className="font-serif text-white text-xl font-bold mb-1.5">
                    {col.name}
                  </h3>
                  <p className="text-xs text-gray-300 leading-relaxed mb-4 opacity-0 group-hover:opacity-100 transition-all duration-400 -translate-y-2 group-hover:translate-y-0">
                    {col.description}
                  </p>
                  <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold tracking-wider uppercase">
                    <span>Explore</span>
                    <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
