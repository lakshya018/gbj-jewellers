'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function PromoBanners({ banners = [] }) {
  return (
    <section className="py-20 lg:py-28 bg-pearl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <p className="section-subtitle">Limited Time Offers</p>
          <h2 className="section-title mb-4">Special Occasions</h2>
          <div className="gold-divider max-w-xs mx-auto mb-14" />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {banners.map((banner, i) => (
            <ScrollReveal key={banner.id} delay={i * 0.15} direction={i === 0 ? 'left' : 'right'}>
              <Link
                href={banner.link}
                id={`promo-banner-${banner.id}`}
                className="group relative flex overflow-hidden min-h-[280px] lg:min-h-[320px]"
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColor} opacity-85`} />
                </div>

                {/* Content */}
                <div className="relative z-10 p-8 lg:p-10 flex flex-col justify-between w-full">
                  <div>
                    {/* Badge */}
                    <div
                      className="inline-block text-[9px] font-bold tracking-[0.3em] uppercase px-3 py-1.5 mb-4"
                      style={{ background: banner.accentColor, color: '#0d0d0d' }}
                    >
                      {banner.badge}
                    </div>

                    <p className="text-xs tracking-[0.25em] uppercase mb-2 font-medium"
                      style={{ color: banner.accentColor }}>
                      {banner.subtitle}
                    </p>

                    <h3 className="font-serif text-white text-3xl lg:text-4xl font-bold mb-3">
                      {banner.title}
                    </h3>

                    <p className="text-sm text-white/75 leading-relaxed max-w-xs">
                      {banner.description}
                    </p>
                  </div>

                  <div className="mt-8">
                    <div
                      className="group/btn inline-flex items-center gap-3 px-6 py-3 text-xs font-bold tracking-widest uppercase text-charcoal transition-all duration-300"
                      style={{ background: banner.accentColor }}
                    >
                      {banner.cta}
                      <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                    </div>
                  </div>
                </div>

                {/* Hover border effect */}
                <div className="absolute inset-0 border border-transparent group-hover:border-white/20 transition-all duration-500 pointer-events-none" />
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
