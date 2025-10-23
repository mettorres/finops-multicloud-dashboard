
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cloudFilter = searchParams.get('clouds')?.split(',') || [];

    // Get storage costs (S3, Azure Blob, Cloud Storage)
    const storageCosts = await prisma.cost.findMany({
      where: {
        service: {
          category: 'storage'
        },
        ...(cloudFilter?.length > 0 ? {
          cloud: { name: { in: cloudFilter } }
        } : {})
      },
      include: {
        cloud: true,
        service: true
      },
      orderBy: {
        date: 'desc'
      }
    });

    // Group by storage class/tier (simulated from tags or usageUnit)
    const storageByClass = storageCosts?.reduce((acc: any, cost) => {
      const storageClass = cost?.usageUnit || 'Standard';
      if (!acc[storageClass]) {
        acc[storageClass] = {
          totalCost: 0,
          recordCount: 0
        };
      }
      acc[storageClass].totalCost += parseFloat(cost?.costUSD?.toString() || '0');
      acc[storageClass].recordCount += 1;
      return acc;
    }, {});

    // Calculate totals
    const totalStorageCost = storageCosts?.reduce((sum, c) => 
      sum + parseFloat(c?.costUSD?.toString() || '0'), 0
    );

    // Growth analysis (compare last 30 days vs previous 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentPeriod = storageCosts?.filter(c => new Date(c?.date) >= thirtyDaysAgo);
    const previousPeriod = storageCosts?.filter(c => 
      new Date(c?.date) >= sixtyDaysAgo && new Date(c?.date) < thirtyDaysAgo
    );

    const recentTotal = recentPeriod?.reduce((sum, c) => 
      sum + parseFloat(c?.costUSD?.toString() || '0'), 0
    );
    const previousTotal = previousPeriod?.reduce((sum, c) => 
      sum + parseFloat(c?.costUSD?.toString() || '0'), 0
    );

    const growthPercent = previousTotal > 0 ? 
      ((recentTotal - previousTotal) / previousTotal * 100) : 0;

    // Storage by cloud
    const storageByCloud = storageCosts?.reduce((acc: any, cost) => {
      const cloudName = cost?.cloud?.name;
      if (!acc[cloudName]) {
        acc[cloudName] = {
          displayName: cost?.cloud?.displayName,
          totalCost: 0,
          color: cost?.cloud?.color
        };
      }
      acc[cloudName].totalCost += parseFloat(cost?.costUSD?.toString() || '0');
      return acc;
    }, {});

    // Optimization opportunities
    const optimizationOpportunities = [
      {
        id: 'lifecycle-policies',
        title: 'Implementar Lifecycle Policies',
        description: 'Mover objetos antigos para classes de armazenamento mais baratas (IA, Glacier)',
        potentialSaving: (totalStorageCost * 0.30)?.toFixed(2),
        savingsPercent: 30,
        complexity: 'easy',
        impact: 'high'
      },
      {
        id: 'delete-old-snapshots',
        title: 'Remover Snapshots Antigos',
        description: 'Snapshots com mais de 90 dias podem ser removidos',
        potentialSaving: (totalStorageCost * 0.15)?.toFixed(2),
        savingsPercent: 15,
        complexity: 'easy',
        impact: 'medium'
      },
      {
        id: 'compress-data',
        title: 'Comprimir Dados',
        description: 'Comprimir objetos pode reduzir custos de armazenamento e transferência',
        potentialSaving: (totalStorageCost * 0.20)?.toFixed(2),
        savingsPercent: 20,
        complexity: 'medium',
        impact: 'medium'
      }
    ];

    return NextResponse.json({
      summary: {
        totalCost: totalStorageCost?.toFixed(2),
        growthPercent: growthPercent?.toFixed(2),
        growthTrend: growthPercent > 0 ? 'increasing' : 'decreasing',
        recentMonthlyCost: recentTotal?.toFixed(2),
        previousMonthlyCost: previousTotal?.toFixed(2)
      },
      storageByClass: Object.entries(storageByClass)?.map(([className, data]: [string, any]) => ({
        class: className,
        cost: data?.totalCost?.toFixed(2),
        percent: ((data?.totalCost / totalStorageCost) * 100)?.toFixed(1)
      })),
      storageByCloud: Object.entries(storageByCloud)?.map(([cloud, data]: [string, any]) => ({
        cloud,
        displayName: data?.displayName,
        cost: data?.totalCost?.toFixed(2),
        color: data?.color
      })),
      optimizations: optimizationOpportunities
    });

  } catch (error) {
    console.error('Storage Metrics API error:', error);
    return NextResponse.json({ error: 'Failed to fetch storage metrics' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
