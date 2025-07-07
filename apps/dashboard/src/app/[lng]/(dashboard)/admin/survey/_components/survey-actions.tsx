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

import { useState } from "react"

import { Button } from "@package/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@package/ui/dropdown-menu"
import { useToast } from "@package/ui/toast"
import {
  ArchiveIcon,
  CheckCircle,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash,
  XCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"

import { api } from "@/lib/trpc/react"

/**
 * Interface for a survey
 */
interface Survey {
  id: string
  title: string
  description?: string | null
  status: "DRAFT" | "PUBLISHED" | "CLOSED"
  createdAt: Date
  updatedAt: Date
  createdBy?: string | null
  isArchived: boolean
  isPublic: boolean
}

/**
 * Props for the SurveyActions component
 */
interface SurveyActionsProps {
  survey: Survey
}

/**
 * SurveyActions component for admin actions on surveys
 *
 * API Endpoints Used:
 * - api.survey.delete - Deletes a survey
 *   Input: { id: string }
 *   Returns: { success: boolean, message: string }
 *
 * - api.survey.archive - Archives a survey
 *   Input: { id: string }
 *   Returns: { success: boolean, message: string }
 *
 * - api.survey.updateStatus - Updates a survey's status
 *   Input: { id: string, status: "DRAFT" | "PUBLISHED" | "CLOSED" }
 *   Returns: { id: string, status: string }
 *
 * Props:
 * - survey: The survey to act on
 */
export function SurveyActions({ survey }: SurveyActionsProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const deleteSurvey = api.survey.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Survey deleted successfully",
      })
      router.refresh()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsDeleting(false)
    },
  })

  const archiveSurvey = api.survey.archive.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Survey archived successfully",
      })
      router.refresh()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsArchiving(false)
    },
  })

  const updateSurveyStatus = api.survey.updateStatus.useMutation({
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Survey status updated to ${data.status.toLowerCase()}`,
      })
      router.refresh()
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
    onSettled: () => {
      setIsUpdatingStatus(false)
    },
  })

  const handleEdit = () => {
    router.push(`/survey/${survey.id}`)
  }

  const handleDelete = () => {
    if (
      confirm(`Are you sure you want to delete the survey "${survey.title}"?`)
    ) {
      setIsDeleting(true)
      deleteSurvey.mutate({ id: survey.id })
    }
  }

  const handleArchive = () => {
    if (
      confirm(`Are you sure you want to archive the survey "${survey.title}"?`)
    ) {
      setIsArchiving(true)
      archiveSurvey.mutate({ id: survey.id })
    }
  }

  const handleStatusChange = (status: "DRAFT" | "PUBLISHED" | "CLOSED") => {
    if (status === survey.status) return

    const messages = {
      DRAFT: "unpublish",
      PUBLISHED: "publish",
      CLOSED: "close",
    }

    if (confirm(`Are you sure you want to ${messages[status]} this survey?`)) {
      setIsUpdatingStatus(true)
      updateSurveyStatus.mutate({ id: survey.id, status })
    }
  }

  const handleViewCreator = () => {
    if (survey.createdBy) {
      router.push(`/admin/users/${survey.createdBy}`)
    } else {
      toast({
        title: "Information",
        description: "This is a system survey with no associated creator",
      })
    }
  }

  const handleViewResponses = () => {
    // This would navigate to a response viewing page
    // For now just show a toast as this feature isn't implemented yet
    toast({
      title: "Information",
      description: "Response viewing not yet implemented",
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-8 p-0" size="sm" variant="ghost">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleEdit}>
          <Pencil className="mr-2 size-4" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleViewResponses}>
          <Eye className="mr-2 size-4" />
          View Responses
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleViewCreator}>
          View Creator
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {survey.status !== "PUBLISHED" && (
          <DropdownMenuItem
            disabled={isUpdatingStatus}
            onClick={() => handleStatusChange("PUBLISHED")}
          >
            <CheckCircle className="mr-2 size-4" />
            Publish
          </DropdownMenuItem>
        )}

        {survey.status === "PUBLISHED" && (
          <>
            <DropdownMenuItem
              disabled={isUpdatingStatus}
              onClick={() => handleStatusChange("DRAFT")}
            >
              <XCircle className="mr-2 size-4" />
              Unpublish
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={isUpdatingStatus}
              onClick={() => handleStatusChange("CLOSED")}
            >
              <Eye className="mr-2 size-4" />
              Close Survey
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuItem disabled={isArchiving} onClick={handleArchive}>
          <ArchiveIcon className="mr-2 size-4" />
          {isArchiving ? "Archiving..." : "Archive"}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-red-600"
          disabled={isDeleting}
          onClick={handleDelete}
        >
          <Trash className="mr-2 size-4" />
          {isDeleting ? "Deleting..." : "Delete"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
