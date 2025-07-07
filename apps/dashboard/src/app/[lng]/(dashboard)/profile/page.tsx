/* eslint-disable */
import { Typography } from "@package/ui/typography"
import { useTranslation } from "@/lib/i18n"

import type { Metadata } from "next"

import { ChangeName } from "./_components/ChangeName/ChangeName"
import { DeleteMyAccount } from "./_components/DeleteMyAccount/DeleteMyAccount"

export async function generateMetadata({
  params: { lng },
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, "profile")
  return {
    title: t("metadata_title"),
    description: t("metadata_description"),
  }
}

export default async function ProfilePage({
  params: { lng },
}: {
  params: { lng: string }
}) {
  const { t } = await useTranslation(lng, "profile")
  return (
    <section className="flex flex-col gap-4">
      <Typography className="mb-4" variant="h1">
        {t("heading")}
      </Typography>
      <ChangeName />
      <DeleteMyAccount />
    </section>
  )
}
