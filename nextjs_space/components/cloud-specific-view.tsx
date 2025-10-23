
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { MetricCard } from './metric-card';
import { ChartWrapper } from './chart-wrapper';
import { 
  Server, 
  Database, 
  HardDrive, 
  Zap,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

interface CloudSpecificViewProps {
  cloudProvider: string;
}

const cloudConfig = {
  aws: {
    displayName: 'Amazon Web Services',
    color: '#FF9900',
    services: ['EC2', 'RDS', 'S3', 'Lambda']
  },
  azure: {
    displayName: 'Microsoft Azure',
    color: '#0078D4',
    services: ['Virtual Machines', 'SQL Database', 'Blob Storage', 'Functions']
  },
  gcp: {
    displayName: 'Google Cloud Platform',
    color: '#4285F4',
    services: ['Compute Engine', 'Cloud SQL', 'Cloud Storage', 'Cloud Functions']
  }
};

export function CloudSpecificView({ cloudProvider }: CloudSpecificViewProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const config = cloudConfig[cloudProvider as keyof typeof cloudConfig];

  useEffect(() => {
    fetchCloudData();
  }, [cloudProvider]);

  const fetchCloudData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard?clouds=${cloudProvider}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching cloud data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Generate mock service breakdown data
  const serviceBreakdown = config?.services?.map((service, index) => ({
    name: service,
    cost: Math.random() * 5000 + 1000,
    growth: (Math.random() - 0.5) * 40
  }));

  // Generate mock regional data
  const regionalData = [
    { region: 'us-east-1', cost: Math.random() * 3000 + 1000 },
    { region: 'us-west-2', cost: Math.random() * 2500 + 800 },
    { region: 'eu-west-1', cost: Math.random() * 2000 + 600 },
    { region: 'ap-southeast-1', cost: Math.random() * 1500 + 400 }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const totalCost = data?.cloudData?.[0]?.totalCost || 0;

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${config?.color}20`, color: config?.color }}
            >
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                {config?.displayName}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Análise detalhada de custos e utilização
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <MetricCard
            title="Custo Total"
            value={`$${totalCost?.toLocaleString() || '0'}`}
            change="+8.2% vs mês anterior"
            changeType="negative"
            icon={DollarSign}
            loading={loading}
          />
          
          <MetricCard
            title="Recursos Ativos"
            value={data?.cloudData?.[0]?.resourceCount?.toString() || '0'}
            change="12 novos este mês"
            changeType="neutral"
            icon={Server}
            loading={loading}
          />
          
          <MetricCard
            title="Economia Potencial"
            value="$2,340"
            change="15% do custo total"
            changeType="positive"
            icon={TrendingUp}
            loading={loading}
          />
          
          <MetricCard
            title="Recomendações"
            value={data?.cloudData?.[0]?.recommendationCount?.toString() || '0'}
            change="3 críticas"
            changeType="negative"
            icon={Database}
            loading={loading}
          />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Service Breakdown */}
          <motion.div variants={itemVariants}>
            <ChartWrapper
              title="Custos por Serviço"
              description="Distribuição de custos entre os principais serviços"
              loading={loading}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={serviceBreakdown}>
                  <XAxis 
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    label={{ 
                      value: 'Custo (USD)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fontSize: 11 }
                    }}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`$${value?.toLocaleString()}`, 'Custo']}
                  />
                  <Bar 
                    dataKey="cost" 
                    fill={config?.color}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </motion.div>

          {/* Regional Distribution */}
          <motion.div variants={itemVariants}>
            <ChartWrapper
              title="Distribuição Regional"
              description="Custos por região geográfica"
              loading={loading}
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={regionalData}>
                  <XAxis 
                    dataKey="region"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    label={{ 
                      value: 'Custo (USD)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fontSize: 11 }
                    }}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`$${value?.toLocaleString()}`, 'Custo']}
                  />
                  <Area
                    type="monotone"
                    dataKey="cost"
                    stroke={config?.color}
                    fill={config?.color}
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </motion.div>
        </div>

        {/* Service Growth Trends */}
        <motion.div variants={itemVariants}>
          <ChartWrapper
            title="Crescimento dos Serviços"
            description="Taxa de crescimento mensal por serviço"
            loading={loading}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={serviceBreakdown} layout="horizontal">
                <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tick={{ fontSize: 10 }} 
                  tickLine={false}
                  width={80}
                />
                <Tooltip 
                  formatter={(value: any) => [`${value?.toFixed(1)}%`, 'Crescimento']}
                />
                <Bar 
                  dataKey="growth" 
                  fill="#60B5FF"
                  radius={[0, 4, 4, 0]}
                >
                  {serviceBreakdown?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.growth > 0 ? '#10B981' : '#EF4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
