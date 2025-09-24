/* eslint-disable */

import { NextRequest, NextResponse } from "next/server"
import { readdir, readFile } from "fs/promises"
import { join } from "path"
import { db } from "@package/db"

interface ImportStats {
  totalFiles: number
  totalRecords: number
  successfulInserts: number
  failedInserts: number
  dealerships: Record<string, number>
  processingTime: number
}

// Transform different JSON structures to match our schema
function transformInventoryData(rawData: any, fileName: string): any[] {
  if (!Array.isArray(rawData)) {
    console.warn(`File ${fileName} does not contain an array`)
    return []
  }

  const dealershipName = extractDealershipName(fileName)

  return rawData
    .map((item: any) => {
      // Handle different data structures from various dealerships
      const transformed = {
        // Core identifiers
        sourceUrl: item.url || item.sourceUrl || null,
        vin: item.vin || item.VIN || null,
        stockNumber: item.stockNumber || item.stock || null,

        // Vehicle information
        make: extractMake(item),
        model: extractModel(item),
        year: extractYear(item),
        trim: item.trim || null,

        // Pricing (convert to cents for precision)
        priceAmount: extractPrice(item),
        priceCurrency: "USD",

        // Specifications
        mileage: extractMileage(item),
        condition: extractCondition(item),
        fuelType: extractFuelType(item),
        transmission: extractTransmission(item),
        drivetrain: extractDrivetrain(item),
        bodyStyle: extractBodyStyle(item),

        // Engine details
        engineSize: extractEngineSize(item),
        horsepower: extractHorsepower(item),

        // Fuel economy
        mpgCity: extractMpgCity(item),
        mpgHighway: extractMpgHighway(item),
        mpgCombined: extractMpgCombined(item),

        // Colors
        exteriorColor: extractExteriorColor(item),
        interiorColor: extractInteriorColor(item),

        // Status
        status: "AVAILABLE",
        isActive: true,
        isFeatured: false,

        // Data tracking
        scrapedAt: item.scrapedAt ? new Date(item.scrapedAt) : new Date(),
        lastUpdated: new Date(),

        // Flexible JSON fields
        rawData: item, // Store complete original data
        features: extractFeatures(item),
        specifications: extractSpecifications(item),
        images: extractImages(item),

        // SEO
        title:
          item.title ||
          `${extractYear(item)} ${extractMake(item)} ${extractModel(item)}`,
        description: item.description || null,
        slug: generateSlug(item, dealershipName),

        // Dealership (will be set after creating/finding dealership)
        dealershipId: "", // Will be populated later
      }

      return transformed
    })
    .filter((item) => item.make && item.model) // Filter out invalid records
}

// Helper functions for data extraction
function extractDealershipName(fileName: string): string {
  return fileName
    .replace(/_data_\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}\.json$/, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
}

function extractMake(item: any): string | null {
  // Direct make field
  if (item.make) return item.make
  if (item.Make) return item.Make

  // Extract from title
  if (item.title) {
    const title = item.title.toLowerCase()

    // Common makes to look for in titles
    const makes = [
      "toyota",
      "honda",
      "ford",
      "chevrolet",
      "chevy",
      "nissan",
      "hyundai",
      "kia",
      "mazda",
      "subaru",
      "volkswagen",
      "vw",
      "bmw",
      "mercedes",
      "audi",
      "lexus",
      "acura",
      "infiniti",
      "cadillac",
      "buick",
      "gmc",
      "jeep",
      "ram",
      "dodge",
      "chrysler",
      "lincoln",
      "volvo",
      "jaguar",
      "land rover",
      "porsche",
      "tesla",
      "mitsubishi",
      "suzuki",
      "isuzu",
      "fiat",
      "alfa romeo",
      "genesis",
    ]

    for (const make of makes) {
      if (title.includes(make)) {
        // Capitalize first letter
        return make.charAt(0).toUpperCase() + make.slice(1)
      }
    }

    // If no known make found, try to extract from title pattern
    // "Pre-Owned 2014 Jeep Patriot" -> "Jeep"
    // "2025 Camry LE FWD" -> need to infer from dealership
    const titleParts = item.title.split(" ")
    if (titleParts.length >= 3) {
      const potentialMake = titleParts[2] // Usually 3rd word after year
      if (potentialMake && potentialMake.length > 2) {
        return potentialMake
      }
    }
  }

  // Extract from model field
  if (typeof item.model === "string") {
    const modelParts = item.model.split(" ")
    if (modelParts.length > 0) {
      return modelParts[0]
    }
  }

  return null
}

function extractModel(item: any): string | null {
  if (item.model && item.model !== item.make) return item.model
  if (item.Model) return item.Model

  if (item.title) {
    const title = item.title

    // Handle different title patterns
    // "Pre-Owned 2014 Jeep Patriot Latitude 4WD" -> "Patriot"
    // "2025 Camry LE FWD" -> "Camry"

    // Remove common prefixes
    let cleanTitle = title
      .replace(/^(New|Used|Pre-Owned|Certified)\s+/i, "")
      .replace(/^\d{4}\s+/, "") // Remove year

    // Extract make from our previous function to remove it from model
    const make = extractMake(item)
    if (make) {
      cleanTitle = cleanTitle.replace(new RegExp(`^${make}\\s+`, "i"), "")
    }

    // Get the first word as model (before trim/variant info)
    const modelParts = cleanTitle.split(" ")
    if (modelParts.length > 0 && modelParts[0].length > 1) {
      return modelParts[0]
    }

    // Fallback: try to extract from title parts
    const titleParts = title.split(" ")
    if (titleParts.length >= 3) {
      // Skip year and make, get model
      for (let i = 1; i < titleParts.length; i++) {
        const part = titleParts[i]
        if (part && !part.match(/^\d{4}$/) && part.length > 2) {
          return part
        }
      }
    }
  }

  return null
}

function extractYear(item: any): number | null {
  const year = item.year || item.Year || item.modelYear
  if (typeof year === "string") {
    const parsed = parseInt(year)
    return isNaN(parsed) ? null : parsed
  }
  return typeof year === "number" ? year : null
}

function extractPrice(item: any): number | null {
  const price = item.price || item.priceAmount || item.priceNumeric
  if (typeof price === "string") {
    // Remove currency symbols and convert to cents
    const numericPrice = parseFloat(price.replace(/[$,]/g, ""))
    return isNaN(numericPrice) ? null : Math.round(numericPrice * 100)
  }
  if (typeof price === "number") {
    return Math.round(price * 100) // Convert to cents
  }
  return null
}

function extractMileage(item: any): number | null {
  const mileage =
    item.mileage ||
    item.basicInfo?.Mileage ||
    item.basicDetails?.Mileage ||
    item.features?.Mileage

  if (typeof mileage === "string") {
    const parsed = parseInt(mileage.replace(/[,\s]/g, ""))
    return isNaN(parsed) ? null : parsed
  }
  return typeof mileage === "number" ? mileage : null
}

function extractCondition(item: any): string {
  if (item.condition) return item.condition.toUpperCase()
  if (item.title?.toLowerCase().includes("new")) return "NEW"
  if (
    item.title?.toLowerCase().includes("used") ||
    item.title?.toLowerCase().includes("pre-owned")
  )
    return "USED"
  return "UNKNOWN"
}

function extractFuelType(item: any): string {
  const type = item.fuelType || item.type || item.fuel
  if (type?.toLowerCase().includes("hybrid")) return "HYBRID"
  if (type?.toLowerCase().includes("electric")) return "ELECTRIC"
  if (type?.toLowerCase().includes("diesel")) return "DIESEL"
  return "GASOLINE"
}

function extractTransmission(item: any): string {
  const trans =
    item.transmission ||
    item.basicInfo?.Transmission ||
    item.basicDetails?.Transmission ||
    item.features?.Transmission

  if (!trans) return "UNKNOWN"
  const transStr = trans.toLowerCase()
  if (transStr.includes("manual")) return "MANUAL"
  if (transStr.includes("cvt")) return "CVT"
  if (transStr.includes("automatic")) return "AUTOMATIC"
  return "UNKNOWN"
}

function extractDrivetrain(item: any): string {
  const drive =
    item.drivetrain ||
    item.basicInfo?.Drivetrain ||
    item.basicDetails?.Drivetrain ||
    item.features?.Drivetrain

  if (!drive) return "UNKNOWN"
  const driveStr = drive.toLowerCase()
  if (driveStr.includes("awd") || driveStr.includes("all wheel")) return "AWD"
  if (driveStr.includes("4wd") || driveStr.includes("4-wheel")) return "FOUR_WD"
  if (driveStr.includes("fwd") || driveStr.includes("front")) return "FWD"
  if (driveStr.includes("rwd") || driveStr.includes("rear")) return "RWD"
  return "UNKNOWN"
}

function extractBodyStyle(item: any): string {
  const body = item.bodyStyle || item.body || item.type
  if (!body) return "UNKNOWN"
  const bodyStr = body.toLowerCase()
  if (bodyStr.includes("sedan")) return "SEDAN"
  if (bodyStr.includes("suv")) return "SUV"
  if (bodyStr.includes("truck") || bodyStr.includes("pickup")) return "PICKUP"
  if (bodyStr.includes("coupe")) return "COUPE"
  if (bodyStr.includes("hatchback")) return "HATCHBACK"
  if (bodyStr.includes("wagon")) return "WAGON"
  if (bodyStr.includes("van")) return "VAN"
  if (bodyStr.includes("convertible")) return "CONVERTIBLE"
  return "UNKNOWN"
}

function extractEngineSize(item: any): number | null {
  const engine =
    item.engine || item.basicInfo?.Engine || item.basicDetails?.Engine

  if (!engine) return null
  const match = engine.match(/(\d+\.?\d*)[lL]/)
  return match ? parseFloat(match[1]) : null
}

function extractHorsepower(item: any): number | null {
  const hp = item.horsepower || item.hp
  if (typeof hp === "string") {
    const parsed = parseInt(hp)
    return isNaN(parsed) ? null : parsed
  }
  return typeof hp === "number" ? hp : null
}

function extractMpgCity(item: any): number | null {
  const mpg = item.mpgCity || item.cityMpg
  if (typeof mpg === "string") {
    const parsed = parseInt(mpg)
    return isNaN(parsed) ? null : parsed
  }
  return typeof mpg === "number" ? mpg : null
}

function extractMpgHighway(item: any): number | null {
  const mpg = item.mpgHighway || item.highwayMpg
  if (typeof mpg === "string") {
    const parsed = parseInt(mpg)
    return isNaN(parsed) ? null : parsed
  }
  return typeof mpg === "number" ? mpg : null
}

function extractMpgCombined(item: any): number | null {
  const mpg = item.mpgCombined || item.combinedMpg
  if (typeof mpg === "string") {
    const parsed = parseInt(mpg)
    return isNaN(parsed) ? null : parsed
  }
  return typeof mpg === "number" ? mpg : null
}

function extractExteriorColor(item: any): string | null {
  return (
    item.exteriorColor ||
    item.basicInfo?.Exterior ||
    item.basicDetails?.Exterior ||
    item.color ||
    null
  )
}

function extractInteriorColor(item: any): string | null {
  return (
    item.interiorColor ||
    item.basicInfo?.Interior ||
    item.basicDetails?.Interior ||
    null
  )
}

function extractFeatures(item: any): any[] {
  const features: any[] = []

  // Handle keyFeatures array
  if (Array.isArray(item.keyFeatures)) {
    features.push(
      ...item.keyFeatures.map((feature: string) => ({
        category: "general",
        name: feature,
        isHighlight: true,
        source: "keyFeatures",
      }))
    )
  }

  // Handle features object
  if (item.features && typeof item.features === "object") {
    Object.entries(item.features).forEach(([key, value]) => {
      features.push({
        category: "specification",
        name: key,
        value: value,
        source: "features",
      })
    })
  }

  return features
}

function extractSpecifications(item: any): any[] {
  const specs: any[] = []

  // Handle basicInfo object
  if (item.basicInfo && typeof item.basicInfo === "object") {
    Object.entries(item.basicInfo).forEach(([key, value]) => {
      specs.push({
        category: "basic",
        name: key,
        value: value,
        source: "basicInfo",
      })
    })
  }

  // Handle specifications object
  if (item.specifications && typeof item.specifications === "object") {
    Object.entries(item.specifications).forEach(([category, items]) => {
      if (Array.isArray(items)) {
        items.forEach((spec: string) => {
          specs.push({
            category: category.toLowerCase(),
            name: spec,
            source: "specifications",
          })
        })
      }
    })
  }

  return specs
}

function extractImages(item: any): any[] {
  const images: any[] = []

  if (Array.isArray(item.images)) {
    item.images.forEach((url: string, index: number) => {
      images.push({
        url,
        type: "EXTERIOR",
        isPrimary: index === 0,
        displayOrder: index + 1,
      })
    })
  }

  return images
}

function generateSlug(item: any, dealershipName: string): string {
  const year = extractYear(item) || ""
  const make = extractMake(item) || ""
  const model = extractModel(item) || ""
  const vin = item.vin || item.VIN || ""

  return `${year}-${make}-${model}-${vin}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

// Create or find dealership
async function createOrFindDealership(name: string, fileName: string) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")

  let dealership = await db.dealership.findUnique({
    where: { slug },
  })

  if (!dealership) {
    dealership = await db.dealership.create({
      data: {
        name,
        slug,
        businessType: "DEALER",
        isActive: true,
        metadata: {
          sourceFile: fileName,
          createdFrom: "bulk-import",
        },
      },
    })
    console.log(`✅ Created dealership: ${name}`)
  }

  return dealership
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const stats: ImportStats = {
    totalFiles: 0,
    totalRecords: 0,
    successfulInserts: 0,
    failedInserts: 0,
    dealerships: {},
    processingTime: 0,
  }

  try {
    console.log("🚀 Starting bulk inventory import...")

    // Read data directory
    const dataDir = join(process.cwd(), "src/app/[lng]/data")
    const files = await readdir(dataDir)
    const jsonFiles = files.filter((file) => file.endsWith(".json"))

    stats.totalFiles = jsonFiles.length
    console.log(`📁 Found ${jsonFiles.length} JSON files`)

    // Process each file
    for (const fileName of jsonFiles) {
      console.log(`\n📄 Processing: ${fileName}`)

      try {
        // Read and parse JSON file
        const filePath = join(dataDir, fileName)
        const fileContent = await readFile(filePath, "utf-8")
        const rawData = JSON.parse(fileContent)

        // Transform data
        const transformedData = transformInventoryData(rawData, fileName)
        console.log(`   📊 Transformed ${transformedData.length} records`)

        if (transformedData.length === 0) {
          console.log(`   ⚠️  No valid records found in ${fileName}`)
          continue
        }

        // Create or find dealership
        const dealershipName = extractDealershipName(fileName)
        const dealership = await createOrFindDealership(
          dealershipName,
          fileName
        )

        // Add dealership ID to all records
        transformedData.forEach((item) => {
          item.dealershipId = dealership.id
        })

        // Bulk insert with batching
        const BATCH_SIZE = 500
        let batchCount = 0

        for (let i = 0; i < transformedData.length; i += BATCH_SIZE) {
          const batch = transformedData.slice(i, i + BATCH_SIZE)
          batchCount++

          try {
            const result = await db.inventory.createMany({
              data: batch,
              skipDuplicates: true,
            })

            stats.successfulInserts += result.count
            console.log(
              `   ✅ Batch ${batchCount}: Inserted ${result.count} records`
            )
          } catch (batchError) {
            console.error(`   ❌ Batch ${batchCount} failed:`, batchError)
            stats.failedInserts += batch.length
          }
        }

        stats.totalRecords += transformedData.length
        stats.dealerships[dealershipName] = transformedData.length
      } catch (fileError) {
        console.error(`❌ Error processing ${fileName}:`, fileError)
        stats.failedInserts += 1
      }
    }

    stats.processingTime = Date.now() - startTime

    // Final summary
    console.log("\n🎉 BULK IMPORT COMPLETED!")
    console.log("================================")
    console.log(`📁 Files processed: ${stats.totalFiles}`)
    console.log(`📊 Total records: ${stats.totalRecords.toLocaleString()}`)
    console.log(
      `✅ Successful inserts: ${stats.successfulInserts.toLocaleString()}`
    )
    console.log(`❌ Failed inserts: ${stats.failedInserts.toLocaleString()}`)
    console.log(
      `⏱️  Processing time: ${(stats.processingTime / 1000).toFixed(2)}s`
    )
    console.log("\n🏢 Dealerships:")
    Object.entries(stats.dealerships).forEach(([name, count]) => {
      console.log(`   • ${name}: ${count.toLocaleString()} vehicles`)
    })

    return NextResponse.json({
      success: true,
      message: "Bulk import completed successfully",
      stats,
    })
  } catch (error) {
    console.error("💥 Bulk import failed:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Bulk import failed",
        error: error instanceof Error ? error.message : "Unknown error",
        stats,
      },
      { status: 500 }
    )
  }
}
