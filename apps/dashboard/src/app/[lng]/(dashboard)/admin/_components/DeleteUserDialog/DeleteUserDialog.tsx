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

import type { BanUserDialogProps } from "../../_types"

import { useDeleteUser } from "../../_hooks/useDeleteUser"

type DeleteUserDialogProps = Omit<BanUserDialogProps, "form">

export function DeleteUserDialog({
  userId,
  userEmail,
  isDialogOpen,
  setIsDialogOpen,
}: DeleteUserDialogProps) {
  const { form, onSubmit, deleteUserMutation } = useDeleteUser({
    userId,
    userEmail,
    setIsDialogOpen,
  })

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Permanently delete{" "}
            <strong className="font-extrabold">{userEmail}</strong>&apos;s
            account, and all their related data. This action can&apos;t be
            undone, and you won&apos;t be able to recover any data. Please
            proceed with caution.
          </DialogDescription>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      To confirm, please enter the user&apos;s email.
                    </FormLabel>
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
                  Confirm delete account
                </Button>
              </section>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
