
import { Property, getPropertyById } from '@/data/properties';

export type BookingStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  userId: string;
  propertyId: string;
  property: Property;
  startDate: Date;
  endDate: Date;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
}

// Mock bookings data
const bookings: Booking[] = [
  {
    id: 'b1',
    userId: 'u1',
    propertyId: '1',
    property: getPropertyById('1')!,
    startDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    endDate: new Date(new Date().setDate(new Date().getDate() + 35)),
    guests: 4,
    totalPrice: 6000,
    status: 'upcoming',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5))
  },
  {
    id: 'b2',
    userId: 'u1',
    propertyId: '3',
    property: getPropertyById('3')!,
    startDate: new Date(new Date().setDate(new Date().getDate() - 10)),
    endDate: new Date(new Date().setDate(new Date().getDate() - 5)),
    guests: 2,
    totalPrice: 4000,
    status: 'completed',
    createdAt: new Date(new Date().setDate(new Date().getDate() - 20))
  }
];

// Function to get a user's bookings
export const getUserBookings = (userId: string): Booking[] => {
  return bookings.filter(booking => booking.userId === userId);
};

// Function to get a booking by ID
export const getBookingById = (id: string): Booking | undefined => {
  return bookings.find(booking => booking.id === id);
};

// Function to create a new booking
export const createBooking = (
  userId: string,
  propertyId: string,
  startDate: Date,
  endDate: Date,
  guests: number
): Booking | null => {
  const property = getPropertyById(propertyId);
  
  if (!property) {
    return null;
  }
  
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const totalPrice = property.price * diffDays;
  
  const newBooking: Booking = {
    id: `b${bookings.length + 1}`,
    userId,
    propertyId,
    property,
    startDate,
    endDate,
    guests,
    totalPrice,
    status: 'upcoming',
    createdAt: new Date()
  };
  
  bookings.push(newBooking);
  return newBooking;
};

// Function to cancel a booking
export const cancelBooking = (bookingId: string): boolean => {
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);
  
  if (bookingIndex === -1) {
    return false;
  }
  
  bookings[bookingIndex].status = 'cancelled';
  return true;
};
