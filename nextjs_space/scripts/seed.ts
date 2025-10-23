
import { PrismaClient } from '@prisma/client';
import { addDays, subDays, subMonths, startOfMonth, endOfMonth, format } from 'date-fns';

const prisma = new PrismaClient();

// Helper functions
const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const randomInt = (min: number, max: number): number => {
  return Math.floor(randomBetween(min, max));
};

const randomFromArray = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const generateDates = (startDate: Date, days: number): Date[] => {
  const dates: Date[] = [];
  for (let i = 0; i < days; i++) {
    dates.push(addDays(startDate, i));
  }
  return dates;
};

// Cloud configurations
const cloudConfigs = [
  {
    name: 'aws',
    displayName: 'Amazon Web Services',
    color: '#FF9900',
    icon: 'aws-icon',
    services: [
      { name: 'ec2', displayName: 'EC2 Compute', category: 'compute', icon: 'server' },
      { name: 'rds', displayName: 'RDS Database', category: 'database', icon: 'database' },
      { name: 's3', displayName: 'S3 Storage', category: 'storage', icon: 'hard-drive' },
      { name: 'lambda', displayName: 'Lambda Functions', category: 'compute', icon: 'zap' },
      { name: 'elb', displayName: 'Elastic Load Balancer', category: 'network', icon: 'activity' },
      { name: 'cloudwatch', displayName: 'CloudWatch', category: 'monitoring', icon: 'eye' },
      { name: 'vpn', displayName: 'VPN Gateway', category: 'network', icon: 'shield' },
      { name: 'cloudfront', displayName: 'CloudFront CDN', category: 'network', icon: 'globe' }
    ],
    regions: ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1', 'sa-east-1']
  },
  {
    name: 'azure',
    displayName: 'Microsoft Azure',
    color: '#0078D4',
    icon: 'azure-icon',
    services: [
      { name: 'vm', displayName: 'Virtual Machines', category: 'compute', icon: 'server' },
      { name: 'sql', displayName: 'SQL Database', category: 'database', icon: 'database' },
      { name: 'storage', displayName: 'Blob Storage', category: 'storage', icon: 'hard-drive' },
      { name: 'functions', displayName: 'Azure Functions', category: 'compute', icon: 'zap' },
      { name: 'loadbalancer', displayName: 'Load Balancer', category: 'network', icon: 'activity' },
      { name: 'monitor', displayName: 'Azure Monitor', category: 'monitoring', icon: 'eye' },
      { name: 'application-gateway', displayName: 'Application Gateway', category: 'network', icon: 'shield' },
      { name: 'cdn', displayName: 'Azure CDN', category: 'network', icon: 'globe' }
    ],
    regions: ['East US', 'West Europe', 'Southeast Asia', 'Australia East', 'Brazil South']
  },
  {
    name: 'gcp',
    displayName: 'Google Cloud Platform',
    color: '#4285F4',
    icon: 'gcp-icon',
    services: [
      { name: 'compute', displayName: 'Compute Engine', category: 'compute', icon: 'server' },
      { name: 'sql', displayName: 'Cloud SQL', category: 'database', icon: 'database' },
      { name: 'storage', displayName: 'Cloud Storage', category: 'storage', icon: 'hard-drive' },
      { name: 'functions', displayName: 'Cloud Functions', category: 'compute', icon: 'zap' },
      { name: 'loadbalancer', displayName: 'Load Balancer', category: 'network', icon: 'activity' },
      { name: 'monitoring', displayName: 'Cloud Monitoring', category: 'monitoring', icon: 'eye' },
      { name: 'armor', displayName: 'Cloud Armor', category: 'network', icon: 'shield' },
      { name: 'cdn', displayName: 'Cloud CDN', category: 'network', icon: 'globe' }
    ],
    regions: ['us-central1', 'europe-west1', 'asia-southeast1', 'australia-southeast1', 'southamerica-east1']
  }
];

const instanceSizes = {
  aws: ['t3.nano', 't3.micro', 't3.small', 't3.medium', 't3.large', 't3.xlarge', 'm5.large', 'm5.xlarge', 'm5.2xlarge', 'c5.large', 'c5.xlarge', 'r5.large'],
  azure: ['Standard_B1ls', 'Standard_B1s', 'Standard_B2s', 'Standard_D2s_v3', 'Standard_D4s_v3', 'Standard_E2s_v3', 'Standard_F2s_v2'],
  gcp: ['e2-nano', 'e2-micro', 'e2-small', 'e2-medium', 'e2-standard-2', 'e2-standard-4', 'n2-standard-2', 'n2-standard-4']
};

const accountIds = {
  aws: ['123456789012', '123456789013', '123456789014', '123456789015'],
  azure: ['sub-abc123de-4567', 'sub-def456gh-7890', 'sub-ghi789jk-1234'],
  gcp: ['project-alpha-123', 'project-beta-456', 'project-gamma-789']
};

const resourceNames = [
  'web-server-prod', 'api-gateway-prod', 'database-primary', 'cache-redis-prod', 'worker-queue',
  'ml-training-gpu', 'backup-storage', 'log-aggregator', 'monitoring-stack', 'data-warehouse',
  'web-server-staging', 'api-test-env', 'dev-database', 'temp-analysis', 'old-backup-vol'
];

async function main() {
  console.log('🚀 Starting FinOps data seeding...');

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.savings.deleteMany();
  await prisma.forecast.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.cost.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.cloudService.deleteMany();
  await prisma.cloudProvider.deleteMany();

  // Create cloud providers and services
  console.log('☁️ Creating cloud providers and services...');
  const cloudProviders = [];
  const allServices = [];

  for (const config of cloudConfigs) {
    const cloud = await prisma.cloudProvider.create({
      data: {
        name: config.name,
        displayName: config.displayName,
        color: config.color,
        icon: config.icon,
        active: true
      }
    });
    cloudProviders.push({ ...cloud, config });

    for (const serviceConfig of config.services) {
      const service = await prisma.cloudService.create({
        data: {
          cloudId: cloud.id,
          name: serviceConfig.name,
          displayName: serviceConfig.displayName,
          category: serviceConfig.category,
          icon: serviceConfig.icon,
          active: true
        }
      });
      allServices.push({ ...service, cloudName: config.name, regions: config.regions });
    }
  }

  // Generate historical cost data (15 months)
  console.log('💰 Generating historical cost data...');
  const startDate = subMonths(new Date(), 15);
  const endDate = new Date();
  const allDates = generateDates(startDate, 450); // ~15 months of daily data

  let costRecords = 0;
  for (const service of allServices) {
    const cloudConfig = cloudConfigs.find(c => c.name === service.cloudName);
    if (!cloudConfig) continue;

    // Generate costs with seasonal patterns and growth trends
    let baseCost = randomBetween(100, 5000);
    const growthRate = randomBetween(0.002, 0.008); // 0.2% to 0.8% daily growth
    const seasonalAmplitude = baseCost * 0.3;

    for (let i = 0; i < allDates.length; i++) {
      const date = allDates[i];
      const dayOfYear = date.getTime() / (1000 * 60 * 60 * 24);
      
      // Apply growth trend
      const trendCost = baseCost * (1 + growthRate * i);
      
      // Apply seasonal variation
      const seasonalFactor = Math.sin((dayOfYear / 365) * 2 * Math.PI) * seasonalAmplitude;
      
      // Add daily randomness
      const randomFactor = randomBetween(0.8, 1.2);
      
      const finalCost = Math.max(0, (trendCost + seasonalFactor) * randomFactor);

      // Create costs for multiple regions/accounts
      const numRegions = randomInt(1, Math.min(4, cloudConfig.regions.length));
      for (let r = 0; r < numRegions; r++) {
        const region = cloudConfig.regions[r];
        const accountId = randomFromArray(accountIds[service.cloudName as keyof typeof accountIds]);
        
        await prisma.cost.create({
          data: {
            cloudId: service.cloudId,
            serviceId: service.id,
            region,
            date,
            costUSD: parseFloat((finalCost / numRegions).toFixed(2)),
            usageHours: randomBetween(1, 744),
            usageUnit: service.category === 'storage' ? 'GB' : 'hours',
            accountId,
            projectId: service.cloudName === 'gcp' ? accountId : undefined,
            tags: {
              environment: randomFromArray(['production', 'staging', 'development']),
              team: randomFromArray(['backend', 'frontend', 'devops', 'ml']),
              costCenter: randomFromArray(['engineering', 'marketing', 'sales'])
            }
          }
        });
        costRecords++;
      }
    }
  }
  console.log(`✅ Created ${costRecords} cost records`);

  // Create resources with different utilization patterns
  console.log('🖥️ Creating resources...');
  let resourceCount = 0;
  
  for (const service of allServices) {
    const cloudConfig = cloudConfigs.find(c => c.name === service.cloudName);
    if (!cloudConfig) continue;

    const numResources = service.category === 'compute' ? randomInt(5, 15) : randomInt(2, 8);
    
    for (let i = 0; i < numResources; i++) {
      const region = randomFromArray(cloudConfig.regions);
      const accountId = randomFromArray(accountIds[service.cloudName as keyof typeof accountIds]);
      const resourceName = randomFromArray(resourceNames);
      
      // Create different utilization patterns
      const utilizationPattern = randomFromArray(['high', 'medium', 'low', 'idle']);
      let cpuUtil, memUtil, networkUtil, isIdle;
      
      switch (utilizationPattern) {
        case 'high':
          cpuUtil = randomBetween(70, 95);
          memUtil = randomBetween(65, 90);
          networkUtil = randomBetween(40, 80);
          isIdle = false;
          break;
        case 'medium':
          cpuUtil = randomBetween(30, 60);
          memUtil = randomBetween(35, 65);
          networkUtil = randomBetween(20, 50);
          isIdle = false;
          break;
        case 'low':
          cpuUtil = randomBetween(5, 25);
          memUtil = randomBetween(10, 30);
          networkUtil = randomBetween(1, 15);
          isIdle = false;
          break;
        default: // idle
          cpuUtil = randomBetween(0, 5);
          memUtil = randomBetween(0, 10);
          networkUtil = randomBetween(0, 2);
          isIdle = true;
      }

      const sizeCurrent = service.category === 'compute' ? 
        randomFromArray(instanceSizes[service.cloudName as keyof typeof instanceSizes]) : 
        undefined;
      
      const monthlyCost = randomBetween(50, 2000);
      const potentialSavings = isIdle ? monthlyCost * 0.9 : 
        (utilizationPattern === 'low' ? monthlyCost * randomBetween(0.3, 0.6) : 
         monthlyCost * randomBetween(0.1, 0.3));

      await prisma.resource.create({
        data: {
          cloudId: service.cloudId,
          serviceId: service.id,
          name: `${resourceName}-${i + 1}`,
          resourceType: service.category === 'compute' ? 'instance' : 
                       service.category === 'storage' ? 'volume' : 
                       service.category === 'database' ? 'database' : 'resource',
          region,
          accountId,
          projectId: service.cloudName === 'gcp' ? accountId : undefined,
          status: isIdle ? 'idle' : randomFromArray(['running', 'stopped']),
          sizeCurrent,
          sizeRecommended: utilizationPattern === 'low' && sizeCurrent ? 
            randomFromArray(instanceSizes[service.cloudName as keyof typeof instanceSizes].slice(0, -2)) : 
            undefined,
          utilizationCPU: parseFloat(cpuUtil.toFixed(2)),
          utilizationMemory: parseFloat(memUtil.toFixed(2)),
          utilizationNetwork: parseFloat(networkUtil.toFixed(2)),
          monthlyCostCurrent: parseFloat(monthlyCost.toFixed(2)),
          monthlyCostOptimized: parseFloat((monthlyCost - potentialSavings).toFixed(2)),
          potentialSavings: parseFloat(potentialSavings.toFixed(2)),
          lastSeen: subDays(new Date(), randomInt(0, 7)),
          isIdle,
          tags: {
            environment: randomFromArray(['production', 'staging', 'development']),
            owner: randomFromArray(['team-alpha', 'team-beta', 'team-gamma']),
            purpose: randomFromArray(['web', 'api', 'database', 'cache', 'queue'])
          }
        }
      });
      resourceCount++;
    }
  }
  console.log(`✅ Created ${resourceCount} resources`);

  // Create recommendations
  console.log('💡 Creating optimization recommendations...');
  const recommendationTypes = [
    {
      type: 'rightsizing',
      priority: 'high',
      title: 'Right-size underutilized instances',
      category: 'cost_optimization',
      effort: 'easy',
      impact: 'high',
      riskLevel: 'low',
      timeframe: '1-week'
    },
    {
      type: 'reserved_instances',
      priority: 'medium',
      title: 'Purchase Reserved Instances for stable workloads',
      category: 'cost_optimization',
      effort: 'medium',
      impact: 'medium',
      riskLevel: 'low',
      timeframe: '1-month'
    },
    {
      type: 'terminate_idle',
      priority: 'high',
      title: 'Terminate idle resources',
      category: 'cost_optimization',
      effort: 'easy',
      impact: 'high',
      riskLevel: 'medium',
      timeframe: 'immediate'
    },
    {
      type: 'savings_plans',
      priority: 'medium',
      title: 'Commit to Savings Plans for compute',
      category: 'cost_optimization',
      effort: 'medium',
      impact: 'medium',
      riskLevel: 'low',
      timeframe: '1-month'
    }
  ];

  let recCount = 0;
  for (const cloud of cloudProviders) {
    for (const recType of recommendationTypes) {
      const numRecs = randomInt(3, 8);
      
      for (let i = 0; i < numRecs; i++) {
        const currentCost = randomBetween(100, 3000);
        const savingPercent = randomBetween(15, 65);
        const potentialSaving = currentCost * (savingPercent / 100);
        
        await prisma.recommendation.create({
          data: {
            cloudId: cloud.id,
            serviceId: randomFromArray(allServices.filter(s => s.cloudId === cloud.id)).id,
            type: recType.type,
            priority: recType.priority,
            title: recType.title,
            description: `Optimize ${recType.type.replace('_', ' ')} to reduce costs by ${savingPercent.toFixed(0)}%`,
            impact: recType.impact,
            effort: recType.effort,
            category: recType.category,
            currentCost: parseFloat(currentCost.toFixed(2)),
            potentialSaving: parseFloat(potentialSaving.toFixed(2)),
            savingPercent: parseFloat(savingPercent.toFixed(2)),
            implementationSteps: [
              'Analyze current usage patterns',
              'Identify optimization opportunities',
              'Plan implementation timeline',
              'Execute changes during maintenance window',
              'Monitor performance post-implementation'
            ],
            riskLevel: recType.riskLevel,
            timeframe: recType.timeframe,
            status: randomFromArray(['open', 'in_progress', 'implemented'])
          }
        });
        recCount++;
      }
    }
  }
  console.log(`✅ Created ${recCount} recommendations`);

  // Create forecasts
  console.log('📈 Creating cost forecasts...');
  let forecastCount = 0;
  const forecastDates = generateDates(new Date(), 90); // Next 90 days

  for (const service of allServices) {
    // Get recent costs to base forecast on
    const recentCosts = await prisma.cost.findMany({
      where: {
        serviceId: service.id,
        date: { gte: subMonths(new Date(), 3) }
      },
      orderBy: { date: 'desc' },
      take: 90
    });

    if (recentCosts.length === 0) continue;

    const avgRecentCost = recentCosts.reduce((sum, cost) => sum + parseFloat(cost.costUSD.toString()), 0) / recentCosts.length;
    const trendMultiplier = 1 + randomBetween(-0.05, 0.15); // -5% to +15% trend

    for (let i = 0; i < forecastDates.length; i++) {
      const date = forecastDates[i];
      const daysFuture = i + 1;
      
      // Apply trend and some randomness
      const trendedCost = avgRecentCost * Math.pow(trendMultiplier, daysFuture / 30);
      const forecastCost = trendedCost * randomBetween(0.8, 1.2);
      const confidence = Math.max(50, 95 - (daysFuture * 0.5)); // Decreasing confidence over time

      await prisma.forecast.create({
        data: {
          cloudId: service.cloudId,
          serviceId: service.id,
          region: randomFromArray(service.regions),
          forecastDate: date,
          predictedCost: parseFloat(forecastCost.toFixed(2)),
          confidence: parseFloat(confidence.toFixed(2)),
          method: randomFromArray(['linear', 'exponential', 'ml_model']),
          baselineDate: subDays(new Date(), 30),
          trends: {
            direction: trendMultiplier > 1 ? 'increasing' : 'decreasing',
            rate: ((trendMultiplier - 1) * 100).toFixed(2) + '%'
          }
        }
      });
      forecastCount++;
    }
  }
  console.log(`✅ Created ${forecastCount} forecasts`);

  // Create savings records
  console.log('💰 Creating savings records...');
  const savingsTypes = ['reserved_instances', 'savings_plans', 'spot_instances', 'rightsizing'];
  let savingsCount = 0;

  for (const cloud of cloudProviders) {
    for (const type of savingsTypes) {
      const numSavings = randomInt(2, 6);
      
      for (let i = 0; i < numSavings; i++) {
        const originalCost = randomBetween(500, 5000);
        const savingPercent = randomBetween(20, 60);
        const savingsAmount = originalCost * (savingPercent / 100);
        const optimizedCost = originalCost - savingsAmount;
        
        const startDate = subMonths(new Date(), randomInt(1, 12));
        const endDate = type.includes('reserved') || type.includes('savings') ? 
          addDays(startDate, 365) : // 1 year commitment
          addDays(startDate, randomInt(30, 180)); // Shorter term for others

        await prisma.savings.create({
          data: {
            cloudId: cloud.id,
            type,
            category: randomFromArray(['compute', 'storage', 'database']),
            description: `${type.replace('_', ' ')} optimization implemented`,
            originalCost: parseFloat(originalCost.toFixed(2)),
            optimizedCost: parseFloat(optimizedCost.toFixed(2)),
            savingsAmount: parseFloat(savingsAmount.toFixed(2)),
            savingsPercent: parseFloat(savingPercent.toFixed(2)),
            period: 'monthly',
            startDate,
            endDate,
            status: endDate > new Date() ? 'active' : 'expired'
          }
        });
        savingsCount++;
      }
    }
  }
  console.log(`✅ Created ${savingsCount} savings records`);

  console.log('🎉 FinOps data seeding completed successfully!');
  console.log(`
📊 Data Summary:
- Cloud Providers: ${cloudProviders.length}
- Services: ${allServices.length}
- Cost Records: ${costRecords}
- Resources: ${resourceCount}
- Recommendations: ${recCount}
- Forecasts: ${forecastCount}
- Savings: ${savingsCount}
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
