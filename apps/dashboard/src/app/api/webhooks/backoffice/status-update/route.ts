/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-depth */
import {
  dateToEncryptedString,
  encryptedStringToJson,
  floatToEncryptedString,
  generateDateSortHash,
  jsonToEncryptedString,
} from "@/../../packages/api/src/utils/encryptionUtils"
import { db } from "@package/db"
import { PropertyStatusUpdate, sendEmail } from "@package/email"
import { getLogger } from "@package/logger"
import { NextResponse } from "next/server"

import { verifyBackofficeWebhook } from "@/lib/webhooks"

const logger = getLogger()

// Define the expected payload structure
interface DashboardStatusUpdatePayload {
  statusUpdateId: string
  propertyId: string
  referenceNumber: string
  sellerId: string
  coSellerIds?: string[]
  currentStage: string
  stageProgress: number
  statusCode: string
  statusMessage: string
  statusData?: any // Custom JSON data provided by admin
  metadata: {
    timestamp: string
    updateType: string
    applicationStatus?: string // For APPLICATION_REVIEW_UPDATE type
    [key: string]: any // Allow any additional metadata fields
  }
}

export async function POST(request: Request) {
  try {
    // Verify the webhook request
    const isValid = await verifyBackofficeWebhook(request)

    if (!isValid) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized webhook request",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Parse the payload
    const payload = (await request.json()) as DashboardStatusUpdatePayload

    // Validate the payload has the required fields
    if (
      !payload.statusUpdateId ||
      !payload.propertyId ||
      !payload.sellerId ||
      !payload.referenceNumber
    ) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid payload: Missing required fields",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Check if the property exists
    const property = await db.property.findUnique({
      where: { id: payload.propertyId },
      include: {
        address: true,
      },
    })

    if (!property) {
      return new NextResponse(
        JSON.stringify({
          error: "Property not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Check if the seller exists
    const seller = await db.sellerProfile.findUnique({
      where: { id: payload.sellerId },
      include: {
        user: true,
      },
    })

    if (!seller) {
      return new NextResponse(
        JSON.stringify({
          error: "Seller not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Get the related offer
    // const offer = await db.offer.findFirst({
    //   where: {
    //     propertyId: payload.propertyId,
    //     sellerProfileId: payload.sellerId,
    //     referenceNumber: payload.referenceNumber,
    //   },
    // })

    // Handle application review update if that's the update type
    if (
      payload.metadata.updateType === "APPLICATION_REVIEW_UPDATE" &&
      payload.metadata.applicationStatus
    ) {
      // Find existing application review or create a new one
      const existingReview = await db.applicationReview.findFirst({
        where: {
          propertyId: payload.propertyId,
          sellerId: payload.sellerId, // Also match by sellerId to be more specific
        },
      })

      try {
        const now = new Date()

        if (existingReview) {
          // Decrypt existing data to merge with new data
          let existingChecklist = {}
          let existingConsiderations = {}

          try {
            existingChecklist = encryptedStringToJson(
              existingReview.checklist as string
            )
            existingConsiderations = encryptedStringToJson(
              existingReview.considerations as string
            )
          } catch (decryptError) {
            console.warn(
              "Failed to decrypt existing review data, using defaults"
            )
          }

          // Update the existing application review with encrypted data
          await db.applicationReview.update({
            where: { id: existingReview.id },
            data: {
              status: payload.metadata.applicationStatus as any, // Cast to enum
              checklist: jsonToEncryptedString(
                payload.statusData?.checklist || existingChecklist
              ) as any,
              considerations: jsonToEncryptedString(
                payload.statusData?.considerations || existingConsiderations
              ) as any,
              coSellerIds: payload.coSellerIds || existingReview.coSellerIds,
              updatedAt: dateToEncryptedString(now) as any,
            },
          })
        } else {
          // Create a new application review with encrypted data
          await db.applicationReview.create({
            data: {
              propertyId: payload.propertyId,
              sellerId: payload.sellerId,
              userId: seller.userId,
              coSellerIds: payload.coSellerIds || [],
              status: payload.metadata.applicationStatus as any,
              checklist: jsonToEncryptedString(
                payload.statusData?.checklist || {}
              ) as any,
              considerations: jsonToEncryptedString(
                payload.statusData?.considerations || {}
              ) as any,
              createdAt: dateToEncryptedString(now) as any,
              updatedAt: dateToEncryptedString(now) as any,
            },
          })
        }
      } catch (error) {
        console.error("Failed to update application review:", error)
        // Continue with the normal status update even if this fails
      }
    }

    // Check if this status update already exists by property and seller (more specific match)
    const existingStatus = await db.propertyDashboardStatus.findFirst({
      where: {
        propertyId: payload.propertyId,
        sellerId: payload.sellerId,
        // Also match by reference number if provided
        ...(payload.referenceNumber && {
          referenceNumber: payload.referenceNumber,
        }),
      },
    })

    if (existingStatus) {
      // Update the existing status with encrypted data
      const updateTime = new Date()
      await db.propertyDashboardStatus.update({
        where: { id: existingStatus.id },
        data: {
          referenceNumber: payload.referenceNumber as any, // Will be encrypted by prisma-field-encryption
          currentStage: payload.currentStage as any, // Will be encrypted by prisma-field-encryption
          stageProgress: floatToEncryptedString(payload.stageProgress) as any,
          statusData: jsonToEncryptedString(payload.statusData || {}) as any,
          coSellerIds: payload.coSellerIds || existingStatus.coSellerIds,
          updatedAt: dateToEncryptedString(updateTime) as any,
          updatedAtHash: generateDateSortHash(updateTime), // Generate hash for sorting
        },
      })
    } else {
      // Create a new dashboard status with encrypted data
      const now = new Date()
      await db.propertyDashboardStatus.create({
        data: {
          propertyId: payload.propertyId,
          sellerId: payload.sellerId,
          referenceNumber: payload.referenceNumber as any, // Will be encrypted by prisma-field-encryption
          currentStage: payload.currentStage as any, // Will be encrypted by prisma-field-encryption
          stageProgress: floatToEncryptedString(payload.stageProgress) as any,
          statusData: jsonToEncryptedString(payload.statusData || {}) as any,
          coSellerIds: payload.coSellerIds || [],
          createdAt: dateToEncryptedString(now) as any,
          updatedAt: dateToEncryptedString(now) as any,
          createdAtHash: generateDateSortHash(now), // Generate hash for sorting
          updatedAtHash: generateDateSortHash(now), // Generate hash for sorting
        },
      })
    }

    // Log the webhook received
    try {
      await db.queueTask.create({
        data: {
          type: "WEBHOOK_RECEIVED",
          data: {
            webhookType: "DASHBOARD_STATUS_UPDATE",
            referenceNumber: payload.referenceNumber,
            propertyId: payload.propertyId,
            timestamp: new Date().toISOString(),
          },
          status: "COMPLETED",
          priority: 0,
          processedAt: new Date(),
        },
      })
    } catch (logError) {
      console.error("Failed to create queue task:", logError)
    }

    // Only queue notifications if we have requiredActions in the custom statusData
    if (
      payload.statusData &&
      payload.statusData.requiredActions &&
      Array.isArray(payload.statusData.requiredActions) &&
      payload.statusData.requiredActions.length > 0
    ) {
      try {
        // Queue notifications for required actions
        await db.queueTask.create({
          data: {
            type: "NOTIFICATION_REQUIRED_ACTIONS",
            data: {
              propertyId: payload.propertyId,
              sellerId: payload.sellerId,
              referenceNumber: payload.referenceNumber,
              actionCount: payload.statusData.requiredActions.length,
              urgentCount: payload.statusData.requiredActions.filter(
                (a: any) => a.urgency === "HIGH"
              ).length,
              timestamp: new Date().toISOString(),
            },
            status: "PENDING",
            priority: 10,
          },
        })
      } catch (queueError) {
        console.error("Failed to queue notifications:", queueError)
      }
    }

    // Send email notification to the seller
    if (seller.user?.email) {
      try {
        // Format property address (fields are automatically decrypted by prisma-field-encryption)
        let propertyAddress = "Your property"
        if (property.address) {
          const addr = property.address
          const addressParts = [
            addr.streetLine1,
            addr.streetLine2,
            addr.city,
            addr.state,
            addr.postalCode,
          ].filter(Boolean)
          propertyAddress = addressParts.join(", ")
        }

        // Extract required actions from payload if they exist
        const requiredActions = payload.statusData?.requiredActions || []

        // Send email using the PropertyStatusUpdate template and sendEmail function
        await sendEmail({
          email: [seller.user.email],
          subject: `Property Status Update - ${payload.currentStage}`,
          react: PropertyStatusUpdate({
            propertyAddress,
            referenceNumber: payload.referenceNumber,
            currentStage: payload.currentStage,
            statusMessage:
              payload.statusMessage ||
              payload.statusData?.statusMessage ||
              `Your property application is now in the ${payload.currentStage} stage.`,
            requiredActions,
            dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL}?mode=continue-again&propertyId=${payload.propertyId}&step=Contemplation`,
          }),
        })

        // Use void to explicitly mark promise as ignored
        void logger.info(
          `Status update email sent to ${seller.user.email} for property ${payload.propertyId}`
        )
      } catch (emailError) {
        // Use void to explicitly mark promise as ignored
        void logger.error("Failed to send status update email:", {
          error:
            emailError instanceof Error
              ? emailError.message
              : String(emailError),
          propertyId: payload.propertyId,
          sellerId: payload.sellerId,
        })
        // Don't fail the request if email sending fails
      }
    }

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Dashboard status update received and processed successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error"
    console.error("Error processing dashboard status update webhook:", error)

    return new NextResponse(
      JSON.stringify({
        error: "Internal server error",
        details: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
