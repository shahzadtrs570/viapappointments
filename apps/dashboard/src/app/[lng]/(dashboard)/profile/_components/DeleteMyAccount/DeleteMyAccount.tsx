"use client"

import { useState } from "react"

import { Button } from "@package/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"

import { useClientTranslation } from "@/lib/i18n/I18nProvider"

import { DeleteMyAccountDialog } from "../DeleteMyAccountDialog/DeleteMyAccountDialog"

export function DeleteMyAccount() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { t } = useClientTranslation("profile")

  return (
    <section>
      <Card>
        <CardHeader>
          <CardTitle>{t("deleteAccount.title")}</CardTitle>
          <CardDescription>{t("deleteAccount.description")}</CardDescription>
        </CardHeader>
        <CardFooter className="border-t px-6 py-4">
          <Button variant="destructive" onClick={() => setIsDialogOpen(true)}>
            {t("deleteAccount.button")}
          </Button>
        </CardFooter>
      </Card>

      <DeleteMyAccountDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
    </section>
  )
}
