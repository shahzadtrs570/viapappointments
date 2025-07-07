/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
"use client"

import { useCallback } from "react"
import { HelpCircle, Home, Users, User } from "lucide-react"
import { Button } from "@package/ui/button"

type OptionType = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
}

interface WelcomeSelectorProps {
  onRoleSelected: (role: string) => void
}

export function WelcomeSelector({ onRoleSelected }: WelcomeSelectorProps) {
  const handleRoleClick = useCallback(
    (roleId: string) => {
      onRoleSelected(roleId)
    },
    [onRoleSelected]
  )

  const options: OptionType[] = [
    {
      id: "property-owner",
      title: "Property Owner",
      description:
        "I own a property and want to explore viager options to unlock its value while continuing to live in it",
      icon: <Home className="size-8" />,
    },
    {
      id: "family-supporter",
      title: "Family Supporter",
      description:
        "I'm helping a family member explore options for their property",
      icon: <Users className="size-8" />,
    },
    {
      id: "buyer",
      title: "Potential Buyer",
      description:
        "I'm interested in investing in properties through viager arrangements",
      icon: <User className="size-8" />,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {options.map((option) => (
          <button
            key={option.id}
            className="flex cursor-pointer flex-col items-start rounded-lg border p-4 transition-colors hover:bg-accent md:flex-row"
            onClick={() => handleRoleClick(option.id)}
          >
            <div className="mb-4 shrink-0 rounded-lg bg-primary/10 p-2 md:mb-0 md:mr-4">
              {option.icon}
            </div>
            <div>
              <h3 className="text-lg font-medium">{option.title}</h3>
              <p className="mt-1 text-muted-foreground">{option.description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        <h4 className="mb-4 font-medium">Common questions about viager</h4>
        <div className="grid gap-2">
          <Button variant="outline" className="justify-start text-left">
            <HelpCircle className="mr-2 size-4" />
            How does viager work?
          </Button>
          <Button variant="outline" className="justify-start text-left">
            <HelpCircle className="mr-2 size-4" />
            What are the benefits for property owners?
          </Button>
          <Button variant="outline" className="justify-start text-left">
            <HelpCircle className="mr-2 size-4" />
            Is viager right for my situation?
          </Button>
        </div>
      </div>
    </div>
  )
}
