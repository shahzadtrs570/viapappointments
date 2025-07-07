---
title: AI Progress Tracker Instructions
related_docs:
  - path: documentation/project/project-requirements-document.md
  - path: documentation/project/implementation-plan.md
  - path: documentation/project/app-flow.md
---

## Related Documents
- [Project Requirements Document](../project/project-requirements-document.md)
- [Implementation Plan](../project/implementation-plan.md)
- [App Flow Documentation](../project/app-flow.md)

# Instructions for Maintaining the Implementation Plan and Progress Tracking

## Purpose
This document provides guidelines for AI agents to maintain an accurate record of project progress directly within the implementation plan. By keeping the implementation plan updated, you ensure continuity between work sessions, allowing seamless continuation of work if a session is interrupted or ends.

## When to Update the Implementation Plan

1. **Session Start**: 
   - Review the implementation plan at the beginning of each session
   - Note the "Current Implementation Status" section to understand the current focus
   - Verify the Project Status Overview for overall progress

2. **During Session**:
   - Update task statuses after completing significant tasks
   - Add implementation notes for important decisions or approaches
   - Document any blockers encountered

3. **Session End**:
   - Always update the implementation plan before concluding a session
   - Update the "Current Implementation Status" section with next tasks
   - Ensure the "Last Updated" date is current

## How to Update the Implementation Plan

### Task Status Updates

1. Update the status indicator for each task:
   - ⬜ Not Started: Task has not been begun
   - 🟡 In Progress: Work has started but is not complete
   - ✅ Completed: Task is finished
   - ⚠️ Blocked: Progress is blocked by an issue (add details in "Blockers" section)

2. Update the Project Status Overview table:
   - Adjust the completion counts (e.g., "1/4") for each phase
   - Update the status indicator for each phase based on progress:
     - ⬜ Not Started: No tasks in the phase have been started
     - 🟡 In Progress: Some tasks are in progress or completed, but not all
     - ✅ Completed: All tasks in the phase are completed
     - ⚠️ Blocked: Progress on the phase is blocked

### Updating Current Implementation Status

1. **Last Updated**: Change to the current date
2. **Current Focus**: Update with the specific task currently being worked on
3. **Blockers**: Add any issues preventing progress and potential solutions
4. **Next Tasks**: List the next 2-3 tasks that should be tackled in priority order

### Adding Implementation Notes

1. In the "Implementation Notes" section:
   - Add dated entries for significant implementation decisions
   - Document any approaches or solutions to challenging problems
   - Note any deviations from the original plan with justifications

## Best Practices

1. **Be Specific**: Reference task numbers (e.g., "Task 3.2") when discussing progress
2. **Be Concise**: Keep updates brief but informative
3. **Maintain Dependencies**: If discovering new dependencies, update the dependencies column
4. **Document Code Paths**: Include specific file paths and component names in notes
5. **Include References**: Link to specific documentation or resources used
6. **Manage Sessions Effectively**: Start a new session after completing each significant task to maintain clean context and prevent context overflow
7. **Focus on One Task**: Complete only one task at a time before starting a new session to maintain clarity and prevent context overflow

## Session Management Guidelines

1. **When to Start a New Session**:
   - After completing a significant task or milestone
   - Before switching to work on a different component or feature
   - When needing to reference or modify multiple additional documents
   - If you encounter context limitations or errors related to context length

2. **End of Session Checklist**:
   - Update the implementation plan with current progress
   - Document the exact stopping point in the "Current Focus" section
   - List specific next steps in the "Next Tasks" section
   - Ask the user: "Would you like to mark this task as complete and start a new session for the next task?"
   - If the user confirms completion, explicitly instruct them to start a new session for the next task
   - Remind the user that each session should focus on completing a single task

3. **Beginning a New Session**:
   - Review the implementation plan to reestablish context
   - Confirm the next task from the "Next Tasks" section
   - Clearly state the single task that will be the focus of the current session
   - Proceed with implementation of only that task
   - Do not attempt to complete multiple tasks in a single session

## Example Update Process

1. Review the current implementation plan
2. Update status indicators for completed or in-progress tasks
3. Update the Project Status Overview counts and statuses
4. Update the Current Implementation Status section
5. Add any relevant Implementation Notes
6. Verify that the Next Tasks accurately reflect the logical next steps
7. Instruct the user to start a new session before beginning the next task

The AI agent should treat maintaining this implementation plan as a critical part of the development process, ensuring it accurately reflects the current state of the project at all times.

- Guidelines for maintaining implementation progress
- Helps AI track work across development sessions
- Reference this when working on multi-step features

# Important to remember
only update the project status never change (add, edit, delete) items from the implementation plans