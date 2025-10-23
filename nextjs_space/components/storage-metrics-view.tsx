'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { MetricCard } from './metric-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, TrendingUp, DollarSign, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function StorageMetricsView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/storage-metrics');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Database className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Métricas de Storage</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Análise de S3, Blob Storage e Cloud Storage
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Custo Total"
            value={`$${parseFloat(data?.summary?.totalCost || '0').toLocaleString()}`}
            change="/mês"
            changeType="neutral"
            icon={DollarSign}
            loading={loading}
          />
          
          <MetricCard
            title="Crescimento"
            value={`${parseFloat(data?.summary?.growthPercent || '0').toFixed(1)}%`}
            change="vs. mês anterior"
            changeType={parseFloat(data?.summary?.growthPercent || '0') > 0 ? 'negative' : 'positive'}
            icon={TrendingUp}
            loading={loading}
          />
          
          <MetricCard
            title="Custo Recente"
            value={`$${parseFloat(data?.summary?.recentMonthlyCost || '0').toLocaleString()}`}
            change="Últimos 30 dias"
            changeType="neutral"
            icon={Database}
            loading={loading}
          />
          
          <MetricCard
            title="Tendência"
            value={data?.summary?.growthTrend === 'increasing' ? '↗ Crescente' : '↘ Decrescente'}
            change={`${Math.abs(parseFloat(data?.summary?.growthPercent || '0')).toFixed(1)}% variação`}
            changeType={data?.summary?.growthTrend === 'increasing' ? 'negative' : 'positive'}
            icon={TrendingUp}
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Classe de Storage</CardTitle>
              <CardDescription>Custos por tier de armazenamento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={data?.storageByClass}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.class}: $${parseFloat(entry.cost).toLocaleString()}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="cost"
                    >
                      {data?.storageByClass?.map((_: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `$${parseFloat(value).toLocaleString()}`} />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Cloud Provider</CardTitle>
              <CardDescription>Custos de storage por provedor</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.storageByCloud}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="displayName" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(value: any) => `$${parseFloat(value).toLocaleString()}`} />
                    <Bar dataKey="cost" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-500" />
              Oportunidades de Otimização de Storage
            </CardTitle>
            <CardDescription>
              Implementações recomendadas para reduzir custos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.optimizations?.map((opt: any) => (
                <div key={opt.id} className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Database className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-lg">{opt.title}</h4>
                      <Badge variant={opt.impact === 'high' ? 'destructive' : 'default'}>
                        {opt.complexity}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {opt.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500">Economia Potencial</p>
                        <p className="text-xl font-bold text-green-600">
                          ${parseFloat(opt.potentialSaving).toLocaleString()}/mês
                        </p>
                        <p className="text-xs text-green-600">
                          {opt.savingsPercent}% de economia
                        </p>
                      </div>
                      <Button>Implementar</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
