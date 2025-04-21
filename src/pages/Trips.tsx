
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Booking, getUserBookings } from '@/data/bookings';
import QRCode from '@/components/QRCode';
import { useTiltNavigation } from '@/hooks/useTiltNavigation';

const Trips = () => {
  const { isAuthenticated, profile } = useAuth();
  const [bookings, setBookings] = useState<ReturnType<typeof getUserBookings>>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Use tilt navigation to navigate from trips to explore page
  useTiltNavigation('/trips', '/properties');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (profile) {
      const userBookings = getUserBookings(profile.id);
      setBookings(userBookings);
      setLoading(false);
    }
  }, [isAuthenticated, profile, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Loading your trips...</h2>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Please log in to view your trips</h2>
          <Button onClick={() => navigate('/login')}>Log In</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-6">My Trips</h1>
        
        {bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">You have no upcoming trips</h2>
            <p className="text-gray-500 mb-6">Explore luxury properties and book your next getaway today.</p>
            <Button onClick={() => navigate('/properties')}>Explore Properties</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="grid md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                  <div className="md:col-span-9 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-2xl font-playfair font-bold text-gray-800">{booking.property.name}</h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'upcoming' 
                          ? 'bg-blue-100 text-blue-800' 
                          : booking.status === 'ongoing'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'completed'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{booking.property.location.address}, {booking.property.location.city}</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Check-in</h3>
                        <p className="mt-1 font-medium">{format(booking.startDate, 'MMM d, yyyy')}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Check-out</h3>
                        <p className="mt-1 font-medium">{format(booking.endDate, 'MMM d, yyyy')}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Guests</h3>
                        <p className="mt-1 font-medium">{booking.guests} guests</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Total Price</h3>
                        <p className="mt-1 font-medium">${booking.totalPrice}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <Button 
                        variant="outline" 
                        onClick={() => navigate(`/properties/${booking.propertyId}`)}
                      >
                        View Property
                      </Button>
                      {booking.status === 'upcoming' && (
                        <Button 
                          variant="destructive"
                          onClick={() => toast.error('This feature is not yet implemented')}
                        >
                          Cancel Booking
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="md:col-span-3 p-6 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-semibold mb-3">Booking QR Code</h3>
                    <div className="bg-white p-2 rounded-lg border border-gray-200">
                      <QRCode
                        value={JSON.stringify({
                          bookingId: booking.id,
                          propertyId: booking.propertyId,
                          propertyName: booking.property.name,
                          startDate: booking.startDate.toISOString(),
                          endDate: booking.endDate.toISOString(),
                          guests: booking.guests,
                          totalPrice: booking.totalPrice,
                          status: booking.status
                        })}
                        size={150}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2 text-center">Show this at check-in</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">Tip:</span> Tilt your device to navigate to the Explore page!
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Trips;
