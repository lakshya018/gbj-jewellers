'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-surface-dark">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero_necklace.jpg"
          alt="GBJ Jewellers — Luxury Indian Gold & Diamond Jewellery"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex items-center gap-4 mb-6"
          >
            <div className="h-px w-12 bg-accent" />
            <span className="text-accent text-xs tracking-[0.35em] uppercase font-medium">
              BIS Hallmarked Since 1925
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-on-dark leading-[1.1] mb-4"
          >
            Where Every
            <span className="block italic font-normal" style={{
              background: 'linear-gradient(135deg, #fde047, #e6b84a, #a37820)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Jewel Speaks
            </span>
            a Story
          </motion.h1>

          {/* Subline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-muted text-base sm:text-lg leading-relaxed mb-10 max-w-lg"
          >
            Discover our collection of handcrafted gold and diamond jewellery — from temple classics to contemporary designs, curated for the discerning Indian woman.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/products"
              id="hero-shop-now"
              className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-semibold tracking-widest uppercase text-surface-dark transition-all duration-300"
              style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}
            >
              Explore Collections
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/products?category=Bridal"
              id="hero-bridal"
              className="inline-flex items-center gap-3 px-8 py-4 text-sm font-semibold tracking-widest uppercase text-on-dark border border-white/40 hover:border-primary hover:text-accent transition-all duration-300"
            >
              Bridal Collection
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="mt-14 flex items-center gap-8"
          >
            {[
              { num: '10,000+', label: 'Designs' },
              { num: '40+', label: 'Years Legacy' },
              { num: '50,000+', label: 'Happy Clients' },
            ].map(({ num, label }) => (
              <div key={label} className="text-center">
                <div className="font-serif text-xl font-bold text-accent">{num}</div>
                <div className="text-[10px] tracking-widest uppercase text-muted mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] text-on-dark/50 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} className="text-on-dark/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
