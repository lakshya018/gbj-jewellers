import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '../../../../../payload.config';
import { auth } from '@clerk/nextjs/server';

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await getPayload({ config: configPromise });
    
    const wishlistRes = await payload.find({
      collection: 'wishlists',
      where: { clerkUserId: { equals: userId } },
      limit: 1,
      depth: 2, 
    });

    if (wishlistRes.docs.length === 0) {
      return NextResponse.json({ items: [] });
    }

    const dbWishlist = wishlistRes.docs[0];
    
    // Format items to match what WishlistContext expects
    const formattedItems = (dbWishlist.items || []).map(item => {
      const p = item.product;
      if (!p) return null;
      
      return {
        id: p.slug || p.id.toString(),
        name: p.name,
        price: Number(p.price),
        originalPrice: Number(p.originalPrice || p.price),
        category: typeof p.category === 'object' ? p.category?.name : p.category,
        image: p.images?.length > 0 ? p.images[0].image?.url : '/images/gold_collection.jpg',
        badge: p.badge || null,
        dbId: p.id,
      };
    }).filter(Boolean);

    return NextResponse.json({ items: formattedItems });
  } catch (err) {
    console.error('Wishlist GET Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { items } = await req.json();
    
    const payload = await getPayload({ config: configPromise });

    const wishlistRes = await payload.find({
      collection: 'wishlists',
      where: { clerkUserId: { equals: userId } },
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
    productsRes.docs.forEach(p => {
      slugToDbId[p.slug] = p.id;
    });

    const payloadItems = items.map(item => {
      const dbId = item.dbId || slugToDbId[item.id];
      if (!dbId) return null;
      return { product: dbId };
    }).filter(Boolean);

    if (wishlistRes.docs.length > 0) {
      const updated = await payload.update({
        collection: 'wishlists',
        id: wishlistRes.docs[0].id,
        data: { items: payloadItems },
      });
      return NextResponse.json({ success: true, wishlistId: updated.id });
    } else {
      const created = await payload.create({
        collection: 'wishlists',
        data: {
          clerkUserId: userId,
          items: payloadItems,
        },
      });
      return NextResponse.json({ success: true, wishlistId: created.id });
    }
  } catch (err) {
    console.error('Wishlist POST Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
