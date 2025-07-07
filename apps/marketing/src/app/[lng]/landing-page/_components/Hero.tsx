"use client"

import { useEffect, useState } from "react"
import { Button } from "@package/ui/button"
import { cn } from "@package/utils"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n/client"
import styles from './ScrollingBanner.module.css'

const serviceBoxes = [
  {
    title: "Priority Scheduling",
    subtitle: "Skip the line — literally.",
    description:
      "Your time matters. With VIP scheduling, your appointment is locked in, your vehicle is prepped, and a specialist is ready the moment you arrive.",
  },
  {
    title: "Dedicated Trade Appraisal",
    subtitle: "Your trade-in deserves more than a glance.",
    description:
      "With VIP treatment, our appraisal expert is ready when you arrive — no waiting, no undervaluing. You'll get a fast, fair, market-driven offer while you sip your coffee.",
  },
  {
    title: "On-Demand Test Drive",
    subtitle: "We bring the drive to you.",
    description:
      "Can't make it in? No problem. With our VIP mobile option, we'll deliver the vehicle to your home or office for a no-pressure test drive — on your schedule, on your turf.",
  },
  {
    title: "Vehicle Pulled & Ready",
    subtitle: "No hunting the lot. No waiting.",
    description:
      "Your selected vehicle is detailed, gassed, and parked up front — so you can start your test drive in minutes, not hours.",
  },
  {
    title: "Streamlined Paperwork",
    subtitle: "Because signing shouldn't feel like homework.",
    description:
      "We prep everything in advance. You'll walk in with your offer already structured and leave with keys in hand — fast.",
  },
  {
    title: "Personalized Experience",
    subtitle: "We don't treat you like a lead — we treat you like a guest.",
    description:
      "From a welcome sign with your name to a one-on-one walkthrough, the VIP Appointment feels less like a sale and more like concierge service.",
  },
]

export function Hero() {
  const params = useParams()
  const lng = params.lng as string
  const { t } = useTranslation(lng, "hero")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="flex flex-col">
      <section className="relative min-h-screen w-full overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/brand/Hero.avif"
            alt="Happy family receives car keys from salesman in VIP showroom"
            fill
            className="object-cover brightness-[1.1] contrast-[1.02] h-full"
            style={{
              objectPosition: "50% 25%"
            }}
            priority
            quality={100}
          />
          {/* Gradient overlay for better text visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/65" />
          {/* Additional subtle darkening overlay */}
          <div className="absolute inset-0 bg-black/45" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 mx-auto w-full px-4 pt-16 sm:px-6 lg:px-8">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mx-auto max-w-[1200px] text-center">
              <h2
                className="text-[55px] font-bold leading-[1em] tracking-tight whitespace-nowrap"
                style={{
                  color: "#1D67CD",
                  textShadow:
                    "#c8c8c8 1px 1px 0px, #b4b4b4 0px 2px 0px, #a0a0a0 0px 3px 0px, rgba(140,140,140,0.498039) 0px 4px 0px, #787878 0px 0px 0px, rgba(0,0,0,0.498039) 0px 5px 10px",
                }}
              >
                NOBODY WANTS TO GET THE RUN AROUND
              </h2>
              <h1
                className="mb-6 text-[107px] font-bold leading-[1em] tracking-tight whitespace-nowrap"
                style={{
                  color: "#1D67CD",
                  textShadow:
                    "#c8c8c8 1px 1px 0px, #b4b4b4 0px 2px 0px, #a0a0a0 0px 3px 0px, rgba(140,140,140,0.498039) 0px 4px 0px, #787878 0px 0px 0px, rgba(0,0,0,0.498039) 0px 5px 10px",
                }}
              >
                GET THE VIP TREATMENT
              </h1>
            </div>

            <div className="mx-auto max-w-[1000px] flex justify-between items-start gap-16">
              <div>
                <h2
                  className="text-[38px] font-bold leading-normal tracking-tight text-white whitespace-nowrap"
                  style={{
                    textShadow:
                      "#c8c8c8 1px 1px 0px, #b4b4b4 0px 2px 0px, #a0a0a0 0px 3px 0px, rgba(140,140,140,0.498039) 0px 4px 0px, #787878 0px 0px 0px, rgba(0,0,0,0.498039) 0px 5px 10px",
                  }}
                >
                  FIND A LOCAL DEALERSHIP
                </h2>

                <Button
                  asChild
                  className="mt-4 rounded-full bg-red-500 px-12 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:bg-red-600 hover:shadow-xl"
                >
                  <Link href={`/${lng}/cars/shop`} className="flex items-center">
                    SHOP NOW
                    <svg
                      className="ml-2 h-4 w-4"
                      viewBox="0 0 200 200"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M159 70.9l-2.2 2.4L183.6 99H9v3h174.6l-26.2 25.3 2.1 2.6 30.5-29.3-31-29.7z"
                        fill="currentColor"
                      />
                    </svg>
                  </Link>
                </Button>
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-[500px] text-[18px] leading-[1.8em] text-white text-center font-medium"
                style={{
                  textShadow: "rgba(0,0,0,0.4) 0px 4px 5px"
                }}
              >
                At MyVIP, we only work with select dealerships that meet our
                standards for speed, service, and transparency. Use our dealer
                locator to find a participating VIP Appointment location near you
                — and get ready for a better way to buy.
              </motion.p>
            </div>
          </motion.div>

          {/* Service Boxes */}
          <div className="mx-auto max-w-[1400px] mb-32 mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {serviceBoxes.map((box, index) => (
              <motion.div
                key={box.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
                className={cn(
                  "rounded-[30px] bg-[#1D67CD] p-8 text-center text-white shadow-lg",
                  "transform transition-transform hover:scale-105"
                )}
              >
                <h3 className="mb-4 text-[20px] font-bold">{box.title}</h3>
                <p className="text-[14px] leading-[1.6em]">
                  <span className="font-semibold italic">{box.subtitle}</span>
                  <br />
                  {box.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scrolling Text Banner */}
      <div className="relative bg-[#1D67CD] py-4 overflow-hidden">
        <div className={`whitespace-nowrap flex ${styles.scrollingText}`}>
          {[...Array(4)].map((_, i) => (
            <span 
              key={i} 
              className="text-white text-[22px] font-bold tracking-[0.05em] mx-8 flex-none uppercase"
            >
              Tell them you saw it on VIPAppointments.com because, everyone deserves the VIP Treatment when purchasing a Vehicle.
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
