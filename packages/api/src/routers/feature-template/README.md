# Feature Template

This directory contains a complete template structure for implementing new features in the NextJet SaaS template. This template follows the project's architectural patterns and coding standards.

## Current Status

This feature template is currently set up with mock data for demonstration purposes. Before using this in production, you'll need to add the `FeatureTemplate` model to your Prisma schema.

## Template Structure

```
feature-template/
├── repository/
│   └── feature-template.repository.ts  # Database operations
├── service/
│   ├── feature-template.service.ts     # Business logic
│   └── feature-template.input.ts       # TypeScript interfaces
└── feature-template.router.ts          # tRPC router
```

## How to Use This Template

1. **Copy the Template**: Copy the entire `feature-template` directory to create a new feature
   ```bash
   cp -r packages/api/src/routers/feature-template packages/api/src/routers/your-feature
   ```

2. **Rename the Feature**: Rename all occurrences of "feature-template" to your feature's name

3. **Update the Database Schema**: 
   - Add your feature's model to `packages/db/prisma/schema.prisma`
   - Run migrations: `pnpm db:migrate` and `pnpm db:deploy`
   - Update the repository to use the actual database instead of mock data

4. **Register the Router**: 
   - Add your router to `packages/api/src/root.ts`

## Implementation Pattern

The feature template follows the repository-service-router pattern:

- **Repository**: Contains all database operations and data access logic
- **Service**: Contains business logic, validation, and coordinates between the repository and router
- **Router**: Defines tRPC endpoints with input validation using Zod schemas

## API Endpoints

The feature template includes the following API endpoints:

- `create`: Creates a new feature template
- `list`: Gets all feature templates for the current user (with pagination)
- `get`: Gets a specific feature template by ID
- `update`: Updates a feature template
- `delete`: Deletes a feature template
- `admin.getAll`: Gets all feature templates (admin only)

## UI Integration

The feature template also includes corresponding UI components in:

- `apps/dashboard/src/app/(dashboard)/feature-template/` - Dashboard components
- `apps/dashboard/src/app/(dashboard)/admin/feature-template/` - Admin components
- `apps/marketing/src/app/features/` - Marketing components

## Notes

- All template files include TypeScript interfaces and comprehensive comments
- Remember to update paths when copying/renaming this template
- Add tests for your implementation 