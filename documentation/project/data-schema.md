# Srenova: Data Schema Overview

## Overview
This document provides an overview of the data schema required for the Srenova platform, based on the Prisma schema provided. The schema is designed to support all user types and their interactions with the platform.

## Core Entities

### User Management
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  preferredLanguage: Language;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date;
  
  // Relations
  contactAddress: ContactAddress;
  sellerProfiles: SellerProfile[];
  documents: Document[];
  notifications: Notification[];
  activityLogs: ActivityLog[];
}
```

### Seller Profile
```typescript
interface SellerProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  generalHealth: HealthCondition;
  financialPriority: FinancialPriority;
  willStayInProperty: boolean;
  
  // Relations
  properties: SellerProperty[];
  offers: Offer[];
  contracts: Contract[];
}
```

### Property
```typescript
interface Property {
  id: string;
  propertyType: PropertyType;
  bedroomCount: number;
  bathroomCount: number;
  totalAreaSqM: number;
  condition: PropertyCondition;
  estimatedValue: number;
  confirmedValue: number;
  
  // Relations
  address: PropertyAddress;
  documents: PropertyDocument[];
  valuations: Valuation[];
  offers: Offer[];
  sellerProperties: SellerProperty[];
}
```

### Offer
```typescript
interface Offer {
  id: string;
  propertyId: string;
  sellerProfileId: string;
  initialPaymentAmount: number;
  monthlyPaymentAmount: number;
  indexationRate: number;
  status: OfferStatus;
  agreementType: AgreementType;
  occupancyRight: OccupancyRight;
  
  // Relations
  contract: Contract;
}
```

### Contract
```typescript
interface Contract {
  id: string;
  offerId: string;
  sellerProfileId: string;
  contractNumber: string;
  status: ContractStatus;
  signedBySeller: boolean;
  signedByBuyer: boolean;
  
  // Relations
  offer: Offer;
}
```

### BuyBox
```typescript
interface BuyBox {
  id: string;
  name: string;
  description: string;
  isAdminCreated: boolean; // Whether it was created by admin or self-created by investor
  creatorId: string; // User ID of creator (admin or investor)
  status: BuyBoxStatus;
  totalValue: number; // Sum of all properties' values
  initialInvestmentAmount: number; // Total initial payment required
  estimatedMonthlyIncome: number; // Total estimated monthly income
  averageIndexationRate: number; // Average indexation rate across all properties
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  creator: User;
  properties: BuyBoxProperty[];
  offers: BuyBoxOffer[];
}
```

### BuyBoxProperty
```typescript
interface BuyBoxProperty {
  id: string;
  buyBoxId: string;
  propertyId: string;
  
  // Relations
  buyBox: BuyBox;
  property: Property;
}
```

### BuyBoxOffer
```typescript
interface BuyBoxOffer {
  id: string;
  buyBoxId: string;
  buyerId: string;
  status: OfferStatus;
  initialPaymentAmount: number;
  totalMonthlyPaymentAmount: number;
  averageIndexationRate: number;
  agreementType: AgreementType;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  buyBox: BuyBox;
  buyer: User;
  contract: BuyBoxContract;
}
```

### BuyBoxContract
```typescript
interface BuyBoxContract {
  id: string;
  buyBoxOfferId: string;
  contractNumber: string;
  status: ContractStatus;
  signedByBuyer: boolean;
  signedBySellers: boolean; // All sellers must sign
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  buyBoxOffer: BuyBoxOffer;
  individualContracts: Contract[]; // Individual property contracts
}
```

## Supporting Entities

### Document Management
```typescript
interface Document {
  id: string;
  userId: string;
  documentType: DocumentType;
  filename: string;
  fileUrl: string;
  fileSize: number;
  verified: boolean;
  
  // Relations
  user: User;
}
```

### Property Documents
```typescript
interface PropertyDocument {
  id: string;
  propertyId: string;
  documentType: string;
  filename: string;
  fileUrl: string;
  verified: boolean;
  
  // Relations
  property: Property;
  uploadedBy: User;
}
```

### Valuation
```typescript
interface Valuation {
  id: string;
  propertyId: string;
  valuerId: string;
  marketValue: number;
  occupiedValue: number;
  status: ValuationStatus;
  
  // Relations
  property: Property;
  valuer: User;
}
```

## Enums

### User Roles
```typescript
enum UserRole {
  SELLER
  FAMILY_SUPPORTER
  FUND_BUYER
  CONVEYANCER
  VALUER
  ADMIN
  SUPER_ADMIN
}
```

### Property Types
```typescript
enum PropertyType {
  HOUSE
  APARTMENT
  BUNGALOW
  COTTAGE
  VILLA
  OTHER
}
```

### Health Conditions
```typescript
enum HealthCondition {
  EXCELLENT
  GOOD
  FAIR
  POOR
}
```

### Offer Status
```typescript
enum OfferStatus {
  DRAFT
  PENDING
  ACCEPTED
  REJECTED
  EXPIRED
  WITHDRAWN
}
```

### Contract Status
```typescript
enum ContractStatus {
  DRAFT
  PENDING_SIGNATURE
  PARTIALLY_SIGNED
  SIGNED
  COMPLETED
  TERMINATED
  DISPUTED
}
```

### BuyBox Status
```typescript
enum BuyBoxStatus {
  DRAFT
  ACTIVE
  PENDING_OFFER
  SOLD
  ARCHIVED
}
```

## Relationships

### One-to-One
- User ↔ ContactAddress
- Offer ↔ Contract
- Property ↔ PropertyAddress
- BuyBoxOffer ↔ BuyBoxContract

### One-to-Many
- User → SellerProfiles
- User → Documents
- Property → PropertyDocuments
- Property → Valuations
- SellerProfile → Properties
- SellerProfile → Offers
- User → BuyBoxes (created by)
- BuyBox → BuyBoxProperties
- BuyBox → BuyBoxOffers

### Many-to-Many
- Property ↔ SellerProfile (through SellerProperty)
- BuyBox ↔ Property (through BuyBoxProperty)

## Data Validation Rules

### User Data
- Email must be unique
- Password hash required for non-magic link users
- Role must be valid
- Status must be valid

### Property Data
- Total area must be positive
- Bedroom/bathroom counts must be non-negative
- Estimated value must be positive
- Condition must be valid

### Offer Data
- Initial payment must be positive
- Monthly payment must be positive
- Indexation rate must be between 0 and 100
- Status must be valid

### Document Data
- File size must be within limits
- File type must be allowed
- URL must be valid
- Verification status must be tracked

## Data Access Patterns

### Read Operations
- User profile lookup
- Property details retrieval
- Offer status check
- Document access
- Activity log review

### Write Operations
- User registration
- Property creation
- Offer submission
- Contract signing
- Document upload

### Update Operations
- Profile updates
- Property modifications
- Offer revisions
- Status changes
- Document verification

### Delete Operations
- Soft delete for users
- Archive for properties
- Cancel for offers
- Void for contracts
- Remove for documents

## Data Security

### Access Control
- Role-based permissions
- Data ownership rules
- Document access levels
- Audit logging
- Session management

### Data Protection
- Encryption at rest
- Secure transmission
- GDPR compliance
- Data retention
- Backup strategy

## Data Migration

### Initial Setup
- Schema creation
- Index optimization
- Constraint setup
- Default data
- Test data

### Version Control
- Schema versioning
- Migration scripts
- Rollback procedures
- Data validation
- Integrity checks

## Monitoring and Maintenance

### Performance
- Query optimization
- Index monitoring
- Connection pooling
- Cache strategy
- Load balancing

### Maintenance
- Regular backups
- Data cleanup
- Index rebuilds
- Statistics updates
- Health checks 