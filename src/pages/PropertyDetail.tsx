
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import QRCode from '@/components/QRCode';
import MapView from '@/components/MapView';

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, profile } = useAuth();
  const { convertPrice } = useApp();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState(id ? getPropertyById(id) : null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>([undefined, undefined]);
  const [guests, setGuests] = useState(1);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [receiptSheetOpen, setReceiptSheetOpen] = useState(false);
  const [bookingReceipt, setBookingReceipt] = useState<any>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

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

  // Check if property is in user's wishlist
  useEffect(() => {
    if (!isAuthenticated || !profile || !id) return;

    const checkWishlist = async () => {
      const { data, error } = await supabase
        .from('wishlists')
        .select('id')
        .eq('user_id', profile.id)
        .eq('property_id', id)
        .single();

      if (!error && data) {
        setIsWishlisted(true);
      }
    };

    checkWishlist();
  }, [isAuthenticated, profile, id]);

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to save to wishlist');
      navigate('/login');
      return;
    }

    if (isWishlistLoading || !id) return;
    setIsWishlistLoading(true);

    try {
      if (isWishlisted) {
        // Remove from wishlist
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', profile?.id)
          .eq('property_id', id);

        if (error) throw error;
        
        setIsWishlisted(false);
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        const { error } = await supabase
          .from('wishlists')
          .insert({
            user_id: profile?.id,
            property_id: id
          });

        if (error) throw error;
        
        setIsWishlisted(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsWishlistLoading(false);
    }
  };

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
    
    if (property && profile) {
      try {
        const booking = createBooking(property.id, profile.id, startDate, endDate, guests);
        
        // Create booking receipt
        setBookingReceipt({
          bookingId: booking.id,
          propertyName: property.name,
          location: `${property.location}, ${property.country}`,
          checkIn: startDate.toLocaleDateString(),
          checkOut: endDate.toLocaleDateString(),
          guests: guests,
          nights: nights,
          price: property.price,
          totalPrice: totalPrice,
          bookingDate: new Date().toLocaleDateString(),
          customerName: profile.name,
          customerEmail: profile.email
        });
        
        toast.success('Booking successful!');
        setBookingDialogOpen(false);
        setReceiptSheetOpen(true);
      } catch (error) {
        toast.error('Failed to create booking. Please try again.');
        console.error('Booking error:', error);
      }
    }
  };

  const generateReceiptQRData = () => {
    if (!bookingReceipt) return '';
    
    return JSON.stringify({
      type: 'booking_receipt',
      ...bookingReceipt
    });
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
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold">{property.name}</h1>
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 ${isWishlisted ? 'text-red-500' : ''}`}
              onClick={toggleWishlist}
              disabled={isWishlistLoading}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              {isWishlisted ? 'Saved' : 'Save to Wishlist'}
            </Button>
          </div>
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
                <TabsTrigger value="map">Location</TabsTrigger>
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
              
              <TabsContent value="map" className="animate-fade-in">
                <h2 className="text-xl font-bold mb-4">Location</h2>
                <p className="text-gray-600 mb-4">Explore the area around {property.name} in {property.location}, {property.country}.</p>
                <MapView properties={[property]} />
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

      {/* Booking Receipt Sheet */}
      <Sheet open={receiptSheetOpen} onOpenChange={setReceiptSheetOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Booking Confirmation</SheetTitle>
            <SheetDescription>Your booking details and receipt</SheetDescription>
          </SheetHeader>
          
          {bookingReceipt && (
            <div className="mt-6 space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">{bookingReceipt.propertyName}</h3>
                <p className="text-gray-600">{bookingReceipt.location}</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-500">Check-in</h4>
                    <p className="font-medium">{bookingReceipt.checkIn}</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Check-out</h4>
                    <p className="font-medium">{bookingReceipt.checkOut}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm text-gray-500">Guests</h4>
                  <p className="font-medium">{bookingReceipt.guests} guest{bookingReceipt.guests !== 1 ? 's' : ''}</p>
                </div>
                
                <div>
                  <h4 className="text-sm text-gray-500">Booking ID</h4>
                  <p className="font-medium">{bookingReceipt.bookingId}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="font-bold mb-3">Price Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{convertPrice(bookingReceipt.price)} x {bookingReceipt.nights} night{bookingReceipt.nights !== 1 ? 's' : ''}</span>
                    <span>{convertPrice(bookingReceipt.totalPrice)}</span>
                  </div>
                  <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>{convertPrice(bookingReceipt.totalPrice)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center justify-center pt-4 border-t">
                <h3 className="font-bold mb-3">Booking QR Code</h3>
                <div className="bg-white p-2 rounded-lg shadow-md">
                  <QRCode 
                    value={generateReceiptQRData()} 
                    size={200}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Scan this code at check-in or save for your records
                </p>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button onClick={() => {
                  setReceiptSheetOpen(false);
                  navigate('/trips');
                }}>
                  View All Trips
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </Layout>
  );
};

export default PropertyDetail;
