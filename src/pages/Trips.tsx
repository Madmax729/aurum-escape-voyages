
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { getUserBookings, Booking } from '@/data/bookings';
import { Property } from '@/data/properties';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { format } from 'date-fns';
import { useTiltNavigation } from '@/hooks/useTiltNavigation';

interface EnhancedBooking extends Booking {
  property: Property;
}

const Trips = () => {
  const { isAuthenticated, profile } = useAuth();
  const { convertPrice } = useApp();
  const navigate = useNavigate();
  
  const [bookings, setBookings] = useState<EnhancedBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Implement tilt navigation from trips to explore page
  useTiltNavigation('/trips', '/properties');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (profile) {
      // Load user bookings
      const userBookings = getUserBookings(profile.id);
      setBookings(userBookings);
    }
    
    setLoading(false);
  }, [isAuthenticated, profile, navigate]);

  const upcomingBookings = bookings.filter(booking => booking.status === 'upcoming');
  const pastBookings = bookings.filter(booking => booking.status === 'completed');

  const formatDateRange = (startDate: Date, endDate: Date) => {
    return `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Loading your trips...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-6">My Trips</h1>
        <p className="text-gray-600 mb-4">Tilt your device to navigate to the Explore page</p>
        
        <Tabs defaultValue="upcoming" className="mb-8">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Trips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="animate-fade-in mt-4">
            {upcomingBookings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium mb-2">No upcoming trips</h3>
                <p className="text-gray-500 mb-6">Time to start planning your next adventure!</p>
                <Button asChild>
                  <a href="/properties">Find a place to stay</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingBookings.map(booking => (
                  <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    <div className="relative h-48">
                      <img 
                        src={booking.property.images[0]} 
                        alt={booking.property.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                        <div className="text-lg font-medium">{booking.property.name}</div>
                        <div className="text-sm">{booking.property.location}, {booking.property.country}</div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-semibold">{formatDateRange(booking.startDate, booking.endDate)}</div>
                        <div className="text-sm bg-gold-light bg-opacity-20 text-gold-dark px-3 py-1 rounded-full">
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-gray-500">Guests</div>
                          <div>{booking.guests}</div>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <div className="text-gray-500">Total</div>
                          <div className="font-medium">{convertPrice(booking.totalPrice)}</div>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full" asChild>
                        <a href={`/properties/${booking.propertyId}`}>View Property</a>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="animate-fade-in mt-4">
            {pastBookings.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-medium mb-2">No past trips</h3>
                <p className="text-gray-500 mb-6">Your completed trips will appear here</p>
                <Button asChild>
                  <a href="/properties">Find a place to stay</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pastBookings.map(booking => (
                  <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    <div className="relative h-48">
                      <img 
                        src={booking.property.images[0]} 
                        alt={booking.property.name} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                        <div className="text-lg font-medium">{booking.property.name}</div>
                        <div className="text-sm">{booking.property.location}, {booking.property.country}</div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-semibold">{formatDateRange(booking.startDate, booking.endDate)}</div>
                        <div className="text-sm bg-gray-200 px-3 py-1 rounded-full">
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <Button variant="outline" className="w-full" asChild>
                          <a href={`/properties/${booking.propertyId}`}>View Property</a>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Trips;
