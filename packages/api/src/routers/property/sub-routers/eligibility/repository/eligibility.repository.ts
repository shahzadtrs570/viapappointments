/* eslint-disable  @typescript-eslint/no-unnecessary-condition */
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { db } from "@package/db"

// Client-side field names (with hyphens)
export type ClientEligibilityData = {
  isEligible: boolean
  age?: string | null
  "property-ownership"?: string | null
  "joint-ownership"?: string | null
  "spouse-age"?: string | null
  "children-heirs"?: string | null
  "inheritance-importance"?: string | null
  "confident-understanding"?: string | null
  "discuss-options"?: string | null
  country?: string | null
  ownership?: string | null
  propertyType?: string | null
  mainResidence?: string | null
  financialGoals?: string[]
}

// Database field names (camelCase)
export type DbEligibilityData = {
  isEligible: boolean | null
  age?: string | null
  propertyOwnership?: string | null
  jointOwnership?: string | null
  spouseAge?: string | null
  childrenHeirs?: string | null
  inheritanceImportance?: string | null
  confidentUnderstanding?: string | null
  discussOptions?: string | null
  country?: string | null
  ownership?: string | null
  propertyType?: string | null
  mainResidence?: string | null
  financialGoals?: string[]
}

// Field name mapping
const clientToDbFieldMap: Record<
  keyof ClientEligibilityData,
  keyof DbEligibilityData
> = {
  isEligible: "isEligible",
  age: "age",
  "property-ownership": "propertyOwnership",
  "joint-ownership": "jointOwnership",
  "spouse-age": "spouseAge",
  "children-heirs": "childrenHeirs",
  "inheritance-importance": "inheritanceImportance",
  "confident-understanding": "confidentUnderstanding",
  "discuss-options": "discussOptions",
  country: "country",
  ownership: "ownership",
  propertyType: "propertyType",
  mainResidence: "mainResidence",
  financialGoals: "financialGoals",
}

const dbToClientFieldMap: Record<
  keyof DbEligibilityData,
  keyof ClientEligibilityData
> = {
  isEligible: "isEligible",
  age: "age",
  propertyOwnership: "property-ownership",
  jointOwnership: "joint-ownership",
  spouseAge: "spouse-age",
  childrenHeirs: "children-heirs",
  inheritanceImportance: "inheritance-importance",
  confidentUnderstanding: "confident-understanding",
  discussOptions: "discuss-options",
  country: "country",
  ownership: "ownership",
  propertyType: "propertyType",
  mainResidence: "mainResidence",
  financialGoals: "financialGoals",
}

export class EligibilityRepository {
  /**
   * Transform client data to database format
   */
  private transformToDb(data: ClientEligibilityData): DbEligibilityData {
    const dbData: Partial<DbEligibilityData> = {}
    Object.entries(data).forEach(([key, value]) => {
      const dbKey = clientToDbFieldMap[key as keyof ClientEligibilityData]
      if (dbKey) {
        dbData[dbKey] = value as any // Type assertion needed due to complex mapping
      }
    })
    return dbData as DbEligibilityData
  }

  /**
   * Transform database data to client format
   */
  private transformToClient(data: DbEligibilityData): ClientEligibilityData {
    const clientData: Partial<ClientEligibilityData> = {}
    Object.entries(data).forEach(([key, value]) => {
      const clientKey = dbToClientFieldMap[key as keyof DbEligibilityData]
      if (clientKey) {
        clientData[clientKey] = value as any // Type assertion needed due to complex mapping
      }
    })
    // Ensure isEligible is always a boolean in client data
    if (clientData.isEligible === null) {
      clientData.isEligible = false
    }
    return clientData as ClientEligibilityData
  }

  /**
   * Find eligibility data by user ID
   */
  async findByUserId(userId: string) {
    const data = await db.eligibility.findUnique({
      where: { userId },
    })
    return data ? this.transformToClient(data as DbEligibilityData) : null
  }

  /**
   * Create eligibility data
   */
  async create(userId: string, data: ClientEligibilityData) {
    const dbData = this.transformToDb(data)
    const result = await db.eligibility.create({
      data: {
        userId,
        ...dbData,
      },
    })
    return this.transformToClient(result as DbEligibilityData)
  }

  /**
   * Update eligibility data
   */
  async update(userId: string, data: ClientEligibilityData) {
    const dbData = this.transformToDb(data)
    const result = await db.eligibility.update({
      where: { userId },
      data: {
        ...dbData,
        updatedAt: new Date(),
      },
    })
    return this.transformToClient(result as DbEligibilityData)
  }

  /**
   * Upsert eligibility data (create or update)
   */
  async upsert(userId: string, data: ClientEligibilityData) {
    const dbData = this.transformToDb(data)
    const result = await db.eligibility.upsert({
      where: { userId },
      update: {
        ...dbData,
        updatedAt: new Date(),
      },
      create: {
        userId,
        ...dbData,
      },
    })
    return this.transformToClient(result as DbEligibilityData)
  }
}
