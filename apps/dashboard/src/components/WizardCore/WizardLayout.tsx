/*eslint-disable react/jsx-max-depth*/
import type { WizardLayoutProps } from "./types"

export function WizardLayout({
  children,
  title,
  description,
  stepper,
  sidebar,
}: WizardLayoutProps) {
  return (
    <div className="py-0 pb-8 md:py-1">
      {title && <h1 className="mb-2 text-2xl font-bold">{title}</h1>}
      {description && (
        <p className="mb-4 text-muted-foreground">{description}</p>
      )}

      {stepper && <div className="mb-6">{stepper}</div>}

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main wizard content */}
        <div className={`w-full ${sidebar ? "lg:w-2/3" : ""}`}>{children}</div>

        {/* Optional sidebar */}
        {sidebar && <div className="w-full lg:w-1/3">{sidebar}</div>}
      </div>
    </div>
  )
}
