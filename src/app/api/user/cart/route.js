import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '../../../../../payload.config';
import { auth } from '@clerk/nextjs/server';

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await getPayload({ config: configPromise });
    
    const cartRes = await payload.find({
      collection: 'carts',
      where: { clerkUserId: { equals: userId } },
      limit: 1,
      depth: 2, // Ensure products and their images are populated
    });

    if (cartRes.docs.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const dbCart = cartRes.docs[0];
    
    // Format items to match what CartContext expects
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
        dbId: p.id, // Keep the actual payload DB ID just in case
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
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { items } = await req.json();
    
    const payload = await getPayload({ config: configPromise });

    // Find the cart
    const cartRes = await payload.find({
      collection: 'carts',
      where: { clerkUserId: { equals: userId } },
      limit: 1,
    });

    // We need to map the frontend slugs/ids back to Payload product IDs.
    // However, if the frontend sends the whole object, it might not have the numeric Payload ID (it has the slug).
    // Let's resolve the product IDs if necessary.
    const slugs = items.map(item => item.id);
    const productsRes = await payload.find({
      collection: 'products',
      where: { slug: { in: slugs } },
      limit: 100,
      depth: 0,
    });

    const slugToDbId = {};
    productsRes.docs.forEach(p => {
      slugToDbId[p.slug] = p.id;
    });

    const payloadItems = items.map(item => {
      const dbId = item.dbId || slugToDbId[item.id];
      if (!dbId) return null;
      return {
        product: dbId,
        quantity: item.quantity,
        size: item.size || null,
      };
    }).filter(Boolean);

    if (cartRes.docs.length > 0) {
      // Update existing
      const updated = await payload.update({
        collection: 'carts',
        id: cartRes.docs[0].id,
        data: { items: payloadItems },
      });
      return NextResponse.json({ success: true, cartId: updated.id });
    } else {
      // Create new
      const created = await payload.create({
        collection: 'carts',
        data: {
          clerkUserId: userId,
          items: payloadItems,
        },
      });
      return NextResponse.json({ success: true, cartId: created.id });
    }
  } catch (err) {
    console.error('Cart POST Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
