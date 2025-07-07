/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable @typescript-eslint/consistent-type-imports*/
/*eslint-disable @typescript-eslint/no-unnecessary-condition*/

"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@package/ui/card"
import { Button } from "@package/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@package/ui/dialog"
import { Input } from "@package/ui/input"
import { Label } from "@package/ui/label"
import { Calendar } from "@package/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@package/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Home, Tag, Upload, Loader2 } from "lucide-react"
import { cn } from "@package/utils"
import { Checkbox } from "@package/ui/checkbox"
import { Textarea } from "@package/ui/textarea"
import { toast } from "@package/ui/toast"

interface PropertyActionsProps {
  propertyId: string
  ownership: number
  registrationDate: Date
}

interface PropertyFeature {
  id: string
  label: string
  checked: boolean
}

export function PropertyActions({
  ownership,
  registrationDate,
}: PropertyActionsProps) {
  // Dialog open states
  const [isValuationOpen, setIsValuationOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false)
  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false)

  // Loading states Changes
  const [isValuationLoading, setIsValuationLoading] = useState(false)
  const [isUpdateLoading, setIsUpdateLoading] = useState(false)
  const [isFeaturesLoading, setIsFeaturesLoading] = useState(false)
  const [isPhotoUploadLoading, setIsPhotoUploadLoading] = useState(false)

  // Form states
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [valuationNotes, setValuationNotes] = useState("")
  const [propertyTitle, setPropertyTitle] = useState("")
  const [propertyDescription, setPropertyDescription] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  // Property features state
  const [features, setFeatures] = useState<PropertyFeature[]>([
    { id: "garden", label: "Garden", checked: false },
    { id: "parking", label: "Parking", checked: false },
    { id: "garage", label: "Garage", checked: false },
    { id: "balcony", label: "Balcony", checked: false },
    { id: "central_heating", label: "Central Heating", checked: false },
    { id: "air_conditioning", label: "Air Conditioning", checked: false },
  ])

  const handleValuationRequest = async () => {
    if (!selectedDate) {
      toast({
        title: "Please select a preferred date",
        description:
          "Please select a preferred date for the property valuation.",
        variant: "destructive",
      })
      return
    }

    setIsValuationLoading(true)
    try {
      // In a real app, this would make an API call
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      toast({
        title: "Valuation request submitted successfully",
        description: "Your valuation request has been submitted successfully.",
        variant: "success",
      })
      setIsValuationOpen(false)
      setSelectedDate(undefined)
      setValuationNotes("")
    } catch (error) {
      toast({
        title: "Failed to submit valuation request",
        description:
          "Failed to submit your valuation request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsValuationLoading(false)
    }
  }

  const handlePropertyUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!propertyTitle.trim()) {
      toast({
        title: "Please enter a property title",
        description: "Please enter a property title for your property.",
        variant: "destructive",
      })
      return
    }

    setIsUpdateLoading(true)
    try {
      // In a real app, this would make an API call
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      toast({
        title: "Property details updated successfully",
        description: "Your property details have been updated successfully.",
        variant: "success",
      })
      setIsUpdateOpen(false)
      setPropertyTitle("")
      setPropertyDescription("")
    } catch (error) {
      toast({
        title: "Failed to update property details",
        description:
          "Failed to update your property details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdateLoading(false)
    }
  }

  const handleFeatureUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsFeaturesLoading(true)
    try {
      // In a real app, this would make an API call
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
      toast({
        title: "Property features updated successfully",
        description: "Your property features have been updated successfully.",
        variant: "success",
      })
      setIsFeaturesOpen(false)
    } catch (error) {
      toast({
        title: "Failed to update property features",
        description:
          "Failed to update your property features. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsFeaturesLoading(false)
    }
  }

  const handlePhotoUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFiles?.length) {
      toast({
        title: "Please select at least one photo",
        description: "Please select at least one photo for your property.",
        variant: "destructive",
      })
      return
    }

    setIsPhotoUploadLoading(true)
    try {
      // In a real app, this would handle file upload
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate upload
      toast({
        title: `${selectedFiles.length} photos uploaded successfully`,
        description: "Your photos have been uploaded successfully.",
        variant: "success",
      })
      setIsPhotoUploadOpen(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setSelectedFiles(null)
    } catch (error) {
      toast({
        title: "Failed to upload photos",
        description: "Failed to upload your photos. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPhotoUploadLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(e.target.files)
    }
  }

  const toggleFeature = (featureId: string) => {
    setFeatures(
      features.map((feature) =>
        feature.id === featureId
          ? { ...feature, checked: !feature.checked }
          : feature
      )
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Ownership Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Ownership</span>
            <span className="font-medium">{ownership}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Registration Date</span>
            <span className="font-medium">
              {format(registrationDate, "dd/MM/yyyy")}
            </span>
          </div>
          <Dialog open={isValuationOpen} onOpenChange={setIsValuationOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="outline">
                Request Valuation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Request Property Valuation</DialogTitle>
                <DialogDescription>
                  Choose a preferred date for the property valuation.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex flex-col space-y-2">
                  <Label>Preferred Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {selectedDate
                          ? format(selectedDate, "PPP")
                          : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        disabled={(date) =>
                          date < new Date() ||
                          date >
                            new Date(
                              new Date().setMonth(new Date().getMonth() + 3)
                            )
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea
                    placeholder="Any specific requirements or notes"
                    value={valuationNotes}
                    onChange={(e) => setValuationNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsValuationOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleValuationRequest}
                  disabled={isValuationLoading}
                >
                  {isValuationLoading && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Property Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex w-full items-center justify-start"
                variant="outline"
              >
                <Home className="mr-2 size-4" />
                Update Property Details
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Property Details</DialogTitle>
                <DialogDescription>
                  Make changes to your property information.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePropertyUpdate}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Property Title</Label>
                    <Input
                      placeholder="Enter property title"
                      value={propertyTitle}
                      onChange={(e) => setPropertyTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Enter property description"
                      value={propertyDescription}
                      onChange={(e) => setPropertyDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsUpdateOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isUpdateLoading}>
                    {isUpdateLoading && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isFeaturesOpen} onOpenChange={setIsFeaturesOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex w-full items-center justify-start"
                variant="outline"
              >
                <Tag className="mr-2 size-4" />
                Add Property Features
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Property Features</DialogTitle>
                <DialogDescription>
                  Update the features and amenities of your property.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFeatureUpdate}>
                <div className="space-y-4 py-4">
                  {features.map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={feature.id}
                        checked={feature.checked}
                        onCheckedChange={() => toggleFeature(feature.id)}
                      />
                      <Label htmlFor={feature.id}>{feature.label}</Label>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsFeaturesOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isFeaturesLoading}>
                    {isFeaturesLoading && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    Save Features
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isPhotoUploadOpen} onOpenChange={setIsPhotoUploadOpen}>
            <DialogTrigger asChild>
              <Button
                className="flex w-full items-center justify-start"
                variant="secondary"
              >
                <Upload className="mr-2 size-4" />
                Upload Photos
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Property Photos</DialogTitle>
                <DialogDescription>
                  Add new photos to showcase your property.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePhotoUpload}>
                <div className="space-y-4 py-4">
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Photos</Label>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    {selectedFiles && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {selectedFiles.length}{" "}
                        {selectedFiles.length === 1 ? "file" : "files"} selected
                      </p>
                    )}
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsPhotoUploadOpen(false)
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ""
                      }
                      setSelectedFiles(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPhotoUploadLoading || !selectedFiles?.length}
                  >
                    {isPhotoUploadLoading && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    Upload
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  )
}
