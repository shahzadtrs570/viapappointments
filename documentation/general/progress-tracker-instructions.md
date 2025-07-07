---
title: Progress Tracker Instructions
related_docs:
  - path: documentation/project/implementation-plan.md
    relationship: "implements"
  - path: documentation/project/project-requirements-document.md
    relationship: "references"
---

## Related Documents
- [Implementation Plan](../project/implementation-plan.md) - The main document this instruction set is designed to maintain
- [Project Requirements Document](../project/project-requirements-document.md)

# Instructions for Maintaining the Implementation Plan

## Purpose
This document provides guidelines for AI agents to maintain an accurate record of project progress directly within the implementation plan (`../project/implementation-plan.md`). By keeping the implementation plan updated, you ensure continuity between work sessions, allowing seamless continuation of work with minimal context loss.

## Key Sections to Update in Implementation Plan

### 1. Project Status Overview Table
This table should be maintained at the top of the implementation plan:

```
| Phase | Status | Completion | Dependencies |
|-------|--------|------------|--------------|
| 1. Project Setup & Configuration | 🟡 In Progress | 2/4 | None |
```

- **Status**: Update the emoji indicator based on phase progress:
  - ⬜ Not Started: No tasks in the phase have been started
  - 🟡 In Progress: Some tasks are in progress or completed, but not all
  - ✅ Completed: All tasks in the phase are completed
  - ⚠️ Blocked: Progress on the phase is blocked by an issue

- **Completion**: Update the fraction (e.g., "2/4") to reflect completed tasks vs. total tasks

### 2. Current Implementation Status
This section provides the immediate focus and next steps:

```
**Last Updated:** February 25, 2025

**Current Focus:** Implementing user authentication in NextAuth.js

**Blockers:** Waiting for OAuth credentials from the client

**Next Tasks:** 
1. Complete user model extension once credentials received
2. Set up protected API routes
3. Implement role-based middleware
```

- **Last Updated**: Change to the current date when making updates
- **Current Focus**: The specific task currently being worked on
- **Blockers**: Any issues preventing progress, with potential solutions
- **Next Tasks**: The next 2-3 tasks in priority order

### 3. Individual Task Status
Each task in the implementation plan has a status indicator:

```
1. **Configure Project Base** ✅
```

Update these indicators based on progress:
- ⬜ Not Started: Task has not been begun
- 🟡 In Progress: Work has started but is not complete
- ✅ Completed: Task is finished
- ⚠️ Blocked: Progress is blocked by an issue

### 4. Implementation Notes
Add dated entries for significant decisions or approaches:

```
## Implementation Notes

February 25, 2025: Decided to use custom middleware for rate limiting instead of a third-party package to reduce dependencies and better integrate with existing auth flow.
```

## When to Update the Implementation Plan

1. **Session Start**: 
   - Review the implementation plan to understand current progress
   - Note the "Current Implementation Status" section to identify the current focus

2. **During Session**:
   - After completing significant tasks, update their status indicators
   - If encountering blockers, document them in the "Blockers" section

3. **Session End**:
   - Always update the implementation plan before concluding a session
   - Update the Project Status Overview table
   - Update the Current Implementation Status section
   - Add any Implementation Notes for major decisions made

## Update Process Example

### Before Session:
```
**Current Focus:** Set up initial project structure
**Blockers:** None
**Next Tasks:**
1. Configure Project Base ⬜
2. Update Brand Assets ⬜
3. Configure Database Connection ⬜

## Phase 1: Project Setup & Configuration
1. **Configure Project Base** ⬜
```

### After Session:
```
**Current Focus:** Update brand assets and typography
**Blockers:** None
**Next Tasks:**
1. Update Brand Assets 🟡
2. Configure Database Connection ⬜
3. Configure Authentication Providers ⬜

## Phase 1: Project Setup & Configuration
1. **Configure Project Base** ✅
```

## Best Practices

1. **Be Specific**: Reference task numbers and phases from the implementation plan when discussing progress
2. **Be Concise**: Keep updates brief but informative
3. **Maintain Dependencies**: Update dependencies if new ones are discovered
4. **Document Code Paths**: Include specific file paths and component references as defined in the implementation plan
5. **Reference Documents**: Link to specific sections of the PRD or App Flow document using relative paths

Remember: The implementation plan (`../project/implementation-plan.md`) is the source of truth for project progress. These instructions ensure it remains accurate and useful across development sessions.

# Important to remember
only update the project status never change (add, edit, delete) items from the implementation plans