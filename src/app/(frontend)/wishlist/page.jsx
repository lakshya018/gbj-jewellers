'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import ScrollReveal from '@/components/ui/ScrollReveal';

function formatPrice(p) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
}

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-pearl pt-20 flex flex-col items-center justify-center px-4 text-center">
        <Heart size={48} className="text-gray-200 mb-5" />
        <h1 className="font-serif text-3xl font-bold text-charcoal mb-3">Your Wishlist is Empty</h1>
        <p className="text-sm text-gray-500 mb-8">Save pieces you love by clicking the heart icon.</p>
        <Link href="/products" className="inline-flex items-center gap-3 px-8 py-4 text-sm font-bold tracking-widest uppercase text-charcoal" style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}>
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pearl pt-20">
      <div className="bg-charcoal py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gold-400 mb-1">Saved Pieces</p>
          <h1 className="font-serif text-3xl font-bold text-white">My Wishlist <span className="text-lg text-gold-400 font-normal ml-2">({wishlist.length})</span></h1>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {wishlist.map((product, i) => (
            <ScrollReveal key={product.id} delay={i * 0.08}>
              <div className="bg-white group relative overflow-hidden">
                <Link href={`/products/${product.id}`} className="block aspect-square relative overflow-hidden bg-gray-50">
                  <motion.div whileHover={{ scale: 1.07 }} transition={{ duration: 0.5 }} className="absolute inset-0">
                    <Image src={product.images?.[0] || '/images/gold_collection.jpg'} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 25vw" />
                  </motion.div>
                </Link>
                <button onClick={() => toggleWishlist(product)} className="absolute top-3 right-3 w-8 h-8 bg-white flex items-center justify-center text-rose-500 shadow-sm hover:scale-110 transition-transform">
                  <Heart size={14} fill="currentColor" />
                </button>
                <div className="p-4">
                  <p className="text-[10px] tracking-widest uppercase text-gold-600 mb-1">{product.category} · {product.purity}</p>
                  <h3 className="font-serif text-base font-semibold text-charcoal mb-2 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-charcoal">{formatPrice(product.price)}</span>
                    <button onClick={() => addToCart(product, 1)} className="flex items-center gap-1.5 bg-charcoal text-white text-[10px] font-bold tracking-widest uppercase px-3 py-2 hover:bg-gold-500 hover:text-charcoal transition-all duration-300">
                      <ShoppingBag size={10} /> Add
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
