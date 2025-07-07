## Feature Development AI Session Instructions

I'm working on implementing a feature for our NextJet-based SaaS application and need assistance with development tasks.

### Feature Selection
**Important:** Please specify which feature you're working on by replacing `[feature_name]` in the paths below with the actual feature folder name.

Available features can be found in the `dev_new_features/features/todo/` directory. If you're unsure which features are available, you can check that directory or run:
```bash
ls dev_new_features/features/todo/
```

### Feature Context
Please review the following feature documentation files to understand the current state:

- **Feature Overview**: [`dev_new_features/features/todo/[feature_name]/feature_overview.md`](../dev_new_features/features/todo/[feature_name]/feature_overview.md)
- **Feature Requirements Document**: [`dev_new_features/features/todo/[feature_name]/docs/feature-requirements-document.md`](../dev_new_features/features/todo/[feature_name]/docs/feature-requirements-document.md)
- **Feature App Flow Document**: [`dev_new_features/features/todo/[feature_name]/docs/feature-app-flow.md`](../dev_new_features/features/todo/[feature_name]/docs/feature-app-flow.md)
- **Feature Implementation Plan**: [`dev_new_features/features/todo/[feature_name]/docs/feature-implementation-plan.md`](../dev_new_features/features/todo/[feature_name]/docs/feature-implementation-plan.md) (contains task status and progress tracking)
- **Feature Data Schema**: [`dev_new_features/features/todo/[feature_name]/docs/feature-data-schema.md`](../dev_new_features/features/todo/[feature_name]/docs/feature-data-schema.md)
- **Feature UX Considerations**: [`dev_new_features/features/todo/[feature_name]/docs/feature-ux-considerations.md`](../dev_new_features/features/todo/[feature_name]/docs/feature-ux-considerations.md)

### Instructions
1. Review the feature implementation plan, focusing on the current phase and tasks
2. Help me implement the specific tasks marked as "Not Started" (⬜) in the current phase
3. Follow the dependencies and sequence outlined in the implementation plan
4. Update the feature implementation plan as we complete tasks


### Today's Focus
Let's work on the next task from the current implementation phase. If all tasks in the current phase are completed or blocked, we'll move to the next phase according to the implementation plan.

### Implementation Guidelines
When implementing the feature:
1. Follow the NextJet architecture and coding standards
2. Utilize existing components and patterns where possible
3. Ensure proper error handling and validation
4. Write clean, maintainable code with appropriate comments
5. Consider performance implications of implementation choices
6. Ensure accessibility compliance for UI components
7. When implementing routers, reporisories etc, I suggest adding a comment detailingn prisma model in use for the route (this will help the ai ensure that the table/model properties are easily available and speed up development)


### Before Session End
Before we finish, please update the feature implementation plan file with:
- Task status updates (⬜ → ✅) for tasks we worked on
- Implementation Notes with today's date for significant decisions or progress
- Any challenges or blockers encountered

### Feature Documentation Maintenance
If our implementation requires changes to the feature documentation:
1. Update the relevant feature documentation files to reflect our implementation decisions
2. Ensure the Feature Data Schema document is updated if we made schema changes
3. Update the Feature App Flow document if we modified user flows
4. Add any new technical considerations to the appropriate documentation

### NextJet Reference
For NextJet-specific implementation guidance, refer to:
- [`documentation/general/nextjet_docs.md`](../documentation/general/nextjet_docs.md)
- [`documentation/general/frontend_guidelines_document.md`](../documentation/general/frontend_guidelines_document.md)
- [`documentation/general/backend_structure_document.md`](../documentation/general/backend_structure_document.md)

### Feature Completion
When all tasks in the implementation plan are complete:
1. Perform a final review of all feature documentation for accuracy
2. Ensure all implementation notes are properly documented
3. Verify that all acceptance criteria from the requirements document are met
4. Prepare to move the feature folder from `todo` to `completed` 