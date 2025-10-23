
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Cloud,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  GitCompare,
  Settings,
  DollarSign,
  Activity,
  Upload,
  Briefcase,
  Rocket,
  Cpu,
  Database
} from 'lucide-react';

const navigation = [
  {
    name: 'Dashboard Principal',
    href: '/',
    icon: BarChart3,
    description: 'Visão consolidada multi-cloud'
  },
  {
    name: 'Executive Dashboard',
    href: '/executive',
    icon: Briefcase,
    description: 'Visão C-Level',
    color: 'text-purple-600 dark:text-purple-400'
  },
  {
    name: 'Upload de Dados',
    href: '/upload',
    icon: Upload,
    description: 'Importar billing data',
    color: 'text-indigo-600 dark:text-indigo-400'
  },
  {
    name: 'AWS',
    href: '/aws',
    icon: Cloud,
    description: 'Amazon Web Services',
    color: 'text-orange-600 dark:text-orange-400'
  },
  {
    name: 'Azure',
    href: '/azure',
    icon: Cloud,
    description: 'Microsoft Azure',
    color: 'text-blue-600 dark:text-blue-400'
  },
  {
    name: 'GCP',
    href: '/gcp',
    icon: Cloud,
    description: 'Google Cloud Platform',
    color: 'text-green-600 dark:text-green-400'
  },
  {
    name: 'Forecast',
    href: '/forecast',
    icon: TrendingUp,
    description: 'Projeções de custos',
    color: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    name: 'Métricas de Computação',
    href: '/compute',
    icon: Cpu,
    description: 'CPU, RAM, Rede',
    color: 'text-cyan-600 dark:text-cyan-400'
  },
  {
    name: 'Métricas de Storage',
    href: '/storage',
    icon: Database,
    description: 'S3, Blob, Cloud Storage',
    color: 'text-pink-600 dark:text-pink-400'
  },
  {
    name: 'Modernização',
    href: '/modernization',
    icon: Rocket,
    description: 'EC2→EKS, VMs→Serverless',
    color: 'text-purple-600 dark:text-purple-400'
  },
  {
    name: 'Recursos Ociosos',
    href: '/idle-resources',
    icon: AlertTriangle,
    description: 'Detecção de desperdícios',
    color: 'text-red-600 dark:text-red-400'
  },
  {
    name: 'Recomendações',
    href: '/recommendations',
    icon: Lightbulb,
    description: 'Otimizações sugeridas',
    color: 'text-yellow-600 dark:text-yellow-400'
  },
  {
    name: 'Comparação Multi-Cloud',
    href: '/comparison',
    icon: GitCompare,
    description: 'Análise side-by-side'
  },
  {
    name: 'Tendências',
    href: '/trends',
    icon: TrendingUp,
    description: 'Análise temporal'
  },
  {
    name: 'Savings',
    href: '/savings',
    icon: DollarSign,
    description: 'Economias realizadas',
    color: 'text-green-600 dark:text-green-400'
  }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-r border-slate-200 dark:border-slate-700 fixed left-0 top-0 z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            FinOps
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Dashboard
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-100px)]">
        {navigation?.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item?.icon;

          return (
            <Link
              key={item?.name}
              href={item?.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white hover:shadow-sm dark:hover:bg-slate-800'
              )}
            >
              <Icon 
                className={cn(
                  'w-5 h-5 transition-transform duration-200 group-hover:scale-110',
                  isActive 
                    ? 'text-white' 
                    : item?.color || 'text-slate-500 dark:text-slate-400'
                )}
              />
              <div className="flex-1 min-w-0">
                <p className={cn(
                  'text-sm font-medium truncate',
                  isActive ? 'text-white' : 'text-slate-900 dark:text-white'
                )}>
                  {item?.name}
                </p>
                <p className={cn(
                  'text-xs truncate mt-0.5',
                  isActive 
                    ? 'text-blue-100' 
                    : 'text-slate-500 dark:text-slate-400'
                )}>
                  {item?.description}
                </p>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
