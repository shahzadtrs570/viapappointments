"use client"

import { Button } from "@package/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import { Input } from "@package/ui/input"

import { useAuth } from "@/hooks/useAuth"
// import { useTranslation } from "@/lib/i18n"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

import { useChangeName } from "../../_hooks/useChangeName"

export function ChangeName() {
  const { userQuery } = useAuth()
  const { form, onChangeName, changeNameMutation } = useChangeName()
  const { t } = useClientTranslation("profile")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("changeName.title")}</CardTitle>
        <CardDescription>{t("changeName.description")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="w-full space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("changeName.label")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={userQuery.isPending}
                      placeholder={t("changeName.placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button
          disabled={changeNameMutation.isPending}
          isLoading={changeNameMutation.isPending}
          onClick={form.handleSubmit(onChangeName)}
        >
          {t("changeName.button")}
        </Button>
      </CardFooter>
    </Card>
  )
}
