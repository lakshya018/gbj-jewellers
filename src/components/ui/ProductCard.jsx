'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

const badgeColors = {
  Bestseller: 'bg-amber-100 text-amber-800',
  New:        'bg-emerald-100 text-emerald-800',
  Trending:   'bg-sky-100 text-sky-800',
  Sale:       'bg-rose-100 text-rose-800',
  Bridal:     'bg-purple-100 text-purple-800',
  Signature:  'bg-gray-900 text-gold-400',
};

export default function ProductCard({ product, className = '' }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();

  const wishlisted = isWishlisted(product.id);
  const imageSrc = product.images?.[0] || '/images/gold_collection.jpg';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.sizes?.[0] || null);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      className={`product-card group cursor-pointer ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      layout
    >
      <Link href={`/products/${product.id}`} id={`product-card-${product.id}`}>
        {/* Image Container */}
        <div className="relative overflow-hidden aspect-square bg-gray-50">
          <motion.div
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="w-full h-full relative"
          >
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </motion.div>

          {/* Badge */}
          {product.badge && (
            <div className={`absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 tracking-wider uppercase ${badgeColors[product.badge] || 'bg-gray-100 text-gray-700'}`}>
              {product.badge}
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-xs font-semibold tracking-widest uppercase text-gray-500 bg-white px-4 py-2">Out of Stock</span>
            </div>
          )}

          {/* Hover Overlay */}
          <AnimatePresence>
            {hovered && product.inStock && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-black/20 flex flex-col items-center justify-end pb-4 gap-2"
              >
                {/* Quick View */}
                <motion.div
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 16, opacity: 0 }}
                  transition={{ delay: 0.05 }}
                  className="flex items-center gap-2 bg-white text-charcoal text-[11px] font-semibold tracking-widest uppercase px-5 py-2 hover:bg-gold-400 transition-colors"
                >
                  <Eye size={12} /> Quick View
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wishlist Button */}
          <button
            id={`wishlist-btn-${product.id}`}
            onClick={handleWishlist}
            className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-white shadow-sm transition-all duration-300 ${
              wishlisted ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'
            }`}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          {/* Category + Purity */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] tracking-widest uppercase text-gold-600 font-medium">
              {product.category}
            </span>
            <span className="text-[10px] bg-pearl text-charcoal px-2 py-0.5 font-semibold tracking-wider">
              {product.purity}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-serif text-charcoal text-base font-semibold leading-snug mb-2 line-clamp-1 group-hover:text-gold-600 transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {[1,2,3,4,5].map((i) => (
                <Star
                  key={i}
                  size={10}
                  className={i <= Math.round(product.rating) ? 'star-filled' : 'star-empty'}
                  fill="currentColor"
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-semibold text-charcoal text-base">{formatPrice(product.price)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                <span className="text-[10px] text-emerald-600 font-semibold">{product.discount}% off</span>
              </>
            )}
          </div>

          {/* Add to Cart */}
          <button
            id={`add-to-cart-${product.id}`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className={`w-full py-2.5 text-[11px] font-semibold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
              product.inStock
                ? added
                  ? 'bg-charcoal text-white'
                  : 'border border-charcoal text-charcoal hover:bg-charcoal hover:text-white'
                : 'border border-gray-200 text-gray-300 cursor-not-allowed'
            }`}
          >
            <ShoppingBag size={12} />
            {added ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
