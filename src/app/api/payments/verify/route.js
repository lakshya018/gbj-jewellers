import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getPayload } from 'payload';
import configPromise from '../../../../../payload.config';

export async function POST(req) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, payloadOrderId } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET || 'dummy_secret';

    const generated_signature = crypto
      .createHmac('sha256', secret)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generated_signature === razorpay_signature) {
      // Payment is successful, update order status in Payload
      const payload = await getPayload({ config: configPromise });
      
      await payload.update({
        collection: 'orders',
        id: payloadOrderId,
        data: {
          paymentStatus: 'paid',
          razorpayPaymentId: razorpay_payment_id,
        },
      });

      return NextResponse.json({ status: 'success' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error('Razorpay verification error:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
