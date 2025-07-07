import {
  dateToEncryptedString,
  floatToEncryptedString,
  jsonToEncryptedString,
} from "@/../../packages/api/src/utils/encryptionUtils"
import { db } from "@package/db"
import { getLogger } from "@package/logger"
import { NextResponse } from "next/server"

import { verifyBackofficeWebhook } from "@/lib/webhooks"

const logger = getLogger()

// Define the expected payload structure
interface ProvisionalOfferPayload {
  responseId: string
  propertyId: string
  referenceNumber: string
  offer: {
    initialPaymentAmount: number
    monthlyPaymentAmount: number
    indexationRate: number
    agreementType: "STANDARD" | "CUSTOM" // Match the enum values in schema
    occupancyRight: string
    expirationDate: string
    totalValue: number
    termsAndConditionsUrl: string
  }
  additionalTerms: string[]
  legalDisclosures: string[]
  metadata: {
    timestamp: string
    responseType: string
    backofficeId: string
    version: string
  }
}

export async function POST(request: Request) {
  try {
    // Verify the webhook request
    const isValid = await verifyBackofficeWebhook(request)

    if (!isValid) {
      await logger.error("Unauthorized webhook request", {
        ip: request.headers.get("x-forwarded-for") || "unknown",
        endpoint: "provisional-offer",
      })

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
    const payload = (await request.json()) as ProvisionalOfferPayload

    // Validate the payload has the required fields
    if (
      !payload.responseId ||
      !payload.propertyId ||
      !payload.referenceNumber
    ) {
      await logger.error("Invalid webhook payload: Missing required fields", {
        payload: JSON.stringify(payload),
      })

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
    })

    if (!property) {
      await logger.error("Property not found for provisional offer", {
        propertyId: payload.propertyId,
        referenceNumber: payload.referenceNumber,
      })

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

    // Find the seller profile for this property
    const sellerProperty = await db.sellerProperty.findFirst({
      where: { propertyId: payload.propertyId },
      include: { seller: true },
    })

    if (!sellerProperty) {
      await logger.error("No seller found for property", {
        propertyId: payload.propertyId,
        referenceNumber: payload.referenceNumber,
      })

      return new NextResponse(
        JSON.stringify({
          error: "No seller found for property",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Find any co-sellers for the property
    const coSellerData = await db.sellerProperty.findMany({
      where: {
        propertyId: payload.propertyId,
        NOT: { sellerId: sellerProperty.sellerId },
      },
      select: { sellerId: true },
    })

    const coSellerIds = coSellerData.map((cs) => cs.sellerId)

    // Check if this offer already exists
    const existingOffer = await db.offer.findFirst({
      where: {
        AND: [
          { propertyId: payload.propertyId },
          { sellerProfileId: sellerProperty.sellerId },
          { referenceNumber: payload.referenceNumber },
        ],
      },
    })

    // Map the agreement type to the enum values
    const agreementType =
      payload.offer.agreementType === "STANDARD" ? "STANDARD" : "CUSTOM"

    if (existingOffer) {
      // Update the existing offer
      await db.offer.update({
        where: { id: existingOffer.id },
        data: {
          initialPaymentAmount: floatToEncryptedString(
            payload.offer.initialPaymentAmount
          ),
          monthlyPaymentAmount: floatToEncryptedString(
            payload.offer.monthlyPaymentAmount
          ),
          indexationRate: floatToEncryptedString(payload.offer.indexationRate),
          agreementType,
          offerData: jsonToEncryptedString(payload),
          expirationDate: new Date(payload.offer.expirationDate),
          isProvisional: true,
          status: "PENDING",
          coSellerIds,
          updatedAt: dateToEncryptedString(new Date()),
        },
      })

      await logger.info("Updated provisional offer", {
        offerId: existingOffer.id,
        propertyId: payload.propertyId,
        referenceNumber: payload.referenceNumber,
      })
    } else {
      // Create a new offer
      const newOffer = await db.offer.create({
        data: {
          referenceNumber: payload.referenceNumber,
          propertyId: payload.propertyId,
          sellerProfileId: sellerProperty.sellerId,
          initialPaymentAmount: floatToEncryptedString(
            payload.offer.initialPaymentAmount
          ),
          monthlyPaymentAmount: floatToEncryptedString(
            payload.offer.monthlyPaymentAmount
          ),
          indexationRate: floatToEncryptedString(payload.offer.indexationRate),
          agreementType,
          offerData: jsonToEncryptedString(payload),
          status: "PENDING",
          expirationDate: new Date(payload.offer.expirationDate),
          isProvisional: true,
          responseId: payload.referenceNumber, // Using referenceNumber as responseId if needed
          coSellerIds,
          createdAt: dateToEncryptedString(new Date()),
          updatedAt: dateToEncryptedString(new Date()),
        },
      })

      await logger.info("Created new provisional offer", {
        offerId: newOffer.id,
        propertyId: payload.propertyId,
        referenceNumber: payload.referenceNumber,
      })
    }

    // Log the webhook received
    await db.queueTask.create({
      data: {
        type: "WEBHOOK_RECEIVED",
        data: {
          webhookType: "PROVISIONAL_OFFER",
          referenceNumber: payload.referenceNumber,
          propertyId: payload.propertyId,
          timestamp: new Date().toISOString(),
        },
        status: "COMPLETED",
        priority: 0,
        processedAt: new Date(),
      },
    })

    return new NextResponse(
      JSON.stringify({
        success: true,
        message: "Provisional offer received and processed successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error"
    console.error("Error processing provisional offer webhook:", error)

    await logger.error("Error processing provisional offer webhook", {
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    })

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
