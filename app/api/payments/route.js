import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// POST Function: To create a new payment for an order
export async function POST(request) {
  try {
    const { orderId, amount, method } = await request.json();

    // Convert amount to a number
    const paymentAmount = parseFloat(amount);

    if (!orderId || !paymentAmount || !method) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Use a transaction to ensure both operations succeed or fail together.
    // This prevents a payment from being created without updating the order's paid amount.
    const newPayment = await prisma.$transaction(async (tx) => {
      // 1. Create the new payment record
      const payment = await tx.payment.create({
        data: {
          orderId,
          amount: paymentAmount,
          method,
        },
      });

      // 2. Atomically update the order's paidAmount field
      await tx.order.update({
        where: { id: orderId },
        data: {
          paidAmount: {
            increment: paymentAmount, // Safely adds the new amount to the existing value
          },
        },
      });

      return payment;
    });

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error("Create Payment Error:", error);
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 });
  }
}