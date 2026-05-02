'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, ShoppingBag, Star, Shield, Truck, RotateCcw,
  ChevronRight, ZoomIn, Package, Sparkles
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductCard from '@/components/ui/ProductCard';
import ScrollReveal from '@/components/ui/ScrollReveal';

function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(price);
}

export default function ProductDetailClient({ initialProduct, similarProducts = [] }) {
  const product = initialProduct;
  if (!product) return notFound();

  const similar = similarProducts;

  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const images = product.images?.length > 0 ? product.images : ['/images/gold_collection.jpg'];

  return (
    <div className="min-h-screen bg-pearl pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-xs text-gray-400">
          <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link href="/products" className="hover:text-gold-500 transition-colors">Collections</Link>
          <ChevronRight size={10} />
          <Link href={`/products?category=${product.category}`} className="hover:text-gold-500 transition-colors">{product.category}</Link>
          <ChevronRight size={10} />
          <span className="text-charcoal font-medium line-clamp-1">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div
              className="relative aspect-square bg-gray-50 overflow-hidden cursor-zoom-in"
              onClick={() => setZoomed(!zoomed)}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, scale: zoomed ? 1.4 : 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[activeImage]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute top-4 right-4 bg-white/80 p-1.5 rounded-sm">
                <ZoomIn size={14} className="text-gray-500" />
              </div>
              {product.badge && (
                <div className="absolute top-4 left-4 bg-gold-500 text-white text-[10px] font-bold px-2.5 py-1 tracking-wider uppercase">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveImage(i); setZoomed(false); }}
                    className={`relative w-20 h-20 flex-shrink-0 border-2 overflow-hidden transition-all duration-200 ${
                      activeImage === i ? 'border-gold-500' : 'border-transparent hover:border-gold-300'
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div>
            {/* Category */}
            <p className="text-[11px] tracking-[0.3em] uppercase text-gold-600 font-medium mb-2">
              {product.category} · {product.type}
            </p>

            {/* Name */}
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-charcoal leading-tight mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map((i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i <= Math.round(product.rating) ? 'star-filled' : 'star-empty'}
                    fill="currentColor"
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">{product.rating} ({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-serif text-3xl font-bold text-charcoal">
                {formatPrice(product.price)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                  <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5">{product.discount}% off</span>
                </>
              )}
            </div>

            <div className="gold-divider mb-6" />

            {/* Purity & Weight */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 bg-white border border-gray-100 p-4 text-center">
                <Sparkles size={16} className="text-gold-500 mx-auto mb-1.5" />
                <div className="font-semibold text-charcoal text-sm">{product.purity}</div>
                <div className="text-[10px] text-gray-400 tracking-wider uppercase">Purity</div>
              </div>
              <div className="flex-1 bg-white border border-gray-100 p-4 text-center">
                <Package size={16} className="text-gold-500 mx-auto mb-1.5" />
                <div className="font-semibold text-charcoal text-sm">{product.weight}</div>
                <div className="text-[10px] text-gray-400 tracking-wider uppercase">Net Weight</div>
              </div>
              <div className="flex-1 bg-white border border-gray-100 p-4 text-center">
                <Shield size={16} className="text-gold-500 mx-auto mb-1.5" />
                <div className="font-semibold text-charcoal text-sm">BIS</div>
                <div className="text-[10px] text-gray-400 tracking-wider uppercase">Certified</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Size Selector */}
            {product.sizes && (
              <div className="mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-charcoal mb-3">
                  Select Size
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      id={`size-${size}`}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-10 border text-sm font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-gold-500 bg-gold-500 text-white'
                          : 'border-gray-200 text-charcoal hover:border-gold-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-widest uppercase text-charcoal mb-3">Quantity</p>
              <div className="inline-flex items-center border border-gray-200">
                <button
                  id="qty-decrease"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-gray-50 transition-colors border-r border-gray-200"
                >
                  −
                </button>
                <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                <button
                  id="qty-increase"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center text-charcoal hover:bg-gray-50 transition-colors border-l border-gray-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 mb-6">
              <button
                id={`detail-add-to-cart-${product.id}`}
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`flex-1 py-4 text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                  !product.inStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : added
                    ? 'bg-charcoal text-white'
                    : ''
                }`}
                style={product.inStock && !added ? { background: 'linear-gradient(135deg, #e6b84a, #a37820)', color: '#0d0d0d' } : {}}
              >
                <ShoppingBag size={16} />
                {!product.inStock ? 'Out of Stock' : added ? 'Added to Cart!' : 'Add to Cart'}
              </button>

              <button
                id={`detail-wishlist-${product.id}`}
                onClick={() => toggleWishlist(product)}
                className={`w-14 border flex items-center justify-center transition-all duration-300 ${
                  wishlisted
                    ? 'border-rose-400 bg-rose-50 text-rose-500'
                    : 'border-gray-300 text-gray-400 hover:border-rose-400 hover:text-rose-400'
                }`}
                aria-label="Toggle wishlist"
              >
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Delivery info */}
            <div className="bg-white border border-gray-100 p-4 space-y-3">
              {[
                { icon: Truck, text: 'Free shipping on this order' },
                { icon: Shield, text: 'BIS Hallmarked certificate included' },
                { icon: RotateCcw, text: '30-day hassle-free returns' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={14} className="text-gold-500 flex-shrink-0" />
                  <span className="text-xs text-gray-600">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 && (
          <section className="mt-20">
            <ScrollReveal>
              <p className="section-subtitle">Explore More</p>
              <h2 className="section-title mb-4">You May Also Like</h2>
              <div className="gold-divider max-w-xs mx-auto mb-10" />
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similar.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 0.1}>
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
