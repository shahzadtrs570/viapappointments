/* eslint-disable */

import { TRPCError } from "@trpc/server"
import { inventoryRepository } from "../repository/inventory.repository"
import type {
  GetInventoryArgs,
  GetInventoryByIdArgs,
  GetInventoryBySlugArgs,
  CreateInventoryArgs,
  UpdateInventoryArgs,
  DeleteInventoryArgs,
  GetDealershipsArgs,
  GetInventoryFiltersArgs,
  GetInventoryStatsArgs,
  BulkCreateInventoryArgs,
  SearchInventoryArgs,
  InventoryFilters,
  InventoryStats,
  PaginatedInventoryResult,
  InventoryWithDealership,
} from "./inventory.service.types"

// Use the actual session type from tRPC context
type SessionUser = {
  id: string
  role: string
  email?: string | null
  name?: string | null
}

/**
 * Inventory service for business logic
 * @description Handles inventory operations with validation and business rules
 */
class InventoryService {
  /**
   * Get paginated inventory with filters
   */
  public async getInventory(
    args: GetInventoryArgs
  ): Promise<PaginatedInventoryResult> {
    try {
      const { input } = args

      // Validate limit
      if (input.limit > 100) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Limit cannot exceed 100 items",
        })
      }

      const result = await inventoryRepository.getInventory({
        make: input.make,
        model: input.model,
        year: input.year,
        minYear: input.minYear,
        maxYear: input.maxYear,
        minPrice: input.minPrice,
        maxPrice: input.maxPrice,
        condition: input.condition,
        fuelType: input.fuelType,
        transmission: input.transmission,
        drivetrain: input.drivetrain,
        bodyStyle: input.bodyStyle,
        dealershipId: input.dealershipId,
        search: input.search,
        cursor: input.cursor,
        skip: input.skip,
        limit: input.limit,
        sortBy: input.sortBy,
        status: input.status,
        isActive: input.isActive,
        isFeatured: input.isFeatured,
      })

      // Transform price from cents to dollars
      const transformedItems = result.items.map((item) => ({
        ...item,
        priceAmount: item.priceAmount
          ? Math.round(item.priceAmount / 100)
          : null,
        msrpAmount: item.msrpAmount ? Math.round(item.msrpAmount / 100) : null,
      }))

      return {
        ...result,
        items: transformedItems,
      }
    } catch (error) {
      this.handleError(error, "get inventory")
    }
  }

  /**
   * Get inventory item by ID
   */
  public async getInventoryById(
    args: GetInventoryByIdArgs
  ): Promise<InventoryWithDealership> {
    try {
      const { input } = args

      const inventory = await inventoryRepository.findInventoryById(input.id)

      if (!inventory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Inventory item not found",
        })
      }

      // Transform price from cents to dollars
      return {
        ...inventory,
        priceAmount: inventory.priceAmount
          ? Math.round(inventory.priceAmount / 100)
          : null,
        msrpAmount: inventory.msrpAmount
          ? Math.round(inventory.msrpAmount / 100)
          : null,
      }
    } catch (error) {
      this.handleError(error, "get inventory by ID")
    }
  }

  /**
   * Get inventory item by slug
   */
  public async getInventoryBySlug(
    args: GetInventoryBySlugArgs
  ): Promise<InventoryWithDealership> {
    try {
      const { input } = args

      const inventory = await inventoryRepository.findInventoryBySlug(
        input.slug
      )

      if (!inventory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Inventory item not found",
        })
      }

      // Transform price from cents to dollars
      return {
        ...inventory,
        priceAmount: inventory.priceAmount
          ? Math.round(inventory.priceAmount / 100)
          : null,
        msrpAmount: inventory.msrpAmount
          ? Math.round(inventory.msrpAmount / 100)
          : null,
      }
    } catch (error) {
      this.handleError(error, "get inventory by slug")
    }
  }

  /**
   * Create new inventory item
   */
  public async createInventory(
    args: CreateInventoryArgs
  ): Promise<InventoryWithDealership> {
    try {
      const { input, session } = args

      // Check permissions
      this.checkIsAdmin(session)

      // Generate slug if not provided
      const slug =
        input.slug ||
        this.generateSlug(input.year, input.make, input.model, input.trim)

      // Convert prices to cents
      const priceAmount = input.priceAmount
        ? Math.round(input.priceAmount * 100)
        : null
      const msrpAmount = input.msrpAmount
        ? Math.round(input.msrpAmount * 100)
        : null

      const inventory = await inventoryRepository.createInventory({
        dealership: { connect: { id: input.dealershipId } },
        sourceUrl: input.sourceUrl,
        vin: input.vin,
        stockNumber: input.stockNumber,
        make: input.make,
        model: input.model,
        year: input.year,
        trim: input.trim,
        priceAmount,
        priceCurrency: input.priceCurrency || "USD",
        msrpAmount,
        mileage: input.mileage,
        condition: input.condition || "UNKNOWN",
        fuelType: input.fuelType || "UNKNOWN",
        transmission: input.transmission || "UNKNOWN",
        drivetrain: input.drivetrain || "UNKNOWN",
        bodyStyle: input.bodyStyle || "UNKNOWN",
        engineSize: input.engineSize,
        engineCylinders: input.engineCylinders,
        horsepower: input.horsepower,
        mpgCity: input.mpgCity,
        mpgHighway: input.mpgHighway,
        mpgCombined: input.mpgCombined,
        exteriorColor: input.exteriorColor,
        interiorColor: input.interiorColor,
        status: input.status || "AVAILABLE",
        isActive: input.isActive ?? true,
        isFeatured: input.isFeatured ?? false,
        rawData: input.rawData,
        processedData: input.processedData,
        features: input.features,
        specifications: input.specifications,
        images: input.images,
        title: input.title,
        description: input.description,
        slug,
      })

      // Get the created inventory with dealership info
      return this.getInventoryById({ input: { id: inventory.id } })
    } catch (error) {
      this.handleError(error, "create inventory")
    }
  }

  /**
   * Update inventory item
   */
  public async updateInventory(
    args: UpdateInventoryArgs
  ): Promise<InventoryWithDealership> {
    try {
      const { input, session } = args

      // Check permissions
      this.checkIsAdmin(session)

      // Check if inventory exists
      const existingInventory = await inventoryRepository.findInventoryById(
        input.id
      )
      if (!existingInventory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Inventory item not found",
        })
      }

      // Convert prices to cents if provided
      const priceAmount = input.priceAmount
        ? Math.round(input.priceAmount * 100)
        : undefined
      const msrpAmount = input.msrpAmount
        ? Math.round(input.msrpAmount * 100)
        : undefined

      const updateData: any = {
        ...(input.dealershipId && {
          dealership: { connect: { id: input.dealershipId } },
        }),
        ...(input.sourceUrl !== undefined && { sourceUrl: input.sourceUrl }),
        ...(input.vin !== undefined && { vin: input.vin }),
        ...(input.stockNumber !== undefined && {
          stockNumber: input.stockNumber,
        }),
        ...(input.make !== undefined && { make: input.make }),
        ...(input.model !== undefined && { model: input.model }),
        ...(input.year !== undefined && { year: input.year }),
        ...(input.trim !== undefined && { trim: input.trim }),
        ...(priceAmount !== undefined && { priceAmount }),
        ...(input.priceCurrency !== undefined && {
          priceCurrency: input.priceCurrency,
        }),
        ...(msrpAmount !== undefined && { msrpAmount }),
        ...(input.mileage !== undefined && { mileage: input.mileage }),
        ...(input.condition !== undefined && { condition: input.condition }),
        ...(input.fuelType !== undefined && { fuelType: input.fuelType }),
        ...(input.transmission !== undefined && {
          transmission: input.transmission,
        }),
        ...(input.drivetrain !== undefined && { drivetrain: input.drivetrain }),
        ...(input.bodyStyle !== undefined && { bodyStyle: input.bodyStyle }),
        ...(input.engineSize !== undefined && { engineSize: input.engineSize }),
        ...(input.engineCylinders !== undefined && {
          engineCylinders: input.engineCylinders,
        }),
        ...(input.horsepower !== undefined && { horsepower: input.horsepower }),
        ...(input.mpgCity !== undefined && { mpgCity: input.mpgCity }),
        ...(input.mpgHighway !== undefined && { mpgHighway: input.mpgHighway }),
        ...(input.mpgCombined !== undefined && {
          mpgCombined: input.mpgCombined,
        }),
        ...(input.exteriorColor !== undefined && {
          exteriorColor: input.exteriorColor,
        }),
        ...(input.interiorColor !== undefined && {
          interiorColor: input.interiorColor,
        }),
        ...(input.status !== undefined && { status: input.status }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
        ...(input.isFeatured !== undefined && { isFeatured: input.isFeatured }),
        ...(input.rawData !== undefined && { rawData: input.rawData }),
        ...(input.processedData !== undefined && {
          processedData: input.processedData,
        }),
        ...(input.features !== undefined && { features: input.features }),
        ...(input.specifications !== undefined && {
          specifications: input.specifications,
        }),
        ...(input.images !== undefined && { images: input.images }),
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && {
          description: input.description,
        }),
        ...(input.slug !== undefined && { slug: input.slug }),
      }

      await inventoryRepository.updateInventory(input.id, updateData)

      // Return updated inventory
      return this.getInventoryById({ input: { id: input.id } })
    } catch (error) {
      this.handleError(error, "update inventory")
    }
  }

  /**
   * Delete inventory item
   */
  public async deleteInventory(
    args: DeleteInventoryArgs
  ): Promise<{ success: boolean }> {
    try {
      const { input, session } = args

      // Check permissions
      this.checkIsAdmin(session)

      // Check if inventory exists
      const existingInventory = await inventoryRepository.findInventoryById(
        input.id
      )
      if (!existingInventory) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Inventory item not found",
        })
      }

      await inventoryRepository.deleteInventory(input.id)

      return { success: true }
    } catch (error) {
      this.handleError(error, "delete inventory")
    }
  }

  /**
   * Get inventory filters
   */
  public async getInventoryFilters(
    args: GetInventoryFiltersArgs
  ): Promise<InventoryFilters> {
    try {
      const { input } = args

      return inventoryRepository.getInventoryFilters(input.dealershipId)
    } catch (error) {
      this.handleError(error, "get inventory filters")
    }
  }

  /**
   * Get inventory statistics
   */
  public async getInventoryStats(
    args: GetInventoryStatsArgs
  ): Promise<InventoryStats> {
    try {
      const { input, session } = args

      // Check permissions
      this.checkIsAdmin(session)

      return inventoryRepository.getInventoryStats(input.dealershipId)
    } catch (error) {
      this.handleError(error, "get inventory stats")
    }
  }

  /**
   * Bulk create inventory items
   */
  public async bulkCreateInventory(
    args: BulkCreateInventoryArgs
  ): Promise<{ count: number }> {
    try {
      const { input, session } = args

      // Check permissions
      this.checkIsAdmin(session)

      // Validate items
      if (input.items.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No items provided",
        })
      }

      if (input.items.length > 1000) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot create more than 1000 items at once",
        })
      }

      // Transform items
      const transformedItems = input.items.map((item) => ({
        dealershipId: item.dealershipId,
        sourceUrl: item.sourceUrl,
        vin: item.vin,
        stockNumber: item.stockNumber,
        make: item.make,
        model: item.model,
        year: item.year,
        trim: item.trim,
        priceAmount: item.priceAmount
          ? Math.round(item.priceAmount * 100)
          : null,
        priceCurrency: item.priceCurrency || "USD",
        msrpAmount: item.msrpAmount ? Math.round(item.msrpAmount * 100) : null,
        mileage: item.mileage,
        condition: item.condition || "UNKNOWN",
        fuelType: item.fuelType || "UNKNOWN",
        transmission: item.transmission || "UNKNOWN",
        drivetrain: item.drivetrain || "UNKNOWN",
        bodyStyle: item.bodyStyle || "UNKNOWN",
        engineSize: item.engineSize,
        engineCylinders: item.engineCylinders,
        horsepower: item.horsepower,
        mpgCity: item.mpgCity,
        mpgHighway: item.mpgHighway,
        mpgCombined: item.mpgCombined,
        exteriorColor: item.exteriorColor,
        interiorColor: item.interiorColor,
        status: item.status || "AVAILABLE",
        isActive: item.isActive ?? true,
        isFeatured: item.isFeatured ?? false,
        rawData: item.rawData,
        processedData: item.processedData,
        features: item.features,
        specifications: item.specifications,
        images: item.images,
        title: item.title,
        description: item.description,
        slug:
          item.slug ||
          this.generateSlug(item.year, item.make, item.model, item.trim),
      }))

      return inventoryRepository.bulkCreateInventory(transformedItems)
    } catch (error) {
      this.handleError(error, "bulk create inventory")
    }
  }

  /**
   * Search inventory
   */
  public async searchInventory(args: SearchInventoryArgs): Promise<{
    items: InventoryWithDealership[]
    nextCursor?: string
    hasMore: boolean
  }> {
    try {
      const { input } = args

      if (!input.query || input.query.trim().length < 2) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Search query must be at least 2 characters long",
        })
      }

      const result = await inventoryRepository.searchInventory({
        query: input.query.trim(),
        filters: input.filters,
        limit: input.limit || 20,
        cursor: input.cursor,
      })

      // Transform price from cents to dollars
      const transformedItems = result.items.map((item) => ({
        ...item,
        priceAmount: item.priceAmount
          ? Math.round(item.priceAmount / 100)
          : null,
        msrpAmount: item.msrpAmount ? Math.round(item.msrpAmount / 100) : null,
      }))

      return {
        ...result,
        items: transformedItems,
      }
    } catch (error) {
      this.handleError(error, "search inventory")
    }
  }

  /**
   * Get dealerships
   */
  public async getDealerships(args: GetDealershipsArgs) {
    try {
      const { input } = args

      return inventoryRepository.getDealerships({
        search: input.search,
        isActive: input.isActive,
        limit: input.limit,
      })
    } catch (error) {
      this.handleError(error, "get dealerships")
    }
  }

  /**
   * Generate slug for inventory item
   */
  private generateSlug(
    year?: number,
    make?: string,
    model?: string,
    trim?: string
  ): string {
    const parts = [year, make, model, trim].filter(Boolean)
    return parts
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  }

  /**
   * Check if user is admin
   */
  private checkIsAdmin(session: { role: string }): void {
    if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required",
      })
    }
  }

  /**
   * Handle errors consistently
   */
  private handleError(error: unknown, action: string): never {
    console.error(`Error during ${action}:`, error)

    if (error instanceof TRPCError) {
      throw error
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to ${action}`,
      cause: error,
    })
  }
}

export const inventoryService = new InventoryService()
