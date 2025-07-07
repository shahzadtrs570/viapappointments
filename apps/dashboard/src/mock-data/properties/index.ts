/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/
import {
  MockAddress,
  MockContract,
  MockOffer,
  MockProperty,
  MockPropertyDocument,
  MockSellerProperty,
  MockValuation,
  PropertyType,
  PropertyCondition,
  OfferStatus,
  ValuationStatus,
  AgreementType,
  OccupancyRight,
} from "../types"

// Mock Property Addresses
export const mockAddresses: MockAddress[] = [
  {
    id: "address-1",
    streetLine1: "15 Rue de la Paix",
    streetLine2: "Apt 4",
    city: "Paris",
    postalCode: "75001",
    country: "France",
  },
  {
    id: "address-2",
    streetLine1: "Via Roma 42",
    city: "Florence",
    postalCode: "50123",
    country: "Italy",
  },
  {
    id: "address-3",
    streetLine1: "8 Boulevard Victor Hugo",
    city: "Nice",
    postalCode: "06000",
    country: "France",
  },
  {
    id: "address-4",
    streetLine1: "27 Kensington Gardens",
    city: "London",
    postalCode: "W8 4QG",
    country: "United Kingdom",
  },
  {
    id: "address-5",
    streetLine1: "14 Royal Crescent",
    city: "Bath",
    postalCode: "BA1 2LS",
    country: "United Kingdom",
  },
]

// Mock Properties
export const mockProperties: MockProperty[] = [
  {
    id: "property-1",
    propertyType: PropertyType.APARTMENT,
    bedroomCount: 2,
    bathroomCount: 1,
    totalAreaSqM: 75,
    condition: PropertyCondition.GOOD,
    estimatedValue: 350000,
    createdAt: "2024-01-16T10:00:00Z",
    updatedAt: "2024-01-16T10:00:00Z",
    address: mockAddresses[0],
  },
  {
    id: "property-2",
    propertyType: PropertyType.VILLA,
    bedroomCount: 3,
    bathroomCount: 2,
    totalAreaSqM: 120,
    condition: PropertyCondition.EXCELLENT,
    estimatedValue: 580000,
    confirmedValue: 600000,
    createdAt: "2024-01-19T14:00:00Z",
    updatedAt: "2024-01-19T14:00:00Z",
    address: mockAddresses[1],
  },
  {
    id: "property-3",
    propertyType: PropertyType.HOUSE,
    bedroomCount: 4,
    bathroomCount: 2,
    totalAreaSqM: 150,
    condition: PropertyCondition.FAIR,
    estimatedValue: 420000,
    createdAt: "2024-01-25T09:30:00Z",
    updatedAt: "2024-01-25T09:30:00Z",
    address: mockAddresses[2],
  },
  {
    id: "property-4",
    propertyType: PropertyType.APARTMENT,
    bedroomCount: 3,
    bathroomCount: 2,
    totalAreaSqM: 110,
    condition: PropertyCondition.EXCELLENT,
    estimatedValue: 950000,
    confirmedValue: 975000,
    createdAt: "2024-01-28T11:00:00Z",
    updatedAt: "2024-01-28T11:00:00Z",
    address: mockAddresses[3],
  },
  {
    id: "property-5",
    propertyType: PropertyType.COTTAGE,
    bedroomCount: 4,
    bathroomCount: 3,
    totalAreaSqM: 160,
    condition: PropertyCondition.GOOD,
    estimatedValue: 750000,
    createdAt: "2024-02-05T14:00:00Z",
    updatedAt: "2024-02-05T14:00:00Z",
    address: mockAddresses[4],
  },
]

// Mock Seller Properties (ownership relationship)
export const mockSellerProperties: MockSellerProperty[] = [
  {
    id: "seller-property-1",
    sellerId: "seller-1",
    propertyId: "property-1",
    ownershipPercentage: 100,
    createdAt: "2024-01-16T10:30:00Z",
    updatedAt: "2024-01-16T10:30:00Z",
  },
  {
    id: "seller-property-2",
    sellerId: "seller-2",
    propertyId: "property-2",
    ownershipPercentage: 100,
    createdAt: "2024-01-19T14:30:00Z",
    updatedAt: "2024-01-19T14:30:00Z",
  },
  {
    id: "seller-property-3",
    sellerId: "seller-1",
    propertyId: "property-3",
    ownershipPercentage: 100,
    createdAt: "2024-01-25T10:00:00Z",
    updatedAt: "2024-01-25T10:00:00Z",
  },
  {
    id: "seller-property-4",
    sellerId: "seller-3",
    propertyId: "property-4",
    ownershipPercentage: 100,
    createdAt: "2024-01-28T12:00:00Z",
    updatedAt: "2024-01-28T12:00:00Z",
  },
  {
    id: "seller-property-5",
    sellerId: "seller-3",
    propertyId: "property-5",
    ownershipPercentage: 100,
    createdAt: "2024-02-05T15:00:00Z",
    updatedAt: "2024-02-05T15:00:00Z",
  },
]

// Mock Property Documents
export const mockPropertyDocuments: MockPropertyDocument[] = [
  {
    id: "property-doc-1",
    propertyId: "property-1",
    documentType: "",
    filename: "property_deed_paris.pdf",
    fileUrl: "/mock-documents/property_deed_paris.pdf",
    verified: true,
    uploadedById: "user-1",
    createdAt: "2024-01-16T11:00:00Z",
    updatedAt: "2024-01-16T11:00:00Z",
  },
  {
    id: "property-doc-2",
    propertyId: "property-1",
    documentType: "",
    filename: "energy_cert_paris.pdf",
    fileUrl: "/mock-documents/energy_cert_paris.pdf",
    verified: true,
    uploadedById: "user-1",
    createdAt: "2024-01-16T11:15:00Z",
    updatedAt: "2024-01-16T11:15:00Z",
  },
  {
    id: "property-doc-3",
    propertyId: "property-1",
    documentType: "",
    filename: "paris_apartment_1.jpg",
    fileUrl: "/mock-documents/paris_apartment_1.jpg",
    verified: true,
    uploadedById: "user-1",
    createdAt: "2024-01-16T11:30:00Z",
    updatedAt: "2024-01-16T11:30:00Z",
  },
  {
    id: "property-doc-4",
    propertyId: "property-2",
    documentType: "",
    filename: "property_deed_florence.pdf",
    fileUrl: "/mock-documents/property_deed_florence.pdf",
    verified: true,
    uploadedById: "user-2",
    createdAt: "2024-01-19T15:00:00Z",
    updatedAt: "2024-01-19T15:00:00Z",
  },
  {
    id: "property-doc-5",
    propertyId: "property-2",
    documentType: "",
    filename: "florence_villa_1.jpg",
    fileUrl: "/mock-documents/florence_villa_1.jpg",
    verified: true,
    uploadedById: "user-2",
    createdAt: "2024-01-19T15:15:00Z",
    updatedAt: "2024-01-19T15:15:00Z",
  },
  {
    id: "property-doc-6",
    propertyId: "property-4",
    documentType: "",
    filename: "property_deed_london.pdf",
    fileUrl: "/mock-documents/property_deed_london.pdf",
    verified: true,
    uploadedById: "user-8",
    createdAt: "2024-01-28T13:00:00Z",
    updatedAt: "2024-01-28T13:00:00Z",
  },
  {
    id: "property-doc-7",
    propertyId: "property-4",
    documentType: "",
    filename: "energy_cert_london.pdf",
    fileUrl: "/mock-documents/energy_cert_london.pdf",
    verified: true,
    uploadedById: "user-8",
    createdAt: "2024-01-28T13:15:00Z",
    updatedAt: "2024-01-28T13:15:00Z",
  },
  {
    id: "property-doc-8",
    propertyId: "property-4",
    documentType: "",
    filename: "london_apartment_1.jpg",
    fileUrl: "/mock-documents/london_apartment_1.jpg",
    verified: true,
    uploadedById: "user-8",
    createdAt: "2024-01-28T13:30:00Z",
    updatedAt: "2024-01-28T13:30:00Z",
  },
  {
    id: "property-doc-9",
    propertyId: "property-5",
    documentType: "",
    filename: "property_deed_bath.pdf",
    fileUrl: "/mock-documents/property_deed_bath.pdf",
    verified: true,
    uploadedById: "user-8",
    createdAt: "2024-02-05T15:30:00Z",
    updatedAt: "2024-02-05T15:30:00Z",
  },
  {
    id: "property-doc-10",
    propertyId: "property-5",
    documentType: "",
    filename: "bath_cottage_1.jpg",
    fileUrl: "/mock-documents/bath_cottage_1.jpg",
    verified: true,
    uploadedById: "user-8",
    createdAt: "2024-02-05T15:45:00Z",
    updatedAt: "2024-02-05T15:45:00Z",
  },
]

// Mock Offers
export const mockOffers: MockOffer[] = [
  {
    id: "offer-1",
    propertyId: "property-1",
    sellerProfileId: "seller-1",
    initialPaymentAmount: 120000,
    monthlyPaymentAmount: 800,
    indexationRate: 2.5,
    status: OfferStatus.ACCEPTED,
    agreementType: AgreementType.STANDARD,
    occupancyRight: OccupancyRight.FULL,
    createdAt: "2024-01-24T14:00:00Z",
    updatedAt: "2024-01-26T09:30:00Z",
  },
  {
    id: "offer-2",
    propertyId: "property-2",
    sellerProfileId: "seller-2",
    initialPaymentAmount: 200000,
    monthlyPaymentAmount: 1200,
    indexationRate: 3.0,
    status: OfferStatus.PENDING,
    agreementType: AgreementType.STANDARD,
    occupancyRight: OccupancyRight.FULL,
    createdAt: "2024-02-02T11:00:00Z",
    updatedAt: "2024-02-02T11:00:00Z",
  },
  {
    id: "offer-3",
    propertyId: "property-2",
    sellerProfileId: "seller-2",
    initialPaymentAmount: 180000,
    monthlyPaymentAmount: 1000,
    indexationRate: 2.8,
    status: OfferStatus.REJECTED,
    agreementType: AgreementType.STANDARD,
    occupancyRight: OccupancyRight.FULL,
    createdAt: "2024-01-30T15:30:00Z",
    updatedAt: "2024-02-01T10:15:00Z",
  },
  {
    id: "offer-4",
    propertyId: "property-4",
    sellerProfileId: "seller-3",
    initialPaymentAmount: 350000,
    monthlyPaymentAmount: 1500,
    indexationRate: 2.2,
    status: OfferStatus.ACCEPTED,
    agreementType: AgreementType.STANDARD,
    occupancyRight: OccupancyRight.FULL,
    createdAt: "2024-02-05T10:00:00Z",
    updatedAt: "2024-02-07T14:30:00Z",
  },
  {
    id: "offer-5",
    propertyId: "property-5",
    sellerProfileId: "seller-3",
    initialPaymentAmount: 250000,
    monthlyPaymentAmount: 1300,
    indexationRate: 2.0,
    status: OfferStatus.PENDING,
    agreementType: AgreementType.STANDARD,
    occupancyRight: OccupancyRight.FULL,
    createdAt: "2024-02-10T09:30:00Z",
    updatedAt: "2024-02-10T09:30:00Z",
  },
]

// Mock Contracts
export const mockContracts: MockContract[] = [
  {
    id: "contract-1",
    offerId: "offer-1",
    buyBoxName: "Paris Property Investment",
    contractNumber: "VGCT-2024-001",
    status: "COMPLETED",
    createdAt: "2024-01-27T10:00:00Z",
    updatedAt: "2024-01-30T14:45:00Z",
    totalAmount: 350000,
    propertyAddresses: ["15 Rue de la Paix, Paris"],
    buyerName: "Investment Fund A",
    sellerNames: ["John Doe"],
    signedByBuyer: true,
    signedBySellers: true,
    buyerSignedAt: "2024-01-29T10:00:00Z",
    sellersSignedAt: "2024-01-28T15:30:00Z",
    termsAndConditions: "Standard terms and conditions apply",
  },
  {
    id: "contract-2",
    offerId: "offer-4",
    buyBoxName: "London Property Investment",
    contractNumber: "VGCT-2024-002",
    status: "PENDING",
    createdAt: "2024-02-08T11:00:00Z",
    updatedAt: "2024-02-10T15:30:00Z",
    totalAmount: 950000,
    propertyAddresses: ["27 Kensington Gardens, London"],
    buyerName: "Investment Fund B",
    sellerNames: ["Jane Smith"],
    signedByBuyer: false,
    signedBySellers: true,
    sellersSignedAt: "2024-02-09T14:00:00Z",
    termsAndConditions: "Standard terms and conditions apply",
  },
]

// Mock Valuations
export const mockValuations: MockValuation[] = [
  {
    id: "valuation-1",
    propertyId: "property-1",
    valuerId: "valuer-1",
    marketValue: 370000,
    occupiedValue: 260000,
    status: ValuationStatus.COMPLETED,
    notes: "Well-maintained apartment in prime central Paris location",
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-01-22T14:30:00Z",
  },
  {
    id: "valuation-2",
    propertyId: "property-2",
    valuerId: "valuer-1",
    marketValue: 600000,
    occupiedValue: 420000,
    status: ValuationStatus.COMPLETED,
    notes: "Excellent condition villa with high-end amenities",
    createdAt: "2024-01-23T10:15:00Z",
    updatedAt: "2024-01-25T16:00:00Z",
  },
  {
    id: "valuation-3",
    propertyId: "property-3",
    valuerId: "valuer-1",
    marketValue: 440000,
    occupiedValue: 310000,
    status: ValuationStatus.IN_PROGRESS,
    createdAt: "2024-01-28T11:30:00Z",
    updatedAt: "2024-01-28T11:30:00Z",
  },
  {
    id: "valuation-4",
    propertyId: "property-4",
    valuerId: "valuer-1",
    marketValue: 980000,
    occupiedValue: 685000,
    status: ValuationStatus.COMPLETED,
    notes:
      "Luxury apartment in prestigious Kensington area with excellent transport links",
    createdAt: "2024-01-30T09:45:00Z",
    updatedAt: "2024-02-01T15:20:00Z",
  },
  {
    id: "valuation-5",
    propertyId: "property-5",
    valuerId: "valuer-1",
    marketValue: 780000,
    occupiedValue: 545000,
    status: ValuationStatus.COMPLETED,
    notes:
      "Historic cottage in excellent condition with period features throughout",
    createdAt: "2024-02-07T11:00:00Z",
    updatedAt: "2024-02-09T14:30:00Z",
  },
]

// Helper function to find a property by ID
export const findPropertyById = (id: string): MockProperty | undefined => {
  return mockProperties.find((property) => property.id === id)
}

// Helper function to find properties by seller ID
export const findPropertiesBySellerId = (sellerId: string): MockProperty[] => {
  const sellerPropertyIds = mockSellerProperties
    .filter((sp) => sp.sellerId === sellerId)
    .map((sp) => sp.propertyId)

  return mockProperties.filter((property) =>
    sellerPropertyIds.includes(property.id)
  )
}

// Helper function to find documents by property ID
export const findDocumentsByPropertyId = (
  propertyId: string
): MockPropertyDocument[] => {
  return mockPropertyDocuments.filter((doc) => doc.propertyId === propertyId)
}

// Helper function to find offers by property ID
export const findOffersByPropertyId = (propertyId: string): MockOffer[] => {
  return mockOffers.filter((offer) => offer.propertyId === propertyId)
}

// Helper function to find offers by seller ID
export const findOffersBySellerId = (sellerProfileId: string): MockOffer[] => {
  return mockOffers.filter((offer) => offer.sellerProfileId === sellerProfileId)
}

// Helper function to find contract by offer ID
export const findContractByOfferId = (
  offerId: string
): MockContract | undefined => {
  return mockContracts.find((contract) => contract.offerId === offerId)
}

// Helper function to find valuations by property ID
export const findValuationsByPropertyId = (
  propertyId: string
): MockValuation[] => {
  return mockValuations.filter(
    (valuation) => valuation.propertyId === propertyId
  )
}

// Helper function to find valuations by valuer ID
export const findValuationsByValuerId = (valuerId: string): MockValuation[] => {
  return mockValuations.filter((valuation) => valuation.valuerId === valuerId)
}
