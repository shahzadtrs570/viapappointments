# Field Encryption Implementation Plan

## Priority 1: Critical Personal Data (Implement First)

### User Model
```prisma
model User {
  name              String?              /// @encrypted
  nameHash          String?              /// @encryption:hash(name)
  email             String?              @unique /// @encrypted
  emailHash         String?              @unique /// @encryption:hash(email)
  // ... other fields
}
```

### ContactAddress Model  
```prisma
model ContactAddress {
  streetLine1 String                     /// @encrypted
  streetLine2 String?                    /// @encrypted
  city        String                     /// @encrypted
  postalCode  String                     /// @encrypted
  // ... other fields
}
```

### SellerProfile Model
```prisma
model SellerProfile {
  firstName          String              /// @encrypted
  firstNameHash      String?             /// @encryption:hash(firstName)
  lastName           String              /// @encrypted
  lastNameHash       String?             /// @encryption:hash(lastName)
  dateOfBirth        DateTime            /// @encrypted
  // ... other fields
}
```

## Priority 2: Financial & Investment Data

### FundBuyerProfile Model
```prisma
model FundBuyerProfile {
  companyName        String              /// @encrypted
  registrationNumber String              /// @encrypted
  registrationNumberHash String?         /// @encryption:hash(registrationNumber)
  // ... other fields
}
```

### BuyerQualificationKYCAML Model
```prisma
model BuyerQualificationKYCAML {
  fullLegalName           String          /// @encrypted
  fullLegalNameHash       String?         /// @encryption:hash(fullLegalName)
  taxIdentificationNumber String          /// @encrypted
  taxIdHash               String?         /// @encryption:hash(taxIdentificationNumber)
  nationality             String          /// @encrypted
  residenceCountry        String          /// @encrypted
  sourceOfFunds           String          /// @encrypted
  politicalExposureDetails String?        /// @encrypted
  // ... other fields
}
```

### Offer Model (Financial Terms)
```prisma
model Offer {
  initialPaymentAmount   Float            /// @encrypted
  monthlyPaymentAmount   Float            /// @encrypted
  indexationRate         Float            /// @encrypted
  // ... other fields
}
```

## Priority 3: Property Information

### PropertyAddress Model
```prisma
model PropertyAddress {
  streetLine1 String                     /// @encrypted
  streetLine2 String?                    /// @encrypted
  city        String                     /// @encrypted
  postalCode  String                     /// @encrypted
  // ... other fields
}
```

### Property Model
```prisma
model Property {
  estimatedValue Float                   /// @encrypted
  confirmedValue Float?                  /// @encrypted
  // ... other fields
}
```

## Priority 4: Professional Profiles

### ConveyancerProfile Model
```prisma
model ConveyancerProfile {
  firmName      String                   /// @encrypted
  firmNameHash  String?                  /// @encryption:hash(firmName)
  licenseNumber String                   /// @encrypted
  licenseNumberHash String?              /// @encryption:hash(licenseNumber)
  // ... other fields
}
```

### ValuerProfile Model
```prisma
model ValuerProfile {
  firmName      String                   /// @encrypted
  firmNameHash  String?                  /// @encryption:hash(firmName)
  licenseNumber String                   /// @encrypted
  licenseNumberHash String?              /// @encryption:hash(licenseNumber)
  // ... other fields
}
```

## Priority 5: Documents & Communications

### Document Model
```prisma
model Document {
  filename     String                    /// @encrypted
  fileUrl      String                    /// @encrypted
  // ... other fields (documentType, fileSize stay unencrypted for filtering)
}
```

### PropertyDocument Model
```prisma
model PropertyDocument {
  filename     String                    /// @encrypted
  fileUrl      String                    /// @encrypted
  // ... other fields
}
```

## Priority 6: Lead & Newsletter Data

### Lead Model
```prisma
model Lead {
  email        String                    /// @encrypted
  emailHash    String?                   /// @encryption:hash(email)
  name         String?                   /// @encrypted
  nameHash     String?                   /// @encryption:hash(name)
  phone        String?                   /// @encrypted
  phoneHash    String?                   /// @encryption:hash(phone)
  company      String?                   /// @encrypted
  message      String?                   /// @encrypted
  // ... other fields
}
```

### NewsletterSubscriber Model
```prisma
model NewsletterSubscriber {
  email        String                    @unique /// @encrypted
  emailHash    String?                   @unique /// @encryption:hash(email)
  name         String?                   /// @encrypted
  nameHash     String?                   /// @encryption:hash(name)
  // ... other fields
}
```

## Implementation Notes

### Hash Fields for Searchability
- Add hash fields for any encrypted field you need to search on
- Hash fields enable exact matching but not partial searches
- Use unique constraints on hash fields, not encrypted fields

### Database Schema Changes Required
- Increase VARCHAR lengths for encrypted fields (see ENCRYPTION_SETUP.md)
- Add new hash fields as nullable initially
- Run migrations carefully in production

### Fields to NOT Encrypt
- IDs and foreign keys
- Enums and status fields
- Timestamps (createdAt, updatedAt)
- Boolean flags
- Counts and numeric statistics
- Non-sensitive categorization fields

### Migration Strategy
1. Add hash fields first (nullable)
2. Add encryption annotations
3. Run Prisma generate
4. Deploy changes
5. Data will be encrypted on new writes, existing data remains readable
6. Run data migration to encrypt existing data
7. Make hash fields non-nullable if needed for uniqueness 