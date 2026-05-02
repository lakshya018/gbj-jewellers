import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { auth } from '@clerk/nextjs/server';
import { getPayload } from 'payload';
import configPromise from '../../../../../payload.config';

export async function POST(req) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { amount, receipt, items, address, paymentMethod } = body; 

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
      key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret',
    });

    const payload = await getPayload({ config: configPromise });

    // Format items for Payload
    // Need to resolve slug to DB ID
    const slugs = items.map(i => i.id);
    const productsRes = await payload.find({
      collection: 'products',
      where: { slug: { in: slugs } },
      depth: 0,
    });
    const slugToDbId = {};
    productsRes.docs.forEach(p => { slugToDbId[p.slug] = p.id; });

    const payloadItems = items.map(item => ({
      product: slugToDbId[item.id] || item.id,
      quantity: item.quantity,
      size: item.size || null,
      priceAtPurchase: item.price,
    }));

    if (paymentMethod === 'cod') {
      const payloadOrder = await payload.create({
        collection: 'orders',
        data: {
          clerkUserId: userId || null,
          items: payloadItems,
          totalAmount: amount,
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          orderStatus: 'processing',
          shippingAddress: address,
        },
      });
      return NextResponse.json({ success: true, orderId: payloadOrder.id }, { status: 200 });
    } else {
      // Razorpay
      const options = {
        amount: Math.round(amount * 100), // paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      };

      let rpOrder;
      try {
        rpOrder = await razorpay.orders.create(options);
      } catch (rpErr) {
        console.error('Razorpay SDK Error:', rpErr);
        return NextResponse.json({ 
          error: 'Razorpay order creation failed', 
          details: typeof rpErr === 'object' ? JSON.stringify(rpErr) : String(rpErr)
        }, { status: 500 });
      }

      const payloadOrder = await payload.create({
        collection: 'orders',
        data: {
          clerkUserId: userId || null,
          items: payloadItems,
          totalAmount: amount,
          paymentMethod: 'razorpay',
          paymentStatus: 'pending',
          orderStatus: 'processing',
          shippingAddress: address,
          razorpayOrderId: rpOrder.id,
        },
      });

      return NextResponse.json({ order: rpOrder, payloadOrderId: payloadOrder.id }, { status: 200 });
    }
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Order initialization failed' }, { status: 500 });
  }
}
