'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { MetricCard } from './metric-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, Activity, DollarSign, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import {
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

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function ComputeMetricsView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/compute-metrics');
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
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Métricas de Computação</h1>
              <p className="text-slate-600 dark:text-slate-400">
                Análise detalhada de utilização e custos
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total de Recursos"
            value={data?.summary?.totalResources?.toString() || '0'}
            change="Instâncias ativas"
            changeType="neutral"
            icon={Cpu}
            loading={loading}
          />
          
          <MetricCard
            title="Custo Atual"
            value={`$${parseFloat(data?.summary?.totalCurrentCost || '0').toLocaleString()}`}
            change="/mês"
            changeType="neutral"
            icon={DollarSign}
            loading={loading}
          />
          
          <MetricCard
            title="Economia Potencial"
            value={`$${parseFloat(data?.summary?.totalSavings || '0').toLocaleString()}`}
            change={`${data?.summary?.savingsPercent || 0}% do total`}
            changeType="positive"
            icon={AlertTriangle}
            loading={loading}
          />
          
          <MetricCard
            title="CPU Médio"
            value={`${parseFloat(data?.summary?.avgUtilization?.cpu || '0')}%`}
            change="Utilização geral"
            changeType={parseFloat(data?.summary?.avgUtilization?.cpu || '0') < 30 ? 'negative' : 'positive'}
            icon={Activity}
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Utilização por Recurso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'CPU', value: parseFloat(data?.summary?.avgUtilization?.cpu || '0') },
                    { name: 'Memória', value: parseFloat(data?.summary?.avgUtilization?.memory || '0') },
                    { name: 'Rede', value: parseFloat(data?.summary?.avgUtilization?.network || '0') }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categorias de Utilização</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={[
                        { name: 'Subutilizado', value: data?.categories?.underutilized?.count || 0 },
                        { name: 'Otimizado', value: data?.categories?.rightSized?.count || 0 },
                        { name: 'Sobrecarregado', value: data?.categories?.overutilized?.count || 0 }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[0, 1, 2].map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Top 10 Recursos com Maior Desperdício</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data?.topWasters?.map((resource: any, index: number) => (
                <div key={resource.id} className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                    <span className="text-sm font-bold text-red-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{resource.name}</p>
                    <p className="text-sm text-slate-500">{resource.cloud} • {resource.type}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-400">CPU</p>
                    <p className="font-bold">{resource.utilizationCPU.toFixed(0)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Economia</p>
                    <p className="font-bold text-green-600">${resource.potentialSaving.toLocaleString()}/m</p>
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
