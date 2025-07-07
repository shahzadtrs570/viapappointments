# Srenova: Project Requirements Document

## Overview
Srenova is a digital platform for viager property sales across European markets, connecting elderly property owners with investors. This document outlines the technical requirements for the initial prototype phase.

## Technical Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **UI Library**: React with Tailwind CSS and shadcn/ui components
- **State Management**: React Context API
- **Internationalization**: i18next
- **Authentication**: Magic Link (existing implementation)
- **Form Management**: React Hook Form with Zod validation

### Backend (Prototype Phase)
- **Framework**: Next.js API Routes (for prototyping)
- **Database**: PostgreSQL with Prisma ORM
- **File Storage**: Local storage (prototype phase)
- **Email Service**: Existing magic link implementation

## Project Structure

```
estate-flex/
├── apps/
│   ├── marketing/        # Marketing website
│   └── dashboard/        # Main application
├── packages/
│   ├── ui/              # Shared UI components
│   ├── config/          # Shared configuration
│   └── types/           # Shared TypeScript types
└── prisma/              # Database schema and migrations
```

## Phase 1: Marketing Website

### Features
1. Multi-language landing page (EN, FR, IT)
2. Educational content about viager
3. Initial assessment questionnaire
4. Contact form
5. Language switcher

### User Flow
1. User arrives at marketing site
2. Selects language
3. Views educational content
4. Starts assessment questionnaire
5. Completes contact form
6. Receives magic link for dashboard access

## Phase 2: Dashboard Application

### Features
1. Multi-language support
2. Guided tour questionnaire
3. Property information collection
4. Document upload
5. Offer review
6. Contract management
7. Buy Box portfolio management

### User Flow (Seller)
1. Authenticates via magic link
2. Completes guided tour questionnaire
3. Provides property information
4. Uploads required documents
5. Reviews and accepts offer
6. Signs contract digitally

### User Flow (Fund Buyer)
1. Authenticates via magic link
2. Browses available properties
3. Reviews pre-assembled Buy Boxes created by admins
4. Creates custom Buy Boxes by selecting multiple properties
5. Makes offers on individual properties or Buy Boxes
6. Reviews and signs contracts
7. Manages portfolio of acquired properties and Buy Boxes

## Data Models

### Key Entities (from schema)
- User
- SellerProfile
- Property
- Offer
- Contract
- Document
- BuyBox
- BuyBoxProperty
- BuyBoxOffer
- BuyBoxContract

## UI/UX Requirements

### Accessibility
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- High contrast mode

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop enhancement

### Language Support
- English (default)
- French
- Italian
- RTL support for future expansion

## Security Requirements

### Authentication
- Magic link only
- Session management
- Secure document handling

### Data Protection
- GDPR compliance
- Data encryption
- Secure file storage

## Performance Requirements

### Frontend
- First contentful paint < 1.5s
- Time to interactive < 3.5s
- Core Web Vitals compliance

### Backend
- API response time < 200ms
- 99.9% uptime
- Scalable architecture

## Development Guidelines

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Husky pre-commit hooks

### Testing
- Unit tests for components
- Integration tests for flows
- E2E tests for critical paths

### Documentation
- Component documentation
- API documentation
- User guides

## Deployment Strategy

### Environments
- Development
- Staging
- Production

### CI/CD
- Automated testing
- Build verification
- Deployment automation

## Monitoring and Analytics

### Metrics
- User engagement
- Conversion rates
- Error tracking
- Performance monitoring

## Next Steps

1. Set up project structure
2. Implement marketing website
3. Create dashboard application
4. Develop guided tour questionnaire
5. Implement document upload
6. Add offer management
7. Create contract workflow
8. Add analytics and monitoring 