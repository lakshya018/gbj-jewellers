import { NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase/admin';
import { getPayload } from 'payload';
import configPromise from '../../../../payload.config';

export async function GET(req) {
  try {
    const decoded = await verifyFirebaseToken(req.headers.get('authorization'));
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await getPayload({ config: configPromise });
    const ordersRes = await payload.find({
      collection: 'orders',
      where: { firebaseUid: { equals: decoded.uid } },
      sort: '-createdAt',
      depth: 2,
    });

    return NextResponse.json({ orders: ordersRes.docs });
  } catch (err) {
    console.error('Orders GET Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const decoded = await verifyFirebaseToken(req.headers.get('authorization'));
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { items, totalAmount, paymentMethod, address } = await req.json();
    const payload = await getPayload({ config: configPromise });

    const order = await payload.create({
      collection: 'orders',
      data: {
        firebaseUid: decoded.uid,
        items: items.map(item => ({
          product: item.dbId || item.id,
          quantity: item.quantity,
          priceAtPurchase: item.price,
          size: item.size || null,
        })),
        totalAmount,
        paymentMethod: paymentMethod === 'cod' ? 'cod' : 'razorpay',
        paymentStatus: 'pending',
        orderStatus: 'processing',
        shippingAddress: address,
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error('Orders POST Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
