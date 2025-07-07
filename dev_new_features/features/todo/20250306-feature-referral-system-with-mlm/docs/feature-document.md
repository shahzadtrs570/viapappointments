# Feature Document: Referral System with MLM

## Feature Overview
The Referral System with MLM (Multi-Level Marketing) is a comprehensive solution designed to enable businesses to grow their user base through incentivized referrals. The system supports both basic single-tier referrals and advanced multi-level marketing structures, allowing for flexible implementation based on business needs. Users can generate unique referral links, track referrals, and earn commissions based on the activity of their referrals across multiple tiers.

## Core Features

### Basic Referral Functionality
- **Unique Referral Link Generation**: Each user receives a personalized referral link/code
- **Referral Tracking**: System tracks all referrals through unique identifiers
- **Commission Calculation**: Automatic calculation of rewards for successful referrals
- **User Dashboard**: Interface for users to monitor their referrals and earnings

### MLM Capabilities
- **Multi-Tier Structure**: Support for multiple levels of referrals (e.g., Level 1, Level 2, Level 3)
- **Customizable Commission Tiers**: Configurable commission rates for each tier
- **Downline Visualization**: Visual representation of a user's referral network
- **Tier-Based Analytics**: Performance metrics broken down by referral tier

### Commission Management
- **Automated Calculations**: Real-time commission calculations based on defined rules
- **Payment Processing**: Integration with payment gateways for commission disbursement
- **Commission History**: Detailed record of all commission transactions
- **Payout Status Tracking**: Monitoring of pending and completed payouts

### Analytics & Reporting
- **Real-Time Dashboard**: Up-to-date metrics on referral performance
- **Exportable Reports**: Data export functionality in common formats (CSV, Excel)
- **Performance Metrics**: Conversion rates, earnings per referral, network growth
- **Admin Reporting**: Comprehensive system-wide analytics for administrators

## User Roles & Permissions

### Regular Users
- Generate and share referral links
- View personal referral statistics
- Track earned commissions
- Request commission payouts
- Access personal downline information (if MLM is enabled)

### Administrators
- Configure referral program parameters
- Set commission rates for different tiers
- Review and approve/reject referrals
- Process commission payouts
- Access system-wide analytics
- Manage user accounts and permissions

## Technical Considerations

### Technology Stack
- **Frontend**: Next.js with React, TypeScript, and Tailwind CSS with ShadCN UI components
- **Backend**: tRPC for type-safe APIs with Node.js
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: Auth.js for secure user authentication with multiple providers
- **Payment Processing**: Stripe or Lemon Squeezy integration
- **Email Notifications**: Resend with React Email templates
- **Analytics**: Tinybird for data analytics
- **Data Validation**: Zod for schema validation and type safety
- **Data Fetching**: Tanstack Query for efficient data fetching and caching

### Integration Requirements
- Stripe/Lemon Squeezy integration for commission disbursement
- Resend email service for referral notifications and updates
- Tinybird analytics for performance tracking
- Social media sharing capabilities

### Security Considerations
- GDPR compliance for user data protection
- Role-Based Access Control (RBAC) and Policy-Based Access Control (PBAC)
- Fraud detection mechanisms to prevent abuse
- Data encryption for sensitive information
- Rate limiting to prevent system abuse

### Scalability Factors
- Database design optimized for high transaction volume
- Caching strategies for improved performance
- Asynchronous processing for commission calculations
- Horizontal scaling capabilities for growing user base

## Data Schema

### Primary Entities
- **Users**: Stores user account information and referral codes
- **Referrals**: Tracks referral relationships between users
- **Commissions**: Records commission transactions and statuses
- **Payouts**: Manages the disbursement of earned commissions
- **Tiers**: Defines commission rates for different referral levels

### Key Relationships
- Users have many Referrals (as referrer)
- Users belong to many Referrals (as referred)
- Referrals generate many Commissions
- Users receive many Payouts
- Tiers apply to many Commissions

## UX & Design Preferences

### User Dashboard
- Clean, intuitive interface using ShadCN UI components
- Visual representation of MLM structure (tree/network diagram)
- Real-time updates on referral status and commissions
- Mobile-responsive design for on-the-go access

### Admin Interface
- Comprehensive control panel for system configuration
- Detailed analytics dashboard with filtering capabilities
- Bulk action tools for referral and commission management
- Audit logs for tracking administrative actions

### Referral Sharing Experience
- Simple, one-click sharing to popular platforms
- Customizable referral messages
- QR code generation for offline sharing
- Tracking of sharing method effectiveness

## Implementation Considerations

### Phase 1: Basic Referral System
- Implement core user authentication with Auth.js
- Develop basic referral tracking functionality
- Create simple user dashboard for referral monitoring
- Establish commission calculation framework

### Phase 2: MLM Capabilities
- Extend system to support multi-tier referrals
- Implement downline visualization
- Develop tier-based commission calculations
- Enhance analytics for multi-level insights

### Phase 3: Advanced Features
- Integrate Stripe/Lemon Squeezy for payment processing
- Implement advanced fraud detection
- Develop comprehensive reporting tools with Tinybird
- Create administrative dashboard

## Compliance & Legal Considerations
- Ensure compliance with relevant MLM regulations
- Implement clear terms and conditions for referral program
- Maintain transparency in commission structure
- Establish privacy policy for user data handling

## Success Metrics
- User adoption rate of referral program
- Conversion rate of referral links
- Revenue generated through referral system
- User satisfaction with commission structure
- System performance under load 