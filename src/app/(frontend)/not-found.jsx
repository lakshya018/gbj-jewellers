'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Phone } from 'lucide-react';
import Image from 'next/image';

const floatingGems = [
  { size: 10, x: '12%',  y: '20%', delay: 0 },
  { size: 6,  x: '82%',  y: '15%', delay: 0.4 },
  { size: 8,  x: '25%',  y: '75%', delay: 0.8 },
  { size: 5,  x: '70%',  y: '70%', delay: 0.2 },
  { size: 7,  x: '55%',  y: '88%', delay: 1.0 },
  { size: 4,  x: '90%',  y: '45%', delay: 0.6 },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1a1a2e 0%, #0d0d0d 60%, #2d2410 100%)' }}>

      {/* Floating gem decorations */}
      {floatingGems.map((gem, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: gem.x, top: gem.y }}
          animate={{ y: [0, -14, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 3 + i * 0.5, delay: gem.delay, ease: 'easeInOut' }}
        >
          <div
            className="rounded-full"
            style={{
              width: gem.size * 4,
              height: gem.size * 4,
              background: 'linear-gradient(135deg, #e6b84a, #a37820)',
              opacity: 0.6,
              filter: 'blur(1px)',
            }}
          />
        </motion.div>
      ))}

      {/* Large faded ring */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full border border-primary-hover/20 pointer-events-none"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      />
      <div
        className="absolute w-[700px] h-[700px] rounded-full border border-primary-hover/10 pointer-events-none"
        style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-lg"
      >
        {/* GBJ monogram */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 180, delay: 0.1 }}
          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 overflow-hidden bg-white/10"
        >
          <Image
            src="/images/gbj_logo.png"
            alt="GBJ Jewellers Logo"
            width={120}
            height={120}
            className="w-24 object-contain"
          />
        </motion.div>

        {/* 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-serif font-bold leading-none mb-4 select-none"
          style={{
            fontSize: 'clamp(80px, 20vw, 160px)',
            background: 'linear-gradient(135deg, #fde047 0%, #e6b84a 40%, #a37820 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 40px rgba(230,184,74,0.15))',
          }}
        >
          404
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="h-px w-24 mx-auto mb-6"
          style={{ background: 'linear-gradient(90deg, transparent, #e6b84a, transparent)' }}
        />

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="font-serif text-2xl sm:text-3xl font-bold text-on-dark mb-3"
        >
          Lost Among Our Treasures?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-muted text-sm leading-relaxed mb-10 max-w-sm mx-auto"
        >
          The page you&apos;re looking for may have been moved or doesn&apos;t exist.
          Let us guide you back to our collection of timeless jewellery.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-7 py-3.5 text-xs font-bold tracking-widest uppercase text-surface-dark transition-all hover:opacity-90 w-full sm:w-auto justify-center"
            style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}
          >
            <Home size={13} /> Back to Home
          </Link>

          <Link
            href="/products"
            className="flex items-center gap-2 px-7 py-3.5 text-xs font-bold tracking-widest uppercase text-on-dark border border-white/20 hover:border-primary hover:text-accent transition-all w-full sm:w-auto justify-center"
          >
            <ShoppingBag size={13} /> Browse Collections
          </Link>
        </motion.div>

        {/* Contact nudge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-10 flex items-center justify-center gap-2 text-muted text-xs"
        >
          <Phone size={11} className="text-primary" />
          <span>Need help?&nbsp;</span>
          <Link href="/#contact" className="text-accent hover:text-accent transition-colors underline underline-offset-2">
            Contact us
          </Link>
        </motion.div>
      </motion.div>

    </div>
  );
}
