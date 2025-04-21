
import React from 'react';
import QRCode from '@/components/QRCode';
import { format } from 'date-fns';

interface BookingDetails {
  propertyId: string;
  propertyName: string;
  startDate: Date;
  endDate: Date;
  guests: number;
  totalPrice: number;
  userId: string;
  userName: string;
}

interface BookingQRCodeProps {
  booking: BookingDetails;
}

const BookingQRCode: React.FC<BookingQRCodeProps> = ({ booking }) => {
  // Create a JSON string with all booking details for the QR code
  const bookingData = JSON.stringify({
    reservation: {
      id: `RES-${Date.now().toString(36).toUpperCase()}`,
      property: {
        id: booking.propertyId,
        name: booking.propertyName
      },
      dates: {
        checkIn: format(booking.startDate, 'yyyy-MM-dd'),
        checkOut: format(booking.endDate, 'yyyy-MM-dd')
      },
      guests: booking.guests,
      payment: {
        total: booking.totalPrice,
        currency: 'USD',
        status: 'Paid'
      },
      guest: {
        id: booking.userId,
        name: booking.userName
      },
      created: new Date().toISOString()
    }
  });

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-4 text-center">Booking Confirmation</h3>
      
      <div className="flex flex-col items-center mb-4">
        <QRCode value={bookingData} size={200} />
        <p className="text-sm text-gray-500 mt-2">Scan this QR code at check-in</p>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="font-medium">Property:</span>
          <span>{booking.propertyName}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Check-in:</span>
          <span>{format(booking.startDate, 'MMMM d, yyyy')}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Check-out:</span>
          <span>{format(booking.endDate, 'MMMM d, yyyy')}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Guests:</span>
          <span>{booking.guests}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-medium">Total:</span>
          <span className="font-bold">${booking.totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingQRCode;
