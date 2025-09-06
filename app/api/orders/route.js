import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET Function: To fetch all orders from the database
export async function GET() {
  try {
    const orders = await prisma.order.findMany({
     orderBy: {
    createdAt: 'desc',
  },
  include: {
   include: { customer: true }, // This tells Prisma to fetch the related customer data
  },
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST Function: To create a new order in the database
export async function POST(request) {
  try {
    const data = await request.json();

    // New Logic: Find an existing customer by name, or create a new one.
    const customer = await prisma.customer.upsert({
      where: { name: data.customer },
      update: {}, // We can add logic to update customer info here later if needed
      create: { name: data.customer },
    });

    // Now, create the order using the found or newly created customer's ID
    const newOrder = await prisma.order.create({
      data: {
        mediaType: data.mediaType,
        status: 'Pending',
        width: data.width,
        height: data.height,
        quantity: data.quantity,
        rate: data.rate,
        totalAmount: data.totalAmount,
        customerId: customer.id, // Link the order to the customer
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    // Add a log to see the error in your terminal
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}