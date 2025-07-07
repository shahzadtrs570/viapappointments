/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/

import {
  MockAdminProfile,
  MockConveyancerProfile,
  MockFamilySupporterProfile,
  MockFundBuyerProfile,
  MockSellerProfile,
  MockUser,
  MockValuerProfile,
  UserRole,
  HealthCondition,
  FinancialPriority,
} from "../types"

// Mock Users
export const mockUsers: MockUser[] = [
  {
    id: "user-1",
    name: "Jean Dupont",
    email: "jean.dupont@example.com",
    emailVerified: "2024-01-15T09:00:00Z",
    image: "/mock-images/avatar-1.jpg",
    hasOnboarded: true,
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
    role: UserRole.SELLER,
    preferredLanguage: "fr",
  },
  {
    id: "user-2",
    name: "Maria Rossi",
    email: "maria.rossi@example.com",
    emailVerified: "2024-01-18T14:30:00Z",
    image: "/mock-images/avatar-2.jpg",
    hasOnboarded: true,
    createdAt: "2024-01-18T14:30:00Z",
    updatedAt: "2024-01-18T14:30:00Z",
    role: UserRole.SELLER,
    preferredLanguage: "it",
  },
  {
    id: "user-3",
    name: "Sophie Martin",
    email: "sophie.martin@example.com",
    emailVerified: "2024-01-20T11:15:00Z",
    image: "/mock-images/avatar-3.jpg",
    hasOnboarded: true,
    createdAt: "2024-01-20T11:15:00Z",
    updatedAt: "2024-01-20T11:15:00Z",
    role: UserRole.FAMILY_SUPPORTER,
    preferredLanguage: "fr",
  },
  {
    id: "user-4",
    name: "European Viager Fund",
    email: "contact@evfund.example.com",
    emailVerified: "2024-01-10T08:45:00Z",
    image: "/mock-images/avatar-4.jpg",
    hasOnboarded: true,
    createdAt: "2024-01-10T08:45:00Z",
    updatedAt: "2024-01-10T08:45:00Z",
    role: UserRole.FUND_BUYER,
    preferredLanguage: "en",
  },
  {
    id: "user-5",
    name: "Etienne Notaire",
    email: "etienne.notaire@example.com",
    emailVerified: "2024-01-12T13:20:00Z",
    image: "/mock-images/avatar-5.jpg",
    hasOnboarded: true,
    createdAt: "2024-01-12T13:20:00Z",
    updatedAt: "2024-01-12T13:20:00Z",
    role: UserRole.CONVEYANCER,
    preferredLanguage: "fr",
  },
  {
    id: "user-6",
    name: "Marco Valutazione",
    email: "marco.valutazione@example.com",
    emailVerified: "2024-01-14T15:10:00Z",
    image: "/mock-images/avatar-6.jpg",
    hasOnboarded: true,
    createdAt: "2024-01-14T15:10:00Z",
    updatedAt: "2024-01-14T15:10:00Z",
    role: UserRole.VALUER,
    preferredLanguage: "it",
  },
  {
    id: "user-7",
    name: "Admin User",
    email: "admin@Srenova.example.com",
    emailVerified: "2024-01-05T10:00:00Z",
    image: "/mock-images/avatar-7.jpg",
    hasOnboarded: true,
    createdAt: "2024-01-05T10:00:00Z",
    updatedAt: "2024-01-05T10:00:00Z",
    role: UserRole.ADMIN,
    preferredLanguage: "en",
  },
  {
    id: "user-8",
    name: "Margaret Thompson",
    email: "margaret.thompson@example.com",
    emailVerified: "2024-01-26T10:30:00Z",
    image: "/mock-images/avatar-8.jpg",
    hasOnboarded: true,
    createdAt: "2024-01-26T10:30:00Z",
    updatedAt: "2024-01-26T10:30:00Z",
    role: UserRole.SELLER,
    preferredLanguage: "en",
  },
]

// Mock Seller Profiles
export const mockSellerProfiles: MockSellerProfile[] = [
  {
    id: "seller-1",
    userId: "user-1",
    firstName: "Jean",
    lastName: "Dupont",
    dateOfBirth: "1945-05-10T00:00:00Z",
    generalHealth: HealthCondition.GOOD,
    financialPriority: FinancialPriority.MIXED,
    willStayInProperty: true,
    createdAt: "2024-01-15T09:30:00Z",
    updatedAt: "2024-01-15T09:30:00Z",
  },
  {
    id: "seller-2",
    userId: "user-2",
    firstName: "Maria",
    lastName: "Rossi",
    dateOfBirth: "1950-08-22T00:00:00Z",
    generalHealth: HealthCondition.EXCELLENT,
    financialPriority: FinancialPriority.LUMP_SUM,
    willStayInProperty: true,
    createdAt: "2024-01-18T15:00:00Z",
    updatedAt: "2024-01-18T15:00:00Z",
  },
  {
    id: "seller-3",
    userId: "user-8",
    firstName: "Margaret",
    lastName: "Thompson",
    dateOfBirth: "1942-11-15T00:00:00Z",
    generalHealth: HealthCondition.FAIR,
    financialPriority: FinancialPriority.MONTHLY_INCOME,
    willStayInProperty: true,
    createdAt: "2024-01-26T11:00:00Z",
    updatedAt: "2024-01-26T11:00:00Z",
  },
]

// Mock Family Supporter Profiles
export const mockFamilySupporterProfiles: MockFamilySupporterProfile[] = [
  {
    id: "family-supporter-1",
    userId: "user-3",
    firstName: "Sophie",
    lastName: "Martin",
    relationshipToSeller: "Daughter",
    createdAt: "2024-01-20T11:45:00Z",
    updatedAt: "2024-01-20T11:45:00Z",
  },
]

// Mock Fund Buyer Profiles
export const mockFundBuyerProfiles: MockFundBuyerProfile[] = [
  {
    id: "fund-buyer-1",
    userId: "user-4",
    companyName: "European Viager Fund",
    registrationNumber: "EVF123456789",
    createdAt: "2024-01-10T09:15:00Z",
    updatedAt: "2024-01-10T09:15:00Z",
  },
]

// Mock Conveyancer Profiles
export const mockConveyancerProfiles: MockConveyancerProfile[] = [
  {
    id: "conveyancer-1",
    userId: "user-5",
    firmName: "Notaire & Associés",
    licenseNumber: "NC78901234",
    createdAt: "2024-01-12T13:50:00Z",
    updatedAt: "2024-01-12T13:50:00Z",
  },
]

// Mock Valuer Profiles
export const mockValuerProfiles: MockValuerProfile[] = [
  {
    id: "valuer-1",
    userId: "user-6",
    firmName: "Valutazione Immobiliare",
    licenseNumber: "VI56789012",
    createdAt: "2024-01-14T15:40:00Z",
    updatedAt: "2024-01-14T15:40:00Z",
  },
]

// Mock Admin Profiles
export const mockAdminProfiles: MockAdminProfile[] = [
  {
    id: "admin-1",
    userId: "user-7",
    adminLevel: "System Administrator",
    createdAt: "2024-01-05T10:30:00Z",
    updatedAt: "2024-01-05T10:30:00Z",
  },
]

// Helper function to find a user by ID
export const findUserById = (id: string): MockUser | undefined => {
  return mockUsers.find((user) => user.id === id)
}

// Helper function to find a user by role
export const findUsersByRole = (role: UserRole): MockUser[] => {
  return mockUsers.filter((user) => user.role === role)
}

// Helper function to get seller profile by user ID
export const getSellerProfileByUserId = (
  userId: string
): MockSellerProfile | undefined => {
  return mockSellerProfiles.find((profile) => profile.userId === userId)
}

// Helper function to get family supporter profile by user ID
export const getFamilySupporterProfileByUserId = (
  userId: string
): MockFamilySupporterProfile | undefined => {
  return mockFamilySupporterProfiles.find(
    (profile) => profile.userId === userId
  )
}

// Helper function to get fund buyer profile by user ID
export const getFundBuyerProfileByUserId = (
  userId: string
): MockFundBuyerProfile | undefined => {
  return mockFundBuyerProfiles.find((profile) => profile.userId === userId)
}

// Helper function to get conveyancer profile by user ID
export const getConveyancerProfileByUserId = (
  userId: string
): MockConveyancerProfile | undefined => {
  return mockConveyancerProfiles.find((profile) => profile.userId === userId)
}

// Helper function to get valuer profile by user ID
export const getValuerProfileByUserId = (
  userId: string
): MockValuerProfile | undefined => {
  return mockValuerProfiles.find((profile) => profile.userId === userId)
}

// Helper function to get admin profile by user ID
export const getAdminProfileByUserId = (
  userId: string
): MockAdminProfile | undefined => {
  return mockAdminProfiles.find((profile) => profile.userId === userId)
}
