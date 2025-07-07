/* eslint-disable */
'use client';

import { useState } from 'react';

interface RequestInfoSidebarProps {
  car: any;
}

export default function RequestInfoSidebar({ car }: RequestInfoSidebarProps) {
  const [showFinancing, setShowFinancing] = useState(false);

  return (
    <div className="space-y-6">
      {/* Request Information */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Request information</h3>
        
        <div className="space-y-4">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
            Check availability
          </button>
          
          <button className="w-full border border-gray-300 hover:border-gray-400 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors">
            See finance & trade-in options
          </button>
        </div>

        <div className="flex items-center justify-center space-x-6 mt-6 pt-6 border-t border-gray-200">
          <button className="flex items-center text-gray-700 hover:text-gray-900">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Call (844) 981-5029
          </button>
          
          <button className="flex items-center text-gray-700 hover:text-gray-900">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Chat
          </button>
        </div>
      </div>

      {/* Pre-qualify for financing */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="text-center mb-6">
          <p className="text-blue-600 font-medium">
            Pre-qualify for financing with no impact to your credit score.
          </p>
        </div>
        
        <div className="flex items-center justify-center space-x-8 mb-6">
          <div className="text-center">
            <div className="w-16 h-12 mx-auto mb-2 bg-red-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">C1</span>
            </div>
            <span className="text-xs text-gray-600">Capital One</span>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-12 mx-auto mb-2 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">CHASE</span>
            </div>
            <span className="text-xs text-gray-600">Chase</span>
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            onClick={() => setShowFinancing(!showFinancing)}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            View financing options
          </button>
        </div>
      </div>

      {/* Finance in advance */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Finance in advance</h3>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="font-medium text-gray-900 text-sm">No Impact on Your Credit Score</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="font-medium text-gray-900 text-sm">Only Takes Minutes</div>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H9a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="font-medium text-gray-900 text-sm">Personalized Real Rates</div>
          </div>
        </div>

        <button className="w-full border border-gray-300 hover:border-gray-400 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors">
          View financing options
        </button>
      </div>

      {/* Vehicle Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-4">
          <img
            src={car.images?.[0] || 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=200&q=80'}
            alt={`${car.year} ${car.make} ${car.model}`}
            className="w-16 h-12 object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=200&q=80';
            }}
          />
          <div className="flex-1">
            <div className="font-bold text-gray-900">
              {car.year} {car.make} {car.model}
            </div>
            <div className="text-sm text-gray-600">
              Mileage: {car.mileage?.toLocaleString() || 'N/A'} • {car.dealerCity}, {car.dealerState}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-gray-900">${car.salePrice.toLocaleString()}</span>
            <div className="flex items-center text-green-600 text-sm font-medium">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Great Deal
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-1">
            ${(car.msrp - car.salePrice).toLocaleString()} Below market
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded text-sm transition-colors">
            Check availability
          </button>
          <button className="w-full border border-gray-300 hover:border-gray-400 text-gray-900 font-medium py-2 px-4 rounded text-sm transition-colors">
            See finance & trade-in options
          </button>
        </div>
      </div>
    </div>
  );
} 