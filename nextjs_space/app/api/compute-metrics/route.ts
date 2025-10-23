
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cloudFilter = searchParams.get('clouds')?.split(',') || [];

    // Get compute resources (EC2, VMs, Compute Engine)
    const computeResources = await prisma.resource.findMany({
      where: {
        resourceType: {
          in: ['instance', 'vm', 'compute']
        },
        ...(cloudFilter?.length > 0 ? {
          cloud: { name: { in: cloudFilter } }
        } : {})
      },
      include: {
        cloud: true,
        service: true
      }
    });

    // Calculate aggregate metrics
    const totalResources = computeResources?.length;
    const utilizationAvgs = {
      cpu: computeResources?.reduce((sum, r) => sum + parseFloat(r?.utilizationCPU?.toString() || '0'), 0) / totalResources || 0,
      memory: computeResources?.reduce((sum, r) => sum + parseFloat(r?.utilizationMemory?.toString() || '0'), 0) / totalResources || 0,
      network: computeResources?.reduce((sum, r) => sum + parseFloat(r?.utilizationNetwork?.toString() || '0'), 0) / totalResources || 0
    };

    // Categorize by utilization
    const underutilized = computeResources?.filter(r => 
      parseFloat(r?.utilizationCPU?.toString() || '0') < 20
    );
    const rightSized = computeResources?.filter(r => {
      const cpu = parseFloat(r?.utilizationCPU?.toString() || '0');
      return cpu >= 20 && cpu <= 70;
    });
    const overutilized = computeResources?.filter(r => 
      parseFloat(r?.utilizationCPU?.toString() || '0') > 70
    );

    // Calculate costs and savings
    const totalCurrentCost = computeResources?.reduce((sum, r) => 
      sum + parseFloat(r?.monthlyCostCurrent?.toString() || '0'), 0
    );
    const totalOptimizedCost = computeResources?.reduce((sum, r) => 
      sum + parseFloat(r?.monthlyCostOptimized?.toString() || '0'), 0
    );
    const totalSavings = computeResources?.reduce((sum, r) => 
      sum + parseFloat(r?.potentialSavings?.toString() || '0'), 0
    );

    // Instance type distribution
    const instanceTypeDistribution = computeResources?.reduce((acc: any, r) => {
      const type = r?.sizeCurrent || 'unknown';
      if (!acc[type]) {
        acc[type] = { count: 0, cost: 0 };
      }
      acc[type].count += 1;
      acc[type].cost += parseFloat(r?.monthlyCostCurrent?.toString() || '0');
      return acc;
    }, {});

    // Performance metrics by cloud
    const performanceByCloud = computeResources?.reduce((acc: any, r) => {
      const cloudName = r?.cloud?.name;
      if (!acc[cloudName]) {
        acc[cloudName] = {
          count: 0,
          avgCPU: 0,
          avgMemory: 0,
          avgNetwork: 0,
          totalCost: 0
        };
      }
      acc[cloudName].count += 1;
      acc[cloudName].avgCPU += parseFloat(r?.utilizationCPU?.toString() || '0');
      acc[cloudName].avgMemory += parseFloat(r?.utilizationMemory?.toString() || '0');
      acc[cloudName].avgNetwork += parseFloat(r?.utilizationNetwork?.toString() || '0');
      acc[cloudName].totalCost += parseFloat(r?.monthlyCostCurrent?.toString() || '0');
      return acc;
    }, {});

    // Normalize averages
    Object.keys(performanceByCloud)?.forEach(cloud => {
      const data = performanceByCloud[cloud];
      data.avgCPU = (data.avgCPU / data.count)?.toFixed(2);
      data.avgMemory = (data.avgMemory / data.count)?.toFixed(2);
      data.avgNetwork = (data.avgNetwork / data.count)?.toFixed(2);
      data.totalCost = data.totalCost?.toFixed(2);
    });

    return NextResponse.json({
      summary: {
        totalResources,
        totalCurrentCost: totalCurrentCost?.toFixed(2),
        totalOptimizedCost: totalOptimizedCost?.toFixed(2),
        totalSavings: totalSavings?.toFixed(2),
        savingsPercent: totalCurrentCost > 0 ? ((totalSavings / totalCurrentCost) * 100)?.toFixed(1) : '0',
        avgUtilization: {
          cpu: utilizationAvgs?.cpu?.toFixed(2),
          memory: utilizationAvgs?.memory?.toFixed(2),
          network: utilizationAvgs?.network?.toFixed(2)
        }
      },
      categories: {
        underutilized: {
          count: underutilized?.length,
          potentialSavings: underutilized?.reduce((sum, r) => 
            sum + parseFloat(r?.potentialSavings?.toString() || '0'), 0
          )?.toFixed(2)
        },
        rightSized: {
          count: rightSized?.length
        },
        overutilized: {
          count: overutilized?.length,
          needsUpgrade: overutilized?.filter(r => !r?.sizeRecommended)?.length
        }
      },
      instanceTypes: Object.entries(instanceTypeDistribution)?.map(([type, data]: [string, any]) => ({
        type,
        count: data?.count,
        cost: data?.cost?.toFixed(2)
      })),
      performanceByCloud,
      topWasters: computeResources
        ?.sort((a, b) => parseFloat(b?.potentialSavings?.toString() || '0') - parseFloat(a?.potentialSavings?.toString() || '0'))
        ?.slice(0, 10)
        ?.map(r => ({
          id: r?.id,
          name: r?.name,
          cloud: r?.cloud?.displayName,
          type: r?.sizeCurrent,
          utilizationCPU: parseFloat(r?.utilizationCPU?.toString() || '0'),
          utilizationMemory: parseFloat(r?.utilizationMemory?.toString() || '0'),
          currentCost: parseFloat(r?.monthlyCostCurrent?.toString() || '0'),
          potentialSaving: parseFloat(r?.potentialSavings?.toString() || '0'),
          recommendedSize: r?.sizeRecommended
        }))
    });

  } catch (error) {
    console.error('Compute Metrics API error:', error);
    return NextResponse.json({ error: 'Failed to fetch compute metrics' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
