'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShieldCheck, Award, Gem, Users } from 'lucide-react';

const pillars = [
  { icon: ShieldCheck, label: 'BIS Hallmarked', sub: '22KT & 18KT Gold' },
  { icon: Award,       label: 'IGI Certified',  sub: 'Diamonds' },
  { icon: Gem,         label: '10,000+',         sub: 'Unique Designs' },
  { icon: Users,       label: '50,000+',         sub: 'Happy Families' },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-card py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* Left — decorative block */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Large gold accent square */}
            <div
              className="absolute -top-6 -left-6 w-40 h-40 opacity-10 rounded-sm"
              style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}
            />
            {/* Main image-like panel */}
            <div
              className="relative rounded-sm overflow-hidden"
              style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #2d2410 100%)' }}
            >
              <div className="p-10 md:p-14">
                {/* Monogram */}
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-6 overflow-hidden bg-white/10">
                  <Image
                    src="/images/gbj_logo.png"
                    alt="GBJ Jewellers Logo"
                    width={120}
                    height={120}
                    className="w-24 object-contain"
                  />
                </div>

                <p className="text-[10px] tracking-[0.35em] uppercase text-accent mb-3">
                  Our Legacy
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-on-dark leading-snug mb-5">
                  A Century of<br />
                  <span style={{
                    background: 'linear-gradient(135deg, #fde047, #e6b84a, #a37820)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}>
                    Crafted Gold
                  </span>
                </h2>

                <div className="h-px w-12 mb-5"
                  style={{ background: 'linear-gradient(90deg, #e6b84a, transparent)' }} />

                <p className="text-muted text-sm leading-relaxed max-w-sm">
                  Since 1925, GBJ Jewellers has been crafting heirloom-quality jewellery
                  from the heart of Delhi. Three generations of master artisans — one
                  unwavering commitment to purity, precision, and beauty.
                </p>

                {/* Signature line */}
                <div className="mt-8 flex items-center gap-3">
                  <div className="w-8 h-px bg-primary" />
                  <span className="text-accent text-xs tracking-widest uppercase font-medium">
                    Est. 1925 · Nawa City, Nagaur
                  </span>
                </div>
              </div>
            </div>
            {/* Bottom-right accent */}
            <div
              className="absolute -bottom-4 -right-4 w-24 h-24 opacity-15 rounded-sm"
              style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}
            />
          </motion.div>

          {/* Right — pillars + copy */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <p className="text-[10px] tracking-[0.35em] uppercase text-primary-hover mb-3">
              Who We Are
            </p>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-text mb-4 leading-snug">
              Jewellery That Carries<br />Your Story Forward
            </h3>
            <p className="text-muted text-sm leading-relaxed mb-8 max-w-md">
              Every piece at GBJ is born from a dialogue between tradition and
              contemporary artistry. We source conflict-free diamonds, use BIS-certified
              gold, and hand-finish every item so that when it reaches you, it&apos;s
              already an heirloom.
            </p>

            {/* Pillar grid */}
            <div className="grid grid-cols-2 gap-4">
              {pillars.map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="border border-border p-4 hover:border-primary hover:shadow-sm transition-all duration-300 group"
                >
                  <Icon
                    size={18}
                    className="text-primary mb-3 group-hover:scale-110 transition-transform duration-300"
                  />
                  <p className="font-serif font-bold text-text text-base leading-tight">{label}</p>
                  <p className="text-[11px] text-muted mt-0.5">{sub}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
