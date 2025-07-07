import { Button } from "@package/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@package/ui/dialog"
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
import { useClientTranslation } from "@/lib/i18n/I18nProvider"

import { useDeleteMyAccount } from "../../_hooks/useDeleteMyAccount"

type DeleteUserDialogProps = {
  isDialogOpen: boolean
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function DeleteMyAccountDialog({
  isDialogOpen,
  setIsDialogOpen,
}: DeleteUserDialogProps) {
  const { user } = useAuth()
  const userEmail = user?.email || ""
  const { form, onSubmit, deleteUserMutation } = useDeleteMyAccount({
    userEmail,
  })
  const { t } = useClientTranslation("profile")

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("deleteAccount.title")}</DialogTitle>
          <DialogDescription>
            {t("deleteAccountDialog.description")}
          </DialogDescription>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("deleteAccountDialog.formLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={deleteUserMutation.isPending}
                        placeholder={userEmail}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <section className="flex items-center justify-end gap-2">
                <Button
                  isLoading={deleteUserMutation.isPending}
                  type="submit"
                  variant="destructive"
                  disabled={
                    deleteUserMutation.isPending || !form.formState.isValid
                  }
                >
                  {t("deleteAccountDialog.confirmButton")}
                </Button>
              </section>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
