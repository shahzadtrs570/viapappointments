# Step-by-Step Implementation Guide

## Prerequisites Checklist

- [ ] Backup your database
- [ ] Have a staging environment for testing
- [ ] Update your `.env` with encryption key (see ENCRYPTION_SETUP.md)
- [ ] Install the package: `pnpm add prisma-field-encryption`

## Step 1: Install Package (If Not Done)

```bash
cd packages/db
pnpm add prisma-field-encryption
```

## Step 2: Generate Encryption Key

### Option A: Web Interface (Recommended)
1. Visit: https://cloak.47ng.com
2. Click "Generate Key"
3. Copy the generated key

### Option B: Command Line
```bash
npx cloak generate
```

### Option C: Manual
```bash
node -e "console.log('k1.aesgcm256.' + require('crypto').randomBytes(32).toString('base64'))"
```

## Step 3: Update Environment Variables

Add to your `.env` file:
```bash
# CRITICAL: Generate a new key for production!
PRISMA_FIELD_ENCRYPTION_KEY="k1.aesgcm256.DbQoar8ZLuUsOHZNyrnjlskInHDYlzF3q6y1KGM7DUM="
PRISMA_FIELD_ENCRYPTION_HASH_SALT="your-random-salt-here"
```

## Step 4: Verify Extension Setup

Your `packages/db/db.ts` should already be updated. Verify it contains:

```typescript
import { PrismaClient } from "@prisma/client"
import { fieldEncryptionExtension } from "prisma-field-encryption"

// ... existing code ...
prisma = new PrismaClient().$extends(fieldEncryptionExtension())
```

## Step 5: Phase 1 Schema Updates (Critical Fields Only)

Update `packages/db/prisma/schema.prisma`:

### 5.1: Update User Model
```prisma
model User {
  id                String               @id @default(cuid())
  name              String?              /// @encrypted
  nameHash          String?              /// @encryption:hash(name)
  email             String?              @unique /// @encrypted
  emailHash         String?              @unique /// @encryption:hash(email)
  emailVerified     DateTime?
  image             String?
  hasOnboarded      Boolean              @default(false)
  createdAt         DateTime             @default(now())
  updatedAt         DateTime             @updatedAt
  role              Role                 @default(USER)
  preferredLanguage String?              @default("en")
  SrenovaRole    Srenova_UserRole[]     @default([SELLER, FUND_BUYER])
  receiveUpdates    Boolean              @default(false)
  isBanned Boolean @default(false)

  // ... rest of existing fields and relations remain unchanged
}
```

### 5.2: Update ContactAddress Model
```prisma
model ContactAddress {
  id          String   @id @default(cuid())
  userId      String   @unique
  streetLine1 String   /// @encrypted
  streetLine2 String?  /// @encrypted
  city        String   /// @encrypted
  state       String?  /// @encrypted
  postalCode  String   /// @encrypted
  postalCodeHash String? /// @encryption:hash(postalCode)
  country     String   // Keep unencrypted for filtering
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### 5.3: Update Lead Model
```prisma
model Lead {
  id         String     @id @default(cuid())
  email      String     /// @encrypted
  emailHash  String?    /// @encryption:hash(email)
  name       String?    /// @encrypted
  nameHash   String?    /// @encryption:hash(name)
  phone      String?    /// @encrypted
  phoneHash  String?    /// @encryption:hash(phone)
  company    String?    /// @encrypted
  message    String?    /// @encrypted
  leadType   String     // Keep unencrypted for filtering
  status     LeadStatus @default(NEW)
  source     String?
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  metadata   Json?
  assignedTo String?

  // ... existing relations
  surveyResponses SurveyResponse[]

  @@index([leadType])
  @@index([status])
  @@index([createdAt])
  @@index([assignedTo])
  @@index([emailHash])  // For lead deduplication
}
```

## Step 6: Generate and Run Migration

```bash
# Generate Prisma client with new annotations
pnpm db:generate

# Create migration
pnpm db:migrate

# When prompted, name the migration: "add_field_encryption_phase1"
```

## Step 7: Test in Staging

### 7.1: Create Test Data
```typescript
// Test that encryption works transparently
const testUser = await db.user.create({
  data: {
    name: "Test User",
    email: "test@example.com",
    role: "USER"
  }
})

console.log("User created:", testUser.name, testUser.email)
// Should display: "Test User", "test@example.com"
```

### 7.2: Test Search Functionality
```typescript
// Test that search by encrypted fields still works
const foundUser = await db.user.findUnique({
  where: { email: "test@example.com" }
})

console.log("User found:", foundUser?.name)
// Should display: "Test User"
```

### 7.3: Verify Database Encryption
```sql
-- Connect to your database and check that data is actually encrypted
SELECT name, email, "nameHash", "emailHash" FROM "User" WHERE id = 'your-test-user-id';
-- name and email should show encrypted values like: enc:aesgcm256:ABC123...
-- Hash fields should show hash values
```

## Step 8: Deploy to Production

### 8.1: Pre-deployment Checklist
- [ ] Tested thoroughly in staging
- [ ] Database backup completed
- [ ] Production encryption key generated (different from staging!)
- [ ] Environment variables updated in production

### 8.2: Deployment Commands
```bash
# Deploy migration
pnpm db:deploy

# Verify deployment
pnpm db:generate
```

## Step 9: Monitor and Validate

### 9.1: Check Application Functionality
- [ ] User registration/login works
- [ ] Email searches work
- [ ] Lead capture forms work
- [ ] All existing features continue working

### 9.2: Verify Data Security
- [ ] New data is encrypted in database
- [ ] Existing unencrypted data still readable
- [ ] Hash fields are populated for new records

## Step 10: Plan Phase 2 (Optional)

After Phase 1 is stable, plan to encrypt:
- SellerProfile (firstName, lastName, dateOfBirth)
- Property addresses
- Financial data (offer amounts, property values)
- Professional profile details

## Troubleshooting

### Common Issues:

1. **"Cannot read encrypted data"**
   - Check encryption key is set correctly
   - Verify key format: `k1.aesgcm256.XXXXX`

2. **"Hash field not found"**
   - Ensure hash fields are added to schema
   - Run `prisma generate` after schema changes

3. **"Field too long for database"**
   - Increase VARCHAR lengths in migration
   - Use TEXT type for very long encrypted fields

4. **"Unique constraint violation"**
   - Move unique constraints from encrypted fields to hash fields
   - Update application code to search by original field (extension handles hash)

### Debug Mode:
```bash
# Enable debug logging to see encryption operations
DEBUG="prisma-field-encryption:*" npm run dev
```

## Rollback Plan

If issues occur:

1. **Immediate**: Remove encryption annotations from schema
2. **Generate**: Run `prisma generate` 
3. **Deploy**: Push changes to remove encryption
4. **Data**: Existing encrypted data will be attempted to decrypt, unencrypted data passes through

## Security Reminders

- [ ] Never commit encryption keys to version control
- [ ] Use different keys per environment
- [ ] Store production keys in secure key management
- [ ] Plan regular key rotation
- [ ] Monitor access to encrypted data
- [ ] Document key management procedures 