---
title: Project Structure Maintenance
related_docs:
  - path: documentation/general/tech_stack_document.md
  - path: documentation/general/frontend_guidelines_document.md
  - path: documentation/general/backend_structure_document.md
---

# Project Structure Maintenance

## Introduction

Maintaining an accurate representation of the project structure is essential for effective development, onboarding, and AI assistance. This document outlines the procedures and best practices for keeping the project structure documentation up-to-date throughout the development lifecycle.

## Project Structure File

The project structure is documented in a dedicated file:

- **Location**: `documentation/structure/project-structure.md`
- **Purpose**: Provides a comprehensive overview of all files and directories in the project
- **Format**: Tree-like representation showing the hierarchical organization of the codebase

## When to Update

The project structure file should be updated in the following scenarios:

1. **After adding new files or directories**: When creating new components, pages, or other project files
2. **After removing files or directories**: When deleting or refactoring parts of the codebase
3. **After restructuring**: When moving files or reorganizing the project structure
4. **Before committing significant changes**: As part of the pre-commit process for major feature additions
5. **During regular maintenance**: Weekly review to ensure accuracy

## How to Update

### Automatic Update (Recommended)

#### Using the Project Script (Preferred Method)

The project includes a dedicated script that works on both Windows and Unix/Linux systems:

```bash
# Run the script to generate the project structure
node scripts_local_helpers/generate-project-tree.js
```

This script will automatically:
- Exclude common patterns like node_modules, .git, etc.
- Respect .gitignore patterns
- Format the output consistently
- Save the result to `documentation/structure/project-structure.md`

Use this script whenever possible as it provides the most consistent results across all platforms.

### Patterns to Exclude

The following patterns should always be excluded from the project structure documentation:

```
node_modules/     # Dependencies
.git/            # Git directory
.next/           # Next.js build
.turbo/          # Turbo build cache
.vercel/         # Vercel deployment
build/           # Build outputs
dist/            # Distribution files
coverage/        # Test coverage
.husky/          # Git hooks
.vscode/         # Editor config
.DS_Store        # Mac system files
.env*            # Environment files
out/             # Output directory
```

### Respecting .gitignore

If a `.gitignore` file exists in your project, you should also respect its patterns. The project script automatically handles this, but if you're using manual commands:

#### For Windows PowerShell

```powershell
# Function to get combined ignore patterns
$ignorePatterns = @(
    Get-Content .gitignore -ErrorAction SilentlyContinue
    "node_modules/"
    ".git/"
    ".next/"
    ".turbo/"
    ".vercel/"
    "build/"
    "dist/"
    "coverage/"
    ".husky/"
    ".vscode/"
    ".DS_Store"
    ".env*"
    "out/"
) | Where-Object { $_ -and -not $_.StartsWith('#') } | Select-Object -Unique

# Generate structure respecting all patterns
tree /F /A | Where-Object {
    $line = $_
    -not ($ignorePatterns | Where-Object { $line -match [regex]::Escape($_) })
} > documentation/structure/project-structure.md
```

#### For Unix/Linux/macOS

```bash
# Combine .gitignore with default patterns
{
    cat .gitignore 2>/dev/null
    echo "node_modules/"
    echo ".git/"
    echo ".next/"
    echo ".turbo/"
    echo ".vercel/"
    echo "build/"
    echo "dist/"
    echo "coverage/"
    echo ".husky/"
    echo ".vscode/"
    echo ".DS_Store"
    echo ".env*"
    echo "out/"
} | grep -v '^#' | sort -u > .combined_ignore

# Generate structure using combined patterns
tree --ignore-file .combined_ignore --dirsfirst -a -F > documentation/structure/project-structure.md
rm .combined_ignore
```

### Manual Update

If automatic generation is not feasible:

1. Open the project structure file
2. Add, remove, or modify entries to reflect the current state of the project
3. Maintain consistent indentation and formatting
4. Include all significant files and directories
5. Exclude development artifacts and dependencies as listed above
6. Add a section listing excluded patterns for clarity

## Importance for AI Assistance

An up-to-date project structure file is particularly valuable for AI-assisted development:

1. **Codebase Understanding**: Helps AI tools understand the organization without scanning the entire project
2. **Efficient Navigation**: Enables AI to quickly locate relevant files for specific tasks
3. **Context Awareness**: Provides context about related files and components
4. **Reduced Scanning**: Minimizes the need for resource-intensive codebase scanning
5. **Better Recommendations**: Improves the quality of AI suggestions and code generation

## Best Practices

1. **Consistency**: Use consistent formatting and indentation
2. **Completeness**: Include all significant project files
3. **Clarity**: Organize the structure in a logical, easy-to-understand manner
4. **Automation**: Prefer automated generation to ensure accuracy
5. **Regular Review**: Periodically verify the structure's accuracy
6. **Documentation**: Include brief descriptions for key directories and files
7. **Clean Output**: Exclude development artifacts and dependencies

## Protected Files

The following files should NEVER be modified by AI assistants without explicit permission from the project owner:

1. **README.md**: This file is maintained manually and contains specific project information that should not be automatically updated.
2. **LICENSE**: Contains legal information that should only be modified by authorized personnel.
3. **.env.example**: Template for environment variables that should remain stable.

AI assistants should not suggest or make changes to these files unless specifically requested to do so.

## Integration with Development Workflow

To ensure the project structure documentation remains current:

1. **Add to CI/CD**: Include structure file generation in continuous integration pipelines
2. **Pre-commit Hook**: Set up a pre-commit hook to remind developers to update the structure
3. **Review Process**: Include structure file review in pull request checklists
4. **AI Session Preparation**: Update before AI pair programming sessions

## Troubleshooting Common Issues

### Script Execution Issues

If you encounter issues running the project script:

```bash
# Make sure you're in the project root directory
cd /path/to/project/root

# Check if Node.js is installed
node --version

# Try running with full path
node ./scripts_local_helpers/generate-project-tree.js
```

### PowerShell Execution Policy Restrictions

If you encounter execution policy restrictions in PowerShell:

```powershell
# Check current execution policy
Get-ExecutionPolicy

# Set to allow script execution for current session only
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
```

### Missing Tree Command on Unix Systems

If the `tree` command is not available:

```bash
# Ubuntu/Debian
sudo apt-get install tree

# macOS with Homebrew
brew install tree

# Alternative using find if tree cannot be installed
find . -type d -not -path "*/node_modules/*" -not -path "*/.git/*" | sort
```

## Conclusion

By maintaining an accurate project structure file, you enhance collaboration, improve onboarding for new developers, and enable more effective AI-assisted development. Regular updates to this documentation ensure that everyone working on the project has a clear understanding of the codebase organization.

## Related Documents

- [Tech Stack Documentation](./tech_stack_document.md)
- [Frontend Guidelines](./frontend_guidelines_document.md)
- [Backend Structure Document](./backend_structure_document.md)
