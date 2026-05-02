'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import FirebaseAuthUI from '@/components/auth/FirebaseAuthUI';
import Link from 'next/link';

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
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8 ring-2 ring-gold-500/30 ring-offset-4 ring-offset-transparent"
              style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}>
              <span className="text-white font-serif font-bold text-3xl">G</span>
            </div>
            <h2 className="font-serif text-4xl text-white mb-4 leading-tight">
              Begin Your<br />
              <span className="italic" style={{ color: '#e6b84a' }}>Jewellery Journey</span>
            </h2>
            <p className="text-white/50 text-sm font-light leading-relaxed max-w-xs mx-auto">
              Join thousands of customers who trust GBJ for their most precious moments.
            </p>

            <div className="flex items-center justify-center gap-6 mt-10">
              {['Free Shipping', 'Easy Returns', 'Lifetime Exchange'].map((badge) => (
                <div key={badge} className="text-[10px] tracking-[0.15em] uppercase text-gold-500/70 font-medium">
                  {badge}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right: Auth Form */}
      <div className="flex-1 bg-pearl flex items-center justify-center px-6 py-20">
        <div className="max-w-md w-full">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="lg:hidden text-center mb-8">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}>
                <span className="text-white font-serif font-bold text-xl">G</span>
              </div>
            </div>

            <div className="mb-8">
              <h1 className="font-serif text-3xl text-charcoal tracking-tight">
                Create your account
              </h1>
              <p className="text-gray-400 text-sm mt-2 font-light">
                Join GBJ to save wishlists, track orders & get exclusive offers
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl shadow-xl shadow-black/[0.03] border border-gray-100/80">
              <FirebaseAuthUI onSuccess={() => router.push('/account')} />
            </div>

            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-gold-600 font-semibold hover:underline underline-offset-4 transition-all">
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
