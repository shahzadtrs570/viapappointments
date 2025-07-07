// import { type TFunction } from "i18next"
import { Home, PiggyBank, Shield, UserCog } from "lucide-react"

import type { useTranslation } from "@/lib/i18n/client"

export type Feature = {
  title: string
  text: string
  imageSrc: string
}

export type FeatureWithIcon = {
  title: string
  text: string
  icon: React.ReactNode
}

export type Features = Feature[]
export type FeaturesWithIcon = FeatureWithIcon[]

export const getFeatureGroupOne = (
  t: ReturnType<typeof useTranslation>[0]
): Features => [
  {
    title: t("features.group_one.stay_home.title", "Stay In Your Home"),
    text: t(
      "features.group_one.stay_home.text",
      "Continue living in your property for as long as you wish while accessing its value. Our legal framework ensures your occupancy rights are fully protected, giving you both financial freedom and peace of mind."
    ),
    imageSrc: "/images/placeholderImageGray.svg",
  },
  {
    title: t("features.group_one.no_repayments.title", "No Monthly Repayments"),
    text: t(
      "features.group_one.no_repayments.text",
      "Unlike traditional loans, there are no monthly repayments to worry about. The loan is only repaid when you choose to leave your home, giving you complete financial flexibility in your retirement."
    ),
    imageSrc: "/images/placeholderImageBlue.svg",
  },
  {
    title: t("features.group_one.fca.title", "FCA Regulated"),
    text: t(
      "features.group_one.fca.text",
      "As a fully regulated provider by the Financial Conduct Authority and member of the Equity Release Council, we adhere to strict standards ensuring your interests are protected at all times."
    ),
    imageSrc: "/images/placeholderImagePurple.svg",
  },
  {
    title: t("features.group_one.guidance.title", "Expert Guidance"),
    text: t(
      "features.group_one.guidance.text",
      "Our team of financial advisors and property specialists are here to guide you through every step. Get personalized advice and support to make informed decisions about your property's equity."
    ),
    imageSrc: "/images/placeholderImageGreen.svg",
  },
]

export const getFeatureGroupTwo = (
  t: ReturnType<typeof useTranslation>[0]
): FeaturesWithIcon => [
  {
    title: t("features.group_two.how_works.title", "How does Srenova work?"),
    text: t(
      "features.group_two.how_works.text",
      "Srenova allows you to release equity from your home while continuing to live in it. You can receive a lump sum payment and/or regular monthly income in exchange for a share of your property's future value."
    ),
    icon: <PiggyBank className="mb-4" size={30} />,
  },
  {
    title: t(
      "features.group_two.eligibility.title",
      "Am I eligible for Srenova?"
    ),
    text: t(
      "features.group_two.eligibility.text",
      "To be eligible, you typically need to be over 55, own your property (or have a small mortgage), and the property should be your main residence. Take our quick eligibility check to see if you qualify."
    ),
    icon: <Shield className="mb-4" size={30} />,
  },
  {
    title: t("features.group_two.receive.title", "How much could I receive?"),
    text: t(
      "features.group_two.receive.text",
      "The amount you can receive depends on factors such as your age, property value, and health. Use our calculator to get an estimate, or speak with an advisor for a personalized assessment."
    ),
    icon: <UserCog className="mb-4" size={30} />,
  },
  {
    title: t("features.group_two.maintenance.title", "Property Maintenance"),
    text: t(
      "features.group_two.maintenance.text",
      "We help ensure your property remains well-maintained, preserving its value and providing you with a comfortable living environment throughout the agreement."
    ),
    icon: <Home className="mb-4" size={30} />,
  },
]
