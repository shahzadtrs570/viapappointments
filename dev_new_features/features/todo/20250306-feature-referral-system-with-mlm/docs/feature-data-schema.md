# Feature Data Schema: Referral System with MLM

## Overview

This document outlines the database schema and data requirements for the Referral System with MLM feature. It provides a comprehensive description of the data entities, relationships, attributes, and constraints necessary to support the functionality described in the requirements document.

## Database Technology

We will be using **PostgreSQL** as our primary database, accessed through **Prisma ORM**. This combination provides:

- Type safety through Prisma's generated types
- Robust relational data modeling
- ACID compliance for transaction integrity
- Excellent query performance
- Built-in migration tools
- Powerful indexing capabilities

## Core Data Models

### Prisma Schema

```prisma
// Core Models

model User {
  id            String      @id @default(cuid())
  username      String
  email         String      @unique
  passwordHash  String
  referralCode  String      @unique
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  // Referral relationships
  referredBy    String?     // ID of user who referred this user
  referrer      User?       @relation("ReferralRelation", fields: [referredBy], references: [id])
  referrals     User[]      @relation("ReferralRelation")
  
  // Related entities
  referralsGiven    Referral[]  @relation("ReferrerRelation")
  referralsReceived Referral[]  @relation("ReferredUserRelation")
  commissions       Commission[]
  payouts          Payout[]
  
  @@index([referralCode])
  @@index([email])
}

model Referral {
  id              String    @id @default(cuid())
  referrerId      String
  referredUserId  String
  status          String    @default("pending") // pending, completed, cancelled
  tier            Int       @default(1)         // MLM tier level
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  // Relations
  referrer        User      @relation("ReferrerRelation", fields: [referrerId], references: [id])
  referredUser    User      @relation("ReferredUserRelation", fields: [referredUserId], references: [id])
  commissions     Commission[]
  
  @@index([referrerId])
  @@index([referredUserId])
  @@index([status])
}

model Commission {
  id          String    @id @default(cuid())
  userId      String
  referralId  String
  amount      Decimal
  status      String    @default("pending") // pending, paid, cancelled
  tier        Int       @default(1)         // MLM tier level
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relations
  user        User      @relation(fields: [userId], references: [id])
  referral    Referral  @relation(fields: [referralId], references: [id])
  
  @@index([userId])
  @@index([status])
}

model Payout {
  id                  String    @id @default(cuid())
  userId              String
  amount              Decimal
  paymentMethod       String    // stripe, lemon_squeezy
  status              String    @default("pending") // pending, processing, completed, failed
  transactionReference String?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  // Relations
  user                User      @relation(fields: [userId], references: [id])
  
  @@index([userId])
  @@index([status])
}

model MLMTier {
  id              String    @id @default(cuid())
  level           Int       @unique
  commissionRate  Decimal
  description     String?
  isActive        Boolean   @default(true)
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([level])
}

model ReferralProgramSettings {
  id                      String    @id @default(cuid())
  maxTierLevel           Int       @default(3)
  minPayoutAmount        Decimal
  payoutFrequency        String    // daily, weekly, monthly
  isMLMEnabled           Boolean   @default(true)
  defaultCommissionRate  Decimal
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}
```

## Entity Relationships

1. **User to Referrals**
   - One-to-many relationship between User and Referrals (as referrer)
   - One-to-many relationship between User and Referrals (as referred user)
   - Self-referential relationship for MLM structure

2. **Referral to Commissions**
   - One-to-many relationship between Referral and Commission
   - Each referral can generate multiple commissions across different tiers

3. **User to Payouts**
   - One-to-many relationship between User and Payouts
   - Tracks all payment transactions for a user

4. **MLM Tiers**
   - Standalone configuration table for tier settings
   - Referenced by Commission model for rate calculations

## Data Integrity Rules

1. **Referral Integrity**
   - A user cannot refer themselves
   - A user can only be referred once during registration
   - Referral codes must be unique

2. **Commission Rules**
   - Commission amounts must be non-negative
   - Commission status transitions must follow defined flow
   - Commission tier must be valid according to MLMTier settings

3. **Payout Rules**
   - Payout amount must meet minimum threshold
   - Payout status transitions must follow defined flow
   - Transaction references must be unique when present

## Indexing Strategy

Key indexes are defined in the schema for optimal query performance:

1. **User Indexes**
   - `referralCode` for quick referral code lookups
   - `email` for authentication queries

2. **Referral Indexes**
   - `referrerId` and `referredUserId` for relationship queries
   - `status` for filtering active referrals

3. **Commission Indexes**
   - `userId` for user-specific commission queries
   - `status` for payment processing queries

4. **Payout Indexes**
   - `userId` for user-specific payout queries
   - `status` for payment processing

## Data Migration Strategy

1. **Initial Setup**
   - Create base schema using Prisma migrations
   - Seed initial MLM tier configurations
   - Set up default program settings

2. **Version Updates**
   - Use Prisma migrations for schema changes
   - Include data transformations in migrations
   - Maintain backwards compatibility

## Data Security

1. **Access Control**
   - Row-level security through application logic
   - Encrypted sensitive data (payment information)
   - Audit logging for sensitive operations

2. **Data Protection**
   - Regular backups
   - Point-in-time recovery capability
   - Data encryption at rest

## Performance Considerations

1. **Query Optimization**
   - Efficient indexing strategy
   - Materialized views for complex reports
   - Query caching through Prisma

2. **Scaling Strategy**
   - Horizontal scaling capability
   - Connection pooling
   - Read replicas for reporting

## Monitoring and Maintenance

1. **Health Checks**
   - Database performance metrics
   - Index usage statistics
   - Query performance monitoring

2. **Maintenance Tasks**
   - Regular index optimization
   - Data archiving strategy
   - Backup verification

## Conclusion

This data schema provides a comprehensive foundation for implementing the Referral System with MLM feature. The schema is designed to support all the functional requirements while ensuring data integrity, security, and performance. As the system evolves, the schema may need to be extended to accommodate new features and requirements. 