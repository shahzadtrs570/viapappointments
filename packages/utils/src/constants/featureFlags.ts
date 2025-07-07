import { PaymentProviderType } from "../types"

type FeatureFlags = {
  payments: PaymentProviderType
  chatSupportWidget: boolean
  feedbackWidget: boolean
  toast: boolean
  onboardingFlow: boolean
  blog: boolean
  docs: boolean
  themeToggle: boolean
  templateFeature: boolean
  surveyFeature: boolean
  waitlist: boolean
  newsletter: boolean
}

/**
 * Application Feature Flags
 *
 * Toggle features on or off within the application. Modify and select different configurations here.
 *
 * @property payments - Payment provider to use
 * @property chatSupportWidget - Chat support widget in the bottom right corner
 * @property feedbackWidget - Feedback widget on /feedback page on the dashboard app
 * @property toast - Display error toast notifications on marketing and dashboard app whenever an error is thrown from the API
 * @property onboardingFlow - Onboarding flow for new users
 * @property blog - Display blog section on the marketing app
 * @property docs - Display documentation section on the marketing app
 * @property themeToggle - Display theme toggle in the navbar (dark/light mode)
 * @property templateFeature - Enable the feature template functionality across the application
 * @property surveyFeature - Enable the survey functionality across the application
 * @property waitlist - Display waitlist section on the marketing app
 */
export const featureFlags: FeatureFlags = {
  payments: PaymentProviderType.Stripe,
  chatSupportWidget: true,
  feedbackWidget: true,
  toast: true,
  onboardingFlow: false,
  blog: false,
  docs: false,
  themeToggle: false,
  templateFeature: true,
  surveyFeature: false,
  waitlist: false,
  newsletter: false,
}
