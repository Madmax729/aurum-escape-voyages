
import React from 'react';
import PropertyCard from './PropertyCard';
import { Property } from '@/data/properties';

interface PropertyGridProps {
  properties: Property[];
  title?: string;
  subtitle?: string;
  featured?: boolean;
}

const PropertyGrid: React.FC<PropertyGridProps> = ({ 
  properties, 
  title, 
  subtitle,
  featured = false
}) => {
  if (properties.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-medium mb-2">No properties found</h3>
        <p className="text-gray-500">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {title && (
        <div className="mb-6 text-center">
          <h2 className="font-playfair text-3xl font-semibold mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map(property => (
          <PropertyCard 
            key={property.id} 
            property={property} 
          />
        ))}
      </div>
    </div>
  );
};

export default PropertyGrid;
