/* eslint-disable */
'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import carsData from '../cars.json';
import CarDetailsHeader from './components/CarDetailsHeader';
import CarImageGallery from './components/CarImageGallery';
import RequestInfoSidebar from './components/RequestInfoSidebar';
import CarSpecifications from './components/CarSpecifications';
import PricingSection from './components/PricingSection';
import DealerInfo from './components/DealerInfo';

interface CarDetailsPageProps {
  params: {
    lng: string;
    id: string;
  };
}

export default function CarDetailsPage({ params: { lng, id } }: CarDetailsPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Find the car by ID (using index for now, could be VIN or actual ID)
  const carIndex = parseInt(id) || 0;
  const car = carsData.vehicles[carIndex];

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Car Not Found</h1>
          <p className="text-gray-600">The requested vehicle could not be found.</p>
        </div>
      </div>
    );
  }

  const totalCars = carsData.vehicles.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <CarDetailsHeader 
        car={car}
        currentIndex={carIndex}
        totalCars={totalCars}
        lng={lng}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            <CarImageGallery car={car} />
            
            {/* Features Icons */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Features</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Mileage</div>
                    <div className="text-sm text-gray-500">{(car as any).mileage?.toLocaleString() || 'N/A'}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Drivetrain</div>
                    <div className="text-sm text-gray-500">{(car as any).drivetrain || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>

            <CarSpecifications car={car} activeTab={activeTab} setActiveTab={setActiveTab} />
            <PricingSection car={car} />
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <RequestInfoSidebar car={car} />
          </div>
        </div>

        <DealerInfo car={car} />
      </div>
    </div>
  );
} 