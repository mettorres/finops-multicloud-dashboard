
'use client';

import { useState } from 'react';
import { Calendar, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { addDays, format, subDays, subMonths } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  className?: string;
  onChange?: (dateRange: DateRange | undefined) => void;
}

export function DateRangePicker({ className, onChange }: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 3),
    to: new Date(),
  });

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
    onChange?.(newDate);
  };

  const presetRanges = [
    {
      label: 'Últimos 7 dias',
      range: { from: subDays(new Date(), 7), to: new Date() }
    },
    {
      label: 'Últimos 30 dias',
      range: { from: subDays(new Date(), 30), to: new Date() }
    },
    {
      label: 'Últimos 3 meses',
      range: { from: subMonths(new Date(), 3), to: new Date() }
    },
    {
      label: 'Últimos 6 meses',
      range: { from: subMonths(new Date(), 6), to: new Date() }
    },
    {
      label: 'Último ano',
      range: { from: subMonths(new Date(), 12), to: new Date() }
    }
  ];

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            size="sm"
            className={cn(
              'justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'dd/MM/yy')} - {format(date.to, 'dd/MM/yy')}
                </>
              ) : (
                format(date.from, 'dd/MM/yy')
              )
            ) : (
              <span>Selecionar período</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="flex">
            {/* Preset ranges */}
            <div className="border-r p-3 space-y-1">
              <h4 className="text-sm font-medium mb-2">Períodos</h4>
              {presetRanges?.map((preset, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-xs"
                  onClick={() => handleDateChange(preset?.range)}
                >
                  {preset?.label}
                </Button>
              ))}
            </div>
            
            {/* Calendar */}
            <CalendarComponent
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={handleDateChange}
              numberOfMonths={2}
              className="p-3"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
