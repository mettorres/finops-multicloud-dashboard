
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cloudFilter = searchParams.get('clouds')?.split(',') || [];
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const whereConditions: any = {
      isIdle: true
    };

    if (cloudFilter?.length > 0) {
      whereConditions.cloud = {
        name: { in: cloudFilter }
      };
    }

    const [idleResources, totalCount] = await Promise.all([
      prisma.resource.findMany({
        where: whereConditions,
        include: {
          cloud: {
            select: {
              name: true,
              displayName: true,
              color: true
            }
          },
          service: {
            select: {
              name: true,
              displayName: true,
              category: true
            }
          }
        },
        orderBy: {
          potentialSavings: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.resource.count({ where: whereConditions })
    ]);

    const summary = await prisma.resource.aggregate({
      where: whereConditions,
      _sum: {
        monthlyCostCurrent: true,
        potentialSavings: true
      },
      _count: true
    });

    return NextResponse.json({
      resources: idleResources?.map(resource => ({
        id: resource?.id,
        name: resource?.name,
        resourceType: resource?.resourceType,
        status: resource?.status,
        cloud: {
          name: resource?.cloud?.name,
          displayName: resource?.cloud?.displayName,
          color: resource?.cloud?.color
        },
        service: {
          name: resource?.service?.name,
          displayName: resource?.service?.displayName,
          category: resource?.service?.category
        },
        region: resource?.region,
        sizeCurrent: resource?.sizeCurrent,
        utilizationCPU: parseFloat(resource?.utilizationCPU?.toString() || '0'),
        utilizationMemory: parseFloat(resource?.utilizationMemory?.toString() || '0'),
        utilizationNetwork: parseFloat(resource?.utilizationNetwork?.toString() || '0'),
        monthlyCostCurrent: parseFloat(resource?.monthlyCostCurrent?.toString() || '0'),
        potentialSavings: parseFloat(resource?.potentialSavings?.toString() || '0'),
        lastSeen: resource?.lastSeen?.toISOString(),
        tags: resource?.tags
      })),
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      summary: {
        totalResources: summary?._count || 0,
        totalMonthlyCost: parseFloat(summary?._sum?.monthlyCostCurrent?.toString() || '0'),
        totalPotentialSavings: parseFloat(summary?._sum?.potentialSavings?.toString() || '0')
      }
    });

  } catch (error) {
    console.error('Idle resources API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch idle resources' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
