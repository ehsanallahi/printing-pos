import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET Function: To fetch all orders from the database



export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    // NEW: Get the search term from the URL
    const searchTerm = searchParams.get('search') || '';
    const pageSize = 10;

    // NEW: Define a 'where' clause for our queries
    const whereClause = searchTerm
      ? {
          customer: {
            name: {
              contains: searchTerm,
              mode: 'insensitive', // Makes search case-insensitive
            },
          },
        }
      : {};

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: whereClause, // Apply the where clause
        orderBy: { createdAt: 'desc' },
        include: { customer: true },
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
      prisma.order.count({ where: whereClause }), // Apply it to the count as well
    ]);

    return NextResponse.json({ orders, totalCount });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
// POST Function: To create a new order in the database
export async function POST(request) {
  try {
    const data = await request.json();

    // Find an existing customer by name, or create a new one.
    const customer = await prisma.customer.upsert({
      where: { name: data.customer },
      update: {},
      create: { name: data.customer },
    });

    // Create the order using the customer's ID
    const newOrder = await prisma.order.create({
      data: {
        mediaType: data.mediaType,
        status: 'Pending',
        width: data.width,
        height: data.height,
        quantity: data.quantity,
        rate: data.rate,
        totalAmount: data.totalAmount,
        // FIX: Use the 'connect' syntax to link the order to the customer relation.
        customer: {
          connect: {
            id: customer.id,
          },
        },
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}