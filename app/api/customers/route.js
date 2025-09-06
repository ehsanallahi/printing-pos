import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET Function: To fetch all customers
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Fetch Customers Error:", error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

// POST Function: To create a new customer
export async function POST(request) {
  try {
    const data = await request.json();
    const newCustomer = await prisma.customer.create({
      data: {
        name: data.name,
        phone: data.phone,
      },
    });
    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("Create Customer Error:", error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}