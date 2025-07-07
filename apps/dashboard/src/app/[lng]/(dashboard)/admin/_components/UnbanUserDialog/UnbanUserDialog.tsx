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
import { Textarea } from "@package/ui/textarea"

import type { BanUserDialogProps } from "../../_types"
import type { BanSchema } from "@package/validations"

import { useUnbanUser } from "../../_hooks/useUnbanUser"

export function UnbanUserDialog({
  form,
  userId,
  userEmail,
  isDialogOpen,
  setIsDialogOpen,
}: BanUserDialogProps) {
  const unbanUserMutation = useUnbanUser()

  async function onSubmit(values: BanSchema) {
    await unbanUserMutation.mutateAsync(
      {
        reason: values.reason,
        userId,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false)
          form.reset()
        },
      }
    )
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unban User</DialogTitle>
          <DialogDescription>
            This will unban {userEmail} from the platform and restore their
            access.
          </DialogDescription>
          <Form {...form}>
            <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter a reason for unbanning this user"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <section className="flex items-center justify-end gap-2">
                <Button
                  disabled={unbanUserMutation.isPending}
                  isLoading={unbanUserMutation.isPending}
                  type="submit"
                >
                  Unban User
                </Button>
              </section>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
