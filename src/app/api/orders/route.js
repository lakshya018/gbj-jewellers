import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { items, totalAmount, paymentMethod, address } = body;

    // Create or update customer record in Prisma
    const customer = await prisma.customer.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email: address.email || '',
        name: address.fullName || '',
        phone: address.phone || '',
      },
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId: userId,
        totalAmount,
        paymentMethod,
        address,
        status: 'PENDING',
        items: {
          create: items.map(item => ({
            productId: item.id,
            productName: item.name,
            price: item.price,
            quantity: item.quantity,
            purity: item.purity,
            size: item.size,
          })),
        },
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { customerId: userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
