/*eslint-disable*/

// Helper functions for age validation
export const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0

  const today = new Date()
  const dob = new Date(birthDate)
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }

  return age
}

export const isOver55 = (birthDate: string): boolean => {
  return calculateAge(birthDate) >= 55
}

export const isUnder75 = (birthDate: string): boolean => {
  return calculateAge(birthDate) < 75
}

// Add this helper function before the SellerInformation component
export const splitUserName = (
  name: string | null | undefined
): { firstName: string; lastName: string } => {
  if (!name) return { firstName: "", lastName: "" }

  const nameParts = name.trim().split(/\s+/)
  if (nameParts.length === 1) return { firstName: nameParts[0], lastName: "" }

  const firstName = nameParts[0]
  const lastName = nameParts.slice(1).join(" ")
  return { firstName, lastName }
}

// Add a constant for the localStorage key
export const STORED_OWNERS_KEY = "estate_flex_stored_owners"

// Add a new constant for the number of owners
export const MULTIPLE_OWNERS_COUNT_KEY =
  "multiple_no_of_estate_flex_stored_owners"

export const setStoredOwnersCount = (count: number) => {
  localStorage.setItem(MULTIPLE_OWNERS_COUNT_KEY, count.toString())
}
