
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { FilterOptions, PropertyType } from '@/data/properties';

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
  maxPrice?: number;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange, maxPrice = 2000 }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    type: undefined,
    minPrice: 0,
    maxPrice: maxPrice,
    location: '',
  });

  const propertyTypes: PropertyType[] = ['villa', 'cabin', 'cottage', 'apartment', 'hostel', 'hotel'];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFilters = { ...filters, search: e.target.value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleTypeChange = (value: PropertyType) => {
    const updatedFilters = { ...filters, type: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handlePriceChange = (value: number[]) => {
    const updatedFilters = { ...filters, maxPrice: value[0] };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedFilters = { ...filters, location: e.target.value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: '',
      type: undefined,
      minPrice: 0,
      maxPrice: maxPrice,
      location: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <Input
            id="search"
            placeholder="Search properties..."
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Property Type
          </label>
          <Select
            value={filters.type}
            onValueChange={(value: PropertyType) => handleTypeChange(value)}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any type</SelectItem>
              {propertyTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Price: ${filters.maxPrice}
          </label>
          <Slider
            value={[filters.maxPrice || maxPrice]}
            max={maxPrice}
            step={50}
            onValueChange={handlePriceChange}
            className="py-2"
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <Input
            id="location"
            placeholder="Any location"
            value={filters.location}
            onChange={handleLocationChange}
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button variant="outline" size="sm" onClick={handleReset} className="mr-2">
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterBar;
