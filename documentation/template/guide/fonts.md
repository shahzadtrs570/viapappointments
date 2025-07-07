# Fonts Package Documentation

## Overview

The `@package/fonts` package provides a centralized font management system for the NextJet project. It handles font downloading, optimization, and implementation using Next.js's built-in font optimization features.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Available Fonts](#available-fonts)
- [Usage Examples](#usage-examples)
- [Font Management](#font-management)
- [Best Practices](#best-practices)
- [API Reference](#api-reference)

## Installation

Add the package to your project dependencies:

```json
{
  "dependencies": {
    "@package/fonts": "workspace:*"
  }
}
```

## Quick Start

```typescript
import { defaultFont, sarabun, archivoBlack, getFontVariables } from '@package/fonts'

// Use default font
function MyComponent() {
  return (
    <div className={defaultFont.className}>
      This text uses the default font
    </div>
  )
}

// Use multiple fonts with CSS variables
function RootLayout({ children }) {
  return (
    <html className={getFontVariables()}>
      {children}
    </html>
  )
}
```

## Architecture

```
fonts/
├── src/
│   ├── assets/            # Downloaded font files (.woff2)
│   ├── types/
│   │   └── next-font.d.ts # TypeScript definitions
│   └── index.ts           # Main exports
├── scripts/
│   ├── download-fonts.js  # Font download script
│   └── download-fonts.ts  # TypeScript version
```

## Available Fonts

### 1. Sarabun
- Primary font family
- Available weights:
  - Thin (100)
  - Regular (400)
  - [Additional weights available]

```typescript
import { sarabun } from '@package/fonts'

<p className={`${sarabun.className} font-thin`}>
  Thin text
</p>
```

### 2. Archivo Black
- Display font for headings
- Single weight (Regular)

```typescript
import { archivoBlack } from '@package/fonts'

<h1 className={archivoBlack.className}>
  Bold Heading
</h1>
```

## Usage Examples

### Basic Usage

```typescript
import { defaultFont } from '@package/fonts'

export default function Component() {
  return (
    <div className={defaultFont.className}>
      This text uses the default font
    </div>
  )
}
```

### Multiple Font Weights

```typescript
import { sarabun } from '@package/fonts'

export default function Typography() {
  return (
    <div className={sarabun.className}>
      <p className="font-thin">Thin Text (100)</p>
      <p className="font-normal">Regular Text (400)</p>
      <p className="font-bold">Bold Text</p>
    </div>
  )
}
```

### Combining Fonts

```typescript
import { sarabun, archivoBlack } from '@package/fonts'

export default function Article() {
  return (
    <article>
      <h1 className={archivoBlack.className}>
        Article Title
      </h1>
      <div className={sarabun.className}>
        <p>Article content in Sarabun...</p>
      </div>
    </article>
  )
}
```

## Font Management

### Download Script

The package includes a font download script that manages font files:

```bash
# Run manually
npm run download-fonts

# Runs automatically on package install
npm install
```

### Font Configuration

Font definitions in `src/index.ts`:

```typescript
export const sarabun = localFont({
  src: [
    {
      path: './assets/Sarabun-Thin.woff2',
      weight: '100',
      style: 'normal',
    },
    {
      path: './assets/Sarabun-Regular.woff2',
      weight: '400',
      style: 'normal',
    }
  ],
  display: 'swap',
  variable: '--font-sarabun',
})
```

## Best Practices

1. **Font Loading**
   - Use `display: 'swap'` for better performance
   - Implement font subsetting when possible
   - Prefer WOFF2 format for better compression

2. **Font Usage**
   - Use `defaultFont` unless specific styling is needed
   - Apply font weights through Tailwind classes
   - Utilize CSS variables for consistent theming

3. **Performance**
   - Load only required font weights
   - Use appropriate font display strategies
   - Implement proper font fallbacks

4. **Accessibility**
   - Ensure readable font sizes
   - Maintain sufficient contrast
   - Consider font scaling for responsive design

## API Reference

### Exported Components

```typescript
// Font Instances
export const sarabun: FontFamily
export const archivoBlack: FontFamily
export const defaultFont: FontFamily

// Helper Functions
export function getFontVariables(): string

// Types
export type FontFamily = NextFont
```

### Font Options Interface

```typescript
interface FontOptions {
  src: string | Array<{
    path: string
    weight?: string
    style?: string
  }>
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'
  variable?: string
}
```

### CSS Variables

The package exports the following CSS variables:

```css
:root {
  --font-sarabun: /* Sarabun font family */
  --font-archivo-black: /* Archivo Black font family */
}
```

## Contributing

When adding new fonts:

1. Add font URLs to `scripts/download-fonts.ts`
2. Update font configurations in `src/index.ts`
3. Update documentation
4. Test font loading performance
5. Verify font licensing

## License

This package is part of the NextJet project and is subject to its licensing terms. Ensure compliance with included font licenses. 