# Font Loading Issue and Solution: Feature Requirements Document

## Issue Description

The application is experiencing font loading errors in both the marketing and dashboard sites. Specifically, there are ETIMEDOUT errors when attempting to fetch the Sarabun and Archivo Black fonts from Google Fonts:

```
request to https://fonts.gstatic.com/s/sarabun/v15/DtVmJx26TKEr37c9YK5silUs6yLUrwB0lw.woff2 failed, reason: ETIMEDOUT
```

## Impact

### Marketing Site
- Font loading failures result in fallback fonts being used
- Multiple retry attempts (up to 3) for each font file, causing console errors
- Potential performance degradation due to failed network requests
- Inconsistent visual appearance when fonts fail to load

### Dashboard Site
- Same font loading failures as the marketing site
- Affects the user experience in the main SaaS application
- Potential performance issues due to repeated failed network requests
- Inconsistent branding across the application

## Root Cause

The application is currently configured to fetch fonts from Google Fonts CDN, but these requests are timing out. This could be due to:
- Network connectivity issues
- Firewall or proxy restrictions
- Google Fonts service availability in certain regions

## Proposed Solution

Create a shared fonts package within the monorepo structure that can be used by both the marketing and dashboard applications:

### 1. Package Structure
```
packages/
  fonts/
    package.json
    tsconfig.json
    src/
      index.ts      # Exports font configurations
      assets/       # Contains local font files
        Sarabun-Thin.woff2
        Sarabun-ExtraLight.woff2
        Sarabun-Light.woff2
        Sarabun-Regular.woff2
        Sarabun-Medium.woff2
        Sarabun-SemiBold.woff2
        Sarabun-Bold.woff2
        Sarabun-ExtraBold.woff2
        ArchivoBlack-Regular.woff2
```

### 2. Implementation Requirements

#### Fonts Package
- Create a new package called `@package/fonts`
- Download and store all required font files locally
- Export properly typed font configurations using Next.js's `localFont` function
- Include proper TypeScript typings for seamless integration

#### Marketing and Dashboard Apps
- Update both apps to import fonts from the shared package
- Remove Google Fonts imports
- Update Next.js configuration to:
  - Include the fonts package in `transpilePackages`
  - Set `optimizeFonts: true` for better font optimization
  - Disable Google Fonts usage with `experimental.disableOptimizedLoading: true`

### 3. Benefits

- **Reliability**: Eliminates dependency on external font services
- **Performance**: Reduces network requests and improves loading times
- **Consistency**: Ensures the same fonts are used across all applications
- **Maintainability**: Centralizes font management in one location
- **Offline capability**: Applications can function without internet access to Google Fonts

### 4. Implementation Notes

- The fonts should be properly licensed for self-hosting
- Font files should be optimized for web use (WOFF2 format)
- The package should be designed to be easily extensible for additional fonts in the future
- Font loading should be configured with `display: 'swap'` to ensure text remains visible during font loading

This solution aligns with the monorepo structure outlined in the core-architecture documentation, which emphasizes shared packages for reusable components across applications.
