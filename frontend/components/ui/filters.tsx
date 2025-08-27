import React, { useState, useCallback } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Search, Filter, X, RotateCcw } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'search' | 'date' | 'range';
  options?: FilterOption[];
  placeholder?: string;
  multiple?: boolean;
}

export interface FilterState {
  [key: string]: string | string[] | undefined;
}

interface FiltersProps {
  config: FilterConfig[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset?: () => void;
  className?: string;
  showAdvanced?: boolean;
  searchPlaceholder?: string;
}

export function Filters({
  config,
  filters,
  onFiltersChange,
  onReset,
  className,
  showAdvanced = false,
  searchPlaceholder = "Rechercher...",
}: FiltersProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(showAdvanced);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const updateFilter = useCallback((key: string, value: string | string[] | undefined) => {
    const newFilters = { ...localFilters };
    if (value === undefined || value === '') {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    setLocalFilters(newFilters);
  }, [localFilters]);

  const applyFilters = useCallback(() => {
    onFiltersChange(localFilters);
  }, [localFilters, onFiltersChange]);

  const resetFilters = useCallback(() => {
    setLocalFilters({});
    onFiltersChange({});
    onReset?.();
  }, [onFiltersChange, onReset]);

  const hasActiveFilters = Object.keys(filters).length > 0;

  const renderFilterInput = (filterConfig: FilterConfig) => {
    const value = localFilters[filterConfig.key];

    switch (filterConfig.type) {
      case 'search':
        return (
          <Input
            placeholder={filterConfig.placeholder || searchPlaceholder}
            value={value as string || ''}
            onChange={(e) => updateFilter(filterConfig.key, e.target.value)}
            className="w-full"
          />
        );

      case 'select':
        return (
          <Select
            value={value as string || ''}
            onValueChange={(val) => updateFilter(filterConfig.key, val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={filterConfig.placeholder || `Sélectionner ${filterConfig.label}`} />
            </SelectTrigger>
            <SelectContent>
              {filterConfig.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center justify-between w-full">
                    <span>{option.label}</span>
                    {option.count !== undefined && (
                      <Badge variant="secondary" className="ml-2">
                        {option.count}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      default:
        return null;
    }
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Filtres</CardTitle>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="h-8"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Réinitialiser
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="h-8"
            >
              <Filter className="h-4 w-4 mr-1" />
              {isAdvancedOpen ? 'Masquer' : 'Avancé'}
            </Button>
          </div>
        </div>

        {/* Barre de recherche principale */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={localFilters.search as string || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>

      {isAdvancedOpen && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {config.map((filterConfig) => (
              <div key={filterConfig.key} className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  {filterConfig.label}
                </label>
                {renderFilterInput(filterConfig)}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex flex-wrap gap-2">
              {Object.entries(localFilters).map(([key, value]) => {
                if (!value || value === '') return null;
                const filterConfig = config.find(f => f.key === key);
                const label = filterConfig?.label || key;
                const displayValue = Array.isArray(value) ? value.join(', ') : value;

                return (
                  <Badge
                    key={key}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <span className="text-xs">{label}: {displayValue}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => updateFilter(key, undefined)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                );
              })}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocalFilters(filters)}
              >
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={applyFilters}
              >
                Appliquer
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// Hook pour gérer les filtres
export function useFilters(initialFilters: FilterState = {}) {
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const updateFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  const setFilter = useCallback((key: string, value: string | string[] | undefined) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      if (value === undefined || value === '') {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }
      return newFilters;
    });
  }, []);

  const clearFilter = useCallback((key: string) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  }, []);

  return {
    filters,
    updateFilters,
    resetFilters,
    setFilter,
    clearFilter,
    hasFilters: Object.keys(filters).length > 0,
  };
}
