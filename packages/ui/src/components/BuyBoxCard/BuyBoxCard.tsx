import { cn } from "@package/utils"

import { Badge } from "../Badge/Badge"
import { Card, CardContent, CardFooter } from "../Card/Card"

export interface BuyBoxCardProps {
  id: string
  name: string
  description: string
  status: "DRAFT" | "ACTIVE" | "PENDING_OFFER" | "SOLD" | "ARCHIVED"
  isAdminCreated: boolean
  totalValue: number
  initialInvestmentAmount: number
  estimatedMonthlyIncome: number
  averageIndexationRate: number
  propertyCount: number
  className?: string
  onViewDetails?: (id: string) => void
  onMakeOffer?: (id: string) => void
  currency?: string
}

export function BuyBoxCard({
  id,
  name,
  description,
  status,
  isAdminCreated,
  totalValue,
  initialInvestmentAmount,
  estimatedMonthlyIncome,
  averageIndexationRate,
  propertyCount,
  className,
  onViewDetails,
  onMakeOffer,
  currency = "£",
}: BuyBoxCardProps) {
  // Format currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency === "£" ? "GBP" : currency === "€" ? "EUR" : "USD",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formattedTotalValue = formatCurrency(totalValue)
  const formattedInitialInvestment = formatCurrency(initialInvestmentAmount)
  const formattedMonthlyIncome = formatCurrency(estimatedMonthlyIncome)
  
  // Get status color and label
  const getStatusDetails = () => {
    switch (status) {
      case "DRAFT":
        return { color: "bg-muted text-muted-foreground", label: "Draft" }
      case "ACTIVE":
        return { color: "bg-success/20 text-success", label: "Active" }
      case "PENDING_OFFER":
        return { color: "bg-warning/20 text-warning-foreground", label: "Pending Offer" }
      case "SOLD":
        return { color: "bg-primary/20 text-primary", label: "Sold" }
      case "ARCHIVED":
        return { color: "bg-destructive/20 text-destructive", label: "Archived" }
    }
  }
  
  const statusDetails = getStatusDetails()

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-semibold">{name}</h3>
            {isAdminCreated && (
              <Badge variant="secondary" className="mt-1">
                Featured Portfolio
              </Badge>
            )}
          </div>
          <Badge className={cn("ml-2", statusDetails.color)}>
            {statusDetails.label}
          </Badge>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2">{description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-lg font-semibold">{formattedTotalValue}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Initial Investment</p>
            <p className="text-lg font-semibold">{formattedInitialInvestment}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Monthly Income</p>
            <p className="text-lg font-semibold">{formattedMonthlyIncome}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg. Indexation</p>
            <p className="text-lg font-semibold">{averageIndexationRate}%</p>
          </div>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span>{propertyCount} {propertyCount === 1 ? 'Property' : 'Properties'}</span>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-3">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(id)}
            className="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded transition-colors"
          >
            View Details
          </button>
        )}
        {onMakeOffer && status === "ACTIVE" && (
          <button
            onClick={() => onMakeOffer(id)}
            className="flex-1 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded transition-colors"
          >
            Make Offer
          </button>
        )}
      </CardFooter>
    </Card>
  )
} 