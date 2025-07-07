# Tech Stack Document

## Introduction

This document explains the technology choices behind our web platform. The platform is built on a robust foundation that emphasizes scalability, clean code, best practices, customization, and developer experience. Every technology mentioned here has been carefully selected to provide an enjoyable and secure experience for all users.

## Frontend Technologies

Our user interface is built with modern web technologies that ensure a clean, responsive design and smooth interactions. We use Next.js for server-side rendering and routing, along with React for building user interfaces and TypeScript for static typing. Tailwind CSS is used for styling, with ShadCN UI components providing polished and accessible UI elements. This combination helps users quickly find the information they need while enjoying a professional, modern look.

The frontend also leverages:
- Tanstack Query for data fetching
- Zod for data validation
- React Email templates for email communications

## Backend Technologies

The backbone of our platform is powered by a comprehensive set of technologies designed for performance and reliability:

- tRPC for type-safe APIs
- Prisma for database ORM (compatible with various database systems)
- Auth.js for authentication with multiple providers (Magic Link, Google OAuth, Github OAuth)
- Stripe or Lemon Squeezy for payments
- Resend for email delivery ([detailed documentation](../template/guide/email.md))
- Tinybird for analytics
- AI integrations with OpenAI and Anthropic ([API integration docs](../template/guide/ai_api_calls.md), [LLM usage](../template/guide/ai_llm.md))
- Background job processing with Queue system ([Queue documentation](../template/guide/queue.md))
- Comprehensive logging system ([Logger documentation](../template/guide/logger.md))
- Unified file storage interface ([File Storage documentation](../template/guide/file_storage.md))

Our monorepo structure organizes the project into apps and packages:

### Apps Directory
- **marketing**: Public-facing marketing site, including blog, docs, and legal pages
- **dashboard**: Main application for the SaaS product

### Packages Directory
- **api**: tRPC API
- **auth**: Authentication logic
- **configs**: Shared configurations (ESLint, Prettier, Tailwind, TypeScript)
- **crisp**: Crisp chat support widget integration
- **db**: Prisma database schema and migrations
- **email**: Email templates and provider
- **payments**: Payment provider integrations (Stripe, Lemon Squeezy)
- **ui**: Shared UI components (ShadCN and custom)
- **utils**: Shared constants and utility functions
- **validations**: Shared Zod validations

## Infrastructure and Deployment

Our deployment strategy is designed for stability and ease of updates. The platform can be deployed to various services like Vercel (recommended), Netlify, or AWS Amplify. Continuous integration and delivery pipelines are set up to automate testing and deployment. Version control through Git helps our team work efficiently even when making frequent changes.

The deployment process is streamlined with clear steps for:
- Database setup and migration
- Domain configuration
- Environment variables setup
- Hosting configuration

The monorepo structure powered by Turborepo provides efficient builds and a clear separation of concerns between applications and shared packages.

## Third-Party Integrations

The platform benefits from AI service integrations that enhance functionality and user satisfaction:

- **Anthropic Claude**: Can be used for generating content, answering user questions, or providing personalized recommendations
- **OpenAI (GPT-4)**: Available for smart insights and content generation
- **Google Gemini**: Another AI option for various natural language processing tasks

These AI integrations are designed to enhance user experience without requiring excessive custom development.

## Security and Performance Considerations

Security is a top priority, and our tech stack reflects that commitment. With secure authentication methods provided by Auth.js, user data is managed safely, and appropriate role-based access is enforced through a comprehensive authorization system. The platform implements both Role-Based Access Control (RBAC) and Policy-Based Access Control (PBAC).

The frontend's use of frameworks like Next.js and Tailwind CSS contributes to fast load times and responsive design, which are crucial for performance. Optimizations in data fetching and rendering ensure that users experience a smooth, lag-free interaction with the platform.

## Conclusion and Overall Tech Stack Summary

In summary, our platform is built using a carefully selected combination of modern technologies that together deliver a responsive, secure, and user-friendly experience. The frontend relies on Next.js, React, TypeScript, and Tailwind CSS with ShadCN UI components for a modern, accessible design. The backend is robustly supported by tRPC, Prisma, and Auth.js, while also integrating payment solutions through Stripe or Lemon Squeezy.

Hosting and deployment are streamlined through automated pipelines and version control, and AI integrations provide enhanced functionality. This thoughtful approach to our tech stack not only meets current needs but also offers flexibility for future growth, making our platform scalable and maintainable.
