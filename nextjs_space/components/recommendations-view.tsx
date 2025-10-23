
'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { MetricCard } from './metric-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Lightbulb, 
  DollarSign, 
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Recommendation {
  id: string;
  type: string;
  priority: string;
  title: string;
  description: string;
  impact: string;
  effort: string;
  currentCost: number;
  potentialSaving: number;
  savingPercent: number;
  timeframe: string;
  riskLevel: string;
  status: string;
}

const priorityConfig = {
  high: { color: 'bg-red-500', text: 'text-red-600', badge: 'destructive' },
  medium: { color: 'bg-yellow-500', text: 'text-yellow-600', badge: 'default' },
  low: { color: 'bg-green-500', text: 'text-green-600', badge: 'secondary' }
};

const statusConfig = {
  open: { color: 'text-red-600', badge: 'destructive', label: 'Pendente' },
  in_progress: { color: 'text-yellow-600', badge: 'default', label: 'Em andamento' },
  implemented: { color: 'text-green-600', badge: 'secondary', label: 'Implementado' }
};

export function RecommendationsView() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      // Mock data since we don't have a specific recommendations API
      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          type: 'rightsizing',
          priority: 'high',
          title: 'Right-size instâncias EC2 subutilizadas',
          description: 'Identificamos 12 instâncias EC2 com utilização média de CPU abaixo de 15% nos últimos 30 dias. Redimensionar para instâncias menores pode gerar economia significativa.',
          impact: 'high',
          effort: 'easy',
          currentCost: 2840.50,
          potentialSaving: 1420.25,
          savingPercent: 50,
          timeframe: '1-week',
          riskLevel: 'low',
          status: 'open'
        },
        {
          id: '2',
          type: 'reserved_instances',
          priority: 'medium',
          title: 'Adquirir Reserved Instances para workloads estáveis',
          description: 'Suas instâncias de produção têm padrão de uso consistente. RIs de 1 ano podem reduzir custos em até 40%.',
          impact: 'medium',
          effort: 'medium',
          currentCost: 5600.00,
          potentialSaving: 2240.00,
          savingPercent: 40,
          timeframe: '1-month',
          riskLevel: 'low',
          status: 'open'
        },
        {
          id: '3',
          type: 'terminate_idle',
          priority: 'high',
          title: 'Terminar recursos ociosos',
          description: 'Encontramos 8 instâncias que não processaram tráfego nos últimos 14 dias. Considere terminá-las ou pausá-las.',
          impact: 'high',
          effort: 'easy',
          currentCost: 1680.00,
          potentialSaving: 1512.00,
          savingPercent: 90,
          timeframe: 'immediate',
          riskLevel: 'medium',
          status: 'open'
        },
        {
          id: '4',
          type: 'savings_plans',
          priority: 'medium',
          title: 'Implementar Compute Savings Plans',
          description: 'Seus gastos com compute são previsíveis. Savings Plans podem oferecer até 66% de desconto.',
          impact: 'medium',
          effort: 'medium',
          currentCost: 8200.00,
          potentialSaving: 2460.00,
          savingPercent: 30,
          timeframe: '1-month',
          riskLevel: 'low',
          status: 'in_progress'
        }
      ];
      setRecommendations(mockRecommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecommendations = recommendations?.filter(rec => 
    filter === 'all' || rec?.priority === filter || rec?.status === filter
  );

  const totalPotentialSavings = recommendations?.reduce((sum, rec) => sum + rec?.potentialSaving, 0);
  const highPriorityCount = recommendations?.filter(rec => rec?.priority === 'high')?.length;
  const openCount = recommendations?.filter(rec => rec?.status === 'open')?.length;

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
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Recomendações de Otimização
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Sugestões personalizadas para reduzir custos e melhorar eficiência
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
            title="Economia Potencial"
            value={`$${totalPotentialSavings?.toLocaleString() || '0'}`}
            change="Implementando todas as recomendações"
            changeType="positive"
            icon={DollarSign}
            loading={loading}
          />
          
          <MetricCard
            title="Alta Prioridade"
            value={highPriorityCount?.toString() || '0'}
            change="Requerem ação imediata"
            changeType="negative"
            icon={AlertTriangle}
            badge={{
              text: 'Crítico',
              variant: 'destructive'
            }}
            loading={loading}
          />
          
          <MetricCard
            title="Pendentes"
            value={openCount?.toString() || '0'}
            change="Aguardando implementação"
            changeType="neutral"
            icon={Clock}
            loading={loading}
          />
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Filtrar por:
            </span>
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              Todas
            </Button>
            <Button 
              variant={filter === 'high' ? 'destructive' : 'outline'}
              size="sm"
              onClick={() => setFilter('high')}
            >
              Alta Prioridade
            </Button>
            <Button 
              variant={filter === 'open' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('open')}
            >
              Pendentes
            </Button>
            <Button 
              variant={filter === 'implemented' ? 'secondary' : 'outline'}
              size="sm"
              onClick={() => setFilter('implemented')}
            >
              Implementadas
            </Button>
          </div>
        </motion.div>

        {/* Recommendations List */}
        <motion.div variants={itemVariants} className="space-y-4">
          {filteredRecommendations?.map((recommendation) => {
            const priorityStyle = priorityConfig[recommendation?.priority as keyof typeof priorityConfig];
            const statusStyle = statusConfig[recommendation?.status as keyof typeof statusConfig];

            return (
              <Card key={recommendation?.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-1 h-12 rounded-full ${priorityStyle?.color}`} />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-lg">{recommendation?.title}</CardTitle>
                          <Badge variant={priorityStyle?.badge as any}>
                            {recommendation?.priority?.toUpperCase()}
                          </Badge>
                          <Badge variant={statusStyle?.badge as any}>
                            {statusStyle?.label}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {recommendation?.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${recommendation?.potentialSaving?.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-500">
                        {recommendation?.savingPercent}% economia
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Impacto</p>
                      <Badge variant="outline" className="mt-1">
                        {recommendation?.impact}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Esforço</p>
                      <Badge variant="outline" className="mt-1">
                        {recommendation?.effort}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Prazo</p>
                      <Badge variant="outline" className="mt-1">
                        {recommendation?.timeframe}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Risco</p>
                      <Badge variant="outline" className="mt-1">
                        {recommendation?.riskLevel}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Custo atual: <span className="font-medium">${recommendation?.currentCost?.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Ver detalhes
                      </Button>
                      {recommendation?.status === 'open' && (
                        <Button size="sm">
                          Implementar
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                      {recommendation?.status === 'implemented' && (
                        <Button size="sm" variant="secondary">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Implementado
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {filteredRecommendations?.length === 0 && !loading && (
          <motion.div variants={itemVariants} className="text-center py-12">
            <Lightbulb className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              {filter === 'all' ? 'Nenhuma recomendação disponível' : `Nenhuma recomendação encontrada para o filtro "${filter}"`}
            </p>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
