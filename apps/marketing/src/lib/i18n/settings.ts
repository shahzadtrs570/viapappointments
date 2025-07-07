export const fallbackLng = "en"
export const languages = [fallbackLng, "fr", "it"]
export const defaultNS = "common"
export const cookieName = "i18next"

export function getOptions(lng?: string, ns: string | string[] = defaultNS) {
  return {
    debug: process.env.NODE_ENV === "development" ? false : false, // Disable debug mode to reduce console noise
    supportedLngs: languages,
    fallbackLng,
    lng, // This will be undefined when called without parameters
    fallbackNS: defaultNS,
    defaultNS,
    ns,
    initImmediate: false, // This can help with SSR hydration issues
  }
}
