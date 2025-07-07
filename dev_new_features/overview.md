# Documentation Overview

This document provides a high-level overview of the `dev_new_features` folder and the files within it.

## Folder Structure

```
dev_new_features/                          # Root folder for all new features
├── overview.md                            # This file - explains folder structure and workflow
├── how_to_docs/                           # Documentation on how to use this system
├── features/                              # Contains all features
│   ├── template/                          # Template for creating new features
│   │   ├── feature_overview.md            # Template overview file
│   │   └── docs/                          # Template documentation files
│   │       ├── feature-app-flow.md
│   │       ├── feature-data-schema.md
│   │       ├── feature-implementation-plan.md
│   │       ├── feature-requirements-document.md
│   │       └── feature-ux-considerations.md
│   ├── todo/                              # Features in development
│   │   └── [feature]/                     # Individual feature folder
│   │       ├── feature_overview.md        # Feature overview
│   │       └── docs/                      # Feature documentation
│   └── completed/                         # Completed features
│       └── [feature]/                     # Individual completed feature
│           ├── feature_overview.md        # Feature overview
│           └── docs/                      # Feature documentation
```

## Feature Development Workflow

1. **Create New Feature**: 
   - Copy the entire `template` folder to the `todo` folder
   - Rename the copied folder to your feature name
   - Update all template files with feature-specific information

2. **Develop Feature**:
   - Follow the implementation plan in the feature documentation
   - Update documentation as development progresses
   - Track progress in the feature-implementation-plan.md file

3. **Complete Feature**:
   - When feature is fully implemented, move the feature folder from `todo` to `completed`
   - Ensure all documentation is finalized before moving

## Feature Documentation Files

### Feature Overview
**Path:** `features/todo/[feature]/feature_overview.md`
- The central document providing a high-level overview of the feature
- Links to all detailed documentation files
- Includes key capabilities, target users, and technical summary
- Serves as the entry point for understanding the feature

### Feature Requirements Document
**Path:** `features/todo/[feature]/docs/feature-requirements-document.md`
- Defines the feature's requirements, scope, and objectives
- Contains detailed specifications and acceptance criteria
- Serves as the primary reference for development decisions

### Feature App Flow Document
**Path:** `features/todo/[feature]/docs/feature-app-flow.md`
- Details the user journey and navigation flows for the feature
- Describes interactions, transitions, and user experience
- Maps out how users interact with the feature

### Feature Implementation Plan
**Path:** `features/todo/[feature]/docs/feature-implementation-plan.md`
- Provides a phased approach to implementing the feature
- Breaks down development into clear, actionable tasks
- Includes technical details and file paths for implementation
- Used to track implementation progress

### Feature Data Schema Documentation
**Path:** `features/todo/[feature]/docs/feature-data-schema.md`
- Defines the data models and relationships for the feature
- Details schema changes, operations, and integration points
- Provides implementation considerations for data handling

### Feature UX Considerations
**Path:** `features/todo/[feature]/docs/feature-ux-considerations.md`
- Outlines user experience principles for the feature
- Details interaction patterns and accessibility requirements
- Provides guidance for creating intuitive interfaces

## General Documentation References

The following documents in the main documentation folder provide additional context and guidance:

### NextJet Documentation
**Path:** `documentation/general/nextjet_docs.md`
- Comprehensive guide to the NextJet SaaS starter kit
- Reference for platform capabilities and best practices

### Frontend Guidelines
**Path:** `documentation/general/frontend_guidelines_document.md`
- Details frontend architecture and development standards
- Guidance for component development and styling

### Backend Structure Document
**Path:** `documentation/general/backend_structure_document.md`
- Outlines the backend architecture and API structure
- Reference for database and service implementation

### Tech Stack Document
**Path:** `documentation/general/tech_stack_document.md`
- Overview of all technologies used in the project
- Explains technology choices and integration approaches

### Project Structure Maintenance
**Path:** `documentation/general/project_structure_maintenance.md`
- Guidelines for maintaining project structure documentation
- Best practices for documentation updates

## Progress Tracking

When implementing features, follow these guidelines for tracking progress:

1. Update **only** the feature implementation plan (`features/todo/[feature]/docs/feature-implementation-plan.md`)
2. Do not modify the original project implementation plan
3. Mark tasks as complete as they are finished
4. Add implementation notes with dates for significant decisions

Reference these documents for detailed tracking instructions:
- `documentation/general/progress-tracker-instructions.md`
- `documentation/general/ai-progress-tracker-instructions.md`

## Helper Tools

### Source to Prompt Helper
**Path:** `prompts_helper/source-to-prompt.html`
- Web-based tool for converting source code to AI prompts
- Helps create context-rich prompts for AI assistance

### Generic AI Session Prompt for Features
**Path:** `prompts_helper/generic-features-ai-session-prompt.md`
- Template for structuring AI development sessions
- Maintains context across development sessions

## Usage Guidelines

1. Start with the Feature Overview to understand the feature at a high level
2. Review the Feature Requirements Document for detailed specifications
3. Reference the App Flow Document to understand user interactions
4. Review the Data Schema Documentation for data model changes
5. Follow the Implementation Plan for development tasks
6. Refer to UX Considerations for interface implementation
7. Use general documentation for platform-specific guidance
8. Track progress in the Implementation Plan
9. Leverage helper tools for AI assistance when needed

This documentation structure ensures comprehensive coverage of all aspects of feature development while maintaining clear relationships between different components. 