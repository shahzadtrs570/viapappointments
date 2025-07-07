import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import { Input } from "@package/ui/input"

import { useStepOneOnboarding } from "../../_hooks/useStepOneOnboarding"
import { MultiStepLayout } from "../MultiStepLayout/MultiStepLayout"
import { StepLayout } from "../StepLayout/StepLayout"

export function StepOne() {
  const { form, onSubmit } = useStepOneOnboarding()

  return (
    <StepLayout handleSubmit={form.handleSubmit((values) => onSubmit(values))}>
      <MultiStepLayout title="What's your name?">
        <Form {...form}>
          <form
            className="w-full space-y-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </MultiStepLayout>
    </StepLayout>
  )
}
