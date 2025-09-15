import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const adminEmail = 'admin@example.com';

    // Check if the admin already exists to prevent duplicates
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      return NextResponse.json({ message: 'Admin user already exists.' }, { status: 200 });
    }

    // If not, create the admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        hashedPassword: hashedPassword,
      },
    });

    return NextResponse.json({ message: 'Admin user created successfully!' }, { status: 200 });
  } catch (error) {
    console.error("Setup Admin Error:", error);
    return NextResponse.json({ error: 'Failed to create admin user.' }, { status: 500 });
  }
}