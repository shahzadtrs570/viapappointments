/* eslint-disable  @typescript-eslint/no-explicit-any */
"use client"

import { Button } from "@package/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Typography } from "@package/ui/typography"
import { Calendar, Heart, Percent, User } from "lucide-react"
import Link from "next/link"

// import type { Prisma } from "@package/db"

type SellerInfoCardProps = {
  sellerProperty?: any // For backward compatibility
  seller?: any // For new structure
}

export function SellerInfoCard({
  sellerProperty,
  seller,
}: SellerInfoCardProps) {
  // Handle both data formats
  const sellerData = seller || (sellerProperty ? sellerProperty.seller : null)

  if (!sellerData) {
    return null
  }

  // Get ownership percentage from the right place depending on data format
  const ownershipPercentage =
    seller?.ownershipPercentage ||
    (sellerProperty ? sellerProperty.ownershipPercentage : 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Seller Information</span>
          <Button asChild size="sm" variant="ghost">
            <Link href={`/admin/sellers/${sellerData.id}`}>View</Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-4">
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <div>
              <Typography variant="muted">Full Name</Typography>
              <Typography>
                {sellerData.firstName} {sellerData.lastName}
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="size-4 text-muted-foreground" />
            <div>
              <Typography variant="muted">Date of Birth</Typography>
              <Typography>
                {new Date(sellerData.dateOfBirth).toLocaleDateString()}
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Heart className="size-4 text-muted-foreground" />
            <div>
              <Typography variant="muted">General Health</Typography>
              <Typography>{sellerData.generalHealth}</Typography>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Percent className="size-4 text-muted-foreground" />
            <div>
              <Typography variant="muted">Ownership Percentage</Typography>
              <Typography>{ownershipPercentage}%</Typography>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
