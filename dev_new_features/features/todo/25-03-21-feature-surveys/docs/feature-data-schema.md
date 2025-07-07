# Survey Feature Data Schema

## Database Schema Overview

This document outlines the database schema for the survey feature, with a focus on the Prisma schema changes needed to support survey functionality and integration with the lead management system.

## Prisma Schema Additions

The following additions to the existing Prisma schema are required to implement the survey feature:

```prisma
// Survey definition model
model Survey {
  id             String   @id @default(cuid())
  title          String
  description    String?
  status         SurveyStatus @default(DRAFT)
  surveyJson     Json     // SurveyJS schema definition
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  createdBy      String?  // User ID reference
  isArchived     Boolean  @default(false)
  
  // Configuration options
  redirectUrl    String?  // URL to redirect to after completion
  thankYouMessage String?  // Message to show after completion
  primaryColor   String?  // Brand color for survey
  isPublic       Boolean  @default(false) // Whether survey is publicly accessible

  // Relationships
  responses      SurveyResponse[]
  surveyLeadConnections SurveyLeadConnection[]

  @@index([status])
  @@index([createdAt])
  @@index([isArchived])
}

// Survey status enum
enum SurveyStatus {
  DRAFT
  PUBLISHED
  CLOSED
}

// Survey response model - stores individual response submissions
model SurveyResponse {
  id             String   @id @default(cuid())
  surveyId       String
  responseJson   Json     // Stores the actual response data
  startedAt      DateTime @default(now())
  completedAt    DateTime?
  isCompleted    Boolean  @default(false)
  userId         String?  // Optional User ID if authenticated
  leadId         String?  // Optional Lead ID if connected to a lead
  ipAddress      String?  // For tracking/analytics
  userAgent      String?  // Browser/device info

  // Relationships
  survey         Survey   @relation(fields: [surveyId], references: [id], onDelete: Cascade)
  lead           Lead?    @relation(fields: [leadId], references: [id], onDelete: SetNull)

  @@index([surveyId])
  @@index([leadId])
  @@index([completedAt])
  @@index([isCompleted])
}

// Connects surveys to leads - defines which leads should receive which surveys
model SurveyLeadConnection {
  id             String   @id @default(cuid())
  surveyId       String
  leadTypeFilter String?  // Filter for lead types eligible for this survey
  isActive       Boolean  @default(true)
  priority       Int      @default(0) // Higher number = higher priority
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  // Connection settings
  triggerType    SurveyTriggerType @default(IMMEDIATE)
  delayMinutes   Int?     // For DELAYED trigger type
  
  // Relationships
  survey         Survey   @relation(fields: [surveyId], references: [id], onDelete: Cascade)

  @@index([surveyId])
  @@index([isActive])
  @@index([priority])
  @@index([leadTypeFilter])
}

// Trigger type enum - when to present the survey
enum SurveyTriggerType {
  IMMEDIATE      // Show immediately after lead submission
  DELAYED        // Show after a delay
  MANUAL         // Require manual triggering
}
```

## Updates to Existing Models

The Lead model needs to be updated to support the connection to surveys:

```prisma
model Lead {
  id         String     @id @default(cuid())
  email      String
  name       String?
  phone      String?
  company    String?
  message    String?    // Free-form message
  leadType   String     // Flexible string for lead type
  status     LeadStatus @default(NEW)
  source     String?    // Where the lead came from
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  metadata   Json?      // Additional fields based on lead type
  assignedTo String?    // User ID for assigned team member

  // Add new relationship to survey responses
  surveyResponses SurveyResponse[]
  
  // Add fields to track survey status
  lastSurveyOfferedAt DateTime?
  lastSurveyCompletedAt DateTime?

  @@index([leadType])
  @@index([status])
  @@index([createdAt])
  @@index([assignedTo])
  @@index([email])
}
```

## Schema Rationale

1. **Survey Model**:
   - Stores the survey structure as a JSON field following SurveyJS schema format
   - Includes metadata like title, description, status for management
   - Contains configuration options for customizing survey appearance and behavior

2. **SurveyResponse Model**:
   - Stores individual response submissions
   - Links responses to surveys and optionally to leads and users
   - Tracks completion status and timestamps for analytics

3. **SurveyLeadConnection Model**:
   - Defines rules for when leads should receive which surveys
   - Supports different trigger types for flexible survey delivery
   - Allows filtering by lead type to target specific segments

4. **Lead Model Updates**:
   - Adds relationship to survey responses for bidirectional querying
   - Adds fields to track when surveys were offered and completed

## Data Flow

1. Admin creates a survey with the SurveyJS Creator, saving it to the Survey model
2. Admin configures SurveyLeadConnection to define when and to which leads the survey should be offered
3. When a lead form is submitted, the system checks SurveyLeadConnection rules
4. If rules match, the lead is presented with the appropriate survey
5. Survey responses are stored in the SurveyResponse model, linked to both the Survey and Lead
6. Admins can view survey responses linked to leads for analysis

## Implementation Considerations

1. **JSON Storage**:
   - The `surveyJson` field stores the complete SurveyJS schema
   - The `responseJson` field stores the submitted answers
   - These JSON fields allow for flexible question types without schema changes

2. **Performance**:
   - Indexes on key fields optimize querying
   - Consider implementing caching for frequently accessed surveys

3. **Migrations**:
   - Implement these changes through Prisma migrations
   - Ensure all related code is updated to work with the new schema 