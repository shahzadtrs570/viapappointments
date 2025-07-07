# SEO and LLM Content Strategy Implementation

## Overview
This document outlines the detailed requirements and implementation specifications for a comprehensive SEO and LLM content strategy for the NextJet SaaS template. The strategy includes industry-standard SEO tools (robots.txt, sitemap.xml) and the innovative LLMs.txt standard to make content more accessible to large language models.

## Core Requirements

### 1. Robots.txt Implementation

#### Functional Requirements
- Create a `/robots.txt` file that controls access for both standard web crawlers and LLM-specific crawlers
- Reference the sitemap.xml location
- Implement environment-aware rules (different for production/development environments)
- Include specific rules for all known LLM crawlers

#### Technical Implementation
- Use Next.js App Router Metadata API to generate the robots.txt file
- Create a `robots.ts` file in the `app` directory
- Use environment variables to detect the current environment
- Include the following crawler agents with appropriate access rules:
  - Standard crawlers (Googlebot, Bingbot, etc.)
  - LLM crawlers (GPTBot, Anthropic-AI, Claude-Web, etc.)

#### Code Structure
```typescript
// app/robots.ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'
  
  // Default production rules
  const rules = {
    userAgent: '*',
    allow: '/',
    disallow: [
      '/admin/',
      '/api/',
      '/dashboard/',
      '/auth/'
    ]
  }
  
  // LLM-specific rules
  const llmRules = [
    {
      userAgent: 'GPTBot',
      allow: ['/blog/', '/docs/', '/faq/'],
      disallow: ['/admin/', '/api/', '/dashboard/', '/auth/']
    },
    {
      userAgent: 'Anthropic-AI',
      allow: ['/blog/', '/docs/', '/faq/'],
      disallow: ['/admin/', '/api/', '/dashboard/', '/auth/']
    },
    {
      userAgent: 'Claude-Web',
      allow: ['/blog/', '/docs/', '/faq/'],
      disallow: ['/admin/', '/api/', '/dashboard/', '/auth/']
    },
    // Add other LLM crawlers as they become known
  ]
  
  // Handle development environment
  if (process.env.NODE_ENV !== 'production') {
    // Block all crawlers in non-production environments
    return {
      rules: [
        {
          userAgent: '*',
          disallow: '/'
        }
      ]
    }
  }
  
  return {
    rules: [rules, ...llmRules],
    sitemap: `${baseUrl}/sitemap.xml`
  }
}
```

### 2. Sitemap.xml Implementation

#### Functional Requirements
- Generate a `/sitemap.xml` file listing all important public-facing pages
- Include last modified dates, priority levels, and change frequency information
- Support dynamic content from various sections (blog, docs, etc.)
- Exclude non-public pages (admin, dashboard, etc.)

#### Technical Implementation
- Use Next.js App Router Metadata API to generate the sitemap.xml file
- Create a `sitemap.ts` file in the `app` directory
- Implement helper functions to scan content directories
- Create priority mapping for different content types
- Support both static sitemap generation (at build time) and dynamic generation

#### Code Structure
```typescript
// app/sitemap.ts
import { MetadataRoute } from 'next'
import { getAllBlogPosts } from '@/lib/blog'
import { getAllDocs } from '@/lib/docs'
import fs from 'fs'
import path from 'path'
import { globby } from 'globby'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://example.com'
  
  // Static pages
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9
    },
    // Add other static pages
  ]
  
  // Dynamic blog posts
  const blogPosts = await getAllBlogPosts()
  const blogSitemapEntries = blogPosts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.lastModified || post.publishedAt),
    changeFrequency: 'yearly' as const,
    priority: 0.8
  }))
  
  // Dynamic docs pages
  const docs = await getAllDocs()
  const docsSitemapEntries = docs.map(doc => ({
    url: `${baseUrl}/docs/${doc.slug}`,
    lastModified: new Date(doc.lastModified || doc.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7
  }))
  
  return [...staticPages, ...blogSitemapEntries, ...docsSitemapEntries]
}
```

### 3. LLMs.txt File Implementation

#### Functional Requirements
- Create an `/llms.txt` file following Jeremy Howard's specification
- Implement the required structure with H1 title, blockquote summary, and organized sections
- Link to markdown versions of important content
- Provide dynamically generated content based on site configuration

#### Technical Implementation
- Create a custom route handler at `/llms.txt`
- Return content with proper `text/plain` content type headers
- Implement organization by importance with logical sections
- Generate content based on site configuration and available resources

#### Code Structure
```typescript
// app/api/llms/route.ts
import { NextResponse } from 'next/server'
import { getSiteConfig } from '@/lib/config'

export async function GET() {
  const config = await getSiteConfig()
  
  const content = `# ${config.siteName}

> ${config.siteDescription}

${config.extendedDescription || ''}

## Documentation

- [Getting Started](${config.baseUrl}/docs/getting-started.md): Introduction to the project
- [API Reference](${config.baseUrl}/docs/api.md): Detailed API documentation

## Examples

- [Basic Example](${config.baseUrl}/examples/basic.md): Simple implementation example

## Optional

- [Advanced Topics](${config.baseUrl}/docs/advanced.md): Additional information for power users
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  })
}
```

### 4. Markdown Versions of Pages

#### Functional Requirements
- Generate markdown versions of HTML pages by appending `.md` to URLs
- Clean HTML before conversion, removing navigation, footers, and non-essential content
- Include YAML frontmatter with metadata
- Preserve code blocks with proper syntax highlighting

#### Technical Implementation
- Create middleware to intercept requests ending in `.md` or `.html.md`
- Implement HTML to Markdown conversion with a library like Turndown
- Add custom rules for code blocks and complex elements
- Generate static markdown during the build process for high-traffic pages

#### Code Structure
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { convertHtmlToMarkdown } from '@/lib/markdown'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the request is for a markdown version
  if (pathname.endsWith('.md') || pathname.endsWith('.html.md')) {
    // Determine the original HTML path
    const htmlPath = pathname.replace(/\.md$/, '').replace(/\.html\.md$/, '')
    
    try {
      // Fetch the HTML content
      const response = await fetch(`${request.nextUrl.origin}${htmlPath}`)
      const html = await response.text()
      
      // Convert to markdown
      const markdown = await convertHtmlToMarkdown(html, {
        cleanupSelectors: [
          'nav',
          'header',
          'footer',
          '.navigation',
          '.footer',
          '.ads',
          'script',
          'style'
        ]
      })
      
      // Return the markdown content
      return new Response(markdown, {
        headers: {
          'Content-Type': 'text/plain',
        },
      })
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to generate markdown version' },
        { status: 500 }
      )
    }
  }
  
  // Continue normal request processing
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*).md',
    '/((?!api|_next/static|_next/image|favicon.ico).*).html.md',
  ],
}
```

### 5. HTML to Markdown Conversion Helper

#### Functional Requirements
- Convert HTML content to readable markdown
- Clean non-essential elements (navigation, footers, etc.)
- Preserve code blocks with language syntax
- Add YAML frontmatter with metadata

#### Technical Implementation
```typescript
// lib/markdown.ts
import TurndownService from 'turndown'
import { JSDOM } from 'jsdom'

interface ConversionOptions {
  cleanupSelectors?: string[]
  addFrontmatter?: boolean
}

export async function convertHtmlToMarkdown(
  html: string,
  options: ConversionOptions = {}
) {
  const { cleanupSelectors = [], addFrontmatter = true } = options
  
  // Parse the HTML
  const dom = new JSDOM(html)
  const document = dom.window.document
  
  // Extract metadata
  const title = document.querySelector('title')?.textContent || 'Untitled'
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
  
  // Clean up the HTML
  cleanupSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      element.remove()
    })
  })
  
  // Set up Turndown with custom rules
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced'
  })
  
  // Add custom rules for code blocks
  turndownService.addRule('codeBlocks', {
    filter: function(node) {
      return (
        node.nodeName === 'PRE' &&
        node.firstChild &&
        node.firstChild.nodeName === 'CODE'
      )
    },
    replacement: function(content, node) {
      const code = node.firstChild as HTMLElement
      const className = code.getAttribute('class') || ''
      const language = className.replace(/^language-/, '')
      
      return `\n\`\`\`${language}\n${code.textContent}\n\`\`\`\n`
    }
  })
  
  // Convert to markdown
  const markdown = turndownService.turndown(document.body)
  
  // Add frontmatter if requested
  if (addFrontmatter) {
    return `---
title: ${title}
description: "${description}"
date: ${new Date().toISOString()}
---

${markdown}`
  }
  
  return markdown
}
```

### 6. Build Process Integration

#### Functional Requirements
- Generate static markdown versions during build for high-traffic pages
- Create script to run after Next.js build completes
- Store markdown files alongside HTML files in the output directory

#### Technical Implementation
```typescript
// scripts/generate-markdown.ts
import fs from 'fs-extra'
import path from 'path'
import { globby } from 'globby'
import { convertHtmlToMarkdown } from '../lib/markdown'

async function generateMarkdownVersions() {
  console.log('Generating markdown versions of HTML files...')
  
  // Find all HTML files in the output directory
  const htmlFiles = await globby([
    '.next/server/pages/**/*.html',
    '!.next/server/pages/_*.html', // Exclude Next.js system pages
  ])
  
  for (const htmlFile of htmlFiles) {
    try {
      // Read the HTML file
      const html = await fs.readFile(htmlFile, 'utf8')
      
      // Convert to markdown
      const markdown = await convertHtmlToMarkdown(html)
      
      // Determine the output path
      const mdFile = htmlFile.replace(/\.html$/, '.md')
      
      // Write the markdown file
      await fs.ensureDir(path.dirname(mdFile))
      await fs.writeFile(mdFile, markdown)
      
      console.log(`Generated: ${mdFile}`)
    } catch (error) {
      console.error(`Error processing ${htmlFile}:`, error)
    }
  }
  
  console.log('Markdown generation complete!')
}

generateMarkdownVersions().catch(console.error)
```

### 7. Integration Components

#### Environment Configuration
- Add environment variables for the base URL and site information
- Implement feature flags for selective enabling of features

```typescript
// .env.example
NEXT_PUBLIC_APP_URL=https://example.com
NEXT_PUBLIC_SITE_NAME=NextJet SaaS
NEXT_PUBLIC_SITE_DESCRIPTION=Modern SaaS template for Next.js
FEATURE_LLMS_TXT_ENABLED=true
```

#### Shared Configuration
- Create a centralized configuration system for site structure
- Maintain a single source of truth for URLs and content

```typescript
// lib/config.ts
interface SiteConfig {
  siteName: string
  siteDescription: string
  extendedDescription?: string
  baseUrl: string
  features: {
    llmsTxt: boolean
  }
}

export async function getSiteConfig(): Promise<SiteConfig> {
  return {
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'NextJet SaaS',
    siteDescription: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || 'Modern SaaS template for Next.js',
    extendedDescription: 'A comprehensive SaaS starter template with built-in authentication, payments, and user management.',
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || 'https://example.com',
    features: {
      llmsTxt: process.env.FEATURE_LLMS_TXT_ENABLED === 'true'
    }
  }
}
```

## Testing Implementation

### Robots.txt Testing
- Create automated tests to verify robots.txt format and rules
- Implement environment-specific testing to confirm different behavior

```typescript
// __tests__/robots.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import robotsHandler from '../app/robots'

describe('Robots.txt', () => {
  const originalEnv = process.env
  
  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv }
  })
  
  afterEach(() => {
    process.env = originalEnv
  })
  
  it('should block all crawlers in development environment', () => {
    process.env.NODE_ENV = 'development'
    
    const result = robotsHandler()
    
    expect(result.rules[0].userAgent).toBe('*')
    expect(result.rules[0].disallow).toBe('/')
  })
  
  it('should allow specific paths for production', () => {
    process.env.NODE_ENV = 'production'
    process.env.NEXT_PUBLIC_APP_URL = 'https://example.com'
    
    const result = robotsHandler()
    
    // Check default rules
    const defaultRule = result.rules[0]
    expect(defaultRule.userAgent).toBe('*')
    expect(defaultRule.allow).toBe('/')
    expect(defaultRule.disallow).toContain('/api/')
    
    // Check LLM rules
    const gptbotRule = result.rules.find(rule => rule.userAgent === 'GPTBot')
    expect(gptbotRule).toBeDefined()
    expect(gptbotRule.allow).toContain('/blog/')
    
    // Check sitemap reference
    expect(result.sitemap).toBe('https://example.com/sitemap.xml')
  })
})
```

### Sitemap Testing
- Implement tests to verify sitemap.xml format and included URLs
- Test dynamic content inclusion and priority mapping

```typescript
// __tests__/sitemap.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import sitemapHandler from '../app/sitemap'

// Mock the blog and docs functions
vi.mock('../lib/blog', () => ({
  getAllBlogPosts: vi.fn().mockResolvedValue([
    { slug: 'test-post', publishedAt: '2023-01-01', lastModified: '2023-02-01' }
  ])
}))

vi.mock('../lib/docs', () => ({
  getAllDocs: vi.fn().mockResolvedValue([
    { slug: 'getting-started', publishedAt: '2023-01-01' }
  ])
}))

describe('Sitemap.xml', () => {
  const originalEnv = process.env
  
  beforeEach(() => {
    vi.resetModules()
    process.env = { ...originalEnv, NEXT_PUBLIC_APP_URL: 'https://example.com' }
  })
  
  afterEach(() => {
    process.env = originalEnv
    vi.clearAllMocks()
  })
  
  it('should include static pages with correct priorities', async () => {
    const sitemap = await sitemapHandler()
    
    // Check homepage
    const homepage = sitemap.find(entry => entry.url === 'https://example.com')
    expect(homepage).toBeDefined()
    expect(homepage.priority).toBe(1)
    
    // Check other static pages
    const featuresPage = sitemap.find(entry => entry.url === 'https://example.com/features')
    expect(featuresPage).toBeDefined()
    expect(featuresPage.priority).toBe(0.9)
  })
  
  it('should include dynamic blog posts', async () => {
    const sitemap = await sitemapHandler()
    
    const blogPost = sitemap.find(entry => entry.url === 'https://example.com/blog/test-post')
    expect(blogPost).toBeDefined()
    expect(blogPost.lastModified).toBeInstanceOf(Date)
    expect(blogPost.priority).toBe(0.8)
  })
})
```

### LLMs.txt Testing
- Create tests to verify LLMs.txt format and content structure
- Test route handler functionality and content type headers

```typescript
// __tests__/llms.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { GET } from '../app/api/llms/route'

// Mock the config function
vi.mock('../lib/config', () => ({
  getSiteConfig: vi.fn().mockResolvedValue({
    siteName: 'Test Site',
    siteDescription: 'Test Description',
    extendedDescription: 'Extended test description',
    baseUrl: 'https://example.com'
  })
}))

describe('LLMs.txt', () => {
  it('should return content with correct headers', async () => {
    const response = await GET()
    
    expect(response.headers.get('Content-Type')).toBe('text/plain')
    
    const content = await response.text()
    expect(content).toContain('# Test Site')
    expect(content).toContain('> Test Description')
    expect(content).toContain('Extended test description')
    expect(content).toContain('## Documentation')
  })
})
```

### Markdown Conversion Testing
- Implement tests for HTML to Markdown conversion functionality
- Verify code block preservation and content cleaning

```typescript
// __tests__/markdown.test.ts
import { describe, it, expect } from 'vitest'
import { convertHtmlToMarkdown } from '../lib/markdown'

describe('HTML to Markdown conversion', () => {
  it('should convert basic HTML to markdown', async () => {
    const html = `
      <html>
        <head>
          <title>Test Page</title>
          <meta name="description" content="Test description">
        </head>
        <body>
          <h1>Test Heading</h1>
          <p>Test paragraph</p>
        </body>
      </html>
    `
    
    const markdown = await convertHtmlToMarkdown(html)
    
    expect(markdown).toContain('title: Test Page')
    expect(markdown).toContain('description: "Test description"')
    expect(markdown).toContain('# Test Heading')
    expect(markdown).toContain('Test paragraph')
  })
  
  it('should preserve code blocks with language', async () => {
    const html = `
      <html>
        <head><title>Code Test</title></head>
        <body>
          <pre><code class="language-javascript">function test() {
  return 'hello';
}</code></pre>
        </body>
      </html>
    `
    
    const markdown = await convertHtmlToMarkdown(html)
    
    expect(markdown).toContain('```javascript')
    expect(markdown).toContain('function test() {')
    expect(markdown).toContain('```')
  })
  
  it('should clean up navigation and footer elements', async () => {
    const html = `
      <html>
        <head><title>Clean Test</title></head>
        <body>
          <nav>Navigation</nav>
          <main>Main content</main>
          <footer>Footer</footer>
        </body>
      </html>
    `
    
    const markdown = await convertHtmlToMarkdown(html, {
      cleanupSelectors: ['nav', 'footer']
    })
    
    expect(markdown).not.toContain('Navigation')
    expect(markdown).toContain('Main content')
    expect(markdown).not.toContain('Footer')
  })
})
```

## Deployment and Integration Plan

### 1. Initial Setup
- Add required npm packages (turndown, jsdom, etc.)
- Configure environment variables for all environments
- Implement shared configuration system

### 2. Basic SEO Implementation
- Implement robots.txt using Next.js Metadata API
- Create sitemap.xml generation with static pages
- Add tests for both components

### 3. LLMs.txt Implementation
- Create the LLMs.txt route handler
- Implement markdown conversion functionality
- Add tests for the LLMs.txt handler

### 4. Markdown Generation
- Implement HTML to Markdown conversion utility
- Create middleware for dynamic markdown generation
- Add build script for static markdown generation

### 5. Integration and Testing
- Connect all components through shared configuration
- Implement comprehensive testing for all features
- Verify environment-specific behavior

### 6. Documentation and Monitoring
- Create documentation for maintaining the system
- Implement monitoring for detecting issues
- Set up regular validation of SEO components

## Success Criteria

The implementation will be considered successful when:

1. **Standard SEO Requirements**:
   - Robots.txt returns appropriate rules for different environments and user agents
   - Sitemap.xml includes all public content with correct metadata
   - Both components pass validation tools

2. **LLM Content Requirements**:
   - The LLMs.txt file is properly formatted and includes all required sections
   - Markdown versions of pages are accessible and properly formatted
   - HTML is correctly cleaned and converted to readable markdown

3. **Technical Requirements**:
   - All automated tests pass in all environments
   - Performance impact on the website is minimal
   - Build and deployment processes work reliably

4. **Maintenance Requirements**:
   - Content updates automatically reflect in all components
   - The system is well-documented and maintainable
   - Monitoring detects and reports any issues 