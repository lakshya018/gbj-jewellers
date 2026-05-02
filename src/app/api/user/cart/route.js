import { NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/firebase/admin';
import { getPayload } from 'payload';
import configPromise from '../../../../../payload.config';

export async function GET(req) {
  try {
    const decoded = await verifyFirebaseToken(req.headers.get('authorization'));
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await getPayload({ config: configPromise });
    const cartRes = await payload.find({
      collection: 'carts',
      where: { firebaseUid: { equals: decoded.uid } },
      limit: 1,
      depth: 2,
    });

    if (cartRes.docs.length === 0) return NextResponse.json({ items: [] });

    const dbCart = cartRes.docs[0];
    const formattedItems = (dbCart.items || []).map(item => {
      const p = item.product;
      if (!p) return null;
      return {
        id: p.slug || p.id.toString(),
        name: p.name,
        price: Number(p.price),
        originalPrice: Number(p.originalPrice || p.price),
        category: typeof p.category === 'object' ? p.category?.name : p.category,
        image: p.images?.length > 0 ? p.images[0].image?.url : '/images/gold_collection.jpg',
        quantity: item.quantity,
        size: item.size || null,
        dbId: p.id,
      };
    }).filter(Boolean);

    return NextResponse.json({ items: formattedItems });
  } catch (err) {
    console.error('Cart GET Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const decoded = await verifyFirebaseToken(req.headers.get('authorization'));
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { items } = await req.json();
    const payload = await getPayload({ config: configPromise });

    const cartRes = await payload.find({
      collection: 'carts',
      where: { firebaseUid: { equals: decoded.uid } },
      limit: 1,
    });

    const slugs = items.map(item => item.id);
    const productsRes = await payload.find({
      collection: 'products',
      where: { slug: { in: slugs } },
      limit: 100,
      depth: 0,
    });

    const slugToDbId = {};
    productsRes.docs.forEach(p => { slugToDbId[p.slug] = p.id; });

    const payloadItems = items.map(item => {
      const dbId = item.dbId || slugToDbId[item.id];
      if (!dbId) return null;
      return { product: dbId, quantity: item.quantity, size: item.size || null };
    }).filter(Boolean);

    if (cartRes.docs.length > 0) {
      const updated = await payload.update({
        collection: 'carts',
        id: cartRes.docs[0].id,
        data: { items: payloadItems },
      });
      return NextResponse.json({ success: true, cartId: updated.id });
    } else {
      const created = await payload.create({
        collection: 'carts',
        data: { firebaseUid: decoded.uid, items: payloadItems },
      });
      return NextResponse.json({ success: true, cartId: created.id });
    }
  } catch (err) {
    console.error('Cart POST Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
