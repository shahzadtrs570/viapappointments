/* eslint-disable */

"use client"

import styles from "./ScrollingBanner.module.css"

export function ScrollingBanner() {
  return (
    <div className="relative bg-[#1D67CD] py-4 overflow-hidden">
      <div className={`whitespace-nowrap flex ${styles.scrollingText}`}>
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="text-white text-[22px] font-bold tracking-[0.05em] mx-8 flex-none uppercase"
          >
            Tell them you saw it on VIPAppointments.com because, everyone
            deserves the VIP Treatment when purchasing a Vehicle.
          </span>
        ))}
      </div>
    </div>
  )
}
