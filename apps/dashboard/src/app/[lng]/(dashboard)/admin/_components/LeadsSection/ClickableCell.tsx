import type React from "react"

interface ClickableCellProps {
  children: React.ReactNode
  onClick: () => void
}

export function ClickableCell({ children, onClick }: ClickableCellProps) {
  return (
    <div
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {children}
    </div>
  )
}
