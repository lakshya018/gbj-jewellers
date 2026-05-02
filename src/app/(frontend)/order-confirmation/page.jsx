'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, Home, Phone } from 'lucide-react';

function generateOrderId() {
  return 'GBJ' + Date.now().toString().slice(-7);
}

export default function OrderConfirmationPage() {
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    setOrderId(generateOrderId());
  }, []);

  return (
    <div className="min-h-screen bg-bg pt-20 flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full bg-card p-8 sm:p-12 text-center">

        {/* Animated checkmark */}
        <motion.div
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="flex items-center justify-center mb-6"
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}
          >
            <CheckCircle size={36} className="text-on-dark" />
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-[10px] tracking-[0.35em] uppercase text-primary-hover mb-2">
            Order Confirmed
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-text mb-3">
            Thank You!
          </h1>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Your order has been placed successfully. Our team will reach out to confirm
            delivery details and keep you updated.
          </p>
        </motion.div>

        {/* Order ID */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="bg-bg border border-border px-6 py-4 mb-8"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-muted mb-1">
            Order ID
          </p>
          <p className="font-serif text-xl font-bold text-text tracking-widest">
            #{orderId}
          </p>
          <p className="text-[11px] text-muted mt-1">
            Save this for your records
          </p>
        </motion.div>

        {/* What's next */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-left mb-8 space-y-3"
        >
          <p className="text-[10px] tracking-[0.3em] uppercase text-primary-hover font-bold">
            What Happens Next
          </p>
          {[
            { step: '01', text: 'Our team will call you within 24 hours to confirm your order.' },
            { step: '02', text: 'Your jewellery will be carefully packed and insured for shipping.' },
            { step: '03', text: 'You will receive a tracking update once dispatched.' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-on-dark mt-0.5"
                style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}
              >
                {step}
              </div>
              <p className="text-sm text-muted leading-relaxed">{text}</p>
            </div>
          ))}
        </motion.div>

        {/* Contact note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="border border-border px-5 py-4 flex items-center gap-3 mb-8"
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}>
            <Phone size={14} className="text-on-dark" />
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-text">Have a question?</p>
            <p className="text-[11px] text-muted">Call us at <span className="text-text font-medium">+91 98765 43210</span></p>
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Link
            href="/products"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold
                       tracking-widest uppercase text-surface-dark transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}
          >
            <ShoppingBag size={14} /> Continue Shopping
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3.5 text-xs font-bold
                       tracking-widest uppercase text-text border border-text
                       hover:bg-surface-dark hover:text-on-dark transition-all duration-300"
          >
            <Home size={14} /> Back to Home
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
