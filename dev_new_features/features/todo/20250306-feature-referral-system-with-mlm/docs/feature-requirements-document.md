# Feature Requirements Document: Referral System with MLM

## 1. Introduction

### 1.1 Purpose
This document outlines the comprehensive requirements for implementing a Referral System with Multi-Level Marketing (MLM) capabilities. The system is designed to enable businesses to grow their user base through incentivized referrals, supporting both basic single-tier referrals and advanced multi-level marketing structures.

### 1.2 Scope
The Referral System with MLM will be integrated into the existing SaaS platform, providing users with the ability to generate referral links, track referrals, and earn commissions based on the activity of their referrals across multiple tiers. The system will include user-facing interfaces for referral management and administrative tools for program configuration.

### 1.3 Definitions and Acronyms
- **MLM**: Multi-Level Marketing - A marketing strategy where participants earn commissions not only from their direct referrals but also from the referrals made by their referrals (multiple levels)
- **Referrer**: A user who shares their referral link with potential new users
- **Referee**: A new user who signs up using a referral link
- **Downline**: The network of users referred by a particular user, including all levels
- **Commission**: Financial reward earned for successful referrals
- **Tier/Level**: Position in the MLM hierarchy (Level 1 = direct referrals, Level 2 = referrals of referrals, etc.)

## 2. System Overview

### 2.1 System Description
The Referral System with MLM is a comprehensive solution that enables users to participate in a structured referral program. The system tracks referral relationships, calculates commissions based on configurable rules, and provides analytics on referral performance. It supports both simple one-level referral structures and complex multi-level marketing arrangements.

### 2.2 System Context
The system will integrate with the following components of the existing SaaS platform:
- User authentication and management system
- Payment processing system
- Notification system
- Analytics platform
- Administrative dashboard

### 2.3 User Classes and Characteristics
- **Regular Users**: End users of the SaaS platform who can participate in the referral program
- **Administrators**: Staff members who configure and manage the referral program
- **Finance Team**: Personnel responsible for approving and processing commission payouts

## 3. Functional Requirements

### 3.1 User Registration and Authentication

#### 3.1.1 User Registration
- The system shall automatically generate a unique referral code for each new user upon registration
- The system shall associate new users with their referrer when they sign up using a referral link
- The system shall support registration through multiple channels (web, mobile app)

#### 3.1.2 User Authentication
- The system shall integrate with the existing authentication system
- The system shall enforce appropriate access controls for referral-related features
- The system shall maintain secure session management for all referral activities

### 3.2 Referral Management

#### 3.2.1 Referral Link Generation
- The system shall generate a unique, persistent referral link for each user
- The system shall allow users to generate multiple referral links for tracking different campaigns
- The system shall provide shortened URLs for easier sharing
- The system shall generate QR codes representing referral links

#### 3.2.2 Referral Tracking
- The system shall track the source of each referral
- The system shall record the timestamp of referral link usage
- The system shall track the status of each referral (pending, converted, rejected)
- The system shall associate referrals with the appropriate tier in the MLM structure

#### 3.2.3 Referral Sharing
- The system shall provide direct sharing options for popular platforms (email, social media)
- The system shall allow customization of referral messages
- The system shall track the performance of different sharing methods

### 3.3 MLM Structure Management

#### 3.3.1 Tier Configuration
- The system shall support configuration of the number of tiers in the MLM structure
- The system shall allow administrators to define commission rates for each tier
- The system shall enforce maximum tier limits as configured
- The system shall support different MLM structures for different user segments

#### 3.3.2 Downline Management
- The system shall maintain the hierarchical relationship between users in the MLM structure
- The system shall provide users with visibility of their direct downline
- The system shall provide administrators with tools to view and manage the entire MLM structure
- The system shall handle changes in the MLM structure (e.g., user deletion, tier reconfiguration)

### 3.4 Commission Management

#### 3.4.1 Commission Calculation
- The system shall calculate commissions based on configurable rules
- The system shall support different commission types (fixed amount, percentage)
- The system shall calculate commissions for each tier according to the defined rates
- The system shall recalculate commissions when relevant parameters change

#### 3.4.2 Commission Tracking
- The system shall maintain a detailed history of all commission transactions
- The system shall track the status of each commission (pending, approved, paid)
- The system shall provide users with real-time visibility of their earned commissions
- The system shall generate commission reports for administrative review

#### 3.4.3 Commission Payout
- The system shall integrate with payment gateways for commission disbursement
- The system shall support multiple payout methods (bank transfer, PayPal, etc.)
- The system shall enforce minimum payout thresholds as configured
- The system shall maintain a record of all payout transactions

### 3.5 User Dashboard

#### 3.5.1 Referral Statistics
- The system shall display summary statistics of user's referral activity
- The system shall provide detailed breakdowns of referrals by status and tier
- The system shall visualize referral performance over time
- The system shall allow filtering and sorting of referral data

#### 3.5.2 Commission Information
- The system shall display summary statistics of user's commission earnings
- The system shall provide detailed breakdowns of commissions by status and tier
- The system shall visualize commission earnings over time
- The system shall display payout history and pending payments

#### 3.5.3 Downline Visualization
- The system shall provide a visual representation of the user's downline
- The system shall display performance metrics for each level of the downline
- The system shall allow users to navigate through their downline hierarchy
- The system shall provide search and filter capabilities for downline management

### 3.6 Administrative Functions

#### 3.6.1 Program Configuration
- The system shall allow administrators to configure all aspects of the referral program
- The system shall support creation and management of multiple referral programs
- The system shall provide tools for A/B testing different program configurations
- The system shall maintain a history of configuration changes

#### 3.6.2 Referral Moderation
- The system shall provide tools for reviewing and approving/rejecting referrals
- The system shall support bulk actions for referral management
- The system shall implement fraud detection mechanisms
- The system shall maintain an audit trail of all moderation actions

#### 3.6.3 Commission Administration
- The system shall provide tools for reviewing and approving/rejecting commissions
- The system shall support bulk processing of commission payouts
- The system shall provide reconciliation tools for financial reporting
- The system shall maintain an audit trail of all commission-related actions

#### 3.6.4 Reporting and Analytics
- The system shall generate comprehensive reports on referral program performance
- The system shall provide real-time analytics dashboards
- The system shall support export of reports in multiple formats
- The system shall allow customization of reports and dashboards

### 3.7 Notification System

#### 3.7.1 User Notifications
- The system shall notify users when they receive a new referral
- The system shall notify users when they earn a commission
- The system shall notify users when a commission is paid out
- The system shall allow users to configure their notification preferences

#### 3.7.2 Administrative Notifications
- The system shall notify administrators of suspicious referral activity
- The system shall notify administrators of large commission payouts
- The system shall notify administrators of system performance issues
- The system shall allow administrators to configure notification thresholds

## 4. Non-Functional Requirements

### 4.1 Performance Requirements
- The system shall support at least 1,000 concurrent users
- The system shall process referral tracking in real-time
- The system shall calculate commissions within 5 minutes of a qualifying event
- The system shall generate reports within 30 seconds of request

### 4.2 Security Requirements
- The system shall encrypt all sensitive data in transit and at rest
- The system shall implement fraud detection mechanisms to prevent abuse
- The system shall comply with GDPR and other relevant data protection regulations
- The system shall implement rate limiting to prevent system abuse

### 4.3 Scalability Requirements
- The system shall be designed to scale horizontally as user base grows
- The database design shall be optimized for high transaction volume
- The system shall implement caching strategies for improved performance
- The system shall use asynchronous processing for commission calculations

### 4.4 Reliability Requirements
- The system shall have an uptime of at least 99.9%
- The system shall implement data backup and recovery mechanisms
- The system shall handle failure gracefully with appropriate error messages
- The system shall maintain data integrity during concurrent operations

### 4.5 Usability Requirements
- The user interface shall be intuitive and require minimal training
- The system shall be accessible according to WCAG 2.1 AA standards
- The system shall be responsive and work on all major devices and browsers
- The system shall provide clear feedback for all user actions

## 5. System Interfaces

### 5.1 User Interfaces
- Web interface for regular users
- Mobile-responsive design for access on various devices
- Administrative dashboard for program management
- Reporting interface for analytics and insights

### 5.2 Software Interfaces
- Integration with authentication system (JWT-based)
- Integration with payment processing systems
- Integration with email and notification systems
- Integration with analytics platforms

### 5.3 Communication Interfaces
- RESTful API for all system functions
- Webhook support for integration with external systems
- Real-time updates via WebSockets for dashboard data

## 6. Data Requirements

### 6.1 Data Entities
- Users
- Referrals
- Commissions
- Payouts
- Tiers
- Programs (for multiple referral program support)
- Notifications
- Audit Logs

### 6.2 Data Relationships
- Users have many Referrals (as referrer)
- Users belong to many Referrals (as referred)
- Referrals generate many Commissions
- Users receive many Payouts
- Tiers apply to many Commissions
- Programs contain many Tiers
- Users receive many Notifications
- All entities generate Audit Logs

### 6.3 Data Retention
- Referral data shall be retained for the lifetime of the user account
- Commission data shall be retained for at least 7 years for financial compliance
- Audit logs shall be retained for at least 2 years
- User activity data shall be retained according to the platform's privacy policy

## 7. Constraints and Assumptions

### 7.1 Constraints
- The system must integrate with the existing SaaS platform architecture
- The system must comply with relevant financial regulations for commission payouts
- The system must adhere to data protection regulations in all operating jurisdictions
- The system must be implemented using the specified technology stack

### 7.2 Assumptions
- The existing authentication system can be extended to support referral tracking
- The payment processing system can handle the volume of commission payouts
- Users will have unique identifiers that can be used for referral tracking
- The database can scale to handle the expected volume of referral and commission data

## 8. Acceptance Criteria

### 8.1 Functional Acceptance Criteria
- Users can generate and share referral links
- System accurately tracks referrals across all tiers
- Commissions are calculated correctly according to the defined rules
- Administrative tools allow complete management of the referral program
- Reports provide accurate and comprehensive insights into program performance

### 8.2 Performance Acceptance Criteria
- System handles peak load of 1,000 concurrent users without degradation
- Referral tracking occurs in real-time
- Commission calculations complete within 5 minutes
- Dashboard updates occur within 3 seconds of data changes
- Reports generate within 30 seconds

### 8.3 Security Acceptance Criteria
- All sensitive data is encrypted in transit and at rest
- Fraud detection mechanisms identify and flag suspicious activity
- System passes security penetration testing
- System complies with all relevant data protection regulations

## 9. Implementation Considerations

### 9.1 Development Approach
The implementation will follow an iterative approach with three main phases:
1. Basic Referral System
2. MLM Capabilities
3. Advanced Features

### 9.2 Development Priorities
1. Core referral tracking functionality
2. User dashboard for referral management
3. Commission calculation and tracking
4. MLM structure implementation
5. Administrative tools
6. Advanced analytics and reporting
7. Payment processing integration

### 9.3 Deployment Considerations
- The system will be deployed using CI/CD pipeline
- Feature flags will be used to control rollout of functionality
- A/B testing will be implemented for key user-facing features
- Monitoring and alerting will be set up for system performance

## 10. Appendices

### 10.1 Glossary
- **MLM**: Multi-Level Marketing
- **Referrer**: User who shares referral link
- **Referee**: User who signs up using referral link
- **Downline**: Network of referred users
- **Commission**: Financial reward for referrals
- **Tier/Level**: Position in MLM hierarchy

### 10.2 References
- Post Affiliate Pro Documentation: [Post Affiliate Pro](https://support.qualityunit.com/690072-Post-Affiliate-Pro)
- Industry standard MLM commission structures
- Relevant financial regulations for commission payouts
- Data protection regulations (GDPR, CCPA, etc.)

## Technical Stack Requirements

### Frontend
- **Framework**: Next.js with React and TypeScript
- **UI Components**: ShadcnUI component library
- **Styling**: Tailwind CSS
- **State Management**: Tanstack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Authentication**: Auth.js (NextAuth.js)

### Backend
- **API Layer**: tRPC for type-safe APIs
- **Database**: PostgreSQL with Prisma ORM
- **Email Service**: Resend with React Email templates
- **Payment Processing**: Stripe or Lemon Squeezy
- **Analytics**: Tinybird for data analytics

### Development Tools
- **Type Safety**: TypeScript with strict mode
- **Code Quality**: ESLint with strict configuration
- **Code Formatting**: Prettier
- **Testing**: Vitest and Playwright
- **Documentation**: TypeDoc for API documentation

## Functional Requirements

### 1. User Authentication & Registration

```typescript
// Types
interface UserRegistration {
  email: string;
  password: string;
  referralCode?: string;
}

// API Schema
const userRegistrationSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  referralCode: z.string().optional()
});

// tRPC Procedure
register: publicProcedure
  .input(userRegistrationSchema)
  .mutation(async ({ ctx, input }) => {
    // Implementation
  })
```

### 2. Referral Management

```typescript
// Types
interface Referral {
  id: string;
  referrerId: string;
  referredEmail: string;
  status: ReferralStatus;
  createdAt: Date;
  commission?: Commission;
}

// API Schema
const createReferralSchema = z.object({
  referredEmail: z.string().email(),
  message: z.string().optional()
});

// tRPC Procedures
createReferral: protectedProcedure
  .input(createReferralSchema)
  .mutation(async ({ ctx, input }) => {
    // Implementation
  }),

getReferrals: protectedProcedure
  .query(async ({ ctx }) => {
    // Implementation
  })
```

### 3. MLM Structure

```typescript
// Types
interface MLMNode {
  userId: string;
  level: number;
  children: MLMNode[];
  metrics: {
    directReferrals: number;
    totalDownline: number;
    earnings: number;
  };
}

// API Schema
const mlmConfigSchema = z.object({
  maxLevels: z.number().min(1).max(10),
  commissionRates: z.array(z.number())
});

// tRPC Procedures
getNetworkStructure: protectedProcedure
  .query(async ({ ctx }) => {
    // Implementation
  }),

updateMLMConfig: adminProcedure
  .input(mlmConfigSchema)
  .mutation(async ({ ctx, input }) => {
    // Implementation
  })
```

### 4. Commission System

```typescript
// Types
interface Commission {
  id: string;
  referralId: string;
  amount: number;
  status: CommissionStatus;
  tier: number;
  createdAt: Date;
}

// API Schema
const processCommissionSchema = z.object({
  referralId: z.string(),
  amount: z.number(),
  tier: z.number()
});

// tRPC Procedures
processCommission: protectedProcedure
  .input(processCommissionSchema)
  .mutation(async ({ ctx, input }) => {
    // Implementation
  }),

getCommissions: protectedProcedure
  .query(async ({ ctx }) => {
    // Implementation
  })
```

### 5. Payment Processing

```typescript
// Types
interface PayoutRequest {
  userId: string;
  amount: number;
  method: PaymentMethod;
  status: PayoutStatus;
}

// API Schema
const payoutRequestSchema = z.object({
  amount: z.number().min(10),
  method: z.enum(['stripe', 'lemon_squeezy'])
});

// tRPC Procedures
requestPayout: protectedProcedure
  .input(payoutRequestSchema)
  .mutation(async ({ ctx, input }) => {
    // Implementation with Stripe/Lemon Squeezy
  })
```

## Non-Functional Requirements

### 1. Performance

- **API Response Times**: < 200ms for 95th percentile
- **Page Load Times**: < 2s First Contentful Paint
- **Database Queries**: Optimized with proper indexes
- **Caching Strategy**: 
  - Tanstack Query for API responses
  - Redis for session data
  - Edge caching for static assets

### 2. Security

- **Authentication**: Auth.js with JWT tokens
- **Authorization**: Role-based access control
- **Data Protection**: 
  - Encrypted sensitive data
  - HTTPS only
  - CSRF protection
  - Rate limiting

### 3. Scalability

- **Database**: 
  - Connection pooling
  - Read replicas for reporting
  - Proper indexing strategy

- **API**: 
  - Horizontal scaling
  - Load balancing
  - Rate limiting

### 4. Monitoring

- **Error Tracking**: 
  - Sentry for error reporting
  - Custom error boundaries
  - Structured logging

- **Performance Monitoring**:
  - Core Web Vitals tracking
  - API performance metrics
  - Database query analysis

### 5. Testing Requirements

```typescript
// Component Testing
import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';

test('ReferralCard displays correct status', () => {
  render(<ReferralCard referral={mockReferral} />);
  expect(screen.getByText('Pending')).toBeInTheDocument();
});

// API Testing
import { createInnerTRPCContext } from '~/server/api/trpc';

test('createReferral creates new referral', async () => {
  const ctx = createInnerTRPCContext({ session: mockSession });
  const result = await referralRouter.createReferral({
    ctx,
    input: mockReferralInput
  });
  expect(result.status).toBe('pending');
});

// E2E Testing
import { test, expect } from '@playwright/test';

test('complete referral flow', async ({ page }) => {
  await page.goto('/dashboard/referrals');
  await page.click('button:text("Create Referral")');
  // Additional test steps
});
```

## Integration Requirements

### 1. Email Integration (Resend)

```typescript
// Email Templates
import { Button } from '@react-email/button';
import { Html } from '@react-email/html';

export default function ReferralInviteEmail({ 
  referralLink,
  referrerName 
}: ReferralEmailProps) {
  return (
    <Html>
      <Button href={referralLink}>
        Join Now
      </Button>
    </Html>
  );
}

// Email Sending
const sendReferralEmail = async (to: string, data: ReferralEmailData) => {
  await resend.emails.send({
    from: 'referrals@example.com',
    to,
    subject: 'You've Been Invited!',
    react: ReferralInviteEmail(data)
  });
};
```

### 2. Payment Integration

```typescript
// Stripe Integration
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const processStripePayment = async (amount: number, userId: string) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd',
    metadata: { userId }
  });
  return paymentIntent;
};

// Lemon Squeezy Integration
const processLemonSqueezyPayment = async (amount: number, userId: string) => {
  // Implementation
};
```

### 3. Analytics Integration

```typescript
// Tinybird Events
interface ReferralEvent {
  userId: string;
  action: 'create' | 'complete' | 'cancel';
  referralId: string;
  timestamp: Date;
}

const trackReferralEvent = async (event: ReferralEvent) => {
  await tinybird.publish('referral_events', event);
};

// Analytics Queries
const getReferralMetrics = async (dateRange: DateRange) => {
  const result = await tinybird.query('referral_metrics', {
    params: { 
      start_date: dateRange.start,
      end_date: dateRange.end
    }
  });
  return result;
};
```

## Documentation Requirements

### 1. API Documentation

```typescript
/**
 * Creates a new referral in the system
 * @param {string} referredEmail - Email of the person being referred
 * @param {string} [message] - Optional personal message
 * @returns {Promise<Referral>} Created referral object
 * @throws {TRPCError} If user is not authorized or validation fails
 */
createReferral: protectedProcedure
  .input(createReferralSchema)
  .mutation(async ({ ctx, input }) => {
    // Implementation
  })
```

### 2. Component Documentation

```typescript
/**
 * Displays a referral card with status and actions
 * @component
 * @param {Object} props
 * @param {Referral} props.referral - Referral data to display
 * @param {function} props.onAction - Callback for referral actions
 */
export function ReferralCard({ 
  referral,
  onAction 
}: ReferralCardProps) {
  // Implementation
}
```

## Deployment Requirements

### 1. Environment Configuration

```typescript
// Environment variables schema
const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    STRIPE_SECRET_KEY: z.string(),
    RESEND_API_KEY: z.string(),
    TINYBIRD_TOKEN: z.string()
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url()
  }
});

// Configuration validation
const validateConfig = () => {
  const missingVars = Object.entries(env)
    .filter(([_, value]) => !value)
    .map(([key]) => key);
    
  if (missingVars.length > 0) {
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }
};
```

### 2. Database Migrations

```typescript
// Prisma migration
model Referral {
  id            String      @id @default(cuid())
  referrerId    String
  referredEmail String
  status        String      @default("pending")
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  
  referrer      User        @relation(fields: [referrerId], references: [id])
  commission    Commission?
  
  @@index([referrerId])
  @@index([status])
}

// Migration script
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Migration logic
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
``` 