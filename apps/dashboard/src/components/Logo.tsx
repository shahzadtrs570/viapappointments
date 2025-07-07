import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center font-bold text-xl", className)}>
      <span className="text-primary">Estate</span>
      <span className="ml-1 rounded bg-primary px-1 text-primary-foreground">
        Flex
      </span>
    </div>
  )
}
