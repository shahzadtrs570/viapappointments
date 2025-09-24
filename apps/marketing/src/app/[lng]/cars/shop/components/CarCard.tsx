/* eslint-disable */
"use client"

import { useState } from "react"
import Link from "next/link"
import { Heart, MoreVertical, Share2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@package/ui/dialog"

interface CarCardProps {
  car: {
    id: string
    title?: string
    year?: number
    make?: string
    model?: string
    trim?: string
    bodyStyle?: string
    vin?: string
    stockNumber?: string
    priceAmount?: number
    msrpAmount?: number
    exteriorColor?: string
    interiorColor?: string
    engineSize?: number
    transmission?: string
    fuelType?: string
    mpgCity?: number
    mpgHighway?: number
    features?: any
    images?: any
    dealership?: {
      id: string
      name: string
      phone?: string
    }
  }
  index: number
  lng: string
}

export default function CarCard({ car, index, lng }: CarCardProps) {
  const [imageError, setImageError] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  // Handle different image data structures
  let images: string[] = []
  if (car.images) {
    if (Array.isArray(car.images)) {
      // If it's an array of objects with url property
      if (
        car.images.length > 0 &&
        typeof car.images[0] === "object" &&
        car.images[0].url
      ) {
        images = car.images.map((img: any) => img.url)
      }
      // If it's an array of strings
      else if (car.images.length > 0 && typeof car.images[0] === "string") {
        images = car.images
      }
    } else if (typeof car.images === "object") {
      // If it's an object with urls property
      if (car.images.urls && Array.isArray(car.images.urls)) {
        images = car.images.urls
      }
    }
  }

  const mainImage =
    images && images.length > 0 && !imageError
      ? images[0]
      : "https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=No+Image"

  const handleImageError = () => {
    setImageError(true)
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleRequestInfo = () => {
    setShowRequestDialog(true)
  }

  const handleMenuClick = () => {
    setShowDialog(true)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${car.year} ${car.make} ${car.model} ${car.trim || ""}`.trim(),
        text: `Check out this ${car.year} ${car.make} ${car.model} for $${(car.priceAmount || 0).toLocaleString()}`,
        url: window.location.origin + `/${lng}/cars/shop/${car.id}`,
      })
    } else {
      navigator.clipboard.writeText(
        window.location.origin + `/${lng}/cars/shop/${car.id}`
      )
    }
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        {/* Image Section */}
        <div className="relative">
          <Link href={`/${lng}/cars/shop/${car.id}`}>
            <div className="relative cursor-pointer">
              <div className="aspect-[4/3] bg-gray-100">
                <img
                  src={mainImage}
                  alt={
                    car.title || `${car.year} ${car.make} ${car.model}`.trim()
                  }
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </Link>

          {/* Heart Icon */}
          <button
            onClick={handleLike}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-sm hover:shadow-md transition-shadow"
          >
            <Heart
              className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`}
            />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* New car badge */}
          <div className="mb-2">
            <span className="text-sm text-gray-600">New car</span>
          </div>

          {/* Car Title - Make clickable */}
          <Link href={`/${lng}/cars/shop/${car.id}`}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 cursor-pointer hover:text-blue-600 transition-colors">
              {car.year} {car.make} {car.model} {car.trim || ""}
            </h3>
          </Link>

          {/* Engine Info */}
          <div className="mb-6">
            <span className="text-gray-600">
              {car.engineSize
                ? `${car.engineSize}L`
                : "Engine info not available"}
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="text-2xl font-bold text-gray-900">
              ${(car.priceAmount || 0).toLocaleString()}
            </span>
          </div>

          {/* Phone and Request Info */}
          <div className="flex items-center justify-between mb-4">
            <a
              href={`tel:${car.dealership?.phone || "(218)396-7705"}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {car.dealership?.phone || "(218) 396-7705"}
            </a>
            <button
              onClick={handleRequestInfo}
              className="bg-white border border-gray-900 text-gray-900 px-6 py-2 rounded-full hover:bg-gray-50 transition-colors font-medium"
            >
              Request info
            </button>
          </div>

          {/* Location and Menu */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <span className="text-gray-900 font-medium">
              {car.dealership?.name || "Dealership"}
            </span>

            {/* Menu button that directly opens dialog */}
            <button
              onClick={handleMenuClick}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Car Overview Dialog - Fixed z-index */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden p-0 z-[9999] bg-gray-50 mt-6">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 bg-white border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900">Overview</h2>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          <div className="px-6 pb-6 overflow-y-auto max-h-[calc(85vh-100px)] bg-gray-50">
            {/* Car Summary Card */}
            <div className="flex items-center gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm">
              <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={mainImage}
                  alt={
                    car.title || `${car.year} ${car.make} ${car.model}`.trim()
                  }
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {car.year} {car.make} {car.model} {car.trim || ""}
                </h3>
                <p className="text-lg font-semibold text-gray-900">
                  ${(car.priceAmount || 0).toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleLike}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Heart
                  className={`w-6 h-6 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-400"}`}
                />
              </button>
            </div>

            {/* Features Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Features
                </h3>
                <Link
                  href={`/${lng}/cars/shop/${car.id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  View full listing
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-6">
                {/* Mileage */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12,6 12,12 16,14" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Mileage
                    </div>
                    <div className="text-gray-600">2,518</div>
                  </div>
                </div>

                {/* Drivetrain */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14,2 14,8 20,8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Drivetrain
                    </div>
                    <div className="text-gray-600">All-Wheel Drive</div>
                  </div>
                </div>

                {/* Exterior Color */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Exterior color
                    </div>
                    <div className="text-gray-600">
                      {car.exteriorColor || "Not specified"}
                    </div>
                  </div>
                </div>

                {/* Interior Color */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Interior color
                    </div>
                    <div className="text-gray-600">
                      {car.interiorColor || "Not specified"}
                    </div>
                  </div>
                </div>

                {/* MPG */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 12h18l-3-3m0 6l3-3" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">MPG</div>
                    <div className="text-gray-600">{car.mpgCity || 29} MPG</div>
                  </div>
                </div>

                {/* Engine */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Engine
                    </div>
                    <div className="text-gray-600">
                      {car.engineSize ? `${car.engineSize}L` : "Not specified"}
                    </div>
                  </div>
                </div>

                {/* Fuel Type */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <line x1="3" y1="22" x2="21" y2="22" />
                      <line x1="6" y1="18" x2="6" y2="11" />
                      <line x1="10" y1="18" x2="10" y2="11" />
                      <line x1="14" y1="18" x2="14" y2="11" />
                      <line x1="18" y1="18" x2="18" y2="11" />
                      <polygon points="12,2 20,7 4,7" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Fuel type
                    </div>
                    <div className="text-gray-600">
                      {car.fuelType || "Not specified"}
                    </div>
                  </div>
                </div>

                {/* Transmission */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Transmission
                    </div>
                    <div className="text-gray-600">
                      {car.transmission || "Not specified"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Overview Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Vehicle overview
                </h3>
                <Link
                  href={`/${lng}/cars/shop/${car.id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                >
                  View specifications
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Make:</span>
                  <span className="text-gray-600">
                    {car.make || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Model:</span>
                  <span className="text-gray-600">
                    {car.model || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Year:</span>
                  <span className="text-gray-600">
                    {car.year || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Trim:</span>
                  <span className="text-gray-600">
                    {car.trim || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">
                    Body type:
                  </span>
                  <span className="text-gray-600">
                    {car.bodyStyle || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Mileage:</span>
                  <span className="text-gray-600">Not specified</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Stock #:</span>
                  <span className="text-gray-600">
                    {car.stockNumber || "Not specified"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">VIN:</span>
                  <span className="text-gray-600 text-xs">
                    {car.vin || "Not specified"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Info Dialog - Professional Design */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-hidden p-0 z-[9999] bg-gray-50 mt-6">
          {/* Header */}
          <div className="p-6 pb-4 bg-white border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Request Information
            </h2>
            <p className="text-gray-600">
              Get more details about this {car.year} {car.make} {car.model}
            </p>
          </div>

          <div className="px-6 pb-6 overflow-y-auto max-h-[calc(85vh-120px)] bg-gray-50">
            {/* Car Summary Card */}
            <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={mainImage}
                    alt={car.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {car.year} {car.make} {car.model} {car.trim || ""}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    Stock #{car.stockNumber || "Not specified"}
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    ${(car.priceAmount || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="I'm interested in this vehicle. Please send me more information."
                    defaultValue={`I'm interested in the ${car.year} ${car.make} ${car.model} ${car.trim || ""} (Stock #${car.stockNumber || "N/A"}). Please contact me with more information.`}
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="consent"
                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="consent" className="text-sm text-gray-600">
                    I agree to receive communications about this vehicle and
                    other offers via email, phone, or text message.
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                  Send Request
                </button>
                <button
                  onClick={() => setShowRequestDialog(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* Alternative Contact */}
            <div className="mt-6 text-center p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm text-gray-600 mb-2">
                Prefer to call? Speak with a specialist:
              </p>
              <a
                href={`tel:${car.dealership?.phone || "(218)396-7705"}`}
                className="text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                {car.dealership?.phone || "(218) 396-7705"}
              </a>
              <p className="text-xs text-gray-500 mt-1">
                Available Mon-Fri 9AM-6PM
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
