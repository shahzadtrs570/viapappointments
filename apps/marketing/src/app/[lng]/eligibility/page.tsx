/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable max-lines */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-nested-ternary */

"use client"

import { useEffect, useState } from "react"

import { Button } from "@package/ui/button"
import { Card } from "@package/ui/card"
import { ChatBot, ChatHeader } from "@package/ui/chatbot"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@package/ui/dialog"
import { Input } from "@package/ui/input"
import { Label } from "@package/ui/label"
import { Textarea } from "@package/ui/textarea"
import { Typography } from "@package/ui/typography"
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Home,
  Info,
  Mail,
  MapPin,
  Phone,
  Shield,
  UserCheck,
  Users,
} from "lucide-react"
import Link from "next/link"

import { useTranslation } from "@/lib/i18n/client"

type FlowColor = "green" | "yellow" | "red" | "white"

interface EligibilityQuestion {
  id: string
  questionKey: string
  descriptionKey?: string
  icon?: React.ReactNode
  color?: FlowColor
  options: {
    value: string
    labelKey: string
    descriptionKey?: string
    color?: FlowColor
    dangerous?: boolean
    skipTo?: string
  }[]
  sectionKey?: string
}

const ELIGIBILITY_QUESTIONS_DATA: EligibilityQuestion[] = [
  {
    id: "country",
    questionKey: "country.question",
    descriptionKey: "country.description",
    icon: <MapPin className="size-6 text-primary" />,
    sectionKey: "section.eligibilityAndAge",
    color: "white",
    options: [
      {
        value: "united-kingdom",
        labelKey: "country.options.uk.label",
        descriptionKey: "country.options.uk.description",
        color: "green",
      },
      {
        value: "european-union",
        labelKey: "country.options.eu.label",
        descriptionKey: "country.options.eu.description",
        color: "green",
      },
      {
        value: "other",
        labelKey: "country.options.other.label",
        descriptionKey: "country.options.other.description",
        color: "red",
        dangerous: true,
      },
    ],
  },
  {
    id: "property-ownership",
    questionKey: "propertyOwnership.question",
    descriptionKey: "propertyOwnership.description",
    icon: <Home className="size-6 text-primary" />,
    sectionKey: "section.eligibilityAndAge",
    color: "white",
    options: [
      {
        value: "yes",
        labelKey: "propertyOwnership.options.yes.label",
        descriptionKey: "propertyOwnership.options.yes.description",
        color: "green",
      },
      {
        value: "no",
        labelKey: "propertyOwnership.options.no.label",
        descriptionKey: "propertyOwnership.options.no.description",
        color: "red",
        dangerous: true,
      },
    ],
  },
  {
    id: "age",
    questionKey: "age.question",
    descriptionKey: "age.description",
    icon: <UserCheck className="size-6 text-primary" />,
    sectionKey: "section.eligibilityAndAge",
    color: "white",
    options: [
      {
        value: "under-60",
        labelKey: "age.options.under60.label",
        descriptionKey: "age.options.under60.description",
        color: "red",
        dangerous: true,
      },
      {
        value: "60-64",
        labelKey: "age.options.60to64.label",
        descriptionKey: "age.options.60to64.description",
        color: "green",
      },
      {
        value: "65-74",
        labelKey: "age.options.65to74.label",
        descriptionKey: "age.options.65to74.description",
        color: "green",
      },
      {
        value: "75+",
        labelKey: "age.options.over75.label",
        descriptionKey: "age.options.over75.description",
        color: "red",
        dangerous: true,
      },
    ],
  },
  {
    id: "joint-ownership",
    questionKey: "jointOwnership.question",
    descriptionKey: "jointOwnership.description",
    icon: <Users className="size-6 text-primary" />,
    sectionKey: "section.eligibilityAndAge",
    color: "white",
    options: [
      {
        value: "yes",
        labelKey: "jointOwnership.options.yes.label",
        descriptionKey: "jointOwnership.options.yes.description",
        color: "yellow",
        skipTo: "spouse-age",
      },
      {
        value: "no",
        labelKey: "jointOwnership.options.no.label",
        descriptionKey: "jointOwnership.options.no.description",
        color: "green",
        skipTo: "children-heirs",
      },
    ],
  },
  {
    id: "spouse-age",
    questionKey: "spouseAge.question",
    descriptionKey: "spouseAge.description",
    icon: <Users className="size-6 text-primary" />,
    sectionKey: "section.eligibilityAndAge",
    color: "yellow",
    options: [
      {
        value: "yes",
        labelKey: "spouseAge.options.yes.label",
        descriptionKey: "spouseAge.options.yes.description",
        color: "green",
      },
      {
        value: "no",
        labelKey: "spouseAge.options.no.label",
        descriptionKey: "spouseAge.options.no.description",
        color: "red",
        dangerous: true,
      },
    ],
  },
  {
    id: "children-heirs",
    questionKey: "childrenHeirs.question",
    descriptionKey: "childrenHeirs.description",
    icon: <Users className="size-6 text-primary" />,
    sectionKey: "section.familyInvolvement",
    color: "yellow",
    options: [
      {
        value: "yes",
        labelKey: "childrenHeirs.options.yes.label",
        descriptionKey: "childrenHeirs.options.yes.description",
        color: "yellow",
        skipTo: "inheritance-importance",
      },
      {
        value: "no",
        labelKey: "childrenHeirs.options.no.label",
        descriptionKey: "childrenHeirs.options.no.description",
        color: "green",
        skipTo: "confident-understanding",
      },
    ],
  },
  {
    id: "inheritance-importance",
    questionKey: "inheritanceImportance.question",
    descriptionKey: "inheritanceImportance.description",
    icon: <Home className="size-6 text-primary" />,
    sectionKey: "section.familyInvolvement",
    color: "yellow",
    options: [
      {
        value: "top-priority",
        labelKey: "inheritanceImportance.options.topPriority.label",
        descriptionKey: "inheritanceImportance.options.topPriority.description",
        color: "red",
        dangerous: true,
      },
      {
        value: "not-priority",
        labelKey: "inheritanceImportance.options.notPriority.label",
        descriptionKey: "inheritanceImportance.options.notPriority.description",
        color: "green",
        skipTo: "confident-understanding",
      },
      {
        value: "not-sure",
        labelKey: "inheritanceImportance.options.notSure.label",
        descriptionKey: "inheritanceImportance.options.notSure.description",
        color: "yellow",
        skipTo: "discuss-options",
      },
    ],
  },
  {
    id: "confident-understanding",
    questionKey: "confidentUnderstanding.question",
    descriptionKey: "confidentUnderstanding.description",
    icon: <Info className="size-6 text-primary" />,
    sectionKey: "section.adviceAndConsent",
    color: "white",
    options: [
      {
        value: "yes",
        labelKey: "confidentUnderstanding.options.yes.label",
        descriptionKey: "confidentUnderstanding.options.yes.description",
        color: "green",
        skipTo: "continue-step",
      },
      {
        value: "no",
        labelKey: "confidentUnderstanding.options.no.label",
        descriptionKey: "confidentUnderstanding.options.no.description",
        color: "yellow",
        skipTo: "discuss-options",
      },
      {
        value: "not-sure",
        labelKey: "confidentUnderstanding.options.notSure.label",
        descriptionKey: "confidentUnderstanding.options.notSure.description",
        color: "yellow",
        skipTo: "discuss-options",
      },
    ],
  },
  {
    id: "discuss-options",
    questionKey: "discussOptions.question",
    descriptionKey: "discussOptions.description",
    icon: <HelpCircle className="size-6 text-primary" />,
    sectionKey: "section.adviceAndConsent",
    color: "yellow",
    options: [
      {
        value: "yes",
        labelKey: "discussOptions.options.yes.label",
        descriptionKey: "discussOptions.options.yes.description",
        color: "green",
      },
      {
        value: "no",
        labelKey: "discussOptions.options.no.label",
        descriptionKey: "discussOptions.options.no.description",
        color: "red",
        dangerous: true,
      },
    ],
  },
]

const ELIGIBILITY_CRITERIA = [
  {
    key: "criteria.age",
    titleKey: "criteria.age.title",
    descriptionKey: "criteria.age.description",
  },
  {
    key: "criteria.ownership",
    titleKey: "criteria.ownership.title",
    descriptionKey: "criteria.ownership.description",
  },
  {
    key: "criteria.residence",
    titleKey: "criteria.residence.title",
    descriptionKey: "criteria.residence.description",
  },
]

interface EligibilityPageProps {
  params: { lng: string }
}

export default function EligibilityPage({
  params: { lng },
}: EligibilityPageProps) {
  const { t } = useTranslation(lng, ["eligibility"])

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [eligibilityStatus, setEligibilityStatus] = useState<boolean | null>(
    null
  )
  const [feedback, setFeedback] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [pendingAnswer, setPendingAnswer] = useState<{
    questionId: string
    value: string
  } | null>(null)
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Prevent body padding when dialogs open
  useEffect(() => {
    const preventBodyPadding = () => {
      document.body.style.paddingRight = "0 !important"
      document.body.style.overflow = "hidden"
    }

    if (showConfirmDialog || showContactForm) {
      preventBodyPadding()
    }

    return () => {
      document.body.style.paddingRight = ""
      document.body.style.overflow = ""
    }
  }, [showConfirmDialog, showContactForm])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const error = params.get("error")
    if (error) {
      setErrorMessage(t(error))
    }

    const saved = localStorage.getItem("eligibility")
    if (saved) {
      try {
        const parsedAnswers = JSON.parse(saved)
        setAnswers(parsedAnswers)
      } catch (e) {
        console.error("Error parsing saved eligibility data:", e)
      }
    }
  }, [t])

  const url = new URL(process.env.NEXT_PUBLIC_APP_URL!)
  if (process.env.NEXT_PUBLIC_APP_ENV === "production") {
    url.hostname = `app.${url.hostname}`
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    const questionData = ELIGIBILITY_QUESTIONS_DATA[currentQuestionIndex]
    const option = questionData.options.find((opt) => opt.value === value)

    if (option?.dangerous) {
      setPendingAnswer({ questionId, value })
      setShowConfirmDialog(true)
      return
    }

    const newAnswers = { ...answers, [questionId]: value }
    setAnswers(newAnswers)
    localStorage.setItem("eligibility", JSON.stringify(newAnswers))
  }

  const checkEligibilityAndProceed = (
    currentAnswers: Record<string, string>
  ): boolean => {
    for (const questionId in currentAnswers) {
      const question = ELIGIBILITY_QUESTIONS_DATA.find(
        (q) => q.id === questionId
      )
      const answerValue = currentAnswers[questionId]
      const option = question?.options.find((opt) => opt.value === answerValue)
      if (option?.dangerous) {
        setEligibilityStatus(false)
        setFeedback("feedback.ineligible")
        setTimeout(() => setShowContactForm(true), 500)
        return true
      }
    }

    if (currentQuestionIndex >= ELIGIBILITY_QUESTIONS_DATA.length - 1) {
      setEligibilityStatus(true)
      setFeedback("feedback.eligible")
      return true
    }

    return false
  }

  const getSignInUrl = () => {
    const signInUrl = new URL(`${url}warm-welcome`)
    const dataToEncode = {
      ...answers,
      isEligible: true,
    }
    const encodedData = encodeURIComponent(JSON.stringify(dataToEncode))
    signInUrl.searchParams.set("eligibility", encodedData)
    return signInUrl.toString()
  }

  const handleNext = () => {
    const currentQuestion = ELIGIBILITY_QUESTIONS_DATA[currentQuestionIndex]
    const currentAnswer = answers[currentQuestion.id]

    if (!currentAnswer) {
      alert(t("alert.selectOption"))
      return
    }

    const selectedOption = currentQuestion.options.find(
      (opt) => opt.value === currentAnswer
    )

    if (selectedOption?.skipTo) {
      if (selectedOption.skipTo === "continue-step") {
        const newAnswers = { ...answers }
        ELIGIBILITY_QUESTIONS_DATA.slice(currentQuestionIndex + 1).forEach(
          (question) => {
            if (!newAnswers[question.id]) {
              newAnswers[question.id] = ""
            }
          }
        )
        setAnswers(newAnswers)
        localStorage.setItem("eligibility", JSON.stringify(newAnswers))

        setEligibilityStatus(true)
        setFeedback("feedback.eligible")
        return
      }

      const nextQuestionIndex = ELIGIBILITY_QUESTIONS_DATA.findIndex(
        (q) => q.id === selectedOption.skipTo
      )
      if (nextQuestionIndex !== -1) {
        const skippedQuestions = ELIGIBILITY_QUESTIONS_DATA.slice(
          currentQuestionIndex + 1,
          nextQuestionIndex
        )
        const newAnswers = { ...answers }
        skippedQuestions.forEach((question) => {
          newAnswers[question.id] = ""
        })
        setAnswers(newAnswers)
        localStorage.setItem("eligibility", JSON.stringify(newAnswers))
        setCurrentQuestionIndex(nextQuestionIndex)
        return
      }
    }

    const isComplete = checkEligibilityAndProceed(answers)

    if (
      !isComplete &&
      currentQuestionIndex < ELIGIBILITY_QUESTIONS_DATA.length - 1
    ) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      let prevQuestionIndex = currentQuestionIndex - 1
      while (
        prevQuestionIndex > 0 &&
        (!answers[ELIGIBILITY_QUESTIONS_DATA[prevQuestionIndex].id] ||
          answers[ELIGIBILITY_QUESTIONS_DATA[prevQuestionIndex].id] === "")
      ) {
        prevQuestionIndex--
      }
      setCurrentQuestionIndex(prevQuestionIndex)
      if (eligibilityStatus !== null) {
        setEligibilityStatus(null)
        setFeedback(null)
      }
    }
  }

  const handleConfirmIneligible = () => {
    if (pendingAnswer) {
      const newAnswers = {
        ...answers,
        [pendingAnswer.questionId]: pendingAnswer.value,
      }
      setAnswers(newAnswers)
      localStorage.setItem("eligibility", JSON.stringify(newAnswers))
      setShowConfirmDialog(false)
      setPendingAnswer(null)
      setEligibilityStatus(false)
      setFeedback("feedback.ineligibleConfirmed")
      setTimeout(() => setShowContactForm(true), 500)
    }
  }

  const handleContactInfoChange = (field: string, value: string) => {
    setContactInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handleContactSubmit = async () => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubmitSuccess(true)
    } catch (error) {
      console.error("Error submitting contact info:", error)
      alert(t("contactForm.error.message"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQuestionData = ELIGIBILITY_QUESTIONS_DATA[currentQuestionIndex]

  // Get translated suggested questions based on current section
  const getSuggestedQuestionsBySection = () => {
    if (currentQuestionData?.sectionKey === "section.eligibilityAndAge") {
      return [
        {
          id: "minimum-age",
          text: t(
            "sidebar.chatbot.eligibility.minimum_age",
            "What are the minimum age requirements?"
          ),
          category: "requirements",
          followUp: ["property-types", "valuation", "mortgage"],
        },
        {
          id: "property-types",
          text: t(
            "sidebar.chatbot.eligibility.property_types",
            "What types of properties are eligible?"
          ),
          category: "requirements",
          followUp: ["minimum-age", "process-time", "mortgage"],
        },
        {
          id: "valuation",
          text: t(
            "sidebar.chatbot.eligibility.valuation",
            "How is my property valued?"
          ),
          category: "requirements",
          followUp: ["property-types", "mortgage", "process-time"],
        },
        {
          id: "mortgage",
          text: t(
            "sidebar.chatbot.eligibility.mortgage",
            "What if I have an outstanding mortgage?"
          ),
          category: "requirements",
          followUp: ["minimum-age", "property-types", "process-time"],
        },
        {
          id: "viager-model",
          text: t(
            "sidebar.chatbot.eligibility.viager_model",
            "What is Srenova's viager programme?"
          ),
          category: "basics",
          followUp: ["property-types", "valuation", "mortgage"],
        },
        {
          id: "process-time",
          text: t(
            "sidebar.chatbot.eligibility.process_time",
            "How long does the process take?"
          ),
          category: "requirements",
          followUp: ["minimum-age", "property-types", "valuation"],
        },
      ]
    } else if (
      currentQuestionData?.sectionKey === "section.familyInvolvement"
    ) {
      return [
        {
          id: "inheritance",
          text: t(
            "sidebar.chatbot.family.inheritance",
            "How does this affect inheritance for my children?"
          ),
          category: "family",
          followUp: ["family-receive", "family-involvement", "family-siblings"],
        },
        {
          id: "family-receive",
          text: t(
            "sidebar.chatbot.family.family_receive",
            "Will my family receive anything from the sale later on?"
          ),
          category: "family",
          followUp: ["inheritance", "family-involvement", "family-siblings"],
        },
        {
          id: "family-involvement",
          text: t(
            "sidebar.chatbot.family.family_involvement",
            "Can family members be involved in the process?"
          ),
          category: "family",
          followUp: ["inheritance", "family-receive", "family-siblings"],
        },
        {
          id: "family-siblings",
          text: t(
            "sidebar.chatbot.family.family_siblings",
            "Can multiple siblings be listed as contacts?"
          ),
          category: "family",
          followUp: ["inheritance", "family-receive", "family-involvement"],
        },
        {
          id: "spouse-dies",
          text: t(
            "sidebar.chatbot.family.spouse_dies",
            "What happens if one spouse/partner dies?"
          ),
          category: "life-changes",
          followUp: ["family-receive", "family-involvement", "divorce"],
        },
        {
          id: "divorce",
          text: t(
            "sidebar.chatbot.family.divorce",
            "What happens if we separate or divorce?"
          ),
          category: "life-changes",
          followUp: ["spouse-dies", "family-receive", "family-involvement"],
        },
      ]
    } else if (currentQuestionData?.sectionKey === "section.adviceAndConsent") {
      return [
        {
          id: "tax-implications",
          text: t(
            "sidebar.chatbot.advice.tax_implications",
            "What tax implications should I consider?"
          ),
          category: "legal",
          followUp: [
            "benefits-eligibility",
            "legal-protections",
            "business-protection",
          ],
        },
        {
          id: "benefits-eligibility",
          text: t(
            "sidebar.chatbot.advice.benefits_eligibility",
            "Will this affect my eligibility for means-tested benefits?"
          ),
          category: "legal",
          followUp: ["tax-implications", "legal-protections", "buyer-defaults"],
        },
        {
          id: "legal-protections",
          text: t(
            "sidebar.chatbot.advice.legal_protections",
            "What legal protections do I have?"
          ),
          category: "legal",
          followUp: [
            "tax-implications",
            "benefits-eligibility",
            "business-protection",
          ],
        },
        {
          id: "business-protection",
          text: t(
            "sidebar.chatbot.advice.business_protection",
            "What happens if Srenova or the buyer goes out of business?"
          ),
          category: "legal",
          followUp: ["tax-implications", "legal-protections", "buyer-defaults"],
        },
        {
          id: "buyer-defaults",
          text: t(
            "sidebar.chatbot.advice.buyer_defaults",
            "What happens if the buyer defaults on payments?"
          ),
          category: "legal",
          followUp: [
            "business-protection",
            "tax-implications",
            "benefits-eligibility",
          ],
        },
        {
          id: "support-offered",
          text: t(
            "sidebar.chatbot.advice.support_offered",
            "What support does Srenova offer during the process?"
          ),
          category: "support",
          followUp: [
            "legal-protections",
            "benefits-eligibility",
            "tax-implications",
          ],
        },
      ]
    }
    // Default to eligibility questions
    return [
      {
        id: "minimum-age",
        text: t(
          "sidebar.chatbot.eligibility.minimum_age",
          "What are the minimum age requirements?"
        ),
        category: "requirements",
        followUp: ["property-types", "valuation", "mortgage"],
      },
      {
        id: "property-types",
        text: t(
          "sidebar.chatbot.eligibility.property_types",
          "What types of properties are eligible?"
        ),
        category: "requirements",
        followUp: ["minimum-age", "process-time", "mortgage"],
      },
      {
        id: "valuation",
        text: t(
          "sidebar.chatbot.eligibility.valuation",
          "How is my property valued?"
        ),
        category: "requirements",
        followUp: ["property-types", "mortgage", "process-time"],
      },
      {
        id: "mortgage",
        text: t(
          "sidebar.chatbot.eligibility.mortgage",
          "What if I have an outstanding mortgage?"
        ),
        category: "requirements",
        followUp: ["minimum-age", "property-types", "process-time"],
      },
      {
        id: "viager-model",
        text: t(
          "sidebar.chatbot.eligibility.viager_model",
          "What is Srenova's viager programme?"
        ),
        category: "basics",
        followUp: ["property-types", "valuation", "mortgage"],
      },
      {
        id: "process-time",
        text: t(
          "sidebar.chatbot.eligibility.process_time",
          "How long does the process take?"
        ),
        category: "requirements",
        followUp: ["minimum-age", "property-types", "valuation"],
      },
    ]
  }

  const currentSectionKey = currentQuestionData?.sectionKey

  const sections = ELIGIBILITY_QUESTIONS_DATA.reduce((acc, q) => {
    if (q.sectionKey && !acc.includes(q.sectionKey)) {
      acc.push(q.sectionKey)
    }
    return acc
  }, [] as string[])

  const progress =
    ((currentQuestionIndex + 1) / ELIGIBILITY_QUESTIONS_DATA.length) * 100

  return (
    <div className="px-3 py-4 sm:px-4 md:px-6 lg:px-20">
      {errorMessage && (
        <div className="mb-4 rounded-lg border border-red-300 bg-red-100 p-3 text-red-700 sm:mb-6 sm:p-4">
          <div className="flex items-center">
            <AlertTriangle className="mr-2 size-4 sm:size-5" />
            <Typography className="text-sm font-medium sm:text-base">
              {errorMessage}
            </Typography>
          </div>
        </div>
      )}

      <div className="mb-4 rounded-lg bg-gradient-to-r from-primary/10 to-transparent p-3 sm:mb-6 sm:p-4">
        <div className="flex flex-col flex-wrap items-start justify-between gap-2 sm:flex-row sm:items-center sm:gap-3">
          <div>
            <Typography
              className="text-lg text-primary sm:text-xl md:text-2xl"
              variant="h2"
            >
              {t("header.title")}
            </Typography>
            <Typography
              className="max-w-xl text-sm text-muted-foreground sm:text-base"
              variant="body"
            >
              {t("header.description")}
            </Typography>
          </div>
          <Button
            className="mt-2 w-full gap-2 text-xs sm:mt-0 sm:w-auto sm:text-sm"
            variant="outline"
          >
            <Phone className="size-3 sm:size-4" />
            {t("header.button")}
          </Button>
        </div>
      </div>

      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-muted sm:mb-6">
        <div
          className="h-2 rounded-full bg-primary transition-all duration-500 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {eligibilityStatus === null && sections.length > 0 && (
        <div className="mb-4 flex justify-between overflow-x-auto px-0 sm:mb-6 sm:px-2">
          {sections.map((sectionKey, index) => {
            const sectionQuestions = ELIGIBILITY_QUESTIONS_DATA.filter(
              (q) => q.sectionKey === sectionKey
            )
            const firstQuestionIndex = ELIGIBILITY_QUESTIONS_DATA.findIndex(
              (q) => q.sectionKey === sectionKey
            )
            const isActive = currentQuestionIndex >= firstQuestionIndex
            const isCompleted =
              currentQuestionIndex >
              firstQuestionIndex + sectionQuestions.length - 1

            return (
              <div
                key={sectionKey}
                className={`flex shrink-0 flex-col items-center px-2 sm:shrink sm:px-0 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`mb-1 flex size-5 items-center justify-center rounded-full border-2 text-xs sm:size-6 sm:text-sm
                    ${
                      isCompleted
                        ? "border-primary bg-primary text-white"
                        : isActive
                          ? "border-primary text-primary"
                          : "border-muted-foreground/30 text-muted-foreground/50"
                    }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="size-2 sm:size-3" />
                  ) : (
                    index + 1
                  )}
                </div>
                <Typography
                  variant="small"
                  className={`text-xs font-medium sm:text-sm ${
                    isActive ? "text-primary" : "text-muted-foreground/70"
                  }`}
                >
                  {t(sectionKey)}
                </Typography>
              </div>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-3">
        <Card className="p-3 sm:p-4 md:p-6 lg:col-span-2">
          {eligibilityStatus !== null ? (
            <div className="space-y-3 sm:space-y-4">
              <div className="results-container min-h-[200px] sm:min-h-[300px]">
                <div className="mb-3 flex items-center gap-2 sm:mb-4 sm:gap-3">
                  {eligibilityStatus ? (
                    <CheckCircle2 className="size-6 text-green-500 sm:size-8" />
                  ) : (
                    <Info className="size-6 text-amber-500 sm:size-8" />
                  )}
                  <Typography
                    className="text-lg font-semibold sm:text-xl"
                    variant="h2"
                  >
                    {eligibilityStatus
                      ? t("feedback.eligibleTitle")
                      : t("feedback.ineligibleTitle")}
                  </Typography>
                </div>

                <Card className="border-l-4 border-l-primary bg-muted/30 p-3 sm:p-4">
                  <Typography
                    className="text-sm text-muted-foreground sm:text-base"
                    variant="body"
                  >
                    {t(feedback || "")}
                  </Typography>
                </Card>
              </div>

              <div className="flex h-12 flex-wrap items-center justify-between gap-2 sm:h-14 sm:gap-0">
                <div className="flex gap-2">
                  <Button
                    className="h-9 min-w-[90px] text-xs sm:h-10 sm:min-w-[100px] sm:text-sm"
                    variant="outline"
                    onClick={() => {
                      localStorage.removeItem("eligibility")
                      setEligibilityStatus(null)
                      setCurrentQuestionIndex(0)
                      setAnswers({})
                      setFeedback(null)
                    }}
                  >
                    <ChevronLeft className="mr-1 size-3 sm:mr-2 sm:size-4" />
                    {t("button.startOver")}
                  </Button>

                  {!eligibilityStatus && (
                    <Button
                      className="h-9 min-w-[90px] text-xs sm:h-10 sm:min-w-[100px] sm:text-sm"
                      variant="outline"
                      onClick={() => {
                        setEligibilityStatus(null)
                        handleBack()
                      }}
                    >
                      {t("button.back")}
                    </Button>
                  )}
                </div>

                <div className="flex gap-2">
                  {eligibilityStatus ? (
                    <Link
                      className="inline-flex min-w-[120px] items-center justify-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:min-w-[140px] sm:gap-2 sm:px-4 sm:py-2 sm:text-sm"
                      href={getSignInUrl()}
                    >
                      {t("button.continue")}
                      <ChevronRight className="size-3 sm:size-4" />
                    </Link>
                  ) : (
                    <Button
                      className="h-9 min-w-[120px] text-xs sm:h-10 sm:min-w-[140px] sm:text-sm"
                      variant="default"
                      onClick={() => setShowContactForm(true)}
                    >
                      {t("button.stayInTouch")}
                      <ChevronRight className="ml-1 size-3 sm:ml-2 sm:size-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {currentSectionKey && (
                <div className="mb-2 sm:mb-3">
                  <div className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                    <Typography
                      className="text-xs font-medium sm:text-sm"
                      variant="small"
                    >
                      {t(currentSectionKey)}
                    </Typography>
                  </div>
                </div>
              )}

              <div className="question-container min-h-[220px] sm:min-h-[280px]">
                <div className="mb-3 flex flex-col items-start gap-3 sm:mb-4 sm:flex-row">
                  <div className="mt-1 flex h-6 shrink-0 items-center justify-center sm:h-8">
                    <div className="text-primary">
                      {currentQuestionData.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <Typography
                      className="text-lg font-semibold sm:text-xl"
                      variant="h4"
                    >
                      {t(currentQuestionData.questionKey)}
                    </Typography>
                    {currentQuestionData.descriptionKey && (
                      <Typography
                        className="text-sm text-muted-foreground sm:text-base"
                        variant="body"
                      >
                        {t(currentQuestionData.descriptionKey)}
                      </Typography>
                    )}
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 gap-2 sm:gap-3 md:grid-cols-2">
                    {currentQuestionData.options.map((option) => (
                      <div key={option.value} className="relative">
                        <input
                          className="peer sr-only"
                          id={`${currentQuestionData.id}-${option.value}`}
                          name={currentQuestionData.id}
                          type="radio"
                          value={option.value}
                          checked={
                            answers[currentQuestionData.id] === option.value
                          }
                          onChange={() =>
                            handleAnswerChange(
                              currentQuestionData.id,
                              option.value
                            )
                          }
                        />
                        <label
                          className="flex h-full cursor-pointer flex-col rounded-lg border bg-card p-2 transition-all hover:border-primary/30 hover:bg-muted peer-checked:border-primary peer-checked:bg-primary/10 sm:p-3"
                          htmlFor={`${currentQuestionData.id}-${option.value}`}
                        >
                          <span className="block text-base font-medium sm:text-lg">
                            {t(option.labelKey)}
                          </span>
                          {option.descriptionKey && (
                            <span className="block text-xs text-muted-foreground sm:text-sm">
                              {t(option.descriptionKey)}
                            </span>
                          )}
                        </label>
                        <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-300 peer-checked:opacity-100">
                          <CheckCircle2 className="size-3 text-primary sm:size-4" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mb-1 mt-3 sm:mb-2 sm:mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground sm:text-sm">
                      <span>
                        {t("progress.question", {
                          current: currentQuestionIndex + 1,
                          total: ELIGIBILITY_QUESTIONS_DATA.length,
                        })}
                      </span>
                      <span>
                        {t("progress.percent", {
                          percent: Math.round(progress),
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex h-12 items-center justify-between sm:h-14">
                <Button
                  className="h-9 min-w-[90px] text-xs sm:h-10 sm:min-w-[100px] sm:text-sm"
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                  onClick={handleBack}
                >
                  <ChevronLeft className="mr-1 size-3 sm:mr-2 sm:size-4" />
                  {t("button.back")}
                </Button>

                <Button
                  className="h-9 min-w-[90px] text-xs sm:h-10 sm:min-w-[100px] sm:text-sm"
                  disabled={!answers[currentQuestionData.id]}
                  variant="default"
                  onClick={handleNext}
                >
                  {t("button.next")}
                  <ChevronRight className="ml-1 size-3 sm:ml-2 sm:size-4" />
                </Button>
              </div>
            </>
          )}
        </Card>

        <div className="min-h-0 space-y-3 overflow-y-auto sm:space-y-4">
          {/* Add ChatBot component to the sidebar with translations */}
          <ChatBot
            key={currentSectionKey || "initial"}
            className="mb-4 sm:mb-6"
            suggestedQuestions={getSuggestedQuestionsBySection()}
            title={t("sidebar.chatbot.title", "Assistant")}
            header={
              <ChatHeader
                header={t("sidebar.chatbot.title", "Assistant")}
                image="/images/ellipse-2.svg"
              />
            }
            initialMessage={t(
              "sidebar.chatbot.welcome",
              "Hello! I'm here to help answer your questions about our viager programme. What would you like to know?"
            )}
          />

          <Card className="border-primary/20 p-3 sm:p-4">
            <Typography
              className="mb-2 text-sm text-primary sm:mb-3 sm:text-base"
              variant="h4"
            >
              {t("sidebar.criteria.title")}
            </Typography>
            <div className="space-y-1.5 sm:space-y-2">
              {ELIGIBILITY_CRITERIA.map((criteria) => (
                <div
                  key={criteria.key}
                  className="flex gap-1.5 rounded-md bg-muted/30 p-1.5 sm:gap-2 sm:p-2"
                >
                  <Shield className="mt-0.5 size-3.5 shrink-0 text-primary sm:size-4" />
                  <div>
                    <Typography
                      className="text-xs font-medium sm:text-sm"
                      variant="small"
                    >
                      {t(criteria.titleKey)}
                    </Typography>
                    <Typography
                      className="text-xs text-muted-foreground sm:text-sm"
                      variant="body"
                    >
                      {t(criteria.descriptionKey)}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-muted/10 p-3 sm:p-4">
            <Typography
              className="mb-1.5 text-sm text-primary sm:mb-2 sm:text-base"
              variant="h4"
            >
              {t("sidebar.privacy.title")}
            </Typography>
            <Typography
              className="mb-1.5 text-xs text-muted-foreground sm:mb-2 sm:text-sm"
              variant="body"
            >
              {t("sidebar.privacy.description")}
            </Typography>
            <div className="flex items-center rounded-md bg-muted/30 p-1.5 text-xs text-muted-foreground sm:p-2 sm:text-sm">
              <Shield className="mr-1 size-3 text-primary" />
              <span>{t("sidebar.privacy.secureNote")}</span>
            </div>
          </Card>

          <Card className="border-primary/20 bg-primary/5 p-3 sm:p-4">
            <Typography
              className="mb-1.5 text-sm text-primary sm:mb-2 sm:text-base"
              variant="h4"
            >
              {t("sidebar.help.title")}
            </Typography>
            <Typography
              className="mb-2 text-xs text-muted-foreground sm:mb-3 sm:text-sm"
              variant="body"
            >
              {t("sidebar.help.description")}
            </Typography>
            <Button
              className="h-7 w-full gap-1 py-0.5 text-xs sm:h-8 sm:gap-2 sm:py-1 sm:text-sm"
              variant="outline"
            >
              <Phone className="size-3" />
              {t("sidebar.help.button")}
            </Button>
          </Card>
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent
          className="max-w-[90%] p-4 sm:max-w-md sm:p-6"
          style={{ marginRight: 0 }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-1.5 text-base sm:gap-2 sm:text-lg">
              <span className="flex items-center gap-1.5 sm:gap-2">
                <AlertTriangle className="size-4 text-amber-500 sm:size-5" />
                {t("confirmDialog.title")}
              </span>
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {t("confirmDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md bg-muted/30 p-3 text-sm sm:p-4 sm:text-base">
            {pendingAnswer?.questionId === "country" &&
              t("confirmDialog.content.country")}
            {pendingAnswer?.questionId === "property-ownership" &&
              t("confirmDialog.content.ownership")}
            {pendingAnswer?.questionId === "age" &&
              pendingAnswer.value === "under-60" &&
              t("confirmDialog.content.ageUnder60")}
            {pendingAnswer?.questionId === "age" &&
              pendingAnswer.value === "75+" &&
              t("confirmDialog.content.age75plus")}
            {pendingAnswer?.questionId === "spouse-age" &&
              t("confirmDialog.content.spouseAge")}
            {pendingAnswer?.questionId === "inheritance-importance" &&
              pendingAnswer.value === "top-priority" &&
              t("confirmDialog.content.inheritanceTopPriority")}
            {pendingAnswer?.questionId === "discuss-options" &&
              pendingAnswer.value === "no" &&
              t("confirmDialog.content.discussOptionsNo")}
          </div>
          <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
            <Button
              className="h-8 min-w-[90px] text-xs sm:h-10 sm:min-w-[100px] sm:text-sm"
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              {t("button.goBack")}
            </Button>
            <Button
              className="h-8 min-w-[90px] text-xs sm:h-10 sm:min-w-[100px] sm:text-sm"
              variant="default"
              onClick={handleConfirmIneligible}
            >
              {t("button.continueAnyway")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
        <DialogContent
          className="max-w-[95%] p-3 sm:max-w-2xl sm:p-4"
          style={{ marginRight: 0, marginTop: 12 }}
        >
          <DialogHeader className="space-y-1 sm:space-y-2">
            <DialogTitle className="flex items-center gap-1.5 text-base sm:gap-2 sm:text-lg">
              {submitSuccess ? (
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <CheckCircle2 className="size-4 text-green-500 sm:size-5" />
                  {t("contactForm.success.title")}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 sm:gap-2">
                  <Mail className="size-4 text-primary sm:size-5" />
                  {t("contactForm.title")}
                </span>
              )}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm">
              {submitSuccess
                ? t("contactForm.success.description")
                : t("contactForm.description")}
            </DialogDescription>
          </DialogHeader>

          {!submitSuccess ? (
            <div className="flex flex-col gap-2.5 sm:gap-4">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                <div className="grid gap-1 sm:gap-1.5">
                  <Label className="text-xs sm:text-sm" htmlFor="name">
                    {t("contactForm.label.name")}
                  </Label>
                  <Input
                    className="h-7 text-xs sm:h-8 sm:text-sm"
                    id="name"
                    placeholder={t("contactForm.placeholder.name")}
                    value={contactInfo.name}
                    onChange={(e) =>
                      handleContactInfoChange("name", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-1 sm:gap-1.5">
                  <Label className="text-xs sm:text-sm" htmlFor="email">
                    {t("contactForm.label.email")}
                  </Label>
                  <Input
                    className="h-7 text-xs sm:h-8 sm:text-sm"
                    id="email"
                    placeholder={t("contactForm.placeholder.email")}
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) =>
                      handleContactInfoChange("email", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid gap-1 sm:gap-1.5">
                <Label className="text-xs sm:text-sm" htmlFor="phone">
                  {t("contactForm.label.phone")}
                </Label>
                <Input
                  className="h-7 text-xs sm:h-8 sm:text-sm"
                  id="phone"
                  placeholder={t("contactForm.placeholder.phone")}
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) =>
                    handleContactInfoChange("phone", e.target.value)
                  }
                />
              </div>

              <div className="grid gap-1 sm:gap-1.5">
                <Label className="text-xs sm:text-sm" htmlFor="message">
                  {t("contactForm.label.message")}
                </Label>
                <Textarea
                  className="h-16 resize-none text-xs sm:h-20 sm:text-sm"
                  id="message"
                  placeholder={t("contactForm.placeholder.message")}
                  value={contactInfo.message}
                  onChange={(e) =>
                    handleContactInfoChange("message", e.target.value)
                  }
                />
              </div>

              <div className="rounded-md bg-muted/30 p-1.5 text-xs sm:p-2 sm:text-sm">
                <p>{t("contactForm.privacyNote")}</p>
              </div>

              <DialogFooter className="flex-row justify-between gap-2 sm:justify-between">
                <Button
                  className="h-7 min-w-[80px] text-xs sm:h-8 sm:min-w-[100px] sm:text-sm"
                  variant="outline"
                  onClick={() => setShowContactForm(false)}
                >
                  {t("button.cancel")}
                </Button>
                <Button
                  className="h-7 min-w-[80px] text-xs sm:h-8 sm:min-w-[100px] sm:text-sm"
                  variant="default"
                  disabled={
                    isSubmitting || !contactInfo.name || !contactInfo.email
                  }
                  onClick={handleContactSubmit}
                >
                  {isSubmitting
                    ? t("contactForm.button.submitting")
                    : t("contactForm.button.submit")}
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="flex flex-col items-center py-3 sm:py-4">
              <CheckCircle2 className="mb-2 size-10 text-green-500 sm:mb-3 sm:size-12" />
              <p className="text-center text-xs text-muted-foreground sm:text-sm">
                {t("contactForm.success.message")}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
