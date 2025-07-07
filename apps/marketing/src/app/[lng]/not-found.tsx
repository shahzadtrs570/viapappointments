/* eslint-disable @typescript-eslint/no-unused-vars, react-hooks/rules-of-hooks */
import { Button } from "@package/ui/button"
import { Container } from "@package/ui/container"
import { Typography } from "@package/ui/typography"
import Link from "next/link"

import type { Metadata } from "next"

import { useTranslation } from "@/lib/i18n"
import { fallbackLng } from "@/lib/i18n/settings"

type Props = {
  params?: { lng?: string }
}

export async function generateMetadata({
  params = {},
}: Props): Promise<Metadata> {
  const lng = params.lng || fallbackLng
  const { t } = await useTranslation(lng, "common")

  return {
    title: t("not_found.title", "Page Not Found"),
    description: t(
      "not_found.description",
      "The page you're looking for doesn't exist."
    ),
  }
}

export default async function NotFound({ params = {} }: Props) {
  const lng = params.lng || fallbackLng
  const { t } = await useTranslation(lng, "common")

  return (
    <Container className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center space-y-4">
      <div className="text-center">
        <Typography className="text-center" variant="h1">
          {t("not_found.heading", "404 - Page Not Found")}
        </Typography>
        <Typography className="mt-2" variant="lead">
          {t(
            "not_found.message",
            "Sorry, we couldn't find the page you're looking for."
          )}
        </Typography>
      </div>
      <div className="flex gap-4">
        <Button asChild>
          <Link href={`/${lng}`}>
            {t("not_found.home_button", "Go to Homepage")}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={`/${lng}/contact`}>
            {t("not_found.contact_button", "Contact Support")}
          </Link>
        </Button>
      </div>
    </Container>
  )
}
