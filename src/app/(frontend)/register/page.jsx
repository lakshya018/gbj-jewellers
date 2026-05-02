'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import FirebaseAuthUI from '@/components/auth/FirebaseAuthUI';
import Link from 'next/link';
import Image from 'next/image';

export default function RegisterPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.push('/account');
  }, [user, router]);

  return (
    <div className="min-h-screen flex">
      {/* Left: Branding Panel */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #e6b84a, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #e6b84a, transparent)' }} />

        <div className="relative z-10 text-center px-12">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 ring-2 ring-primary/30 ring-offset-4 ring-offset-transparent overflow-hidden bg-card">
              <Image
                src="/images/gbj_logo.png"
                alt="GBJ Jewellers Logo"
                width={120}
                height={120}
                className="w-24 object-contain"
                priority
              />
            </div>
            <h2 className="font-serif text-4xl text-on-dark mb-4 leading-tight">
              Begin Your<br />
              <span className="italic" style={{ color: '#e6b84a' }}>Jewellery Journey</span>
            </h2>
            <p className="text-on-dark/50 text-sm font-light leading-relaxed max-w-xs mx-auto">
              Join thousands of customers who trust GBJ for their most precious moments.
            </p>

            <div className="flex items-center justify-center gap-6 mt-10">
              {['Free Shipping', 'Easy Returns', 'Lifetime Exchange'].map((badge) => (
                <div key={badge} className="text-[10px] tracking-[0.15em] uppercase text-primary/70 font-medium">
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right: Auth Form */}
      <div className="flex-1 bg-bg flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="lg:hidden text-center mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden bg-card shadow-md">
                <Image
                  src="/images/gbj_logo.png"
                  alt="GBJ Jewellers Logo"
                  width={120}
                  height={120}
                  className="w-24 object-contain"
                  priority
                />
              </div>
            </div>

            <div className="mb-8">
              <h1 className="font-serif text-3xl text-text tracking-tight">
                Create your account
              </h1>
              <p className="text-muted text-sm mt-2 font-light">
                Join GBJ to save wishlists, track orders & get exclusive offers
              </p>
            </div>

            <div className="bg-card p-7 rounded-2xl shadow-xl shadow-black/[0.03] border border-gray-100/80">
              <FirebaseAuthUI onSuccess={() => router.push('/account')} />
            </div>

            <div className="mt-6 text-center">
              <p className="text-muted text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-hover font-semibold hover:underline underline-offset-4 transition-all">
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
