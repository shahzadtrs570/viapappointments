/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/
import {
  MockBuyBox,
  MockBuyBoxProperty,
  MockBuyBoxOffer,
  MockBuyBoxContract,
  BuyBoxStatus,
  OfferStatus,
  AgreementType,
  ContractStatus,
} from "../types"
import { mockProperties } from "../properties"
import { mockUsers } from "../users"

// Find necessary user IDs
const adminId = mockUsers.find((user) => user.role === "ADMIN")?.id || ""
const fundBuyerId =
  mockUsers.find((user) => user.role === "FUND_BUYER")?.id || ""

// Get property IDs for different regions
const ukPropertyIds = mockProperties
  .filter((property) => property.address.country === "United Kingdom")
  .map((property) => property.id)

const spainPropertyIds = mockProperties
  .filter((property) => property.address.country === "Spain")
  .map((property) => property.id)

const italyPropertyIds = mockProperties
  .filter((property) => property.address.country === "Italy")
  .map((property) => property.id)

// Mock Buy Boxes
export const mockBuyBoxes: MockBuyBox[] = [
  {
    id: "bb-001",
    name: "UK Prime Portfolio",
    description:
      "A collection of premium properties in the UK with excellent rental yield potential.",
    isAdminCreated: true,
    creatorId: adminId,
    status: BuyBoxStatus.ACTIVE,
    totalValue: 2500000,
    initialInvestmentAmount: 750000,
    estimatedMonthlyIncome: 12500,
    averageIndexationRate: 2.5,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "bb-002",
    name: "Mediterranean Collection",
    description:
      "Beautiful coastal properties in Spain and Italy offering excellent vacation rental opportunities.",
    isAdminCreated: true,
    creatorId: adminId,
    status: BuyBoxStatus.ACTIVE,
    totalValue: 3200000,
    initialInvestmentAmount: 960000,
    estimatedMonthlyIncome: 16000,
    averageIndexationRate: 2.7,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "bb-003",
    name: "Premium Retirement Homes",
    description:
      "A carefully selected portfolio of properties ideal for senior living, with high occupancy rates.",
    isAdminCreated: true,
    creatorId: adminId,
    status: BuyBoxStatus.ACTIVE,
    totalValue: 1800000,
    initialInvestmentAmount: 540000,
    estimatedMonthlyIncome: 9000,
    averageIndexationRate: 2.2,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "bb-004",
    name: "Custom Portfolio",
    description:
      "A custom-built portfolio created by the fund buyer focusing on UK and Spanish properties.",
    isAdminCreated: false,
    creatorId: fundBuyerId,
    status: BuyBoxStatus.DRAFT,
    totalValue: 1500000,
    initialInvestmentAmount: 450000,
    estimatedMonthlyIncome: 7500,
    averageIndexationRate: 2.3,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Buy Box Property connections
export const mockBuyBoxProperties: MockBuyBoxProperty[] = [
  // UK Prime Portfolio properties
  ...ukPropertyIds.slice(0, 2).map((propertyId) => ({
    id: `bbp-${mockBuyBoxes[0].id}-${propertyId}`,
    buyBoxId: mockBuyBoxes[0].id,
    propertyId,
    createdAt: mockBuyBoxes[0].createdAt,
    updatedAt: mockBuyBoxes[0].createdAt,
  })),

  // Mediterranean Collection properties
  ...spainPropertyIds.slice(0, 1).map((propertyId) => ({
    id: `bbp-${mockBuyBoxes[1].id}-${propertyId}`,
    buyBoxId: mockBuyBoxes[1].id,
    propertyId,
    createdAt: mockBuyBoxes[1].createdAt,
    updatedAt: mockBuyBoxes[1].createdAt,
  })),
  ...italyPropertyIds.slice(0, 1).map((propertyId) => ({
    id: `bbp-${mockBuyBoxes[1].id}-${propertyId}`,
    buyBoxId: mockBuyBoxes[1].id,
    propertyId,
    createdAt: mockBuyBoxes[1].createdAt,
    updatedAt: mockBuyBoxes[1].createdAt,
  })),

  // Premium Retirement Homes properties
  ...ukPropertyIds.slice(0, 1).map((propertyId) => ({
    id: `bbp-${mockBuyBoxes[2].id}-${propertyId}`,
    buyBoxId: mockBuyBoxes[2].id,
    propertyId,
    createdAt: mockBuyBoxes[2].createdAt,
    updatedAt: mockBuyBoxes[2].createdAt,
  })),
  ...spainPropertyIds.slice(1, 2).map((propertyId) => ({
    id: `bbp-${mockBuyBoxes[2].id}-${propertyId}`,
    buyBoxId: mockBuyBoxes[2].id,
    propertyId,
    createdAt: mockBuyBoxes[2].createdAt,
    updatedAt: mockBuyBoxes[2].createdAt,
  })),

  // Custom Portfolio properties
  ...ukPropertyIds.slice(0, 1).map((propertyId) => ({
    id: `bbp-${mockBuyBoxes[3].id}-${propertyId}`,
    buyBoxId: mockBuyBoxes[3].id,
    propertyId,
    createdAt: mockBuyBoxes[3].createdAt,
    updatedAt: mockBuyBoxes[3].createdAt,
  })),
  ...spainPropertyIds.slice(0, 1).map((propertyId) => ({
    id: `bbp-${mockBuyBoxes[3].id}-${propertyId}`,
    buyBoxId: mockBuyBoxes[3].id,
    propertyId,
    createdAt: mockBuyBoxes[3].createdAt,
    updatedAt: mockBuyBoxes[3].createdAt,
  })),
]

// Buy Box Offers
export const mockBuyBoxOffers: MockBuyBoxOffer[] = [
  {
    id: "bbo-001",
    buyBoxId: mockBuyBoxes[0].id,
    buyerId: fundBuyerId,
    initialPaymentAmount: 700000,
    totalMonthlyPaymentAmount: 11000,
    averageIndexationRate: 2.3,
    status: OfferStatus.PENDING,
    agreementType: AgreementType.STANDARD,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "bbo-002",
    buyBoxId: mockBuyBoxes[1].id,
    buyerId: fundBuyerId,
    initialPaymentAmount: 930000,
    totalMonthlyPaymentAmount: 15000,
    averageIndexationRate: 2.5,
    status: OfferStatus.ACCEPTED,
    agreementType: AgreementType.STANDARD,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Buy Box Contracts
export const mockBuyBoxContracts: MockBuyBoxContract[] = [
  {
    id: "bbc-001",
    buyBoxOfferId: mockBuyBoxOffers[1].id,
    contractNumber: `BBCNT-${Math.floor(100000 + Math.random() * 900000)}`,
    status: ContractStatus.PENDING_SIGNATURE,
    signedByBuyer: true,
    signedBySellers: false,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

// Helper functions
/**
 * Find a buy box by ID
 */
export const findBuyBoxById = (buyBoxId: string): MockBuyBox | undefined => {
  return mockBuyBoxes.find((buyBox) => buyBox.id === buyBoxId)
}

/**
 * Find properties in a buy box
 */
export const findPropertiesByBuyBoxId = (buyBoxId: string) => {
  const buyBoxPropertyIds = mockBuyBoxProperties
    .filter((bp) => bp.buyBoxId === buyBoxId)
    .map((bp) => bp.propertyId)

  return mockProperties.filter((property) =>
    buyBoxPropertyIds.includes(property.id)
  )
}

/**
 * Find offers for a buy box
 */
export const findOffersByBuyBoxId = (buyBoxId: string) => {
  return mockBuyBoxOffers.filter((offer) => offer.buyBoxId === buyBoxId)
}

/**
 * Find contracts for a buy box offer
 */
export const findContractsByBuyBoxOfferId = (buyBoxOfferId: string) => {
  return mockBuyBoxContracts.filter(
    (contract) => contract.buyBoxOfferId === buyBoxOfferId
  )
}

/**
 * Find all buy boxes created by a user
 */
export const findBuyBoxesByCreatorId = (creatorId: string) => {
  return mockBuyBoxes.filter((buyBox) => buyBox.creatorId === creatorId)
}
