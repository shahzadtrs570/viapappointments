/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Input } from "@package/ui/input"
import { Button } from "@package/ui/button"
import { Textarea } from "@package/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { Slider } from "@package/ui/slider"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@package/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// eslint-disable-next-line no-console
const buyBoxSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  propertyTypes: z
    .array(z.string())
    .min(1, "Select at least one property type"),
  locations: z.array(z.string()).min(1, "Select at least one location"),
  minBedrooms: z.string().min(1, "Select minimum bedrooms"),
  priceRange: z.array(z.number()).length(2, "Price range is required"),
  initialInvestmentAmount: z
    .number()
    .min(1, "Initial investment amount is required"),
  estimatedMonthlyIncome: z
    .number()
    .min(1, "Estimated monthly income is required"),
  averageIndexationRate: z.number().min(0, "Indexation rate must be positive"),
})

export default function CreateBuyBoxPage() {
  const router = useRouter()
  const [priceRange, setPriceRange] = useState([0, 1000000])

  const form = useForm<z.infer<typeof buyBoxSchema>>({
    resolver: zodResolver(buyBoxSchema),
    defaultValues: {
      name: "",
      description: "",
      propertyTypes: [],
      locations: [],
      minBedrooms: "",
      priceRange: [0, 1000000],
      initialInvestmentAmount: 0,
      estimatedMonthlyIncome: 0,
      averageIndexationRate: 0,
    },
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const onSubmit = () => {
    // In a real app, this would make an API call to create the buy box
    router.push("/fund-buyer/buy-boxes")
  }

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/fund-buyer/buy-boxes">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Create Buy Box</h1>
          <p className="text-muted-foreground">
            Define your investment criteria for property matching.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Buy Box Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter a name for this buy box"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your investment criteria..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Property Criteria</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="propertyTypes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Types</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.[0]}
                        onValueChange={(value) => field.onChange([value])}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HOUSE">House</SelectItem>
                          <SelectItem value="APARTMENT">Apartment</SelectItem>
                          <SelectItem value="BUNGALOW">Bungalow</SelectItem>
                          <SelectItem value="VILLA">Villa</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locations</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value?.[0]}
                        onValueChange={(value) => field.onChange([value])}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LONDON">London</SelectItem>
                          <SelectItem value="MANCHESTER">Manchester</SelectItem>
                          <SelectItem value="BIRMINGHAM">Birmingham</SelectItem>
                          <SelectItem value="LEEDS">Leeds</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minBedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Bedrooms</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select minimum bedrooms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1+</SelectItem>
                          <SelectItem value="2">2+</SelectItem>
                          <SelectItem value="3">3+</SelectItem>
                          <SelectItem value="4">4+</SelectItem>
                          <SelectItem value="5">5+</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Range</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Slider
                          min={0}
                          max={1000000}
                          step={50000}
                          value={priceRange}
                          onValueChange={(value) => {
                            setPriceRange(value)
                            field.onChange(value)
                          }}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{formatCurrency(priceRange[0])}</span>
                          <span>{formatCurrency(priceRange[1])}</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="initialInvestmentAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Investment Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedMonthlyIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Monthly Income</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter amount"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="averageIndexationRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Indexation Rate (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter percentage"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/fund-buyer/buy-boxes">Cancel</Link>
            </Button>
            <Button type="submit">Create Buy Box</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
