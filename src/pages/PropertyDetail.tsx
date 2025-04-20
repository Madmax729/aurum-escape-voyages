
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { getPropertyById } from '@/data/properties';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';
import { createBooking } from '@/data/bookings';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const { convertPrice } = useApp();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState(id ? getPropertyById(id) : null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const [guests, setGuests] = useState(1);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  
  const [startDate, endDate] = dateRange;

  // Calculate number of nights and total price
  const nights = startDate && endDate
    ? Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  const totalPrice = property ? property.price * Math.max(1, nights) : 0;

  useEffect(() => {
    if (id) {
      const foundProperty = getPropertyById(id);
      setProperty(foundProperty);
      
      if (!foundProperty) {
        // Property not found, redirect to properties page
        navigate('/properties');
        toast.error('Property not found');
      }
    }
  }, [id, navigate]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to book a property');
      navigate('/login');
      return;
    }
    
    if (!startDate || !endDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }
    
    if (guests < 1) {
      toast.error('Please select at least 1 guest');
      return;
    }
    
    if (property && user) {
      try {
        createBooking(property.id, user.id, startDate, endDate, guests);
        toast.success('Booking successful!');
        setBookingDialogOpen(false);
        
        // Redirect to trips page
        navigate('/trips');
      } catch (error) {
        toast.error('Failed to create booking. Please try again.');
        console.error('Booking error:', error);
      }
    }
  };

  if (!property) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Loading property...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold mb-2">{property.name}</h1>
          <div className="flex items-center text-gray-600 mb-4">
            <span>{property.location}, {property.country}</span>
            <span className="mx-2">•</span>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gold-dark">
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
              <span className="ml-1">{property.rating}</span>
              <span className="ml-1 text-sm">({property.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Property Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="overflow-hidden rounded-lg">
            <img 
              src={property.images[activeImageIndex]} 
              alt={property.name} 
              className="w-full h-[400px] object-cover" 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {property.images.map((image, index) => (
              <div 
                key={index} 
                className={`overflow-hidden rounded-lg cursor-pointer ${index === activeImageIndex ? 'ring-2 ring-gold-dark' : ''}`}
                onClick={() => setActiveImageIndex(index)}
              >
                <img src={image} alt={`${property.name} ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="host">Host</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="animate-fade-in">
                <div className="mb-6">
                  <h2 className="text-xl font-bold mb-4">About this property</h2>
                  <p className="text-gray-600">{property.description}</p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-gray-600 mb-1">Type</div>
                    <div className="font-semibold">{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-gray-600 mb-1">Bedrooms</div>
                    <div className="font-semibold">{property.bedrooms}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-gray-600 mb-1">Bathrooms</div>
                    <div className="font-semibold">{property.bathrooms}</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-gray-600 mb-1">Max Guests</div>
                    <div className="font-semibold">{property.maxGuests}</div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="amenities" className="animate-fade-in">
                <h2 className="text-xl font-bold mb-4">Amenities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {property.amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gold-dark mr-2">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="host" className="animate-fade-in">
                <div className="flex items-center mb-4">
                  <div className="mr-4">
                    <img 
                      src={property.host.image} 
                      alt={property.host.name} 
                      className="w-16 h-16 rounded-full object-cover" 
                    />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Hosted by {property.host.name}</h2>
                    <p className="text-gray-600">Superhost · 5 years hosting</p>
                  </div>
                </div>
                <p className="text-gray-600 mb-6">
                  {property.host.name} is a Superhost with over 100 five-star reviews. They're committed to providing great stays for their guests.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <div className="font-medium mb-2">Languages</div>
                  <div className="text-gray-600">English, French, Spanish</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium mb-2">Response rate</div>
                  <div className="text-gray-600">100% within a few hours</div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 sticky top-24">
              <div className="mb-4">
                <span className="text-2xl font-bold">{convertPrice(property.price)}</span>
                <span className="text-gray-500"> / night</span>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-gold-dark">
                    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 font-medium">{property.rating}</span>
                  <span className="mx-1 text-gray-500">·</span>
                  <span className="text-gray-500">{property.reviewCount} reviews</span>
                </div>
              </div>
              
              <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mb-4">Book Now</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Book Your Stay</DialogTitle>
                    <DialogDescription>
                      Select your dates and number of guests to book {property.name}.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="py-4">
                    <div className="mb-4">
                      <Label>Select Dates</Label>
                      <div className="mt-2 border rounded-md p-2">
                        <Calendar
                          mode="range"
                          selected={{
                            from: dateRange[0],
                            to: dateRange[1],
                          }}
                          onSelect={(range) => {
                            if (range?.from && range?.to) {
                              setDateRange([range.from, range.to]);
                            }
                          }}
                          numberOfMonths={2}
                          className="rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <Label htmlFor="guests">Number of Guests</Label>
                      <Select
                        value={String(guests)}
                        onValueChange={(value) => setGuests(parseInt(value))}
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select number of guests" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: property.maxGuests }, (_, i) => (
                            <SelectItem key={i + 1} value={String(i + 1)}>
                              {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {startDate && endDate && (
                      <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-md">
                        <div className="flex justify-between">
                          <span>
                            {convertPrice(property.price)} x {nights} night{nights !== 1 ? 's' : ''}
                          </span>
                          <span>{convertPrice(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between font-bold">
                          <span>Total</span>
                          <span>{convertPrice(totalPrice)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button onClick={handleBookNow} disabled={!startDate || !endDate}>
                      Confirm Booking
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <div className="text-center text-sm text-gray-500">
                You won't be charged yet
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold mb-2">Property Highlights</h3>
                <ul className="space-y-2">
                  {property.amenities.slice(0, 3).map((amenity, index) => (
                    <li key={index} className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gold-dark mr-2 flex-shrink-0">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                      <span>{amenity}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PropertyDetail;
