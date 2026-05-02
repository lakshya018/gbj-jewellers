'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ShoppingBag, Heart, Search, Menu, X, ChevronDown, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import ThemeToggle from '@/components/ui/ThemeToggle';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Collections', href: '/products', hasDropdown: true },
  { label: 'Gold', href: '/products?category=Gold' },
  { label: 'Diamond', href: '/products?category=Diamond' },
  { label: 'Bridal', href: '/products?category=Bridal' },
  { label: 'About', href: '/#about' },
];

const collectionLinks = [
  { label: 'Gold Jewellery', href: '/products?category=Gold' },
  { label: 'Diamond Jewellery', href: '/products?category=Diamond' },
  { label: 'Bridal Collection', href: '/products?category=Bridal' },
  { label: 'Everyday Wear', href: '/products?category=Everyday+Wear' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
    if (e.key === 'Escape') {
      setSearchOpen(false);
      setSearchQuery('');
    }
  };
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  // Close mobile menu on route change
  useEffect(() => setMobileOpen(false), [pathname, searchParams]);

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    
    const [path, query] = href.split('?');
    
    // Not on the right base path
    if (pathname !== path && !pathname.startsWith(path + '/')) return false;

    // Check specific category matching
    if (query) {
      const targetCategory = new URLSearchParams(query).get('category');
      const currentCategory = searchParams.get('category');
      return targetCategory === currentCategory;
    }

    // If no query in the link (like 'Collections' -> /products), 
    // only highlight if the user isn't in a specific category.
    if (path === '/products' && searchParams.has('category')) {
      return false;
    }

    return true;
  };

  const isHome = pathname === '/';
  // Use solid background if not home OR if scrolled
  const isSolid = !isHome || scrolled;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isSolid
            ? 'bg-bg/95 backdrop-blur-md shadow-md py-3 border-b border-border/50'
            : 'bg-transparent py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 group">
              <div className="flex items-center">
                <Image
                  src="/images/gbj_logo.png"
                  alt="GBJ Jewellers Logo"
                  width={120}
                  height={120}
                  className="w-24 object-contain"
                  priority
                />
                <div className="flex flex-col -ml-3">
                  <div>
                    <span className={`font-serif font-bold text-xl tracking-wide transition-colors ${isSolid ? 'text-text' : 'text-on-dark'
                      }`}>
                      GBJ
                    </span>
                    <span className={`font-serif text-xl transition-colors ${isSolid ? 'text-primary-hover' : 'text-accent'}`}> Jewellers</span>
                  </div>
                  <div className="text-[9px] tracking-[0.35em] uppercase text-primary mt-0.5">
                    Since 1925
                  </div>
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div key={link.label} className="relative group" 
                  onMouseEnter={() => link.hasDropdown && setDropdownOpen(true)}
                  onMouseLeave={() => link.hasDropdown && setDropdownOpen(false)}>
                  <Link
                    href={link.href}
                    className={`text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-300 relative py-2 flex items-center gap-1.5
                      ${isSolid ? 'text-text/80 hover:text-primary-hover' : 'text-on-dark/80 hover:text-accent'}
                      ${isActive(link.href) ? (isSolid ? 'text-primary-hover' : 'text-accent') : ''}
                    `}
                  >
                    {link.label}
                    {link.hasDropdown && <ChevronDown size={10} className={`mt-0.5 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />}
                    <span className={`absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 
                      ${isSolid ? 'bg-primary' : 'bg-accent'} 
                      ${isActive(link.href) ? 'w-full' : 'group-hover:w-full'}`} 
                    />
                  </Link>

                  {link.hasDropdown && (
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute top-full left-0 mt-0 w-52 bg-card shadow-lg border-t-2 border-primary-hover py-2"
                        >
                          {collectionLinks.map((cl) => (
                            <Link
                              key={cl.href}
                              href={cl.href}
                              className="block px-5 py-2.5 text-[10px] text-text hover:bg-secondary hover:text-primary-hover transition-colors tracking-widest uppercase"
                            >
                              {cl.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-1 sm:gap-3">
              <ThemeToggle />

              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className={`p-2 transition-colors duration-300 rounded-full hover:bg-black/5
                  ${isSolid ? 'text-text' : 'text-on-dark'}`}
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                href="/wishlist"
                className={`p-2 transition-colors duration-300 relative rounded-full hover:bg-black/5
                  ${isSolid ? 'text-text' : 'text-on-dark'}`}
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-on-dark text-[9px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link
                href="/cart"
                className={`p-2 transition-colors duration-300 relative rounded-full hover:bg-black/5
                  ${isSolid ? 'text-text' : 'text-on-dark'}`}
                aria-label="Shopping Cart"
              >
                <ShoppingBag size={20} />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-on-dark text-[9px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="hidden sm:block border-l border-border h-6 mx-1" />

              {user ? (
                <div className="flex items-center gap-3 ml-1">
                  <Link href="/account" className="block">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'Account'}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-primary ring-offset-1 hover:ring-accent transition-all"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-on-dark text-xs font-bold ring-2 ring-primary ring-offset-1"
                        style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}>
                        {(user.displayName || user.email || '?')[0].toUpperCase()}
                      </div>
                    )}
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  className={`p-2 transition-colors duration-300 rounded-full hover:bg-black/5
                    ${isSolid ? 'text-text' : 'text-on-dark'}`}
                  aria-label="Sign In"
                >
                  <User size={20} />
                </Link>
              )}

              <button
                onClick={() => setMobileOpen(true)}
                className={`lg:hidden p-2 transition-colors duration-300 rounded-full hover:bg-black/5
                  ${isSolid ? 'text-text' : 'text-on-dark'}`}
                aria-label="Menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-72 bg-card z-50 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                <div className="flex items-center">
                  <Image
                    src="/images/gbj_logo.png"
                    alt="GBJ Jewellers Logo"
                    width={120}
                    height={120}
                    className="w-24 object-contain"
                  />
                  <div className="flex flex-col -ml-3">
                    <span className="font-serif text-xl text-text">
                      GBJ <span className="text-primary">Jewellers</span>
                    </span>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)}>
                  <X size={20} className="text-text" />
                </button>
              </div>
              <nav className="flex-1 px-6 py-6 space-y-1 overflow-y-auto">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'All Products', href: '/products' },
                  { label: 'Gold Collection', href: '/products?category=Gold' },
                  { label: 'Diamond Collection', href: '/products?category=Diamond' },
                  { label: 'Bridal Collection', href: '/products?category=Bridal' },
                  { label: 'Everyday Wear', href: '/products?category=Everyday+Wear' },
                  { label: 'Cart', href: '/cart' },
                  { label: user ? 'My Account' : 'Login', href: user ? '/account' : '/login' },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center justify-between py-3 text-sm text-text hover:text-primary border-b border-border tracking-wider uppercase"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="px-6 py-4 bg-bg">
                <p className="text-xs text-muted text-center">BIS Hallmarked | IGI Certified</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
