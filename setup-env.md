# Environment Setup Instructions

To fix the marketing app loading issues, you need to create environment files with the following content:

## Create `.env` in the root directory:

```bash
# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3001"
NEXT_PUBLIC_APP_ENV="development"

# API Configuration
API_URL="http://localhost:3000/api"

# Email Configuration (if needed)
EMAIL_FROM="noreply@viapappointments.com"

# Feature Flags
NEXT_PUBLIC_FEATURE_FLAGS='{"toast": true}'
```

## Create `apps/marketing/.env.local`:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3001"
NEXT_PUBLIC_APP_ENV="development"

# API Configuration
API_URL="http://localhost:3000/api"

# Feature Flags
NEXT_PUBLIC_FEATURE_FLAGS='{"toast": true}'
```

## Issues Fixed:

1. ✅ **Invalid URL Error**: Fixed by providing fallback URL in layout.tsx
2. ✅ **Deprecated Next.js Config**: Removed `appDir` and `domains` configuration
3. ✅ **Environment Variables**: Added fallback values to prevent crashes

## Next Steps:

1. Create the environment files as shown above
2. Restart the development server: `pnpm run dev`
3. Visit http://localhost:3001 to test the marketing app

The app should now load properly without the loading screen issue.


