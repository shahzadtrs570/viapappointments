/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react/jsx-max-depth */
"use client"

import { Button } from "@package/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import { Input } from "@package/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { Spinner } from "@package/ui/spinner"
import { Typography } from "@package/ui/typography"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { api } from "@/lib/trpc/react"

import { useCreateOffer } from "../../_hooks/useCreateOfferPage"

type PageProps = {
  params: {
    propertyId: string
  }
}

export default function CreateOfferPage({ params }: PageProps) {
  const { propertyId } = params
  const { form, onSubmit, sellerProfilesQuery, createOfferMutation } =
    useCreateOffer({
      propertyId,
    })

  const propertyQuery = api.admin.properties.getById.useQuery({
    propertyId,
  })

  if (propertyQuery.isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (!propertyQuery.data) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Typography>Property not found.</Typography>
      </div>
    )
  }

  return (
    <section className="mx-auto w-full py-2">
      <div className="mb-6 flex items-center gap-2">
        <Button asChild size="icon" variant="outline">
          <Link href={`/admin/properties/${propertyId}`}>
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <Typography variant="h1">Create Offer</Typography>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Property: {propertyQuery.data.address?.streetLine1}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="sellerProfileId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seller</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a seller" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sellerProfilesQuery?.data?.map((seller) => (
                          <SelectItem key={seller.id} value={seller.id}>
                            {seller.firstName} {seller.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="initialPaymentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Payment Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monthlyPaymentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Payment Amount</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="indexationRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Indexation Rate (%)</FormLabel>
                    <FormControl>
                      <Input placeholder="0.00" type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agreementType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agreement Type</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select agreement type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="STANDARD">Standard</SelectItem>
                        <SelectItem value="CUSTOM">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="occupancyRight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupancy Right</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select occupancy right" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FULL">Full</SelectItem>
                        <SelectItem value="PARTIAL">Partial</SelectItem>
                        <SelectItem value="NONE">None</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between pt-4">
                <Button asChild variant="outline">
                  <Link href={`/admin/properties/${propertyId}`}>Cancel</Link>
                </Button>
                <Button disabled={createOfferMutation.isPending} type="submit">
                  {createOfferMutation.isPending ? (
                    <>
                      <Spinner className="mr-2 size-4" />
                      Creating...
                    </>
                  ) : (
                    "Create Offer"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  )
}
