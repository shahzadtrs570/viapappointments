import type { ApplicationReview } from "../types"

import { ApplicationReviewRepository } from "../repository/applicationReview.repository"

export class ApplicationReviewService {
  private repository: ApplicationReviewRepository

  constructor() {
    this.repository = new ApplicationReviewRepository()
  }

  async create(data: ApplicationReview) {
    // Add any business logic/validation here
    return this.repository.create(data)
  }

  async update(id: string, data: ApplicationReview) {
    // Add any business logic/validation here
    return this.repository.update(id, data)
  }

  async get(id: string) {
    return this.repository.get(id)
  }

  async getByPropertyId(propertyId: string) {
    return this.repository.getByPropertyId(propertyId)
  }

  async getByUserId(userId: string) {
    return this.repository.getByUserId(userId)
  }

  async delete(id: string) {
    return this.repository.delete(id)
  }
}
