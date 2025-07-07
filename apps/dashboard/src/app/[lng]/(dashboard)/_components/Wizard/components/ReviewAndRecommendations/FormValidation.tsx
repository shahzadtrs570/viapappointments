/*eslint-disable*/

export interface ReviewAndRecommendationsProps {
  data: {
    propertyDetails: {
      id: string
      propertyType: string
      status: string
      bedrooms: string
      bathrooms: string
      estimatedValue: string
    }
    ownerInformation: {
      id: string
      numberOfOwners: number
      primaryContact: string
      email: string
      phone: string
    }
  }
  defaultValues?: {
    id?: string
    checklist?: {
      financialAdvisor: boolean
      financialSituation: boolean
      carePlans: boolean
      existingMortgages: boolean
    }
    considerations?: {
      ownership: boolean
      benefits: boolean
      mortgage: boolean
    }
    coSellerIds?: string[]
  }
  onBack: () => void
  onEdit: (section: "property" | "owner", options?: { mode: string }) => void
  onSubmit: (data: {
    checklist: {
      financialAdvisor: boolean
      financialSituation: boolean
      carePlans: boolean
      existingMortgages: boolean
    }
    considerations: { ownership: boolean; benefits: boolean; mortgage: boolean }
  }) => void
  readOnly?: boolean
  updateWizardData: (data: { editMode?: "edit" | "create" | undefined }) => void
  propertyId?: string
}

export interface ChecklistData {
  financialAdvisor: boolean
  financialSituation: boolean
  carePlans: boolean
  existingMortgages: boolean
}

export interface ConsiderationsData {
  ownership: boolean
  benefits: boolean
  mortgage: boolean
}

export interface SuggestedQuestion {
  id: string
  text: string
  category: string
  followUp: string[]
}

export interface ApplicationPreviewProps {
  propertyDetails: any
  ownersInformation: any
  readOnly: boolean
  onEdit: (section: "property" | "owner", options?: { mode: string }) => void
  t: any
}

export interface SrenovaRecommendationsChecklistProps {
  localChecklist: ChecklistData
  readOnly: boolean
  onChecklistChange: (field: string, value: boolean) => void
  t: any
}

export interface EmailVerificationAlertProps {
  isEmailVerified: boolean
  readOnly: boolean
  primaryOwnerEmail: string | undefined
  isVerificationSent: boolean
  isVerificationLoading: boolean
  onSendVerificationEmail: () => void
  renderVerificationButtonContent: () => React.ReactNode
  t: any
}

export interface NavigationButtonsProps {
  readOnly: boolean
  onBack: () => void
  onSubmit: () => void
  createReviewPending: boolean
  updateReviewPending: boolean
  t: any
}

export interface KeyConsiderationsSectionProps {
  localConsiderations: ConsiderationsData
  readOnly: boolean
  onConsiderationsChange: (field: string, value: boolean) => void
  t: any
}

export interface ContemplationPhaseCardProps {
  t: any
}

export interface NextStepsCardProps {
  t: any
}

export interface ChatBotSectionProps {
  suggestedQuestions: SuggestedQuestion[]
  t: any
}
