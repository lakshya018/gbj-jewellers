'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Clock, CheckCircle, Loader2, LogOut, Heart, ShoppingBag, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import AddressBook from '@/components/account/AddressBook';

function formatPrice(p) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
}

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function AccountPage() {
  const { user, loading: authLoading, logout, getToken } = useAuth();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  useEffect(() => {
    if (user) {
      setLoadingOrders(true);
      getToken().then(token => {
        fetch('/api/orders', { headers: token ? { Authorization: `Bearer ${token}` } : {} })
          .then(res => res.json())
          .then(data => setOrders(data.orders || []))
          .catch(err => console.error('Failed to load orders:', err))
          .finally(() => setLoadingOrders(false));
      });
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={36} />
      </div>
    );
  }

  const firstName = user.displayName?.split(' ')[0] || 'there';

  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Hero Profile Header ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #e6b84a, transparent)' }} />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #e6b84a, transparent)' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14">
          <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Avatar */}
            <div className="relative">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'Profile'}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-primary/40 ring-offset-4 ring-offset-[#1a1a2e] shadow-2xl"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl flex items-center justify-center text-on-dark text-3xl font-serif font-bold ring-4 ring-primary/40 ring-offset-4 ring-offset-[#1a1a2e] shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}>
                  {firstName[0].toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-lg ring-3 ring-[#1a1a2e] flex items-center justify-center">
                <CheckCircle size={14} className="text-on-dark" />
              </div>
            </div>

            {/* Info */}
            <div className="text-center sm:text-left flex-1">
              <p className="text-[10px] tracking-[0.3em] uppercase text-primary mb-1 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
                <Sparkles size={12} /> Welcome back
              </p>
              <h1 className="font-serif text-3xl sm:text-4xl text-on-dark font-bold">
                {user.displayName || 'My Account'}
              </h1>
              <p className="text-on-dark/40 text-sm mt-1.5">{user.email || user.phoneNumber || ''}</p>
            </div>

            {/* Sign Out */}
            <button
              onClick={async () => { await logout(); router.push('/'); }}
              className="flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-xl text-on-dark/60 hover:text-on-dark hover:border-white/30 hover:bg-white/5 transition-all text-xs font-bold tracking-widest uppercase"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.15 }} className="grid grid-cols-3 gap-3 mt-8 max-w-md">
            {[
              { label: 'Orders', value: orders.length, icon: Package, href: '#orders' },
              { label: 'Wishlist', value: wishlistCount, icon: Heart, href: '/wishlist' },
              { label: 'Cart', value: cartCount, icon: ShoppingBag, href: '/cart' },
            ].map((stat) => (
              <Link key={stat.label} href={stat.href}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-white/10 transition-all group">
                <p className="text-2xl font-bold text-on-dark">{stat.value}</p>
                <p className="text-[10px] tracking-widest uppercase text-on-dark/40 mt-0.5 flex items-center gap-1">
                  <stat.icon size={10} /> {stat.label}
                </p>
              </Link>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20 pb-20">
        {/* Tab Switcher */}
        <div className="bg-card rounded-2xl shadow-lg shadow-black/[0.03] border border-gray-100/80 p-1.5 flex gap-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-surface-dark text-on-dark shadow-md'
                  : 'text-muted hover:text-text hover:bg-secondary'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div {...fadeUp} transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl shadow-lg shadow-black/[0.03] border border-gray-100/80 overflow-hidden">
            <div className="px-7 py-5 border-b border-border">
              <h2 className="font-serif text-xl font-bold text-text">Order History</h2>
            </div>

            {loadingOrders ? (
              <div className="text-center py-16">
                <Loader2 className="animate-spin text-primary mx-auto" size={28} />
                <p className="text-sm text-muted mt-3">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                  <Package size={28} className="text-muted" />
                </div>
                <p className="text-text font-semibold text-lg mb-1">No orders yet</p>
                <p className="text-muted text-sm mb-6">Start exploring our stunning collection</p>
                <Link href="/products"
                  className="inline-flex items-center gap-2 px-7 py-3 text-xs font-bold tracking-widest uppercase text-on-dark rounded-xl shadow-lg hover:shadow-xl transition-all"
                  style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}>
                  Browse Jewellery <ChevronRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {orders.map((order) => {
                  const isPaid = order.paymentStatus === 'paid' || order.paymentMethod === 'cod';
                  return (
                    <div key={order.id} className="px-7 py-5 hover:bg-card-hover/50 transition-colors">
                      <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                            <Package size={18} className="text-text" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-text">{order.orderNumber}</p>
                            <p className="text-[11px] text-muted">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-bold text-text">{formatPrice(order.totalAmount)}</p>
                          <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full
                            ${order.orderStatus === 'delivered' ? 'bg-green-50 text-green-600' :
                              order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-600' :
                              'bg-amber-50 text-amber-600'}`}>
                            {order.orderStatus}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {order.items.slice(0, 4).map((item, idx) => {
                          const product = item.product;
                          const imageUrl = product?.images?.[0]?.image?.url || '/images/gold_collection.jpg';
                          return (
                            <Link key={idx} href={`/products/${product?.slug}`}
                              className="relative w-14 h-14 bg-secondary rounded-lg flex-shrink-0 overflow-hidden hover:ring-2 hover:ring-primary/40 transition-all">
                              <Image src={imageUrl} alt={product?.name || 'Product'} fill className="object-cover" />
                            </Link>
                          );
                        })}
                        {order.items.length > 4 && (
                          <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0 text-xs font-bold text-muted">
                            +{order.items.length - 4}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3 text-[11px]">
                        <div className="flex items-center gap-1.5 text-muted">
                          {isPaid ? <CheckCircle size={12} className="text-green-500" /> : <Clock size={12} className="text-amber-400" />}
                          <span className="uppercase font-semibold">{order.paymentMethod}</span>
                          <span>· {order.paymentStatus}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <motion.div {...fadeUp} transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl shadow-lg shadow-black/[0.03] border border-gray-100/80 overflow-hidden">
            <div className="px-7 py-5 border-b border-border">
              <h2 className="font-serif text-xl font-bold text-text">Saved Addresses</h2>
            </div>
            <div className="p-7">
              <AddressBook />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
