
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const clouds = await prisma.cloudProvider.findMany({
      where: { active: true },
      include: {
        services: {
          where: { active: true },
          select: {
            id: true,
            name: true,
            displayName: true,
            category: true,
            icon: true
          }
        },
        _count: {
          select: {
            costs: true,
            resources: true,
            recommendations: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json({ clouds });

  } catch (error) {
    console.error('Clouds API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cloud providers' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
