import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const adminEmail = 'admin@example.com';
    const plainPassword = 'admin123';

    // First, delete any existing, possibly incorrect admin user
    await prisma.user.deleteMany({
      where: { email: adminEmail },
    });

    // Now, create a fresh, correct one
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        hashedPassword: hashedPassword,
      },
    });

    return NextResponse.json({ message: 'Admin user has been reset successfully!' }, { status: 200 });
  } catch (error) {
    console.error("Admin Fix Error:", error);
    return NextResponse.json({ error: 'Failed to fix admin user.' }, { status: 500 });
  }
}