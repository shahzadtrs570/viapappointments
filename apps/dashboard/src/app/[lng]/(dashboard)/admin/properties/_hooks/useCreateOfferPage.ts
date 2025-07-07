import { useCallback } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useToast } from "@package/ui/toast"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { api } from "@/lib/trpc/react"

type UseCreateOfferProps = {
  propertyId: string
}

const createOfferSchema = z.object({
  sellerProfileId: z.string().min(1, "Seller is required"),
  initialPaymentAmount: z
    .number()
    .min(0, "Initial payment must be 0 or greater"),
  monthlyPaymentAmount: z
    .number()
    .min(0, "Monthly payment must be 0 or greater"),
  indexationRate: z.number().min(0, "Indexation rate must be 0 or greater"),
  agreementType: z.enum(["STANDARD", "CUSTOM"]),
  occupancyRight: z.enum(["FULL", "PARTIAL", "NONE"]),
})

export type CreateOfferFormValues = z.infer<typeof createOfferSchema>

export function useCreateOffer({ propertyId }: UseCreateOfferProps) {
  const router = useRouter()
  const utils = api.useUtils()
  const { toast } = useToast()

  const sellerProfilesQuery = api.admin.sellerProfiles.list.useQuery({
    limit: 100,
  })

  const form = useForm<CreateOfferFormValues>({
    resolver: zodResolver(createOfferSchema),
    defaultValues: {
      sellerProfileId: "",
      initialPaymentAmount: 0,
      monthlyPaymentAmount: 0,
      indexationRate: 0,
      agreementType: "STANDARD",
      occupancyRight: "FULL",
    },
  })

  const createOfferMutation = api.admin.offers.create.useMutation({
    onSuccess: async () => {
      await utils.admin.properties.getById.invalidate({ propertyId })
      toast({
        description: "Offer created successfully",
        variant: "success",
        title: "Success",
      })
    },
  })

  const onSubmit = useCallback(
    async (values: CreateOfferFormValues) => {
      await createOfferMutation.mutateAsync(
        {
          ...values,
          propertyId,
        },
        {
          onSuccess: () => {
            router.push(`/admin/properties/${propertyId}`)
            form.reset()
          },
        }
      )
    },
    [createOfferMutation, form, propertyId, router]
  )

  return {
    form,
    onSubmit,
    sellerProfilesQuery,
    createOfferMutation,
  }
}
