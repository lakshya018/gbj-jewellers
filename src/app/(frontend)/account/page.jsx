import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getPayload } from 'payload';
import configPromise from '../../../../payload.config';
import Image from 'next/image';
import Link from 'next/link';
import { Package, Clock, CheckCircle, XCircle, MapPin } from 'lucide-react';
import AddressBook from '@/components/account/AddressBook';

function formatPrice(p) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
}

export const metadata = {
  title: 'My Account',
};

export default async function AccountPage() {
  const { userId } = await auth();
  if (!userId) {
    return null; // Middleware will handle redirect
  }

  const user = await currentUser();
  const payload = await getPayload({ config: configPromise });

  // Fetch orders
  const ordersRes = await payload.find({
    collection: 'orders',
    where: { clerkUserId: { equals: userId } },
    sort: '-createdAt',
    depth: 2,
  });

  const orders = ordersRes.docs;

  return (
    <div className="min-h-screen bg-pearl pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center sm:text-left">
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-2">Welcome Back</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
            {user.firstName ? `${user.firstName}'s Account` : 'My Account'}
          </h1>
          <p className="text-sm text-gray-500 mt-2">{user.primaryEmailAddress?.emailAddress}</p>
        </div>

        <div className="bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="font-serif text-xl font-bold text-charcoal border-b border-gray-100 pb-4 mb-6">
            Order History
          </h2>

          {orders.length === 0 ? (
            <div className="text-center py-10">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-charcoal font-medium">You haven't placed any orders yet.</p>
              <Link href="/products" className="inline-block mt-4 px-6 py-3 text-xs font-bold tracking-widest uppercase text-charcoal"
                style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const isPaid = order.paymentStatus === 'paid' || order.paymentMethod === 'cod';
                
                return (
                  <div key={order.id} className="border border-gray-100 p-5">
                    {/* Order Header */}
                    <div className="flex flex-wrap gap-4 items-center justify-between border-b border-gray-50 pb-4 mb-4">
                      <div>
                        <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400">Order No.</p>
                        <p className="text-sm font-semibold text-charcoal">{order.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400">Date</p>
                        <p className="text-sm font-semibold text-charcoal">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-widest uppercase text-gray-400">Total</p>
                        <p className="text-sm font-semibold text-charcoal">{formatPrice(order.totalAmount)}</p>
                      </div>
                      <div>
                        <div className={`flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full
                          ${order.orderStatus === 'delivered' ? 'bg-green-50 text-green-600' :
                            order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-600' :
                            'bg-gold-50 text-gold-600'}`}>
                          {order.orderStatus}
                        </div>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-4">
                      {order.items.map((item, idx) => {
                        const product = item.product;
                        const imageUrl = product?.images?.[0]?.image?.url || '/images/gold_collection.jpg';
                        
                        return (
                          <div key={idx} className="flex gap-4 items-center">
                            <div className="relative w-16 h-16 bg-gray-50 flex-shrink-0">
                              <Image src={imageUrl} alt={product?.name || 'Product'} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-charcoal line-clamp-1">
                                <Link href={`/products/${product?.slug}`} className="hover:text-gold-500 transition-colors">
                                  {product?.name || 'Unknown Product'}
                                </Link>
                              </p>
                              <p className="text-xs text-gray-500">Qty: {item.quantity} {item.size ? `| Size: ${item.size}` : ''}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-charcoal">{formatPrice(item.priceAtPurchase * item.quantity)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Footer status */}
                    <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        {isPaid ? <CheckCircle size={14} className="text-green-500" /> : <Clock size={14} className="text-orange-400" />}
                        <span>Payment: <span className="uppercase font-semibold text-charcoal">{order.paymentMethod}</span> ({order.paymentStatus})</span>
                      </div>
                      
                      {!isPaid && order.paymentMethod === 'razorpay' && order.paymentStatus === 'pending' && (
                        <p className="text-orange-500 font-medium">Payment incomplete</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Address Book Section */}
        <div className="bg-white p-6 sm:p-8 shadow-sm mt-8">
          <AddressBook />
        </div>
      </div>
    </div>
  );
}
