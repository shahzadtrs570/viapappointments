# Tailwind Configuration Implementation Guide

## Understanding NextJet's Tailwind Setup

NextJet uses a shared Tailwind configuration that's extended by each app in the monorepo. This ensures consistency across all applications while allowing for app-specific customizations.

## Key Configuration Files

1. **Base Configuration**:
   - Location: `packages/configs/tailwind-config/tailwind.config.ts`
   - Purpose: Defines the shared configuration used by all apps

2. **Theme CSS Variables**:
   - Location: `packages/configs/tailwind-config/styles.css`
   - Purpose: Contains CSS variables for your theme (colors, spacing, etc.)
   
3. **App-Specific Configuration**:
   - Location: `apps/marketing/tailwind.config.ts` and `apps/dashboard/tailwind.config.ts`
   - Purpose: Extends the base configuration with app-specific settings

## Implementation Steps

### 1. Update Base Theme Variables

First, customize the base theme by modifying the CSS variables in `packages/configs/tailwind-config/styles.css`:

```css
:root {
  /* Replace these values with your brand colors (in HSL format) */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* Add all other variables following your theme specification */
}

.dark {
  /* Dark mode variables */
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* Continue with other dark mode values */
}
```

### 2. Extend the Base Configuration (if needed)

If you need additional Tailwind settings beyond the base configuration:

```typescript
// In apps/marketing/tailwind.config.ts
import { type Config } from "tailwindcss";
import sharedConfig from "@package/tailwind-config/tailwind.config"


export default {
  // Extend the base configuration
  ...sharedConfig,
  // Add marketing-specific content paths
  content: [
    ...baseConfig.content,
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // Add any marketing-specific theme extensions
  theme: {
    extend: {
      ...baseConfig.theme?.extend,
      // Your extensions here
    },
  },
} satisfies Config;
```

### 3. Ensure Proper Usage in Components

When creating components, use the Tailwind classes that reference your theme variables:

```jsx
// DO use theme-aware classes
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Click Me
  </button>
</div>

// DON'T use hardcoded colors
<div className="bg-white text-black"> {/* Avoid this */}
  <button className="bg-blue-500 text-white"> {/* Avoid this */}
    Click Me
  </button>
</div>
```

### 4. Using ShadCN UI Components

The ShadCN UI components in NextJet are pre-configured to use your theme variables:

```jsx
// These components will automatically use your theme colors
import { Button } from "@package/ui/button";
import { Card, CardHeader, CardContent } from "@package/ui/card";

function MyComponent() {
  return (
    <Card>
      <CardHeader>My Card</CardHeader>
      <CardContent>
        <Button>Click Me</Button>
      </CardContent>
    </Card>
  );
}
```

## Verifying Theme Implementation

To verify your theme is correctly applied:

1. Start the dev server: `pnpm dev`
2. Check both light and dark modes using the theme toggle
3. Inspect elements to confirm CSS variables are applied correctly
4. Test across different screen sizes to verify responsive behavior

## Common Issues

### Issue: Theme Not Applying
- Check that your CSS variables are correctly defined in `styles.css`
- Verify that tailwind.config.ts is properly extending the base config
- Confirm that components use theme-aware classes (bg-primary vs bg-blue-500)

### Issue: Dark Mode Not Working
- Ensure ThemeProvider is properly configured in layout components
- Check that dark variants are defined for all CSS variables
- Verify dark mode tailwind classes are being used (dark:bg-slate-900)

### Issue: Inconsistent Colors Across Apps
- Ensure both apps are extending the same base configuration
- Check for any app-specific overrides that may be conflicting

## Best Practices

1. **Use Semantic Color Names**: Use `bg-primary` instead of `bg-blue-500`
2. **Use Dark Mode Variants**: Always include dark mode variants (dark:bg-slate-800)
3. **Maintain Variable Consistency**: Keep the same variable names across light and dark modes
4. **Use Tailwind's Opacity Modifiers**: For transparency: `bg-primary/50` for 50% opacity
5. **Test Both Modes**: Always test your components in both light and dark modes
