import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from "@react-email/components"

import { createTranslator } from "../utils"
import Footer from "./components/footer"

interface PropertyStatusUpdateEmailProps {
  propertyAddress: string
  referenceNumber: string
  currentStage: string
  statusMessage: string
  requiredActions?: Array<{
    description: string
    urgency: string
    dueDate?: string
  }>
  dashboardUrl?: string
  cookieString?: string // Optional - will be auto-detected if not provided
}

export default function PropertyStatusUpdateEmail({
  propertyAddress,
  referenceNumber,
  currentStage,
  statusMessage,
  requiredActions = [],
  dashboardUrl = process.env.NEXT_PUBLIC_APP_URL,
  cookieString, // Will be automatically detected if not provided
}: PropertyStatusUpdateEmailProps) {
  // Create translator for this template
  const t = createTranslator("property-status-update", cookieString)

  return (
    <Html>
      <Head />
      <Preview>{t("preview", { currentStage })}</Preview>
      <Tailwind>
        <Body className="m-auto bg-white font-sans">
          <Container className="my-10 flex max-w-[500px] flex-col rounded border border-solid border-gray-200 px-10 py-5">
            <Text className="text-2xl font-extrabold">{t("title")}</Text>

            <Text className="text-sm leading-6 text-black">
              {t("updateIntro")}
            </Text>

            <div className="my-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <Text className="mb-1 font-medium text-gray-800">
                {propertyAddress}
              </Text>
              <Text className="text-sm text-gray-600">
                Reference: {referenceNumber}
              </Text>
            </div>

            <Text className="font-medium text-gray-800">
              {t("currentStage", { currentStage })}
            </Text>

            <Text className="mb-4 text-sm leading-6 text-black">
              {statusMessage}
            </Text>

            {requiredActions.length > 0 && (
              <>
                <Text className="font-medium text-gray-800">
                  {t("requiredActions")}
                </Text>
                {requiredActions.map((action, index) => (
                  <div
                    key={index}
                    className="mb-4 rounded-lg border border-gray-200 p-4"
                  >
                    <Text className="mb-1 text-sm text-gray-800">
                      {action.description}
                    </Text>
                    {action.dueDate && (
                      <Text className="text-xs text-gray-600">
                        {t("dueBy", {
                          date: new Date(action.dueDate).toLocaleDateString(),
                        })}
                      </Text>
                    )}
                    {action.urgency === "HIGH" && (
                      <Text className="mt-2 text-xs font-medium text-red-600">
                        {t("urgentAction")}
                      </Text>
                    )}
                  </div>
                ))}
              </>
            )}

            <Link
              className="mt-4 inline-block cursor-pointer rounded bg-green-600 px-4 py-2 text-center text-white"
              href={dashboardUrl}
            >
              {t("viewInDashboard")}
            </Link>

            <Text className="mt-4 text-sm leading-6 text-black">
              {t("questions")}
            </Text>

            <Text className="text-sm font-light leading-6 text-gray-400">
              {t("signature")}
            </Text>

            <Footer email="" />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
