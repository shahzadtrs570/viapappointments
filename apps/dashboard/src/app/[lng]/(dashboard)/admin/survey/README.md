# Survey Admin Management

This directory contains the admin interface for managing surveys across the platform.

## Components

The `_components` directory contains admin-specific components:

- `survey-table.tsx` - Displays all surveys in a table format with admin actions
- `survey-actions.tsx` - Dropdown menu with administrative actions for each survey

## Features

The survey admin interface provides the following capabilities:

- **View All Surveys:** See all surveys across the platform regardless of creator
- **Status Management:** Change survey status between draft, published, and closed
- **User Management:** View the creator of each survey
- **Response Management:** View responses for any survey
- **Archive/Delete:** Archive or permanently delete surveys

## API Integration

These components integrate with these API endpoints:

- `api.survey.admin.getAll` - Get all surveys across the platform
- `api.survey.delete` - Delete a survey
- `api.survey.archive` - Archive a survey (soft delete)
- `api.survey.updateStatus` - Update a survey's status

## Permissions

Access to this interface is restricted to users with the `ADMIN` role. This is enforced at both the UI level (through protected routes) and API level (through protected procedures).

## Future Enhancements

Planned enhancements for the admin interface:

1. Advanced filtering and sorting options
2. Bulk operations (status changes, archiving, deletion)
3. Response analytics dashboard
4. User activity tracking for surveys
5. Survey template management 