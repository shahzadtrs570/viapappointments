/*eslint-disable*/

export interface ContemplationProps {
  onBack: () => void
  onComplete: () => void
  checkVerification: () => Promise<boolean>
  updateWizardData: (data: any) => void
  propertyId?: string
  isContinueAgainMode?: boolean
}

export interface SuggestedQuestion {
  id: string
  text: string
  category: string
  followUp: string[]
}

export interface ApplicationReviewData {
  id: string
  createdAt: Date | string
  status: "PENDING" | "PROCESSING" | "ACCEPTED" | "REJECTED"
  propertyId?: string
}

export interface ApplicationHeaderProps {
  applicationReviewData?: ApplicationReviewData
  getFormattedDate: (date?: Date | string) => string
  t: (key: string) => string
}

export interface WhatHappensNextSectionProps {
  t: (key: string) => string
}

export interface AboutSrenovaSectionProps {
  t: (key: string) => string
}

export interface NavigationButtonsProps {
  isContinueAgain: boolean
  isChecking: boolean
  onBack: () => void
  onCheckStatus: () => void
  t: (key: string) => string
}

export interface ApplicationStatusCardProps {
  applicationReviewData?: ApplicationReviewData
  isLoadingReview: boolean
  getProgressPercentage: () => number
  getProgressBarColorClass: () => string
  getFormattedDate: (date?: Date | string) => string
  t: (key: string) => string
}

export interface ChatBotSectionProps {
  suggestedQuestions: SuggestedQuestion[]
  t: (key: string) => string
}

export interface HelpfulResourcesCardProps {
  t: (key: string) => string
}
