
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { MetricCard } from './metric-card';
import { ChartWrapper } from './chart-wrapper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  DollarSign, 
  Server,
  Search,
  Filter,
  Download,
  Trash2,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface IdleResource {
  id: string;
  name: string;
  resourceType: string;
  cloud: {
    name: string;
    displayName: string;
    color: string;
  };
  service: {
    displayName: string;
    category: string;
  };
  region: string;
  utilizationCPU: number;
  utilizationMemory: number;
  monthlyCostCurrent: number;
  potentialSavings: number;
  lastSeen: string;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];

export function IdleResourcesView() {
  const [resources, setResources] = useState<IdleResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [summary, setSummary] = useState({
    totalResources: 0,
    totalMonthlyCost: 0,
    totalPotentialSavings: 0
  });

  useEffect(() => {
    fetchIdleResources();
  }, []);

  const fetchIdleResources = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/resources/idle');
      const result = await response.json();
      setResources(result?.resources || []);
      setSummary(result?.summary || {
        totalResources: 0,
        totalMonthlyCost: 0,
        totalPotentialSavings: 0
      });
    } catch (error) {
      console.error('Error fetching idle resources:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter resources based on search term
  const filteredResources = resources?.filter(resource =>
    resource?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    resource?.service?.displayName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    resource?.cloud?.displayName?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  // Group resources by cloud for chart
  const resourcesByCloud = resources?.reduce((acc: any, resource) => {
    const cloudName = resource?.cloud?.displayName;
    if (!acc[cloudName]) {
      acc[cloudName] = { 
        name: cloudName, 
        count: 0, 
        savings: 0,
        color: resource?.cloud?.color
      };
    }
    acc[cloudName].count++;
    acc[cloudName].savings += resource?.potentialSavings;
    return acc;
  }, {});

  const cloudData = Object.values(resourcesByCloud || {});

  // Group by service type
  const serviceTypeData = resources?.reduce((acc: any, resource) => {
    const serviceType = resource?.service?.category;
    if (!acc[serviceType]) {
      acc[serviceType] = { 
        name: serviceType, 
        count: 0, 
        savings: 0 
      };
    }
    acc[serviceType].count++;
    acc[serviceType].savings += resource?.potentialSavings;
    return acc;
  }, {});

  const serviceData = Object.values(serviceTypeData || {});

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
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Recursos Ociosos
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Identifique e elimine desperdícios em sua infraestrutura
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <MetricCard
            title="Recursos Ociosos"
            value={summary?.totalResources?.toString() || '0'}
            change="12% do total"
            changeType="negative"
            icon={Server}
            loading={loading}
          />
          
          <MetricCard
            title="Custo Mensal Atual"
            value={`$${summary?.totalMonthlyCost?.toLocaleString() || '0'}`}
            change="Desperdício identificado"
            changeType="negative"
            icon={DollarSign}
            loading={loading}
          />
          
          <MetricCard
            title="Economia Potencial"
            value={`$${summary?.totalPotentialSavings?.toLocaleString() || '0'}`}
            change={`${summary?.totalMonthlyCost > 0 ? ((summary?.totalPotentialSavings / summary?.totalMonthlyCost) * 100)?.toFixed(1) : '0'}% do custo atual`}
            changeType="positive"
            icon={AlertTriangle}
            badge={{
              text: 'Crítico',
              variant: 'destructive'
            }}
            loading={loading}
          />
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resources by Cloud */}
          <motion.div variants={itemVariants}>
            <ChartWrapper
              title="Recursos Ociosos por Cloud"
              description="Distribuição de recursos ociosos por provedor"
              loading={loading}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cloudData}>
                  <XAxis 
                    dataKey="name"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    label={{ 
                      value: 'Recursos', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fontSize: 11 }
                    }}
                  />
                  <Tooltip 
                    formatter={(value: any) => [value, 'Recursos']}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#EF4444"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </motion.div>

          {/* Savings by Service Type */}
          <motion.div variants={itemVariants}>
            <ChartWrapper
              title="Economia por Tipo de Serviço"
              description="Potencial de economia por categoria"
              loading={loading}
            >
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Tooltip 
                    formatter={(value: any) => [`$${value?.toLocaleString()}`, 'Economia']}
                  />
                  <Pie
                    dataKey="savings"
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }: any) => `${name}: ${(percent * 100)?.toFixed(0)}%`}
                    labelLine={false}
                  >
                    {serviceData?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </motion.div>
        </div>

        {/* Resources Table */}
        <motion.div variants={itemVariants}>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            {/* Table Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    Lista de Recursos Ociosos
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {filteredResources?.length} recursos encontrados
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Pesquisar recursos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e?.target?.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtrar
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recurso</TableHead>
                    <TableHead>Cloud</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Região</TableHead>
                    <TableHead>CPU</TableHead>
                    <TableHead>Memória</TableHead>
                    <TableHead>Custo Mensal</TableHead>
                    <TableHead>Economia</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources?.map((resource) => (
                    <TableRow key={resource?.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="font-medium">{resource?.name}</p>
                          <p className="text-sm text-slate-500">{resource?.resourceType}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          style={{ 
                            borderColor: resource?.cloud?.color,
                            color: resource?.cloud?.color 
                          }}
                        >
                          {resource?.cloud?.displayName}
                        </Badge>
                      </TableCell>
                      <TableCell>{resource?.service?.displayName}</TableCell>
                      <TableCell>{resource?.region}</TableCell>
                      <TableCell>
                        <Badge variant={resource?.utilizationCPU < 5 ? 'destructive' : 'secondary'}>
                          {resource?.utilizationCPU?.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={resource?.utilizationMemory < 10 ? 'destructive' : 'secondary'}>
                          {resource?.utilizationMemory?.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${resource?.monthlyCostCurrent?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          ${resource?.potentialSavings?.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Settings className="w-3 h-3" />
                          </Button>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {filteredResources?.length === 0 && !loading && (
                <div className="p-8 text-center">
                  <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">
                    {searchTerm ? 'Nenhum recurso encontrado com os filtros aplicados' : 'Nenhum recurso ocioso encontrado'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
