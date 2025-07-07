/* eslint-disable */
'use client';

import { useState } from 'react';
import FiltersSidebar from './components/FiltersSidebar';
import CarListings from './components/CarListings';
import carsData from './cars.json';

interface CarShopPageProps {
  params: {
    lng: string;
  };
}

export default function CarShopPage({ params: { lng } }: CarShopPageProps) {
  const [filteredCars, setFilteredCars] = useState(carsData.vehicles);
  const [filters, setFilters] = useState({
    make: '',
    bodyStyle: '',
    priceRange: [0, 200000] as [number, number],
    yearRange: [2020, 2024] as [number, number],
    fuelType: '',
  });

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    
    // Apply filters
    const filtered = carsData.vehicles.filter((car) => {
      const matchesMake = !newFilters.make || car.make.toLowerCase().includes(newFilters.make.toLowerCase());
      const matchesBodyStyle = !newFilters.bodyStyle || car.bodyStyle.toLowerCase() === newFilters.bodyStyle.toLowerCase();
      const matchesPrice = car.salePrice >= newFilters.priceRange[0] && car.salePrice <= newFilters.priceRange[1];
      const matchesYear = parseInt(car.year) >= newFilters.yearRange[0] && parseInt(car.year) <= newFilters.yearRange[1];
      const matchesFuelType = !newFilters.fuelType || car.fuelType.toLowerCase() === newFilters.fuelType.toLowerCase();

      return matchesMake && matchesBodyStyle && matchesPrice && matchesYear && matchesFuelType;
    });

    setFilteredCars(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Used Cars for Sale</h1>
          <p className="text-gray-600 mt-2">{filteredCars.length} results</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FiltersSidebar 
              filters={filters}
              onFilterChange={handleFilterChange}
              cars={carsData.vehicles}
            />
          </div>

          {/* Car Listings */}
          <div className="lg:col-span-3">
            <CarListings cars={filteredCars} lng={lng} />
          </div>
        </div>
      </div>
    </div>
  );
}
