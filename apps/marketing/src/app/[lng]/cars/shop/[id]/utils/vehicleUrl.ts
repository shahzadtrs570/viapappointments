/* eslint-disable */
/**
 * Get the original vehicle listing URL from the car data
 * Checks both sourceUrl (from database) and rawData.url (from scraping)
 */
export function getVehicleUrl(car: any): string | null {
  if (car.sourceUrl) return car.sourceUrl
  if (car.rawData && typeof car.rawData === "object" && "url" in car.rawData) {
    return car.rawData.url
  }
  return null
}

/**
 * Open vehicle listing in new tab
 */
export function openVehicleListing(car: any): void {
  const url = getVehicleUrl(car)
  if (url) {
    window.open(url, "_blank", "noopener,noreferrer")
  } else {
    alert(
      "Vehicle listing URL not available. Please contact the dealer directly."
    )
  }
}
