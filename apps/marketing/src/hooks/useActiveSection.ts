"use client"

import { useEffect, useState } from "react"

import { usePathname } from "next/navigation"

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>("")
  const pathname = usePathname()

  useEffect(() => {
    // Reset active section when on eligibility page
    if (pathname.endsWith("/eligibility")) {
      setActiveSection("")
      return
    }

    const sections = [
      { id: "about", selector: "#about" },
      { id: "calculator", selector: "#calculator" },
      { id: "how-it-works", selector: "#how-it-works" },
      { id: "benefits", selector: "#benefits" },
      { id: "faq", selector: "#faq" },
    ]

    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id
          setActiveSection(id)
        }
      })
    }, observerOptions)

    sections.forEach((section) => {
      const element = document.querySelector(section.selector)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      sections.forEach((section) => {
        const element = document.querySelector(section.selector)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [pathname])

  return activeSection
}
