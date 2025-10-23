
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { ChartWrapper } from './chart-wrapper';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  GitCompare, 
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  AlertTriangle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

const cloudProviders = [
  { id: 'aws', name: 'AWS', color: '#FF9900' },
  { id: 'azure', name: 'Azure', color: '#0078D4' },
  { id: 'gcp', name: 'GCP', color: '#4285F4' }
];

export function ComparisonView() {
  const [loading, setLoading] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('cost');

  // Mock comparison data
  const costComparison = [
    { category: 'Compute', aws: 4500, azure: 3800, gcp: 4200 },
    { category: 'Storage', aws: 1200, azure: 1100, gcp: 950 },
    { category: 'Database', aws: 2800, azure: 2600, gcp: 2400 },
    { category: 'Network', aws: 800, azure: 850, gcp: 700 },
    { category: 'Monitoring', aws: 300, azure: 280, gcp: 320 }
  ];

  const performanceMetrics = [
    { 
      cloud: 'AWS',
      costEfficiency: 85,
      performance: 92,
      reliability: 96,
      security: 94,
      innovation: 90,
      support: 88
    },
    {
      cloud: 'Azure',
      costEfficiency: 88,
      performance: 89,
      reliability: 94,
      security: 92,
      innovation: 87,
      support: 91
    },
    {
      cloud: 'GCP',
      costEfficiency: 92,
      performance: 87,
      reliability: 91,
      security: 90,
      innovation: 95,
      support: 85
    }
  ];

  const cloudSummary = [
    {
      name: 'AWS',
      color: '#FF9900',
      totalCost: 12600,
      growth: 8.2,
      resources: 156,
      services: 8,
      efficiency: 85,
      recommendations: 12,
      strengths: ['Maior ecossistema', 'Mais serviços', 'Melhor documentação'],
      weaknesses: ['Custo mais alto', 'Complexidade', 'Curva de aprendizado'],
      bestFor: 'Aplicações enterprise e workloads complexos'
    },
    {
      name: 'Azure',
      color: '#0078D4',
      totalCost: 10630,
      growth: 5.1,
      resources: 124,
      services: 6,
      efficiency: 88,
      recommendations: 8,
      strengths: ['Integração Microsoft', 'Hybrid cloud', 'Compliance'],
      weaknesses: ['Performance variável', 'Suporte limitado', 'Menos inovação'],
      bestFor: 'Organizações com stack Microsoft e híbrido'
    },
    {
      name: 'GCP',
      color: '#4285F4',
      totalCost: 8370,
      growth: -2.3,
      resources: 89,
      services: 5,
      efficiency: 92,
      recommendations: 4,
      strengths: ['Melhor custo-benefício', 'AI/ML avançado', 'Sustentabilidade'],
      weaknesses: ['Menos serviços', 'Suporte menor', 'Market share'],
      bestFor: 'Startups, analytics e aplicações cloud-native'
    }
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
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <GitCompare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Comparação Multi-Cloud
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Análise side-by-side dos provedores de cloud
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cloud Summary Cards */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {cloudSummary?.map((cloud) => (
              <Card key={cloud?.name} className="relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 w-full h-1"
                  style={{ backgroundColor: cloud?.color }}
                />
                
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold" style={{ color: cloud?.color }}>
                      {cloud?.name}
                    </CardTitle>
                    <Badge 
                      variant={cloud?.growth > 0 ? 'destructive' : 'default'}
                      className="ml-2"
                    >
                      {cloud?.growth > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : cloud?.growth < 0 ? <TrendingDown className="w-3 h-3 mr-1" /> : <Minus className="w-3 h-3 mr-1" />}
                      {Math.abs(cloud?.growth)}%
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Custo Total</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        ${cloud?.totalCost?.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Eficiência</p>
                      <p className="text-2xl font-bold" style={{ color: cloud?.color }}>
                        {cloud?.efficiency}%
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Recursos</p>
                      <p className="text-lg font-semibold">{cloud?.resources}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Recomendações</p>
                      <p className="text-lg font-semibold">{cloud?.recommendations}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Pontos Fortes
                    </p>
                    <div className="space-y-1">
                      {cloud?.strengths?.map((strength, index) => (
                        <p key={index} className="text-xs text-slate-600 dark:text-slate-400 flex items-center">
                          <Award className="w-3 h-3 mr-1 text-green-500" />
                          {strength}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Pontos de Atenção
                    </p>
                    <div className="space-y-1">
                      {cloud?.weaknesses?.map((weakness, index) => (
                        <p key={index} className="text-xs text-slate-600 dark:text-slate-400 flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1 text-amber-500" />
                          {weakness}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Melhor para:
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {cloud?.bestFor}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Comparison Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Cost Comparison */}
          <motion.div variants={itemVariants}>
            <ChartWrapper
              title="Comparação de Custos por Categoria"
              description="Análise detalhada de custos por tipo de serviço"
              loading={loading}
            >
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={costComparison} margin={{ bottom: 20 }}>
                  <XAxis 
                    dataKey="category"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    angle={0}
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
                  <Bar dataKey="aws" fill="#FF9900" name="AWS" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="azure" fill="#0078D4" name="Azure" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="gcp" fill="#4285F4" name="GCP" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </motion.div>

          {/* Performance Radar */}
          <motion.div variants={itemVariants}>
            <ChartWrapper
              title="Comparação de Performance"
              description="Análise multidimensional de capacidades"
              loading={loading}
            >
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={performanceMetrics} margin={{ top: 20, bottom: 20 }}>
                  <PolarGrid />
                  <PolarAngleAxis 
                    dataKey="cloud" 
                    tick={{ fontSize: 10 }}
                  />
                  <PolarRadiusAxis 
                    domain={[0, 100]}
                    tick={{ fontSize: 8 }}
                    tickCount={6}
                  />
                  <Tooltip />
                  <Radar 
                    name="Custo-Eficiência" 
                    dataKey="costEfficiency" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3} 
                  />
                  <Radar 
                    name="Performance" 
                    dataKey="performance" 
                    stroke="#82ca9d" 
                    fill="#82ca9d" 
                    fillOpacity={0.3} 
                  />
                  <Radar 
                    name="Confiabilidade" 
                    dataKey="reliability" 
                    stroke="#ffc658" 
                    fill="#ffc658" 
                    fillOpacity={0.3} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </motion.div>
        </div>

        {/* Decision Matrix */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Matriz de Decisão</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Recomendações baseadas em diferentes cenários de uso
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 border border-green-200 dark:border-green-800 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <h4 className="font-semibold text-green-800 dark:text-green-200">
                      Melhor Custo-Benefício
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">GCP</p>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Economia de 33% vs AWS
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Ideal para startups e projetos novos
                    </p>
                  </div>
                </div>

                <div className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                      Mais Serviços
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">AWS</p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      200+ serviços disponíveis
                    </p>
                    <p className="text-xs text-blue-600 dark:text-blue-400">
                      Ideal para aplicações complexas
                    </p>
                  </div>
                </div>

                <div className="p-4 border border-purple-200 dark:border-purple-800 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full" />
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200">
                      Hybrid Cloud
                    </h4>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">Azure</p>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Melhor integração on-premises
                    </p>
                    <p className="text-xs text-purple-600 dark:text-purple-400">
                      Ideal para empresas Microsoft
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
