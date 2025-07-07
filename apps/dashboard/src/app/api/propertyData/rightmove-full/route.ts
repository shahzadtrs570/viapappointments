/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-depth */
/* eslint-disable max-lines */
import { NextResponse } from "next/server"

// TODO: Move to .envs
const RIGHTMOVE_API_URL = process.env.RIGHTMOVE_API_URL || ""
const RIGHTMOVE_TOKEN_URL = process.env.RIGHTMOVE_TOKEN_URL || ""

// Conservative GraphQL query based on validated fields
const WORKING_PROPERTY_QUERY = `
  query WorkingPropertyData(
    $propertyAddress: PropertyAddressInput!
    $userReference: String!
    $propertyAttributes: PropertyAttributesInput
    $useModelledAttributes: Boolean
  ) {
    property(address: $propertyAddress) {
      # Basic property attributes (known to work)
      attributes(modelled: $useModelledAttributes) {
        type
        style
        tenure
        yearBuilt
        beds
        livingRooms
        bathrooms
        floorArea
        condition
        centralHeating
        parking
        conservatories
        cloakrooms
      }
      
      # Sales valuation data
      salesValuation(
        userReference: $userReference
        attributes: $propertyAttributes
        useModelledAttributes: $useModelledAttributes
      ) {
        valuationResponse {
          combinedModel {
            combinedModelValuation
            combinedModelFsd
            combinedModelConfidence
          }
          compsModel {
            compsModelValuation
            compsModelConfidence
          }
          indexModel {
            indexModelValuation
            indexModelConfidence
          }
        }
      }
      
      # Property history and logbook
      logbook {
        latestEvent {
          listingSales {
            price
            status
            type
            style
            beds
            media {
              photoCount
            }
          }
        }
      }
    }
  }
`

// Extended query to try additional fields that might exist
const EXTENDED_PROPERTY_QUERY = `
  query ExtendedPropertyData(
    $propertyAddress: PropertyAddressInput!
    $userReference: String!
    $propertyAttributes: PropertyAttributesInput
    $useModelledAttributes: Boolean
  ) {
    property(address: $propertyAddress) {
      # Try extended attributes
      attributes(modelled: $useModelledAttributes) {
        type
        style
        tenure
        yearBuilt
        beds
        livingRooms
        bathrooms
        floorArea
        condition
        centralHeating
        parking
        conservatories
        cloakrooms
        garages
        gardens
        outbuildings
        extensions
        loft
        basement
        doubleGlazing
        furnished
        modelledBathrooms
        modelledBeds
        modelledCurrentEnergyEfficiency
        modelledCurrentEnergyRating
        modelledFloorArea
        modelledStyle
        modelledType
        modelledYearBuilt
        leasehold {
         term
         endYear
         remainingYears
        }
      }
      
      # Sales valuation
      salesValuation(
        userReference: $userReference
        attributes: $propertyAttributes
        useModelledAttributes: $useModelledAttributes
      ) {
        valuationResponse {
          combinedModel {
            combinedModelValuation
            combinedModelFsd
            combinedModelConfidence
          }
          compsModel {
            compsModelValuation
            compsModelConfidence
          }
          indexModel {
            indexModelValuation
            indexModelConfidence
          }
        }
      }
      
      # Try rental valuation
      rentalValuation(
        userReference: $userReference
        attributes: $propertyAttributes
        useModelledAttributes: $useModelledAttributes
      ) {
        valuationResponse {
          combinedModel {
            combinedModelValuation
            combinedModelFsd
            combinedModelConfidence
          }
        }
      }
      
      # Property history
      logbook {
        latestEvent {
          listingSales {
            price
            status
            type
            style
            beds
            media {
              photoCount
            }
          }
        }
        events {
          date
          eventType
          listingSales {
            price
            status
            type
            style
            beds
            media {
              photoCount
            }
          }
        }
      }
    }
  }
`

// Remove the area properties query as it's likely not supported
// Additional queries to try for different data types
const SCHOOL_QUERY = `
  query SchoolData($postcode: String!) {
    schools(postcode: $postcode) {
      primary {
        name
        distance
        rating
      }
      secondary {
        name
        distance
        rating
      }
    }
  }
`

const TRANSPORT_QUERY = `
  query TransportData($postcode: String!) {
    transport(postcode: $postcode) {
      stations {
        name
        distance
        lines
      }
    }
  }
`

// Define interfaces for the response data
interface AdditionalData {
  schools?: {
    primary?: Array<{ name: string; distance: number; rating: string }>
    secondary?: Array<{ name: string; distance: number; rating: string }>
  }
  transport?: {
    stations?: Array<{ name: string; distance: number; lines: string[] }>
  }
}

interface PropertyAddress {
  houseIdentifier?: string
  postcode?: string
  uprn?: string
}

async function getToken() {
  try {
    const response = await fetch(RIGHTMOVE_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.RIGHTMOVE_CLIENT_ID || "",
        client_secret: process.env.RIGHTMOVE_CLIENT_SECRET || "",
        grant_type: "client_credentials",
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Token request failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      })
      throw new Error(
        `Token request failed: ${response.status} ${response.statusText}`
      )
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Error getting token:", error)
    throw error
  }
}

async function makeGraphQLRequest(
  token: string,
  query: string,
  variables: Record<string, unknown>
) {
  const response = await fetch(RIGHTMOVE_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("GraphQL request failed:", {
      status: response.status,
      statusText: response.statusText,
      error: errorText,
    })
    throw new Error(
      `GraphQL request failed: ${response.status} ${response.statusText}`
    )
  }

  return await response.json()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { useExtended = false } = body
    // Use provided address or default test address
    let propertyAddress: PropertyAddress = {
      houseIdentifier: body.houseIdentifier,
      postcode: body.postcode,
    }

    if (body.uprn) {
      propertyAddress = {
        uprn: body.uprn,
      }
    }

    // Get token
    const token = await getToken()

    // Prepare the variables for the property query
    const propertyVariables = {
      propertyAddress: propertyAddress,
      userReference: "estate-flex-reference",
      useModelledAttributes: true,
    }

    let propertyData
    let queryUsed = "working"

    try {
      // First try the working query
      propertyData = await makeGraphQLRequest(
        token,
        WORKING_PROPERTY_QUERY,
        propertyVariables
      )

      // If useExtended is true and working query succeeded, try extended query
      if (useExtended && propertyData.data?.property) {
        try {
          const extendedData = await makeGraphQLRequest(
            token,
            EXTENDED_PROPERTY_QUERY,
            propertyVariables
          )
          if (extendedData.data?.property) {
            propertyData = extendedData
            queryUsed = "extended"
          }
        } catch (error: unknown) {
          console.error(
            "Extended query failed, using working query results:",
            error instanceof Error ? error.message : "Unknown error"
          )
        }
      }
    } catch (error: unknown) {
      console.error(
        "Property query failed:",
        error instanceof Error ? error.message : "Unknown error"
      )
      throw error
    }

    // Transform the response
    const property = propertyData.data?.property
    const transformedData = {
      // Basic property information
      propertyDetails: {
        type: property?.attributes?.type,
        style: property?.attributes?.style,
        beds: property?.attributes?.beds,
        baths: property?.attributes?.bathrooms,
        livingRooms: property?.attributes?.livingRooms,
        floorArea: property?.attributes?.floorArea,
        yearBuilt: property?.attributes?.yearBuilt,
        tenure: property?.attributes?.tenure,
        condition: property?.attributes?.condition,
      },

      // Extended attributes (if available)
      features: {
        centralHeating: property?.attributes?.centralHeating,
        parking: property?.attributes?.parking,
        conservatories: property?.attributes?.conservatories,
        cloakrooms: property?.attributes?.cloakrooms,
        garages: property?.attributes?.garages,
        gardens: property?.attributes?.gardens,
        outbuildings: property?.attributes?.outbuildings,
        extensions: property?.attributes?.extensions,
        loft: property?.attributes?.loft,
        basement: property?.attributes?.basement,
        doubleGlazing: property?.attributes?.doubleGlazing,
        furnished: property?.attributes?.furnished,
      },

      // Valuation data
      estimatedValue: {
        sales:
          property?.salesValuation?.valuationResponse?.combinedModel
            ?.combinedModelValuation,
        rental:
          property?.rentalValuation?.valuationResponse?.combinedModel
            ?.combinedModelValuation,
        confidence: {
          sales:
            property?.salesValuation?.valuationResponse?.combinedModel
              ?.combinedModelConfidence,
          rental:
            property?.rentalValuation?.valuationResponse?.combinedModel
              ?.combinedModelConfidence,
        },
        standardDeviation: {
          sales:
            property?.salesValuation?.valuationResponse?.combinedModel
              ?.combinedModelFsd,
          rental:
            property?.rentalValuation?.valuationResponse?.combinedModel
              ?.combinedModelFsd,
        },
      },

      // Alternative model valuations
      alternativeModels: {
        comps: {
          valuation:
            property?.salesValuation?.valuationResponse?.compsModel
              ?.compsModelValuation,
          confidence:
            property?.salesValuation?.valuationResponse?.compsModel
              ?.compsModelConfidence,
        },
        index: {
          valuation:
            property?.salesValuation?.valuationResponse?.indexModel
              ?.indexModelValuation,
          confidence:
            property?.salesValuation?.valuationResponse?.indexModel
              ?.indexModelConfidence,
        },
      },

      // Property history
      propertyHistory: {
        latestEvent: property?.logbook?.latestEvent,
        allEvents: property?.logbook?.events || [],
      },

      // Metadata
      metadata: {
        timestamp: new Date().toISOString(),
        userReference: propertyVariables.userReference,
        dataSource: "Rightmove API",
        queryType: queryUsed,
        requestedAddress: propertyAddress,
      },
    }

    return NextResponse.json(transformedData)
  } catch (error: unknown) {
    console.error(
      "Error in property data request:",
      error instanceof Error ? error.message : "Unknown error"
    )
    return NextResponse.json(
      {
        error: "Failed to fetch property data",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const houseIdentifier = searchParams.get("house")
  const postcode = searchParams.get("postcode")
  const useExtended = searchParams.get("extended") === "true"

  if (!houseIdentifier || !postcode) {
    return NextResponse.json(
      { error: "House identifier and postcode are required" },
      { status: 400 }
    )
  }

  // Create a proper Request object
  const mockRequest = new Request(req.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address: { houseIdentifier, postcode },
      useExtended: useExtended,
    }),
  })

  return POST(mockRequest)
}

// Additional helper function to try different queries incrementally
async function tryAdditionalQueries(
  token: string,
  postcode: string
): Promise<AdditionalData> {
  const additionalData: AdditionalData = {}

  // Try schools query
  try {
    const schoolsData = await makeGraphQLRequest(token, SCHOOL_QUERY, {
      postcode,
    })
    additionalData.schools = schoolsData.data?.schools
  } catch (error: unknown) {
    console.error(
      "Schools query not available:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }

  // Try transport query
  try {
    const transportData = await makeGraphQLRequest(token, TRANSPORT_QUERY, {
      postcode,
    })
    additionalData.transport = transportData.data?.transport
  } catch (error: unknown) {
    console.error(
      "Transport query not available:",
      error instanceof Error ? error.message : "Unknown error"
    )
  }

  return additionalData
}
