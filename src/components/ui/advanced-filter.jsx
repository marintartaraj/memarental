import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

export const AdvancedFilter = ({
  filters = {},
  filterOptions = {},
  onFilterChange,
  onFiltersChange,
  searchPlaceholder = "Search...",
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...localFilters, [filterType]: value };
    setLocalFilters(newFilters);
    onFilterChange(filterType, value);
  };

  const handleRangeChange = (filterType, rangeType, value) => {
    const newFilters = {
      ...localFilters,
      [filterType]: {
        ...localFilters[filterType],
        [rangeType]: value
      }
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {};
    Object.keys(filters).forEach(key => {
      if (typeof filters[key] === 'object' && filters[key] !== null) {
        clearedFilters[key] = {};
      } else {
        clearedFilters[key] = '';
      }
    });
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => {
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v !== '' && v !== 'all');
    }
    return value !== '' && value !== 'all';
  });

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 mr-1" />
              ) : (
                <ChevronDown className="w-4 h-4 mr-1" />
              )}
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          {filterOptions.status && (
            <Select 
              value={filters.status || 'all'} 
              onValueChange={(value) => handleFilterChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {filterOptions.status.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Date Filter */}
          {filterOptions.dateFilter && (
            <Select 
              value={filters.dateFilter || 'all'} 
              onValueChange={(value) => handleFilterChange('dateFilter', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="past">Past</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Advanced Filters */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Fuel Type Filter */}
              {filterOptions.fuelType && (
                <div>
                  <Label className="text-sm font-medium">Fuel Type</Label>
                  <Select 
                    value={filters.fuelType || 'all'} 
                    onValueChange={(value) => handleFilterChange('fuelType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Fuel Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fuel Types</SelectItem>
                      {filterOptions.fuelType.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Transmission Filter */}
              {filterOptions.transmission && (
                <div>
                  <Label className="text-sm font-medium">Transmission</Label>
                  <Select 
                    value={filters.transmission || 'all'} 
                    onValueChange={(value) => handleFilterChange('transmission', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Transmission" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Transmissions</SelectItem>
                      {filterOptions.transmission.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Seats Filter */}
              {filterOptions.seats && (
                <div>
                  <Label className="text-sm font-medium">Seats</Label>
                  <Select 
                    value={filters.seats || 'all'} 
                    onValueChange={(value) => handleFilterChange('seats', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seats" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Seats</SelectItem>
                      {[2, 4, 5, 7, 8].map(seats => (
                        <SelectItem key={seats} value={seats.toString()}>
                          {seats} seats
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Price Range */}
            {filterOptions.priceRange && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Price Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Min Price</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={filters.priceRange?.min || ''}
                      onChange={(e) => handleRangeChange('priceRange', 'min', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Max Price</Label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={filters.priceRange?.max || ''}
                      onChange={(e) => handleRangeChange('priceRange', 'max', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Year Range */}
            {filterOptions.yearRange && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Year Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500">Min Year</Label>
                    <Input
                      type="number"
                      placeholder="2000"
                      value={filters.yearRange?.min || ''}
                      onChange={(e) => handleRangeChange('yearRange', 'min', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Max Year</Label>
                    <Input
                      type="number"
                      placeholder={new Date().getFullYear()}
                      value={filters.yearRange?.max || ''}
                      onChange={(e) => handleRangeChange('yearRange', 'max', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedFilter;

