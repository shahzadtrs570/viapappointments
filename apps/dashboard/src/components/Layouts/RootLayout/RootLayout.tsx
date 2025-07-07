/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// eslint-disable-next-line import/named
import { cache } from "react"

import { CrispChat } from "@package/crisp"
import { archivoBlack, sarabun } from "@package/fonts"
import { featureFlags } from "@package/utils"
import Script from "next/script"

import "@/app/globals.css"
import { Providers } from "@/app/providers"
import { api } from "@/lib/trpc/server"

import { UserInitializer } from "./UserInitializer"

const getMe = cache(async () => {
  try {
    const initialUser = await api.user.getMe()
    return initialUser
  } catch {
    return null
  }
})

export async function RootLayout({ children }: { children: React.ReactNode }) {
  const initialUser = await getMe()

  return (
    <html
      suppressHydrationWarning
      className={`${sarabun.className} ${archivoBlack.variable}`}
      lang="en"
    >
      {process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID &&
        featureFlags.chatSupportWidget && <CrispChat />}
      {/* <link href="./logo.svg" rel="icon" sizes="any" /> */}
      <body>
        <Providers>
          <UserInitializer initialUser={initialUser} />
          {children}
        </Providers>
      </body>
      {process.env.NEXT_PUBLIC_APP_ENV === "production" && (
        <Script
          defer
          data-host={process.env.NEXT_PUBLIC_TINYBIRD_DATA_HOST}
          src={process.env.NEXT_PUBLIC_TINYBIRD_SRC}
          data-token={
            process.env.NEXT_PUBLIC_TINYBIRD_ANALYTICS_DASHBOARD_TRACKER_TOKEN
          }
        />
      )}
    </html>
  )
}
