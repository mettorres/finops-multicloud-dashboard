'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { MetricCard } from './metric-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  PieChart,
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
  PieChart as RechartsPie,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function ExecutiveDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [forecastData, setForecastData] = useState<any>(null);
  const [computeData, setComputeData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [dashboard, forecast, compute] = await Promise.all([
        fetch('/api/dashboard').then(r => r.json()),
        fetch('/api/forecast?horizon=90').then(r => r.json()),
        fetch('/api/compute-metrics').then(r => r.json())
      ]);
      
      setDashboardData(dashboard);
      setForecastData(forecast);
      setComputeData(compute);
    } catch (error) {
      console.error('Error fetching executive data:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Calculate key metrics
  const totalCost = parseFloat(dashboardData?.summary?.totalCost || '0');
  const totalSavings = parseFloat(dashboardData?.summary?.totalSavings || '0') +
                      parseFloat(dashboardData?.summary?.potentialIdleSavings || '0') +
                      parseFloat(dashboardData?.summary?.potentialRecommendationSavings || '0');
  const savingsPercent = totalCost > 0 ? ((totalSavings / totalCost) * 100) : 0;
  const efficiencyScore = Math.min(100, 100 - savingsPercent); // Simple efficiency calculation

  const projectedMonthlyCost = parseFloat(forecastData?.trends?.projectedMonthlyCost || totalCost);
  const trendPercent = parseFloat(forecastData?.trends?.trendPercent || '0');

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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Executive Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Visão estratégica consolidada para tomada de decisão
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics - C-Level Focus */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Custo Total Mensal"
            value={`$${totalCost.toLocaleString()}`}
            change={`${trendPercent > 0 ? '+' : ''}${trendPercent.toFixed(1)}% vs. mês anterior`}
            changeType={trendPercent > 0 ? 'negative' : 'positive'}
            icon={DollarSign}
            loading={loading}
            badge={{
              text: 'Projetado',
              variant: 'secondary'
            }}
          />
          
          <MetricCard
            title="Potencial de Economia"
            value={`$${totalSavings.toLocaleString()}`}
            change={`${savingsPercent.toFixed(1)}% do total`}
            changeType="positive"
            icon={Target}
            loading={loading}
            badge={{
              text: 'Alto Impacto',
              variant: 'default'
            }}
          />
          
          <MetricCard
            title="Índice de Eficiência"
            value={`${efficiencyScore.toFixed(0)}%`}
            change={efficiencyScore >= 80 ? 'Excelente' : efficiencyScore >= 60 ? 'Bom' : 'Necessita atenção'}
            changeType={efficiencyScore >= 80 ? 'positive' : efficiencyScore >= 60 ? 'neutral' : 'negative'}
            icon={Zap}
            loading={loading}
            badge={{
              text: efficiencyScore >= 80 ? 'Otimizado' : 'Em melhoria',
              variant: efficiencyScore >= 80 ? 'secondary' : 'default'
            }}
          />
          
          <MetricCard
            title="Ações Pendentes"
            value={dashboardData?.summary?.recommendationsCount || '0'}
            change="Requerem decisão executiva"
            changeType="neutral"
            icon={AlertTriangle}
            loading={loading}
            badge={{
              text: 'Prioridade',
              variant: 'destructive'
            }}
          />
        </motion.div>

        {/* Executive Summary Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost Trend & Forecast */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                Tendência e Projeção de Custos
              </CardTitle>
              <CardDescription>
                Análise histórica e forecast para próximos 90 dias
              </CardDescription>
            </CardHeader>
            <CardContent>
              {forecastData && (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={[
                        ...(forecastData?.historical || []),
                        ...(forecastData?.forecast || [])
                      ]}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                      <Tooltip 
                        formatter={(value: any) => [`$${value.toLocaleString()}`, 'Custo']}
                        labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="cost"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#colorActual)"
                        name="Real"
                        data={forecastData?.historical}
                      />
                      <Area
                        type="monotone"
                        dataKey="cost"
                        stroke="#10b981"
                        strokeDasharray="5 5"
                        fillOpacity={1}
                        fill="url(#colorForecast)"
                        name="Projeção"
                        data={forecastData?.forecast}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Projeção 30 dias</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      ${projectedMonthlyCost.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Tendência</p>
                    <p className={`text-xl font-bold ${trendPercent > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {trendPercent > 0 ? '+' : ''}{trendPercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Savings Opportunities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Oportunidades de Economia
              </CardTitle>
              <CardDescription>
                Iniciativas de maior impacto financeiro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-green-900 dark:text-green-100">
                      Recursos Ociosos
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {dashboardData?.summary?.idleResourcesCount || 0} recursos identificados
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${parseFloat(dashboardData?.summary?.potentialIdleSavings || '0').toLocaleString()}
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      /mês
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">
                      Rightsizing
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Instâncias subdimensionadas
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${parseFloat(computeData?.summary?.totalSavings || '0').toLocaleString()}
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      /mês
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div>
                    <p className="font-medium text-purple-900 dark:text-purple-100">
                      Modernização
                    </p>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Migração para containers/serverless
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      $TBD
                    </p>
                    <p className="text-xs text-purple-700 dark:text-purple-300">
                      Ver Modernização
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => {
                    alert('📋 Plano de Ação Completo\n\nEsta funcionalidade abrirá uma visualização detalhada com todas as ações prioritárias, cronogramas e responsáveis.');
                  }}
                >
                  Ver Plano de Ação Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Infrastructure Health & Distribution */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cloud Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Distribuição por Cloud
              </CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData?.cloudData && (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={dashboardData.cloudData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => `${entry.displayName}: $${entry.totalCost.toLocaleString()}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="totalCost"
                      >
                        {dashboardData.cloudData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Compute Utilization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Utilização de Computação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">CPU</span>
                    <span className="text-sm font-bold">{computeData?.summary?.avgUtilization?.cpu || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${computeData?.summary?.avgUtilization?.cpu || 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Memória</span>
                    <span className="text-sm font-bold">{computeData?.summary?.avgUtilization?.memory || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${computeData?.summary?.avgUtilization?.memory || 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Rede</span>
                    <span className="text-sm font-bold">{computeData?.summary?.avgUtilization?.network || 0}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div
                      className="bg-purple-500 h-3 rounded-full"
                      style={{ width: `${computeData?.summary?.avgUtilization?.network || 0}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <p className="text-xs text-red-600 dark:text-red-400">Subutilizado</p>
                      <p className="text-lg font-bold text-red-700 dark:text-red-300">
                        {computeData?.categories?.underutilized?.count || 0}
                      </p>
                    </div>
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <p className="text-xs text-green-600 dark:text-green-400">Otimizado</p>
                      <p className="text-lg font-bold text-green-700 dark:text-green-300">
                        {computeData?.categories?.rightSized?.count || 0}
                      </p>
                    </div>
                    <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                      <p className="text-xs text-yellow-600 dark:text-yellow-400">Sobrecarregado</p>
                      <p className="text-lg font-bold text-yellow-700 dark:text-yellow-300">
                        {computeData?.categories?.overutilized?.count || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Top 5 Serviços (Custo)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardData?.topServices?.slice(0, 5)?.map((service: any, index: number) => (
                  <div key={service?.serviceId} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {service?.displayName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {service?.cloudDisplayName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">
                        ${service?.totalCost?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Items */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Próximos Passos Recomendados
              </CardTitle>
              <CardDescription>
                Ações prioritárias para maximizar economia e eficiência
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded">
                  <Badge variant="destructive" className="mb-2">Alta Prioridade</Badge>
                  <h4 className="font-semibold mb-2">Terminar Recursos Ociosos</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {dashboardData?.summary?.idleResourcesCount || 0} recursos sem uso há 14+ dias
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    Economia: ${parseFloat(dashboardData?.summary?.potentialIdleSavings || '0').toLocaleString()}/mês
                  </p>
                </div>

                <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                  <Badge variant="default" className="mb-2">Média Prioridade</Badge>
                  <h4 className="font-semibold mb-2">Rightsizing de Instâncias</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    {computeData?.categories?.underutilized?.count || 0} instâncias subutilizadas
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    Economia: ${parseFloat(computeData?.categories?.underutilized?.potentialSavings || '0').toLocaleString()}/mês
                  </p>
                </div>

                <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded">
                  <Badge variant="secondary" className="mb-2">Estratégica</Badge>
                  <h4 className="font-semibold mb-2">Modernização Cloud</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                    Containers, Serverless, Automação
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => {
                      alert('🗺️ Roadmap de Modernização\n\nEsta funcionalidade abrirá o roadmap completo com cronograma, etapas e tecnologias para modernização da infraestrutura cloud.');
                    }}
                  >
                    Ver Roadmap
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
