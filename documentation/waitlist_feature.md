# Waitlist Feature - Project Requirements Document

## Overview
This document outlines the requirements for implementing a waitlist feature on the NextJet homepage. The waitlist will allow potential users to express interest in upcoming product releases and enable the business to gauge interest and communicate with prospects.

## Business Objectives
- Capture potential user information before product launch
- Support multiple waitlist types (e.g., standard product, enterprise)
- Build a pre-launch user base
- Enable future marketing communications
- Gauge interest in different product tiers

## Feature Requirements

### Core Functionality
1. **Waitlist Form Component**
   - Email field (required)
   - Name field (required)
   - Waitlist type selection (dropdown)
   - Submit button
   - Success/error messaging

2. **Data Storage**
   - Store submissions in a new database table
   - Prevent duplicate email submissions
   - Track submission timestamp

3. **Admin Features**
   - View waitlist entries in admin dashboard
   - Export waitlist data
   - Filter by waitlist type
   - Basic analytics (total signups, signups per waitlist type)

4. **Notification System**
   - Email confirmation to users who join the waitlist
   - Notify administrators of new waitlist signups

## Technical Specifications

### Database Schema
Create a new `WaitlistEntry` model in the Prisma schema:

```prisma
model WaitlistEntry {
  id           String      @id @default(cuid())
  email        String      @unique
  name         String
  waitlistType String      // e.g., "standard", "enterprise", "beta"
  status       String      @default("active") // For future use: "active", "contacted", "converted"
  source       String?     // Optional: track where the signup came from
  referralCode String?     // Optional: for referral tracking
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
  metadata     Json?       // Flexible field for additional data
  notes        String?     // Admin notes

  @@index([waitlistType])
  @@index([createdAt])
  @@index([status])
}
```

### API Endpoints
1. **Create Waitlist Entry**
   - Endpoint: `POST /api/waitlist`
   - Payload: `{ email, name, waitlistType, source?, referralCode? }`
   - Response: Success/error message

2. **Admin: Get Waitlist Entries**
   - Endpoint: `GET /api/admin/waitlist`
   - Query params: `{ waitlistType?, status?, page, limit }`
   - Response: Paginated list of waitlist entries

3. **Admin: Export Waitlist**
   - Endpoint: `GET /api/admin/waitlist/export`
   - Query params: `{ waitlistType?, status?, format }`
   - Response: CSV/JSON file of waitlist entries

### Frontend Components
1. **WaitlistForm**
   - Form with input fields and validation
   - Success/error states
   - Integration with API

2. **Admin: WaitlistTable**
   - Display waitlist entries with filtering and pagination
   - Export functionality
   - Quick actions (status change, notes)

## Additional Considerations

### User Experience
- Clear messaging about what users are signing up for
- Form validation with helpful error messages
- Successful submission feedback
- Mobile-responsive design

### Privacy & Compliance
- GDPR compliant data collection
- Clear privacy notice/link on the form
- Checkbox for marketing consent (optional but recommended)
- Data retention policy

### Marketing & Analytics
- UTM parameter tracking
- Integration with analytics tools
- A/B testing capability for form variations
- Referral system to encourage sharing

### Email Integration
- Automated welcome email using existing email templates
- Template for future product announcements

### Security
- Rate limiting for form submissions
- Honeypot fields to prevent spam
- reCAPTCHA integration (optional)

## Future Enhancements
- Waitlist position tracking
- Invitation system for controlled access
- Referral bonus system
- Social sharing integration
- User preference collection (optional additional fields)
- Double opt-in email verification