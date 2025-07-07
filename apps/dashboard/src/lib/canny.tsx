/* eslint-disable */
"use client"

import { useEffect, useState } from "react"

import { Spinner } from "@package/ui/spinner"
import { cn } from "@package/utils"
import { useTheme } from "next-themes"

// Type declarations for Canny SDK
declare global {
  interface Window {
    Canny: any
    attachEvent?: (event: string, callback: () => void) => void
  }
}

// Canny function declaration
declare const Canny: any

export function CannyFeedback({ ssoToken }: { ssoToken: string }) {
  const { resolvedTheme } = useTheme()
  const [loadingCanny, setLoadingCanny] = useState(true)

  useEffect(() => {
    setLoadingCanny(true)
    ;(function (w, d, i, s) {
      function l() {
        if (!d.getElementById(i)) {
          const f = d.getElementsByTagName(s)[0] as HTMLElement,
            e = d.createElement(s) as HTMLScriptElement
          ;(e.type = "text/javascript"),
            (e.async = true),
            (e.src = "https://canny.io/sdk.js"),
            f.parentNode?.insertBefore(e, f)
        }
      }
      if ("function" != typeof w.Canny) {
        const c = function () {
          ;(c as any).q.push(arguments)
        }
        ;((c as any).q = []),
          (w.Canny = c),
          "complete" === d.readyState
            ? l()
            : w.attachEvent
              ? w.attachEvent("onload", l)
              : w.addEventListener("load", l, false)
      }
    })(window, document, "canny-jssdk", "script")

    if (resolvedTheme !== "system") {
      Canny("render", {
        boardToken: process.env.NEXT_PUBLIC_CANNY_BOARD_TOKEN,
        theme: resolvedTheme === "dark" ? "dark" : "light", // options: light [default], dark, auto
        onLoadCallback: () => setLoadingCanny(false),
        ssoToken,
      })
    }
  }, [resolvedTheme, ssoToken])

  return (
    <>
      {loadingCanny && <Spinner className="mx-auto size-14" />}
      <div
        key={resolvedTheme}
        data-canny
        className={cn({ hidden: loadingCanny })}
      />
    </>
  )
}
