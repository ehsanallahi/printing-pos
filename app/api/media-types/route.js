import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET all media types
export async function GET() {
  try {
    const mediaTypes = await prisma.mediaType.findMany({
      orderBy: { name: 'asc' },
    });
    // Ensure the 'return' keyword is here
    return NextResponse.json(mediaTypes);
  } catch (error) {
    console.error("Fetch Media Types Error:", error);
    return NextResponse.json({ error: "Failed to fetch media types" }, { status: 500 });
  }
}

// POST a new media type
export async function POST(request) {
  try {
    const { name } = await request.json();
    const newMediaType = await prisma.mediaType.create({
      data: { name },
    });
    // Ensure the 'return' keyword is here
    return NextResponse.json(newMediaType, { status: 201 });
  } catch (error) {
    console.error("Create Media Type Error:", error);
    return NextResponse.json({ error: "Failed to create media type" }, { status: 500 });
  }
}