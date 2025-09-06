import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// DELETE Function (This was already correct)
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

// PUT Function (This is the corrected version)
export async function PUT(request, { params }) {
  try {
    const orderId = params.id;
    const data = await request.json();

    // STEP 1: Find or create the customer based on the name from the form.
    const customer = await prisma.customer.upsert({
      where: { name: data.customer },
      update: {},
      create: { name: data.customer },
    });

    // STEP 2: Now, update the order with the new details.
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        mediaType: data.mediaType,
        width: data.width,
        height: data.height,
        quantity: data.quantity,
        rate: data.rate,
        totalAmount: data.totalAmount,
        // FIX: Connect the order to the customer using the relation.
        customer: {
          connect: {
            id: customer.id,
          },
        },
      },
      // IMPORTANT: Include the customer data in the response so the UI updates correctly.
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
// Add this PATCH function to the file

export async function PATCH(request, { params }) {
  try {
    const orderId = params.id;
    const { status } = await request.json(); // Get only the status from the request

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status, // Update only the status field
      },
      include: {
        customer: true, // Include customer data in the response
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("Update Status Error:", error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}