// Translation is not integrated here as well
import { Container } from "@package/ui/container"
import { featureFlags } from "@package/utils"
import { notFound } from "next/navigation"

import type { Metadata } from "next"

// import { Container } from "@package/ui/container"
// import { PageHeader } from "@/components/Layout/PageHeader"

export const metadata: Metadata = {
  title: "Surveys",
  description:
    "Collect valuable feedback from your customers with our survey tools.",
}

/**
 * Marketing page for surveys
 */
export default function SurveysPage() {
  if (!featureFlags.surveyFeature) {
    return notFound()
  }
  return (
    <>
      {/* <PageHeader
        description="Collect valuable feedback from your customers with interactive surveys"
        title="Surveys"
      /> */}
      <Container className="py-12">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-bold md:text-5xl">Surveys</h1>
            <p className="text-xl text-muted-foreground">
              Collect valuable feedback from your customers with interactive
              surveys
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Feature 1 */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-2 text-xl font-semibold">
                Easy Survey Builder
              </h3>
              <p className="text-gray-500">
                Create beautiful, responsive surveys with our drag-and-drop
                builder. No coding required.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-2 text-xl font-semibold">
                Real-time Analytics
              </h3>
              <p className="text-gray-500">
                View responses as they come in and analyze results with powerful
                visualization tools.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-2 text-xl font-semibold">Lead Integration</h3>
              <p className="text-gray-500">
                Connect surveys with your lead management system to gather
                targeted feedback from specific customer segments.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-2 text-xl font-semibold">
                Multiple Question Types
              </h3>
              <p className="text-gray-500">
                Choose from a variety of question formats including multiple
                choice, rating scales, open text, and more.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-center text-white">
            <h3 className="mb-4 text-2xl font-bold">
              Ready to start collecting feedback?
            </h3>
            <p className="mb-6">
              Sign up today and start creating surveys in minutes.
            </p>
            <a
              className="inline-block rounded-lg bg-white px-6 py-3 font-medium text-blue-600 transition-colors hover:bg-gray-100"
              href="/waitlist"
            >
              Join Waitlist
            </a>
          </div>
        </div>
      </Container>
    </>
  )
}
