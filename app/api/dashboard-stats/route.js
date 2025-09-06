import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // We run all these database queries at the same time for performance
    const [totalRevenue, totalOrders, totalCustomers, pendingOrders] = await Promise.all([
      // 1. Calculate the sum of the 'totalAmount' column
      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
      }),
      // 2. Count the total number of orders
      prisma.order.count(),
      // 3. Count the total number of customers
      prisma.customer.count(),
      // 4. Count orders where the status is 'Pending'
      prisma.order.count({
        where: {
          status: 'Pending',
        },
      }),
    ]);

    const stats = {
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      totalOrders: totalOrders || 0,
      totalCustomers: totalCustomers || 0,
      pendingOrders: pendingOrders || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}