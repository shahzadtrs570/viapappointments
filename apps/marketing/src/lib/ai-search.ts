"use server"

import {
  AISearchResponse,
  VehicleFilters,
  defaultFilters,
} from "@/types/filters"

/**
 * Parse natural language search query into structured filters using AI
 *
 * Examples:
 * - "Find a boat under $30K near Miami"
 * - "Luxury SUV with low miles"
 * - "Electric cars under $50K"
 * - "2020 Honda Accord with leather seats"
 */
export async function parseSearchQuery(
  query: string
): Promise<AISearchResponse> {
  try {
    // Call OpenAI or your preferred AI service
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content: `You are an expert at parsing vehicle search queries. Convert natural language into structured filters.

Available filters:
- make: Array of car makes (e.g., ["Honda", "Toyota"])
- model: Specific model (e.g., "Accord")
- yearRange: [minYear, maxYear] (e.g., [2020, 2024])
- bodyStyle: Type like "SUV", "Sedan", "Truck", "Coupe", "Convertible"
- condition: "New", "Used", "Certified Pre-Owned"
- priceRange: [minPrice, maxPrice] (e.g., [20000, 50000])
- mileageRange: [minMiles, maxMiles]
- fuelType: Array like ["Electric", "Hybrid", "Gas", "Diesel"]
- transmission: Array like ["Automatic", "Manual"]
- drivetrain: Array like ["AWD", "FWD", "RWD", "4WD"]
- exteriorColor: Array of colors
- interiorColor: Array of colors
- features: Array like ["Leather Seats", "Sunroof", "Navigation", "Backup Camera"]
- horsepower: Minimum horsepower
- mpgCity/mpgHighway/mpgCombined: Minimum MPG values
- carType: "used" or "new"
- singleOwner: boolean
- hideWithoutPhotos: boolean
- sellerType: Array like ["Dealer", "Private"]

Extract ALL relevant information from the query. Be generous with interpretations:
- "luxury" = higher price range + features like leather
- "low miles" = mileageRange [0, 30000]
- "near [city]" = add to search field for location-based results
- "under $X" = priceRange [0, X]
- "over $X" = priceRange [X, 999999]
- Year mentions like "2020" or "recent" = appropriate yearRange

Respond ONLY with valid JSON matching this structure:
{
  "filters": { /* VehicleFilters object */ },
  "confidence": 0.95, // 0-1 confidence score
  "interpretation": "Looking for a used luxury SUV under $50,000 with low mileage"
}

IMPORTANT: 
- Only include filters that are mentioned or strongly implied
- Use empty arrays [] for unmentioned array fields
- Use 0 for unmentioned number fields
- Leave strings empty "" for unmentioned fields
- Be smart about implications (luxury = higher price + features)`,
          },
          {
            role: "user",
            content: query,
          },
        ],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: "json_object" },
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = JSON.parse(data.choices[0].message.content)

    // Merge AI filters with defaults
    const filters: Partial<VehicleFilters> = {
      ...aiResponse.filters,
      search: query, // Always include original query for fallback search
    }

    return {
      filters,
      confidence: aiResponse.confidence || 0.8,
      originalQuery: query,
      interpretation: aiResponse.interpretation || "Searching for vehicles...",
    }
  } catch (error) {
    console.error("AI search parsing error:", error)

    // Fallback: Return basic filters with search query
    return {
      filters: {
        search: query,
        carType: "used",
      },
      confidence: 0.5,
      originalQuery: query,
      interpretation: "Performing basic search...",
    }
  }
}

/**
 * Alternative: Use a simpler keyword-based parser without AI
 * Good for development/testing without API costs
 */
export async function parseSearchQuerySimple(
  query: string
): Promise<AISearchResponse> {
  const filters: Partial<VehicleFilters> = {
    search: query,
  }

  const lowerQuery = query.toLowerCase()

  // Extract price
  const priceMatch = lowerQuery.match(/under\s+\$?(\d+)k?/i)
  if (priceMatch) {
    const price =
      parseInt(priceMatch[1]) * (priceMatch[0].includes("k") ? 1000 : 1)
    filters.priceRange = [0, price]
  }

  // Extract make
  const makes = [
    "honda",
    "toyota",
    "ford",
    "chevrolet",
    "bmw",
    "mercedes",
    "audi",
    "tesla",
    "nissan",
    "mazda",
  ]
  const foundMake = makes.find((make) => lowerQuery.includes(make))
  if (foundMake) {
    filters.make = [foundMake.charAt(0).toUpperCase() + foundMake.slice(1)]
  }

  // Extract body style
  if (lowerQuery.includes("suv")) filters.bodyStyle = "SUV"
  if (lowerQuery.includes("sedan")) filters.bodyStyle = "Sedan"
  if (lowerQuery.includes("truck")) filters.bodyStyle = "Truck"
  if (lowerQuery.includes("coupe")) filters.bodyStyle = "Coupe"

  // Extract fuel type
  if (lowerQuery.includes("electric")) filters.fuelType = ["Electric"]
  if (lowerQuery.includes("hybrid")) filters.fuelType = ["Hybrid"]

  // Extract mileage
  if (lowerQuery.includes("low mile")) {
    filters.mileageRange = [0, 30000]
  }

  // Luxury implies price and features
  if (lowerQuery.includes("luxury")) {
    filters.priceRange = filters.priceRange || [40000, 999999]
    filters.features = ["Leather Seats", "Premium Sound"]
  }

  // New vs Used
  if (lowerQuery.includes("new car") || lowerQuery.includes("brand new")) {
    filters.carType = "new"
  } else {
    filters.carType = "used"
  }

  return {
    filters,
    confidence: 0.7,
    originalQuery: query,
    interpretation: `Searching for: ${query}`,
  }
}
