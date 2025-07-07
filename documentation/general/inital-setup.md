# Initial Project Setup Guide

## Overview

This document provides step-by-step instructions for setting up the NextJet SaaS project for the first time. Following these steps carefully will help avoid common setup issues and ensure a smooth development experience.

## Prerequisites

- Node.js (v18 or later recommended)
- pnpm package manager
- Git
- Access to a PostgreSQL database (or Neon.tech account)

## Setup Process

### 1. Environment Configuration

The first step is to set up your environment variables:

```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file and configure the following critical variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Connection string to your PostgreSQL database | `postgresql://user:password@localhost:5432/mydb` or Neon.tech URL |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js (generate with `openssl rand -base64 32`) | `your-generated-secret` |
| `NEXTAUTH_URL` | Base URL for authentication | `http://localhost:3000` |

> ⚠️ **Important**: The application will not function correctly without a valid `DATABASE_URL`. If using Neon.tech, ensure you've created a project and copied the connection string.

### 2. Package Installation

Install all dependencies using pnpm:

```bash
pnpm install
```

> 📝 **Note**: This may take a few minutes as it installs dependencies for all packages in the monorepo.

### 3. Database Setup

Initialize and migrate the database schema:

```bash
# Run Prisma migrations
pnpm db:migrate

# Push schema changes to the database
pnpm db:push
```

> ⚠️ **Troubleshooting**: If you encounter database connection errors, verify your `DATABASE_URL` is correct and that your database server is running.

### 4. Build the Project

Build all packages in the monorepo:

```bash
pnpm build
```

### 5. Start the Development Server

Launch the development server:

```bash
pnpm dev
```

This will start both the marketing site and dashboard applications.

## Verification Steps

After completing the setup, verify that:

1. The marketing site is accessible at `http://localhost:3000`
2. The dashboard is accessible at `http://localhost:3001`
3. Database tables have been created successfully

## Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Database connection errors | Double-check your `DATABASE_URL` and ensure your database server is running |
| Missing environment variables | Verify all required variables are set in your `.env` file |
| Build errors | Run `pnpm clean` followed by `pnpm install` and try again |
| Port conflicts | Check if other applications are using ports 3000 or 3001 |

## Next Steps

After successful setup, refer to:
- [Implementation Plan](../project/implementation-plan.md) for development tasks
- [NextJet Documentation](./nextjet_docs.md) for detailed feature information
- [Package Documentation](../template/guide) for in-depth guides to specific system components:
  - [AI API Integration](../template/guide/ai_api_calls.md)
  - [Email System](../template/guide/email.md)
  - [File Storage](../template/guide/file_storage.md)
  - [Queue System](../template/guide/queue.md)
  - [Logging](../template/guide/logger.md)
  - [Font Management](../template/guide/fonts.md)
  - [AI LLM Integration](../template/guide/ai_llm.md)
  - [AI Audio Processing](../template/guide/ai_audio.md)

These resources will help you understand the system architecture and begin development effectively.

## Related Documents
- [Tech Stack Document](./tech_stack_document.md)
- [Backend Structure Document](./backend_structure_document.md)