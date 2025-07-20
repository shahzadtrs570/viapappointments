/* eslint-disable */
"use client"

import { useState, useEffect } from "react"
import { WheelPopup, type WheelSegment } from "@package/ui/wheel-popup"

const wheelSegments: WheelSegment[] = [
  { id: "1", label: "$500 OFF", color: "#f2ebcd", probability: 2 },
  { id: "2", label: "Almost", color: "#57413a", probability: 3 },
  { id: "3", label: "$2500 OFF", color: "#9ccdc3", probability: 2 },
  { id: "4", label: "No luck today", color: "#fc8289", probability: 3 },
  { id: "5", label: "$25,000 CASH", color: "#f2ebcd", probability: 1 },
  { id: "6", label: "Next time", color: "#57413a", probability: 3 },
  { id: "7", label: "$777 OFF", color: "#9ccdc3", probability: 2 },
  { id: "8", label: "Nope", color: "#fc8289", probability: 3 },
  { id: "9", label: "APPLE EARPODS", color: "#f2ebcd", probability: 2 },
  { id: "10", label: "Sorry!", color: "#57413a", probability: 3 },
  { id: "11", label: "$4K MORE FOR TRADE", color: "#9ccdc3", probability: 2 },
  { id: "12", label: "Nothing", color: "#fc8289", probability: 3 },
]

export function WheelPopupWrapper() {
  const [showPopup, setShowPopup] = useState(false)
  const [hasShownPopup, setHasShownPopup] = useState(false)

  useEffect(() => {
    console.log("WheelPopupWrapper mounted")

    // Function to check if user has scrolled below hero section
    const checkScroll = () => {
      const scrollPosition = window.scrollY
      const triggerPoint = window.innerHeight * 0.5 // Reduced from 0.8 to 0.5 for easier testing

      console.log("Scroll check:", {
        scrollPosition,
        triggerPoint,
        hasShownPopup,
      })

      if (scrollPosition > triggerPoint && !hasShownPopup) {
        console.log("Triggering popup!")
        setShowPopup(true)
        setHasShownPopup(true)
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", checkScroll)

    // Also check on mount in case user refreshes page while scrolled
    checkScroll()

    // For testing - show popup after 2 seconds regardless of scroll
    const testTimer = setTimeout(() => {
      if (!hasShownPopup) {
        console.log("Test timer triggered popup")
        setShowPopup(true)
        setHasShownPopup(true)
      }
    }, 2000)

    // Cleanup
    return () => {
      window.removeEventListener("scroll", checkScroll)
      clearTimeout(testTimer)
    }
  }, [hasShownPopup])

  const handleSpin = (segment: WheelSegment) => {
    console.log("Won:", segment.label)
    // Handle spin result here
  }

  const handleSubmit = (data: {
    name: string
    email: string
    phone: string
    marketing: boolean
  }) => {
    console.log("Form submitted:", data)
    // Handle form submission here - could save to database, send email, etc.
  }

  console.log("WheelPopupWrapper render:", { showPopup, hasShownPopup })

  return (
    <WheelPopup
      open={showPopup}
      onOpenChange={setShowPopup}
      segments={wheelSegments}
      onSpin={handleSpin}
      onSubmit={handleSubmit}
      title="Our store's special bonus unlocked!"
      description="You have a chance to win up to $25,000 cash, a nice big fat discount or one of our other great prizes. Are you feeling lucky? Give it a spin."
      ctaText="TRY YOUR LUCK"
      spinButtonText="SPIN"
      logo="/logo-light.png"
      formFields={{
        nameLabel: "Your full name",
        emailLabel: "Your email address",
        phoneLabel: "Your phone number",
        marketingLabel:
          "I wish to have my prize voucher along with any discounts and marketing offers sent to my email address or via SMS or phone.",
      }}
    />
  )
}
