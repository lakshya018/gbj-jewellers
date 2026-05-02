'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, ShoppingBag, ArrowRight, Tag, Shield, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
}

export default function CartPage() {
  const { cartItems, cartSubtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const gst = Math.round(cartSubtotal * 0.03);
  const makingCharges = cartItems.reduce((sum, item) => sum + 500 * item.quantity, 0);
  const discount = promoApplied ? Math.round(cartSubtotal * 0.05) : 0;
  const total = cartSubtotal + gst + makingCharges - discount;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-bg pt-20 flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-6">◇</div>
        <h1 className="font-serif text-3xl font-bold text-text mb-3">Your Cart is Empty</h1>
        <p className="text-sm text-muted mb-8 max-w-xs">Explore our collections to find something beautiful.</p>
        <Link href="/products" id="cart-shop-now" className="inline-flex items-center gap-3 px-8 py-4 text-sm font-bold tracking-widest uppercase text-surface-dark" style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}>
          <ShoppingBag size={16} /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pt-20">
      <div className="bg-surface-dark py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] tracking-[0.35em] uppercase text-accent mb-1">Your Selection</p>
          <h1 className="font-serif text-3xl font-bold text-on-dark">Shopping Cart <span className="ml-2 text-lg text-accent font-normal">({cartItems.length} items)</span></h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div key={`${item.id}-${item.size}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -30 }} className="bg-card p-5 flex gap-5">
                  <Link href={`/products/${item.id}`} className="relative w-24 h-24 flex-shrink-0 bg-secondary overflow-hidden">
                    <Image src={item.images?.[0] || '/images/gold_collection.jpg'} alt={item.name} fill className="object-cover" sizes="96px" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <p className="text-[10px] tracking-widest uppercase text-primary-hover mb-0.5">{item.category}</p>
                        <h3 className="font-serif text-base font-semibold text-text line-clamp-1">{item.name}</h3>
                        <div className="flex gap-3 mt-1 text-xs text-muted">
                          <span>{item.purity}</span><span>{item.weight}</span>
                          {item.size && <span>Size: {item.size}</span>}
                        </div>
                      </div>
                      <button id={`remove-${item.id}`} onClick={() => removeFromCart(item.id, item.size)} className="text-muted hover:text-rose-500 transition-colors"><X size={16} /></button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="inline-flex items-center border border-border">
                        <button id={`dec-${item.id}`} onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary border-r border-border"><Minus size={12} /></button>
                        <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                        <button id={`inc-${item.id}`} onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center hover:bg-secondary border-l border-border"><Plus size={12} /></button>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-text">{formatPrice(item.price * item.quantity)}</div>
                        {item.quantity > 1 && <div className="text-[11px] text-muted">{formatPrice(item.price)} each</div>}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="flex gap-5 pt-2">
              <button onClick={clearCart} className="text-xs text-muted hover:text-rose-500 transition-colors underline">Clear cart</button>
              <Link href="/products" className="text-xs font-semibold tracking-widest uppercase text-text hover:text-primary transition-colors">← Continue Shopping</Link>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-card p-6 h-fit sticky top-28">
            <h2 className="font-serif text-xl font-bold text-text mb-6">Order Summary</h2>
            <div className="flex gap-0 mb-1">
              <div className="relative flex-1">
                <Tag size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input type="text" placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} disabled={promoApplied} className="w-full pl-8 pr-3 py-2.5 border border-border text-sm focus:outline-none focus:border-primary" />
              </div>
              <button onClick={() => promoCode.toLowerCase() === 'gbj10' && setPromoApplied(true)} disabled={promoApplied} className="px-4 py-2.5 text-xs font-bold tracking-wider uppercase text-on-dark bg-surface-dark hover:opacity-80 disabled:bg-gray-300">Apply</button>
            </div>
            {promoApplied ? <p className="text-xs text-emerald-600 mb-4">✓ 5% discount applied!</p> : <p className="text-[11px] text-muted mb-4">Try: GBJ10</p>}
            <div className="gold-divider mb-4" />
            <div className="space-y-3 mb-4">
              {[['Subtotal', cartSubtotal], ['Making Charges', makingCharges], ['GST (3%)', gst], ...(promoApplied ? [['Discount (GBJ10)', -discount]] : [])].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className={val < 0 ? 'text-emerald-600' : 'text-muted'}>{label}</span>
                  <span className={`font-medium ${val < 0 ? 'text-emerald-600' : 'text-text'}`}>{val < 0 ? '-' : ''}{formatPrice(Math.abs(val))}</span>
                </div>
              ))}
            </div>
            <div className="gold-divider mb-4" />
            <div className="flex justify-between items-baseline mb-6">
              <span className="font-semibold text-text">Total</span>
              <span className="font-serif text-2xl font-bold">{formatPrice(total)}</span>
            </div>
            <button id="checkout-btn" onClick={() => router.push('/checkout')} className="w-full py-4 text-sm font-bold tracking-widest uppercase text-surface-dark flex items-center justify-center gap-3" style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}>
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            <div className="mt-4 pt-4 border-t border-border space-y-2">
              {[[Shield, 'Secure SSL encrypted checkout'], [Truck, 'Free insured shipping included']].map(([Icon, text]) => (
                <div key={text} className="flex items-center gap-2 text-[11px] text-muted">
                  <Icon size={12} className="text-primary" /><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
