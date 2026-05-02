import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import configPromise from '../../../../../payload.config';
import { auth } from '@clerk/nextjs/server';

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await getPayload({ config: configPromise });
    
    const profileRes = await payload.find({
      collection: 'user-profiles',
      where: { clerkUserId: { equals: userId } },
      limit: 1,
    });

    if (profileRes.docs.length === 0) {
      return NextResponse.json({ savedAddresses: [] });
    }

    return NextResponse.json(profileRes.docs[0]);
  } catch (err) {
    console.error('Profile GET Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { savedAddresses } = body;
    
    const payload = await getPayload({ config: configPromise });

    const profileRes = await payload.find({
      collection: 'user-profiles',
      where: { clerkUserId: { equals: userId } },
      limit: 1,
    });

    if (profileRes.docs.length > 0) {
      const updated = await payload.update({
        collection: 'user-profiles',
        id: profileRes.docs[0].id,
        data: { savedAddresses },
      });
      return NextResponse.json({ success: true, profileId: updated.id });
    } else {
      const created = await payload.create({
        collection: 'user-profiles',
        data: {
          clerkUserId: userId,
          savedAddresses,
        },
      });
      return NextResponse.json({ success: true, profileId: created.id });
    }
  } catch (err) {
    console.error('Profile POST Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
