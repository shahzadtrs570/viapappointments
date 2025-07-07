---
title: NextJet Documentation
related_docs:
  - path: documentation/project/project-requirements-document.md
  - path: documentation/project/implementation-plan.md
  - path: documentation/general/tech_stack_document.md
---

## Related Documents
- [Project Requirements Document](../project/project-requirements-document.md)
- [Implementation Plan](../project/implementation-plan.md)
- [Tech Stack Documentation](./tech_stack_document.md)

# NextJet Documentation

## Table of Contents
- [Introduction](#introduction)
  - [Overview](#overview)
  - [Core Principles](#core-principles)
  - [Features Overview](#features-overview)
- [Getting Started](#getting-started)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
  - [Tech Stack](#tech-stack)
- [Architecture](#architecture)
  - [Monorepo Structure](#monorepo-structure)
  - [Project Organization](#project-organization)
  - [Database Schema](#database-schema)
  - [Entity Relationships](#entity-relationships)
- [Core Features](#core-features)
  - [Authentication](#authentication)
  - [Authorization](#authorization)
  - [Payments Integration](#payments-integration)
  - [Email Integration](#email-integration)
  - [User Management](#user-management)
  - [Analytics](#analytics)
- [Development Guide](#development-guide)
  - [API Development](#api-development)
  - [Component Development](#component-development)
  - [Content Management](#content-management)
  - [Database Migrations](#database-migrations)
  - [Entitlements System](#entitlements-system)
- [Deployment](#deployment)
  - [Database Setup](#database-setup)
  - [Domain Configuration](#domain-configuration)
  - [Hosting Setup](#hosting-setup)
  - [Environment Variables](#environment-variables)
- [Integrations](#integrations)
  - [Authentication Providers](#authentication-providers)
  - [Payment Providers](#payment-providers)
  - [Email Services](#email-services)
  - [Analytics Services](#analytics-services)
  - [Support Tools](#support-tools)
- [Configuration](#configuration)
  - [Environment Variables](#environment-variables-1)
  - [Feature Flags](#feature-flags)
  - [Theme Customization](#theme-customization)
  - [Subscription Plans](#subscription-plans)

## Core Package Documentation

NextJet includes several specialized packages with detailed documentation:

| Package | Description | Documentation Link |
|---------|-------------|-------------------|
| AI API Calls | Track AI API usage, costs, and metrics | [AI API Calls Guide](../template/guide/ai_api_calls.md) |
| AI Audio | Text-to-speech functionality | [AI Audio Guide](../template/guide/ai_audio.md) |
| AI LLM | Large Language Model integrations | [AI LLM Guide](../template/guide/ai_llm.md) |
| Email | Multi-provider email system | [Email Guide](../template/guide/email.md) |
| File Storage | Unified file storage interface | [File Storage Guide](../template/guide/file_storage.md) |
| Fonts | Font management system | [Fonts Guide](../template/guide/fonts.md) |
| Logger | Structured logging system | [Logger Guide](../template/guide/logger.md) |
| Queue | Background job processing | [Queue Guide](../template/guide/queue.md) |

## Introduction

### Overview
NextJet is a Next.js starter kit designed to accelerate the development of SaaS applications. It provides a comprehensive foundation with all essential features needed to launch a successful SaaS product.

### Core Principles
- Scalability
- Clean code
- Best practices
- Customization
- Developer experience
- Speed of development
- Teamwork

### Features Overview
- **Auth**: Authentication, Authorization, Google & Github OAuth, Magic Link Sign In
- **User Management**: Customizable Onboarding Flow, User Dashboard, Super Admin Dashboard
- **Integrations**: Stripe Payments, Lemon Squeezy Payments, Support Chat Widget, Feedback Board, Email Integration, Analytics
- **Design & UI**: ShadCN UI Components, Fully Responsive UI, Light/Dark Mode
- **SEO**: SEO Optimized, Automatic Sitemap Generation, Open Graph & Twitter Tags
- **Content & Documentation**: Blog, Documentation, Legal Pages
- **Templates**: Email Templates, Marketing Page Template, Dashboard Page Template

## Getting Started

### Requirements
- Node.js 18.17 or later
- Pnpm
- Docker (optional)
- Visual Studio Code (recommended)
- git-cz (optional)

Recommended VS Code Extensions:
- ESLint
- Prettier ESLint
- Error Lens
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prisma

### Installation

1. Clone the repository:
```bash
git clone https://github.com/saasgeeks/Nextjet
```

2. Update the upstream:
```bash
git remote rm origin
git remote add upstream https://github.com/saasgeeks/Nextjet
git remote add origin your-repo-url
```

### Running the Project

1. Copy the .env.example file to .env
2. Start the local database (optional):
```bash
docker-compose up -d
```

3. Sync the database:
```bash
pnpm db:push
```

4. Run the development servers:
```bash
pnpm dev
```

The following services will be available:
- Dashboard app: http://localhost:3000
- Marketing site: http://localhost:3001
- Email preview server: http://localhost:3333
- Database admin panel: http://localhost:5555

### Tech Stack

#### Core Technologies
- Next.js for server-side rendering and routing
- React for building user interfaces
- TypeScript for static typing
- Turborepo for monorepo management

#### Frontend
- ShadCN for UI components
- Tanstack Query for data fetching
- Zod for data validation
- Tailwind CSS for styling

#### Backend
- tRPC for type-safe APIs
- Prisma for database ORM
- Any database compatible with Prisma

#### Integrations
- Auth.js for authentication
- Stripe or Lemon Squeezy for payments
- Resend for emails
- Tinybird for analytics

## Architecture

### Monorepo Structure
NextJet uses a Turborepo monorepo structure, organizing the project into apps and packages:

#### Apps Directory
- **marketing**: Public facing marketing site, including blog, docs and legal pages
- **dashboard**: Main application for the SaaS product

#### Packages Directory
- **api**: tRPC API
- **auth**: Authentication logic
- **configs**: Shared configurations (ESLint, Prettier, Tailwind, TypeScript)
- **crisp**: Crisp chat support widget integration
- **db**: Prisma database schema and migrations
- **email**: Email templates and provider
- **payments**: Payment provider integrations (Stripe, Lemon Squeezy)
- **ui**: Shared UI components (ShadCN and custom)
- **utils**: Shared constants and utility functions
- **validations**: Shared Zod validations

### Project Organization
NextJet follows a feature-based folder structure within each application:

```
app/
  ├── (dashboard)/
  │   ├── admin/
  │   │   ├── _components/
  │   │   ├── _contexts/
  │   │   ├── _hooks/
  │   │   └── _types/
  │   └── billing/
  │       ├── _components/
  │       ├── _contexts/
  │       ├── _hooks/
  │       └── _types/
```

### Database Schema
The database schema is defined using Prisma in `packages/db/prisma/schema.prisma`. Key models include:

#### User Model
```prisma
model User {
  id            String         @id @default(cuid())
  name          String?
  email         String?        @unique
  role          Role          @default(USER)
  status        UserStatus    @default(ACTIVE)
  hasOnboarded  Boolean       @default(false)
  accounts      Account[]
  sessions      Session[]
  subscription  Subscription?
  ban           Ban?
}
```

#### Subscription Model
```prisma
model Subscription {
  id              String   @id @default(cuid())
  userId          String   @unique
  status          String
  interval        String?
  currentPeriodEnd DateTime?
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Core Features

### Authentication
Authentication is handled through Auth.js with multiple providers:

- Magic Link Sign In
- Google OAuth
- Github OAuth

Implementation example:
```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const { data: session } = useSession();
  const { data: user } = api.user.get.useQuery();

  return {
    isAuthenticated: !!session,
    user,
    isLoading: !session && !user,
  };
};
```

### Authorization
NextJet provides both Role-Based Access Control (RBAC) and Policy-Based Access Control (PBAC):

```typescript
// Example RBAC Component
<Authorization allowedRoles={[Role.ADMIN]}>
  <AdminContent />
</Authorization>

// Example PBAC Policy
export const policies = {
  'post:delete': ({ user, post }) => {
    return user.role === 'ADMIN' || post.authorId === user.id;
  }
};
```

### Payments Integration
NextJet supports both Stripe and Lemon Squeezy for payments:

#### Stripe Setup
```typescript
// Configure subscription plans
export const subscriptionPlans = {
  BASIC: {
    name: 'Basic',
    price: {
      monthly: {
        amount: 10,
        priceIds: {
          test: 'price_test_monthly',
          production: 'price_prod_monthly',
        },
      },
      yearly: {
        amount: 100,
        priceIds: {
          test: 'price_test_yearly',
          production: 'price_prod_yearly',
        },
      },
    },
  },
  // ... other plans
};
```

#### Lemon Squeezy Integration
```typescript
// Configure feature flags
export const featureFlags = {
  payments: PaymentProviderType.LemonSqueezy,
  // ... other flags
};
```

### Email Integration
Email functionality is handled through Resend with React Email templates:

```typescript
// Example email template
export const WelcomeEmail = ({ name }: { name: string }) => (
  <EmailLayout>
    <Heading>Welcome to {name}!</Heading>
    <Text>We're excited to have you on board.</Text>
    <Button href="https://app.example.com">Get Started</Button>
  </EmailLayout>
);

// Sending emails
await sendEmail({
  to: user.email,
  subject: 'Welcome!',
  template: WelcomeEmail,
  props: { name: user.name },
});
```

## Development Guide

### API Development
NextJet uses tRPC for end-to-end type-safe APIs:

```typescript
// Example tRPC router
export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
    });
  }),
  
  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
    }),
});
```

### Component Development
NextJet uses ShadCN UI components and custom components:

```typescript
// Example custom component
export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";
```

### Database Migrations
Managing database schema changes:

```bash
# Create a new migration
pnpm db:migrate

# Generate Prisma client
pnpm db:generate

# Push schema changes
pnpm db:push

# Deploy migrations
pnpm db:deploy

# Reset database
pnpm db:reset
```

## Deployment

### Database Setup
1. Create a new project in your database provider (e.g., Neon)
2. Get the connection string
3. Update the `DATABASE_URL` in production environment
4. Run migrations:
```bash
pnpm db:deploy
```

### Domain Configuration
1. Purchase a domain name
2. Configure DNS records:
   - Marketing site: `your-domain.com`
   - Dashboard: `app.your-domain.com`
3. Set up email sending domain with Resend

### Hosting Setup
NextJet can be deployed to various platforms:

#### Vercel Deployment
1. Import repository
2. Configure environment variables
3. Set up custom domains
4. Deploy both marketing and dashboard apps

```bash
# Example deploy command
vercel --prod
```

## Integrations

### Authentication Providers
Configuration steps for auth providers:

#### Google OAuth
1. Create new project in Google Cloud Console
2. Configure OAuth consent screen
3. Create credentials
4. Add authorized redirect URIs
5. Set environment variables:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

#### Github OAuth
1. Create new Github App
2. Configure callback URLs
3. Set permissions
4. Set environment variables:
```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
```

### Payment Providers

#### Stripe Configuration
1. Set up webhook endpoints
2. Configure customer portal
3. Create products and prices
4. Set environment variables:
```env
STRIPE_SECRET_KEY=your_secret_key
STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_WEBHOOK_SECRET=your_webhook_secret
```

#### Lemon Squeezy Setup
1. Create store and products
2. Configure webhooks
3. Set up customer portal
4. Set environment variables:
```env
LEMONSQUEEZY_API_KEY=your_api_key
LEMONSQUEEZY_STORE_ID=your_store_id
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret
```

## Configuration

### Environment Variables
Key environment variables needed:

```env
# Auth
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL=your_database_url

# Email
RESEND_API_KEY=your_resend_key

# Analytics
NEXT_PUBLIC_TINYBIRD_API_KEY=your_tinybird_key

# Feature Flags
NEXT_PUBLIC_FLAGS={"payments":"stripe"}
```

### Feature Flags
Configure features in `packages/utils/src/constants/featureFlags.ts`:

```typescript
export const featureFlags: FeatureFlags = {
  payments: PaymentProviderType.Stripe,
  chatSupportWidget: true,
  feedbackWidget: true,
  toast: true,
  onboardingFlow: true,
  blog: true,
  docs: true,
  themeToggle: true,
};
```

### Theme Customization
Customize theme in `packages/configs/tailwind-config/styles.css`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  /* ... other variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... other dark mode variables */
}
```

### Subscription Plans
Configure plans in `packages/utils/src/constants/subscriptionPlans.ts`:

```typescript
export const subscriptionPlans = {
  basic: {
    name: 'Basic',
    tagline: 'For individuals and small teams',
    price: {
      monthly: 10,
      yearly: 100,
    },
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3',
    ],
  },
  // ... other plans
};
```

## Content Management

### Blog System
NextJet uses MDX for blog content management:

```markdown
---
title: Your Blog Title
description: Blog description
publishedAt: 2024-01-29
updatedAt: 2024-01-29
coverImage: /images/blog/cover.jpg
authorName: John Doe
keywords: [nextjs, saas]
published: true
---

Your blog content here...
```

Blog configuration:
- Located in `apps/marketing/src/app/blog`
- Author configurations in `_config/authors.ts`
- Automatic SEO optimization
- Social media preview cards

### Documentation System
Documentation is built using Fumadocs:

```markdown
---
title: Documentation Page
description: Page description
updatedAt: 2024-01-29
---

Documentation content with components:
<Accordion>
  Content here
</Accordion>
```

Features:
- MDX support
- Built-in components
- Automatic navigation
- Search functionality

### Legal Pages
Pre-configured legal pages:
- Terms of Service
- Privacy Policy
- License Agreement

## Analytics Integration

### Tinybird Setup
1. Create workspaces for marketing and dashboard
2. Configure environment variables:
```env
NEXT_PUBLIC_TINYBIRD_SRC=your_src
NEXT_PUBLIC_TINYBIRD_DATA_HOST=your_host
NEXT_PUBLIC_TINYBIRD_ANALYTICS_TRACKER_TOKEN=your_token
```

### Analytics Dashboard
- Real-time data visualization
- User behavior tracking
- Custom event tracking
- Performance metrics

## Support Tools

### Crisp Chat Widget
Setup steps:
1. Get Website ID from Crisp dashboard
2. Configure environment variable:
```env
NEXT_PUBLIC_CRISP_WEBSITE_ID=your_website_id
```

### Customer Feedback (Canny)
1. Complete Canny onboarding
2. Set board token:
```env
NEXT_PUBLIC_CANNY_BOARD_TOKEN=your_board_token
```

Features:
- Feature request management
- User feedback collection
- Voting system
- Status updates

## Entitlements System

### Feature Access Control
```typescript
// entitlements.ts
export const entitlements = {
  BASIC: {
    features: ['feature1', 'feature2'],
    limits: {
      requests: 100,
      storage: 5
    }
  },
  // ... other plans
};

// Usage
ensureFeatureAccess({
  subscriptionData,
  featureId: 'feature1'
});
```

### Usage Limits
```typescript
ensureUsageWithinLimit({
  subscriptionData,
  featureId: 'requests',
  usageCount: currentCount,
  usageIncrement: 1
});
```

## SEO Optimization

### Meta Tags
```typescript
// Default meta tags
export const defaultMetadata = {
  title: 'Your App',
  description: 'App description',
  openGraph: {
    type: 'website',
    title: 'Your App',
    description: 'App description',
    images: ['/og-image.png']
  }
};
```

### Sitemap Generation
Automatic sitemap generation for:
- Marketing pages
- Blog posts
- Documentation pages
- Legal pages

### Robots.txt
```txt
User-agent: *
Allow: /
Sitemap: https://your-domain.com/sitemap.xml
```

## Super Admin Configuration

### Setting Up Admin Access
1. Run development servers:
```bash
pnpm dev
```

2. Create an account at `http://localhost:3000/signup`

3. Access Prisma Studio at `http://localhost:5555`

4. Change user role:
   - Find your user in the User table
   - Change role to `ADMIN`
   - Save changes
   - Refresh your app page

### Admin Features
- User management
- Subscription oversight
- Analytics dashboard
- User impersonation
- System settings

## Development Workflows

### Import Paths
NextJet uses absolute imports for better organization:

```typescript
// Root imports
import { something } from '~/package-name';

// Src directory imports
import { Component } from '@/components';

// Package imports
import { api } from '@package/api';
```

### File Structure
```
project/
├── apps/
│   ├── marketing/
│   │   ├── src/
│   │   │   ├── app/            # Next.js app router
│   │   │   ├── components/     # Shared components
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── lib/           # Utilities and configurations
│   │   │   └── styles/        # Global styles
│   │   └── package.json
│   └── marketing/              # Marketing website
│       ├── src/
│       │   ├── app/           # Next.js app router
│       │   ├── content/       # MDX content
│       │   └── components/    # Marketing components
│       └── package.json
├── packages/
│   ├── api/                   # tRPC API definitions
│   ├── auth/                  # Authentication logic
│   ├── config/                # Shared configurations
│   ├── db/                    # Database schema and migrations
│   ├── emails/               # Email templates
│   ├── ui/                   # Shared UI components
│   └── utils/                # Shared utilities
└── package.json
```

### Styling and Typography

#### Typography Components
```typescript
// Example usage
<Heading size="h1">Main Title</Heading>
<Text size="lg">Large text content</Text>
<Paragraph>Regular paragraph text</Paragraph>
```

#### Theme Configuration
```typescript
// Theme configuration
const typography = {
  h1: 'text-4xl font-bold',
  h2: 'text-3xl font-semibold',
  h3: 'text-2xl font-medium',
  // ... other styles
};
```

### Mobile Responsiveness
Built-in responsive design utilities:
```typescript
// Responsive component example
<div className="
  w-full           // Mobile (default)
  md:w-2/3        // Tablet
  lg:w-1/2        // Desktop
  xl:w-1/3        // Large screens
">
  Content here
</div>
```

### Testing
NextJet supports various testing approaches:
```bash
# Run all tests
pnpm test

# Run with watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage
```

## Additional Database Models

### Complete Schema Overview
![NextJet Prisma Database Entity Relationship Diagram](/images/docs/prisma-erd.svg)

#### Ban Model
```prisma
model Ban {
  id            String    @id @default(cuid())
  userId        String    @unique
  bannedBy      String
  reason        String
  bannedAt      DateTime  @default(now())
  unbannedAt    DateTime?
  unbannedBy    String?
  user          User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### Account Model
```prisma
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

#### Session Model
```prisma
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

#### VerificationToken Model
```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}
```

## Git Workflow

### Commit Message Format
Using git-cz:
```bash
git cz
# or
pnpm commit
```

Without git-cz, follow these formats:
- ❌ Not valid: "fixed bug"
- ✅ Valid: "fix: corrected authentication flow"
- ✅ Valid: "feat: added user profile page"

### Getting Updates
To receive updates from NextJet repository:
```bash
# Add upstream if not already added
git remote add upstream https://github.com/saasgeeks/Nextjet

# Pull latest changes
git pull upstream main
```

## Production Deployment

### Complete Environment Variables
```env
# Auth
NEXTAUTH_SECRET=your_generated_secret
NEXTAUTH_URL=https://app.your-domain.com

# Database
DATABASE_URL=your_production_db_url

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Email
RESEND_API_KEY=your_resend_api_key
RESEND_EMAIL_DOMAIN=your_custom_email_domain

# Payments
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
# or
LEMONSQUEEZY_API_KEY=your_lemonsqueezy_api_key
LEMONSQUEEZY_STORE_ID=your_store_id
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret

# Analytics
NEXT_PUBLIC_TINYBIRD_API_KEY=your_tinybird_key
NEXT_PUBLIC_TINYBIRD_DATA_HOST=your_tinybird_host

# Support
NEXT_PUBLIC_CRISP_WEBSITE_ID=your_crisp_id
NEXT_PUBLIC_CANNY_BOARD_TOKEN=your_canny_token
```

### Deployment Options

#### Vercel (Recommended)
1. Import repository
2. Set root directory for each app:
   - Marketing: `apps/marketing`
   - Dashboard: `apps/dashboard`
3. Override build commands:
   ```bash
   cd ../.. && pnpm turbo build --filter=marketing...
   # or
   cd ../.. && pnpm turbo build --filter=dashboard...
   ```
4. Set Node.js version to 20.x
5. Add environment variables
6. Deploy

#### Netlify
1. Import repository
2. Configure build settings:
   - Base directory: `apps/marketing` or `apps/dashboard`
   - Build command: `cd ../.. && pnpm turbo build --filter=<app>...`
   - Publish directory: `.next`
3. Add environment variables
4. Deploy

#### AWS Amplify
1. Connect repository
2. Configure build settings in `amplify.yml`
3. Set up environment variables
4. Deploy

## Advanced Import Examples

### Package Imports
```typescript
// API imports
import { api } from '@package/api';
import { createTRPCRouter } from '../../../trpc';

// UI imports
import { Button } from '@package/ui/button';
import { Card } from '@package/ui/card';

// Utility imports
import { formatDate } from '@package/utils';
import { subscriptionPlans } from '@package/utils/constants';

// Database imports
import { db } from '@package/db';
```

### VS Code Setup

#### Recommended Extensions
1. ESLint
   - Auto-fix on save
   - Real-time linting
   
2. Prettier ESLint
   - Format on save
   - Respects ESLint rules
   
3. Error Lens
   - Inline error display
   - Quick fix suggestions
   
4. Tailwind CSS IntelliSense
   - Class autocompletion
   - Hover previews
   
5. Prisma
   - Schema syntax highlighting
   - Format on save
   - Go to definition

#### Workspace Settings
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## License Information

### Personal License
- Build unlimited projects as an individual
- Free to modify code as needed
- Build applications for personal or commercial use

### Team License
- Create unlimited projects
- Modify code as needed
- Build and develop applications as part of a team
- Share code with team members

### Restrictions
- No reselling as your own boilerplate
- No redistribution
- Cannot sub-license, rent, lease, or transfer rights

## Feature Flags System

### Configuration
```typescript
// packages/utils/src/constants/featureFlags.ts
export const featureFlags: FeatureFlags = {
  payments: PaymentProviderType.Stripe, // or PaymentProviderType.LemonSqueezy
  chatSupportWidget: true,
  feedbackWidget: true,
  toast: true,
  onboardingFlow: true,
  blog: true,
  docs: true,
  themeToggle: true,
};

// Usage in components
{featureFlags.chatSupportWidget && <ChatWidget />}
```

### Toggling Features
```typescript
// Toggle payment provider
export const featureFlags: FeatureFlags = {
  payments: process.env.NODE_ENV === 'development' 
    ? PaymentProviderType.Stripe 
    : PaymentProviderType.LemonSqueezy,
  // other flags...
};
```

## Database Updates & Migrations

### Migration Commands
```bash
# Create a new migration
pnpm db:migrate

# Apply pending migrations
pnpm db:deploy

# Reset database
pnpm db:reset

# Generate Prisma client
pnpm db:generate

# Push schema changes without migration
pnpm db:push

# Pull schema from database
pnpm db:pull

# Seed database
pnpm db:seed
```

### Updating Schema Steps
1. Edit schema in `packages/db/prisma/schema.prisma`
2. Generate migration:
   ```bash
   pnpm db:migrate
   ```
3. Review migration in `packages/db/prisma/migrations`
4. Apply to local database:
   ```bash
   pnpm db:deploy
   ```
5. Commit changes
6. Github Actions will automatically apply migrations to production

## Customer Feedback (Canny) Detailed Setup

### Complete Setup Steps
1. Complete Canny onboarding
2. Create feedback board
3. Set board slug to 'feedback'
4. Get board token from Canny Docs

### Board Configuration
```typescript
// Environment setup
NEXT_PUBLIC_CANNY_BOARD_TOKEN=your_board_token

// Widget configuration
const cannyConfig = {
  appID: 'your-app-id',
  boardToken: process.env.NEXT_PUBLIC_CANNY_BOARD_TOKEN,
  basePath: '/feedback',
  ssoToken: user?.cannyToken,
};
```

### Widget Customization
```typescript
// Canny widget styling
const widgetStyles = {
  border: 'none',
  background: 'var(--background)',
  height: '100vh',
};

// Implementation
<Canny 
  boardToken={process.env.NEXT_PUBLIC_CANNY_BOARD_TOKEN}
  basePath="/feedback"
  theme={isDarkMode ? 'dark' : 'light'}
  style={widgetStyles}
/>
```

### Production Setup
1. Add widget URL pointing to production:
   ```
   https://app.your-domain.com/feedback
   ```
2. Configure email notifications
3. Set up board categories
4. Customize appearance settings

## Complete Code Examples

### Full Authentication Flow
```typescript
// hooks/useAuth.ts
import { useSession } from 'next-auth/react';
import { api } from '@/lib/trpc/react';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const { data: user, isLoading: isLoadingUser } = api.user.get.useQuery(
    undefined,
    {
      enabled: !!session,
    }
  );

  return {
    isAuthenticated: !!session,
    isLoading: status === 'loading' || isLoadingUser,
    session,
    user,
    isAdmin: user?.role === 'ADMIN',
    hasSubscription: !!user?.subscription,
  };
};

// Implementation
const MyProtectedComponent = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <SignInPrompt />;
  }

  return (
    <div>
      <h1>Welcome {user.name}!</h1>
      {/* Protected content */}
    </div>
  );
};
```

### Complete tRPC Procedure Example
```typescript
// packages/api/src/routers/user/user.router.ts
import { createTRPCRouter, protectedProcedure } from '../../trpc';
import { UserService } from './service/user.service';
import { updateUserSchema } from './service/user.input';

const userService = new UserService();

export const userRouter = createTRPCRouter({
  get: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await userService.getUser(ctx.session.user.id);
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch user',
      });
    }
  }),

  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        return await userService.updateUser(ctx.session.user.id, input);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user',
        });
      }
    }),

  delete: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      return await userService.deleteUser(ctx.session.user.id);
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to delete user',
      });
    }
  }),
});

// service/user.service.ts
export class UserService {
  private repository: UserRepository;

  constructor() {
    this.repository = new UserRepository();
  }

  async getUser(userId: string) {
    return this.repository.findById(userId);
  }

  async updateUser(userId: string, data: UpdateUserInput) {
    return this.repository.update(userId, data);
  }

  async deleteUser(userId: string) {
    return this.repository.delete(userId);
  }
}

// repository/user.repository.ts
export class UserRepository {
  async findById(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });
  }

  async update(userId: string, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  async delete(userId: string) {
    return prisma.user.delete({
      where: { id: userId },
    });
  }
}
```

## Project Structure

### Complete Directory Tree
```
nextjet/
├── apps/
│   ├── dashboard/               # Main SaaS application
│   │   ├── src/
│   │   │   ├── app/            # Next.js app router
│   │   │   ├── components/     # Shared components
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── lib/           # Utilities and configurations
│   │   │   └── styles/        # Global styles
│   │   └── package.json
│   └── marketing/              # Marketing website
│       ├── src/
│       │   ├── app/           # Next.js app router
│       │   ├── content/       # MDX content
│       │   └── components/    # Marketing components
│       └── package.json
├── packages/
│   ├── api/                   # tRPC API definitions
│   ├── auth/                  # Authentication logic
│   ├── config/                # Shared configurations
│   ├── db/                    # Database schema and migrations
│   ├── emails/               # Email templates
│   ├── ui/                   # Shared UI components
│   └── utils/                # Shared utilities
└── package.json
```

## Email System

### Email Templates
Location: `packages/emails/src/templates`

```typescript
// templates/WelcomeEmail.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export const WelcomeEmail = ({
  name,
  actionUrl,
}: {
  name: string;
  actionUrl: string;
}) => (
  <Html>
    <Head />
    <Preview>Welcome to NextJet, {name}!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>Hi {name},</Text>
        <Text style={paragraph}>
          Welcome to NextJet! We're excited to have you on board.
        </Text>
        <Section style={btnContainer}>
          <Button style={button} href={actionUrl}>
            Get Started
          </Button>
        </Section>
      </Container>
    </Body>
  </Html>
);
```

### Email Service Setup
```typescript
// lib/sendEmail.ts
import { Resend } from 'resend';
import { WelcomeEmail } from '../templates/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({
  to,
  subject,
  template: Template,
  props,
}: SendEmailParams) => {
  try {
    await resend.emails.send({
      from: `NextJet <${process.env.RESEND_EMAIL_DOMAIN}>`,
      to,
      subject,
      react: <Template {...props} />,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};
```

### Production Email Domain
1. Add domain in Resend dashboard
2. Configure DNS records:
   ```
   Type  | Name         | Value
   TXT   | @           | resend-domain-verification=...
   CNAME | email       |...
   ```
3. Update environment variable:
   ```env
   RESEND_EMAIL_DOMAIN=notifications@your-domain.com
   ```

## Frontend Development

### React Component Patterns

#### Component Structure
```typescript
// Good component structure
import { cn } from '@package/utils';
import { Button } from '@package/ui/button';
import { useCallback } from 'react';

interface CardProps {
  title: string;
  description: string;
  className?: string;
  onAction?: () => void;
}

export const Card = ({
  title,
  description,
  className,
  onAction,
}: CardProps) => {
  const handleAction = useCallback(() => {
    if (onAction) onAction();
  }, [onAction]);
  
  return (
    <div className={cn('rounded-lg border p-4', className)}>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
      <Button 
        onClick={handleAction}
        className="mt-4"
      >
        Take Action
      </Button>
    </div>
  );
};
```

### ShadCN Components
```typescript
// Example of ShadCN component usage
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@package/ui/card';
import { Button } from '@package/ui/button';

export const FeatureCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Name</CardTitle>
        <CardDescription>
          Feature description goes here
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Feature content */}
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  );
};
```

### Tailwind CSS Usage
```typescript
// Responsive design
const ResponsiveLayout = () => (
  <div className="
    grid
    grid-cols-1          /* Mobile: 1 column */
    md:grid-cols-2       /* Tablet: 2 columns */
    lg:grid-cols-3       /* Desktop: 3 columns */
    gap-4
    p-4
    md:p-6
    lg:p-8
  ">
    {/* Content */}
  </div>
);

// Dark mode support
const DarkModeAware = () => (
  <div className="
    bg-white           /* Light mode background */
    dark:bg-gray-800   /* Dark mode background */
    text-gray-900      /* Light mode text */
    dark:text-gray-100 /* Dark mode text */
  ">
    {/* Content */}
  </div>
);
```

## API Error Handling

### tRPC Error Handling
```typescript
// API procedure with error handling
const userRouter = createTRPCRouter({
  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Validate input
        if (!input.name) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Name is required',
          });
        }

        // Check permissions
        if (!ctx.user.canUpdateProfile) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Not allowed to update profile',
          });
        }

        // Attempt update
        const updated = await ctx.prisma.user.update({
          where: { id: ctx.user.id },
          data: input,
        });

        return updated;
      } catch (error) {
        // Handle known errors
        if (error instanceof TRPCError) {
          throw error;
        }

        // Log unknown errors
        console.error('Failed to update user:', error);
        
        // Return safe error to client
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        });
      }
    }),
});
```

### Client-Side Error Handling
```typescript
// React component with error handling
const ProfileForm = () => {
  const { toast } = useToast();
  const updateUser = api.user.update.useMutation({
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await updateUser.mutateAsync(data);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
};
```

### Error Response Format
```typescript
// Standard error response structure
type ErrorResponse = {
  code: string;        // Error code (e.g., 'BAD_REQUEST')
  message: string;     // User-friendly message
  path?: string[];     // Path to error in input
  stack?: string;      // Stack trace (development only)
};

// Error handling middleware
const errorHandler = (
  error: unknown,
  _req: NextApiRequest,
  res: NextApiResponse
) => {
  if (error instanceof TRPCError) {
    return res.status(getHttpStatusCode(error.code)).json({
      code: error.code,
      message: error.message,
      path: error.path,
      ...(process.env.NODE_ENV === 'development' && {
        stack: error.stack,
      }),
    });
  }

  // Handle unknown errors
  console.error('Unhandled error:', error);
  return res.status(500).json({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
  });
};
```

## Legal Documentation

### Privacy Policy Overview
- Data collection limited to necessary information
- Data protection using industry standards
- No sharing with third parties except when legally required
- GDPR compliance
- User rights regarding their data
- Cookie usage policy

### Terms of Service Summary
- Single purchase, perpetual access
- No recurring fees
- Non-transferable license
- Usage restrictions
- Termination conditions
- Liability limitations
- Governing law (Sweden)

### License Agreement Details
#### Personal License
- Individual use
- Unlimited projects
- Code modification allowed
- Commercial use permitted

#### Team License
- Team-wide usage
- Unlimited projects
- Code sharing within team
- Commercial use permitted

#### Restrictions
- No redistribution
- No reselling
- No sub-licensing
- No transfer of rights

## Development Tools

### NPM Scripts Reference
```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",
    "start": "turbo start",
    "lint": "turbo lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "db:generate": "turbo db:generate",
    "db:push": "turbo db:push",
    "db:migrate": "turbo db:migrate",
    "db:deploy": "turbo db:deploy",
    "db:seed": "turbo db:seed",
    "clean": "turbo clean && rm -rf node_modules",
    "test": "turbo test",
    "test:watch": "turbo test:watch"
  }
}
```

### Local Development Workflow
1. Start services:
```bash
# Start database
docker-compose up -d

# Start development servers
pnpm dev
```

2. Available local endpoints:
- Dashboard: http://localhost:3000
- Marketing: http://localhost:3001
- Email preview: http://localhost:3333
- Database admin: http://localhost:5555

3. Development tools:
```bash
# Format code
pnpm format

# Lint code
pnpm lint

# Run tests
pnpm test

# Reset database
pnpm db:reset
```

## Role-based Access Control (RBAC)

### Complete Role Implementation
```typescript
// types/roles.ts
export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

// components/Authorization.tsx
interface AuthorizationProps {
  allowedRoles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Authorization: React.FC<AuthorizationProps> = ({
  allowedRoles,
  children,
  fallback = <AccessDenied />
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return fallback;
  }

  return <>{children}</>;
};

// Usage examples
const AdminPanel = () => (
  <Authorization allowedRoles={[Role.ADMIN, Role.SUPER_ADMIN]}>
    <AdminDashboard />
  </Authorization>
);

const UserSettings = () => (
  <Authorization allowedRoles={[Role.USER, Role.ADMIN, Role.SUPER_ADMIN]}>
    <SettingsPanel />
  </Authorization>
);
```

### Policy Implementation
```typescript
// types/policies.ts
export type Policy = (context: PolicyContext) => boolean;

interface PolicyContext {
  user: User;
  resource?: any;
}

// policies/index.ts
export const policies: Record<string, Policy> = {
  'post:create': ({ user }) => {
    return user.role !== Role.BANNED;
  },
  'post:edit': ({ user, resource }) => {
    return (
      user.role === Role.ADMIN ||
      user.role === Role.SUPER_ADMIN ||
      resource.authorId === user.id
    );
  },
  'post:delete': ({ user, resource }) => {
    return (
      user.role === Role.ADMIN ||
      user.role === Role.SUPER_ADMIN ||
      resource.authorId === user.id
    );
  },
  'user:impersonate': ({ user }) => {
    return user.role === Role.SUPER_ADMIN;
  },
};

// hooks/usePolicy.ts
export const usePolicy = () => {
  const { user } = useAuth();

  const checkPolicy = useCallback(
    (policyName: string, resource?: any) => {
      const policy = policies[policyName];
      if (!policy) return false;
      return policy({ user, resource });
    },
    [user]
  );

  return { checkPolicy };
};

// Usage example
const PostActions = ({ post }) => {
  const { checkPolicy } = usePolicy();

  return (
    <div>
      {checkPolicy('post:edit', post) && (
        <Button onClick={() => handleEdit(post)}>Edit</Button>
      )}
      {checkPolicy('post:delete', post) && (
        <Button onClick={() => handleDelete(post)}>Delete</Button>
      )}
    </div>
  );
};
```

## Marketing Site Features

### Blog Post Creation
1. Create new MDX file in `apps/marketing/src/content/blog`:
```markdown
---
title: Your Blog Title
description: Blog post description
publishedAt: 2024-01-29
updatedAt: 2024-01-29
coverImage: /images/blog/cover.jpg
authorName: John Doe
keywords: [nextjs, saas]
published: true
---

# Your Blog Content

Content goes here with support for:
- MDX components
- Code blocks
- Images
- Custom components
```

2. Add author info in `apps/marketing/src/app/blog/_config/authors.ts`:
```typescript
export const authors = {
  'John Doe': {
    name: 'John Doe',
    avatar: '/images/authors/john.jpg',
    bio: 'Software engineer and writer.',
  },
};
```

### Documentation Page Creation
1. Create new MDX file in `apps/marketing/src/content/docs`:
```markdown
---
title: Documentation Title
description: Page description
updatedAt: 2024-01-29
---

# Documentation Content

Content with support for:
<Accordion>
  Expandable content
</Accordion>

<Tabs>
  <Tab>Content 1</Tab>
  <Tab>Content 2</Tab>
</Tabs>
```

2. Update `meta.json` for navigation:
```json
{
  "title": "Documentation",
  "pages": [
    "index",
    "getting-started",
    ["guides", "Guides"],
    ["api", "API Reference"]
  ]
}
```

### SEO Optimization
1. Configure default metadata:
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'Your App',
    template: '%s | Your App',
  },
  description: 'Your app description',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://your-domain.com',
    title: 'Your App',
    description: 'Your app description',
    siteName: 'Your App',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your App',
    description: 'Your app description',
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

2. Page-specific metadata:
```typescript
// app/blog/[slug]/page.tsx
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.coverImage],
    },
  };
}
```

3. Automatic sitemap generation:
```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();
  const docs = await getAllDocs();

  return [
    {
      url: 'https://your-domain.com',
      lastModified: new Date(),
    },
    ...posts.map((post) => ({
      url: `https://your-domain.com/blog/${post.slug}`,
      lastModified: post.updatedAt,
    })),
    ...docs.map((doc) => ({
      url: `https://your-domain.com/docs/${doc.slug}`,
      lastModified: doc.updatedAt,
    })),
  ];
}
```