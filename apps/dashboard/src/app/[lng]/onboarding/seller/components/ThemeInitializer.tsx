/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
"use client"

import { useEffect } from "react"

export function ThemeInitializer() {
  useEffect(() => {
    // Add the theme class to the HTML element to ensure consistent styling
    document.documentElement.classList.add("Srenova")

    // Clean up function to remove the class when component unmounts
    return () => {
      document.documentElement.classList.remove("Srenova")
    }
  }, [])

  // This component doesn't render anything
  return null
}
