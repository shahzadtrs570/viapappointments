# Survey API

This module provides API endpoints for creating, managing, and collecting responses from surveys using tRPC.

## Key Features

- Create, read, update, and delete surveys
- Manage survey status (draft, published, closed) 
- Handle survey responses
- Public access for published surveys
- Admin endpoints for comprehensive survey management

## Schema Overview

The survey feature uses the following main models:

```prisma
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
}

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
}
```

## API Endpoints

### Survey Management

- `survey.create` - Create a new survey
- `survey.list` - Get all surveys for the current user
- `survey.get` - Get a specific survey by ID
- `survey.update` - Update a survey
- `survey.delete` - Delete a survey
- `survey.archive` - Archive a survey (soft delete)
- `survey.updateStatus` - Update a survey's status

### Survey Responses

- `survey.responses.create` - Submit a response to a survey
- `survey.responses.list` - Get all responses for a survey

### Public Endpoints

- `survey.public.get` - Get a specific public survey
- `survey.public.list` - Get all public surveys
- `survey.public.responses.create` - Submit a response to a public survey

### Admin Endpoints

- `survey.admin.getAll` - Get all surveys (admin only)

## Usage Examples

### Create a Survey

```typescript
const newSurvey = await api.survey.create.mutate({
  title: "Customer Feedback",
  description: "Help us improve our services",
  surveyJson: {
    pages: [
      {
        name: "page1",
        elements: [
          {
            type: "text",
            name: "name",
            title: "Your Name",
          },
          {
            type: "rating",
            name: "satisfaction",
            title: "How satisfied are you with our product?",
            rateMin: 1,
            rateMax: 5,
          }
        ]
      }
    ]
  },
  isPublic: true,
  thankYouMessage: "Thank you for your feedback!",
});
```

### Get User's Surveys

```typescript
const { surveys } = await api.survey.list.query({
  includePublic: true,
  status: "PUBLISHED",
});
```

### Submit a Survey Response

```typescript
const response = await api.survey.responses.create.mutate({
  surveyId: "survey123",
  responseJson: {
    name: "John Doe",
    satisfaction: 4,
  },
  isCompleted: true,
});
```

## Integration with Leads

The survey system integrates with the lead management system through the `SurveyLeadConnection` model, allowing surveys to be presented to leads based on configurable rules. 