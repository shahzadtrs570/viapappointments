/* eslint-disable */
"use client"

import { useState, useEffect, useRef } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "../Sheet/Sheet"
import { Button } from "../Button/Button"
import { Input } from "../Input/Input"
import { Checkbox } from "../Checkbox/Checkbox"
import { Label } from "../Label/Label"
import { cn } from "../../lib/utils"

export interface WheelSegment {
  id: string
  label: string
  color: string
  probability?: number
}

export interface WheelPopupProps {
  title?: string
  description?: string
  segments: WheelSegment[]
  onSpin?: (segment: WheelSegment) => void
  onSubmit?: (data: {
    name: string
    email: string
    phone: string
    marketing: boolean
  }) => void
  ctaText?: string
  spinButtonText?: string
  logo?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  formFields?: {
    nameLabel?: string
    emailLabel?: string
    phoneLabel?: string
    marketingLabel?: string
  }
}

export function WheelPopup({
  title = "Our store's special bonus unlocked!",
  description = "You have a chance to win up to $25,000 cash, a nice big fat discount or one of our other great prizes. Are you feeling lucky? Give it a spin.",
  segments,
  onSpin,
  onSubmit,
  ctaText = "TRY YOUR LUCK",
  spinButtonText = "SPIN",
  logo,
  open: controlledOpen,
  onOpenChange,
  defaultOpen = false,
  formFields = {
    nameLabel: "Your full name",
    emailLabel: "Your email address",
    phoneLabel: "Your phone number",
    marketingLabel:
      "I wish to have my prize voucher along with any discounts and marketing offers sent to my email address or via SMS or phone.",
  },
}: WheelPopupProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [spinning, setSpinning] = useState(false)
  const [result, setResult] = useState<WheelSegment | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [marketing, setMarketing] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const wheelRef = useRef<SVGGElement>(null)

  // Control open state
  const isOpen = controlledOpen !== undefined ? controlledOpen : open
  const setIsOpen = onOpenChange || setOpen

  // Normalize segments to ensure they have probabilities
  const normalizedSegments = segments.map((segment) => ({
    ...segment,
    probability: segment.probability || 1,
  }))

  // Calculate total probability
  const totalProbability = normalizedSegments.reduce(
    (sum, segment) => sum + (segment.probability || 1),
    0
  )

  // Function to spin the wheel
  const spinWheel = () => {
    if (spinning) return

    setSpinning(true)

    // Determine winning segment based on probability
    const random = Math.random() * totalProbability
    let cumulativeProbability = 0
    let winningSegment: WheelSegment | undefined

    for (const segment of normalizedSegments) {
      cumulativeProbability += segment.probability || 1
      if (random <= cumulativeProbability) {
        winningSegment = segment
        break
      }
    }

    // If no segment was selected (shouldn't happen), pick the first one
    if (!winningSegment) {
      winningSegment = normalizedSegments[0]
    }

    // Calculate rotation angle
    const segmentAngle = 360 / segments.length
    const segmentIndex = segments.findIndex((s) => s.id === winningSegment.id)

    // Calculate rotation to land on the winning segment
    // Add extra rotations for effect (5 full rotations + position)
    const rotation =
      5 * 360 + (360 - segmentIndex * segmentAngle - segmentAngle / 2)

    if (wheelRef.current) {
      wheelRef.current.style.transition =
        "transform 5s cubic-bezier(0.17, 0.67, 0.21, 0.99)"
      wheelRef.current.style.transform = `rotate(${rotation}deg)`
    }

    // Set result after animation completes
    setTimeout(() => {
      setSpinning(false)
      setResult(winningSegment!)
      if (onSpin) onSpin(winningSegment!)
    }, 5000)
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormSubmitted(true)

    if (onSubmit) {
      onSubmit({ name, email, phone, marketing })
    }
  }

  // Reset state when sheet closes
  useEffect(() => {
    if (!isOpen) {
      setSpinning(false)
      setResult(null)
      setFormSubmitted(false)
      if (wheelRef.current) {
        wheelRef.current.style.transition = "none"
        wheelRef.current.style.transform = "rotate(0deg)"
      }
    }
  }, [isOpen])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="left"
        className="w-full sm:max-w-[1000px] p-0 overflow-hidden"
      >
        <div className="flex flex-col lg:flex-row h-full">
          {/* Wheel Section */}
          <div className="relative bg-blue-600 p-8 flex flex-col items-center justify-center min-h-[700px] lg:w-1/2">
            {logo && (
              <div className="absolute top-4 right-4 z-10">
                <img src={logo} alt="Logo" className="h-12 w-auto" />
              </div>
            )}

            <div
              className="relative w-[600px] h-[600px] mt-12"
              style={{ marginLeft: "-60%" }}
            >
              {/* SVG Wheel */}
              <svg
                className="w-full h-full"
                viewBox="0 0 600 600"
                style={{ filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.3))" }}
              >
                <defs>
                  <filter
                    id="shadow"
                    x="-100%"
                    y="-100%"
                    width="550%"
                    height="550%"
                  >
                    <feOffset
                      in="SourceAlpha"
                      dx="0"
                      dy="0"
                      result="offsetOut"
                    ></feOffset>
                    <feGaussianBlur
                      stdDeviation="9"
                      in="offsetOut"
                      result="drop"
                    ></feGaussianBlur>
                    <feColorMatrix
                      in="drop"
                      result="color-out"
                      type="matrix"
                      values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .3 0"
                    ></feColorMatrix>
                    <feBlend
                      in="SourceGraphic"
                      in2="color-out"
                      mode="normal"
                    ></feBlend>
                  </filter>
                </defs>

                <g
                  ref={wheelRef}
                  style={{
                    transformOrigin: "300px 300px",
                    transition:
                      "transform 5s cubic-bezier(0.17, 0.67, 0.21, 0.99)",
                  }}
                >
                  {segments.map((segment, index) => {
                    const angle = 360 / segments.length
                    const startAngle = (index * angle - 90) * (Math.PI / 180) // Start from top
                    const endAngle =
                      ((index + 1) * angle - 90) * (Math.PI / 180)
                    const radius = 260
                    const centerX = 300
                    const centerY = 300

                    const x1 = centerX + radius * Math.cos(startAngle)
                    const y1 = centerY + radius * Math.sin(startAngle)
                    const x2 = centerX + radius * Math.cos(endAngle)
                    const y2 = centerY + radius * Math.sin(endAngle)

                    const largeArcFlag = angle > 180 ? 1 : 0

                    const pathData = [
                      `M ${centerX} ${centerY}`,
                      `L ${x1} ${y1}`,
                      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      "Z",
                    ].join(" ")

                    // Calculate text position - radial from center like the reference
                    const textAngle = (startAngle + endAngle) / 2
                    const textRadius = 180
                    const textX = centerX + textRadius * Math.cos(textAngle)
                    const textY = centerY + textRadius * Math.sin(textAngle)
                    // Rotate text to be readable - pointing outward from center
                    let textRotation = (textAngle * 180) / Math.PI
                    // Flip text if it would be upside down
                    if (textRotation > 90 && textRotation < 270) {
                      textRotation += 180
                    }

                    return (
                      <g key={segment.id}>
                        <path
                          d={pathData}
                          fill={segment.color}
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <text
                          x={textX}
                          y={textY}
                          fill={
                            segment.color === "#57413a" ? "#ffffff" : "#000000"
                          }
                          fontSize="14"
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${textRotation} ${textX} ${textY})`}
                          style={{ fontFamily: "Arial, sans-serif" }}
                        >
                          {segment.label}
                        </text>
                        {/* Edge decorations - white line extending outward */}
                        <line
                          x1={centerX + (radius + 5) * Math.cos(startAngle)}
                          y1={centerY + (radius + 5) * Math.sin(startAngle)}
                          x2={centerX + (radius + 20) * Math.cos(startAngle)}
                          y2={centerY + (radius + 20) * Math.sin(startAngle)}
                          stroke="#ffffff"
                          strokeWidth="3"
                        />
                        {/* Black dot at edge */}
                        <circle
                          cx={centerX + (radius + 15) * Math.cos(startAngle)}
                          cy={centerY + (radius + 15) * Math.sin(startAngle)}
                          r="6"
                          fill="#000000"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                      </g>
                    )
                  })}
                </g>

                {/* Outer circle border */}
                <circle
                  cx="300"
                  cy="300"
                  r="260"
                  fill="transparent"
                  stroke="#ffffff"
                  strokeWidth="8"
                  filter="url(#shadow)"
                />

                {/* Center circle */}
                <circle
                  cx="300"
                  cy="300"
                  r="45"
                  fill="#ffffff"
                  stroke="#ffffff"
                  strokeWidth="4"
                  filter="url(#shadow)"
                />

                {/* Logo in center */}
                {logo && (
                  <image
                    href={logo}
                    x="260"
                    y="260"
                    width="80"
                    height="80"
                    clipPath="circle(40px at 40px 40px)"
                  />
                )}
              </svg>

              {/* Pointer/Peg */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20">
                <svg width="40" height="65" viewBox="0 0 30 50">
                  <defs>
                    <filter id="pegShadow" height="130%">
                      <feGaussianBlur
                        in="SourceAlpha"
                        stdDeviation="2"
                      ></feGaussianBlur>
                      <feOffset dx="2" dy="2" result="offsetblur"></feOffset>
                      <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"></feFuncA>
                      </feComponentTransfer>
                      <feMerge>
                        <feMergeNode></feMergeNode>
                        <feMergeNode in="SourceGraphic"></feMergeNode>
                      </feMerge>
                    </filter>
                  </defs>
                  <path
                    d="M15,5 C10,5 7,12 8,18 C10,28 15,40 15,40 S20,28 22,18 C23,12 20,5 15,5 Z"
                    fill="#fc8289"
                    filter="url(#pegShadow)"
                  />
                  <circle cx="15" cy="12" r="4" fill="#ffffff" />
                </svg>
              </div>
            </div>

            {formSubmitted && (
              <Button
                onClick={spinWheel}
                disabled={spinning}
                className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
              >
                {spinning ? "SPINNING..." : spinButtonText}
              </Button>
            )}

            {result && (
              <div className="mt-4 text-center text-white">
                <p className="text-lg font-bold">Congratulations!</p>
                <p className="text-xl font-bold">{result.label}</p>
              </div>
            )}
          </div>

          {/* Form Section */}
          <div className="p-8 lg:w-1/2 overflow-hidden bg-blue-600">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold text-white">
                {title}
              </SheetTitle>
              <SheetDescription className="mt-2 text-white/90">
                {description}
              </SheetDescription>
            </SheetHeader>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-white"
                >
                  {formFields.nameLabel}
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  required
                  placeholder="John Smith"
                  className="h-12 bg-white border-white"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-white"
                >
                  {formFields.emailLabel}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  required
                  placeholder="john@example.com"
                  className="h-12 bg-white border-white"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-white"
                >
                  {formFields.phoneLabel}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPhone(e.target.value)
                  }
                  required
                  placeholder="+1 (555) 123-4567"
                  className="h-12 bg-white border-white"
                />
              </div>

              <div className="flex items-start space-x-3 py-2">
                <Checkbox
                  id="marketing"
                  checked={marketing}
                  onCheckedChange={(checked: boolean) => setMarketing(checked)}
                  className="mt-1 bg-white border-white"
                />
                <Label
                  htmlFor="marketing"
                  className="text-sm leading-relaxed text-white"
                >
                  {formFields.marketingLabel}
                </Label>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  className="w-full h-12 bg-white hover:bg-gray-100 text-black font-bold text-lg border-0"
                >
                  {ctaText}
                </Button>
              </div>

              <div className="text-xs text-white/70 mt-6 space-y-1">
                <p>— You can spin the wheel only once.</p>
                <p>— If you win, a member of our team will be in touch!</p>
                <p>— Same email must be used when ordering.</p>
              </div>
            </form>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Export subcomponents
WheelPopup.displayName = "WheelPopup"
