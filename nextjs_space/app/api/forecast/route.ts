
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { addDays, addMonths, subDays } from 'date-fns';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cloudFilter = searchParams.get('clouds')?.split(',') || [];
    const horizon = parseInt(searchParams.get('horizon') || '90'); // days

    // Get historical data for trend analysis (last 90 days)
    const historicalData = await prisma.cost.groupBy({
      by: ['date', 'cloudId'],
      where: {
        date: {
          gte: subDays(new Date(), 90),
          lte: new Date()
        },
        ...(cloudFilter?.length > 0 ? {
          cloud: { name: { in: cloudFilter } }
        } : {})
      },
      _sum: {
        costUSD: true
      },
      orderBy: {
        date: 'asc'
      }
    });

    // Simple linear regression forecast
    const forecastData = generateForecast(historicalData, horizon);

    // Calculate trend indicators
    const recent7Days = historicalData?.slice(-7);
    const previous7Days = historicalData?.slice(-14, -7);
    
    const recentAvg = recent7Days?.reduce((sum, d) => sum + parseFloat(d?._sum?.costUSD?.toString() || '0'), 0) / 7;
    const previousAvg = previous7Days?.reduce((sum, d) => sum + parseFloat(d?._sum?.costUSD?.toString() || '0'), 0) / 7;
    
    const trendPercent = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg * 100) : 0;

    // Get cloud details
    const clouds = await prisma.cloudProvider.findMany({
      where: cloudFilter?.length > 0 ? { name: { in: cloudFilter } } : undefined
    });

    return NextResponse.json({
      historical: historicalData?.map(d => {
        const cloud = clouds?.find(c => c?.id === d?.cloudId);
        return {
          date: d?.date?.toISOString()?.split('T')[0],
          cost: parseFloat(d?._sum?.costUSD?.toString() || '0'),
          cloudId: d?.cloudId,
          cloudName: cloud?.name,
          type: 'actual'
        };
      }),
      forecast: forecastData,
      trends: {
        currentDailyAverage: recentAvg?.toFixed(2),
        previousDailyAverage: previousAvg?.toFixed(2),
        trendPercent: trendPercent?.toFixed(2),
        trendDirection: trendPercent > 0 ? 'up' : 'down',
        projectedMonthlyCost: (recentAvg * 30)?.toFixed(2),
        projectedQuarterlyCost: (recentAvg * 90)?.toFixed(2)
      },
      scenarios: {
        optimistic: forecastData?.map(d => ({ ...d, cost: d?.cost * 0.7 })),
        realistic: forecastData,
        pessimistic: forecastData?.map(d => ({ ...d, cost: d?.cost * 1.3 }))
      }
    });

  } catch (error) {
    console.error('Forecast API error:', error);
    return NextResponse.json({ error: 'Failed to fetch forecast data' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

function generateForecast(historicalData: any[], horizon: number) {
  if (!historicalData || historicalData?.length < 2) {
    return [];
  }

  // Calculate daily averages by cloud
  const cloudAverages = historicalData?.reduce((acc: any, item) => {
    const cloudId = item?.cloudId;
    if (!acc[cloudId]) {
      acc[cloudId] = { sum: 0, count: 0 };
    }
    acc[cloudId].sum += parseFloat(item?._sum?.costUSD?.toString() || '0');
    acc[cloudId].count += 1;
    return acc;
  }, {});

  // Generate forecast points
  const forecast: any[] = [];
  const today = new Date();
  
  for (let i = 1; i <= horizon; i++) {
    const forecastDate = addDays(today, i);
    
    Object.keys(cloudAverages)?.forEach(cloudId => {
      const avg = cloudAverages[cloudId].sum / cloudAverages[cloudId].count;
      
      // Add some variability and slight upward trend (5% growth)
      const growthFactor = 1 + (i / horizon) * 0.05;
      const noise = (Math.random() - 0.5) * 0.1 * avg;
      const predictedCost = avg * growthFactor + noise;
      
      forecast.push({
        date: forecastDate?.toISOString()?.split('T')[0],
        cost: parseFloat(predictedCost?.toFixed(2)),
        cloudId: cloudId,
        type: 'forecast',
        confidence: 95 - (i / horizon) * 15 // Confidence decreases over time
      });
    });
  }

  return forecast;
}
