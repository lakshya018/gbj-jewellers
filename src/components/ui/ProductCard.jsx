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
  Signature:  'bg-gray-900 text-accent',
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
        <div className="relative overflow-hidden aspect-square bg-secondary">
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
            <div className={`absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 tracking-wider uppercase ${badgeColors[product.badge] || 'bg-secondary text-muted'}`}>
              {product.badge}
            </div>
          )}

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="text-xs font-semibold tracking-widest uppercase text-muted bg-card px-4 py-2">Out of Stock</span>
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
                  className="flex items-center gap-2 bg-card text-text text-[11px] font-semibold tracking-widest uppercase px-5 py-2 hover:bg-accent transition-colors"
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
            className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-card shadow-sm transition-all duration-300 ${
              wishlisted ? 'text-rose-500' : 'text-muted hover:text-rose-400'
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
            <span className="text-[10px] tracking-widest uppercase text-primary-hover font-medium">
              {product.category}
            </span>
            <span className="text-[10px] bg-bg text-text px-2 py-0.5 font-semibold tracking-wider">
              {product.purity}
            </span>
          </div>

          {/* Name */}
          <h3 className="font-serif text-text text-base font-semibold leading-snug mb-2 line-clamp-1 group-hover:text-primary-hover transition-colors">
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
            <span className="text-[10px] text-muted">({product.reviews})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="font-semibold text-text text-base">{formatPrice(product.price)}</span>
            {product.discount > 0 && (
              <>
                <span className="text-xs text-muted line-through">{formatPrice(product.originalPrice)}</span>
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
                  ? 'bg-surface-dark text-on-dark'
                  : 'border border-text text-text hover:bg-surface-dark hover:text-on-dark'
                : 'border border-border text-muted cursor-not-allowed'
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
