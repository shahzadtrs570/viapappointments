# Plan to Fix ESLint Errors

## Overview
The codebase has numerous ESLint, TypeScript, and code quality issues that need to be fixed. We'll address them systematically, starting with simple fixes and moving to more complex ones. The issues span across multiple packages and apps within the monorepo.

## Categories of Issues

1. **Unused Imports/Variables**
   - Many React imports not used
   - Components defined but never used
   - Variables assigned but not referenced

2. **TypeScript Type Issues**
   - Explicit `any` types that should be replaced with proper types
   - Missing type definitions

3. **ESLint Rules Violations**
   - Console statements (development artifacts)
   - Unhandled promises
   - Nested ternary expressions
   - JSX accessibility issues
   - JSX nesting depth issues
   - File line count limits

## Implementation Plan

### Phase 1: Fix Simple Import/Variable Issues
1. Remove unused imports like React from components where it's not needed
2. Remove or properly use imported components like Head, Link, Text, CardDescription
3. Add necessary exports or remove unused variables

### Phase 2: Address TypeScript Type Issues
1. Replace `any` types with proper type definitions
2. Define interfaces for untyped data structures
3. Add type declarations for implicit types

### Phase 3: Fix ESLint Rules Violations
1. Handle unhandled promises with await, void operator, or .catch()
2. Remove or replace console.log statements
3. Refactor nested ternary expressions with if/else or switch statements
4. Fix JSX accessibility by adding keyboard event handlers
5. Reduce JSX nesting depth by extracting components
6. Split large files to respect line count limits

## Implementation Details

### Files to Fix:

#### Email Package
- `packages/email/src/templates/GenericSystemEmail.tsx`
  - Remove unused imports: Head, Link, Text

#### UI Package
- `packages/ui/src/hooks/useLeadCapture.ts`
  - Replace console.error with proper error handling
- `packages/ui/src/hooks/useNewsletterSignup.ts`
  - Replace console.error with proper error handling

#### API Package
- `packages/api/src/routers/leads/leads.router.ts`
  - Remove unused imports: sendEmail, TRPCError
  - Fix unused variable: updateLeadStatusSchema
- `packages/api/src/routers/leads/repository/leads.repository.ts`
  - Remove unused import: PrismaClient
  - Replace any types with proper types
- `packages/api/src/routers/leads/service/leads.service.ts`
  - Replace any types with proper types
  - Implement proper error handling instead of console statements
- `packages/api/src/routers/newsletter/newsletter.router.ts`
  - Remove unused imports: sendEmail, TRPCError
- `packages/api/src/routers/newsletter/service/newsletter.service.ts`
  - Fix unused variables
  - Replace any types
  - Fix unnecessary conditionals
  - Implement proper error handling

#### Marketing App
- `apps/marketing/src/app/(landing)/_components/LeadCaptureSection/LeadCaptureSection.tsx`
  - Remove unused React import
- `apps/marketing/src/app/(landing)/_components/LeadForm/LeadCaptureForm.tsx`
  - Fix import statements for React/useState
  - Replace console statement with proper error handling
- `apps/marketing/src/app/(landing)/_components/NewsletterSection/NewsletterSignupForm.tsx`
  - Fix import statements for React/useState
  - Replace console statement with proper error handling
- `apps/marketing/src/components/Misc/Footer/NewsletterSignup.tsx`
  - Remove unused React import

#### Dashboard App
- Multiple files with:
  - Unused React imports
  - Click handler accessibility issues
  - Nested ternary expressions
  - JSX depth issues
  - Unhandled promises
  - File size issues

## Priorities and Approach

1. **First Priority:** Fix issues that cause compiler/build errors
2. **Second Priority:** Fix issues that cause runtime errors or warnings
3. **Third Priority:** Improve code quality and maintainability

For each file, we'll:
1. Read the file to understand context
2. Plan the specific changes needed
3. Make the changes systematically
4. Test after each significant change

## Tools and Techniques

- Use TypeScript interfaces and types to replace `any`
- Extract components to reduce nesting depth
- Implement error handling patterns to replace console statements
- Use named imports rather than default imports where appropriate
- Follow the project's established coding patterns for consistency

## Testing Plan

1. After each set of changes, run ESLint to verify errors are resolved
2. Test the application functionality to ensure no regressions
3. Verify TypeScript compilation succeeds without errors

## Timeline

1. Phase 1 (Unused imports/variables): ~1 hour
2. Phase 2 (TypeScript issues): ~2 hours
3. Phase 3 (ESLint rule violations): ~3 hours

Total estimated time: ~6 hours

## Tracking Progress

We'll track progress by counting errors resolved:
- Initial count: ~130 errors/warnings
- Phase 1 goal: Reduce by 40-50 errors
- Phase 2 goal: Reduce by another 40-50 errors
- Phase 3 goal: Eliminate remaining errors 