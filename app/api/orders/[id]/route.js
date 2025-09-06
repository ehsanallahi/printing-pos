import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// --- GET a single order by ID ---
export async function GET(request, { params }) {
  try {
    const orderId = params.id;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Fetch Single Order Error:", error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// --- PUT: Update a full order ---
export async function PUT(request, { params }) {
  try {
    const orderId = params.id;
    const data = await request.json();

    const customer = await prisma.customer.upsert({
      where: { name: data.customer },
      update: {},
      create: { name: data.customer },
    });

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        mediaType: data.mediaType,
        width: data.width,
        height: data.height,
        quantity: data.quantity,
        rate: data.rate,
        totalAmount: data.totalAmount,
        customer: {
          connect: {
            id: customer.id,
          },
        },
      },
      include: {
        customer: true,
      }
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Update Order Error:", error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// --- PATCH: Update an order's status ---
export async function PATCH(request, { params }) {
  try {
    const orderId = params.id;
    const { status } = await request.json();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status,
      },
      include: {
        customer: true,
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Update Status Error:", error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}

// --- DELETE an order ---
export async function DELETE(request, { params }) {
  try {
    const orderId = params.id;

    await prisma.order.delete({
      where: {
        id: orderId,
      },
    });

    return NextResponse.json({ message: 'Order deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete Error:', error);
    return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
  }
}