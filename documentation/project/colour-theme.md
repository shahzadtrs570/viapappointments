# Srenova: Color Theme

## Overview
This document defines the color scheme for the Srenova platform, ensuring accessibility, consistency, and brand alignment across all interfaces. The color palette is designed to be WCAG 2.1 AA compliant and works well in both light and dark modes.

## Brand Colors

### Primary Colors
```css
--primary-50: #f0f9ff;  /* Lightest */
--primary-100: #e0f2fe;
--primary-200: #bae6fd;
--primary-300: #7dd3fc;
--primary-400: #38bdf8;
--primary-500: #0ea5e9;  /* Base */
--primary-600: #0284c7;
--primary-700: #0369a1;
--primary-800: #075985;
--primary-900: #0c4a6e;  /* Darkest */
```

### Secondary Colors
```css
--secondary-50: #f8fafc;  /* Lightest */
--secondary-100: #f1f5f9;
--secondary-200: #e2e8f0;
--secondary-300: #cbd5e1;
--secondary-400: #94a3b8;
--secondary-500: #64748b;  /* Base */
--secondary-600: #475569;
--secondary-700: #334155;
--secondary-800: #1e293b;
--secondary-900: #0f172a;  /* Darkest */
```

### Accent Colors
```css
--accent-50: #fdf4ff;  /* Lightest */
--accent-100: #fae8ff;
--accent-200: #f5d0fe;
--accent-300: #f0abfc;
--accent-400: #e879f9;
--accent-500: #d946ef;  /* Base */
--accent-600: #c026d3;
--accent-700: #a21caf;
--accent-800: #86198f;
--accent-900: #701a75;  /* Darkest */
```

## Semantic Colors

### Success Colors
```css
--success-50: #f0fdf4;  /* Lightest */
--success-100: #dcfce7;
--success-200: #bbf7d0;
--success-300: #86efac;
--success-400: #4ade80;
--success-500: #22c55e;  /* Base */
--success-600: #16a34a;
--success-700: #15803d;
--success-800: #166534;
--success-900: #14532d;  /* Darkest */
```

### Warning Colors
```css
--warning-50: #fffbeb;  /* Lightest */
--warning-100: #fef3c7;
--warning-200: #fde68a;
--warning-300: #fcd34d;
--warning-400: #fbbf24;
--warning-500: #f59e0b;  /* Base */
--warning-600: #d97706;
--warning-700: #b45309;
--warning-800: #92400e;
--warning-900: #78350f;  /* Darkest */
```

### Error Colors
```css
--error-50: #fef2f2;  /* Lightest */
--error-100: #fee2e2;
--error-200: #fecaca;
--error-300: #fca5a5;
--error-400: #f87171;
--error-500: #ef4444;  /* Base */
--error-600: #dc2626;
--error-700: #b91c1c;
--error-800: #991b1b;
--error-900: #7f1d1d;  /* Darkest */
```

### Info Colors
```css
--info-50: #eff6ff;  /* Lightest */
--info-100: #dbeafe;
--info-200: #bfdbfe;
--info-300: #93c5fd;
--info-400: #60a5fa;
--info-500: #3b82f6;  /* Base */
--info-600: #2563eb;
--info-700: #1d4ed8;
--info-800: #1e40af;
--info-900: #1e3a8a;  /* Darkest */
```

## Neutral Colors

### Gray Scale
```css
--gray-50: #f9fafb;   /* Lightest */
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-400: #9ca3af;
--gray-500: #6b7280;  /* Base */
--gray-600: #4b5563;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;  /* Darkest */
```

## Usage Guidelines

### Light Mode
- **Background Colors**
  - Primary: `--gray-50`
  - Secondary: `--gray-100`
  - Surface: `--gray-50`
  - Card: `white`

- **Text Colors**
  - Primary: `--gray-900`
  - Secondary: `--gray-700`
  - Muted: `--gray-500`
  - Disabled: `--gray-400`

### Dark Mode
- **Background Colors**
  - Primary: `--gray-900`
  - Secondary: `--gray-800`
  - Surface: `--gray-900`
  - Card: `--gray-800`

- **Text Colors**
  - Primary: `--gray-50`
  - Secondary: `--gray-200`
  - Muted: `--gray-400`
  - Disabled: `--gray-500`

## Component-Specific Colors

### Buttons
- **Primary Button**
  - Background: `--primary-500`
  - Hover: `--primary-600`
  - Active: `--primary-700`
  - Text: `white`

- **Secondary Button**
  - Background: `--secondary-100`
  - Hover: `--secondary-200`
  - Active: `--secondary-300`
  - Text: `--secondary-900`

### Forms
- **Input Fields**
  - Border: `--gray-300`
  - Focus: `--primary-500`
  - Error: `--error-500`
  - Success: `--success-500`

### Navigation
- **Active Link**
  - Text: `--primary-600`
  - Background: `--primary-50`

### Alerts
- **Success Alert**
  - Background: `--success-50`
  - Border: `--success-200`
  - Text: `--success-700`

- **Error Alert**
  - Background: `--error-50`
  - Border: `--error-200`
  - Text: `--error-700`

- **Warning Alert**
  - Background: `--warning-50`
  - Border: `--warning-200`
  - Text: `--warning-700`

- **Info Alert**
  - Background: `--info-50`
  - Border: `--info-200`
  - Text: `--info-700`

## Accessibility Considerations

### Contrast Ratios
- Text on background: Minimum 4.5:1
- Large text on background: Minimum 3:1
- Interactive elements: Minimum 4.5:1
- Decorative elements: Minimum 3:1

### Color Independence
- All interactive elements have non-color indicators
- Status information is conveyed through multiple means
- Color is not used as the only means of conveying information

### Focus States
- Focus indicators use `--primary-500`
- High contrast focus rings
- Visible focus states on all interactive elements

## Implementation

### Tailwind Configuration
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          // ... other shades
          900: '#0c4a6e',
        },
        // ... other color scales
      },
    },
  },
  darkMode: 'class',
}
```

### CSS Variables
```css
:root {
  --primary-50: #f0f9ff;
  /* ... other variables */
}

.dark {
  --primary-50: #0c4a6e;
  /* ... dark mode variables */
}
```

### Usage Examples
```html
<!-- Button -->
<button class="bg-primary-500 hover:bg-primary-600 text-white">
  Click me
</button>

<!-- Alert -->
<div class="bg-success-50 border-success-200 text-success-700">
  Success message
</div>

<!-- Form input -->
<input class="border-gray-300 focus:border-primary-500" />
``` 