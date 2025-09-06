import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET Function: To fetch all customers

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const searchTerm = searchParams.get('search') || '';
    const pageSize = 10;

    const whereClause = searchTerm
      ? {
          name: {
            contains: searchTerm,
            mode: 'insensitive',
          },
        }
      : {};

    const [customers, totalCount] = await Promise.all([
      prisma.customer.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: pageSize,
        skip: (page - 1) * pageSize,
      }),
      prisma.customer.count({ where: whereClause }),
    ]);

    return NextResponse.json({ customers, totalCount });
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