import { getInitialResources } from "@/lib/i18n/getInitialResources"
import { I18nProvider } from "@/lib/i18n/I18nProvider"
import { languages } from "@/lib/i18n/settings" // Import supported languages

import { RateLimitToastWrapper } from "./RateLimitToastWrapper"

interface LngLayoutProps {
  children: React.ReactNode
  params: {
    lng: string
  }
}

// Define namespaces needed by this layout and its children
// Start with common, add others as needed (like 'wizard' if components here use it directly)
const layoutNamespaces = [
  "common",
  "wizard_common",
  "wizard_header",
  "wizard_seller_information",
  "wizard_property_information",
  "wizard_review_recommendations",
  "wizard_provisional_offer",
  "wizard_completion_status",
  "wizard_address_lookup",
  "wizard_contemplation",
  "profile",
  "auth_warm_welcome",
  "auth_signin_signup",
  "user_menu",
  "ui_guidebot",
  "seller_messages",
  "family_communication",
  "pre-production", // Added for PreProductionBanner component
] // Added wizard_contemplation

// Generate static params for supported languages
export function generateStaticParams() {
  return languages.map((lng) => ({ lng }))
}

export default async function LngLayout({
  children,
  params: { lng },
}: LngLayoutProps) {
  // Load resources on the server for the current language and required namespaces
  const initialResources = await getInitialResources(lng, layoutNamespaces)

  return (
    // Pass language and resources to the client-side provider
    <I18nProvider
      initialResources={initialResources}
      lng={lng}
      namespaces={layoutNamespaces}
    >
      <RateLimitToastWrapper>
        {/* Children will be the page.tsx or nested layout.tsx */}
        {children}
      </RateLimitToastWrapper>
    </I18nProvider>
  )
}
