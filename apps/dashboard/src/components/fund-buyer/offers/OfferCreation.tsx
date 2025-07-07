/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable import/no-default-export*/
/*eslint-disable no-nested-ternary*/
/*eslint-disable @typescript-eslint/no-unused-vars*/
"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { Button } from "@package/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { Label } from "@package/ui/label"
import { Input } from "@package/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { RadioGroup, RadioGroupItem } from "@package/ui/radio-group"
import { Slider } from "@package/ui/slider"
import { Switch } from "@package/ui/switch"
import {
  CalculatorIcon,
  CheckCircle2,
  HomeIcon,
  PackageIcon,
  SendIcon,
} from "lucide-react"
import { mockProperties, mockBuyBoxes } from "@/mock-data"
import { AgreementType, OccupancyRight } from "@/mock-data/types"

// Helper functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value)
}

// Helper function to get property IDs for a buy box
const getBuyBoxProperties = (buyBoxId: string) => {
  // The actual implementation would use the mock data for BuyBoxProperty
  // For now, we'll return a mock list of property IDs
  return mockProperties.slice(0, 3).map((p) => p.id)
}

export default function OfferCreation() {
  // State for selected property/buybox
  const [selectedPropertyId, setSelectedPropertyId] = useState("")
  const [selectedBuyBoxId, setSelectedBuyBoxId] = useState("")

  // State for offer details
  const [offerType, setOfferType] = useState<"property" | "buybox">("property")
  const [initialPayment, setInitialPayment] = useState(100000)
  const [monthlyPayment, setMonthlyPayment] = useState(1000)
  const [indexationRate, setIndexationRate] = useState(2)
  const [agreementType, setAgreementType] = useState<AgreementType>(
    AgreementType.STANDARD
  )
  const [occupancyRight, setOccupancyRight] = useState<OccupancyRight>(
    OccupancyRight.FULL
  )
  const [includeMaintenanceFund, setIncludeMaintenanceFund] = useState(true)

  // Get selected property and buy box
  const selectedProperty = mockProperties.find(
    (p) => p.id === selectedPropertyId
  )
  const selectedBuyBox = mockBuyBoxes.find((b) => b.id === selectedBuyBoxId)

  // Get property IDs for selected buy box
  const propertyIds = selectedBuyBox
    ? getBuyBoxProperties(selectedBuyBox.id)
    : []

  // Calculate percentages for property offer
  const propertyPercentage = selectedProperty
    ? Math.round((initialPayment / selectedProperty.estimatedValue) * 100)
    : 0

  // Calculate percentages for buy box offer
  const buyBoxTotalValue = selectedBuyBox
    ? propertyIds.reduce((sum: number, propertyId: string) => {
        const property = mockProperties.find((p) => p.id === propertyId)
        return sum + (property?.estimatedValue || 0)
      }, 0)
    : 0

  const buyBoxPercentage = buyBoxTotalValue
    ? Math.round((initialPayment / buyBoxTotalValue) * 100)
    : 0

  const handleSubmitOffer = () => {
    // In a real application, this would call the API to create an offer
    alert(
      `Offer has been submitted for ${offerType === "property" ? "property" : "buy box"}`
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Offer</CardTitle>
          <CardDescription>
            Create an offer for a property or Buy Box portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="property"
            className="w-full"
            onValueChange={(value: string) =>
              setOfferType(value as "property" | "buybox")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="property" className="flex items-center">
                <HomeIcon className="mr-2 size-4" />
                Individual Property
              </TabsTrigger>
              <TabsTrigger value="buybox" className="flex items-center">
                <PackageIcon className="mr-2 size-4" />
                Buy Box Portfolio
              </TabsTrigger>
            </TabsList>

            <TabsContent value="property" className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="property-select">Select Property</Label>
                <Select
                  value={selectedPropertyId}
                  onValueChange={setSelectedPropertyId}
                >
                  <SelectTrigger id="property-select">
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockProperties.map((property) => (
                      <SelectItem key={property.id} value={property.id}>
                        {property.address.streetLine1}, {property.address.city}{" "}
                        - {formatCurrency(property.estimatedValue)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedProperty && (
                <div className="space-y-2 rounded-lg border bg-muted/10 p-4">
                  <div className="font-medium">Selected Property:</div>
                  <div>
                    {selectedProperty.address.streetLine1},{" "}
                    {selectedProperty.address.city}
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Value:</span>
                    <span className="font-medium">
                      {formatCurrency(selectedProperty.estimatedValue)}
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="buybox" className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="buybox-select">Select Buy Box</Label>
                <Select
                  value={selectedBuyBoxId}
                  onValueChange={setSelectedBuyBoxId}
                >
                  <SelectTrigger id="buybox-select">
                    <SelectValue placeholder="Select a Buy Box" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBuyBoxes.map((buyBox) => (
                      <SelectItem key={buyBox.id} value={buyBox.id}>
                        {buyBox.name} - {getBuyBoxProperties(buyBox.id).length}{" "}
                        properties
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedBuyBox && (
                <div className="space-y-2 rounded-lg border bg-muted/10 p-4">
                  <div className="font-medium">Selected Buy Box:</div>
                  <div>{selectedBuyBox.name}</div>
                  <div className="flex justify-between">
                    <span>Number of Properties:</span>
                    <span className="font-medium">{propertyIds.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Value:</span>
                    <span className="font-medium">
                      {formatCurrency(buyBoxTotalValue)}
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-8 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Offer Details</h3>

              <div className="space-y-2">
                <Label htmlFor="initial-payment">Initial Payment</Label>
                <div className="flex items-center space-x-4">
                  <div className="grow">
                    <Slider
                      id="initial-payment"
                      min={50000}
                      max={2000000}
                      step={10000}
                      value={[initialPayment]}
                      onValueChange={(values: number[]) =>
                        setInitialPayment(values[0])
                      }
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      value={initialPayment}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setInitialPayment(Number(e.target.value))
                      }
                      className="text-right"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>£50,000</span>
                  <span>
                    {offerType === "property" && selectedProperty
                      ? `${propertyPercentage}% of property value`
                      : offerType === "buybox" && selectedBuyBox
                        ? `${buyBoxPercentage}% of Buy Box value`
                        : ""}
                  </span>
                  <span>£2,000,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly-payment">Monthly Payment</Label>
                <div className="flex items-center space-x-4">
                  <div className="grow">
                    <Slider
                      id="monthly-payment"
                      min={0}
                      max={5000}
                      step={100}
                      value={[monthlyPayment]}
                      onValueChange={(values: number[]) =>
                        setMonthlyPayment(values[0])
                      }
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      value={monthlyPayment}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setMonthlyPayment(Number(e.target.value))
                      }
                      className="text-right"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>£0</span>
                  <span>£5,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="indexation-rate">Indexation Rate (%)</Label>
                <div className="flex items-center space-x-4">
                  <div className="grow">
                    <Slider
                      id="indexation-rate"
                      min={0}
                      max={10}
                      step={0.5}
                      value={[indexationRate]}
                      onValueChange={(values: number[]) =>
                        setIndexationRate(values[0])
                      }
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      value={indexationRate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setIndexationRate(Number(e.target.value))
                      }
                      className="text-right"
                    />
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>10%</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Agreement Type</Label>
                <RadioGroup
                  value={agreementType}
                  onValueChange={(value: AgreementType) =>
                    setAgreementType(value)
                  }
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={AgreementType.STANDARD}
                      id="standard"
                    />
                    <Label htmlFor="standard">Standard Agreement</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={AgreementType.CUSTOM} id="custom" />
                    <Label htmlFor="custom">Custom Agreement</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>Occupancy Rights</Label>
                <RadioGroup
                  value={occupancyRight}
                  onValueChange={(value: OccupancyRight) =>
                    setOccupancyRight(value)
                  }
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={OccupancyRight.FULL} id="full" />
                    <Label htmlFor="full">Full Occupancy Rights</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={OccupancyRight.PARTIAL}
                      id="partial"
                    />
                    <Label htmlFor="partial">Partial Occupancy Rights</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={OccupancyRight.NONE} id="none" />
                    <Label htmlFor="none">No Occupancy Rights</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="maintenance-fund"
                  checked={includeMaintenanceFund}
                  onCheckedChange={setIncludeMaintenanceFund}
                />
                <Label htmlFor="maintenance-fund">
                  Include Maintenance Fund (2% of value)
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="flex items-center">
            <CalculatorIcon className="mr-2 size-4" />
            Calculate ROI
          </Button>

          <Button
            onClick={handleSubmitOffer}
            disabled={
              (offerType === "property" && !selectedPropertyId) ||
              (offerType === "buybox" && !selectedBuyBoxId)
            }
            className="flex items-center"
          >
            <SendIcon className="mr-2 size-4" />
            Submit Offer
          </Button>
        </CardFooter>
      </Card>

      {(offerType === "property" && selectedProperty) ||
      (offerType === "buybox" && selectedBuyBox) ? (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle2 className="mr-2 size-5 text-primary" />
              Offer Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Type:</span>
              <span className="font-medium">
                {offerType === "property"
                  ? "Individual Property"
                  : "Buy Box Portfolio"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Target:</span>
              <span className="font-medium">
                {offerType === "property" && selectedProperty
                  ? `${selectedProperty.address.streetLine1}, ${selectedProperty.address.city}`
                  : offerType === "buybox" && selectedBuyBox
                    ? selectedBuyBox.name
                    : ""}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Initial Payment:</span>
              <span className="font-medium">
                {formatCurrency(initialPayment)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Monthly Payment:</span>
              <span className="font-medium">
                {formatCurrency(monthlyPayment)}/month
              </span>
            </div>
            <div className="flex justify-between">
              <span>Indexation Rate:</span>
              <span className="font-medium">{indexationRate}%</span>
            </div>
            <div className="flex justify-between">
              <span>Agreement Type:</span>
              <span className="font-medium">
                {agreementType === AgreementType.STANDARD
                  ? "Standard Agreement"
                  : "Custom Agreement"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Occupancy Rights:</span>
              <span className="font-medium">
                {occupancyRight === OccupancyRight.FULL
                  ? "Full"
                  : occupancyRight === OccupancyRight.PARTIAL
                    ? "Partial"
                    : "None"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Maintenance Fund:</span>
              <span className="font-medium">
                {includeMaintenanceFund ? "Included" : "Not Included"}
              </span>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
