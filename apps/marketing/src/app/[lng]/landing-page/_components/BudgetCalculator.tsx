/* eslint-disable */
"use client"

import { Container } from "@package/ui/container"
import { useState, useEffect, useRef } from "react"

export function BudgetCalculator() {
  const [downPayment, setDownPayment] = useState(2350)
  const [loanTerm, setLoanTerm] = useState(72)
  const [creditScore, setCreditScore] = useState("700-749")
  const [monthlyPayment, setMonthlyPayment] = useState(418)
  const [includeTradeIn, setIncludeTradeIn] = useState(false)
  const [totalBudget, setTotalBudget] = useState(25012)
  const [displayBudget, setDisplayBudget] = useState(25012)
  const [apr, setApr] = useState(9.84)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showDialog, setShowDialog] = useState(false)
  const [isDialogAnimating, setIsDialogAnimating] = useState(false)
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  const loanTermOptions = [
    { value: 24, label: "24 months" },
    { value: 36, label: "36 months" },
    { value: 48, label: "48 months" },
    { value: 60, label: "60 months" },
    { value: 72, label: "72 months" },
    { value: 84, label: "84 months" }
  ]

  const creditScoreOptions = [
    { value: "800+", label: "800+" },
    { value: "750-799", label: "750-799" },
    { value: "700-749", label: "700-749" },
    { value: "650-699", label: "650-699" },
    { value: "600-649", label: "600-649" },
    { value: "Below 600", label: "Below 600" }
  ]

  // APR calculation based on credit score
  const getAPR = (score: string) => {
    switch (score) {
      case "800+": return 4.2
      case "750-799": return 5.8
      case "700-749": return 9.84
      case "650-699": return 12.5
      case "600-649": return 15.2
      case "Below 600": return 18.9
      default: return 9.84
    }
  }

  // Animate counter
  const animateCounter = (start: number, end: number, duration: number = 1500) => {
    if (animationRef.current) {
      clearInterval(animationRef.current)
    }
    
    setIsAnimating(true)
    const startTime = Date.now()
    const difference = end - start
    
    const updateCounter = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const current = Math.round(start + difference * easeOutQuart)
      
      setDisplayBudget(current)
      
      if (progress < 1) {
        animationRef.current = setTimeout(updateCounter, 16) // ~60fps
      } else {
        setIsAnimating(false)
      }
    }
    
    updateCounter()
  }

  // Calculate total budget
  const calculateBudget = () => {
    const calculatedAPR = getAPR(creditScore)
    const monthlyRate = calculatedAPR / 100 / 12
    const totalPayments = monthlyPayment * loanTerm
    const totalInterest = totalPayments - (totalPayments / (1 + monthlyRate * loanTerm))
    const principal = totalPayments - totalInterest
    const budget = principal + downPayment
    
    setApr(calculatedAPR)
    const newBudget = Math.round(budget)
    
    // Animate from current display value to new budget
    animateCounter(displayBudget, newBudget)
    setTotalBudget(newBudget)
  }

  useEffect(() => {
    calculateBudget()
  }, [downPayment, loanTerm, creditScore, monthlyPayment])

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const openDialog = () => {
    setShowDialog(true)
    // Small delay to ensure the element is rendered before animation
    setTimeout(() => setIsDialogAnimating(true), 10)
  }

  const closeDialog = () => {
    setIsDialogAnimating(false)
    // Wait for animation to complete before hiding
    setTimeout(() => setShowDialog(false), 300)
  }

  return (
    <section className="bg-white py-20 dark:bg-background">
      <Container className="max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
                Estimate your budget
              </h2>
              <p className="text-xl font-medium text-gray-600 dark:text-gray-400 leading-relaxed">
                Then get personalized rates with no impact on your credit score
              </p>
            </div>
            
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Get pre-qualified
            </button>
          </div>

          {/* Right Side - Calculator */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 space-y-6">
            {/* Input Fields */}
            <div className="grid grid-cols-2 gap-4">
              {/* Down Payment */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Est. down payment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="number"
                    value={downPayment}
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white font-medium text-lg"
                    placeholder="2,350"
                  />
                </div>
              </div>

              {/* Loan Term */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Loan term
                </label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white font-medium text-lg"
                >
                  {loanTermOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Credit Score */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Credit score
                </label>
                <select
                  value={creditScore}
                  onChange={(e) => setCreditScore(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white font-medium text-lg"
                >
                  {creditScoreOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Monthly Payment */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Est. monthly payment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                  <input
                    type="number"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white font-medium text-lg"
                    placeholder="418"
                  />
                </div>
              </div>
            </div>

            {/* Trade-in Toggle */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIncludeTradeIn(!includeTradeIn)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  includeTradeIn ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    includeTradeIn ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                Include trade-in
              </span>
            </div>

            {/* Result */}
            <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-6xl font-black text-gray-900 dark:text-white mb-2">
                {formatCurrency(displayBudget)}
              </div>
              <div className="flex gap-2 items-center justify-center text-lg text-gray-600 dark:text-gray-400">
                <span className="font-medium">with {apr}% APR</span>
                <button 
                  onClick={openDialog}
                  className="ml-2 w-5 h-5 rounded-full border border-gray-400 text-gray-400 text-xs flex items-center justify-center hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:border-blue-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 transition-all duration-200 font-bold hover:scale-110 transform"
                >
                  ?
                </button>
              </div>
            </div>

            {/* Bottom Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                Not ready to pre-qualify?{" "}
                <button className="text-gray-900 dark:text-white font-bold underline hover:no-underline">
                  Shop by estimated budget
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Dialog Modal */}
        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div 
              className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
                isDialogAnimating ? 'opacity-100' : 'opacity-0'
              }`}
              onClick={closeDialog}
            />
            
            {/* Dialog Content */}
            <div 
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 transition-all duration-300 transform ${
                isDialogAnimating 
                  ? 'scale-100 opacity-100 translate-y-0' 
                  : 'scale-95 opacity-0 translate-y-4'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={closeDialog}
                className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  Estimated payment details
                </h2>
              </div>

              {/* Content */}
              <div className="text-center">
                <p className="text-base font-medium text-gray-700 dark:text-gray-300 leading-relaxed">
                  Estimated payments are for <span className="font-bold">informational purposes only</span>, 
                  and do not represent a financing offer or guarantee of credit from the seller. 
                  Estimated payments may exclude <span className="font-bold">title and registration fees</span> and 
                  may not account for all <span className="font-bold">dealer charges and governmental fees</span>.
                </p>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  )
} 