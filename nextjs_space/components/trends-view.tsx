
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { MetricCard } from './metric-card';
import { ChartWrapper } from './chart-wrapper';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  BarChart3,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

export function TrendsView() {
  const [loading, setLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [trendData, setTrendData] = useState<any[]>([]);

  // Generate mock trend data
  useEffect(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const data = months?.map((month, index) => ({
      month,
      aws: 3000 + (index * 200) + Math.random() * 1000,
      azure: 2500 + (index * 150) + Math.random() * 800,
      gcp: 2000 + (index * 100) + Math.random() * 600,
      total: 7500 + (index * 450) + Math.random() * 1500
    }));
    setTrendData(data);
  }, []);
  
  const forecastData = [
    { month: 'Jan 2024', actual: 8500, forecast: 8200, confidence: 95 },
    { month: 'Feb 2024', actual: 9200, forecast: 9000, confidence: 92 },
    { month: 'Mar 2024', actual: 8800, forecast: 9300, confidence: 88 },
    { month: 'Abr 2024', actual: 9600, forecast: 9500, confidence: 94 },
    { month: 'Mai 2024', actual: null, forecast: 9800, confidence: 85 },
    { month: 'Jun 2024', actual: null, forecast: 10200, confidence: 82 }
  ];

  const serviceGrowth = [
    { service: 'Compute', growth: 12.5, trend: 'up' },
    { service: 'Storage', growth: 8.3, trend: 'up' },
    { service: 'Database', growth: -3.2, trend: 'down' },
    { service: 'Network', growth: 15.7, trend: 'up' },
    { service: 'AI/ML', growth: 45.2, trend: 'up' },
    { service: 'Analytics', growth: 22.1, trend: 'up' }
  ];

  const regionData = [
    { region: 'us-east-1', cost: 3500, growth: 8.2 },
    { region: 'eu-west-1', cost: 2800, growth: 12.1 },
    { region: 'ap-southeast-1', cost: 2200, growth: 15.3 },
    { region: 'us-west-2', cost: 1900, growth: 5.7 },
    { region: 'sa-east-1', cost: 800, growth: 22.4 }
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

  const currentMonth = trendData[trendData?.length - 1] || { total: 0 };
  const previousMonth = trendData[trendData?.length - 2] || { total: 1 };
  const monthlyChange = previousMonth?.total ? ((currentMonth?.total - previousMonth?.total) / previousMonth?.total * 100) : 0;
  
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
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Análise de Tendências
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Acompanhe a evolução temporal dos seus custos cloud
              </p>
            </div>
          </div>
        </motion.div>

        {/* Period Selector */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-slate-500" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Período:
            </span>
            <Button 
              variant={selectedPeriod === '3months' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('3months')}
            >
              3 meses
            </Button>
            <Button 
              variant={selectedPeriod === '6months' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('6months')}
            >
              6 meses
            </Button>
            <Button 
              variant={selectedPeriod === '1year' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod('1year')}
            >
              1 ano
            </Button>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <MetricCard
            title="Custo Atual"
            value={`$${currentMonth?.total?.toLocaleString() || '0'}`}
            change={`${monthlyChange > 0 ? '+' : ''}${monthlyChange?.toFixed(1)}% vs mês anterior`}
            changeType={monthlyChange > 0 ? 'negative' : 'positive'}
            icon={BarChart3}
            loading={loading}
          />
          
          <MetricCard
            title="Tendência Geral"
            value={monthlyChange > 0 ? 'Crescimento' : 'Redução'}
            change={`${Math.abs(monthlyChange)?.toFixed(1)}% mensal`}
            changeType={monthlyChange > 0 ? 'negative' : 'positive'}
            icon={monthlyChange > 0 ? TrendingUp : TrendingDown}
            loading={loading}
          />
          
          <MetricCard
            title="Previsão Próximo Mês"
            value="$10,200"
            change="Confiança: 82%"
            changeType="neutral"
            icon={Activity}
            badge={{
              text: 'Forecast',
              variant: 'secondary'
            }}
            loading={loading}
          />
          
          <MetricCard
            title="Maior Crescimento"
            value="AI/ML (+45%)"
            change="Categoria em expansão"
            changeType="negative"
            icon={TrendingUp}
            loading={loading}
          />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Historical Trends */}
          <motion.div variants={itemVariants}>
            <ChartWrapper
              title="Evolução Histórica por Cloud"
              description="Tendência de custos nos últimos 12 meses"
              loading={loading}
            >
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={trendData} margin={{ bottom: 20 }}>
                  <XAxis 
                    dataKey="month"
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
                  <Legend 
                    verticalAlign="top"
                    wrapperStyle={{ fontSize: 11, paddingBottom: '10px' }}
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

          {/* Forecast Accuracy */}
          <motion.div variants={itemVariants}>
            <ChartWrapper
              title="Precisão das Previsões"
              description="Real vs Previsto nos últimos 6 meses"
              loading={loading}
            >
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={forecastData} margin={{ bottom: 40 }}>
                  <XAxis 
                    dataKey="month"
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
                    formatter={(value: any) => [`$${value?.toLocaleString()}`, 'Valor']}
                  />
                  <Legend 
                    verticalAlign="top"
                    wrapperStyle={{ fontSize: 11 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#10B981"
                    strokeWidth={3}
                    name="Real"
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecast"
                    stroke="#6B7280"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    name="Previsto"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </motion.div>

          {/* Service Growth */}
          <motion.div variants={itemVariants}>
            <ChartWrapper
              title="Crescimento por Serviço"
              description="Taxa de crescimento mensal por categoria"
              loading={loading}
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={serviceGrowth} layout="horizontal" margin={{ left: 70 }}>
                  <XAxis type="number" tick={{ fontSize: 10 }} tickLine={false} />
                  <YAxis 
                    type="category" 
                    dataKey="service" 
                    tick={{ fontSize: 10 }} 
                    tickLine={false}
                    width={60}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Crescimento']}
                  />
                  <Bar 
                    dataKey="growth" 
                    fill="#60B5FF"
                    radius={[0, 4, 4, 0]}
                  >
                    {serviceGrowth?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.growth > 0 ? '#10B981' : '#EF4444'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </motion.div>

          {/* Regional Distribution */}
          <motion.div variants={itemVariants}>
            <ChartWrapper
              title="Custos por Região"
              description="Distribuição geográfica dos gastos"
              loading={loading}
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={regionData} margin={{ bottom: 40 }}>
                  <XAxis 
                    dataKey="region"
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
        </div>

        {/* Growth Summary */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceGrowth?.map((service) => (
              <div 
                key={service?.service}
                className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {service?.service}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Crescimento mensal
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {service?.trend === 'up' ? 
                        <TrendingUp className="w-4 h-4 text-green-500" /> : 
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      }
                      <span className={`font-bold ${
                        service?.growth > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {service?.growth > 0 ? '+' : ''}{service?.growth}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
