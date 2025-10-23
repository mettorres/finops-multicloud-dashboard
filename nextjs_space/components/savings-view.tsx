
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { MetricCard } from './metric-card';
import { ChartWrapper } from './chart-wrapper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp,
  Target,
  Award,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

export function SavingsView() {
  const [loading, setLoading] = useState(false);

  // Mock savings data
  const savingsHistory = [
    { month: 'Jan', ri: 2500, spot: 800, rightsizing: 1200, total: 4500 },
    { month: 'Feb', ri: 2600, spot: 950, rightsizing: 1100, total: 4650 },
    { month: 'Mar', ri: 2700, spot: 1100, rightsizing: 1300, total: 5100 },
    { month: 'Abr', ri: 2800, spot: 1050, rightsizing: 1400, total: 5250 },
    { month: 'Mai', ri: 2900, spot: 1200, rightsizing: 1500, total: 5600 },
    { month: 'Jun', ri: 3000, spot: 1300, rightsizing: 1600, total: 5900 }
  ];

  const savingsByType = [
    { name: 'Reserved Instances', value: 18000, percentage: 45 },
    { name: 'Spot Instances', value: 7200, percentage: 18 },
    { name: 'Right-sizing', value: 8800, percentage: 22 },
    { name: 'Savings Plans', value: 6000, percentage: 15 }
  ];

  const savingsOpportunities = [
    {
      type: 'Reserved Instances',
      potential: 8400,
      current: 3000,
      progress: 36,
      timeframe: '12 meses',
      status: 'active',
      description: 'Compra de RIs para instâncias de produção estáveis'
    },
    {
      type: 'Compute Savings Plans',
      potential: 5200,
      current: 1200,
      progress: 23,
      timeframe: '24 meses',
      status: 'in-progress',
      description: 'Commitment para workloads de compute flexível'
    },
    {
      type: 'Storage Optimization',
      potential: 3600,
      current: 800,
      progress: 22,
      timeframe: '6 meses',
      status: 'planned',
      description: 'Migração para classes de storage mais econômicas'
    },
    {
      type: 'Right-sizing',
      potential: 4800,
      current: 1600,
      progress: 33,
      timeframe: '3 meses',
      status: 'active',
      description: 'Redimensionamento de recursos subutilizados'
    }
  ];

  const monthlyTargets = [
    { month: 'Jul', target: 6500, achieved: 6200 },
    { month: 'Ago', target: 7000, achieved: 6800 },
    { month: 'Set', target: 7500, achieved: null },
    { month: 'Out', target: 8000, achieved: null }
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

  const totalSavings = savingsByType?.reduce((sum, item) => sum + item?.value, 0);
  const currentMonth = savingsHistory[savingsHistory?.length - 1];

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
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Savings & Economias
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Acompanhe suas economias realizadas e oportunidades futuras
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <MetricCard
            title="Total Economizado"
            value={`$${totalSavings?.toLocaleString()}`}
            change="+18.2% vs ano anterior"
            changeType="positive"
            icon={DollarSign}
            loading={loading}
          />
          
          <MetricCard
            title="Economia Mensal"
            value={`$${currentMonth?.total?.toLocaleString()}`}
            change="+12.4% vs mês anterior"
            changeType="positive"
            icon={TrendingUp}
            badge={{
              text: 'Junho',
              variant: 'secondary'
            }}
            loading={loading}
          />
          
          <MetricCard
            title="Meta Anual"
            value="85%"
            change="$72k de $85k"
            changeType="positive"
            icon={Target}
            loading={loading}
          />
          
          <MetricCard
            title="ROI FinOps"
            value="420%"
            change="Investimento vs Economia"
            changeType="positive"
            icon={Award}
            badge={{
              text: 'Excelente',
              variant: 'default'
            }}
            loading={loading}
          />
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Savings Trend */}
          <motion.div variants={itemVariants}>
            <ChartWrapper
              title="Evolução das Economias"
              description="Histórico de savings por categoria nos últimos 6 meses"
              loading={loading}
            >
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={savingsHistory} margin={{ bottom: 20 }}>
                  <XAxis 
                    dataKey="month"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    label={{ 
                      value: 'Economia (USD)', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fontSize: 11 }
                    }}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`$${value?.toLocaleString()}`, 'Economia']}
                  />
                  <Legend 
                    verticalAlign="top"
                    wrapperStyle={{ fontSize: 11, paddingBottom: '10px' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ri"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.6}
                    name="Reserved Instances"
                  />
                  <Area
                    type="monotone"
                    dataKey="spot"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.6}
                    name="Spot Instances"
                  />
                  <Area
                    type="monotone"
                    dataKey="rightsizing"
                    stackId="1"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.6}
                    name="Right-sizing"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </motion.div>

          {/* Savings Distribution */}
          <motion.div variants={itemVariants}>
            <ChartWrapper
              title="Distribuição das Economias"
              description="Participação de cada estratégia no total economizado"
              loading={loading}
            >
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Tooltip 
                    formatter={(value: any) => [`$${value?.toLocaleString()}`, 'Economia']}
                  />
                  <Legend 
                    verticalAlign="top"
                    wrapperStyle={{ fontSize: 11 }}
                  />
                  <Pie
                    dataKey="value"
                    data={savingsByType}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percentage }: any) => `${name}: ${percentage}%`}
                    labelLine={false}
                  >
                    {savingsByType?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </motion.div>
        </div>

        {/* Savings Opportunities */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Oportunidades de Economia</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Potencial de savings ainda não realizado
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savingsOpportunities?.map((opportunity, index) => (
                  <div key={index} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {opportunity?.type}
                          </h4>
                          <Badge 
                            variant={
                              opportunity?.status === 'active' ? 'default' :
                              opportunity?.status === 'in-progress' ? 'secondary' : 'outline'
                            }
                          >
                            {opportunity?.status === 'active' ? 'Ativo' :
                             opportunity?.status === 'in-progress' ? 'Em andamento' : 'Planejado'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                          {opportunity?.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-slate-500 dark:text-slate-400">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            {opportunity?.timeframe}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ${opportunity?.potential?.toLocaleString()}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          potencial
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">
                          Progresso: ${opportunity?.current?.toLocaleString()} / ${opportunity?.potential?.toLocaleString()}
                        </span>
                        <span className="font-medium">{opportunity?.progress}%</span>
                      </div>
                      <Progress value={opportunity?.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Targets */}
        <motion.div variants={itemVariants}>
          <ChartWrapper
            title="Metas vs Realizações"
            description="Acompanhamento das metas mensais de economia"
            loading={loading}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTargets} margin={{ bottom: 20 }}>
                <XAxis 
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 10 }}
                  tickLine={false}
                  label={{ 
                    value: 'Economia (USD)', 
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
                <Bar 
                  dataKey="target" 
                  fill="#E5E7EB"
                  name="Meta"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="achieved" 
                  fill="#10B981"
                  name="Realizado"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
