"use client"

import { Car, Home, Ship, Bike, Truck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CategoryFilterProps {
  activeCategory?: string
  onCategoryChange?: (category: string) => void
}

const categories = [
  { id: "all", name: "All Listings", icon: Sparkles, count: 847 },
  { id: "vehicles", name: "Vehicles", icon: Car, count: 423 },
  { id: "homes", name: "Homes", icon: Home, count: 156 },
  { id: "boats", name: "Boats", icon: Ship, count: 89 },
  { id: "motorcycles", name: "Motorcycles", icon: Bike, count: 98 },
  { id: "rvs", name: "RVs", icon: Truck, count: 81 },
]

const CategoryFilter = ({
  activeCategory = "all",
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const Icon = category.icon
        const isActive = activeCategory === category.id

        return (
          <Button
            key={category.id}
            onClick={() => onCategoryChange?.(category.id)}
            className={`
              flex-shrink-0 px-6 py-6 rounded-2xl transition-all duration-300
              ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-glass glow-primary"
                  : "glass-strong hover:bg-primary/10 border border-border/50"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <Icon
                className={`h-5 w-5 ${isActive ? "text-primary-foreground" : "text-primary"}`}
              />
              <div className="text-left">
                <p
                  className={`font-semibold text-sm ${isActive ? "text-primary-foreground" : "text-foreground"}`}
                >
                  {category.name}
                </p>
                <p
                  className={`text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground"}`}
                >
                  {category.count.toLocaleString()}
                </p>
              </div>
            </div>
          </Button>
        )
      })}
    </div>
  )
}

export default CategoryFilter
