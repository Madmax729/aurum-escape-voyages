
import { properties } from './properties';

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  guests: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
}

// Mock booking data
const mockBookings: Booking[] = [
  {
    id: 'b1',
    propertyId: '3',
    userId: '2',
    startDate: new Date(2025, 5, 15),
    endDate: new Date(2025, 5, 22),
    totalPrice: 5600,
    guests: 4,
    status: 'upcoming',
    createdAt: new Date(2025, 3, 10)
  },
  {
    id: 'b2',
    propertyId: '6',
    userId: '2',
    startDate: new Date(2025, 7, 10),
    endDate: new Date(2025, 7, 20),
    totalPrice: 9500,
    guests: 6,
    status: 'upcoming',
    createdAt: new Date(2025, 4, 5)
  },
  {
    id: 'b3',
    propertyId: '4',
    userId: '2',
    startDate: new Date(2025, 1, 5),
    endDate: new Date(2025, 1, 8),
    totalPrice: 825,
    guests: 2,
    status: 'completed',
    createdAt: new Date(2024, 11, 20)
  }
];

// Function to get bookings for a user
export const getUserBookings = (userId: string): (Booking & { property: typeof properties[0] })[] => {
  return mockBookings
    .filter(booking => booking.userId === userId)
    .map(booking => {
      const property = properties.find(p => p.id === booking.propertyId);
      return {
        ...booking,
        property: property!
      };
    });
};

// Function to create a new booking
export const createBooking = (
  propertyId: string,
  userId: string,
  startDate: Date,
  endDate: Date,
  guests: number
): Booking => {
  const property = properties.find(p => p.id === propertyId);
  
  if (!property) {
    throw new Error('Property not found');
  }
  
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const totalPrice = property.price * daysDiff;
  
  const newBooking: Booking = {
    id: `b${mockBookings.length + 1}`,
    propertyId,
    userId,
    startDate,
    endDate,
    totalPrice,
    guests,
    status: 'upcoming',
    createdAt: new Date()
  };
  
  mockBookings.push(newBooking);
  return newBooking;
};
