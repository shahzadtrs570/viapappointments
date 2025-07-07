// Translations are not integrated in this folder as well
/*eslint-disable import/order*/
// Removing "use client" since this is a Server Component using Suspense

// Server Component
import { Suspense } from "react"
import { featureFlags } from "@package/utils"
import { notFound } from "next/navigation"
import { WaitlistContent } from "./waitlist-content"

export default function WaitlistPage() {
  if (!featureFlags.waitlist) {
    return notFound()
  }

  return (
    <div className="container relative mx-auto min-h-[calc(100vh-4rem)] px-4 py-16">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute inset-0 
            bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[length:20px_20px] 
            [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,black_70%,transparent_110%)] 
            dark:bg-[linear-gradient(to_right,#fff1_1px,transparent_1px),linear-gradient(to_bottom,#fff1_1px,transparent_1px)]"
        />

        <div className="absolute left-1/2 top-0 -z-10 size-[1000px] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-3xl dark:from-primary/10 dark:via-primary/5" />

        <div className="absolute right-1/4 top-1/4 -z-10 size-[600px] rounded-full bg-gradient-to-b from-blue-500/10 via-blue-500/5 to-transparent blur-2xl dark:from-blue-400/10" />
        <div className="absolute left-1/4 top-2/3 -z-10 size-[800px] rounded-full bg-gradient-to-t from-purple-500/10 via-purple-500/5 to-transparent blur-2xl dark:from-purple-400/10" />

        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHBhdGggZD0iTTAgMGgyMHYyMEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjAuNSIgY3k9IjAuNSIgcj0iMC41IiBmaWxsPSJjdXJyZW50Q29sb3IiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-[0.015] dark:opacity-[0.03]" />
      </div>

      <div className="mx-auto mb-12 max-w-4xl text-center">
        <h1 className="mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
          Join the Waitlist
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Be the first to know when we launch and get early access to our
          platform. Choose the plan that best fits your needs.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-8">
            <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }
      >
        <WaitlistContent />
      </Suspense>
    </div>
  )
}
