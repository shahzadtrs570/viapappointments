/* eslint-disable */
'use client';

import Link from 'next/link';

interface CarDetailsHeaderProps {
  car: any;
  currentIndex: number;
  totalCars: number;
  lng: string;
}

export default function CarDetailsHeader({ car, currentIndex, totalCars, lng }: CarDetailsHeaderProps) {
  const getDealRating = (price: number, msrp: number) => {
    const savings = msrp - price;
    const percentage = (savings / msrp) * 100;
    
    if (percentage >= 15) return { rating: 'Great Deal', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 10) return { rating: 'Good Deal', color: 'text-green-600', bg: 'bg-green-100' };
    if (percentage >= 5) return { rating: 'Fair Deal', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (percentage < 0) return { rating: 'Overpriced', color: 'text-red-600', bg: 'bg-red-100' };
    return { rating: 'High Priced', color: 'text-orange-600', bg: 'bg-orange-100' };
  };

  const dealInfo = getDealRating(car.salePrice, car.msrp);
  const savings = car.msrp - car.salePrice;
  const nextCarIndex = currentIndex + 1 < totalCars ? currentIndex + 1 : 0;
  const prevCarIndex = currentIndex - 1 >= 0 ? currentIndex - 1 : totalCars - 1;

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <div className="flex items-center justify-between py-4">
          <Link 
            href={`/${lng}/cars/shop`}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All results
          </Link>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span>Result {currentIndex + 1} of {totalCars.toLocaleString()}</span>
            <div className="flex items-center space-x-2">
              <Link 
                href={`/${lng}/cars/shop/${prevCarIndex}`}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Prev
              </Link>
              <Link 
                href={`/${lng}/cars/shop/${nextCarIndex}`}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                Next
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Car Info */}
        <div className="pb-6">
          <div className="lg:flex lg:items-start lg:justify-between">
            <div className="lg:flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {car.year} {car.make} {car.model} {car.trim}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {car.dealerCity}, {car.dealerState}
              </p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${car.salePrice.toLocaleString()}
                  </span>
                  {car.msrp > car.salePrice && (
                    <span className="text-lg text-gray-500 line-through">
                      ${car.msrp.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${dealInfo.bg} ${dealInfo.color}`}>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {dealInfo.rating}
                </div>
                
                {savings > 0 && (
                  <span className="text-sm text-gray-600">
                    ${savings.toLocaleString()} below market
                    <svg className="w-4 h-4 inline ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                )}
              </div>
            </div>

            {/* Dealer Rating */}
            <div className="mt-6 lg:mt-0 lg:ml-8">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  Dealer rating (22 reviews)
                </div>
                <div className="flex items-center justify-end space-x-1">
                  {[1, 2, 3, 4].map((star) => (
                    <svg key={star} className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 