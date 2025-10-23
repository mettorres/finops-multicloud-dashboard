
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { subMonths, subDays } from 'date-fns';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cloudFilter = searchParams.get('clouds')?.split(',') || [];
    const dateFrom = searchParams.get('from') ? new Date(searchParams.get('from')!) : subMonths(new Date(), 3);
    const dateTo = searchParams.get('to') ? new Date(searchParams.get('to')!) : new Date();

    // Build where conditions
    const whereConditions: any = {
      date: {
        gte: dateFrom,
        lte: dateTo
      }
    };

    if (cloudFilter?.length > 0) {
      whereConditions.cloud = {
        name: {
          in: cloudFilter
        }
      };
    }

    // Get total costs by cloud
    const costsByCloud = await prisma.cost.groupBy({
      by: ['cloudId'],
      where: whereConditions,
      _sum: {
        costUSD: true
      },
      _count: true
    });

    // Get cloud details
    const clouds = await prisma.cloudProvider.findMany({
      where: cloudFilter?.length > 0 ? { name: { in: cloudFilter } } : undefined,
      include: {
        _count: {
          select: {
            costs: true,
            resources: true,
            recommendations: true
          }
        }
      }
    });

    const cloudData = costsByCloud?.map(cost => {
      const cloud = clouds?.find(c => c?.id === cost?.cloudId);
      return {
        cloudId: cost?.cloudId,
        cloudName: cloud?.name,
        displayName: cloud?.displayName,
        color: cloud?.color,
        totalCost: parseFloat(cost?._sum?.costUSD?.toString() || '0'),
        recordCount: cost?._count,
        resourceCount: cloud?._count?.resources || 0,
        recommendationCount: cloud?._count?.recommendations || 0
      };
    });

    // Get daily costs trend (last 30 days)
    const dailyCosts = await prisma.cost.groupBy({
      by: ['date', 'cloudId'],
      where: {
        ...whereConditions,
        date: {
          gte: subDays(new Date(), 30),
          lte: new Date()
        }
      },
      _sum: {
        costUSD: true
      },
      orderBy: {
        date: 'asc'
      }
    });

    const trendData = dailyCosts?.map(item => {
      const cloud = clouds?.find(c => c?.id === item?.cloudId);
      return {
        date: item?.date?.toISOString()?.split('T')[0],
        cloudName: cloud?.name,
        displayName: cloud?.displayName,
        cost: parseFloat(item?._sum?.costUSD?.toString() || '0')
      };
    });

    // Get top services by cost
    const topServices = await prisma.cost.groupBy({
      by: ['serviceId', 'cloudId'],
      where: whereConditions,
      _sum: {
        costUSD: true
      },
      orderBy: {
        _sum: {
          costUSD: 'desc'
        }
      },
      take: 10
    });

    const serviceData = await Promise.all(
      topServices?.map(async (service) => {
        const serviceDetails = await prisma.cloudService.findUnique({
          where: { id: service?.serviceId || '' },
          include: {
            cloud: true
          }
        });
        
        return {
          serviceId: service?.serviceId,
          serviceName: serviceDetails?.name,
          displayName: serviceDetails?.displayName,
          category: serviceDetails?.category,
          cloudName: serviceDetails?.cloud?.name,
          cloudDisplayName: serviceDetails?.cloud?.displayName,
          totalCost: parseFloat(service?._sum?.costUSD?.toString() || '0')
        };
      })
    );

    // Get idle resources count and potential savings
    const idleResources = await prisma.resource.aggregate({
      where: {
        isIdle: true,
        ...(cloudFilter?.length > 0 ? {
          cloud: {
            name: { in: cloudFilter }
          }
        } : {})
      },
      _count: true,
      _sum: {
        potentialSavings: true
      }
    });

    // Get recommendations summary
    const recommendations = await prisma.recommendation.groupBy({
      by: ['priority', 'status'],
      where: cloudFilter?.length > 0 ? {
        cloud: {
          name: { in: cloudFilter }
        }
      } : undefined,
      _count: true,
      _sum: {
        potentialSaving: true
      }
    });

    // Get recent savings
    const recentSavings = await prisma.savings.aggregate({
      where: {
        status: 'active',
        ...(cloudFilter?.length > 0 ? {
          cloud: {
            name: { in: cloudFilter }
          }
        } : {})
      },
      _sum: {
        savingsAmount: true,
        originalCost: true
      },
      _count: true
    });

    // Calculate forecast accuracy (mock calculation)
    const forecastAccuracy = 85.2; // This would be calculated based on actual vs predicted

    // Build summary metrics
    const totalCost = cloudData?.reduce((sum, cloud) => sum + cloud?.totalCost, 0) || 0;
    const totalSavings = parseFloat(recentSavings?._sum?.savingsAmount?.toString() || '0');
    const totalIdleSavings = parseFloat(idleResources?._sum?.potentialSavings?.toString() || '0');
    const totalRecommendations = recommendations?.reduce((sum, rec) => sum + rec?._count, 0) || 0;
    const potentialRecommendationSavings = recommendations?.reduce((sum, rec) => {
      return sum + parseFloat(rec?._sum?.potentialSaving?.toString() || '0');
    }, 0) || 0;

    return NextResponse.json({
      summary: {
        totalCost: totalCost.toFixed(2),
        totalSavings: totalSavings.toFixed(2),
        savingsPercent: totalCost > 0 ? ((totalSavings / totalCost) * 100).toFixed(1) : '0',
        idleResourcesCount: idleResources?._count || 0,
        potentialIdleSavings: totalIdleSavings.toFixed(2),
        recommendationsCount: totalRecommendations,
        potentialRecommendationSavings: potentialRecommendationSavings.toFixed(2),
        forecastAccuracy: forecastAccuracy.toFixed(1)
      },
      cloudData: cloudData || [],
      trendData: trendData || [],
      topServices: serviceData?.filter(s => s?.serviceId) || [],
      recommendations: {
        byPriority: recommendations?.filter(r => r?.priority)?.map(r => ({
          priority: r?.priority,
          status: r?.status,
          count: r?._count,
          potentialSaving: parseFloat(r?._sum?.potentialSaving?.toString() || '0')
        })) || [],
        total: totalRecommendations
      },
      period: {
        from: dateFrom?.toISOString(),
        to: dateTo?.toISOString()
      }
    });

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
