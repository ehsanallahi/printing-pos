// File: src/app/api/orders/[id]/route.js
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

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
export async function PUT(request, { params }) {
  try {
    const orderId = params.id;
    const data = await request.json();

    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        customer: data.customer,
        mediaType: data.mediaType,
        width: data.width,
        height: data.height,
        quantity: data.quantity,
        rate: data.rate,
        totalAmount: data.totalAmount,
        // We can add status updates later
      },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error('Update Error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}