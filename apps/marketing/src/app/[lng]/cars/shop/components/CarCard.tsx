/* eslint-disable */
'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CarCardProps {
  car: {
    title: string;
    year: string;
    make: string;
    model: string;
    trim: string;
    bodyStyle: string;
    vin: string;
    stock: string;
    salePrice: number;
    msrp: number;
    exteriorColor: string;
    interiorColor: string;
    engine: string;
    transmission: string;
    fuelType: string;
    fuelEconomyCity: number;
    fuelEconomyHighway: number;
    highlightedFeatures: string[];
    images: string[];
  };
  index: number;
  lng: string;
}

export default function CarCard({ car, index, lng }: CarCardProps) {
  const [imageError, setImageError] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const discount = car.msrp - car.salePrice;
  const discountPercentage = car.msrp > 0 ? Math.round((discount / car.msrp) * 100) : 0;

  const getDealBadge = () => {
    if (discountPercentage >= 15) return { text: 'Great Deal', color: 'bg-green-100 text-green-800' };
    if (discountPercentage >= 10) return { text: 'Good Deal', color: 'bg-blue-100 text-blue-800' };
    if (discountPercentage >= 5) return { text: 'Fair Deal', color: 'bg-yellow-100 text-yellow-800' };
    return null;
  };

  const mainImage = car.images && car.images.length > 0 && !imageError 
    ? car.images[currentImageIndex] 
    : 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image';

  const handleImageError = () => {
    setImageError(true);
  };

  const nextImage = () => {
    if (car.images && car.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % car.images.length);
    }
  };

  const prevImage = () => {
    if (car.images && car.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + car.images.length) % car.images.length);
    }
  };

  const dealBadge = getDealBadge();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Section */}
      <Link href={`/${lng}/cars/shop/${index}`}>
        <div className="relative cursor-pointer">
        <div className="aspect-w-16 aspect-h-12 bg-gray-200">
          <img
            src={mainImage}
            alt={car.title}
            onError={handleImageError}
            className="w-full h-48 object-cover"
          />
        </div>

        {/* Image Navigation */}
        {car.images && car.images.length > 1 && !imageError && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-1 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-75 hover:bg-opacity-100 rounded-full p-1 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Deal Badge */}
        {dealBadge && (
          <div className={`absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-medium ${dealBadge.color}`}>
            {dealBadge.text}
          </div>
        )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4">
        {/* Title and Year */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {car.year} {car.make} {car.model} {car.trim}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-gray-900">
            ${car.salePrice.toLocaleString()}
          </span>
          {car.msrp > car.salePrice && (
            <span className="text-sm text-gray-500 line-through">
              ${car.msrp.toLocaleString()}
            </span>
          )}
        </div>

        {/* Vehicle Details */}
        <div className="space-y-1 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Body Style:</span>
            <span className="font-medium">{car.bodyStyle}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Fuel Type:</span>
            <span className="font-medium">{car.fuelType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Color:</span>
            <span className="font-medium">{car.exteriorColor}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Stock #:</span>
            <span className="font-medium">{car.stock}</span>
          </div>
        </div>

        {/* Features */}
        {car.highlightedFeatures && car.highlightedFeatures.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {car.highlightedFeatures.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {feature}
                </span>
              ))}
              {car.highlightedFeatures.length > 3 && (
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  +{car.highlightedFeatures.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link 
            href={`/${lng}/cars/shop/${index}`}
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors text-center"
          >
            View Details
          </Link>
          <Link 
            href={`/${lng}/cars/shop/${index}`}
            className="block w-full border border-blue-600 text-blue-600 py-2 px-4 rounded-md font-medium hover:bg-blue-50 transition-colors text-center"
          >
            Contact Dealer
          </Link>
        </div>
      </div>
    </div>
  );
} 