import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { verifyFirebaseToken } from '@/lib/firebase/admin';
import { getPayload } from 'payload';
import configPromise from '../../../../../payload.config';

export async function POST(req) {
  try {
    const decoded = await verifyFirebaseToken(req.headers.get('authorization'));
    const body = await req.json();
    const { amount, items, address, paymentMethod } = body;

    const payload = await getPayload({ config: configPromise });

    // Resolve slugs to DB IDs
    const slugs = items.map(i => i.id);
    const productsRes = await payload.find({
      collection: 'products',
      where: { slug: { in: slugs } },
      depth: 0,
    });
    const slugToDbId = {};
    productsRes.docs.forEach(p => { slugToDbId[p.slug] = p.id; });

    const payloadItems = items.map(item => ({
      product: slugToDbId[item.id] || item.dbId || item.id,
      quantity: item.quantity,
      size: item.size || null,
      priceAtPurchase: item.price,
    }));

    if (paymentMethod === 'cod') {
      const order = await payload.create({
        collection: 'orders',
        data: {
          firebaseUid: decoded?.uid || null,
          items: payloadItems,
          totalAmount: amount,
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          orderStatus: 'processing',
          shippingAddress: address,
        },
      });
      return NextResponse.json({ success: true, orderId: order.id }, { status: 200 });
    }

    // Razorpay online payment
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
    });

    let rpOrder;
    try {
      rpOrder = await razorpay.orders.create({
        amount: Math.round(amount * 100),
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      });
    } catch (rpErr) {
      console.error('Razorpay Error:', rpErr);
      return NextResponse.json({ error: 'Razorpay order creation failed' }, { status: 500 });
    }

    const order = await payload.create({
      collection: 'orders',
      data: {
        firebaseUid: decoded?.uid || null,
        items: payloadItems,
        totalAmount: amount,
        paymentMethod: 'razorpay',
        paymentStatus: 'pending',
        orderStatus: 'processing',
        shippingAddress: address,
        razorpayOrderId: rpOrder.id,
      },
    });

    return NextResponse.json({ order: rpOrder, payloadOrderId: order.id }, { status: 200 });
  } catch (err) {
    console.error('Payment create error:', err);
    return NextResponse.json({ error: 'Order initialization failed' }, { status: 500 });
  }
}
