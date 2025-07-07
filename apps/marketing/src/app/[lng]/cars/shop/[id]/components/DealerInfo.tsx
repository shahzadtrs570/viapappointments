/* eslint-disable */
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface DealerInfoProps {
  car: any;
}

export default function DealerInfo({ car }: DealerInfoProps) {
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [email, setEmail] = useState('');

  const recommendedCars = [
    {
      id: 1,
      year: 2025,
      make: 'Volkswagen',
      model: 'Jetta S FWD',
      price: 23050,
      mileage: 5,
      image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=300&q=80'
    },
    {
      id: 2,
      year: 2025,
      make: 'Volkswagen',
      model: 'Jetta Sport FWD',
      price: 24816,
      mileage: 5,
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&q=80'
    },
    {
      id: 3,
      year: 2025,
      make: 'Volkswagen',
      model: 'Jetta SE FWD',
      price: 27066,
      mileage: 5,
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=300&q=80'
    },
    {
      id: 4,
      year: 2024,
      make: 'BMW',
      model: '2 Series 228i xDrive Gran Coupe AWD',
      price: 35321,
      mileage: 11227,
      dealRating: 'Fair Deal',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=300&q=80'
    }
  ];

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <div className="space-y-8 mt-12">
      {/* Dealer Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Dealer</h2>
        
        <div className="flex items-start space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-6 bg-green-600 rounded text-white text-xs font-bold flex items-center justify-center mb-1">
                O'M
              </div>
              <div className="text-xs text-gray-600">VOLKSWAGEN</div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-bold text-gray-900">O'Meara Volkswagen</h3>
              <span className="text-red-600 text-sm">• Closed</span>
              <span className="text-gray-600 text-sm">• Opens today at 9:00 AM</span>
              <button className="text-blue-600 hover:text-blue-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-1 text-sm text-gray-600">
              <a href="tel:(844) 981-5029" className="text-blue-600 hover:text-blue-700 block">
                (844) 981-5029
              </a>
              <a 
                href="https://maps.google.com/?q=1900+W+104th+Ave,+Thornton,+CO+80234" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 block"
              >
                1900 W 104th Ave, Thornton, CO 80234
                <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 block">
                View inventory
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 block">
                Dealer website
                <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex space-x-4 mb-6">
          <button className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800">
            <span className="text-lg font-bold">𝕏</span>
          </button>
          <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700">
            <span className="text-lg font-bold">f</span>
          </button>
          <button className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </button>
          <button className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
          </button>
        </div>

        {/* Dealer Reviews */}
        <div className="border-t pt-6">
          <div className="flex items-center space-x-2 mb-4">
            <h3 className="text-xl font-bold text-gray-900">Dealer reviews</h3>
            <div className="flex items-center space-x-1">
              <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xl font-bold text-gray-900">4.0</span>
              <span className="text-gray-600">(22 reviews)</span>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Dealer's description</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              Predawn Gray Mica 2018 Toyota Camry LE Clean CARFAX. Camry LE, 4D Sedan, 2.5L I4 DOHC 16V, 8-Speed Automatic, FWD, Predawn Gray Mica, Black w/Fabric Seat 
              Trim, 4-Wheel Disc Brakes, 6 Speakers, ABS brakes, Active Cruise Control, Alloy wheels, AM/FM radio, Auto High-beam Headlights, Blind Spot Monitor w/Rear Cross 
              Traffic Alert, Brake assist, Bumpers: body-color, Convenience Package, Delay-off headlights, Driver door bin, Driver vanity mirror, Dual front impact airbags, Dual front 
              side impact airbags, Electronic Stability Control, Exterior Parking Camera Rear, Fabric Seat Trim, Four wheel independent suspension, Front anti-roll bar, Front Bucket...
            </p>
            <button className="text-blue-600 hover:text-blue-700 font-medium mt-2">
              Show full description
            </button>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Dealer's disclaimer</h4>
            <p className="text-gray-700 text-sm">
              To the price of each vehicle there will be added the sum of $599 D&H fee
            </p>
            
            <div className="mt-4">
              <h5 className="font-medium text-gray-900 mb-2">Additional Information</h5>
            </div>
          </div>

          <button 
            onClick={() => setShowAllReviews(!showAllReviews)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Show all reviews
          </button>
        </div>
      </div>

      {/* Notify me section */}
      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Notify me of new listings like this one
        </h3>
        
        <form onSubmit={handleEmailSubmit} className="flex max-w-md mx-auto space-x-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Email me
          </button>
        </form>
        
        <p className="text-sm text-gray-600 mt-4">
          By clicking "Email me," you agree to our <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a> and <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Use</a>.
        </p>
      </div>

      {/* Recommended from this dealer */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Recommended from this dealer</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {recommendedCars.map((recommendedCar) => (
            <div key={recommendedCar.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={recommendedCar.image}
                  alt={`${recommendedCar.year} ${recommendedCar.make} ${recommendedCar.model}`}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=300&q=80';
                  }}
                />
                <button className="absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
              
              <div className="p-4">
                <h4 className="font-bold text-gray-900 mb-1">
                  {recommendedCar.year} {recommendedCar.make} {recommendedCar.model}
                </h4>
                <div className="text-lg font-bold text-gray-900 mb-1">
                  ${recommendedCar.price.toLocaleString()}
                  {recommendedCar.dealRating && (
                    <span className="ml-2 text-sm text-yellow-600">🟡 {recommendedCar.dealRating}</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  Mileage {recommendedCar.mileage.toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
            View all cars at this dealership
          </button>
        </div>
      </div>

      {/* Footer Links */}
      <div className="space-y-8 pt-8 border-t border-gray-200">
        {/* Shop by Price */}
        <div>
          <button className="flex items-center justify-between w-full text-left">
            <h3 className="text-xl font-bold text-gray-900">Shop by Price</h3>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Used Sedans for Sale Under $10,000
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Used Sedans for Sale Under $20,000
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Used Sedans for Sale Under $30,000
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Used Sedans for Sale Under $15,000
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Used Sedans for Sale Under $25,000
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Used Sedans for Sale Under $40,000
            </Link>
          </div>
        </div>

        {/* Shop By City */}
        <div>
          <button className="flex items-center justify-between w-full text-left">
            <h3 className="text-xl font-bold text-gray-900">Shop By City</h3>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Sedans in Atlanta GA
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Sedans in Houston TX
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Sedans in New York NY
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Sedans in Chicago IL
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Sedans in Los Angeles CA
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Sedans in Philadelphia PA
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Sedans in Dallas TX
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Sedans in Miami FL
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700 underline">
              Sedans in Washington DC
            </Link>
          </div>
        </div>

        {/* Sedans by Make */}
        <div>
          <button className="flex items-center justify-between w-full text-left">
            <h3 className="text-xl font-bold text-gray-900">Sedans by Make</h3>
            <svg className="w-5 h-5 text-gray-400 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 pt-4 border-t border-gray-200">
        <p>
          <sup>1</sup> Vehicle history data provided by Experian AutoCheck on May 5, 2025. This data, and any reliance on it is subject to the AutoCheck Terms and Conditions and the CarGurus Terms of Use.
        </p>
        <p className="mt-2">
          Vehicle information is provided by the seller or other third parties; CarGurus is not responsible for the accuracy of such information. Price may exclude certain taxes, fees, and/or charges. See seller for details.
        </p>
      </div>
    </div>
  );
} 