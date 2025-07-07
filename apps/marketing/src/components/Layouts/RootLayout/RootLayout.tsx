import { CrispChat } from "@package/crisp"
import { archivoBlack, sarabun } from "@package/fonts"
import { featureFlags } from "@package/utils"
import Script from "next/script"

import { Providers } from "@/app/providers"
import { LandingLayout } from "@/components/Layouts/LandingLayout/LandingLayout"

import "@/app/globals.css"

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <link href="./logo.svg" rel="icon" sizes="any" /> */}
      {process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID &&
        featureFlags.chatSupportWidget && <CrispChat />}

      <Providers>
        <div className={`${sarabun.className} ${archivoBlack.variable}`}>
          <LandingLayout>{children}</LandingLayout>
        </div>
      </Providers>

      {/* <!-- Pixel Code for tinybird analytics --> */}
      {process.env.NEXT_PUBLIC_APP_ENV === "production" && (
        <Script
          defer
          data-host={process.env.NEXT_PUBLIC_TINYBIRD_DATA_HOST}
          src={process.env.NEXT_PUBLIC_TINYBIRD_SRC}
          data-token={
            process.env.NEXT_PUBLIC_TINYBIRD_ANALYTICS_MARKETING_TRACKER_TOKEN
          }
        />
      )}
    </>
  )
}
