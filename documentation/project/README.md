# Srenova

Srenova is a platform connecting homeowners with investors for equity release and property investment opportunities.

## Project Overview

Srenova streamlines the equity release process by:

1. Helping property owners release equity while maintaining occupancy rights
2. Enabling family members to support older relatives through the process
3. Providing investment opportunities for institutional buyers
4. Connecting all parties with necessary professional services

The platform offers specialized interfaces for different user roles, including sellers, family supporters, fund buyers, conveyancers, valuers, and administrators.

## Key Features

- **Multi-user role system** with customized dashboards and workflows
- **Property listings** with detailed information and valuation data
- **Document management** for property-related files
- **Offer creation and management** for buyers
- **Buy Box portfolio management** for fund buyers to acquire multiple properties as a single unit
- **Contract workflows** for finalizing agreements
- **Admin control panel** for overseeing platform activities

## Technical Stack

- **Frontend:** Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL
- **Authentication:** NextAuth.js
- **UI Components:** shadcn/ui
- **Testing:** Vitest, React Testing Library
- **Deployment:** Docker, CI/CD pipeline

## Project Structure

The project follows a monorepo architecture with the following organization:

```
estate-flex/
├── apps/
│   ├── dashboard/   # Main web application
│   └── api/         # Backend services
├── packages/
│   ├── ui/          # Shared UI components
│   ├── db/          # Database schema and utilities
│   ├── auth/        # Authentication utilities
│   └── config/      # Shared configuration
└── documentation/   # Project documentation
```

## Development Resources

- [Data Schema](./data-schema.md) - Database models and relationships
- [API Documentation](./api-documentation.md) - API endpoints and usage
- [Implementation Plan](./implementation-plan.md) - Development roadmap
- [App Flow](./app-flow.md) - User journey workflows
- [UI Guidelines](./ui-guidelines.md) - Design system and component usage

## Getting Started

1. Clone the repository
2. Run `pnpm install` to install dependencies
3. Configure environment variables
4. Run `pnpm dev` to start the development server

## License

This project is proprietary and confidential. 