'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from './dashboard-layout';
import { MetricCard } from './metric-card';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Rocket,
  TrendingUp,
  Package,
  Zap,
  Cloud,
  Shield,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const priorityColors = {
  high: 'text-red-600 bg-red-100 dark:bg-red-900/20',
  medium: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20',
  low: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20'
};

const complexityColors = {
  easy: 'text-green-600',
  medium: 'text-yellow-600',
  high: 'text-red-600'
};

export function ModernizationView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRec, setSelectedRec] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/modernization');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching modernization data:', error);
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
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Modernização Cloud
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Recomendações estratégicas para evolução da infraestrutura
              </p>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Economia Potencial"
            value={`$${data?.summary?.totalPotentialSavings || '0'}`}
            change="Com modernização completa"
            changeType="positive"
            icon={DollarSign}
            loading={loading}
          />
          
          <MetricCard
            title="Recomendações"
            value={data?.summary?.totalRecommendations?.toString() || '0'}
            change="Iniciativas identificadas"
            changeType="neutral"
            icon={Package}
            loading={loading}
          />
          
          <MetricCard
            title="Média de Economia"
            value={`${data?.summary?.avgSavingsPercent?.toFixed(0) || '0'}%`}
            change="Por iniciativa"
            changeType="positive"
            icon={TrendingUp}
            loading={loading}
          />
          
          <MetricCard
            title="Maturidade Cloud"
            value={`${data?.maturityScore?.current || 0}%`}
            change={`Meta: ${data?.maturityScore?.target || 85}%`}
            changeType="neutral"
            icon={Shield}
            loading={loading}
          />
        </motion.div>

        {/* Maturity Score */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Índice de Maturidade Cloud</CardTitle>
              <CardDescription>
                Avaliação por área técnica
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data?.maturityScore?.areas && Object.entries(data.maturityScore.areas).map(([area, score]: [string, any]) => (
                  <div key={area}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium capitalize">
                        {area.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm font-bold">{score}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          score >= 70 ? 'bg-green-500' : score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recommendations */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Iniciativas de Modernização
          </h2>
          
          {data?.recommendations?.map((rec: any) => (
            <Card key={rec.id} className="overflow-hidden">
              <CardHeader className={`${priorityColors[rec.priority as keyof typeof priorityColors]}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl">{rec.title}</CardTitle>
                      <Badge variant={rec.priority === 'high' ? 'destructive' : 'default'}>
                        {rec.priority.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {rec.category}
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-700 dark:text-slate-300">
                      {rec.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                {/* Architecture Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Arquitetura Atual</p>
                    <p className="font-semibold text-slate-900 dark:text-white">{rec.currentArchitecture}</p>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-8 h-8 text-blue-500" />
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">Arquitetura Proposta</p>
                    <p className="font-semibold text-blue-900 dark:text-blue-100">{rec.proposedArchitecture}</p>
                  </div>
                </div>

                {/* Financial Impact */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Custo Atual</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      ${parseFloat(rec.currentMonthlyCost).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">/mês</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Custo Projetado</p>
                    <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                      ${parseFloat(rec.projectedMonthlyCost).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-500">/mês</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Economia Mensal</p>
                    <p className="text-xl font-bold text-green-600 dark:text-green-400">
                      ${parseFloat(rec.monthlySavings).toLocaleString()}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {rec.savingsPercent}% economia
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">ROI (Ano 1)</p>
                    <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                      ${rec.roi?.year1Savings?.toLocaleString() || 'TBD'}
                    </p>
                    <p className="text-xs text-slate-500">
                      Break-even: {rec.roi?.breakEvenMonths}m
                    </p>
                  </div>
                </div>

                {/* Implementation Details */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="details">
                    <AccordionTrigger>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        <span>Detalhes de Implementação</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 pt-4">
                        {/* Business Benefits */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            Benefícios de Negócio
                          </h4>
                          <ul className="space-y-2 ml-6">
                            {rec.businessBenefits?.map((benefit: string, idx: number) => (
                              <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                <span className="text-green-500 mt-1">✓</span>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator />

                        {/* Technical Requirements */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-500" />
                            Requisitos Técnicos
                          </h4>
                          <ul className="space-y-2 ml-6">
                            {rec.technicalRequirements?.map((req: string, idx: number) => (
                              <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                <span className="text-blue-500 mt-1">→</span>
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator />

                        {/* Risks */}
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-yellow-500" />
                            Riscos e Considerações
                          </h4>
                          <ul className="space-y-2 ml-6">
                            {rec.risks?.map((risk: string, idx: number) => (
                              <li key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                <span className="text-yellow-500 mt-1">⚠</span>
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <Separator />

                        {/* Metadata */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-slate-100 dark:bg-slate-800 rounded">
                            <Clock className="w-5 h-5 mx-auto mb-2 text-slate-600" />
                            <p className="text-xs text-slate-600 dark:text-slate-400">Prazo</p>
                            <p className="font-semibold text-sm">{rec.implementationTime}</p>
                          </div>
                          
                          <div className="text-center p-3 bg-slate-100 dark:bg-slate-800 rounded">
                            <Package className="w-5 h-5 mx-auto mb-2 text-slate-600" />
                            <p className="text-xs text-slate-600 dark:text-slate-400">Complexidade</p>
                            <p className={`font-semibold text-sm ${complexityColors[rec.complexity as keyof typeof complexityColors]}`}>
                              {rec.complexity}
                            </p>
                          </div>
                          
                          <div className="text-center p-3 bg-slate-100 dark:bg-slate-800 rounded">
                            <Shield className="w-5 h-5 mx-auto mb-2 text-slate-600" />
                            <p className="text-xs text-slate-600 dark:text-slate-400">Recursos</p>
                            <p className="font-semibold text-sm">{rec.resourcesAffected}</p>
                          </div>
                          
                          <div className="text-center p-3 bg-slate-100 dark:bg-slate-800 rounded">
                            <TrendingUp className="w-5 h-5 mx-auto mb-2 text-slate-600" />
                            <p className="text-xs text-slate-600 dark:text-slate-400">ROI 3 anos</p>
                            <p className="font-semibold text-sm">${rec.roi?.year3Savings?.toLocaleString() || 'TBD'}</p>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
                  <Button variant="outline">
                    Baixar Business Case
                  </Button>
                  <Button>
                    Agendar Reunião Técnica
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Pronto para Modernizar?
                  </h3>
                  <p className="text-blue-100">
                    Nossa equipe pode ajudar na implementação dessas iniciativas com zero downtime
                  </p>
                </div>
                <Button size="lg" variant="secondary">
                  Falar com Especialista
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
