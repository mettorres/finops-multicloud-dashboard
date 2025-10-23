
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  description?: string;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  className?: string;
  loading?: boolean;
}

export function MetricCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  description,
  badge,
  className,
  loading = false
}: MetricCardProps) {
  const changeColor = {
    positive: 'text-green-600 dark:text-green-400',
    negative: 'text-red-600 dark:text-red-400',
    neutral: 'text-slate-600 dark:text-slate-400'
  };

  if (loading) {
    return (
      <Card className={cn('relative overflow-hidden', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-24"></div>
          <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-32"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-20"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'relative overflow-hidden group hover:shadow-lg transition-all duration-300',
      'bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-800 dark:to-slate-900/50',
      'border-slate-200/50 dark:border-slate-700/50',
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {title}
        </CardTitle>
        <div className="flex items-center gap-2">
          {badge && (
            <Badge variant={badge?.variant || 'secondary'} className="text-xs">
              {badge?.text}
            </Badge>
          )}
          {Icon && (
            <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:scale-110 transition-transform" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {value}
          </div>
          {(change || description) && (
            <div className="flex items-center gap-2">
              {change && (
                <p className={cn('text-xs font-medium', changeColor[changeType])}>
                  {change}
                </p>
              )}
              {description && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {description}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      {/* Decorative gradient */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500"></div>
    </Card>
  );
}
