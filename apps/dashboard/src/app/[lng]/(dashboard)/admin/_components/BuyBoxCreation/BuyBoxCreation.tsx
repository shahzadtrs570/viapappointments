"use client"

import { useState } from "react"

import type { BuyBoxCreationWizardData } from "./types"
import type { WizardStepComponentProps } from "@/components/WizardCore"

import {
  GuideBot,
  Header,
  Stepper,
  Wizard,
  WizardLayout,
} from "@/components/WizardCore"

import { CapitalDeploymentStep } from "./Steps/CapitalDeploymentStep"
import { ComplianceLegalStep } from "./Steps/ComplianceLegalStep"
import { ContinuousManagementStep } from "./Steps/ContinuousManagementStep"
import { FinancialModelingStep } from "./Steps/FinancialModelingStep"
import { InvestorEngagementStep } from "./Steps/InvestorEngagementStep"
import { PlatformListingStep } from "./Steps/PlatformListingStep"
import { PropertyAggregationStep } from "./Steps/PropertyAggregationStep"
import { ThemeConceptualizationStep } from "./Steps/ThemeConceptualizationStep"
import { BUYBOX_CREATION_STEPS } from "./types"

export function BuyBoxCreation() {
  // State for the guide bot messages
  const [guideBotMessage, setGuideBotMessage] = useState(
    "Welcome to the Buy Box creation process. I'll guide you through each step to ensure you create a successful investment opportunity for your investors."
  )

  // Function to handle a generic action button like getting help
  const handleHelpRequest = () => {
    alert("Connecting you with a compliance officer...")
    // In a real implementation, this could trigger a chat or support ticket
  }

  return (
    <Wizard<BuyBoxCreationWizardData>
      initialData={{}}
      initialStep="theme-conceptualization"
      steps={BUYBOX_CREATION_STEPS}
      storageKey="srenova_buybox_creation"
      renderStep={(
        props: WizardStepComponentProps<BuyBoxCreationWizardData>
      ) => (
        <WizardLayout
          sidebar={
            <GuideBot
              initialMessage={guideBotMessage}
              title="Buy Box Creation Guide"
              botResponses={{
                "process-overview":
                  "The Buy Box creation process consists of 8 key steps: Theme conceptualisation, property aggregation, financial modeling, compliance review, platform listing, investor engagement, capital deployment, and continuous management. Each step ensures you create a compliant and attractive investment offering.",
                "investor-requirements":
                  "Institutional investors typically look for clear return projections, risk assessments, compliance documentation, and transparency regarding the underlying assets. Ensure all these elements are thoroughly addressed in your Buy Box creation.",
                "compliance-needs":
                  "For regulatory compliance, you'll need to ensure FCA and MiFID II compliance, complete due diligence on all properties, provide accurate financial projections, and include appropriate risk disclosures. Our compliance team can review your Buy Box before publication.",
                "property-selection":
                  "When selecting properties for your Buy Box, focus on alignment with your theme, verified valuations, clean legal status, demographic consistency, and balanced risk profiles. Ideally, choose properties that complement each other to create a diversified but coherent investment product.",
              }}
              suggestedQuestions={[
                {
                  id: "process-overview",
                  text: "What is the complete Buy Box creation process?",
                  category: "process",
                },
                {
                  id: "investor-requirements",
                  text: "What do institutional investors look for in a Buy Box?",
                  category: "investors",
                },
                {
                  id: "compliance-needs",
                  text: "What compliance requirements should I consider?",
                  category: "compliance",
                },
                {
                  id: "property-selection",
                  text: "How should I select properties for my Buy Box?",
                  category: "properties",
                },
              ]}
            />
          }
          stepper={
            <Stepper
              currentStepId={props.currentStep.id}
              steps={BUYBOX_CREATION_STEPS}
            />
          }
        >
          <div className="mb-8">
            <Header
              description="Create investment packages tailored for institutional investors"
              title="Buy Box Creation"
              actionButton={{
                label: "Compliance Assistance",
                onClick: handleHelpRequest,
                icon: (
                  <svg
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                ),
              }}
            />
          </div>

          {/* Render the appropriate step component based on currentStep */}
          {props.currentStep.id === "theme-conceptualization" && (
            <ThemeConceptualizationStep
              setGuideMessage={setGuideBotMessage}
              updateWizardData={props.updateWizardData}
              wizardData={props.wizardData}
              onBack={props.goToPreviousStep}
              onNext={props.goToNextStep}
            />
          )}

          {props.currentStep.id === "property-aggregation" && (
            <PropertyAggregationStep
              setGuideMessage={setGuideBotMessage}
              updateWizardData={props.updateWizardData}
              wizardData={props.wizardData}
              onBack={props.goToPreviousStep}
              onNext={props.goToNextStep}
            />
          )}

          {props.currentStep.id === "financial-modeling" && (
            <FinancialModelingStep
              setGuideMessage={setGuideBotMessage}
              updateWizardData={props.updateWizardData}
              wizardData={props.wizardData}
              onBack={props.goToPreviousStep}
              onNext={props.goToNextStep}
            />
          )}

          {props.currentStep.id === "compliance-legal" && (
            <ComplianceLegalStep
              setGuideMessage={setGuideBotMessage}
              updateWizardData={props.updateWizardData}
              wizardData={props.wizardData}
              onBack={props.goToPreviousStep}
              onNext={props.goToNextStep}
            />
          )}

          {props.currentStep.id === "platform-listing" && (
            <PlatformListingStep
              setGuideMessage={setGuideBotMessage}
              updateWizardData={props.updateWizardData}
              wizardData={props.wizardData}
              onBack={props.goToPreviousStep}
              onNext={props.goToNextStep}
            />
          )}

          {props.currentStep.id === "investor-engagement" && (
            <InvestorEngagementStep
              setGuideMessage={setGuideBotMessage}
              updateWizardData={props.updateWizardData}
              wizardData={props.wizardData}
              onBack={props.goToPreviousStep}
              onNext={props.goToNextStep}
            />
          )}

          {props.currentStep.id === "capital-deployment" && (
            <CapitalDeploymentStep
              setGuideMessage={setGuideBotMessage}
              updateWizardData={props.updateWizardData}
              wizardData={props.wizardData}
              onBack={props.goToPreviousStep}
              onNext={props.goToNextStep}
            />
          )}

          {props.currentStep.id === "continuous-management" && (
            <ContinuousManagementStep
              setGuideMessage={setGuideBotMessage}
              updateWizardData={props.updateWizardData}
              wizardData={props.wizardData}
              onBack={props.goToPreviousStep}
              onComplete={() => {
                // Handle completion of the wizard
                alert("Buy Box creation completed successfully!")
                // In a real implementation, this would redirect to the created Buy Box
                // or a confirmation page
              }}
            />
          )}
        </WizardLayout>
      )}
    />
  )
}
