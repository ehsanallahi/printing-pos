import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // Find the customer by their phone number
    const customer = await prisma.customer.findUnique({
      where: { phone }, // This requires the phone field to be unique
      // Also, include all of their orders
      include: {
        orders: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Customer Lookup Error:", error);
    return NextResponse.json({ error: 'Failed to find customer' }, { status: 500 });
  }
}