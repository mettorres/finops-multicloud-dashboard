
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { MetricCard } from './metric-card';
import { ChartWrapper } from './chart-wrapper';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  Cloud,
  Users,
  Activity,
  PieChart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';

interface DashboardData {
  summary: {
    totalCost: string;
    totalSavings: string;
    savingsPercent: string;
    idleResourcesCount: number;
    potentialIdleSavings: string;
    recommendationsCount: number;
    potentialRecommendationSavings: string;
    forecastAccuracy: string;
  };
  cloudData: Array<{
    cloudId: string;
    cloudName: string;
    displayName: string;
    color: string;
    totalCost: number;
    resourceCount: number;
    recommendationCount: number;
  }>;
  trendData: Array<{
    date: string;
    cloudName: string;
    displayName: string;
    cost: number;
  }>;
  topServices: Array<{
    serviceName: string;
    displayName: string;
    category: string;
    cloudName: string;
    cloudDisplayName: string;
    totalCost: number;
  }>;
}

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3', '#72BF78', '#FF6363'];

export function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('3months');

  useEffect(() => {
    fetchDashboardData();
  }, [selectedPeriod]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Process trend data for charts
  const processedTrendData = data?.trendData ? 
    data?.trendData?.reduce((acc: any[], item) => {
      const existingDate = acc?.find(d => d?.date === item?.date);
      if (existingDate) {
        existingDate[item?.cloudName] = item?.cost;
      } else {
        acc?.push({
          date: new Date(item?.date)?.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          [item?.cloudName]: item?.cost
        });
      }
      return acc;
    }, []) : [];

  // Cloud distribution data
  const cloudDistribution = data?.cloudData?.map((cloud, index) => ({
    name: cloud?.displayName,
    value: cloud?.totalCost,
    color: COLORS[index % COLORS.length]
  })) || [];

  // Top services data
  const topServicesChart = data?.topServices?.slice(0, 8)?.map(service => ({
    name: service?.displayName,
    cost: service?.totalCost,
    cloud: service?.cloudDisplayName
  })) || [];

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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard Principal
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Visão consolidada multi-cloud de custos e otimizações
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <MetricCard
            title="Custo Total"
            value={`$${data?.summary?.totalCost || '0'}`}
            change="+12.3% vs mês anterior"
            changeType="negative"
            icon={DollarSign}
            loading={loading}
          />
          
          <MetricCard
            title="Savings Realizadas"
            value={`$${data?.summary?.totalSavings || '0'}`}
            change={`${data?.summary?.savingsPercent || '0'}% do total`}
            changeType="positive"
            icon={TrendingUp}
            badge={{
              text: 'Ativo',
              variant: 'default'
            }}
            loading={loading}
          />
          
          <MetricCard
            title="Recursos Ociosos"
            value={data?.summary?.idleResourcesCount?.toString() || '0'}
            change={`$${data?.summary?.potentialIdleSavings || '0'} economia potencial`}
            changeType="negative"
            icon={AlertTriangle}
            loading={loading}
          />
          
          <MetricCard
            title="Recomendações"
            value={data?.summary?.recommendationsCount?.toString() || '0'}
            change={`$${data?.summary?.potentialRecommendationSavings || '0'} potencial`}
            changeType="positive"
            icon={Target}
            badge={{
              text: 'Pendente',
              variant: 'secondary'
            }}
            loading={loading}
          />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost Trend Chart */}
          <motion.div variants={itemVariants}>
            <ChartWrapper
              title="Tendência de Custos (30 dias)"
              description="Evolução diária dos custos por cloud provider"
              loading={loading}
            >
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={processedTrendData}>
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    interval="preserveStartEnd"
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
                    labelFormatter={(label) => `Data: ${label}`}
                  />
                  <Legend 
                    verticalAlign="top"
                    wrapperStyle={{ fontSize: 11 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="aws"
                    stackId="1"
                    stroke="#FF9900"
                    fill="#FF9900"
                    fillOpacity={0.6}
                    name="AWS"
                  />
                  <Area
                    type="monotone"
                    dataKey="azure"
                    stackId="1"
                    stroke="#0078D4"
                    fill="#0078D4"
                    fillOpacity={0.6}
                    name="Azure"
                  />
                  <Area
                    type="monotone"
                    dataKey="gcp"
                    stackId="1"
                    stroke="#4285F4"
                    fill="#4285F4"
                    fillOpacity={0.6}
                    name="GCP"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </motion.div>

          {/* Cloud Distribution */}
          <motion.div variants={itemVariants}>
            <ChartWrapper
              title="Distribuição de Custos por Cloud"
              description="Participação de cada provedor no custo total"
              loading={loading}
            >
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Tooltip 
                    formatter={(value: any) => [`$${value?.toLocaleString()}`, 'Custo']}
                  />
                  <Legend 
                    verticalAlign="top"
                    wrapperStyle={{ fontSize: 11 }}
                  />
                  <Pie
                    dataKey="value"
                    data={cloudDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ percent }: any) => `${(percent * 100).toFixed(1)}%`}
                  >
                    {cloudDistribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </motion.div>

          {/* Top Services */}
          <motion.div variants={itemVariants}>
            <ChartWrapper
              title="Principais Serviços por Custo"
              description="Top 8 serviços com maior custo no período"
              loading={loading}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topServicesChart} margin={{ bottom: 60 }}>
                  <XAxis 
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={60}
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
                    labelFormatter={(label) => `Serviço: ${label}`}
                  />
                  <Bar 
                    dataKey="cost" 
                    fill="#60B5FF"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </motion.div>

          {/* Forecast Accuracy */}
          <motion.div variants={itemVariants}>
            <ChartWrapper
              title="Precisão de Previsões"
              description="Acurácia do modelo de forecast atual"
              loading={loading}
            >
              <div className="flex flex-col items-center justify-center h-[300px] space-y-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      className="text-slate-200 dark:text-slate-700"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-green-500"
                      strokeWidth="8"
                      strokeDasharray={`${parseFloat(data?.summary?.forecastAccuracy || '0') * 2.51}, 251`}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="40"
                      cx="50"
                      cy="50"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-900 dark:text-white">
                      {data?.summary?.forecastAccuracy || '0'}%
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    Precisão Atual
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Baseado nos últimos 30 dias
                  </p>
                </div>
              </div>
            </ChartWrapper>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Análise Rápida</h3>
                  <p className="text-blue-100 text-sm">Identifique oportunidades de economia</p>
                </div>
                <Activity className="w-8 h-8 text-blue-200" />
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Relatório FinOps</h3>
                  <p className="text-green-100 text-sm">Gere relatório executivo</p>
                </div>
                <PieChart className="w-8 h-8 text-green-200" />
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Configurar Alertas</h3>
                  <p className="text-purple-100 text-sm">Monitore custos em tempo real</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-purple-200" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
