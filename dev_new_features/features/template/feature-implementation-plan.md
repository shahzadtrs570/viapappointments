# Feature Implementation Plan: Referral System with MLM

## Overview

This implementation plan outlines the technical approach for developing the Referral System with MLM feature. The plan is structured into phases to allow for incremental development and testing, with each phase building upon the previous one to deliver a complete, robust solution.

## Technology Stack

- **Frontend**: Next.js with React, TypeScript, and Tailwind CSS with ShadCN UI components
- **Backend**: tRPC for type-safe APIs with Node.js
- **Database**: Prisma ORM with PostgreSQL
- **Authentication**: Auth.js for secure user authentication with multiple providers
- **Payment Processing**: Stripe or Lemon Squeezy integration
- **Email/Notifications**: Resend with React Email templates
- **Analytics**: Tinybird for data analytics
- **Data Validation**: Zod for schema validation and type safety
- **Data Fetching**: Tanstack Query for efficient data fetching and caching

## Development Phases

### Phase 1: Core Referral System (Weeks 1-4)

#### 1.1 Database Schema Setup (Week 1)

- Design and implement database schema using Prisma ORM:
  - Define Prisma schema for core entities
  - Set up PostgreSQL database
  - Configure Prisma migrations
  - Create seed data for testing

```typescript
// Example Prisma Schema

model User {
  id            String      @id @default(cuid())
  username      String
  email         String      @unique
  passwordHash  String
  referralCode  String      @unique
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  referredBy    String?     // ID of user who referred this user
  referrer      User?       @relation("ReferralRelation", fields: [referredBy], references: [id])
  referrals     User[]      @relation("ReferralRelation")
}

model Referral {
  id              String    @id @default(cuid())
  referrerId      String
  referredUserId  String
  status          String    @default("pending")
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  referrer        User      @relation(fields: [referrerId], references: [id])
  referredUser    User      @relation(fields: [referredUserId], references: [id])
}

model Commission {
  id          String    @id @default(cuid())
  userId      String
  referralId  String
  amount      Decimal
  status      String    @default("pending")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id])
  referral    Referral  @relation(fields: [referralId], references: [id])
}

model Payout {
  id                  String    @id @default(cuid())
  userId              String
  amount              Decimal
  paymentMethod       String
  status              String    @default("pending")
  transactionReference String?
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  user                User      @relation(fields: [userId], references: [id])
}
```

#### 1.2 Backend API Development (Weeks 1-2)

- Implement tRPC router and procedures:
  - User registration and authentication with Auth.js
  - Referral code generation
  - Referral tracking
  - Basic commission calculation
- Set up Zod schemas for input validation
- Configure Tanstack Query for data fetching
- Implement API documentation with tRPC Swagger

```typescript
// Example tRPC Router

import { z } from 'zod';
import { router, publicProcedure, protectedProcedure } from '../trpc';
import { generateReferralCode } from '../utils/referral';

export const referralRouter = router({
  register: publicProcedure
    .input(z.object({
      username: z.string(),
      email: z.string().email(),
      password: z.string(),
      referralCode: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Create user with Prisma
      const user = await ctx.prisma.user.create({
        data: {
          username: input.username,
          email: input.email,
          passwordHash: await hashPassword(input.password),
          referralCode: generateReferralCode(),
        },
      });
      
      // Process referral if code provided
      if (input.referralCode) {
        await processReferral(input.referralCode, user.id);
      }
      
      return { success: true };
    }),

  getUserReferrals: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.prisma.referral.findMany({
        where: { referrerId: ctx.session.user.id },
        include: { referredUser: true },
      });
    }),

  getUserCommissions: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.prisma.commission.findMany({
        where: { userId: ctx.session.user.id },
        include: { referral: true },
      });
    }),
});
```

#### 1.3 Frontend Development (Weeks 2-3)

- Set up Next.js project with TypeScript and Tailwind CSS
- Configure ShadcnUI components
- Implement user authentication with Auth.js
- Create referral center UI components
- Build responsive layouts with Tailwind CSS
- Set up Tanstack Query for data management

```typescript
// Example React Component with ShadcnUI and Tanstack Query

import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@package/ui/card';
import { Button } from '@package/ui/button';
import { Input } from '@package/ui/input';
import { trpc } from '@/utils/trpc';

const ReferralCenter = () => {
  const { data: referralLink, isLoading } = trpc.referral.getReferralLink.useQuery();
  const { data: referrals } = trpc.referral.getUserReferrals.useQuery();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Referral Link</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input 
            value={referralLink} 
            readOnly 
            className="flex-1"
          />
          <Button 
            onClick={() => navigator.clipboard.writeText(referralLink)}
          >
            Copy
          </Button>
        </div>
        
        {/* Referral List */}
        <div className="mt-4">
          {referrals?.map(referral => (
            <div key={referral.id} className="p-4 border rounded-lg mb-2">
              {/* Referral details */}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCenter;
```

#### 1.4 Integration and Testing (Week 4)

- Integrate frontend and backend components
- Implement end-to-end testing for core user flows
- Conduct performance testing
- Fix bugs and address issues
- Prepare for Phase 1 deployment

### Phase 2: MLM Capabilities (Weeks 5-8)

#### 2.1 Database Schema Extension (Week 5)

- Extend database schema to support MLM structure:
  - Add tier configuration tables
  - Modify referrals table to track tier relationships
  - Update commissions table to include tier information

```sql
-- Example PostgreSQL Schema Extensions

-- Tiers Table
CREATE TABLE tiers (
  tier_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  level INTEGER NOT NULL,
  commission_rate DECIMAL(5, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alter Referrals Table
ALTER TABLE referrals ADD COLUMN tier_id INTEGER REFERENCES tiers(tier_id);

-- Alter Commissions Table
ALTER TABLE commissions ADD COLUMN tier_id INTEGER REFERENCES tiers(tier_id);
```

#### 2.2 Backend MLM Logic (Weeks 5-6)

- Implement MLM structure management:
  - Tier configuration
  - Downline tracking
  - Multi-level commission calculation
- Develop algorithms for downline traversal and visualization
- Implement performance optimization for large MLM structures

```javascript
// Example MLM Service (Node.js)

class MLMService {
  // Get user's complete downline with performance metrics
  async getUserDownline(userId) {
    // Recursive query to get all levels of downline
    const downline = await this.fetchDownlineHierarchy(userId);
    
    // Calculate performance metrics for each member
    const enrichedDownline = await this.enrichWithPerformanceMetrics(downline);
    
    // Organize into hierarchical structure
    return this.buildHierarchicalStructure(enrichedDownline);
  }
  
  // Calculate commissions for all tiers based on a qualifying event
  async calculateMultiLevelCommissions(referralId, amount) {
    // Get the referral chain
    const referralChain = await this.getReferralChain(referralId);
    
    // Get tier configuration
    const tiers = await this.getTierConfiguration();
    
    // Calculate and create commission entries for each tier
    const commissions = [];
    
    for (let i = 0; i < referralChain.length && i < tiers.length; i++) {
      const userId = referralChain[i];
      const tier = tiers[i];
      
      const commissionAmount = amount * (tier.commission_rate / 100);
      
      const commission = await this.createCommission({
        userId,
        referralId,
        tierId: tier.tier_id,
        amount: commissionAmount
      });
      
      commissions.push(commission);
    }
    
    return commissions;
  }
}
```

#### 2.3 Frontend MLM Components (Weeks 6-7)

- Develop MLM dashboard UI
- Implement downline visualization
- Create tier-based analytics components
- Build performance reporting tools

```jsx
// Example React Component for Downline Visualization

import React, { useState, useEffect } from 'react';
import { Tree, Card, Spin, Tabs } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import { getUserDownline } from '../services/mlmService';

const { TabPane } = Tabs;

const DownlineVisualization = () => {
  const [downline, setDownline] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchDownline();
  }, []);
  
  const fetchDownline = async () => {
    setLoading(true);
    try {
      const response = await getUserDownline();
      setDownline(transformDataForTree(response.data));
    } catch (error) {
      console.error('Failed to fetch downline', error);
    } finally {
      setLoading(false);
    }
  };
  
  const transformDataForTree = (data) => {
    // Transform API data into format required by Ant Design Tree component
    return data.map(member => ({
      key: member.userId,
      title: `${member.username} (${member.referrals} referrals)`,
      icon: <UserOutlined />,
      children: member.children ? transformDataForTree(member.children) : []
    }));
  };
  
  return (
    <Card title="Your Downline Network">
      <Tabs defaultActiveKey="tree">
        <TabPane tab="Tree View" key="tree" icon={<TeamOutlined />}>
          <Spin spinning={loading}>
            {downline.length > 0 ? (
              <Tree
                showIcon
                defaultExpandAll
                treeData={downline}
              />
            ) : (
              <p>No downline members found. Start sharing your referral link!</p>
            )}
          </Spin>
        </TabPane>
        <TabPane tab="List View" key="list" icon={<UserOutlined />}>
          {/* List view implementation */}
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default DownlineVisualization;
```

#### 2.4 Integration and Testing (Week 8)

- Integrate MLM components with core referral system
- Conduct performance testing with large MLM structures
- Test commission calculations across multiple tiers
- Fix bugs and address issues
- Prepare for Phase 2 deployment

### Phase 3: Advanced Features (Weeks 9-12)

#### 3.1 Payment Processing Integration (Weeks 9-10)

- Integrate with payment gateways (Stripe, PayPal)
- Implement payout request and processing
- Develop payment method management
- Create reconciliation and reporting tools

```javascript
// Example Payment Service (Node.js)

class PaymentService {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }
  
  // Process payout via Stripe
  async processStripePayout(userId, amount) {
    try {
      // Get user's payment details
      const user = await userService.getUserWithPaymentDetails(userId);
      
      // Create Stripe transfer
      const transfer = await this.stripe.transfers.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        destination: user.stripeAccountId,
        transfer_group: `payout-${Date.now()}`
      });
      
      // Record payout in database
      const payout = await this.createPayoutRecord({
        userId,
        amount,
        paymentMethod: 'stripe',
        status: 'completed',
        transactionReference: transfer.id
      });
      
      // Update commission statuses
      await this.updateCommissionStatuses(userId, amount);
      
      return payout;
    } catch (error) {
      console.error('Stripe payout failed', error);
      throw new Error('Payment processing failed');
    }
  }
  
  // Request payout
  async requestPayout(userId, amount, paymentMethod) {
    // Validate minimum payout threshold
    const minimumThreshold = await this.getMinimumPayoutThreshold();
    if (amount < minimumThreshold) {
      throw new Error(`Minimum payout amount is ${minimumThreshold}`);
    }
    
    // Validate available balance
    const availableBalance = await this.getUserAvailableBalance(userId);
    if (amount > availableBalance) {
      throw new Error('Insufficient balance');
    }
    
    // Create pending payout record
    const payout = await this.createPayoutRecord({
      userId,
      amount,
      paymentMethod,
      status: 'pending'
    });
    
    // If automatic processing is enabled, process immediately
    if (this.isAutomaticProcessingEnabled(paymentMethod)) {
      return this.processPayout(payout.id);
    }
    
    return payout;
  }
}
```

#### 3.2 Advanced Analytics and Reporting (Week 10)

- Implement comprehensive analytics dashboard
- Develop custom report generation
- Create data visualization components
- Implement export functionality

```jsx
// Example React Component for Analytics Dashboard

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, DatePicker, Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { getAnalyticsData, exportReport } from '../services/analyticsService';

const { RangePicker } = DatePicker;
const { Option } = Select;

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState([null, null]);
  const [metrics, setMetrics] = useState([]);
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);
  
  const fetchAnalyticsData = async () => {
    setLoading(true);
    try {
      const [startDate, endDate] = timeRange;
      const response = await getAnalyticsData({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      });
      
      setMetrics(response.data.metrics);
      setChartData(response.data.chartData);
    } catch (error) {
      console.error('Failed to fetch analytics data', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleExport = async (format) => {
    try {
      const [startDate, endDate] = timeRange;
      await exportReport({
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        format
      });
    } catch (error) {
      console.error('Failed to export report', error);
    }
  };
  
  return (
    <div>
      <Card title="Referral Analytics">
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <RangePicker 
              onChange={setTimeRange}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button.Group>
              <Button 
                icon={<DownloadOutlined />} 
                onClick={() => handleExport('csv')}
              >
                Export CSV
              </Button>
              <Button 
                icon={<DownloadOutlined />} 
                onClick={() => handleExport('pdf')}
              >
                Export PDF
              </Button>
            </Button.Group>
          </Col>
        </Row>
        
        <Row gutter={16}>
          {/* KPI Cards */}
          {metrics.map(metric => (
            <Col span={6} key={metric.key}>
              <Card loading={loading}>
                <h3>{metric.label}</h3>
                <h2>{metric.value}</h2>
                <p>{metric.change}% from previous period</p>
              </Card>
            </Col>
          ))}
        </Row>
        
        <Row gutter={16} style={{ marginTop: 16 }}>
          <Col span={12}>
            <Card title="Referrals Over Time" loading={loading}>
              {chartData.referralsOverTime && (
                <Line data={chartData.referralsOverTime} />
              )}
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Commissions by Tier" loading={loading}>
              {chartData.commissionsByTier && (
                <Bar data={chartData.commissionsByTier} />
              )}
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
```

#### 3.3 Fraud Detection and Prevention (Week 11)

- Implement fraud detection algorithms
- Develop suspicious activity monitoring
- Create administrative tools for fraud management
- Implement rate limiting and abuse prevention

```javascript
// Example Fraud Detection Service (Node.js)

class FraudDetectionService {
  // Check for suspicious patterns in referrals
  async detectSuspiciousReferrals(referralId) {
    const referral = await this.getReferralWithDetails(referralId);
    const flags = [];
    
    // Check for self-referral (using different accounts)
    if (await this.isSelfReferral(referral)) {
      flags.push('potential_self_referral');
    }
    
    // Check for unusual IP patterns
    if (await this.hasUnusualIPPattern(referral)) {
      flags.push('unusual_ip_pattern');
    }
    
    // Check for rapid succession referrals
    if (await this.isRapidSuccessionReferral(referral)) {
      flags.push('rapid_succession');
    }
    
    // Check for geographic anomalies
    if (await this.hasGeographicAnomalies(referral)) {
      flags.push('geographic_anomaly');
    }
    
    // If flags detected, mark for review
    if (flags.length > 0) {
      await this.markReferralForReview(referralId, flags);
      await this.notifyAdministrators(referralId, flags);
    }
    
    return flags;
  }
  
  // Monitor for unusual commission patterns
  async monitorCommissionPatterns() {
    // Get recent commissions
    const recentCommissions = await this.getRecentCommissions();
    
    // Group by user
    const userCommissions = this.groupCommissionsByUser(recentCommissions);
    
    // Analyze patterns
    for (const [userId, commissions] of Object.entries(userCommissions)) {
      // Check for sudden spikes
      if (this.hasSuddenSpike(commissions)) {
        await this.flagUserForReview(userId, 'commission_spike');
      }
      
      // Check for unusual tier distribution
      if (this.hasUnusualTierDistribution(commissions)) {
        await this.flagUserForReview(userId, 'unusual_tier_distribution');
      }
    }
  }
}
```

#### 3.4 Administrative Tools (Week 12)

- Develop comprehensive admin dashboard
- Implement program configuration interface
- Create user management tools
- Build moderation and approval workflows

```jsx
// Example React Component for Admin Dashboard

import React, { useState, useEffect } from 'react';
import { Layout, Menu, Card, Table, Button, Modal, Form, Input, Select } from 'antd';
import {
  DashboardOutlined,
  SettingOutlined,
  UserOutlined,
  FlagOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { getAdminDashboardData } from '../services/adminService';

const { Header, Sider, Content } = Layout;
const { Option } = Select;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [dashboardData, setDashboardData] = useState({});
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await getAdminDashboardData();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderContent = () => {
    switch (currentSection) {
      case 'dashboard':
        return renderDashboardContent();
      case 'settings':
        return renderSettingsContent();
      case 'users':
        return renderUsersContent();
      case 'moderation':
        return renderModerationContent();
      case 'payouts':
        return renderPayoutsContent();
      default:
        return renderDashboardContent();
    }
  };
  
  const renderDashboardContent = () => (
    <div>
      <h2>Admin Dashboard</h2>
      <Card loading={loading}>
        {/* Dashboard content */}
      </Card>
    </div>
  );
  
  const renderSettingsContent = () => (
    <div>
      <h2>Program Settings</h2>
      <Card>
        <Form layout="vertical">
          {/* Program settings form */}
        </Form>
      </Card>
    </div>
  );
  
  // Additional render methods for other sections
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['dashboard']} mode="inline">
          <Menu.Item key="dashboard" icon={<DashboardOutlined />} onClick={() => setCurrentSection('dashboard')}>
            Dashboard
          </Menu.Item>
          <Menu.Item key="settings" icon={<SettingOutlined />} onClick={() => setCurrentSection('settings')}>
            Settings
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />} onClick={() => setCurrentSection('users')}>
            Users
          </Menu.Item>
          <Menu.Item key="moderation" icon={<FlagOutlined />} onClick={() => setCurrentSection('moderation')}>
            Moderation
          </Menu.Item>
          <Menu.Item key="payouts" icon={<DollarOutlined />} onClick={() => setCurrentSection('payouts')}>
            Payouts
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }} />
        <Content style={{ margin: '16px' }}>
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
```

#### 3.5 Final Integration and Testing (Week 12)

- Integrate all components
- Conduct comprehensive testing
- Perform security audit
- Optimize performance
- Prepare for production deployment

### Phase 4: Deployment and Monitoring (Weeks 13-14)

#### 4.1 Deployment Preparation (Week 13)

- Finalize documentation
- Set up CI/CD pipeline
- Configure staging environment
- Conduct pre-deployment testing
- Prepare rollback strategy

#### 4.2 Production Deployment (Week 13)

- Deploy database migrations
- Deploy backend services
- Deploy frontend application
- Configure monitoring and alerting
- Implement feature flags for controlled rollout

#### 4.3 Post-Deployment Monitoring (Week 14)

- Monitor system performance
- Track error rates
- Collect user feedback
- Address any issues or bugs
- Prepare for iterative improvements

## Resource Requirements

### Development Team

- 1 Project Manager
- 2 Backend Developers
- 2 Frontend Developers
- 1 QA Engineer
- 1 DevOps Engineer

### Infrastructure

- Development environment
- Staging environment
- Production environment
- CI/CD pipeline
- Monitoring and alerting system

### External Services

- Payment gateway accounts (Stripe, PayPal)
- Email/notification service accounts
- Analytics platform integration

## Risk Management

### Identified Risks

1. **Performance Issues with Large MLM Structures**
   - Mitigation: Implement pagination, caching, and optimized database queries
   - Contingency: Limit maximum depth of MLM structure if performance issues persist

2. **Payment Processing Integration Complexity**
   - Mitigation: Start with a single payment provider and expand later
   - Contingency: Implement manual payout process as fallback

3. **Fraud and Abuse**
   - Mitigation: Implement robust fraud detection and prevention mechanisms
   - Contingency: Require manual approval for suspicious activities

4. **Regulatory Compliance**
   - Mitigation: Consult with legal experts on MLM regulations
   - Contingency: Adjust commission structure to comply with regulations

5. **Data Migration Challenges**
   - Mitigation: Develop comprehensive migration plan with rollback capability
   - Contingency: Schedule migration during low-traffic periods

## Success Criteria

The implementation will be considered successful when:

1. Users can generate and share referral links
2. The system accurately tracks referrals across all tiers
3. Commissions are calculated correctly according to the defined rules
4. Administrators can configure and manage the referral program
5. The system can handle the expected load without performance degradation
6. All security and compliance requirements are met

## Post-Implementation Support

After deployment, the following support activities will be conducted:

1. **Monitoring and Maintenance**
   - Continuous monitoring of system performance
   - Regular security updates
   - Bug fixes and minor enhancements

2. **User Support**
   - Documentation and help resources
   - Support ticket system for user issues
   - Regular training for support staff

3. **Iterative Improvements**
   - Collection and analysis of user feedback
   - Identification of enhancement opportunities
   - Prioritization of future development work

## Conclusion

This implementation plan provides a structured approach to developing the Referral System with MLM feature. By following this phased approach, the development team can deliver a robust, scalable solution that meets the business requirements while managing risks and ensuring quality. 