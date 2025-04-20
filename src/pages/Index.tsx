
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import PropertyGrid from '@/components/PropertyGrid';
import { properties } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';

const Index = () => {
  const { convertPrice } = useApp();
  const featuredProperties = properties.filter(property => property.featured);
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2080&q=80"
            alt="Luxury Villa" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-white text-center md:text-left md:max-w-3xl">
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Experience Luxury <span className="text-gold-light">Escapes</span> Worldwide
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">
            Discover handpicked luxury properties for unforgettable vacations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button size="lg" asChild>
              <Link to="/properties">Browse Properties</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm" asChild>
              <Link to="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <PropertyGrid 
            properties={featuredProperties} 
            title="Featured Luxury Properties" 
            subtitle="Experience the finest accommodations handpicked by our team"
            featured
          />
          <div className="text-center mt-8">
            <Button size="lg" asChild>
              <Link to="/properties">View All Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6">
                Why Choose <span className="text-gold-dark">Aurum Escape</span>
              </h2>
              <p className="text-gray-600 mb-6">
                At Aurum Escape, we're dedicated to curating the world's most exceptional vacation properties.
                From luxurious beachfront villas to charming mountain retreats, we offer unparalleled comfort,
                service, and experiences.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gold-light flex items-center justify-center mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Handpicked Properties</h4>
                    <p className="text-gray-600">All properties are personally inspected to ensure exceptional quality.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gold-light flex items-center justify-center mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">24/7 Concierge Service</h4>
                    <p className="text-gray-600">Our team is available around the clock to assist with any requests.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gold-light flex items-center justify-center mr-3 mt-0.5">
                    <svg className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">Best Price Guarantee</h4>
                    <p className="text-gray-600">Find a better price and we'll match it, plus give you 10% off.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img 
                  src="https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Luxury Amenities" 
                  className="rounded-lg object-cover h-40 w-full"
                />
                <img 
                  src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Exquisite Dining" 
                  className="rounded-lg object-cover h-64 w-full"
                />
              </div>
              <div className="space-y-4 pt-8">
                <img 
                  src="https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Infinity Pool" 
                  className="rounded-lg object-cover h-64 w-full"
                />
                <img 
                  src="https://images.unsplash.com/photo-1560185007-c5ca9d2c014d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Villa View" 
                  className="rounded-lg object-cover h-40 w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">
              Find Your Perfect <span className="text-gold-light">Escape</span>
            </h2>
            <p className="max-w-2xl mx-auto text-gray-300">
              From cozy cabins to luxurious villas, we have the perfect property for every occasion
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg p-8 text-center transform transition duration-300 hover:-translate-y-2">
              <div className="text-gold-light text-3xl font-playfair font-bold mb-2">
                {convertPrice(275)}
              </div>
              <h3 className="text-xl font-bold mb-4">Cozy Retreats</h3>
              <p className="text-gray-300 mb-6">Perfect for couples or small families seeking intimate getaways</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-gold-light mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Cabins & Cottages
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-gold-light mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  1-2 Bedrooms
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-gold-light mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Scenic Locations
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link to="/properties">Browse Options</Link>
              </Button>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-8 text-center transform transition duration-300 hover:-translate-y-2 border-2 border-gold-light">
              <div className="text-gold-light text-3xl font-playfair font-bold mb-2">
                {convertPrice(600)}
              </div>
              <h3 className="text-xl font-bold mb-4">Premium Getaways</h3>
              <p className="text-gray-300 mb-6">Spacious properties with premium amenities for the perfect vacation</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-gold-light mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Apartments & Penthouses
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-gold-light mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  3-4 Bedrooms
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-gold-light mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  City & Beach Locations
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link to="/properties">Browse Options</Link>
              </Button>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-8 text-center transform transition duration-300 hover:-translate-y-2">
              <div className="text-gold-light text-3xl font-playfair font-bold mb-2">
                {convertPrice(1200)}
              </div>
              <h3 className="text-xl font-bold mb-4">Luxury Experiences</h3>
              <p className="text-gray-300 mb-6">Exceptional properties offering the ultimate luxury experience</p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-gold-light mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Villas & Estates
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-gold-light mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  5+ Bedrooms
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-gold-light mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Exclusive Amenities
                </li>
              </ul>
              <Button className="w-full" asChild>
                <Link to="/properties">Browse Options</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gold-light">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Ready to Experience Luxury?
          </h2>
          <p className="text-gray-800 max-w-2xl mx-auto mb-8 text-lg">
            Join thousands of satisfied travelers who have found their perfect escape through our platform.
          </p>
          <Button size="lg" className="bg-gray-900 hover:bg-gray-800" asChild>
            <Link to="/register">Sign Up Today</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
