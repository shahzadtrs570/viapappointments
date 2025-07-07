import { cn } from "@package/utils"

type ContainerProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <section className={cn("container py-8 md:py-12", className)} {...props}>
      {children}
    </section>
  )
}
