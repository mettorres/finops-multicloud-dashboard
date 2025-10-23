
'use client';

import { useState } from 'react';
import { Cloud, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CloudProvider {
  id: string;
  name: string;
  displayName: string;
  color: string;
}

const cloudProviders: CloudProvider[] = [
  { id: 'aws', name: 'aws', displayName: 'AWS', color: 'text-orange-600' },
  { id: 'azure', name: 'azure', displayName: 'Azure', color: 'text-blue-600' },
  { id: 'gcp', name: 'gcp', displayName: 'GCP', color: 'text-green-600' },
];

interface CloudFilterProps {
  onChange?: (selectedClouds: string[]) => void;
  defaultSelected?: string[];
}

export function CloudFilter({ onChange, defaultSelected = [] }: CloudFilterProps) {
  const [selectedClouds, setSelectedClouds] = useState<string[]>(defaultSelected);

  const handleToggleCloud = (cloudId: string) => {
    const newSelection = selectedClouds?.includes(cloudId)
      ? selectedClouds?.filter(id => id !== cloudId)
      : [...selectedClouds, cloudId];
    
    setSelectedClouds(newSelection);
    onChange?.(newSelection);
  };

  const handleSelectAll = () => {
    const allIds = cloudProviders?.map(cloud => cloud?.id);
    setSelectedClouds(allIds);
    onChange?.(allIds);
  };

  const handleClearAll = () => {
    setSelectedClouds([]);
    onChange?.([]);
  };

  const selectedCount = selectedClouds?.length;
  const allSelected = selectedCount === cloudProviders?.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={(e) => {
            // Dropdown handled by DropdownMenu component
            e.stopPropagation();
          }}
        >
          <Cloud className="w-4 h-4" />
          <span>Clouds</span>
          {selectedCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 min-w-5 text-xs">
              {selectedCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Filtros de Cloud</span>
            <div className="flex gap-1">
              {!allSelected && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={handleSelectAll}
                >
                  Todos
                </Button>
              )}
              {selectedCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={handleClearAll}
                >
                  Limpar
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {cloudProviders?.map((cloud) => {
          const isSelected = selectedClouds?.includes(cloud?.id);
          
          return (
            <DropdownMenuItem
              key={cloud?.id}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleToggleCloud(cloud?.id)}
            >
              <div className="flex items-center justify-center w-4 h-4">
                {isSelected && <Check className="w-3 h-3" />}
              </div>
              <Cloud className={cn('w-4 h-4', cloud?.color)} />
              <span className="flex-1">{cloud?.displayName}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
