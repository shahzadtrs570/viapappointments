import { useStepTwoOnboarding } from "../../_hooks/useStepTwoOnboarding"
import { MultiStepLayout } from "../MultiStepLayout/MultiStepLayout"
import { PricingForm } from "../PricingForm/PricingForm"
import { StepLayout } from "../StepLayout/StepLayout"

export function StepTwo() {
  const { form, onSubmit } = useStepTwoOnboarding()

  return (
    <StepLayout
      handleBackClick={form.handleSubmit((values) => onSubmit(values, true))}
      handleSubmit={form.handleSubmit((values) => onSubmit(values))}
      isLoading={form.formState.isSubmitting}
      submitButtonText="Start Free Trial"
    >
      <MultiStepLayout
        description="Get started by choosing a free 14 day trial, no credit card required."
        title="Choose a subscription plan"
      >
        <PricingForm form={form} />
      </MultiStepLayout>
    </StepLayout>
  )
}
