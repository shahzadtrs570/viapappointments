import type { ReactNode } from "react"

import { Button } from "@package/ui/button"
import { Typography } from "@package/ui/typography"

interface HeaderProps {
  title?: string
  description?: string
  actionButton?: {
    label: string
    onClick: () => void
    icon?: ReactNode
  }
}

export function Header({
  title = "Srenova",
  description = "Unlock the value of your property while continuing to live in it",
  actionButton,
}: HeaderProps) {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <Typography className="text-3xl font-bold text-primary" variant="h1">
          {title}
        </Typography>
        {description && (
          <Typography className="text-muted-foreground" variant="body">
            {description}
          </Typography>
        )}
      </div>

      {actionButton && (
        <Button
          className="flex items-center gap-2"
          variant="outline"
          onClick={actionButton.onClick}
        >
          {actionButton.icon}
          {actionButton.label}
        </Button>
      )}
    </header>
  )
}
