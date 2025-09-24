/* eslint-disable */

import { db as prisma } from "@package/db"
import type { Prisma, Inventory, Dealership } from "@package/db"
import type {
  InventoryWithDealership,
  InventoryFilters,
} from "../service/inventory.service.types"

/**
 * Inventory repository for database operations
 * @description Handles all inventory-related database queries with optimized performance
 */
class InventoryRepository {
  /**
   * Create a new inventory item
   */
  public createInventory(
    data: Prisma.InventoryCreateInput
  ): Promise<Inventory> {
    return prisma.inventory.create({
      data,
    })
  }

  /**
   * Create multiple inventory items in bulk
   */
  public async bulkCreateInventory(
    data: Prisma.InventoryCreateManyInput[]
  ): Promise<{ count: number }> {
    return prisma.inventory.createMany({
      data,
      skipDuplicates: true,
    })
  }

  /**
   * Find inventory item by ID with dealership info
   */
  public findInventoryById(
    id: string
  ): Promise<InventoryWithDealership | null> {
    return prisma.inventory.findUnique({
      where: { id },
      include: {
        dealership: true,
      },
    }) as Promise<InventoryWithDealership | null>
  }

  /**
   * Find inventory item by slug with dealership info
   */
  public findInventoryBySlug(
    slug: string
  ): Promise<InventoryWithDealership | null> {
    return prisma.inventory.findFirst({
      where: { slug },
      include: {
        dealership: true,
      },
    }) as Promise<InventoryWithDealership | null>
  }

  /**
   * Find inventory item by VIN
   */
  public findInventoryByVin(vin: string): Promise<Inventory | null> {
    return prisma.inventory.findFirst({
      where: { vin },
    })
  }

  /**
   * Update inventory item
   */
  public updateInventory(
    id: string,
    data: Prisma.InventoryUpdateInput
  ): Promise<Inventory> {
    return prisma.inventory.update({
      where: { id },
      data,
    })
  }

  /**
   * Delete inventory item
   */
  public deleteInventory(id: string): Promise<Inventory> {
    return prisma.inventory.delete({
      where: { id },
    })
  }

  /**
   * Get paginated inventory with filters
   */
  public async getInventory(args: {
    make?: string
    model?: string
    year?: number
    minYear?: number
    maxYear?: number
    minPrice?: number
    maxPrice?: number
    condition?: string
    fuelType?: string
    transmission?: string
    drivetrain?: string
    bodyStyle?: string
    dealershipId?: string
    search?: string
    cursor?: string
    skip?: number
    limit: number
    sortBy?: string
    status?: string
    isActive?: boolean
    isFeatured?: boolean
  }): Promise<{
    items: InventoryWithDealership[]
    nextCursor?: string
    hasMore: boolean
    total: number
  }> {
    const {
      make,
      model,
      year,
      minYear,
      maxYear,
      minPrice,
      maxPrice,
      condition,
      fuelType,
      transmission,
      drivetrain,
      bodyStyle,
      dealershipId,
      search,
      cursor,
      skip,
      limit,
      sortBy = "created_desc",
      status,
      isActive = true,
      isFeatured,
    } = args

    // Build where clause
    const where: Prisma.InventoryWhereInput = {
      isActive,
      ...(status && { status }),
      ...(isFeatured !== undefined && { isFeatured }),
      ...(make && { make: { contains: make, mode: "insensitive" } }),
      ...(model && { model: { contains: model, mode: "insensitive" } }),
      ...(year && { year }),
      ...(minYear && { year: { gte: minYear } }),
      ...(maxYear && { year: { lte: maxYear } }),
      ...(minPrice && { priceAmount: { gte: minPrice * 100 } }), // Convert to cents
      ...(maxPrice && { priceAmount: { lte: maxPrice * 100 } }), // Convert to cents
      ...(condition && { condition }),
      ...(fuelType && { fuelType }),
      ...(transmission && { transmission }),
      ...(drivetrain && { drivetrain }),
      ...(bodyStyle && { bodyStyle }),
      ...(dealershipId && { dealershipId }),
      ...(search && {
        OR: [
          { make: { contains: search, mode: "insensitive" } },
          { model: { contains: search, mode: "insensitive" } },
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { vin: { contains: search, mode: "insensitive" } },
          { stockNumber: { contains: search, mode: "insensitive" } },
        ],
      }),
    }

    // Build orderBy clause
    let orderBy: Prisma.InventoryOrderByWithRelationInput = {
      createdAt: "desc",
    }
    switch (sortBy) {
      case "price_asc":
        orderBy = { priceAmount: "asc" }
        break
      case "price_desc":
        orderBy = { priceAmount: "desc" }
        break
      case "year_asc":
        orderBy = { year: "asc" }
        break
      case "year_desc":
        orderBy = { year: "desc" }
        break
      case "mileage_asc":
        orderBy = { mileage: "asc" }
        break
      case "mileage_desc":
        orderBy = { mileage: "desc" }
        break
      case "created_desc":
      default:
        orderBy = { createdAt: "desc" }
        break
    }

    // Get total count
    const total = await prisma.inventory.count({ where })

    // Get paginated results - support both cursor and skip pagination
    const items = (await prisma.inventory.findMany({
      where,
      include: {
        dealership: true,
      },
      orderBy,
      take: limit + 1, // Take one extra to check if there are more
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1, // Skip the cursor item
      }),
      ...(skip !== undefined &&
        !cursor && {
          skip: skip,
        }),
    })) as InventoryWithDealership[]

    const hasMore = items.length > limit
    if (hasMore) {
      items.pop() // Remove the extra item
    }

    const nextCursor =
      hasMore && items.length > 0 ? items[items.length - 1].id : undefined

    return {
      items,
      nextCursor,
      hasMore,
      total,
    }
  }

  /**
   * Get inventory filters data
   */
  public async getInventoryFilters(
    dealershipId?: string
  ): Promise<InventoryFilters> {
    const where: Prisma.InventoryWhereInput = {
      isActive: true,
      ...(dealershipId && { dealershipId }),
    }

    // Get aggregated data for filters
    const [
      makes,
      models,
      years,
      conditions,
      fuelTypes,
      transmissions,
      drivetrains,
      bodyStyles,
      priceStats,
      yearStats,
      mileageStats,
    ] = await Promise.all([
      // Makes
      prisma.inventory.groupBy({
        by: ["make"],
        where: {
          ...where,
          make: {
            not: "",
          },
        },
        _count: true,
        orderBy: { _count: { make: "desc" } },
      }),
      // Models
      prisma.inventory.groupBy({
        by: ["model"],
        where: {
          ...where,
          model: {
            not: "",
          },
        },
        _count: true,
        orderBy: { _count: { model: "desc" } },
      }),
      // Years
      prisma.inventory.groupBy({
        by: ["year"],
        where: {
          ...where,
          year: { not: null },
        },
        _count: true,
        orderBy: { year: "desc" },
      }),
      // Conditions
      prisma.inventory.groupBy({
        by: ["condition"],
        where: {
          ...where,
          condition: {
            not: "",
          },
        },
        _count: true,
        orderBy: { _count: { condition: "desc" } },
      }),
      // Fuel Types
      prisma.inventory.groupBy({
        by: ["fuelType"],
        where: {
          ...where,
          fuelType: {
            not: "",
          },
        },
        _count: true,
        orderBy: { _count: { fuelType: "desc" } },
      }),
      // Transmissions
      prisma.inventory.groupBy({
        by: ["transmission"],
        where: {
          ...where,
          transmission: {
            not: "",
          },
        },
        _count: true,
        orderBy: { _count: { transmission: "desc" } },
      }),
      // Drivetrains
      prisma.inventory.groupBy({
        by: ["drivetrain"],
        where: {
          ...where,
          drivetrain: {
            not: "",
          },
        },
        _count: true,
        orderBy: { _count: { drivetrain: "desc" } },
      }),
      // Body Styles
      prisma.inventory.groupBy({
        by: ["bodyStyle"],
        where: {
          ...where,
          bodyStyle: {
            not: "",
          },
        },
        _count: true,
        orderBy: { _count: { bodyStyle: "desc" } },
      }),
      // Price stats
      prisma.inventory.aggregate({
        where: { ...where, priceAmount: { not: null } },
        _min: { priceAmount: true },
        _max: { priceAmount: true },
      }),
      // Year stats
      prisma.inventory.aggregate({
        where: { ...where, year: { not: null } },
        _min: { year: true },
        _max: { year: true },
      }),
      // Mileage stats
      prisma.inventory.aggregate({
        where: { ...where, mileage: { not: null } },
        _min: { mileage: true },
        _max: { mileage: true },
      }),
    ])

    return {
      makes: makes.map((item: any) => ({
        value: item.make!,
        count: item._count,
      })),
      models: models.map((item: any) => ({
        value: item.model!,
        count: item._count,
      })),
      years: years.map((item: any) => ({
        value: item.year!,
        count: item._count,
      })),
      conditions: conditions.map((item: any) => ({
        value: item.condition!,
        count: item._count,
      })),
      fuelTypes: fuelTypes.map((item: any) => ({
        value: item.fuelType!,
        count: item._count,
      })),
      transmissions: transmissions.map((item: any) => ({
        value: item.transmission!,
        count: item._count,
      })),
      drivetrains: drivetrains.map((item: any) => ({
        value: item.drivetrain!,
        count: item._count,
      })),
      bodyStyles: bodyStyles.map((item: any) => ({
        value: item.bodyStyle!,
        count: item._count,
      })),
      priceRange: {
        min: priceStats._min?.priceAmount
          ? Math.floor(priceStats._min.priceAmount / 100)
          : 0,
        max: priceStats._max?.priceAmount
          ? Math.ceil(priceStats._max.priceAmount / 100)
          : 200000,
      },
      yearRange: {
        min: yearStats._min?.year || 1990,
        max: yearStats._max?.year || new Date().getFullYear() + 1,
      },
      mileageRange: {
        min: mileageStats._min?.mileage || 0,
        max: mileageStats._max?.mileage || 200000,
      },
    }
  }

  /**
   * Get inventory statistics
   */
  public async getInventoryStats(dealershipId?: string) {
    const where: Prisma.InventoryWhereInput = {
      ...(dealershipId && { dealershipId }),
    }

    const [
      totalInventory,
      activeInventory,
      featuredInventory,
      inventoryByMake,
      inventoryByCondition,
      inventoryByDealership,
      priceStats,
      recentInventory,
    ] = await Promise.all([
      // Total inventory
      prisma.inventory.count({ where }),
      // Active inventory
      prisma.inventory.count({ where: { ...where, isActive: true } }),
      // Featured inventory
      prisma.inventory.count({ where: { ...where, isFeatured: true } }),
      // Inventory by make
      prisma.inventory.groupBy({
        by: ["make"],
        where: { ...where, make: { not: null } },
        _count: true,
        orderBy: { _count: { make: "desc" } },
        take: 10,
      }),
      // Inventory by condition
      prisma.inventory.groupBy({
        by: ["condition"],
        where: { ...where, condition: { not: "" } },
        _count: true,
        orderBy: { _count: { condition: "desc" } },
      }),
      // Inventory by dealership
      prisma.inventory.groupBy({
        by: ["dealershipId"],
        where,
        _count: true,
        orderBy: { _count: { dealershipId: "desc" } },
        take: 10,
      }),
      // Price statistics
      prisma.inventory.aggregate({
        where: { ...where, priceAmount: { not: null } },
        _avg: { priceAmount: true },
        _min: { priceAmount: true },
        _max: { priceAmount: true },
      }),
      // Recent inventory
      prisma.inventory.findMany({
        where: { ...where, isActive: true },
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          dealership: true,
        },
      }),
    ])

    // Get dealership names for the stats
    const dealershipIds = inventoryByDealership.map(
      (item: any) => item.dealershipId
    )
    const dealerships = await prisma.dealership.findMany({
      where: { id: { in: dealershipIds } },
      select: { id: true, name: true },
    })

    const dealershipMap = new Map(dealerships.map((d: any) => [d.id, d.name]))

    return {
      totalInventory,
      activeInventory,
      featuredInventory,
      inventoryByMake: inventoryByMake.map((item: any) => ({
        make: item.make!,
        count: item._count,
      })),
      inventoryByCondition: inventoryByCondition.map((item: any) => ({
        condition: item.condition!,
        count: item._count,
      })),
      inventoryByDealership: inventoryByDealership.map((item: any) => ({
        dealershipName: dealershipMap.get(item.dealershipId) || "Unknown",
        count: item._count,
      })),
      averagePrice: priceStats._avg.priceAmount
        ? Math.round(priceStats._avg.priceAmount / 100)
        : 0,
      priceRange: {
        min: priceStats._min.priceAmount
          ? Math.floor(priceStats._min.priceAmount / 100)
          : 0,
        max: priceStats._max.priceAmount
          ? Math.ceil(priceStats._max.priceAmount / 100)
          : 200000,
      },
      recentInventory,
    }
  }

  /**
   * Search inventory with full-text search
   */
  public async searchInventory(args: {
    query: string
    filters?: {
      make?: string
      model?: string
      minPrice?: number
      maxPrice?: number
      minYear?: number
      maxYear?: number
      condition?: string
      fuelType?: string
      dealershipId?: string
    }
    limit?: number
    cursor?: string
  }): Promise<{
    items: InventoryWithDealership[]
    nextCursor?: string
    hasMore: boolean
  }> {
    const { query, filters = {}, limit = 20, cursor } = args

    const where: Prisma.InventoryWhereInput = {
      isActive: true,
      OR: [
        { make: { contains: query, mode: "insensitive" } },
        { model: { contains: query, mode: "insensitive" } },
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { vin: { contains: query, mode: "insensitive" } },
        { stockNumber: { contains: query, mode: "insensitive" } },
      ],
      ...(filters.make && {
        make: { contains: filters.make, mode: "insensitive" },
      }),
      ...(filters.model && {
        model: { contains: filters.model, mode: "insensitive" },
      }),
      ...(filters.minPrice && { priceAmount: { gte: filters.minPrice * 100 } }),
      ...(filters.maxPrice && { priceAmount: { lte: filters.maxPrice * 100 } }),
      ...(filters.minYear && { year: { gte: filters.minYear } }),
      ...(filters.maxYear && { year: { lte: filters.maxYear } }),
      ...(filters.condition && { condition: filters.condition }),
      ...(filters.fuelType && { fuelType: filters.fuelType }),
      ...(filters.dealershipId && { dealershipId: filters.dealershipId }),
    }

    const items = (await prisma.inventory.findMany({
      where,
      include: {
        dealership: true,
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
    })) as InventoryWithDealership[]

    const hasMore = items.length > limit
    if (hasMore) {
      items.pop()
    }

    const nextCursor =
      hasMore && items.length > 0 ? items[items.length - 1].id : undefined

    return {
      items,
      nextCursor,
      hasMore,
    }
  }

  /**
   * Get all dealerships
   */
  public async getDealerships(args: {
    search?: string
    isActive?: boolean
    limit?: number
  }): Promise<Dealership[]> {
    const { search, isActive = true, limit = 100 } = args

    return prisma.dealership.findMany({
      where: {
        isActive,
        ...(search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      orderBy: { name: "asc" },
      take: limit,
    })
  }
}

export const inventoryRepository = new InventoryRepository()
