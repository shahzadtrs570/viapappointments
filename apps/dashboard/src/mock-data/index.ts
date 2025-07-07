/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/
/*eslint-disable import/export*/
/**
 * Srenova Mock Data
 *
 * This module provides mock data for UI development prior to API implementation.
 * It includes data for users, properties, documents, offers, contracts, valuations, and buy boxes.
 */

import {
  MockContract,
  MockProperty,
  PropertyType,
  PropertyCondition,
} from "./types"

// Re-export all types
export * from "./types"

// Re-export all user-related mock data and helpers
export * from "./users"

// Re-export all property-related mock data and helpers
export * from "./properties"

// Re-export all buy box-related mock data
export * from "./buy-boxes"

export const mockProperties = [
  {
    id: "prop-1",
    propertyType: "HOUSE" as PropertyType,
    address: {
      streetLine1: "123 Park Road",
      streetLine2: "",
      city: "London",
      postalCode: "SW1A 1AA",
      country: "United Kingdom",
    },
    bedroomCount: 4,
    bathroomCount: 2,
    totalAreaSqM: 150,
    condition: "GOOD" as PropertyCondition,
    estimatedValue: 750000,
    confirmedValue: 760000,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "prop-2",
    propertyType: "APARTMENT" as PropertyType,
    address: {
      streetLine1: "45 City View",
      streetLine2: "Apartment 12",
      city: "Manchester",
      postalCode: "M1 1BB",
      country: "United Kingdom",
    },
    bedroomCount: 2,
    bathroomCount: 1,
    totalAreaSqM: 75,
    condition: "EXCELLENT" as PropertyCondition,
    estimatedValue: 350000,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "prop-3",
    propertyType: "BUNGALOW" as PropertyType,
    address: {
      streetLine1: "8 Garden Close",
      streetLine2: "",
      city: "Birmingham",
      postalCode: "B1 1CC",
      country: "United Kingdom",
    },
    bedroomCount: 3,
    bathroomCount: 2,
    totalAreaSqM: 120,
    condition: "FAIR" as PropertyCondition,
    estimatedValue: 450000,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
] as MockProperty[]

export const mockContracts: MockContract[] = [
  {
    id: "contract-1",
    offerId: "offer-1",
    buyBoxName: "London Residential Portfolio A",
    contractNumber: "CTR-2024-001",
    status: "PENDING",
    createdAt: "2024-03-01T10:00:00Z",
    updatedAt: "2024-03-01T10:00:00Z",
    totalAmount: 2500000,
    propertyAddresses: ["123 Park Lane, London", "45 Queen's Road, London"],
    buyerName: "London Investment Fund Ltd",
    sellerNames: ["John Smith", "Jane Doe"],
    signedByBuyer: false,
    signedBySellers: false,
    termsAndConditions: "<p>Standard terms and conditions apply...</p>",
  },
  {
    id: "contract-2",
    offerId: "offer-2",
    buyBoxName: "Manchester Commercial Bundle",
    contractNumber: "CTR-2024-002",
    status: "COMPLETED",
    createdAt: "2024-02-15T14:30:00Z",
    updatedAt: "2024-02-20T09:15:00Z",
    totalAmount: 3750000,
    propertyAddresses: [
      "78 Business Park Way, Manchester",
      "92 Industrial Estate, Manchester",
    ],
    buyerName: "Northern Property Investments",
    sellerNames: ["Manchester Properties LLC"],
    signedByBuyer: true,
    signedBySellers: true,
    buyerSignedAt: "2024-02-18T11:20:00Z",
    sellersSignedAt: "2024-02-19T15:45:00Z",
    termsAndConditions: "<p>Standard terms and conditions apply...</p>",
  },
  {
    id: "contract-3",
    offerId: "offer-3",
    buyBoxName: "Birmingham Mixed Use Development",
    contractNumber: "CTR-2024-003",
    status: "EXPIRED",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-02-10T17:00:00Z",
    totalAmount: 1850000,
    propertyAddresses: ["15 City Center Plaza, Birmingham"],
    buyerName: "Midlands Development Fund",
    sellerNames: ["Birmingham Estates Ltd", "City Center Holdings"],
    signedByBuyer: false,
    signedBySellers: false,
    termsAndConditions: "<p>Standard terms and conditions apply...</p>",
  },
]

/**
 * Mock Data Usage Instructions:
 *
 * 1. Import mock data in your component:
 *    import { mockUsers, findUserById, mockProperties, mockBuyBoxes } from '@/mock-data';
 *
 * 2. Use the imported data and helper functions:
 *    const user = findUserById('user-1');
 *    const sellerProperties = findPropertiesBySellerId('seller-1');
 *    const buyBoxProperties = findPropertiesByBuyBoxId('buybox-1');
 *
 * 3. For development purposes only. Replace with API calls in production.
 */
