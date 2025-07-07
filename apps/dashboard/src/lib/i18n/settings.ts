export const fallbackLng = "en"
export const languages = [fallbackLng, "fr", "it"]
export const defaultNS = "common"
export const cookieName = "i18next-dashboard" // Use a different cookie name

export function getOptions(
  lng = fallbackLng,
  ns: string | string[] = defaultNS
) {
  return {
    // Set to true to see console logs
    debug: process.env.NODE_ENV === "development",
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
    // Required for i18next-resources-to-backend to work properly
    partialBundledLanguages: true,
    // Make init synchronous, important for client-side provider
    initImmediate: false,
  }
}
