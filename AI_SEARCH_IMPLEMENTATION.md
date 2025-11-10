# AI-Powered Search Implementation

## Overview
This system converts natural language queries into structured filters for vehicle search.

## How It Works

### 1. User Input (Hero Component)
User enters query like: **"Find a luxury SUV under $50K with low miles"**

### 2. AI Processing (`/api/ai-search`)
The query is sent to OpenAI which extracts:
```json
{
  "filters": {
    "bodyStyle": "SUV",
    "priceRange": [0, 50000],
    "mileageRange": [0, 30000],
    "features": ["Leather Seats", "Premium Sound"],
    "carType": "used"
  },
  "confidence": 0.95,
  "interpretation": "Looking for a used luxury SUV under $50,000 with low mileage"
}
```

### 3. Pass to Backend
The filters are sent to your search results page via URL params:
```
/search?q=luxury%20SUV%20under%2050k&filters={...}&ai=true
```

### 4. Search Results Page
Parse the filters and use them in your tRPC query or API call.

## Setup Instructions

### 1. Add Environment Variable
```env
# .env.local
OPENAI_API_KEY=sk-your-api-key-here
```

### 2. Install Dependencies (if needed)
```bash
pnpm add openai  # Optional, using fetch API instead
```

### 3. Backend Integration

In your search results page (`apps/marketing/src/app/[lng]/search/page.tsx`):

```typescript
"use client"

import { useSearchParams } from "next/navigation"
import { VehicleFilters, defaultFilters } from "@/types/filters"

export default function SearchPage() {
  const searchParams = useSearchParams()
  
  // Get filters from URL
  const filtersParam = searchParams.get("filters")
  const query = searchParams.get("q")
  const isAISearch = searchParams.get("ai") === "true"
  
  // Parse filters
  const filters: VehicleFilters = filtersParam
    ? { ...defaultFilters, ...JSON.parse(filtersParam) }
    : defaultFilters

  // Use filters in your tRPC query or API call
  const { data: vehicles } = trpc.vehicle.search.useQuery({
    filters,
    query,
  })

  return (
    <div>
      {isAISearch && (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-blue-900">
            🤖 AI Search: {query}
          </p>
        </div>
      )}
      
      {/* Show active filters */}
      <ActiveFilters
        filters={filters}
        onFilterChange={(newFilters) => {
          // Update URL with new filters
        }}
        onClearAll={() => {
          // Clear all filters
        }}
      />

      {/* Results grid */}
      {vehicles?.map(vehicle => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  )
}
```

### 4. Backend Query (tRPC example)

In your tRPC router:

```typescript
// packages/api/src/router/vehicle.ts
export const vehicleRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        filters: z.object({
          make: z.array(z.string()).optional(),
          model: z.string().optional(),
          priceRange: z.tuple([z.number(), z.number()]).optional(),
          yearRange: z.tuple([z.number(), z.number()]).optional(),
          bodyStyle: z.string().optional(),
          fuelType: z.array(z.string()).optional(),
          mileageRange: z.tuple([z.number(), z.number()]).optional(),
          // ... other filters
        }),
        query: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { filters, query } = input

      // Build Prisma where clause
      const where: any = {
        isActive: true,
      }

      // Apply filters
      if (filters.make && filters.make.length > 0) {
        where.make = { in: filters.make }
      }

      if (filters.model) {
        where.model = { contains: filters.model, mode: 'insensitive' }
      }

      if (filters.priceRange) {
        where.priceAmount = {
          gte: filters.priceRange[0],
          lte: filters.priceRange[1],
        }
      }

      if (filters.yearRange) {
        where.year = {
          gte: filters.yearRange[0],
          lte: filters.yearRange[1],
        }
      }

      if (filters.mileageRange) {
        where.mileage = {
          gte: filters.mileageRange[0],
          lte: filters.mileageRange[1],
        }
      }

      if (filters.bodyStyle) {
        where.bodyStyle = filters.bodyStyle
      }

      if (filters.fuelType && filters.fuelType.length > 0) {
        where.fuelType = { in: filters.fuelType }
      }

      // Fetch vehicles
      const vehicles = await ctx.db.vehicle.findMany({
        where,
        take: 50,
        orderBy: {
          createdAt: 'desc',
        },
      })

      return vehicles
    }),
})
```

## Example Queries & Expected Filters

| Query | Extracted Filters |
|-------|------------------|
| "Tesla under $60k" | `make: ["Tesla"]`, `priceRange: [0, 60000]` |
| "2020 Honda Accord" | `make: ["Honda"]`, `model: "Accord"`, `yearRange: [2020, 2020]` |
| "Electric SUV" | `bodyStyle: "SUV"`, `fuelType: ["Electric"]` |
| "Luxury sedan with leather" | `bodyStyle: "Sedan"`, `features: ["Leather Seats"]`, `priceRange: [40000, 999999]` |
| "Truck with low miles" | `bodyStyle: "Truck"`, `mileageRange: [0, 30000]` |

## Fallback Mode

If OpenAI API is not configured, the system uses `parseSearchQuerySimple()` which does basic keyword matching:
- Extracts price from "under $X" or "below $X"
- Detects makes by matching against known list
- Identifies body styles (SUV, Sedan, Truck, etc.)
- Recognizes fuel types (Electric, Hybrid)

## Testing

Test with these queries:
```
✅ "Find a boat under $30K near Miami"
✅ "Luxury SUV with low miles"
✅ "Electric cars under $50K"
✅ "2023 Toyota Camry with navigation"
✅ "Red convertible under 20k miles"
✅ "Diesel truck for towing"
```

## Cost Estimation

Using GPT-4-turbo:
- ~$0.01 per search query
- 100 searches = $1.00
- 1000 searches = $10.00

Consider caching common queries or using GPT-3.5-turbo for lower costs.

## Next Steps

1. ✅ Add OpenAI API key to `.env.local`
2. ✅ Update search results page to receive filters
3. ✅ Connect filters to backend query
4. 🔄 Test with real data
5. 🔄 Add voice search with Web Speech API
6. 🔄 Cache common queries in Redis
7. 🔄 Add search analytics

## Voice Search (Future Enhancement)

```typescript
// Add to Hero component
const startVoiceSearch = () => {
  const recognition = new (window as any).webkitSpeechRecognition()
  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript
    setSearchQuery(transcript)
    handleAISearch()
  }
  recognition.start()
}
```

