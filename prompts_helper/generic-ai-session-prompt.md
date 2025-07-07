## AI Session Instructions

I'm working on a NextJet-based project and need assistance with development tasks. 

### Project Context
Please review the following project files to understand our current state:

- **Project Requirements Document (PRD)**: [`documentation/project/project-requirements-document.md`](../documentation/project/project-requirements-document.md)
- **App Flow Document**: [`documentation/project/app-flow.md`](../documentation/project/app-flow.md)
- **Implementation Plan**: [`documentation/project/implementation-plan.md`](../documentation/project/implementation-plan.md) (contains task status and progress tracking)

### Instructions
1. Review the implementation plan, focusing on the "Current Implementation Status" section
2. Help me with the task listed in the "Current Focus" section
3. Follow dependencies and priorities as outlined in the plan
4. Update the implementation plan as we complete tasks
5. **IMPORTANT: DO NOT modify the README.md file under any circumstances**
6. As you implement apis, prisma db changes etc please modify the routers, reporisories etc, I suggest adding a comment detailing prisma model in use for the route (this will help the ai ensure that the table/model properties are easily available and speed up development)


### Today's Focus
Let's work on the Current Focus task from the implementation plan. If that's blocked or completed, we'll move to the next priority task from the "Next Tasks" list.

### Before Session End
Before we finish, please update the implementation plan file with:
- Task status updates (⬜ → 🟡 → ✅) for tasks we worked on
- Project Status Overview table updates
- Current Implementation Status section updates
- Any Implementation Notes with today's date for significant decisions
- Update the project structure file (`documentation/structure/project-structure.md`) if we've added, removed, or moved files during this session

### Project Structure Maintenance
Please help maintain an accurate project structure documentation as outlined in [`documentation/general/project_structure_maintenance.md`](../documentation/general/project_structure_maintenance.md):

- If we've created, deleted, or moved files during this session, update the project structure file
- For Windows PowerShell, use:
  ```powershell
  Get-ChildItem -Path . -Recurse -File | Where-Object { $_.FullName -notmatch "node_modules|\.git|\.next" } | Select-Object -ExpandProperty FullName | Sort-Object | Out-File -FilePath documentation/structure/project-structure.md
  ```
- This helps maintain an accurate representation of the codebase for future AI assistance

### Schema Implementation Guidelines
When working with database schemas or data models:
- Review and adhere strictly to `documentation/project/data-schema.md` if it exists
- Do not create database tables, fields, or relationships not explicitly defined there
- Verify all implementations against this document before finalizing

### Protected Files
The following files should NEVER be modified without explicit permission:
- README.md - This file is maintained manually and should not be updated by AI

