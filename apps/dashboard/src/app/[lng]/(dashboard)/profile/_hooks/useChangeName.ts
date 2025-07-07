"use client"

import { useCallback, useEffect } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@package/ui/toast"
import { nameSchema } from "@package/validations"
import { useForm } from "react-hook-form"

import type { Name } from "@package/validations"

import { useAuth } from "@/hooks/useAuth"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import { api } from "@/lib/trpc/react"

export function useChangeName() {
  const { userQuery } = useAuth()
  const { toast } = useToast()
  const utils = api.useUtils()
  const { t } = useClientTranslation("profile")

  const form = useForm<Name>({
    resolver: zodResolver(nameSchema),
    defaultValues: {
      name: userQuery.data?.name || "",
    },
  })

  useEffect(() => {
    if (userQuery.isSuccess) {
      form.setValue("name", userQuery.data?.name || "")
    }
  }, [form, userQuery.data?.name, userQuery.isSuccess])

  const changeNameMutation = api.user.changeName.useMutation({
    onSuccess: async () => {
      form.reset()
      await utils.user.getMe.invalidate()
      toast({
        variant: "success",
        title: t("changeNameHook.successTitle"),
        description: t("changeNameHook.successDescription"),
      })
    },
  })

  const onChangeName = useCallback(
    async (values: Name) => {
      if (userQuery.data?.id) {
        await changeNameMutation.mutateAsync({
          ...values,
        })
      }
    },
    [changeNameMutation, userQuery.data?.id]
  )

  return { form, onChangeName, changeNameMutation }
}
