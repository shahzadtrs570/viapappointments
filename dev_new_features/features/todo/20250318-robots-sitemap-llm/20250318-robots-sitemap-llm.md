# SEO and LLM Content Strategy Requirements

## Overview

This document outlines the requirements and implementation details for a comprehensive SEO and LLM content strategy for the NextJet SaaS template, including robots.txt, sitemap.xml, and LLMs.txt implementation following Jeremy Howard's proposal.

## Background

### SEO and Web Crawlers
Search Engine Optimization (SEO) is critical for website visibility. Standard tools like robots.txt and sitemap.xml help search engines efficiently crawl and index website content, improving search rankings and user discovery.

### LLM Content Accessibility
Large language models (LLMs) increasingly rely on website information but face limitations with context windows that are too small to handle most websites in their entirety. The LLMs.txt standard provides a way for websites to offer LLM-friendly content, guiding AI assistants to the most relevant information in accessible formats.

## Core Requirements

### 1. Robots.txt Implementation

The system must provide a `/robots.txt` file at the root of the website that:

- Controls access for standard web crawlers (Google, Bing, etc.)
- Includes specific rules for LLM crawlers (GPTBot, Anthropic-AI, Claude-Web, etc.)
- References the sitemap location
- Provides environment-aware rules (production vs. development)

#### Implementation Details

- Use Next.js Metadata API via a `robots.ts` file in the app directory
- Configure different rules based on environment variables
- Include all known LLM crawlers with appropriate access rules
- Update regularly as new LLM crawlers emerge

#### Example format:
```
# Standard crawlers
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/

# LLM-specific crawlers
User-agent: GPTBot
Allow: /blog/
Allow: /docs/
Allow: /faq/
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /auth/

User-agent: Anthropic-AI
Allow: /blog/
Allow: /docs/
Allow: /faq/
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/
Disallow: /auth/

Sitemap: https://example.com/sitemap.xml
```

### 2. Sitemap.xml Implementation

The system must generate a `/sitemap.xml` file that:

- Lists all important public-facing pages
- Includes last modified dates for each page
- Sets appropriate priority levels for different content types
- Includes change frequency information
- Dynamically includes content from various sections (blog, docs, etc.)
- Excludes non-public pages (admin, dashboard, etc.)

#### Implementation Details

- Use Next.js Metadata API via a `sitemap.ts` file in the app directory
- Create helper functions to scan content directories
- Implement priority mapping for different content types
- Generate separate sitemaps for different applications (marketing vs. dashboard)
- Consider sitemap indexing for very large sites

#### Content Sources

The sitemap should include content from:
- Static pages (homepage, features, pricing, etc.)
- Blog posts with proper last modified dates
- Documentation pages with appropriate change frequency
- Legal pages with lower priority settings
- Landing pages with high priority settings

#### Example format:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-03-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/blog/article-1</loc>
    <lastmod>2024-03-10</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 3. LLMs.txt File Implementation

The system must provide an `/llms.txt` file at the root of the website following Jeremy Howard's specification with the following structure:

- **H1 Title**: The name of the project/website (required)
- **Blockquote**: A short summary of the project with key information (required)
- **Additional Information**: Optional paragraphs with more detailed information
- **Section Headers**: H2 headers for organizing different types of content
- **File Lists**: Markdown lists with links to key resources and optional descriptions

#### Implementation Details

- Create a custom route handler at `/llms.txt`
- Return proper content type (`text/plain`) headers
- Generate content dynamically based on site configuration
- Link to markdown versions of important content
- Organize content by importance with optional sections for supplementary information

#### Content Organization

The llms.txt file should organize content in a logical hierarchy:
- **Documentation**: Core reference material for understanding the product
- **Tutorials/Guides**: Step-by-step instructions for completing tasks
- **Examples**: Practical implementations and use cases
- **Optional**: Supplementary resources that may not be needed for basic understanding

#### Example format:
```markdown
# Project Name

> Brief description of the project that provides essential context

Additional details about the project go here

## Documentation

- [Getting Started](https://example.com/docs/getting-started.md): Introduction to the project
- [API Reference](https://example.com/docs/api.md): Detailed API documentation

## Examples

- [Basic Example](https://example.com/examples/basic.md): Simple implementation example

## Optional

- [Advanced Topics](https://example.com/docs/advanced.md): Additional information for power users
```

### 2. Markdown Versions of Pages

The system must:

1. Generate markdown versions of HTML pages by appending `.md` to URLs
2. Ensure URLs without file extensions have `/index.html.md` appended
3. Clean the HTML before conversion, removing navigation bars, footers, and other non-essential content
4. Include proper YAML frontmatter with metadata (title, description, etc.)
5. Preserve code blocks with proper language syntax highlighting

### 3. Implementation Components

#### Route Handler
- Create an API route at `/llms.txt` that returns the markdown content
- Set proper `Content-Type: text/plain` headers
- Include dynamic content based on the site configuration

#### Middleware
- Intercept requests ending in `.md` or `.html.md`
- Fetch and convert the original HTML content to markdown
- Return properly formatted markdown with appropriate headers

#### Build Process Integration
- Generate static markdown versions during the build process
- Create a script that runs after the Next.js build completes
- Store markdown files alongside HTML files in the output directory

#### HTML to Markdown Conversion
- Use a reliable HTML to markdown converter (e.g., Turndown)
- Add custom rules for handling code blocks, tables, and other complex elements
- Clean HTML by removing non-essential elements before conversion

### 4. Content Guidelines

The LLMs.txt file should:

- Use concise, clear language
- Include brief, informative descriptions for linked resources
- Avoid ambiguous terms or unexplained jargon
- Organize content by importance, with optional content clearly marked
- Link to markdown versions of pages (URLs ending in `.md`)

## Integration Between Components

These features should be integrated for a cohesive SEO and LLM strategy:

1. **Cross-References**: 
   - Robots.txt should reference the sitemap location
   - LLMs.txt may reference the sitemap if appropriate
   - Sitemap should include all public pages referenced in LLMs.txt

2. **Shared Configuration**:
   - Use shared content configuration to ensure consistency
   - Maintain a single source of truth for site structure
   - Centralize URL management to prevent discrepancies

3. **Meta Tags**:
   - Include standard SEO meta tags on all pages
   - Add AI-specific meta tags in page headers where relevant
   - Ensure canonical URLs are properly specified

## Testing Requirements

### Robots.txt Testing
1. Verify robots.txt is accessible at the root URL
2. Confirm that environment-specific rules are applied correctly
3. Test different user-agent access with tools like curl
4. Validate syntax with Google's robots.txt testing tool

### Sitemap Testing
1. Verify sitemap.xml is accessible at the specified URL
2. Validate XML format against the sitemap schema
3. Confirm all public pages are included with correct metadata
4. Test sitemap submission to Google Search Console
5. Verify dynamic content (blog posts, docs) is properly included

### LLMs.txt Testing
1. Verify the llms.txt file is accessible and properly formatted
2. Confirm markdown versions of pages are available by appending `.md` to URLs
3. Test with different page types (documentation, blog posts, etc.)
4. Ensure the build process correctly generates markdown versions
5. Validate that HTML is properly cleaned and converted to readable markdown

## Deployment Considerations

### Production Configuration
1. Ensure environment variables are properly configured in production
2. Set up proper caching headers for all static files
3. Configure CDN caching for robots.txt, sitemap.xml, and llms.txt
4. Monitor performance impact of dynamic markdown conversion

### Build Process
1. Automate generation of all SEO components during build
2. Pre-generate markdown versions during build for high-traffic pages
3. Include validation steps in the CI/CD pipeline
4. Add monitoring for broken links or invalid content

### Multi-Environment Support
1. Configure environment-specific robots.txt rules (block all crawlers in development)
2. Use dynamic base URLs based on the deployment environment
3. Implement feature flags to selectively enable features in different environments 
4. Provide testing environments that don't impact production search rankings

## Implementation Components

### Next.js Integration

The implementation should leverage Next.js features:

1. **App Router API Routes**:
   - Use Next.js App Router's route handlers for dynamic routes
   - Implement robots.ts and sitemap.ts using Next.js Metadata API
   - Create a custom route handler for llms.txt

2. **Build Process Integration**:
   - Add post-build scripts to generate markdown versions
   - Configure custom middleware for handling .md requests
   - Set up proper caching for static files

3. **Environment Configuration**:
   - Use environment variables for base URLs and site info
   - Create environment-specific configurations (dev/prod)
   - Implement feature flags for selective enabling of features

## Success Criteria

The implementation will be considered successful when:

1. **Standard SEO Requirements**:
   - Robots.txt is properly implemented with rules for all relevant crawlers
   - Sitemap.xml includes all public content with correct metadata
   - Search engines correctly index the site as verified in Search Console

2. **LLM Content Requirements**:
   - The llms.txt file is available and follows the specified format
   - Markdown versions of pages are accessible by appending `.md` to URLs
   - Content is clean, readable, and properly formatted for LLMs

3. **Technical Requirements**:
   - All components integrate without conflicts
   - Performance impact on the website is minimal
   - Build and deployment processes work reliably
   - Components function correctly in all environments

4. **Maintenance Requirements**:
   - Updates to content automatically reflect in all components
   - Documentation exists for maintaining the system
   - Monitoring is in place to detect issues