
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Download, Maximize2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface ChartWrapperProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  actions?: React.ReactNode;
}

export function ChartWrapper({
  title,
  description,
  children,
  className,
  loading = false,
  actions
}: ChartWrapperProps) {
  if (loading) {
    return (
      <Card className={cn('', className)}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-32"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-48"></div>
          </div>
          <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      'bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-800 dark:to-slate-900/30',
      'border-slate-200/50 dark:border-slate-700/50',
      'shadow-sm hover:shadow-md transition-shadow duration-200',
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </CardTitle>
          {description && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {actions}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2">
                <Download className="w-4 h-4" />
                Exportar dados
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Maximize2 className="w-4 h-4" />
                Expandir gráfico
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
