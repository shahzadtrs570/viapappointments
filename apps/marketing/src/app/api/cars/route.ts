import { NextRequest, NextResponse } from "next/server"
import { db } from "@package/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const make = searchParams.get("make")
    const model = searchParams.get("model")
    const yearMin = searchParams.get("yearMin")
    const yearMax = searchParams.get("yearMax")
    const priceMin = searchParams.get("priceMin")
    const priceMax = searchParams.get("priceMax")
    const condition = searchParams.get("condition")
    const fuelType = searchParams.get("fuelType")
    const transmission = searchParams.get("transmission")
    const drivetrain = searchParams.get("drivetrain")
    const bodyStyle = searchParams.get("bodyStyle")

    // Build the where clause
    const where: any = {
      isActive: true,
      status: "AVAILABLE",
    }

    if (make) where.make = make
    if (model) where.model = { contains: model, mode: "insensitive" }
    if (condition) where.condition = condition
    if (fuelType) where.fuelType = fuelType
    if (transmission) where.transmission = transmission
    if (drivetrain) where.drivetrain = drivetrain
    if (bodyStyle) where.bodyStyle = bodyStyle

    // Year range filter
    if (yearMin || yearMax) {
      where.year = {}
      if (yearMin) where.year.gte = parseInt(yearMin)
      if (yearMax) where.year.lte = parseInt(yearMax)
    }

    // Price range filter
    if (priceMin || priceMax) {
      where.priceAmount = {}
      if (priceMin) where.priceAmount.gte = parseInt(priceMin) * 100 // Convert to cents
      if (priceMax) where.priceAmount.lte = parseInt(priceMax) * 100 // Convert to cents
    }

    // Get total count for pagination
    const totalCount = await db.inventory.count({ where })

    // Get vehicles with pagination
    const vehicles = await db.inventory.findMany({
      where,
      include: {
        dealership: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    })

    // Transform the data to match the expected format
    const transformedVehicles = vehicles.map((vehicle) => ({
      id: vehicle.id,
      make: vehicle.make || "Unknown",
      model: vehicle.model || "Unknown",
      year: vehicle.year || 2020,
      trim: vehicle.trim || "",
      bodyStyle: vehicle.bodyStyle || "Unknown",
      vin: vehicle.vin || "",
      stockNumber: vehicle.stockNumber || "",
      priceAmount: vehicle.priceAmount ? vehicle.priceAmount / 100 : 0, // Convert from cents
      msrpAmount: vehicle.msrpAmount ? vehicle.msrpAmount / 100 : 0, // Convert from cents
      priceCurrency: vehicle.priceCurrency || "USD",
      mileage: vehicle.mileage || 0,
      condition: vehicle.condition || "Used",
      fuelType: vehicle.fuelType || "Unknown",
      transmission: vehicle.transmission || "Unknown",
      drivetrain: vehicle.drivetrain || "Unknown",
      engineSize: vehicle.engineSize || 0,
      engineCylinders: vehicle.engineCylinders || 0,
      horsepower: vehicle.horsepower || 0,
      mpgCity: vehicle.mpgCity || 0,
      mpgHighway: vehicle.mpgHighway || 0,
      mpgCombined: vehicle.mpgCombined || 0,
      exteriorColor: vehicle.exteriorColor || "Unknown",
      interiorColor: vehicle.interiorColor || "Unknown",
      title: vehicle.title || `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      description: vehicle.description || "",
      images: vehicle.images || [],
      features: vehicle.features || [],
      specifications: vehicle.specifications || [],
      dealership: vehicle.dealership ? {
        id: vehicle.dealership.id,
        name: vehicle.dealership.name,
        phone: vehicle.dealership.phone,
        address: vehicle.dealership.address,
        website: vehicle.dealership.website,
        email: vehicle.dealership.email,
      } : null,
      status: vehicle.status || "AVAILABLE",
      isActive: vehicle.isActive,
      isFeatured: vehicle.isFeatured,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt,
    }))

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      vehicles: transformedVehicles,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
