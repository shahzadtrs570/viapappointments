/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/

"use client"
import { useMemo, useState } from "react"
import Image, { ImageProps } from "next/image"

interface PlaceholderImageProps extends Omit<ImageProps, "src"> {
  src?: string
  text?: string
  bgColor?: string
  textColor?: string
}

export function PlaceholderImage({
  src,
  alt = "Placeholder",
  text,
  bgColor = "#f3f4f6",
  textColor = "#6b7280",
  width: propWidth,
  height: propHeight,
  fill,
  className,
  ...props
}: PlaceholderImageProps) {
  const [imageError, setImageError] = useState(false)
  const displayText = text || alt
  const width = fill ? 400 : propWidth || 400
  const height = fill ? 300 : propHeight || 300

  const svgCode = useMemo(() => {
    const words = displayText.split(" ")
    const initials = words
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()

    const fontSize = Math.floor(Math.min(Number(width), Number(height)) / 8)
    const smallFontSize = Math.floor(fontSize / 2)

    return `data:image/svg+xml,${encodeURIComponent(`
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <text 
          x="50%" 
          y="45%" 
          font-family="system-ui, sans-serif" 
          font-size="${fontSize}px"
          fill="${textColor}"
          text-anchor="middle" 
          dominant-baseline="middle"
        >
          ${initials}
        </text>
        <text 
          x="50%" 
          y="65%" 
          font-family="system-ui, sans-serif" 
          font-size="${smallFontSize}px"
          fill="${textColor}"
          text-anchor="middle" 
          dominant-baseline="middle"
        >
          ${displayText.slice(0, 30)}${displayText.length > 30 ? "..." : ""}
        </text>
      </svg>
    `)}`
  }, [displayText, width, height, bgColor, textColor])

  return (
    <Image
      src={!src || imageError ? svgCode : src}
      alt={alt}
      width={!fill ? Number(width) : undefined}
      height={!fill ? Number(height) : undefined}
      fill={fill}
      className={className}
      onError={() => setImageError(true)}
      {...props}
    />
  )
}
