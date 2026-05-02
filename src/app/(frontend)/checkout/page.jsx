'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Shield, Truck, ArrowLeft, ArrowRight, CheckCircle, CreditCard, Smartphone, Banknote, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useUser } from '@clerk/nextjs';

function formatPrice(p) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

const paymentMethods = [
  { id: 'cod',      icon: Banknote,    label: 'Cash on Delivery',  sub: 'Pay when your order arrives' },
  { id: 'razorpay', icon: CreditCard,  label: 'Online Payment',    sub: 'Pay securely via UPI, Card, or Netbanking' },
];

const STEPS = ['Delivery', 'Payment', 'Review'];

/* ── Field: defined OUTSIDE CheckoutPage to prevent remount on every render ── */
function Field({ label, name, value, onChange, placeholder, type = 'text', required, errors }) {
  return (
    <div>
      <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-charcoal mb-1.5">
        {label}{required && <span className="text-gold-500 ml-0.5">*</span>}
      </label>
      <input
        type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full border px-4 py-3 text-sm bg-white focus:outline-none transition-colors
          ${errors?.[name] ? 'border-rose-400 focus:border-rose-400' : 'border-gray-200 focus:border-gold-400'}`}
      />
      {errors?.[name] && <p className="text-rose-500 text-[11px] mt-1">{errors[name]}</p>}
    </div>
  );
}

/* ── StepBar: defined OUTSIDE CheckoutPage ── */
function StepBar({ step }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className={`flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors
            ${i < step ? 'text-gold-500' : i === step ? 'text-charcoal' : 'text-gray-300'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all
              ${i < step ? 'bg-gold-500 text-white' : i === step ? 'bg-charcoal text-white' : 'bg-gray-100 text-gray-300'}`}>
              {i < step ? <CheckCircle size={14} /> : i + 1}
            </div>
            <span className="hidden sm:inline">{s}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-3 transition-colors ${i < step ? 'bg-gold-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoaded: userLoaded } = useUser();
  const { cartItems, cartSubtotal, clearCart } = useCart();
 
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState({
    fullName: '', phone: '', email: '',
    line1: '', line2: '', city: '', state: 'Rajasthan', pincode: '',
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [shouldSaveAddress, setShouldSaveAddress] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [upiId, setUpiId]     = useState('');
  const [cardNum, setCardNum] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [placing, setPlacing] = useState(false);
  const [errors, setErrors]   = useState({});
 
  useEffect(() => {
    if (userLoaded && user) {
      setLoadingProfile(true);
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data.savedAddresses) {
            setSavedAddresses(data.savedAddresses);
            // Auto-fill default if available
            const def = data.savedAddresses.find(a => a.isDefault);
            if (def) {
              setAddress({
                fullName: def.fullName,
                phone: def.phone,
                email: def.email || '',
                line1: def.line1,
                line2: def.line2 || '',
                city: def.city,
                state: def.state,
                pincode: def.pincode,
              });
            }
          }
        })
        .finally(() => setLoadingProfile(false));
    }
  }, [user, userLoaded]);

  const gst           = Math.round(cartSubtotal * 0.03);
  const makingCharges = cartItems.reduce((s, i) => s + 500 * i.quantity, 0);
  const total         = cartSubtotal + gst + makingCharges;

  /* ── Redirect if cart empty ── */
  if (!cartItems.length) {
    return (
      <div className="min-h-screen bg-pearl pt-20 flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="text-5xl">◇</div>
        <h1 className="font-serif text-3xl font-bold text-charcoal">Your cart is empty</h1>
        <Link href="/products" className="px-8 py-3 text-xs font-bold tracking-widest uppercase text-charcoal"
          style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  /* ── Validation ── */
  const validateAddress = () => {
    const e = {};
    if (!address.fullName.trim())  e.fullName = 'Required';
    if (!/^\d{10}$/.test(address.phone)) e.phone = 'Enter valid 10-digit number';
    if (!address.line1.trim())     e.line1 = 'Required';
    if (!address.city.trim())      e.city = 'Required';
    if (!address.state)            e.state = 'Required';
    if (!/^\d{6}$/.test(address.pincode)) e.pincode = 'Enter valid 6-digit pincode';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validatePayment = () => {
    const e = {};
    if (paymentMethod === 'upi' && !upiId.includes('@')) e.upi = 'Enter a valid UPI ID (e.g. name@upi)';
    if (paymentMethod === 'card') {
      if (cardNum.replace(/\s/g, '').length < 16) e.cardNum = 'Enter 16-digit card number';
      if (!cardExp.match(/^\d{2}\/\d{2}$/))       e.cardExp = 'Format: MM/YY';
      if (cardCvv.length < 3)                      e.cardCvv = 'Enter 3-digit CVV';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const nextStep = () => {
    if (step === 0 && !validateAddress()) return;
    if (step === 1 && !validatePayment()) return;
    setStep((s) => s + 1);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const placeOrder = async () => {
    setPlacing(true);
    try {
      const res = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          items: cartItems,
          address,
          paymentMethod: paymentMethod === 'cod' ? 'cod' : 'razorpay',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`${data.error}: ${data.details || ''}`);
        setPlacing(false);
        return;
      }
 
      // Save address if requested
      if (user && shouldSaveAddress) {
        const isAlreadySaved = savedAddresses.some(a => a.line1 === address.line1 && a.pincode === address.pincode);
        if (!isAlreadySaved) {
          const newSavedAddresses = [...savedAddresses, { ...address, label: address.city }];
          try {
            await fetch('/api/user/profile', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ savedAddresses: newSavedAddresses }),
            });
          } catch (err) {
            console.error('Failed to save address:', err);
          }
        }
      }

      if (paymentMethod === 'cod') {
        if (data.success) {
          clearCart();
          router.push('/order-confirmation');
        } else {
          alert('Failed to place COD order.');
          setPlacing(false);
        }
        return;
      }

      // Razorpay Flow
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Failed to load Razorpay SDK. Check your connection.');
        setPlacing(false);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'dummy_key',
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'GBJ Jewellers',
        description: 'Secure Jewellery Purchase',
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                payloadOrderId: data.payloadOrderId,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.status === 'success') {
              clearCart();
              router.push('/order-confirmation');
            } else {
              alert('Payment Verification Failed!');
            }
          } catch (err) {
            console.error('Verify err:', err);
            alert('Verification Error');
          } finally {
            setPlacing(false);
          }
        },
        prefill: {
          name: address.fullName,
          email: address.email || '',
          contact: address.phone,
        },
        theme: {
          color: '#333333',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        alert('Payment Failed: ' + response.error.description);
        setPlacing(false);
      });
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again.');
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-pearl pt-20">
      {/* Header */}
      <div className="bg-charcoal py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-[10px] tracking-[0.35em] uppercase text-gold-400 mb-1">Secure Checkout</p>
          <h1 className="font-serif text-3xl font-bold text-white">Checkout</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Steps ── */}
          <div className="lg:col-span-2">
            <StepBar step={step} />

            <AnimatePresence mode="wait">

              {/* ──────────── STEP 0: Delivery ──────────── */}
              {step === 0 && (
                <motion.div key="delivery"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 sm:p-8 space-y-5"
                >
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-1">Step 1</p>
                    <h2 className="font-serif text-xl font-bold text-charcoal">Delivery Address</h2>
                  </div>

                  {user && savedAddresses.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Saved Addresses</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {savedAddresses.map((addr, idx) => (
                          <button
                            key={idx}
                            onClick={() => setAddress({
                              fullName: addr.fullName,
                              phone: addr.phone,
                              email: addr.email || '',
                              line1: addr.line1,
                              line2: addr.line2 || '',
                              city: addr.city,
                              state: addr.state,
                              pincode: addr.pincode,
                            })}
                            className={`flex flex-col p-4 border-2 transition-all text-left group
                              ${address.line1 === addr.line1 && address.pincode === addr.pincode 
                                ? 'border-gold-400 bg-gold-50/30' 
                                : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-bold tracking-widest uppercase text-gold-600 flex items-center gap-1.5">
                                <MapPin size={12} /> {addr.label || 'Address'}
                              </span>
                              {address.line1 === addr.line1 && address.pincode === addr.pincode && (
                                <CheckCircle size={14} className="text-gold-500" />
                              )}
                            </div>
                            <p className="text-sm font-semibold text-charcoal">{addr.fullName}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{addr.line1}</p>
                            <p className="text-xs text-gray-400 mt-1">{addr.city}, {addr.pincode}</p>
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center gap-3 pt-2">
                        <div className="h-px flex-1 bg-gray-100" />
                        <span className="text-[10px] font-bold tracking-widest uppercase text-gray-300">Or enter manually</span>
                        <div className="h-px flex-1 bg-gray-100" />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Full Name" name="fullName" required value={address.fullName} errors={errors}
                      onChange={e => setAddress(p => ({ ...p, fullName: e.target.value }))} placeholder="As on ID" />
                    <Field label="Phone Number" name="phone" required type="tel" value={address.phone} errors={errors}
                      onChange={e => setAddress(p => ({ ...p, phone: e.target.value }))} placeholder="10-digit mobile" />
                  </div>

                  <Field label="Email (optional)" name="email" type="email" value={address.email} errors={errors}
                    onChange={e => setAddress(p => ({ ...p, email: e.target.value }))} placeholder="For order updates" />

                  <Field label="Address Line 1" name="line1" required value={address.line1} errors={errors}
                    onChange={e => setAddress(p => ({ ...p, line1: e.target.value }))} placeholder="House / Flat / Building" />
                  <Field label="Address Line 2" name="line2" value={address.line2} errors={errors}
                    onChange={e => setAddress(p => ({ ...p, line2: e.target.value }))} placeholder="Street / Locality (optional)" />

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="sm:col-span-1">
                      <Field label="City" name="city" required value={address.city} errors={errors}
                        onChange={e => setAddress(p => ({ ...p, city: e.target.value }))} placeholder="City" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-charcoal mb-1.5">
                        State<span className="text-gold-500 ml-0.5">*</span>
                      </label>
                      <div className="relative">
                        <select value={address.state}
                          onChange={e => setAddress(p => ({ ...p, state: e.target.value }))}
                          className="w-full border border-gray-200 px-4 py-3 text-sm bg-white focus:outline-none focus:border-gold-400 appearance-none">
                          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <Field label="Pincode" name="pincode" required value={address.pincode} errors={errors}
                      onChange={e => setAddress(p => ({ ...p, pincode: e.target.value }))} placeholder="6 digits" />
                  </div>

                  {user && (
                    <div className="flex items-center gap-2 pt-2">
                      <input 
                        type="checkbox" 
                        id="save-address" 
                        checked={shouldSaveAddress}
                        onChange={(e) => setShouldSaveAddress(e.target.checked)}
                        className="w-4 h-4 accent-gold-500 border-gray-300 rounded focus:ring-gold-400"
                      />
                      <label htmlFor="save-address" className="text-xs text-gray-500 cursor-pointer select-none">
                        Save this address for future purchases
                      </label>
                    </div>
                  )}
                </motion.div>
              )}

              {/* ──────────── STEP 1: Payment ──────────── */}
              {step === 1 && (
                <motion.div key="payment"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 sm:p-8"
                >
                  <div className="mb-6">
                    <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-1">Step 2</p>
                    <h2 className="font-serif text-xl font-bold text-charcoal">Payment Method</h2>
                  </div>

                  <div className="space-y-3 mb-6">
                    {paymentMethods.map(({ id, icon: Icon, label, sub }) => (
                      <button key={id} onClick={() => { setPaymentMethod(id); setErrors({}); }}
                        className={`w-full flex items-center gap-4 p-4 border-2 transition-all duration-200 text-left
                          ${paymentMethod === id ? 'border-gold-400 bg-gold-50' : 'border-gray-100 hover:border-gray-200'}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                          ${paymentMethod === id ? 'bg-gold-500' : 'bg-gray-100'}`}>
                          <Icon size={16} className={paymentMethod === id ? 'text-white' : 'text-gray-400'} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-charcoal">{label}</p>
                          <p className="text-xs text-gray-400">{sub}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0
                          ${paymentMethod === id ? 'border-gold-500' : 'border-gray-300'}`}>
                          {paymentMethod === id && <div className="w-2 h-2 rounded-full bg-gold-500" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Note about Razorpay */}
                  {paymentMethod === 'razorpay' && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-pearl border border-gray-100">
                      <div className="flex gap-3">
                        <Shield size={16} className="text-gold-600 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-charcoal">Secure Checkout</p>
                          <p className="text-[11px] text-gray-500 leading-relaxed">
                            You will be redirected to Razorpay's secure payment gateway to complete your transaction using UPI, Cards, or Netbanking.
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {paymentMethod === 'cod' && (
                    <p className="text-sm text-gray-500 bg-pearl border border-gray-100 px-4 py-3">
                      💰 Pay in cash when your order is delivered. No advance required.
                    </p>
                  )}
                </motion.div>
              )}

              {/* ──────────── STEP 2: Review ──────────── */}
              {step === 2 && (
                <motion.div key="review"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 sm:p-8 space-y-6"
                >
                  <div>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-1">Step 3</p>
                    <h2 className="font-serif text-xl font-bold text-charcoal">Review Your Order</h2>
                  </div>

                  {/* Delivery summary */}
                  <div className="border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-gold-600">Delivery To</p>
                      <button onClick={() => setStep(0)} className="text-[11px] text-charcoal underline hover:text-gold-500">Edit</button>
                    </div>
                    <p className="text-sm font-semibold text-charcoal">{address.fullName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {[address.line1, address.line2, address.city, address.state, address.pincode].filter(Boolean).join(', ')}
                    </p>
                    <p className="text-xs text-gray-500">{address.phone}</p>
                  </div>

                  {/* Payment summary */}
                  <div className="border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-bold tracking-widest uppercase text-gold-600">Payment</p>
                      <button onClick={() => setStep(1)} className="text-[11px] text-charcoal underline hover:text-gold-500">Edit</button>
                    </div>
                    <p className="text-sm text-charcoal font-medium capitalize">
                      {paymentMethods.find(m => m.id === paymentMethod)?.label}
                    </p>
                    {paymentMethod === 'upi' && upiId && <p className="text-xs text-gray-400">{upiId}</p>}
                    {paymentMethod === 'card' && cardNum && <p className="text-xs text-gray-400">•••• {cardNum.slice(-4)}</p>}
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {cartItems.map(item => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-4 items-center">
                        <div className="relative w-14 h-14 bg-gray-50 flex-shrink-0 overflow-hidden">
                          <Image src={item.images?.[0] || '/images/gold_collection.jpg'} alt={item.name}
                            fill className="object-cover" sizes="56px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-charcoal line-clamp-1">{item.name}</p>
                          <p className="text-[11px] text-gray-400">{item.purity} · Qty {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold text-charcoal flex-shrink-0">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-5">
              {step > 0 ? (
                <button onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-charcoal hover:text-gold-500 transition-colors">
                  <ArrowLeft size={14} /> Back
                </button>
              ) : (
                <Link href="/cart"
                  className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-charcoal hover:text-gold-500 transition-colors">
                  <ArrowLeft size={14} /> Back to Cart
                </Link>
              )}

              {step < 2 ? (
                <button onClick={nextStep}
                  className="flex items-center gap-2 px-8 py-3.5 text-xs font-bold tracking-widest uppercase text-charcoal transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}>
                  Continue <ArrowRight size={14} />
                </button>
              ) : (
                <button onClick={placeOrder} disabled={placing}
                  className="flex items-center gap-2 px-8 py-3.5 text-xs font-bold tracking-widest uppercase text-charcoal transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #e6b84a, #a37820)' }}>
                  {placing ? <span className="animate-pulse">Placing Order…</span> : <><CheckCircle size={14} /> Place Order</>}
                </button>
              )}
            </div>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="bg-white p-6 h-fit sticky top-28">
            <h3 className="font-serif text-lg font-bold text-charcoal mb-5">Order Summary</h3>

            {/* Items */}
            <div className="space-y-3 mb-5">
              {cartItems.map(item => (
                <div key={`${item.id}-${item.size}`} className="flex gap-3 items-center">
                  <div className="relative w-12 h-12 bg-gray-50 flex-shrink-0 overflow-hidden">
                    <Image src={item.images?.[0] || '/images/gold_collection.jpg'} alt={item.name}
                      fill className="object-cover" sizes="48px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-charcoal font-medium line-clamp-1">{item.name}</p>
                    <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-semibold text-charcoal">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="gold-divider mb-4" />

            <div className="space-y-2.5 mb-4">
              {[
                ['Subtotal',       cartSubtotal],
                ['Making Charges', makingCharges],
                ['GST (3%)',       gst],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-medium text-charcoal">{formatPrice(val)}</span>
                </div>
              ))}
            </div>

            <div className="gold-divider mb-4" />

            <div className="flex justify-between items-baseline mb-5">
              <span className="font-semibold text-charcoal">Total</span>
              <span className="font-serif text-2xl font-bold text-charcoal">{formatPrice(total)}</span>
            </div>

            <div className="space-y-2 pt-3 border-t border-gray-100">
              {[
                [Shield, 'SSL encrypted & secure'],
                [Truck,  'Free insured shipping'],
              ].map(([Icon, text]) => (
                <div key={text} className="flex items-center gap-2 text-[11px] text-gray-400">
                  <Icon size={11} className="text-gold-500" /><span>{text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
