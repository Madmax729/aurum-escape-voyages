
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PropertyGrid from '@/components/PropertyGrid';
import FilterBar from '@/components/FilterBar';
import { properties, filterProperties, FilterOptions } from '@/data/properties';

const Properties = () => {
  const [filteredProperties, setFilteredProperties] = useState(properties);

  const handleFilterChange = (filters: FilterOptions) => {
    const filtered = filterProperties(filters);
    setFilteredProperties(filtered);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Explore Properties</h1>
          <p className="text-gray-600 max-w-3xl">
            Discover our handpicked selection of luxury properties around the world. 
            Use the filters below to find your perfect escape.
          </p>
        </div>

        <FilterBar onFilterChange={handleFilterChange} maxPrice={2000} />
        
        <PropertyGrid 
          properties={filteredProperties} 
          title={filteredProperties.length > 0 ? `${filteredProperties.length} Properties Found` : ''} 
        />
      </div>
    </Layout>
  );
};

export default Properties;
