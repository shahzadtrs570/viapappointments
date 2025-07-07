import { Typography } from "@package/ui/typography"
import { cn } from "@package/utils"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  color?: "primary" | "white"
  text?: string
  className?: string
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
}

const colorMap = {
  primary: "text-primary",
  white: "text-white",
}

export function LoadingSpinner({
  size = "md",
  color = "primary",
  text,
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-3",
        className
      )}
    >
      <Loader2 className={cn("animate-spin", sizeMap[size], colorMap[color])} />
      {text && (
        <Typography
          variant="body"
          className={cn(
            "text-center text-sm",
            color === "white" ? "text-white" : "text-muted-foreground"
          )}
        >
          {text}
        </Typography>
      )}
    </div>
  )
}
