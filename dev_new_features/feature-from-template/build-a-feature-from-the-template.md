# Building a Feature Using the Feature Template

This guide explains how to quickly create a new feature by using the existing feature-template as a starting point. Instead of building everything from scratch, this approach allows you to duplicate, rename, and modify existing files to create your new feature.

## Overview of the Approach

1. **Copy the feature-template files** - Duplicate the existing structure
2. **Rename files and directories** - Change feature-template to your-feature-name
3. **Update content** - Modify schema, API endpoints, and UI components
4. **Add feature flags** - Enable/disable your feature as needed
5. **Test and deploy** - Verify everything works correctly

## Prerequisites

- Understand the NextJet SaaS template structure
- Have a clear idea of what your feature will do
- Identify any additional data fields or relations your feature requires beyond the template

## Step 1: Plan Your Feature

1. **Choose a feature name**: Pick a simple, descriptive name (e.g., "survey", "analytics")
2. **Define your data model**: Determine what data fields you need
3. **Plan feature structure**: Decide which template components you need to keep/modify

## Step 2: Copy and Rename Files

For this example, we'll create a "survey" feature. Replace "survey" with your feature name.

### Database Schema

1. Locate the feature template model in `packages/db/prisma/schema.prisma`
2. Copy the `FeatureTemplate` model and rename it to your feature name
3. Modify the fields as needed for your feature

```prisma
// Copy this model and rename it to your feature (e.g., Survey)
model FeatureTemplate {
  id          String   @id @default(cuid())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  userId      String?
  user        User?    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([createdAt])
}
```

### API Package

Copy and rename these directories and files:

```bash
# Create the directory for your new feature
mkdir -p packages/api/src/routers/survey

# Copy repository files
mkdir -p packages/api/src/routers/survey/repository
cp packages/api/src/routers/feature-template/repository/feature-template.repository.ts packages/api/src/routers/survey/repository/survey.repository.ts

# Copy service files
mkdir -p packages/api/src/routers/survey/service
cp packages/api/src/routers/feature-template/service/feature-template.input.ts packages/api/src/routers/survey/service/survey.input.ts
cp packages/api/src/routers/feature-template/service/feature-template.service.ts packages/api/src/routers/survey/service/survey.service.ts

# Copy router file
cp packages/api/src/routers/feature-template/feature-template.router.ts packages/api/src/routers/survey/survey.router.ts

# Copy README
cp packages/api/src/routers/feature-template/README.md packages/api/src/routers/survey/README.md
```

### Dashboard App

Copy and rename these directories and files:

```bash
# Regular user pages
mkdir -p apps/dashboard/src/app/\(dashboard\)/survey/_components
cp apps/dashboard/src/app/\(dashboard\)/feature-template/page.tsx apps/dashboard/src/app/\(dashboard\)/survey/page.tsx
cp apps/dashboard/src/app/\(dashboard\)/feature-template/README.md apps/dashboard/src/app/\(dashboard\)/survey/README.md

mkdir -p apps/dashboard/src/app/\(dashboard\)/survey/\[id\]
cp apps/dashboard/src/app/\(dashboard\)/feature-template/\[id\]/page.tsx apps/dashboard/src/app/\(dashboard\)/survey/\[id\]/page.tsx

mkdir -p apps/dashboard/src/app/\(dashboard\)/survey/new
cp apps/dashboard/src/app/\(dashboard\)/feature-template/new/page.tsx apps/dashboard/src/app/\(dashboard\)/survey/new/page.tsx

# Copy component files
cp apps/dashboard/src/app/\(dashboard\)/feature-template/_components/feature-template-form.tsx apps/dashboard/src/app/\(dashboard\)/survey/_components/survey-form.tsx
cp apps/dashboard/src/app/\(dashboard\)/feature-template/_components/feature-template-item.tsx apps/dashboard/src/app/\(dashboard\)/survey/_components/survey-item.tsx
cp apps/dashboard/src/app/\(dashboard\)/feature-template/_components/feature-template-list.tsx apps/dashboard/src/app/\(dashboard\)/survey/_components/survey-list.tsx

# Admin pages
mkdir -p apps/dashboard/src/app/\(dashboard\)/admin/survey/_components
cp apps/dashboard/src/app/\(dashboard\)/admin/feature-template/page.tsx apps/dashboard/src/app/\(dashboard\)/admin/survey/page.tsx
cp apps/dashboard/src/app/\(dashboard\)/admin/feature-template/README.md apps/dashboard/src/app/\(dashboard\)/admin/survey/README.md

# Copy admin component files
cp apps/dashboard/src/app/\(dashboard\)/admin/feature-template/_components/feature-template-actions.tsx apps/dashboard/src/app/\(dashboard\)/admin/survey/_components/survey-actions.tsx
cp apps/dashboard/src/app/\(dashboard\)/admin/feature-template/_components/feature-template-table.tsx apps/dashboard/src/app/\(dashboard\)/admin/survey/_components/survey-table.tsx
```

### Marketing App

Copy and rename these directories and files:

```bash
# Marketing pages
mkdir -p apps/marketing/src/app/surveys/_components
cp apps/marketing/src/app/features/page.tsx apps/marketing/src/app/surveys/page.tsx
cp apps/marketing/src/app/features/README.md apps/marketing/src/app/surveys/README.md

# Copy marketing components
cp apps/marketing/src/app/features/_components/feature-template-card.tsx apps/marketing/src/app/surveys/_components/survey-card.tsx
cp apps/marketing/src/app/features/_components/feature-template-form.tsx apps/marketing/src/app/surveys/_components/survey-form.tsx
```

## Step 3: Update Files

After copying and renaming files, you need to update their content. Here's what to change in each file:

### Database Schema

Edit `packages/db/prisma/schema.prisma`:

1. Add your new model (e.g., `Survey`) if you didn't already
2. Generate and apply migrations:

```bash
pnpm db:migrate
pnpm db:deploy
```

### API Files

#### 1. Repository (survey.repository.ts)

1. Update class name: `FeatureTemplateRepository` → `SurveyRepository`
2. Update comments to reflect your new feature model
3. Update any specific database operations to match your feature requirements

#### 2. Input Types (survey.input.ts)

1. Update interface names: `CreateFeatureTemplateInput` → `CreateSurveyInput`
2. Update type names: `UpdateFeatureTemplateInput` → `UpdateSurveyInput`
3. Add any additional fields your feature requires

#### 3. Service (survey.service.ts)

1. Update class name: `FeatureTemplateService` → `SurveyService`
2. Update method names: `createFeatureTemplate` → `createSurvey`
3. Update import paths to point to your new files
4. Update error messages to reference your feature

#### 4. Router (survey.router.ts)

1. Update import paths
2. Update router name: `featureTemplateRouter` → `surveyRouter`
3. Update procedure names: `create`, `list`, etc.
4. Update comments to reflect your new model and endpoints

#### 5. Register Router in Root

Edit `packages/api/src/root.ts` to include your new router:

```typescript
import { surveyRouter } from "./routers/survey/survey.router";

export const appRouter = createTRPCRouter({
  // Existing routers
  featureTemplate: featureTemplateRouter,
  // Add your new router
  survey: surveyRouter,
});
```

### Dashboard App Files

#### 1. Page Components

In each page file (`page.tsx` in regular and admin directories):

1. Update imports to point to your new components
2. Update component names and references
3. Update page titles and descriptions
4. Update any API calls to use your new endpoints

#### 2. Component Files

For each component file:

1. Update import paths
2. Update component names: `FeatureTemplateForm` → `SurveyForm`
3. Update interface names: `FeatureTemplate` → `Survey`
4. Update API endpoint references: `api.featureTemplate.create` → `api.survey.create`
5. Update UI text to reference your feature

### Marketing App Files

Update marketing files similarly to the dashboard components:

1. Update import paths
2. Update component names
3. Update page titles and descriptions
4. Update any API calls to use your new endpoints

### Navigation and Layout Components

#### Dashboard Links

Edit `apps/dashboard/src/components/Layout/DashboardLayout/DashboardLinks.tsx`:

1. Add a new navigation item for your feature:

```typescript
// Add a link for your feature
{featureFlags.surveyFeature && (
  <NavigationLink 
    href="/survey" 
    icon={<ClipboardList className="h-4 w-4" />}
  >
    Surveys
  </NavigationLink>
)}
```

#### Marketing Navigation

Edit nav files to include your feature if needed:

1. `apps/marketing/src/components/Misc/Navbar/DesktopLinks.tsx`
2. `apps/marketing/src/components/Misc/Navbar/MobileLinks.tsx`

## Step 4: Add Feature Flags

Edit `packages/utils/src/constants/featureFlags.ts`:

```typescript
export const featureFlags = {
  // Existing flags
  templateFeature: true,
  // Add your feature flag
  surveyFeature: true,
};
```

## Step 5: Test Your Feature

1. Build and start the application:
```bash
pnpm build
pnpm dev
```

2. Test all parts of your feature:
   - Dashboard user pages
   - Admin management pages
   - Marketing pages
   - API endpoints
   - Database operations

3. Verify feature flags work correctly

## Step 6: Code Quality and Linting Guidelines

When editing the copied files, it's essential to follow the project's linting and code quality standards to avoid errors. Here are the most common issues you'll need to address:

### Import Ordering

Each file should organize imports in a specific order with a blank line between each group:

```typescript
// Group 1: External packages (React, third-party libraries)
import { useState, useEffect } from "react";
import { z } from "zod";

// Group 2: Absolute imports from packages 
import { Button } from "@package/ui/button";
import { Input } from "@package/ui/input";

// Group 3: Absolute imports from the app
import { api } from "@/lib/trpc/react";
import { useToast } from "@/hooks/use-toast";

// Group 4: Relative imports
import { Something } from "./something";
```

When editing your copied files, pay special attention to:
- Adding the blank lines between import groups
- Ensuring imports point to your new feature's files
- Using consistent quotation marks (double quotes are preferred)

### Type Safety

#### Avoid Using `any`

The template files may contain `any` type assertions to satisfy the Prisma type system or for other purposes. You should minimize the use of `any`:

```typescript
// ❌ Avoid - Using any
const createData: any = {
  ...data,
};

// ✅ Better - Using proper type
const createData: CreateSurveyInput & { userId?: string } = {
  ...data,
};
```

#### Use Type Imports

When importing only types, use explicit type imports:

```typescript
// ❌ Avoid
import { Survey } from "../models";

// ✅ Better
import type { Survey } from "../models";
```

#### Use `unknown` Instead of `any` for External Data

For API responses or external data:

```typescript
// ❌ Avoid
const response: any = await fetch("/api/data");

// ✅ Better
const response: unknown = await fetch("/api/data");
// Then type-check or type-assert before using
```

### Common Linting Issues

1. **Unused variables**: Delete or rename variables that aren't used (prefix with `_` if needed)

2. **Missing dependencies in hooks**: Update `useEffect`, `useMemo`, and `useCallback` dependencies

   ```typescript
   // ❌ Incomplete dependencies
   useEffect(() => {
     if (userData) {
       doSomething(userData);
     }
   }, []); // userData is missing from dependencies

   // ✅ Complete dependencies
   useEffect(() => {
     if (userData) {
       doSomething(userData);
     }
   }, [userData]);
   ```

3. **Consistent component props**: Ensure all component props have proper types

   ```typescript
   // ❌ Missing type 
   function SurveyItem({ survey }) {
     // ...
   }

   // ✅ With proper type
   interface SurveyItemProps {
     survey: Survey;
   }

   function SurveyItem({ survey }: SurveyItemProps) {
     // ...
   }
   ```

4. **Exhaustive conditionals**: Add proper checks for nullable fields from the database

   ```typescript
   // ❌ Missing null check
   <p>{survey.description}</p>

   // ✅ With null check
   <p>{survey.description || "No description"}</p>
   ```

### Adding an ESLint Disable Comment (Use Sparingly)

If you absolutely need to temporarily bypass a linting rule, add a specific inline comment:

```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = JSON.parse(response);
```

Use these comments sparingly and only when necessary.

## Troubleshooting Common Issues

1. **Missing imports**: Ensure all imports point to your new files
2. **Type errors**: Update all interfaces and types to match your feature
3. **API errors**: Check that your API router is properly registered
4. **Database errors**: Verify your model is properly defined and migrations applied
5. **Navigation issues**: Ensure navigation links are updated correctly

## Best Practices

1. **Consistent naming**: Use the same naming pattern throughout
2. **Update comments**: Ensure all comments accurately reflect your feature
3. **Test thoroughly**: Test all CRUD operations and UI interactions
4. **Incremental changes**: Make small, testable changes rather than modifying everything at once
5. **Feature flags**: Use feature flags to control feature availability

## Conclusion

By using the feature template as a starting point, you can significantly reduce the time and effort required to build new features. This approach ensures consistency across your application and makes maintenance easier.

Remember to:
1. Plan your feature carefully
2. Copy and rename files systematically
3. Update content consistently
4. Add appropriate feature flags
5. Test thoroughly before deployment
6. Follow code quality and linting guidelines

This templated approach can be used for any new feature you want to add to the NextJet SaaS template.
