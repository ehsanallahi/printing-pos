import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// PUT Function: To update an existing customer
export async function PUT(request, { params }) {
  try {
    // This is the standard and correct way to get the ID
    const customerId = params.id;
    const data = await request.json();

    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        name: data.name,
        phone: data.phone,
      },
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Update Customer Error:", error);
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

// DELETE Function: To delete a customer
export async function DELETE(request, { params }) {
  try {
    // This is the standard and correct way to get the ID
    const customerId = params.id;

    await prisma.customer.delete({
      where: { id: customerId },
    });
    
    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error("Delete Customer Error:", error);
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}