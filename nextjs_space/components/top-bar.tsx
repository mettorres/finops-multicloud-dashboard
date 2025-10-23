
'use client';

import { useState } from 'react';
import { Bell, Settings, User, Search, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from './date-range-picker';
import { CloudFilter } from './cloud-filter';

export function TopBar() {
  const [searchValue, setSearchValue] = useState('');
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side - Search and Filters */}
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Pesquisar recursos, serviços..."
              value={searchValue}
              onChange={(e) => setSearchValue(e?.target?.value)}
              className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600"
            />
          </div>
          
          <CloudFilter />
          <DateRangePicker />
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setFilterDialogOpen(!filterDialogOpen)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Right side - Actions and User */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative"
                onClick={(e) => {
                  // Dropdown handled by DropdownMenu component
                  e.stopPropagation();
                }}
              >
                <Bell className="w-5 h-5" />
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 w-2 h-2 p-0 text-xs"
                  onClick={(e) => {
                    // Badge click opens notification dropdown
                    e.stopPropagation();
                  }}
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-3 border-b">
                <h3 className="font-semibold">Notificações</h3>
                <p className="text-sm text-muted-foreground">3 alertas de custo</p>
              </div>
              <DropdownMenuItem className="p-3">
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm">Alto custo em EC2</p>
                  <p className="text-xs text-muted-foreground">us-east-1 • há 2 horas</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3">
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm">Recursos ociosos detectados</p>
                  <p className="text-xs text-muted-foreground">Azure • há 4 horas</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3">
                <div className="flex flex-col gap-1">
                  <p className="font-medium text-sm">Recomendação de savings plan</p>
                  <p className="text-xs text-muted-foreground">GCP • há 1 dia</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => console.log('Settings clicked')}
          >
            <Settings className="w-5 h-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={(e) => {
                  // Dropdown handled by DropdownMenu component
                  e.stopPropagation();
                }}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium">FinOps Analyst</p>
                  <p className="text-xs text-muted-foreground">analyst@company.com</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuItem>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
