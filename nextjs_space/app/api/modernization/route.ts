
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cloudFilter = searchParams.get('clouds')?.split(',') || [];

    // Get all compute resources
    const resources = await prisma.resource.findMany({
      where: {
        resourceType: {
          in: ['instance', 'vm', 'compute']
        },
        ...(cloudFilter?.length > 0 ? {
          cloud: { name: { in: cloudFilter } }
        } : {})
      },
      include: {
        cloud: true,
        service: true
      }
    });

    // Modernization recommendations
    const modernizationRecommendations = [];

    // 1. EC2 → EKS/ECS (Containerization)
    const ec2Instances = resources?.filter(r => 
      r?.service?.name?.toLowerCase()?.includes('ec2') || 
      r?.resourceType === 'instance'
    );
    
    if (ec2Instances?.length > 5) {
      const totalEC2Cost = ec2Instances?.reduce((sum, r) => 
        sum + parseFloat(r?.monthlyCostCurrent?.toString() || '0'), 0
      );
      const estimatedContainerCost = totalEC2Cost * 0.60; // 40% savings typical
      
      modernizationRecommendations.push({
        id: 'ec2-to-eks',
        title: 'Migrar EC2 para Amazon EKS (Kubernetes)',
        description: `${ec2Instances?.length} instâncias EC2 poderiam ser containerizadas e gerenciadas com Kubernetes para melhor utilização de recursos`,
        category: 'containerization',
        priority: 'high',
        currentArchitecture: 'EC2 Instances',
        proposedArchitecture: 'Amazon EKS + Containers',
        resourcesAffected: ec2Instances?.length,
        currentMonthlyCost: totalEC2Cost?.toFixed(2),
        projectedMonthlyCost: estimatedContainerCost?.toFixed(2),
        monthlySavings: (totalEC2Cost - estimatedContainerCost)?.toFixed(2),
        savingsPercent: 40,
        implementationTime: '4-8 semanas',
        complexity: 'high',
        businessBenefits: [
          'Melhor utilização de recursos (40-60%)',
          'Deploy mais rápido e confiável',
          'Auto-scaling granular',
          'Portabilidade entre clouds',
          'Recuperação automática de falhas'
        ],
        technicalRequirements: [
          'Containerizar aplicações (Docker)',
          'Configurar cluster EKS',
          'Implementar CI/CD para containers',
          'Migrar dados e configurações',
          'Treinar equipe em Kubernetes'
        ],
        risks: [
          'Curva de aprendizado de Kubernetes',
          'Tempo de migração',
          'Refatoração de aplicações legacy'
        ],
        roi: {
          breakEvenMonths: 6,
          year1Savings: ((totalEC2Cost - estimatedContainerCost) * 12)?.toFixed(2),
          year3Savings: ((totalEC2Cost - estimatedContainerCost) * 36)?.toFixed(2)
        }
      });
    }

    // 2. VMs → Serverless (Lambda/Functions)
    const suitableForServerless = resources?.filter(r => {
      const cpu = parseFloat(r?.utilizationCPU?.toString() || '0');
      return cpu < 30 && r?.resourceType === 'instance';
    });

    if (suitableForServerless?.length > 0) {
      const totalVMCost = suitableForServerless?.reduce((sum, r) => 
        sum + parseFloat(r?.monthlyCostCurrent?.toString() || '0'), 0
      );
      const estimatedServerlessCost = totalVMCost * 0.30; // 70% savings possible
      
      modernizationRecommendations.push({
        id: 'vm-to-serverless',
        title: 'Migrar Workloads para Serverless (Lambda/Functions)',
        description: `${suitableForServerless?.length} instâncias com baixa utilização são candidatas para arquitetura serverless`,
        category: 'serverless',
        priority: 'medium',
        currentArchitecture: 'Always-on VMs',
        proposedArchitecture: 'AWS Lambda / Azure Functions / Cloud Functions',
        resourcesAffected: suitableForServerless?.length,
        currentMonthlyCost: totalVMCost?.toFixed(2),
        projectedMonthlyCost: estimatedServerlessCost?.toFixed(2),
        monthlySavings: (totalVMCost - estimatedServerlessCost)?.toFixed(2),
        savingsPercent: 70,
        implementationTime: '2-4 semanas',
        complexity: 'medium',
        businessBenefits: [
          'Pague apenas pelo uso real',
          'Escala automática para zero',
          'Sem gerenciamento de servidores',
          'Melhor para workloads intermitentes',
          'Deploy instantâneo'
        ],
        technicalRequirements: [
          'Refatorar código para stateless',
          'Implementar API Gateway',
          'Configurar triggers e eventos',
          'Adaptar para cold starts',
          'Implementar monitoramento'
        ],
        risks: [
          'Cold start latency',
          'Limites de execução (15min)',
          'Vendor lock-in',
          'Complexidade de debugging'
        ],
        roi: {
          breakEvenMonths: 2,
          year1Savings: ((totalVMCost - estimatedServerlessCost) * 12)?.toFixed(2),
          year3Savings: ((totalVMCost - estimatedServerlessCost) * 36)?.toFixed(2)
        }
      });
    }

    // 3. Database Modernization (RDS → Aurora Serverless)
    modernizationRecommendations.push({
      id: 'rds-to-aurora-serverless',
      title: 'Modernizar Banco de Dados para Aurora Serverless',
      description: 'Bancos de dados tradicionais podem se beneficiar de auto-scaling e pay-per-use',
      category: 'database',
      priority: 'medium',
      currentArchitecture: 'RDS MySQL/PostgreSQL',
      proposedArchitecture: 'Aurora Serverless v2',
      resourcesAffected: 'N/A',
      currentMonthlyCost: '0',
      projectedMonthlyCost: '0',
      monthlySavings: '0',
      savingsPercent: 50,
      implementationTime: '1-2 semanas',
      complexity: 'low',
      businessBenefits: [
        'Auto-scaling automático',
        'Pague apenas pela capacidade usada',
        'Alta disponibilidade nativa',
        'Melhor performance',
        'Backup automático'
      ],
      technicalRequirements: [
        'Backup do banco atual',
        'Migração de esquema',
        'Teste de compatibilidade',
        'Atualizar connection strings'
      ],
      risks: [
        'Tempo de migração',
        'Possíveis incompatibilidades',
        'Custo durante migração'
      ],
      roi: {
        breakEvenMonths: 3,
        year1Savings: 'Variável',
        year3Savings: 'Variável'
      }
    });

    // 4. Storage Modernization
    modernizationRecommendations.push({
      id: 'storage-tiering',
      title: 'Implementar Storage Inteligente e Tiering',
      description: 'Usar classes de armazenamento inteligentes que movem dados automaticamente entre tiers',
      category: 'storage',
      priority: 'high',
      currentArchitecture: 'Standard Storage Classes',
      proposedArchitecture: 'S3 Intelligent-Tiering / Azure Cool/Archive',
      resourcesAffected: 'Todos os buckets/containers',
      currentMonthlyCost: '0',
      projectedMonthlyCost: '0',
      monthlySavings: '0',
      savingsPercent: 30,
      implementationTime: '1 semana',
      complexity: 'easy',
      businessBenefits: [
        'Economia automática de 30-70%',
        'Sem impacto na disponibilidade',
        'Otimização contínua automática',
        'Sem mudança no código'
      ],
      technicalRequirements: [
        'Ativar S3 Intelligent-Tiering',
        'Configurar lifecycle policies',
        'Definir regras de acesso'
      ],
      risks: [
        'Custos de transição mínimos',
        'Latência em acessos raros'
      ],
      roi: {
        breakEvenMonths: 1,
        year1Savings: 'Alto',
        year3Savings: 'Muito Alto'
      }
    });

    // 5. Multi-Cloud Strategy
    modernizationRecommendations.push({
      id: 'multi-cloud-optimization',
      title: 'Estratégia Multi-Cloud para Workloads Específicos',
      description: 'Distribuir workloads entre clouds baseado em custo-benefício de cada serviço',
      category: 'strategy',
      priority: 'low',
      currentArchitecture: 'Single Cloud Provider',
      proposedArchitecture: 'Multi-Cloud Strategy',
      resourcesAffected: 'Workloads selecionados',
      currentMonthlyCost: '0',
      projectedMonthlyCost: '0',
      monthlySavings: '0',
      savingsPercent: 25,
      implementationTime: '8-12 semanas',
      complexity: 'high',
      businessBenefits: [
        'Melhor preço por workload',
        'Resiliência aumentada',
        'Evitar vendor lock-in',
        'Acesso a serviços especializados',
        'Redundância geográfica'
      ],
      technicalRequirements: [
        'Plataforma de orquestração multi-cloud',
        'Terraform ou similar para IaC',
        'Monitoramento unificado',
        'Gestão de custos centralizada',
        'Políticas de segurança consistentes'
      ],
      risks: [
        'Complexidade operacional',
        'Custos de transferência de dados',
        'Necessidade de expertise múltipla'
      ],
      roi: {
        breakEvenMonths: 12,
        year1Savings: 'Médio',
        year3Savings: 'Alto'
      }
    });

    return NextResponse.json({
      summary: {
        totalRecommendations: modernizationRecommendations?.length,
        totalPotentialSavings: modernizationRecommendations?.reduce((sum, r) => 
          sum + parseFloat(r?.monthlySavings || '0'), 0
        )?.toFixed(2),
        avgSavingsPercent: modernizationRecommendations?.reduce((sum, r) => 
          sum + r?.savingsPercent, 0
        ) / modernizationRecommendations?.length
      },
      recommendations: modernizationRecommendations,
      maturityScore: {
        current: 45, // Mock score
        target: 85,
        areas: {
          containerization: 30,
          serverless: 40,
          automation: 60,
          costOptimization: 50,
          multiCloud: 20
        }
      }
    });

  } catch (error) {
    console.error('Modernization API error:', error);
    return NextResponse.json({ error: 'Failed to fetch modernization recommendations' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
