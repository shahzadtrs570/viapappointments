# Property Details Field Encryption Implementation

This document explains how field-level encryption has been implemented for the Property and PropertyAddress models using `prisma-field-encryption`.

## Overview

Since `prisma-field-encryption` only supports encrypting String fields, we've implemented a comprehensive solution that converts all data types (Int, Float, DateTime, String[]) to encrypted strings before storage and converts them back to their original types when retrieving data.

## Schema Changes

### Property Model
```prisma
model Property {
  // Changed from Int/Float to encrypted String
  bedroomCount   String   /// @encrypted  // was: Int
  bathroomCount  String   /// @encrypted  // was: Int
  totalAreaSqM   String   /// @encrypted  // was: Float
  estimatedValue String   /// @encrypted  // was: Float
  confirmedValue String?  /// @encrypted  // was: Float?
  yearBuilt      String?  /// @encrypted  // was: String? (now encrypted)
  features       String   /// @encrypted  // was: String[] (now JSON string)
  leaseLength    String?  /// @encrypted  // was: String? (now encrypted)
  // ... other fields
}
```

### PropertyAddress Model
```prisma
model PropertyAddress {
  // All address fields now encrypted
  streetLine1 String   /// @encrypted
  streetLine2 String?  /// @encrypted
  city        String   /// @encrypted
  state       String?  /// @encrypted
  postalCode  String   /// @encrypted
  country     String   /// @encrypted
  // ... other fields
}
```

## Implementation Components

### 1. Encryption Utilities (`utils/encryptionUtils.ts`)

Comprehensive utilities for data type conversion:

#### Integer Conversion
- `intToEncryptedString(value: number): string` - Converts integer to encrypted string
- `encryptedStringToInt(value: string): number` - Converts back to integer
- `parseInputToEncryptedInt(input: string): string` - Safely parses string input to encrypted int

#### Float Conversion
- `floatToEncryptedString(value: number): string` - Converts float to encrypted string
- `encryptedStringToFloat(value: string): number` - Converts back to float
- `parseInputToEncryptedFloat(input: string): string` - Safely parses string input to encrypted float

#### String Array Conversion
- `stringArrayToEncryptedString(values: string[]): string` - Converts array to JSON string
- `encryptedStringToStringArray(value: string): string[]` - Converts back to string array

#### Safe Conversion
- `safeEncryptedStringToFloat(value: string | null): number | null` - Handles nullable values
- `safeEncryptedStringToInt(value: string | null): number | null` - Handles nullable values

### 2. Repository Layer (`repository/details.repository.ts`)

#### Data Transformation
- **Input**: Converts API data to encrypted strings before database operations
- **Output**: Transforms encrypted strings back to expected types for API responses

#### Key Methods
```typescript
// Transform encrypted data back to API format
private transformPropertyForAPI(property: any): DecryptedProperty {
  return {
    ...property,
    bedroomCount: encryptedStringToInt(property.bedroomCount),
    bathroomCount: encryptedStringToInt(property.bathroomCount),
    totalAreaSqM: encryptedStringToFloat(property.totalAreaSqM),
    estimatedValue: encryptedStringToFloat(property.estimatedValue),
    confirmedValue: safeEncryptedStringToFloat(property.confirmedValue),
    features: encryptedStringToStringArray(property.features),
  }
}
```

#### Create Operation
```typescript
const property = await tx.property.create({
  data: {
    bedroomCount: parseInputToEncryptedInt(data.bedrooms) as any,
    bathroomCount: parseInputToEncryptedInt(data.bathrooms) as any,
    totalAreaSqM: parseInputToEncryptedFloat(data.propertySize) as any,
    estimatedValue: parseInputToEncryptedFloat(data.estimatedValue) as any,
    features: stringArrayToEncryptedString(data.features || []) as any,
    // ... other fields
  },
})
```

#### Read Operations
```typescript
async get(id: string): Promise<DecryptedProperty | null> {
  const property = await db.property.findUnique({ where: { id }, include: {...} })
  if (!property) return null
  return this.transformPropertyForAPI(property)
}
```

### 3. API Types

#### DecryptedProperty Interface
Defines the expected API response format with proper data types:
```typescript
interface DecryptedProperty {
  id: string
  bedroomCount: number      // Decrypted from encrypted string
  bathroomCount: number     // Decrypted from encrypted string
  totalAreaSqM: number      // Decrypted from encrypted string
  estimatedValue: number    // Decrypted from encrypted string
  confirmedValue: number | null  // Decrypted from encrypted string
  features: string[]        // Decrypted from encrypted JSON string
  // ... other fields
}
```

## Data Flow

### 1. Creating a Property
```
API Input (PropertyDetails) 
  ↓ 
Service Layer (validates)
  ↓ 
Repository Layer (converts to encrypted strings)
  ↓ 
Database (stores encrypted strings)
```

### 2. Retrieving a Property
```
Database (returns encrypted strings)
  ↓ 
Repository Layer (transforms to DecryptedProperty)
  ↓ 
Service Layer (passes through)
  ↓ 
API Response (proper data types)
```

## Security Benefits

1. **Data at Rest**: All sensitive property data is encrypted in the database
2. **Backup Security**: Database backups contain only encrypted data
3. **Access Control**: Raw database access doesn't reveal sensitive information
4. **Transparent Operation**: API consumers receive data in expected formats

## Type Safety

- Uses TypeScript interfaces to ensure type safety at compile time
- `DecryptedProperty` interface guarantees API consumers get correct types
- Utility functions include validation and error handling
- Type assertions (`as any`) used temporarily for Prisma type compatibility

## Migration Process

1. **Schema Update**: Changed field types from Int/Float to String with `/// @encrypted`
2. **Database Migration**: Applied with `pnpm db:deploy` and `pnpm db:push`
3. **Client Generation**: Updated with `pnpm db:generate`
4. **Code Updates**: Repository and utility functions updated to handle conversions

## Error Handling

All conversion utilities include proper error handling:
```typescript
export function encryptedStringToInt(value: string): number {
  const parsed = parseInt(value, 10)
  if (isNaN(parsed)) {
    throw new Error(`Invalid integer string: ${value}`)
  }
  return parsed
}
```

## Testing Considerations

When testing:
1. **Database Level**: Verify data is stored as encrypted strings
2. **API Level**: Verify responses contain correct data types
3. **Round Trip**: Ensure data integrity through create/read cycles
4. **Error Cases**: Test invalid data conversion scenarios

## Future Enhancements

1. **Additional Field Types**: Can extend to support Date, BigInt, etc.
2. **Selective Encryption**: Could make encryption configurable per field
3. **Key Rotation**: Leverage prisma-field-encryption's key rotation features
4. **Performance Optimization**: Consider caching decrypted data when appropriate

## Environment Setup

Ensure these environment variables are set:
```env
PRISMA_FIELD_ENCRYPTION_KEY=your_encryption_key_here
```

Generate encryption key using:
```bash
npx cloak generate
```

## ApplicationReview Module Integration

The ApplicationReview module implements comprehensive encryption for its own fields plus decryption for related Property and Seller data:

### Schema Changes
```prisma
model ApplicationReview {
  checklist      String  /// @encrypted // JSON object as encrypted string
  considerations String  /// @encrypted // JSON object as encrypted string
  createdAt      String  /// @encrypted // DateTime as encrypted ISO string
  updatedAt      String  /// @encrypted // DateTime as encrypted ISO string
  // ... other fields
}
```

### Repository Layer (`applicationReview.repository.ts`)

#### Encryption/Decryption Methods
```typescript
// Encrypt ApplicationReview data before storage
async create(data: ApplicationReview) {
  const now = new Date()
  return db.applicationReview.create({
    data: {
      checklist: jsonToEncryptedString(data.checklist) as any,
      considerations: jsonToEncryptedString(data.considerations) as any,
      createdAt: dateToEncryptedString(now) as any,
      updatedAt: dateToEncryptedString(now) as any,
      // ... other fields
    },
  })
}

// Decrypt ApplicationReview data
private decryptApplicationReviewData(review: any) {
  return {
    ...review,
    checklist: encryptedStringToJson(review.checklist),
    considerations: encryptedStringToJson(review.considerations),
    createdAt: encryptedStringToDate(review.createdAt),
    updatedAt: encryptedStringToDate(review.updatedAt),
  }
}

// Decrypt property data in ApplicationReview context
private decryptPropertyData(property: any) {
  return {
    ...property,
    bedroomCount: encryptedStringToInt(property.bedroomCount),
    bathroomCount: encryptedStringToInt(property.bathroomCount),
    totalAreaSqM: encryptedStringToFloat(property.totalAreaSqM),
    estimatedValue: encryptedStringToFloat(property.estimatedValue),
    confirmedValue: safeEncryptedStringToFloat(property.confirmedValue),
    features: encryptedStringToStringArray(property.features),
  }
}

// Decrypt seller data in ApplicationReview context
private decryptSellerData(seller: any) {
  return {
    ...seller,
    dateOfBirth: seller.dateOfBirth ? encryptedStringToDate(seller.dateOfBirth) : null,
  }
}
```

#### API Response Transformation
```typescript
private transformApplicationReviewForAPI(review: any) {
  return {
    ...review,
    property: this.decryptPropertyData(review.property),
    seller: this.decryptSellerData(review.seller),
  }
}
```

### Data Flow for ApplicationReview
```
Database Query (includes encrypted Property/Seller)
  ↓ 
Repository Layer (decrypts related data)
  ↓ 
Service Layer (passes through)
  ↓ 
API Response (decrypted Property/Seller data)
```

## PropertyValidation Module Integration

The PropertyValidation module implements similar decryption patterns for comprehensive property data retrieval with proper type conversion.

## Admin Properties Module Integration

The Admin Properties module also implements comprehensive decryption for property management:

### Repository Layer (`admin/properties/repository/properties.repository.ts`)

#### Decryption Methods
```typescript
// Decrypt property data in admin context
private decryptPropertyData(property: any) {
  return {
    ...property,
    bedroomCount: encryptedStringToInt(property.bedroomCount),
    bathroomCount: encryptedStringToInt(property.bathroomCount),
    totalAreaSqM: encryptedStringToFloat(property.totalAreaSqM),
    estimatedValue: encryptedStringToFloat(property.estimatedValue),
    confirmedValue: safeEncryptedStringToFloat(property.confirmedValue),
    features: encryptedStringToStringArray(property.features),
  }
}

// Decrypt seller data in admin context
private decryptSellerData(seller: any) {
  return {
    ...seller,
    dateOfBirth: seller.dateOfBirth ? encryptedStringToDate(seller.dateOfBirth) : null,
  }
}

// Decrypt application review data in admin context
private decryptApplicationReviewData(review: any) {
  return {
    ...review,
    checklist: encryptedStringToJson(review.checklist),
    considerations: encryptedStringToJson(review.considerations),
    createdAt: encryptedStringToDate(review.createdAt),
    updatedAt: encryptedStringToDate(review.updatedAt),
  }
}
```

#### Updated Methods
- **`getPropertyById()`** - Returns decrypted property data
- **`getPaginatedProperties()`** - Returns array of decrypted properties
- **`searchProperties()`** - Returns decrypted search results
- **`getCompletePropertyDetails()`** - Returns fully decrypted property with relations
- **`transformPropertyData()`** - Handles complex property transformations with decryption

## Searchable Encrypted Fields Solution

### The Problem
When fields like `email` are encrypted, you cannot query them directly:
```typescript
// ❌ This won't work - email is encrypted
const user = await db.user.findUnique({
  where: { email: "user@example.com" }
})
```

### The Solution: Hash Fields
Following the [prisma-field-encryption documentation](https://github.com/47ng/prisma-field-encryption#enable-search-with-hashes), we add hash fields for searchable encrypted fields:

#### Schema Changes
```prisma
model User {
  email     String? /// @encrypted
  emailHash String? @unique /// @encryption:hash(email)
}

model SellerProfile {
  email     String  /// @encrypted
  emailHash String? /// @encryption:hash(email)
}
```

#### Search Utilities (`utils/searchUtils.ts`)
```typescript
// ✅ Use hash-based lookup
export async function findUserByEmail(email: string) {
  const emailHash = generateSearchHash(email)
  return db.user.findUnique({ where: { emailHash } })
}

export async function emailExists(email: string): Promise<boolean> {
  const emailHash = generateSearchHash(email)
  const userExists = await db.user.findUnique({ where: { emailHash } })
  return !!userExists
}
```

#### Hash Generation
```typescript
export function generateSearchHash(value: string): string {
  const crypto = require('crypto')
  return crypto.createHash('sha256').update(value.toLowerCase().trim()).digest('hex')
}
```

### Migration Steps
1. **Update Schema**: Add `emailHash` fields with `/// @encryption:hash(email)` annotation
2. **Generate Client**: Run `pnpm db:generate` to update Prisma client
3. **Create Migration**: Run `pnpm db:migrate dev` to add hash columns
4. **Data Migration**: Populate hash fields for existing records
5. **Update Queries**: Replace direct email queries with hash-based lookups

### Usage in Authentication
```typescript
// Before (won't work with encryption)
const user = await db.user.findUnique({
  where: { email: session.user.email }
})

// After (works with encrypted emails)
import { findUserByEmail } from './utils/searchUtils'
const user = await findUserByEmail(session.user.email)
```

## Offer Module Integration

The Offer module implements comprehensive encryption for financial and temporal data:

### Schema Changes
```prisma
model Offer {
  initialPaymentAmount String  /// @encrypted // was: Float
  monthlyPaymentAmount String  /// @encrypted // was: Float
  indexationRate       String  /// @encrypted // was: Float
  offerData            String? /// @encrypted // was: Json? - Store the full offer JSON data as encrypted string
  createdAt            String  /// @encrypted // was: DateTime - DateTime as encrypted ISO string
  updatedAt            String  /// @encrypted // was: DateTime - DateTime as encrypted ISO string
  // ... other fields
}
```

### Repository Layer (`provisionalOffer.repository.ts`)

#### Decrypted Offer Interface
```typescript
interface DecryptedOffer {
  id: string
  initialPaymentAmount: number      // Decrypted from encrypted string
  monthlyPaymentAmount: number      // Decrypted from encrypted string
  indexationRate: number           // Decrypted from encrypted string
  offerData: any                   // Decrypted from encrypted JSON string
  createdAt: Date                  // Decrypted from encrypted ISO string
  updatedAt: Date                  // Decrypted from encrypted ISO string
  // ... other fields
}
```

#### Encryption/Decryption Methods
```typescript
// Transform encrypted offer data back to API format
private transformOfferForAPI(offer: any): DecryptedOffer {
  return {
    ...offer,
    initialPaymentAmount: encryptedStringToFloat(offer.initialPaymentAmount),
    monthlyPaymentAmount: encryptedStringToFloat(offer.monthlyPaymentAmount),
    indexationRate: encryptedStringToFloat(offer.indexationRate),
    offerData: offer.offerData ? encryptedStringToJson(offer.offerData) : null,
    createdAt: encryptedStringToDate(offer.createdAt),
    updatedAt: encryptedStringToDate(offer.updatedAt),
  }
}

// Create offer with encrypted data
async create(data: ProvisionalOffer) {
  const now = new Date()
  const createdOffer = await db.offer.create({
    data: {
      initialPaymentAmount: floatToEncryptedString(data.valuation.initialLumpSum) as any,
      monthlyPaymentAmount: floatToEncryptedString(data.valuation.monthlyPayment) as any,
      indexationRate: floatToEncryptedString(0) as any,
      offerData: jsonToEncryptedString(offerDataJson) as any,
      createdAt: dateToEncryptedString(now) as any,
      updatedAt: dateToEncryptedString(now) as any,
      // ... other fields
    },
  })
  return this.transformOfferForAPI(createdOffer)
}
```

#### Updated Methods
- **`create()`** - Encrypts financial data and timestamps before storage
- **`update()`** - Updates encrypted fields and timestamps
- **`get()`** - Returns decrypted offer data
- **`getByProperty()`** - Returns decrypted offer for property
- **`updateStatus()`** - Updates status with encrypted timestamp
- **`decline()`** - Updates status to rejected with encrypted timestamp
- **`delete()`** - Returns decrypted data of deleted offer
- **`getById()`** - Returns property with decrypted offer data

### Data Flow for Offers
```
API Input (ProvisionalOffer)
  ↓ 
Service Layer (validates)
  ↓ 
Repository Layer (encrypts financial data, timestamps, JSON)
  ↓ 
Database (stores encrypted strings)

Database Query (encrypted strings)
  ↓ 
Repository Layer (decrypts to proper types)
  ↓ 
Service Layer (passes through)
  ↓ 
API Response (DecryptedOffer with proper types)
```

### Security Benefits for Offers
- **Financial Data Protection**: Payment amounts and rates encrypted at rest
- **Temporal Data Security**: Creation and update timestamps encrypted
- **JSON Data Encryption**: Complex offer data structures encrypted
- **API Transparency**: Consumers receive expected numeric and date types

## PropertyDashboardStatus Module Integration

The PropertyDashboardStatus module implements comprehensive encryption for dashboard status tracking data:

### Schema Changes
```prisma
model PropertyDashboardStatus {
  referenceNumber String  /// @encrypted // was: String
  currentStage   String   /// @encrypted // was: String
  stageProgress  String   /// @encrypted // was: Float
  statusData     String   /// @encrypted // was: Json - Store the full dashboard status as encrypted JSON string
  createdAt      String   /// @encrypted // was: DateTime - DateTime as encrypted ISO string
  updatedAt      String   /// @encrypted // was: DateTime - DateTime as encrypted ISO string
  // ... other fields
}
```

### Service Layer (`provisionalOffer.service.ts`)

#### Decrypted Dashboard Status Interface
```typescript
interface DecryptedDashboardStatus {
  id: string
  referenceNumber: string          // Decrypted from encrypted string
  currentStage: string            // Decrypted from encrypted string
  stageProgress: number           // Decrypted from encrypted string
  statusData: any                 // Decrypted from encrypted JSON string
  createdAt: Date                 // Decrypted from encrypted ISO string
  updatedAt: Date                 // Decrypted from encrypted ISO string
  // ... other fields
}
```

#### Encryption/Decryption Methods
```typescript
// Transform encrypted dashboard status data back to API format
private transformDashboardStatusForAPI(status: any): DecryptedDashboardStatus {
  return {
    ...status,
    referenceNumber: status.referenceNumber, // Already decrypted by prisma-field-encryption
    currentStage: status.currentStage, // Already decrypted by prisma-field-encryption
    stageProgress: encryptedStringToFloat(status.stageProgress),
    statusData: encryptedStringToJson(status.statusData),
    createdAt: encryptedStringToDate(status.createdAt),
    updatedAt: encryptedStringToDate(status.updatedAt),
  }
}

// Get dashboard status with decrypted offer document
async getDashboardStatusWithOfferDocument(propertyId: string) {
  const dashboardStatus = await db.propertyDashboardStatus.findFirst({
    where: { propertyId },
    orderBy: { updatedAt: "desc" },
  })
  
  const decryptedStatus = this.transformDashboardStatusForAPI(dashboardStatus)
  const offerDocument = decryptedStatus.statusData.offerDocument || null
  
  return {
    dashboardStatus: decryptedStatus,
    offerDocument,
    referenceNumber: decryptedStatus.referenceNumber,
    createdAt: decryptedStatus.createdAt,
  }
}
```

### Webhook Integration (`status-update/route.ts`)

#### Dashboard Status Creation/Update with Encryption
```typescript
// Create new dashboard status with encrypted data
await db.propertyDashboardStatus.create({
  data: {
    referenceNumber: payload.referenceNumber as any, // Encrypted by prisma-field-encryption
    currentStage: payload.currentStage as any, // Encrypted by prisma-field-encryption
    stageProgress: floatToEncryptedString(payload.stageProgress) as any,
    statusData: jsonToEncryptedString(payload.statusData || {}) as any,
    createdAt: dateToEncryptedString(now) as any,
    updatedAt: dateToEncryptedString(now) as any,
    // ... other fields
  },
})

// Update existing dashboard status with encrypted data
await db.propertyDashboardStatus.update({
  data: {
    stageProgress: floatToEncryptedString(payload.stageProgress) as any,
    statusData: jsonToEncryptedString(payload.statusData || {}) as any,
    updatedAt: dateToEncryptedString(new Date()) as any,
    // ... other fields
  },
})
```

### Data Flow for Dashboard Status
```
Webhook Payload (Dashboard Status Update)
  ↓ 
Webhook Handler (encrypts progress, JSON data, timestamps)
  ↓ 
Database (stores encrypted strings)

Database Query (encrypted strings)
  ↓ 
Service Layer (decrypts to proper types)
  ↓ 
API Response (DecryptedDashboardStatus with proper types)
```

### Security Benefits for Dashboard Status
- **Progress Data Protection**: Stage progress values encrypted at rest
- **Status Data Security**: Complex JSON status data encrypted
- **Reference Security**: Reference numbers encrypted for privacy
- **Temporal Data Security**: Creation and update timestamps encrypted
- **API Transparency**: Consumers receive expected numeric, object, and date types

## CompletionStatus (FinalStatus) Module Integration

The CompletionStatus module implements comprehensive encryption for completion and solicitor data:

### Schema Changes
```prisma
model CompletionStatus {
  choice     String   /// @encrypted // was: String
  details    String   /// @encrypted // was: Json - Stores the solicitor details as encrypted JSON string
  createdAt  String   /// @encrypted // was: DateTime - DateTime as encrypted ISO string
  updatedAt  String   /// @encrypted // was: DateTime - DateTime as encrypted ISO string
  // ... other fields
}
```

### Repository Layer (`finalStatus.repository.ts`)

#### Decrypted Completion Status Interface
```typescript
interface DecryptedCompletionStatus {
  id: string
  choice: string                   // Decrypted from encrypted string
  details: any                     // Decrypted from encrypted JSON string (solicitor details)
  createdAt: Date                  // Decrypted from encrypted ISO string
  updatedAt: Date                  // Decrypted from encrypted ISO string
  solicitor?: any                  // For backward compatibility
  // ... other fields
}
```

#### Encryption/Decryption Methods
```typescript
// Transform encrypted completion status data back to API format
private transformCompletionStatusForAPI(status: any): DecryptedCompletionStatus {
  const decryptedDetails = encryptedStringToJson(status.details)
  
  return {
    ...status,
    choice: status.choice, // Already decrypted by prisma-field-encryption
    details: decryptedDetails,
    createdAt: encryptedStringToDate(status.createdAt),
    updatedAt: encryptedStringToDate(status.updatedAt),
    solicitor: decryptedDetails, // For backward compatibility
  }
}

// Create completion status with encrypted data
async create(data: FinalStatus) {
  const now = new Date()
  const createdStatus = await db.completionStatus.create({
    data: {
      choice: data.choice as any, // Encrypted by prisma-field-encryption
      details: jsonToEncryptedString(data.solicitor) as any,
      createdAt: dateToEncryptedString(now) as any,
      updatedAt: dateToEncryptedString(now) as any,
      // ... other fields
    },
  })
  return this.transformCompletionStatusForAPI(createdStatus)
}
```

#### Updated Methods
- **`create()`** - Encrypts choice, solicitor details, and timestamps before storage
- **`update()`** - Updates encrypted fields and timestamps
- **`get()`** - Returns decrypted completion status data
- **`getByProperty()`** - Returns decrypted completion status for property
- **`delete()`** - Returns decrypted data of deleted completion status

### Service Layer (`finalStatus.service.ts`)

#### Dashboard Status Integration
```typescript
// Get dashboard status with decrypted solicitor details
async getDashboardStatusDetails(propertyId: string) {
  const dashboardStatus = await db.propertyDashboardStatus.findFirst({
    where: { propertyId },
    orderBy: { updatedAt: "desc" },
  })
  
  const decryptedStatus = this.transformDashboardStatusForAPI(dashboardStatus)
  const finalStatus = await this.getByProperty(propertyId)
  const statusData = decryptedStatus.statusData
  
  return {
    dashboardStatus: decryptedStatus,
    solicitorDetails: finalStatus?.solicitor || null,
    keyContacts: statusData.keyContacts || null,
    processStatus: statusData.ProcessStatus || null,
    documentChecklist: statusData.documentChecklist || null,
    referenceNumber: decryptedStatus.referenceNumber,
    createdAt: decryptedStatus.createdAt,
  }
}
```

### Data Flow for Completion Status
```
API Input (FinalStatus)
  ↓ 
Service Layer (validates)
  ↓ 
Repository Layer (encrypts choice, solicitor details, timestamps)
  ↓ 
Database (stores encrypted strings)

Database Query (encrypted strings)
  ↓ 
Repository Layer (decrypts to proper types)
  ↓ 
Service Layer (integrates with dashboard status)
  ↓ 
API Response (DecryptedCompletionStatus with proper types)
```

### Security Benefits for Completion Status
- **Choice Data Protection**: User choices encrypted at rest
- **Solicitor Data Security**: Complete solicitor details encrypted as JSON
- **Temporal Data Security**: Creation and update timestamps encrypted
- **Backward Compatibility**: Maintains `solicitor` field for existing API consumers
- **API Transparency**: Consumers receive expected object and date types

## PropertyDocument Module Integration

The PropertyDocument module implements comprehensive encryption for document metadata and file information:

### Schema Changes
```prisma
model PropertyDocument {
  documentType String  /// @encrypted
  filename     String  /// @encrypted
  fileUrl      String  /// @encrypted
  createdAt    String  /// @encrypted // was: DateTime - DateTime as encrypted ISO string
  updatedAt    String  /// @encrypted // was: DateTime - DateTime as encrypted ISO string
  // ... other fields
}
```

### Repository Layer (`details.repository.ts`)

#### Decrypted Property Document Interface
```typescript
interface DecryptedPropertyDocument {
  id: string
  propertyId: string
  documentType: string            // Decrypted from encrypted string
  filename: string               // Decrypted from encrypted string
  fileUrl: string                // Decrypted from encrypted string
  verified: boolean
  uploadedById: string
  createdAt: Date                // Decrypted from encrypted ISO string
  updatedAt: Date                // Decrypted from encrypted ISO string
}
```

#### Encryption/Decryption Methods
```typescript
// Transform encrypted property document data back to API format
private transformPropertyDocumentForAPI(document: any): DecryptedPropertyDocument {
  return {
    ...document,
    documentType: document.documentType, // Already decrypted by prisma-field-encryption
    filename: document.filename, // Already decrypted by prisma-field-encryption
    fileUrl: document.fileUrl, // Already decrypted by prisma-field-encryption
    createdAt: encryptedStringToDate(document.createdAt),
    updatedAt: encryptedStringToDate(document.updatedAt),
  }
}

// Create document with encrypted data
async createDocument(data: PropertyDocument) {
  const now = new Date()
  const createdDocument = await db.propertyDocument.create({
    data: {
      documentType: data.documentType as any, // Encrypted by prisma-field-encryption
      filename: data.filename as any, // Encrypted by prisma-field-encryption
      fileUrl: data.fileUrl as any, // Encrypted by prisma-field-encryption
      createdAt: dateToEncryptedString(now) as any,
      updatedAt: dateToEncryptedString(now) as any,
      // ... other fields
    },
  })
  return this.transformPropertyDocumentForAPI(createdDocument)
}
```

#### Updated Methods
- **`addPropertyPhoto()`** - Encrypts photo metadata and timestamps before storage
- **`addPropertyDocument()`** - Encrypts document metadata and timestamps before storage
- **`createDocument()`** - Encrypts document data and timestamps before storage
- **`updateDocumentUrl()`** - Updates encrypted fileUrl and timestamp
- **`getPropertyPhoto()`** - Returns decrypted photo document data
- **`getPropertyDocument()`** - Returns decrypted document data
- **`getDocument()`** - Returns decrypted document data
- **`deletePropertyPhoto()`** - Returns decrypted data of deleted photo
- **`deletePropertyDocument()`** - Returns decrypted data of deleted document
- **`deleteDocument()`** - Returns decrypted data of deleted document

### Data Flow for Property Documents
```
API Input (Document Upload)
  ↓ 
Service Layer (validates, uploads to storage)
  ↓ 
Repository Layer (encrypts metadata, filenames, URLs, timestamps)
  ↓ 
Database (stores encrypted strings)

Database Query (encrypted strings)
  ↓ 
Repository Layer (decrypts to proper types)
  ↓ 
Service Layer (handles file operations)
  ↓ 
API Response (DecryptedPropertyDocument with proper types)
```

### Security Benefits for Property Documents
- **Filename Protection**: Document filenames encrypted at rest
- **URL Protection**: File URLs encrypted to prevent unauthorized access discovery
- **Document Type Security**: Document types encrypted for privacy
- **Temporal Data Security**: Creation and update timestamps encrypted
- **File Storage Integration**: Transparent encryption while maintaining file operations
- **API Transparency**: Consumers receive expected string and date types

This implementation provides comprehensive field-level encryption while maintaining API compatibility, type safety, and searchability across all property-related modules including the new Offer module, PropertyDashboardStatus tracking, CompletionStatus management, and PropertyDocument handling. 