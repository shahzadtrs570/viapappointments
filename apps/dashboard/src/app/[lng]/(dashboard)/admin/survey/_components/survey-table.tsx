/**
 * SURVEY COMPONENT
 *
 * LINTING & CODE QUALITY NOTES:
 * -----------------------------
 * 1. Import Order (maintain blank lines between groups):
 *    - React imports (useState, useEffect)
 *    - External packages
 *    - Package imports (@package/*)
 *    - App imports (@/*)
 *    - Relative imports (./*)
 *
 * 2. Type Safety:
 *    - Define explicit interface for component props
 *    - Avoid using 'any' in component implementations
 *    - Use proper types for React state and effects
 *
 * 3. Common Issues:
 *    - Include all dependencies in useEffect/useCallback dependency arrays
 *    - Handle loading, error, and empty states
 *    - Add proper null checks for optional data (item?.property || "Default")
 *    - Keep JSX readable with proper indentation and splitting
 */

"use client"

import { Badge } from "@package/ui/badge"
import { Spinner } from "@package/ui/spinner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@package/ui/table"
import { formatDateToMonthDayYear } from "@package/utils"

import { api } from "@/lib/trpc/react"

import { SurveyActions } from "./survey-actions"

/**
 * Survey table component for admin dashboard
 *
 * API endpoints used:
 * - api.survey.admin.getAll - Gets all surveys
 *   Returns: Survey[] with properties:
 *     - id: string
 *     - title: string
 *     - description: string | null
 *     - status: "DRAFT" | "PUBLISHED" | "CLOSED"
 *     - createdAt: Date
 *     - updatedAt: Date
 *     - createdBy: string | null
 *     - isArchived: boolean
 *     - isPublic: boolean
 *
 * Related components:
 * - SurveyActions: Component for survey actions (edit, delete, etc.)
 *   Props: { survey: Survey }
 */
export function SurveyTable() {
  const { data: surveys, isLoading } = api.survey.admin.getAll.useQuery()

  if (isLoading) {
    return <Spinner />
  }

  if (!surveys || surveys.length === 0) {
    return (
      <div className="py-10 text-center">
        <p className="text-gray-500">No surveys found.</p>
      </div>
    )
  }

  // Function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <Badge variant="outline">Draft</Badge>
      case "PUBLISHED":
        return <Badge variant="default">Published</Badge>
      case "CLOSED":
        return <Badge variant="destructive">Closed</Badge>
      default:
        return null
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Public</TableHead>
            <TableHead>Archived</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {surveys.map((survey) => (
            <TableRow key={survey.id}>
              <TableCell className="font-medium">{survey.title}</TableCell>
              <TableCell>{getStatusBadge(survey.status)}</TableCell>
              <TableCell>{survey.isPublic ? "Yes" : "No"}</TableCell>
              <TableCell>{survey.isArchived ? "Yes" : "No"}</TableCell>
              <TableCell>{survey.createdBy || "—"}</TableCell>
              <TableCell>
                {formatDateToMonthDayYear(survey.createdAt)}
              </TableCell>
              <TableCell>
                {formatDateToMonthDayYear(survey.updatedAt)}
              </TableCell>
              <TableCell className="text-right">
                <SurveyActions survey={survey} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
