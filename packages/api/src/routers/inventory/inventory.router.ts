import { z } from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../../trpc"
import { inventoryService } from "./service/inventory.service"

// Input validation schemas
const getInventorySchema = z.object({
  // Filtering options
  make: z.array(z.string()).optional(),
  model: z.string().optional(),
  year: z.number().int().min(1900).max(2030).optional(),
  minYear: z.number().int().min(1900).max(2030).optional(),
  maxYear: z.number().int().min(1900).max(2030).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  minMileage: z.number().int().min(0).optional(),
  maxMileage: z.number().int().min(0).optional(),
  condition: z.string().optional(),
  fuelType: z.array(z.string()).optional(),
  transmission: z.array(z.string()).optional(),
  drivetrain: z.array(z.string()).optional(),
  bodyStyle: z.string().optional(),
  dealershipId: z.string().optional(),

  // Additional filters
  trim: z.array(z.string()).optional(),
  exteriorColor: z.array(z.string()).optional(),
  interiorColor: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),

  // Engine and MPG filters
  minEngineSize: z.number().min(0).optional(),
  minHorsepower: z.number().int().min(0).optional(),
  minMpgCity: z.number().int().min(0).optional(),
  minMpgHighway: z.number().int().min(0).optional(),
  minMpgCombined: z.number().int().min(0).optional(),

  // Boolean filters
  hideWithoutPhotos: z.boolean().optional(),
  singleOwner: z.boolean().optional(),
  priceDrops: z.boolean().optional(),
  onlineFinancing: z.boolean().optional(),

  // Financing options
  financingOptions: z.array(z.string()).optional(),

  // Days on market
  minDaysOnMarket: z.number().int().min(0).optional(),
  maxDaysOnMarket: z.number().int().min(0).optional(),

  // Seller type
  sellerType: z.array(z.string()).optional(),

  // Search and pagination
  search: z.string().optional(),
  cursor: z.string().optional(),
  skip: z.number().int().min(0).default(0),
  limit: z.number().int().min(1).max(100).default(15),

  // Sorting
  sortBy: z
    .enum([
      "price_asc",
      "price_desc",
      "year_asc",
      "year_desc",
      "mileage_asc",
      "mileage_desc",
      "created_desc",
    ])
    .default("created_desc"),

  // Status filters
  status: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().optional(),
})

const createInventorySchema = z.object({
  dealershipId: z.string(),
  sourceUrl: z.string().url().optional(),
  vin: z.string().optional(),
  stockNumber: z.string().optional(),

  // Vehicle information
  make: z.string().optional(),
  model: z.string().optional(),
  year: z.number().int().min(1900).max(2030).optional(),
  trim: z.string().optional(),

  // Pricing
  priceAmount: z.number().min(0).optional(),
  priceCurrency: z.string().default("USD"),
  msrpAmount: z.number().min(0).optional(),

  // Specifications
  mileage: z.number().int().min(0).optional(),
  condition: z.string().default("UNKNOWN"),
  fuelType: z.string().default("UNKNOWN"),
  transmission: z.string().default("UNKNOWN"),
  drivetrain: z.string().default("UNKNOWN"),
  bodyStyle: z.string().default("UNKNOWN"),

  // Engine details
  engineSize: z.number().min(0).optional(),
  engineCylinders: z.number().int().min(1).max(16).optional(),
  horsepower: z.number().int().min(0).optional(),

  // Fuel economy
  mpgCity: z.number().int().min(0).optional(),
  mpgHighway: z.number().int().min(0).optional(),
  mpgCombined: z.number().int().min(0).optional(),

  // Colors
  exteriorColor: z.string().optional(),
  interiorColor: z.string().optional(),

  // Status
  status: z.string().default("AVAILABLE"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),

  // Data
  rawData: z.any().optional(),
  processedData: z.any().optional(),
  features: z.any().optional(),
  specifications: z.any().optional(),
  images: z.any().optional(),

  // SEO
  title: z.string().optional(),
  description: z.string().optional(),
  slug: z.string().optional(),
})

const updateInventorySchema = z
  .object({
    id: z.string(),
  })
  .merge(createInventorySchema.partial())

const bulkCreateInventorySchema = z.object({
  items: z.array(createInventorySchema).min(1).max(1000),
})

const searchInventorySchema = z.object({
  query: z.string().min(2),
  filters: z
    .object({
      make: z.string().optional(),
      model: z.string().optional(),
      minPrice: z.number().min(0).optional(),
      maxPrice: z.number().min(0).optional(),
      minYear: z.number().int().min(1900).max(2030).optional(),
      maxYear: z.number().int().min(1900).max(2030).optional(),
      condition: z.string().optional(),
      fuelType: z.string().optional(),
      dealershipId: z.string().optional(),
    })
    .optional(),
  limit: z.number().int().min(1).max(100).default(20),
  cursor: z.string().optional(),
})

export const inventoryRouter = createTRPCRouter({
  /**
   * Get paginated inventory with filters
   */
  getInventory: publicProcedure
    .input(getInventorySchema)
    .query(async ({ input }) => {
      return inventoryService.getInventory({ input })
    }),

  /**
   * Get inventory item by ID
   */
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      return inventoryService.getInventoryById({ input })
    }),

  /**
   * Get inventory item by slug
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      return inventoryService.getInventoryBySlug({ input })
    }),

  /**
   * Search inventory
   */
  search: publicProcedure
    .input(searchInventorySchema)
    .query(async ({ input }) => {
      return inventoryService.searchInventory({ input })
    }),

  /**
   * Get inventory filters data
   */
  getFilters: publicProcedure
    .input(z.object({ dealershipId: z.string().optional() }))
    .query(async ({ input }) => {
      return inventoryService.getInventoryFilters({ input })
    }),

  /**
   * Get dealerships
   */
  getDealerships: publicProcedure
    .input(
      z.object({
        search: z.string().optional(),
        isActive: z.boolean().default(true),
        limit: z.number().int().min(1).max(100).default(100),
      })
    )
    .query(async ({ input }) => {
      return inventoryService.getDealerships({ input })
    }),

  /**
   * Create inventory item (Admin only)
   */
  create: protectedProcedure
    .input(createInventorySchema)
    .mutation(async ({ input, ctx }) => {
      return inventoryService.createInventory({
        input,
        session: ctx.session.user,
      })
    }),

  /**
   * Update inventory item (Admin only)
   */
  update: protectedProcedure
    .input(updateInventorySchema)
    .mutation(async ({ input, ctx }) => {
      return inventoryService.updateInventory({
        input,
        session: ctx.session.user,
      })
    }),

  /**
   * Delete inventory item (Admin only)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      return inventoryService.deleteInventory({
        input,
        session: ctx.session.user,
      })
    }),

  /**
   * Bulk create inventory items (Admin only)
   */
  bulkCreate: protectedProcedure
    .input(bulkCreateInventorySchema)
    .mutation(async ({ input, ctx }) => {
      return inventoryService.bulkCreateInventory({
        input,
        session: ctx.session.user,
      })
    }),

  /**
   * Get inventory statistics (Admin only)
   */
  getStats: protectedProcedure
    .input(z.object({ dealershipId: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      return inventoryService.getInventoryStats({
        input,
        session: ctx.session.user,
      })
    }),
})
