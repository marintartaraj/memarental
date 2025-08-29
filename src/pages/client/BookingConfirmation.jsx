import React from 'react';
import Seo from '@/components/Seo';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

function BookingConfirmation() {
  return (
    <>
      <Seo
        title="Booking Confirmed - MEMA Rental"
        description="Your car rental booking has been confirmed. Thank you for choosing MEMA Rental."
        path="/booking-confirmation"
        image="/images/cars/placeholder-car.jpg"
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl p-8 text-center border-0">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your reservation. We have received your booking details and will contact you shortly to finalize the pickup.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-yellow-500 hover:bg-yellow-600">
              <Link to="/cars">Back to Cars</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingConfirmation;


