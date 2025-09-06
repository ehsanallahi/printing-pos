import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET Function: To fetch a simple list of all customers
export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Fetch Customer List Error:", error);
    return NextResponse.json({ error: 'Failed to fetch customer list' }, { status: 500 });
  }
}