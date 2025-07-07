"use client"

import { useCallback, useMemo } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@package/ui/toast"
import { signOut } from "next-auth/react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import { api } from "@/lib/trpc/react"

type UseDeleteUserProps = {
  userEmail: string
}

export function useDeleteMyAccount({ userEmail }: UseDeleteUserProps) {
  const { toast } = useToast()
  const { t } = useClientTranslation("profile")

  const deleteUserMutation = api.user.deleteMe.useMutation({
    onSuccess: async () => {
      toast({
        description: t("deleteAccountHook.successDescription"),
        variant: "success",
        title: t("deleteAccountHook.successTitle"),
      })
      await new Promise((resolve) => setTimeout(resolve, 3000))
      await signOut({ redirect: true, callbackUrl: "/" })
    },
  })

  const deleteAccountSchema = useMemo(
    () =>
      z.object({
        email: z
          .string()
          .min(1, t("deleteAccountHook.emailRequired"))
          .refine(
            (value) => value === userEmail,
            "Email must match your account email"
          ),
      }),
    [userEmail]
  )

  const form = useForm<z.infer<typeof deleteAccountSchema>>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = useCallback(async () => {
    await deleteUserMutation.mutateAsync()
  }, [deleteUserMutation])

  return { form, onSubmit, deleteUserMutation }
}
