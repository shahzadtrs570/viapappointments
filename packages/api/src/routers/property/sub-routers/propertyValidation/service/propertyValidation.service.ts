import { TRPCError } from "@trpc/server"

import type { PropertyValidationResult } from "../types"

import { PropertyValidationRepository } from "../repository/propertyValidation.repository"

export class PropertyValidationService {
  private repository: PropertyValidationRepository

  constructor() {
    this.repository = new PropertyValidationRepository()
  }

  async validateNewProperty(userId: string): Promise<PropertyValidationResult> {
    const result = await this.repository.checkExistingProperty(userId)

    if (result.hasExistingProperty && result.propertyDetails) {
      throw new TRPCError({
        code: "CONFLICT",
        message:
          "You already have an existing property application. Please continue with your existing application.",
        cause: {
          propertyId: result.propertyDetails.id,
          status: result.propertyDetails.review?.status,
          currentStep: result.currentStep,
        },
      })
    }

    return result
  }

  async getExistingProperty(userId: string): Promise<PropertyValidationResult> {
    return this.repository.checkExistingProperty(userId)
  }
}
