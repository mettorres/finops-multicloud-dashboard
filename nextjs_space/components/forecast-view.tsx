'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { MetricCard } from './metric-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Calendar, AlertTriangle, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export function ForecastView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [horizon, setHorizon] = useState(90);

  useEffect(() => {
    fetchData();
  }, [horizon]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/forecast?horizon=${horizon}`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching forecast:', error);
    } finally {
      setLoading(false);
    }
  };

  const combinedData = [
    ...(data?.historical || []),
    ...(data?.forecast || [])
  ];

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Forecast de Custos</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Projeções baseadas em tendências históricas
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Custo Diário Médio"
            value={`$${parseFloat(data?.trends?.currentDailyAverage || '0').toLocaleString()}`}
            change={`${data?.trends?.trendPercent || 0}% vs. período anterior`}
            changeType={parseFloat(data?.trends?.trendPercent || '0') > 0 ? 'negative' : 'positive'}
            icon={TrendingUp}
            loading={loading}
          />
          
          <MetricCard
            title="Projeção 30 Dias"
            value={`$${parseFloat(data?.trends?.projectedMonthlyCost || '0').toLocaleString()}`}
            change="Baseado em tendência atual"
            changeType="neutral"
            icon={Calendar}
            loading={loading}
          />
          
          <MetricCard
            title="Projeção 90 Dias"
            value={`$${parseFloat(data?.trends?.projectedQuarterlyCost || '0').toLocaleString()}`}
            change="Com crescimento estimado"
            changeType="neutral"
            icon={Target}
            loading={loading}
          />
          
          <MetricCard
            title="Tendência"
            value={data?.trends?.trendDirection === 'up' ? '↗ Crescente' : '↘ Decrescente'}
            change={`${Math.abs(parseFloat(data?.trends?.trendPercent || '0')).toFixed(1)}% de variação`}
            changeType={data?.trends?.trendDirection === 'up' ? 'negative' : 'positive'}
            icon={AlertTriangle}
            loading={loading}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Histórico e Projeção de Custos</CardTitle>
            <CardDescription>
              Linha sólida = dados reais | Linha tracejada = previsão
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={combinedData}>
                  <defs>
                    <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#actualGradient)"
                    name="Histórico"
                    data={data?.historical}
                  />
                  <Area
                    type="monotone"
                    dataKey="cost"
                    stroke="#10b981"
                    strokeDasharray="5 5"
                    fillOpacity={1}
                    fill="url(#forecastGradient)"
                    name="Projeção"
                    data={data?.forecast}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cenários de Projeção</CardTitle>
            <CardDescription>
              Diferentes cenários baseados em otimizações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.forecast}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { month: 'short' })}
                  />
                  <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value: any) => [`$${value.toLocaleString()}`, '']}
                    labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    data={data?.scenarios?.optimistic}
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={false}
                    name="Otimista (-30%)"
                  />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    data={data?.scenarios?.realistic}
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={false}
                    name="Realista"
                  />
                  <Line
                    type="monotone"
                    dataKey="cost"
                    data={data?.scenarios?.pessimistic}
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                    name="Pessimista (+30%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
