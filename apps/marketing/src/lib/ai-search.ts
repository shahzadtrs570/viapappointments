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
            content: `You are an expert marketplace query parser. Convert any natural-language query into structured JSON filters for a multi-category listings database.
You understand how real people describe vehicles, homes/real estate, boats, motorcycles, RVs, and general “things.” You resolve slang, abbreviations, ranges, and units.
Output (JSON only)
Return only valid JSON matching this structure:
{
  "category": [],                  // e.g. ["vehicle"], ["home"], ["boat"], ["motorcycle"], ["rv"], ["other"]
  "filters": {
    "location": "",                // city/state/zip text if present
    "radiusMiles": 0,              // numeric radius if implied ("within 50 miles")
    "priceRange": [0, 0],          // [min,max] in USD
    "sellerType": [],              // ["Dealer","Private","Broker","Agent"]
    "hideWithoutPhotos": false,
    "keywordInclude": [],          // extra terms to include
    "keywordExclude": [],          // terms to exclude
    "sortBy": ""                   // "best_match","newest","nearest","price_low","price_high","low_miles","high_mpg","most_beds", etc.
  },
  "vehicle": {                     // present only if category includes "vehicle","motorcycle","rv"
    "make": [],
    "model": "",
    "trim": "",
    "yearRange": [0, 0],
    "bodyStyle": "",               // "SUV","Sedan","Truck","Coupe","Convertible","Van","Wagon","Hatchback","Minivan"
    "condition": "",               // "New","Used","Certified Pre-Owned"
    "mileageRange": [0, 0],
    "fuelType": [],                // "Gas","Diesel","Hybrid","Electric","Plug-in Hybrid"
    "transmission": [],            // "Automatic","Manual"
    "drivetrain": [],              // "AWD","FWD","RWD","4WD"
    "exteriorColor": [],
    "interiorColor": [],
    "features": [],                // e.g., "Leather Seats","Sunroof","Navigation","Backup Camera","Third Row","Heated Seats","Remote Start","Tow Package"
    "horsepowerMin": 0,
    "mpgCityMin": 0,
    "mpgHighwayMin": 0,
    "mpgCombinedMin": 0,
    "doors": 0,
    "towingCapacityMin": 0
  },
  "home": {                        // present only if category includes "home"
    "for": "",                     // "sale" or "rent"
    "homeType": [],                // "House","Condo","Townhouse","Multi-Family","Apartment","Land"
    "bedsRange": [0, 0],
    "bathsRange": [0, 0],
    "sqftRange": [0, 0],
    "lotSizeRange": [0, 0],        // in sqft (convert acres -> sqft)
    "yearBuiltRange": [0, 0],
    "hoaFeeMax": 0,
    "petFriendly": null,           // true/false if specified
    "furnished": null,             // true/false if specified
    "parking": [],                 // "Garage","Carport","Assigned"
    "amenities": [],               // "Pool","Waterfront","Boat Slip","Dock","Fence","Fireplace","AC"
    "newConstruction": null
  },
  "boat": {                        // present only if category includes "boat"
    "boatType": [],                // "Center Console","Cuddy Cabin","Ski/Wake","Pontoon","Sailboat","Yacht","Bass Boat","Bay Boat"
    "lengthRangeFt": [0, 0],
    "yearRange": [0, 0],
    "engineType": [],              // "Outboard","Inboard","I/O","Electric","Sail"
    "engineCount": 0,
    "horsepowerMin": 0,
    "hoursRange": [0, 0],
    "hullMaterial": [],            // "Fiberglass","Aluminum","Wood"
    "features": [],                // "T-Top","Livewell","Trailer Included","GPS","Fishfinder","Bimini","Cabin","Generator"
    "waterfrontNeeded": null,      // true if search implies slip/dock
    "slipIncluded": null           // true if explicitly requested
  },
  "motorcycle": {                  // present only if category includes "motorcycle"
    "bikeType": [],                // "Cruiser","Sport","Touring","Adventure","Dual Sport","Dirt","Scooter"
    "make": [],
    "model": "",
    "yearRange": [0, 0],
    "mileageRange": [0, 0],
    "displacementCCRange": [0, 0],
    "transmission": [],            // "Manual","Automatic/DCT"
    "abs": null,
    "features": []                 // "Quickshifter","Heated Grips","Side Cases"
  },
  "rv": {                          // present only if category includes "rv"
    "rvType": [],                  // "Class A","Class B","Class C","Travel Trailer","Fifth Wheel","Toy Hauler","Pop-Up"
    "yearRange": [0, 0],
    "lengthRangeFt": [0, 0],
    "sleepCapacityMin": 0,
    "slidesMin": 0,
    "mileageRange": [0, 0],
    "features": []                 // "Generator","Solar","Bunkhouse","Outdoor Kitchen"
  },
  "confidence": 0.0,
  "interpretation": ""
}
General Rules
Include only relevant sections. If the query is about boats, include "boat" and generic "filters"; omit unrelated sections.
Empty arrays, zeros, empty strings, or nulls for unmentioned fields.
Support combos (e.g., “boat with trailer + truck to tow it” → category might be ["boat","vehicle"] with both sections).
Normalize numbers & units:
“$40k”, “under 40 grand” → 40000
“36k miles” → 36000
“20–24 ft” → [20,24] feet
“1.5 acres” → 65340 sqft (43,560 sqft/acre)
“600 hp total (twin 300s)” → horsepowerMin 600
Colors: map synonyms: charcoal→Gray, graphite→Gray, midnight→Black/Blue (pick most common), navy→Blue, ivory→White, burgundy→Red, champagne→Beige/Gold.
Ranges:
“under $X” → [0, X]; “over $X” → [X, 999999999]
“under 50k miles” → [0, 50000]
“2019+ / newer than 2019” → [2019, currentYear]
“last few years” → [currentYear-3, currentYear]
Intent inference (be generous but sane):
“low miles” → [0, 30000]
“luxury / high-end / fully loaded” → add features ["Leather Seats","Sunroof","Navigation","Heated Seats"] and bias priceRange upper bound upward if also given a minimum.
“family” → vehicle.bodyStyle "SUV" or "Minivan"; home amenities "Fence"/"Garage" if implied.
“performance / sport” → horsepowerMin >= 300 (cars), bikeType: ["Sport"] (moto).
“economy / good mpg” → mpgCombinedMin >= 30.
“off-road / 4x4” → drivetrain includes "4WD" or "AWD"; features add "Tow Package" when truck/SUV implied.
“waterfront home / with dock / boat slip” → home.amenities includes "Waterfront","Boat Slip","Dock"and set boat.waterfrontNeeded=true if both domains are mixed.
“pet friendly” (rentals) → home.petFriendly=true.
“3/2” → bedsRange [3,3], bathsRange [2,2].
Condition cues:
“brand new / 0 miles / factory fresh” → "New"
“certified” → "Certified Pre-Owned"
“clean” → keep "Used" and (weakly) set singleOwner=true only if explicitly “one owner”.
Seller cues: “private party,” “by owner,” “FSBO” → "Private"; “dealer only” → "Dealer"; “agent”/“realtor” → "Agent", “broker” → "Broker".
Location parsing: detect city/state/ZIP & set radiusMiles from phrases:
“near/around/within X miles” → radius
“in [city/state/zip]” → location
Sorting:
“cheapest / lowest price” → "price_low"
“newest / latest” → "newest"
“closest” → "nearest"
“best deal / value” → "best_match"
Examples
1) “white BMW 3 series under 40k, low miles, in Nashville within 50 miles, 2019 or newer”
{
  "category": ["vehicle"],
  "filters": {
    "location": "Nashville, TN",
    "radiusMiles": 50,
    "priceRange": [0, 40000],
    "sellerType": [],
    "hideWithoutPhotos": false,
    "keywordInclude": [],
    "keywordExclude": [],
    "sortBy": "best_match"
  },
  "vehicle": {
    "make": ["BMW"],
    "model": "3 Series",
    "trim": "",
    "yearRange": [2019, 0],
    "bodyStyle": "",
    "condition": "",
    "mileageRange": [0, 30000],
    "fuelType": [],
    "transmission": [],
    "drivetrain": [],
    "exteriorColor": ["White"],
    "interiorColor": [],
    "features": [],
    "horsepowerMin": 0,
    "mpgCityMin": 0,
    "mpgHighwayMin": 0,
    "mpgCombinedMin": 0,
    "doors": 0,
    "towingCapacityMin": 0
  },
  "confidence": 0.94,
  "interpretation": "Late-model white BMW 3 Series, low miles, max $40k near Nashville (50 mi)."
}
2) “3 bed 2 bath house with pool and garage in Scottsdale under $750k, HOA under $300”
{
  "category": ["home"],
  "filters": {
    "location": "Scottsdale, AZ",
    "radiusMiles": 0,
    "priceRange": [0, 750000],
    "sellerType": ["Agent"],
    "hideWithoutPhotos": false,
    "keywordInclude": [],
    "keywordExclude": [],
    "sortBy": "newest"
  },
  "home": {
    "for": "sale",
    "homeType": ["House"],
    "bedsRange": [3,3],
    "bathsRange": [2,2],
    "sqftRange": [0,0],
    "lotSizeRange": [0,0],
    "yearBuiltRange": [0,0],
    "hoaFeeMax": 300,
    "petFriendly": null,
    "furnished": null,
    "parking": ["Garage"],
    "amenities": ["Pool"],
    "newConstruction": null
  },
  "confidence": 0.93,
  "interpretation": "Single-family home for sale in Scottsdale, 3/2 with pool & garage, HOA ≤ $300, under $750k."
}
3) “center console boat 22–26 ft, twin outboards, low hours, with trailer, under 85k near Tampa”
{
  "category": ["boat"],
  "filters": {
    "location": "Tampa, FL",
    "radiusMiles": 0,
    "priceRange": [0, 85000],
    "sellerType": [],
    "hideWithoutPhotos": false,
    "keywordInclude": [],
    "keywordExclude": [],
    "sortBy": "best_match"
  },
  "boat": {
    "boatType": ["Center Console"],
    "lengthRangeFt": [22,26],
    "yearRange": [0,0],
    "engineType": ["Outboard"],
    "engineCount": 2,
    "horsepowerMin": 0,
    "hoursRange": [0, 500],
    "hullMaterial": [],
    "features": ["Trailer Included","T-Top","GPS"],
    "waterfrontNeeded": null,
    "slipIncluded": null
  },
  "confidence": 0.92,
  "interpretation": "Center console, 22–26 ft, twin outboards, low hours, trailer, max $85k around Tampa."
}
4) “adventure bike under 10k with ABS, under 15k miles near Denver”
{
  "category": ["motorcycle"],
  "filters": {
    "location": "Denver, CO",
    "radiusMiles": 0,
    "priceRange": [0, 10000],
    "sellerType": [],
    "hideWithoutPhotos": false,
    "keywordInclude": [],
    "keywordExclude": [],
    "sortBy": "price_low"
  },
  "motorcycle": {
    "bikeType": ["Adventure"],
    "make": [],
    "model": "",
    "yearRange": [0,0],
    "mileageRange": [0,15000],
    "displacementCCRange": [0,0],
    "transmission": ["Manual"],
    "abs": true,
    "features": []
  },
  "confidence": 0.91,
  "interpretation": "Adventure motorcycle with ABS, <15k miles, under $10k near Denver."
}
5) “Class C RV with slide-outs, sleeps 6, generator, low miles, 2018+ under $70k”
{
  "category": ["rv"],
  "filters": {
    "location": "",
    "radiusMiles": 0,
    "priceRange": [0, 70000],
    "sellerType": [],
    "hideWithoutPhotos": false,
    "keywordInclude": [],
    "keywordExclude": [],
    "sortBy": "best_match"
  },
  "rv": {
    "rvType": ["Class C"],
    "yearRange": [2018, 0],
    "lengthRangeFt": [0,0],
    "sleepCapacityMin": 6,
    "slidesMin": 1,
    "mileageRange": [0,30000],
    "features": ["Generator"]
  },
  "confidence": 0.9,
  "interpretation": "Late-model Class C with slides, sleeps 6, generator, low miles, ≤ $70k."
}`,
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
