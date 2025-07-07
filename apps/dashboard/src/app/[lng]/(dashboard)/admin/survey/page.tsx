import { Button } from "@package/ui/button"
import Link from "next/link"

import { SurveyTable } from "./_components/survey-table"

/**
 * Admin survey management page
 *
 * This page displays all surveys in a table format with admin actions
 * and provides a button to create new surveys (only available to admins)
 */
export default function AdminSurveysPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Surveys</h1>
        <Button asChild>
          <Link href="/survey/new">Create Survey</Link>
        </Button>
      </div>
      <SurveyTable />
    </div>
  )
}
