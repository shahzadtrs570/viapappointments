# Srenova: Application Flow

## Overview
This document outlines the user journey and interface flow for the Srenova platform, focusing on all user roles and their interactions. The flow is designed to be intuitive, educational, and supportive throughout the process.

## Marketing Website Flow

### 1. Landing Page
- **URL**: `/`
- **Features**:
  - Language selector (EN, FR, IT)
  - Hero section with value proposition
  - Key benefits overview
  - Call-to-action buttons
  - Educational content preview
  - Role-specific entry points

### 2. Educational Content
- **URL**: `/learn`
- **Features**:
  - Multi-language content
  - Interactive guides
  - Video explanations
  - FAQ section
  - Success stories
  - Role-specific information

### 3. Initial Assessment
- **URL**: `/assessment`
- **Features**:
  - Progressive questionnaire
  - Real-time feedback
  - Eligibility check
  - Contact form
  - Magic link request
  - Role-specific questions

## Dashboard Application Flow

### 1. Authentication
- **URL**: `/auth`
- **Features**:
  - Magic link email input
  - Email verification
  - Session management
  - Language persistence
  - Role-based redirection

### 2. Role-Specific Onboarding

#### Seller Onboarding
- **URL**: `/onboarding/seller`
- **Flow**:
  1. **Welcome & Role Selection** *(No Authentication Required)*
     - Role identification
     - No personal information required
     - Selection of "Property Owner" role
     - Conversational approach to begin journey
  
  2. **Guided Property Owner Assessment** *(No Authentication Required)*
     - Mortgage status assessment
       * Existing mortgage details
       * Fully paid property information
     - Financial priorities questionnaire
       * Preference for lump sum vs monthly income
       * Bouquet/rente balance preferences
     - Basic property information
       * Property type (apartment, house, other)
       * Location (Paris, major city, rural)
       * Property condition assessment
       * Current estimated value (optional)
     - Occupancy plans
       * Continued residence vs vacating plans
       * Term period expectations if applicable
     - General health assessment
       * Overall health status
       * Mobility information
       * No invasive health questions
     - Preliminary valuation estimate based on provided information
     - Option to continue without authentication
  
  3. **Email Collection & Optional Authentication**
     - Name and email collection (only when necessary to save progress)
     - Presented as "save your progress" rather than registration
     - Optional: Magic link email for future access
     - Clear messaging that account creation is optional at this stage
     - Option to continue as guest with session storage
  
  4. **Detailed Property Information** *(Authentication Required for Document Upload Only)*
     - Comprehensive property questionnaire (no authentication required)
     - Property photos/documents upload (requires authentication)
     - Floor plan information
     - Energy performance details
     - Current maintenance costs
     - Property history
     - Option to complete profile later
  
  5. **Personal & Financial Details** *(Authentication Required)*
     - Full contact information
     - Language preferences
     - Communication preferences
     - Specific financial goals
       * Lump sum needs detail
       * Monthly income requirements
       * Timeline expectations
       * Retirement planning integration

#### Family Supporter Onboarding
- **URL**: `/onboarding/family-supporter`
- **Flow**:
  1. Personal Information
     - Basic details
     - Contact information
     - Relationship to seller
  2. Support Role
     - Level of involvement
     - Communication preferences
     - Notification settings
  3. Property Knowledge
     - Property details
     - Ownership structure
     - Current arrangements

#### Fund Buyer Onboarding
- **URL**: `/onboarding/fund-buyer`
- **Flow**:
  1. Company Information
     - Business details
     - Registration number
     - Contact information
  2. Investment Criteria
     - Property types
     - Location preferences
     - Budget range
  3. Verification
     - Financial documents
     - Legal compliance
     - Market experience

#### Conveyancer Onboarding
- **URL**: `/onboarding/conveyancer`
- **Flow**:
  1. Professional Details
     - Practice information
     - Registration details
     - Specializations
  2. Service Areas
     - Geographic coverage
     - Property types
     - Language capabilities
  3. Verification
     - Professional credentials
     - Insurance details
     - References

#### Valuer Onboarding
- **URL**: `/onboarding/valuer`
- **Flow**:
  1. Professional Details
     - Qualifications
     - Experience
     - Specializations
  2. Service Areas
     - Geographic coverage
     - Property types
     - Language capabilities
  3. Verification
     - Professional credentials
     - Insurance details
     - References

## Role-Specific Dashboard Flows

### Seller Dashboard
- **URL**: `/dashboard/seller`
- **Features**:
  1. Property Management
     - Property details
     - Document upload
     - Photo gallery
     - Location map
     - Valuation request
  2. Document Center
     - Document upload
     - Document categorization
     - Verification status
     - Document preview
     - Download options
  3. Offer Management
     - Offer details view
     - Payment calculator
     - Terms explanation
     - Comparison tools
     - Acceptance workflow
  4. Contract Management
     - Contract preview
     - Digital signature
     - Witness management
     - Payment setup
     - Status tracking

### Family Supporter Dashboard
- **URL**: `/dashboard/family-supporter`
- **Features**:
  1. Property Overview
     - Property details
     - Current status
     - Timeline view
  2. Communication Center
     - Message inbox
     - Document sharing
     - Meeting scheduler
     - Notification preferences
  3. Support Resources
     - Educational content
     - FAQ section
     - Support contacts
     - Legal guidance

### Fund Buyer Dashboard
- **URL**: `/dashboard/fund-buyer`
- **Features**:
  1. Property Search
     - Advanced filters
     - Saved searches
     - Property alerts
     - Market analysis
  2. Buy Box Management
     - View admin-created Buy Boxes
     - Create custom Buy Boxes
     - Analyze portfolio metrics
     - Compare different Buy Boxes
  3. Offer Management
     - Offer creation for individual properties
     - Offer creation for Buy Boxes
     - Portfolio view
     - Performance tracking
     - Risk assessment
  4. Contract Management
     - Contract review
     - Digital signing
     - Payment processing
     - Portfolio overview

### Conveyancer Dashboard
- **URL**: `/dashboard/conveyancer`
- **Features**:
  1. Case Management
     - Active cases
     - Document review
     - Timeline tracking
     - Client communication
  2. Document Center
     - Document verification
     - Legal templates
     - Compliance checks
     - Digital signing
  3. Client Portal
     - Client information
     - Document sharing
     - Status updates
     - Communication tools

### Valuer Dashboard
- **URL**: `/dashboard/valuer`
- **Features**:
  1. Valuation Management
     - Assignment queue
     - Property details
     - Market data
     - Report generation
  2. Document Center
     - Property documents
     - Market reports
     - Templates
     - Historical data
  3. Client Portal
     - Client information
     - Report sharing
     - Communication tools
     - Payment tracking

### Admin Dashboard
- **URL**: `/dashboard/admin`
- **Features**:
  1. User Management
     - User profiles
     - Role management
     - Access control
     - Activity logs
  2. System Configuration
     - Site settings
     - Email templates
     - Notification rules
     - Integration settings
  3. Analytics & Reporting
     - Usage statistics
     - Performance metrics
     - Error tracking
     - Audit logs

## Component Architecture

### Shared Components
1. **Navigation**
   - Language switcher
   - Progress indicator
   - Breadcrumbs
   - User menu
   - Role switcher

2. **Forms**
   - Input fields
   - Select dropdowns
   - File upload
   - Date picker
   - Address input

3. **Feedback**
   - Progress indicators
   - Success messages
   - Error handling
   - Loading states

4. **Content**
   - Rich text editor
   - Image gallery
   - Document viewer
   - Calculator

## State Management

### Global State
- User authentication
- Language preference
- Form progress
- Document status
- Role permissions

### Local State
- Form data
- UI preferences
- Temporary storage
- Session data

## Routing Structure

```
/                           # Marketing landing
/learn                      # Educational content
/assessment                 # Initial assessment
/auth                       # Authentication
/dashboard                  # Main dashboard
/onboarding                 # Guided tour
  /seller                   # Seller onboarding
  /family-supporter        # Family supporter onboarding
  /fund-buyer              # Fund buyer onboarding
  /conveyancer             # Conveyancer onboarding
  /valuer                  # Valuer onboarding
/dashboard/seller          # Seller dashboard
/dashboard/family-supporter # Family supporter dashboard
/dashboard/fund-buyer      # Fund buyer dashboard
/dashboard/conveyancer     # Conveyancer dashboard
/dashboard/valuer          # Valuer dashboard
/dashboard/admin           # Admin dashboard
```

## User Interface Guidelines

### Design System
- Color palette
- Typography
- Spacing
- Components
- Icons

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus management

## Data Flow

### Form Data
1. User input
2. Local validation
3. API submission
4. State update
5. UI feedback

### Document Flow
1. Upload initiation
2. Progress tracking
3. Server processing
4. Status update
5. Preview generation

### Authentication Flow
1. Email input
2. Magic link generation
3. Email delivery
4. Link verification
5. Session creation

## Error Handling

### User Errors
- Form validation
- File upload limits
- Network issues
- Session expiry

### System Errors
- API failures
- Processing errors
- Database issues
- Service outages

## Analytics Events

### User Actions
- Page views
- Form submissions
- Document uploads
- Offer interactions
- Contract signing
- Role-specific actions

### System Events
- Error tracking
- Performance metrics
- User engagement
- Conversion tracking
- Role-based analytics 