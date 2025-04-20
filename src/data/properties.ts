
export type PropertyType = 'villa' | 'cabin' | 'cottage' | 'apartment' | 'hostel' | 'hotel';

export interface Property {
  id: string;
  name: string;
  description: string;
  price: number;
  location: string;
  country: string;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  images: string[];
  host: {
    id: string;
    name: string;
    image: string;
  };
  featured?: boolean;
}

// Mock property data
export const properties: Property[] = [
  {
    id: '1',
    name: 'Luxury Oceanfront Villa',
    description: 'Exquisite villa with panoramic ocean views, private infinity pool, and direct beach access. Perfect for a luxurious getaway.',
    price: 1200,
    location: 'Malibu, California',
    country: 'United States',
    type: 'villa',
    bedrooms: 5,
    bathrooms: 6,
    maxGuests: 10,
    rating: 4.9,
    reviewCount: 127,
    amenities: ['Private Pool', 'Beachfront', 'Hot Tub', 'Chef\'s Kitchen', 'Home Theater', 'Gym', 'WiFi'],
    images: [
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914',
      'https://images.unsplash.com/photo-1591825729269-caeb344f6df2',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'
    ],
    host: {
      id: 'h1',
      name: 'Alexandra',
      image: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    featured: true
  },
  {
    id: '2',
    name: 'Mountain Retreat Cabin',
    description: 'Secluded cabin nestled in the mountains with breathtaking views. Featuring a hot tub, fireplace, and modern amenities.',
    price: 350,
    location: 'Aspen, Colorado',
    country: 'United States',
    type: 'cabin',
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    rating: 4.8,
    reviewCount: 95,
    amenities: ['Hot Tub', 'Fireplace', 'Mountain View', 'Hiking Trails', 'WiFi', 'Fully Equipped Kitchen'],
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c',
      'https://images.unsplash.com/photo-1631679706909-1844bbd07221',
      'https://images.unsplash.com/photo-1604014938212-ccb14b5ace9b'
    ],
    host: {
      id: 'h2',
      name: 'Michael',
      image: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  },
  {
    id: '3',
    name: 'Tuscan Countryside Villa',
    description: 'Authentic Tuscan villa surrounded by vineyards and olive groves. Experience the Italian dolce vita with wine tastings and local cuisine.',
    price: 800,
    location: 'Siena, Tuscany',
    country: 'Italy',
    type: 'villa',
    bedrooms: 4,
    bathrooms: 4,
    maxGuests: 8,
    rating: 4.95,
    reviewCount: 83,
    amenities: ['Private Pool', 'Vineyard Views', 'Wine Cellar', 'Garden', 'Pizza Oven', 'WiFi'],
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf',
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc'
    ],
    host: {
      id: 'h3',
      name: 'Marco',
      image: 'https://randomuser.me/api/portraits/men/62.jpg'
    },
    featured: true
  },
  {
    id: '4',
    name: 'Cozy Lakeside Cottage',
    description: 'Charming cottage with direct access to a pristine lake. Perfect for a peaceful retreat with fishing, swimming, and relaxation.',
    price: 275,
    location: 'Lake Tahoe',
    country: 'United States',
    type: 'cottage',
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    rating: 4.7,
    reviewCount: 68,
    amenities: ['Lake Access', 'Boat Dock', 'Fireplace', 'BBQ', 'Fishing Equipment', 'WiFi'],
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365'
    ],
    host: {
      id: 'h4',
      name: 'Emily',
      image: 'https://randomuser.me/api/portraits/women/24.jpg'
    }
  },
  {
    id: '5',
    name: 'Luxury Penthouse Apartment',
    description: 'Elegant penthouse with stunning city views. Features a private terrace, modern art, and premium amenities in the heart of downtown.',
    price: 600,
    location: 'New York City',
    country: 'United States',
    type: 'apartment',
    bedrooms: 3,
    bathrooms: 3,
    maxGuests: 6,
    rating: 4.85,
    reviewCount: 112,
    amenities: ['City Views', 'Private Terrace', 'Doorman', 'Gym Access', 'Smart Home', 'WiFi'],
    images: [
      'https://images.unsplash.com/photo-1560448075-57d0285fc59b',
      'https://images.unsplash.com/photo-1565183997392-2f6f122e5912',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267'
    ],
    host: {
      id: 'h5',
      name: 'Jason',
      image: 'https://randomuser.me/api/portraits/men/42.jpg'
    }
  },
  {
    id: '6',
    name: 'Tropical Beach Villa',
    description: 'Exquisite beachfront villa with private pool and tropical garden. Experience paradise with direct access to pristine white sand beaches.',
    price: 950,
    location: 'Bali',
    country: 'Indonesia',
    type: 'villa',
    bedrooms: 4,
    bathrooms: 5,
    maxGuests: 8,
    rating: 5.0,
    reviewCount: 74,
    amenities: ['Private Pool', 'Beachfront', 'Outdoor Shower', 'Garden', 'Daily Housekeeping', 'WiFi'],
    images: [
      'https://images.unsplash.com/photo-1605538032404-8789929dae1f',
      'https://images.unsplash.com/photo-1587814285933-d9a0155899c1',
      'https://images.unsplash.com/photo-1518684079-3c830dcef090'
    ],
    host: {
      id: 'h6',
      name: 'Ayu',
      image: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    featured: true
  },
  {
    id: '7',
    name: 'Alpine Ski Chalet',
    description: 'Luxurious ski-in/ski-out chalet with breathtaking mountain views. Features a sauna, fireplace, and premium amenities for the perfect winter getaway.',
    price: 580,
    location: 'Zermatt',
    country: 'Switzerland',
    type: 'cabin',
    bedrooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    rating: 4.9,
    reviewCount: 91,
    amenities: ['Ski-in/Ski-out', 'Sauna', 'Mountain Views', 'Fireplace', 'Boot Warmers', 'WiFi'],
    images: [
      'https://images.unsplash.com/photo-1520984032042-162d526883e0',
      'https://images.unsplash.com/photo-1559767949-0faa5c7e9992',
      'https://images.unsplash.com/photo-1551524559-a7e4ae81ae12'
    ],
    host: {
      id: 'h7',
      name: 'Thomas',
      image: 'https://randomuser.me/api/portraits/men/18.jpg'
    }
  },
  {
    id: '8',
    name: 'Historic City Apartment',
    description: 'Elegant apartment in a historic building with original features and modern comforts. Located in the heart of the old town.',
    price: 320,
    location: 'Prague',
    country: 'Czech Republic',
    type: 'apartment',
    bedrooms: 2,
    bathrooms: 1,
    maxGuests: 4,
    rating: 4.7,
    reviewCount: 56,
    amenities: ['Historic Building', 'City Views', 'Fully Equipped Kitchen', 'High Ceilings', 'WiFi'],
    images: [
      'https://images.unsplash.com/photo-1556912167-f556f1f39fda',
      'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92',
      'https://images.unsplash.com/photo-1580477371234-0e37e6c98ef3'
    ],
    host: {
      id: 'h8',
      name: 'Katerina',
      image: 'https://randomuser.me/api/portraits/women/35.jpg'
    }
  }
];

// Function to get a property by ID
export const getPropertyById = (id: string): Property | undefined => {
  return properties.find(property => property.id === id);
};

// Function to filter properties based on search criteria
export interface FilterOptions {
  search?: string;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

export const filterProperties = (options: FilterOptions): Property[] => {
  return properties.filter(property => {
    // Filter by search term (name or description)
    if (options.search && 
        !property.name.toLowerCase().includes(options.search.toLowerCase()) && 
        !property.description.toLowerCase().includes(options.search.toLowerCase()) &&
        !property.location.toLowerCase().includes(options.search.toLowerCase())) {
      return false;
    }
    
    // Filter by property type
    if (options.type && property.type !== options.type) {
      return false;
    }
    
    // Filter by price range
    if (options.minPrice !== undefined && property.price < options.minPrice) {
      return false;
    }
    if (options.maxPrice !== undefined && property.price > options.maxPrice) {
      return false;
    }
    
    // Filter by location
    if (options.location && 
        !property.location.toLowerCase().includes(options.location.toLowerCase()) &&
        !property.country.toLowerCase().includes(options.location.toLowerCase())) {
      return false;
    }
    
    return true;
  });
};
