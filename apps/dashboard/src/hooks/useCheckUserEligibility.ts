/*eslint-disable  @typescript-eslint/no-explicit-any*/
/*eslint-disable  @typescript-eslint/no-unused-vars*/
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { useEffect, useState } from "react"

import { useSession } from "next-auth/react"

import { api } from "@/lib/trpc/react"

// Type for localStorage data (client-side format)
interface ClientEligibilityData {
  isEligible: boolean
  age?: string | null
  "property-ownership"?: string | null
  "joint-ownership"?: string | null
  "spouse-age"?: string | null
  "children-heirs"?: string | null
  "inheritance-importance"?: string | null
  "confident-understanding"?: string | null
  "discuss-options"?: string | null
  country?: string | null
  ownership?: string | null
  propertyType?: string | null
  mainResidence?: string | null
  financialGoals?: string[]
}

// Type for database data (camelCase format)
interface DbEligibilityData {
  id: string
  userId: string
  isEligible: boolean | null
  age: string | null
  propertyOwnership: string | null
  jointOwnership: string | null
  spouseAge: string | null
  childrenHeirs: string | null
  inheritanceImportance: string | null
  confidentUnderstanding: string | null
  discussOptions: string | null
  country: string | null
  ownership: string | null
  propertyType: string | null
  mainResidence: string | null
  financialGoals: string[]
  createdAt: Date
  updatedAt: Date
}

// Field mapping from client to database format
const clientToDbFieldMap: Record<
  keyof ClientEligibilityData,
  keyof DbEligibilityData
> = {
  isEligible: "isEligible",
  age: "age",
  "property-ownership": "propertyOwnership",
  "joint-ownership": "jointOwnership",
  "spouse-age": "spouseAge",
  "children-heirs": "childrenHeirs",
  "inheritance-importance": "inheritanceImportance",
  "confident-understanding": "confidentUnderstanding",
  "discuss-options": "discussOptions",
  country: "country",
  ownership: "ownership",
  propertyType: "propertyType",
  mainResidence: "mainResidence",
  financialGoals: "financialGoals",
}

// Field mapping from database to client format
const dbToClientFieldMap: Record<
  keyof DbEligibilityData,
  keyof ClientEligibilityData
> = {
  isEligible: "isEligible",
  age: "age",
  propertyOwnership: "property-ownership",
  jointOwnership: "joint-ownership",
  spouseAge: "spouse-age",
  childrenHeirs: "children-heirs",
  inheritanceImportance: "inheritance-importance",
  confidentUnderstanding: "confident-understanding",
  discussOptions: "discuss-options",
  country: "country",
  ownership: "ownership",
  propertyType: "propertyType",
  mainResidence: "mainResidence",
  financialGoals: "financialGoals",
  id: "id" as any,
  userId: "userId" as any,
  createdAt: "createdAt" as any,
  updatedAt: "updatedAt" as any,
}

interface UseCheckUserEligibilityProps {
  redirectToEligibility?: boolean
  lng?: string
}

/**
 * Hook to check if user has eligibility data and sync between localStorage and database
 *
 * @param redirectToEligibility Whether to automatically redirect to eligibility page if data isn't found
 * @param lng Current language for localized redirects
 * @returns Object containing eligibility status and data
 */
export function useCheckUserEligibility({
  redirectToEligibility = true,
}: UseCheckUserEligibilityProps = {}) {
  const [isEligible, setIsEligible] = useState<boolean>(false)
  const [eligibilityData, setEligibilityData] =
    useState<ClientEligibilityData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { data: session, status } = useSession()

  // Get eligibility data from API
  const { data: dbEligibilityData, isLoading: isDbLoading } =
    api.property.eligibility.getEligibility.useQuery<ClientEligibilityData>(
      undefined,
      {
        enabled: !!session?.user,
        refetchOnWindowFocus: false,
        retry: 1,
      }
    )

  // Save eligibility data to database
  const saveEligibilityMutation =
    api.property.eligibility.saveEligibility.useMutation()

  const redirectToEligibilityCheck = (errorMessage: string): void => {
    const marketingUrl: string = process.env.NEXT_PUBLIC_MARKETING_URL || ""
    const encodedError: string = encodeURIComponent(errorMessage)
    window.location.href = `${marketingUrl}/eligibility?error=${encodedError}`
  }

  // Convert database data to client format
  const convertDbToClientData = (
    dbData: DbEligibilityData
  ): ClientEligibilityData => {
    const clientData: Partial<ClientEligibilityData> = {}
    Object.entries(dbData).forEach(([key, value]) => {
      const clientKey = dbToClientFieldMap[key as keyof DbEligibilityData]
      if (
        clientKey &&
        !["id", "userId", "createdAt", "updatedAt"].includes(key)
      ) {
        clientData[clientKey] = value as any
      }
    })
    return {
      ...clientData,
      isEligible: dbData.isEligible ?? false,
    } as ClientEligibilityData
  }

  // Convert client data to database format
  const convertClientToDbData = (
    clientData: ClientEligibilityData
  ): Partial<DbEligibilityData> => {
    const dbData: Partial<DbEligibilityData> = {}
    Object.entries(clientData).forEach(([key, value]) => {
      const dbKey = clientToDbFieldMap[key as keyof ClientEligibilityData]
      if (dbKey) {
        dbData[dbKey] = value as any
      }
    })
    return dbData
  }

  useEffect(() => {
    const syncEligibilityData = async () => {
      setIsLoading(true)

      try {
        let localEligibilityData: ClientEligibilityData | null = null
        let shouldSaveToDb = false

        // Check localStorage first
        if (typeof window !== "undefined") {
          try {
            const storedEligibility = localStorage.getItem("eligibility")
            if (storedEligibility) {
              localEligibilityData = JSON.parse(storedEligibility)
            }
          } catch (e) {
            console.error(
              "Error parsing eligibility data from localStorage:",
              e
            )
          }
        }

        // If user is authenticated, handle DB synchronization
        if (status === "authenticated") {
          if (isDbLoading) return

          // If we have data in DB but not in localStorage
          if (dbEligibilityData && !localEligibilityData) {
            localStorage.setItem(
              "eligibility",
              JSON.stringify(dbEligibilityData)
            )
            localEligibilityData = dbEligibilityData
          }
          // If we have data in localStorage but not in DB
          else if (localEligibilityData && !dbEligibilityData) {
            shouldSaveToDb = true
          }
        }

        // If we have data to save to DB
        if (shouldSaveToDb && localEligibilityData && session?.user) {
          const dbData = convertClientToDbData(localEligibilityData)
          await saveEligibilityMutation.mutateAsync(dbData)
        }

        // Only redirect if we have no data in either place and DB query is complete
        if (!localEligibilityData && !dbEligibilityData && !isDbLoading) {
          if (redirectToEligibility) {
            await redirectToEligibilityCheck(
              "Please complete the eligibility check."
            )
          }
          setIsEligible(false)
          setEligibilityData(null)
          return
        }

        // Set the eligibility data (prefer DB data if available)
        const finalEligibilityData = dbEligibilityData || localEligibilityData

        if (finalEligibilityData) {
          setIsEligible(finalEligibilityData.isEligible)
          setEligibilityData(finalEligibilityData)
        }
      } catch (error) {
        console.error("Error syncing eligibility data:", error)
        if (redirectToEligibility) {
          await redirectToEligibilityCheck(
            "Error processing eligibility data. Please try again."
          )
        }
        setIsEligible(false)
        setEligibilityData(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (status !== "loading") {
      void syncEligibilityData()
    }
  }, [
    dbEligibilityData,
    isDbLoading,
    status,
    redirectToEligibility,
    session?.user,
  ])

  return {
    isEligible,
    eligibilityData,
    isLoading: isLoading || isDbLoading || status === "loading",
  }
}
