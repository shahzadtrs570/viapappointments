import { Typography } from "@package/ui/typography"
import { cn } from "@package/utils"

type OnboardingLayoutProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode
  title: string
  description?: string
}

export function MultiStepLayout({
  children,
  title,
  description,
  className,
}: OnboardingLayoutProps) {
  return (
    <section className="flex w-full justify-center">
      <section
        className={cn("flex w-full flex-col items-center gap-4", className)}
      >
        <Typography className="text-pretty text-center" variant="h1">
          {title}
        </Typography>
        {description && (
          <Typography className="text-pretty text-center">
            {description}
          </Typography>
        )}
        <section className="mt-4 w-full self-start">{children}</section>
      </section>
    </section>
  )
}
