import { NextRequest, NextResponse } from "next/server"
import { db } from "@package/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Try to find the vehicle by ID in the database
    const vehicle = await db.inventory.findUnique({
      where: {
        id: id,
      },
      include: {
        dealership: true,
      },
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: "Vehicle not found" },
        { status: 404 }
      )
    }

    // Transform the data to match the expected format
    const transformedVehicle = {
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
      rawData: vehicle.rawData,
    }

    return NextResponse.json(transformedVehicle)
  } catch (error) {
    console.error("Error fetching vehicle:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
