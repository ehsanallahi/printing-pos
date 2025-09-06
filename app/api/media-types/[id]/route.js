import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// DELETE a media type by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prisma.mediaType.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Media type deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete media type' }, { status: 500 });
  }
}