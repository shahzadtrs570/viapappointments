# Feature App Flow: Referral System with MLM

## Overview
This document outlines the user journey and interface flow for the Referral System with MLM feature. It describes the key user interactions, screen flows, and system behaviors that enable users to participate in the referral program and administrators to manage it effectively.

## Application Structure

### Next.js App Router Structure

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   └── layout.tsx
├── dashboard/
│   ├── referrals/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   ├── network/
│   │   └── page.tsx
│   ├── earnings/
│   │   └── page.tsx
│   └── layout.tsx
├── admin/
│   ├── referrals/
│   │   └── page.tsx
│   ├── settings/
│   │   └── page.tsx
│   └── layout.tsx
└── layout.tsx
```

### API Routes (tRPC)

```typescript
// server/api/routers/referral.ts
export const referralRouter = router({
  // Public procedures
  getReferralByCode: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.referral.findUnique({
        where: { code: input.code }
      });
    }),

  // Protected procedures
  createReferral: protectedProcedure
    .input(z.object({
      referredEmail: z.string().email(),
      message: z.string().optional()
    }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.referral.create({
        data: {
          referrerId: ctx.session.user.id,
          referredEmail: input.email,
          message: input.message
        }
      });
    }),

  getUserReferrals: protectedProcedure
    .query(({ ctx }) => {
      return ctx.prisma.referral.findMany({
        where: { referrerId: ctx.session.user.id }
      });
    }),

  // Admin procedures
  manageReferralProgram: adminProcedure
    .input(z.object({
      maxTierLevel: z.number(),
      commissionRates: z.array(z.number())
    }))
    .mutation(({ ctx, input }) => {
      // Update program settings
    })
});
```

## User Types and Journeys

### Regular Users
Regular users of the SaaS platform who can participate in the referral program.

### Administrators
Staff members who configure and manage the referral program.

### Finance Team
Personnel responsible for approving and processing commission payouts.

## Core User Flows

### 1. User Registration with Referral

```typescript
// app/(auth)/register/page.tsx
export default function RegisterPage() {
  const { mutate } = trpc.auth.register.useMutation();
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => {
        mutate({
          email: data.email,
          password: data.password,
          referralCode: data.referralCode
        });
      })}>
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Additional form fields */}
      </form>
    </Form>
  );
}
```

### 2. Referral Dashboard

```typescript
// app/dashboard/referrals/page.tsx
export default function ReferralDashboardPage() {
  const { data: referrals } = trpc.referral.getUserReferrals.useQuery();
  const { data: stats } = trpc.referral.getReferralStats.useQuery();
  
  return (
    <div className="space-y-8">
      <ReferralStats stats={stats} />
      <ReferralList referrals={referrals} />
      <ReferralLinkGenerator />
    </div>
  );
}
```

### 3. MLM Network View

```typescript
// app/dashboard/network/page.tsx
export default function NetworkPage() {
  const { data: network } = trpc.mlm.getNetworkStructure.useQuery();
  
  return (
    <div className="space-y-8">
      <NetworkVisualization data={network} />
      <NetworkStats />
      <DownlineMemberList />
    </div>
  );
}
```

### 4. Earnings Management

```typescript
// app/dashboard/earnings/page.tsx
export default function EarningsPage() {
  const { data: earnings } = trpc.earnings.getEarningsData.useQuery();
  const { mutate: requestPayout } = trpc.earnings.requestPayout.useMutation();
  
  return (
    <div className="space-y-8">
      <EarningsSummary data={earnings} />
      <PayoutRequestForm onSubmit={requestPayout} />
      <TransactionHistory />
    </div>
  );
}
```

### 5. Referral Management

#### 5.1 Referral Link Generation and Sharing
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  Referral Center│────▶│ Generate Links  │────▶│  Sharing Options│────▶│ Sharing Tracking│
│                 │     │                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Referral Center**
   - User navigates to Referral Center
   - System displays existing referral links and performance metrics

2. **Generate Links**
   - User requests to generate a new referral link
   - System allows user to label the link (e.g., "Facebook Campaign")
   - System generates unique link with tracking parameters

3. **Sharing Options**
   - System presents sharing options (email, social media, copy link, QR code)
   - User selects desired sharing method
   - System facilitates sharing through selected channel

4. **Sharing Tracking**
   - System records sharing method and timestamp
   - User can view performance of different sharing methods
   - System provides insights on most effective sharing channels

#### 5.2 Referral Tracking and Monitoring
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Referral Center│────▶│ Referral List   │────▶│ Referral Details│
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Referral Center**
   - User navigates to Referral Center
   - System displays summary of referral activity

2. **Referral List**
   - System presents list of all referrals with key information
   - User can filter and sort referrals by status, date, etc.
   - System provides pagination for large numbers of referrals

3. **Referral Details**
   - User selects a specific referral
   - System displays detailed information about the referral
   - User can see status, commission information, and activity timeline

### 6. MLM Structure Management

#### 6.1 Downline Visualization and Navigation
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  Referral Center│────▶│ MLM Dashboard   │────▶│ Downline View   │────▶│ Member Details  │
│                 │     │                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Referral Center**
   - User navigates to Referral Center
   - System provides access to MLM Dashboard

2. **MLM Dashboard**
   - System displays summary of MLM structure
   - User can see metrics for each tier in their downline
   - System presents visualization options

3. **Downline View**
   - System displays hierarchical visualization of user's downline
   - User can expand/collapse different levels
   - System provides filtering and search capabilities

4. **Member Details**
   - User selects a specific member in their downline
   - System displays detailed information about the member
   - User can see member's performance metrics and activity

#### 6.2 Performance Analysis by Tier
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  MLM Dashboard  │────▶│ Tier Analysis   │────▶│ Performance     │
│                 │     │                 │     │ Reports         │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **MLM Dashboard**
   - User navigates to MLM Dashboard
   - System displays summary metrics by tier

2. **Tier Analysis**
   - User selects a specific tier for analysis
   - System displays detailed metrics for the selected tier
   - User can compare performance across tiers

3. **Performance Reports**
   - System generates detailed reports on tier performance
   - User can export reports in various formats
   - System provides visualization of performance trends

### 7. Commission Management

#### 7.1 Commission Tracking and History
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  Referral Center│────▶│ Earnings        │────▶│ Commission List │────▶│ Commission      │
│                 │     │ Dashboard       │     │                 │     │ Details         │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Referral Center**
   - User navigates to Referral Center
   - System provides access to Earnings Dashboard

2. **Earnings Dashboard**
   - System displays summary of earnings
   - User can see earnings breakdown by tier and status
   - System presents earnings trends over time

3. **Commission List**
   - System presents list of all commissions with key information
   - User can filter and sort commissions by status, date, amount, etc.
   - System provides pagination for large numbers of commissions

4. **Commission Details**
   - User selects a specific commission
   - System displays detailed information about the commission
   - User can see status, referral information, and payout details

#### 7.2 Commission Payout Process
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  Earnings       │────▶│ Payout Request  │────▶│ Payment Method  │────▶│ Payout          │
│  Dashboard      │     │                 │     │ Selection       │     │ Confirmation    │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Earnings Dashboard**
   - User navigates to Earnings Dashboard
   - System displays available balance for payout

2. **Payout Request**
   - User initiates payout request
   - System validates eligibility (minimum threshold, verification status)
   - User confirms payout amount

3. **Payment Method Selection**
   - System presents available payout methods
   - User selects preferred payment method
   - System collects any additional required information

4. **Payout Confirmation**
   - System processes payout request
   - User receives confirmation of request submission
   - System updates payout status and provides tracking information

### 8. Administrative Flows

#### 8.1 Referral Program Configuration
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  Admin Dashboard│────▶│ Program Settings│────▶│ Tier            │────▶│ Configuration   │
│                 │     │                 │     │ Configuration   │     │ Confirmation    │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Admin Dashboard**
   - Administrator navigates to Admin Dashboard
   - System provides access to Program Settings

2. **Program Settings**
   - System displays current program configuration
   - Administrator can modify general program settings
   - System validates configuration changes

3. **Tier Configuration**
   - Administrator configures tier structure
   - System allows setting commission rates for each tier
   - Administrator can define tier-specific rules

4. **Configuration Confirmation**
   - System summarizes configuration changes
   - Administrator confirms changes
   - System applies and activates new configuration

#### 8.2 Referral Moderation
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  Admin Dashboard│────▶│ Referral Queue  │────▶│ Referral Review │────▶│ Moderation      │
│                 │     │                 │     │                 │     │ Action          │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Admin Dashboard**
   - Administrator navigates to Admin Dashboard
   - System provides access to Referral Queue

2. **Referral Queue**
   - System displays list of referrals requiring review
   - Administrator can filter and sort referrals
   - System highlights suspicious or flagged referrals

3. **Referral Review**
   - Administrator selects a referral for review
   - System displays detailed information about the referral
   - System presents fraud detection indicators if applicable

4. **Moderation Action**
   - Administrator approves, rejects, or flags the referral
   - System processes the moderation action
   - System updates referral status and triggers appropriate notifications

#### 8.3 Commission Administration
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  Admin Dashboard│────▶│ Commission      │────▶│ Payout          │────▶│ Payout          │
│                 │     │ Management      │     │ Processing      │     │ Confirmation    │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Admin Dashboard**
   - Administrator navigates to Admin Dashboard
   - System provides access to Commission Management

2. **Commission Management**
   - System displays list of pending commissions
   - Administrator can filter and sort commissions
   - System provides bulk action capabilities

3. **Payout Processing**
   - Administrator selects commissions for payout
   - System validates payout eligibility
   - Administrator confirms payout details

4. **Payout Confirmation**
   - System processes payouts through selected payment methods
   - Administrator receives confirmation of successful processing
   - System updates commission status and triggers user notifications

#### 8.4 Reporting and Analytics
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│  Admin Dashboard│────▶│ Analytics       │────▶│ Report          │────▶│ Export/Share    │
│                 │     │ Dashboard       │     │ Generation      │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

1. **Admin Dashboard**
   - Administrator navigates to Admin Dashboard
   - System provides access to Analytics Dashboard

2. **Analytics Dashboard**
   - System displays key performance indicators
   - Administrator can view metrics by various dimensions
   - System presents visualizations of program performance

3. **Report Generation**
   - Administrator selects report type and parameters
   - System generates requested report
   - Administrator can customize report format and content

4. **Export/Share**
   - System provides options to export report in various formats
   - Administrator can schedule recurring reports
   - System supports sharing reports with stakeholders

## Interface Screens

### User Interfaces

#### Referral Center
- **Purpose**: Central hub for users to manage their referral activities
- **Key Components**:
  - Referral statistics summary
  - Referral link generation tools
  - Sharing options
  - Navigation to detailed views (Referrals, Earnings, MLM)
- **User Actions**:
  - Generate and share referral links
  - View referral performance
  - Access detailed referral information
  - Navigate to MLM structure view

#### MLM Dashboard
- **Purpose**: Visualization and management of user's MLM structure
- **Key Components**:
  - Hierarchical visualization of downline
  - Performance metrics by tier
  - Member search and filtering
  - Detailed member information
- **User Actions**:
  - Navigate through downline structure
  - View performance metrics by tier
  - Search for specific members
  - Access detailed member information

#### Earnings Dashboard
- **Purpose**: Tracking and management of commission earnings
- **Key Components**:
  - Earnings summary
  - Commission breakdown by tier and status
  - Payout request functionality
  - Commission history
- **User Actions**:
  - View earnings information
  - Request payouts
  - Track payout status
  - View commission history

### Administrative Interfaces

#### Admin Dashboard
- **Purpose**: Central hub for program administration
- **Key Components**:
  - Program performance overview
  - Quick access to key administrative functions
  - Alert notifications for items requiring attention
  - System health indicators
- **User Actions**:
  - Navigate to specific administrative functions
  - View program performance metrics
  - Respond to alerts and notifications

#### Program Configuration
- **Purpose**: Configuration of referral program parameters
- **Key Components**:
  - General program settings
  - Tier structure configuration
  - Commission rate settings
  - Program rules and constraints
- **User Actions**:
  - Configure program parameters
  - Define tier structure
  - Set commission rates
  - Establish program rules

#### Referral Moderation
- **Purpose**: Review and moderation of referrals
- **Key Components**:
  - Referral queue
  - Detailed referral information
  - Fraud detection indicators
  - Moderation action controls
- **User Actions**:
  - Review referrals
  - Approve or reject referrals
  - Flag suspicious activity
  - Apply bulk moderation actions

#### Commission Management
- **Purpose**: Administration of commissions and payouts
- **Key Components**:
  - Commission queue
  - Payout processing tools
  - Payment method management
  - Payout history
- **User Actions**:
  - Review pending commissions
  - Process payouts
  - Manage payment methods
  - View payout history

#### Analytics Dashboard
- **Purpose**: Comprehensive program analytics
- **Key Components**:
  - Key performance indicators
  - Performance visualizations
  - Report generation tools
  - Data export functionality
- **User Actions**:
  - View program performance metrics
  - Generate custom reports
  - Export data for further analysis
  - Schedule recurring reports

## System Notifications

### User Notifications

#### Referral Notifications
- New referral sign-up
- Referral status change
- Referral milestone achievement

#### Commission Notifications
- New commission earned
- Commission status change
- Payout processing updates
- Payout completion

#### MLM Notifications
- New downline member
- Downline performance milestones
- Tier advancement opportunities

### Administrative Notifications

#### Moderation Notifications
- New referrals requiring review
- Suspicious activity alerts
- Fraud detection warnings

#### Financial Notifications
- Large commission approvals
- Payout processing alerts
- Financial reconciliation reminders

#### System Notifications
- Configuration changes
- Performance threshold alerts
- System maintenance notifications

## Error Handling

### User-Facing Errors

#### Referral Errors
- Invalid referral link
- Referral limit reached
- Self-referral attempt

#### Commission Errors
- Minimum payout threshold not met
- Payment method validation failure
- Commission calculation discrepancy

#### Authentication Errors
- Access permission denied
- Session timeout
- Account verification required

### Administrative Errors

#### Configuration Errors
- Invalid configuration parameters
- Conflicting rule definitions
- Retroactive change limitations

#### Processing Errors
- Payout processing failure
- Bulk action partial completion
- Data import/export errors

#### System Errors
- Database connection issues
- API integration failures
- Performance degradation warnings

## Integration Points

### External System Integrations

#### Payment Processors
- Commission payout processing
- Payment method validation
- Transaction reconciliation

#### Email/Notification Systems
- User notifications
- Administrative alerts
- Marketing communications

#### Analytics Platforms
- Performance data export
- Advanced analytics processing
- Custom report generation

### Internal System Integrations

#### User Authentication
- User identity verification
- Permission management
- Session handling

#### Product/Service Systems
- Qualifying purchase tracking
- Product eligibility rules
- Service usage metrics

#### Financial Systems
- Commission accounting
- Tax reporting
- Financial reconciliation

## Conclusion

This app flow document provides a comprehensive overview of the user journeys and interface flows for the Referral System with MLM feature. It serves as a guide for developers, designers, and stakeholders to understand how users will interact with the system and how the various components will work together to deliver a seamless referral program experience. 