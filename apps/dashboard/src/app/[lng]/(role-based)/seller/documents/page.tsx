/*eslint-disable sort-imports*/
/*eslint-disable import/order*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable no-nested-ternary*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable react/function-component-definition*/

"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card"
import { mockPropertyDocuments, mockProperties } from "@/mock-data/properties"
import { Badge } from "@package/ui/badge"
import { Button } from "@package/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import {
  FileText,
  Upload,
  Download,
  Eye,
  Search,
  Grid,
  List,
  AlertCircle,
  CheckCircle2,
  Filter,
  Home,
} from "lucide-react"
import { formatDistance, format } from "date-fns"
import { Input } from "@package/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@package/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@package/ui/dropdown-menu"
import { useState } from "react"

const getStatusColor = (
  status: "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED"
) => {
  const colors = {
    PENDING: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    VERIFIED: "bg-green-100 text-green-800 hover:bg-green-200",
    REJECTED: "bg-red-100 text-red-800 hover:bg-red-200",
    EXPIRED: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  }
  return colors[status]
}

const getDocumentTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    DEED: "Property Deed",
    FLOOR_PLAN: "Floor Plan",
    ENERGY_CERTIFICATE: "Energy Certificate",
    SURVEY: "Survey",
    PROPERTY_TAX: "Property Tax",
    INSURANCE: "Insurance",
    PHOTO: "Property Photo",
    OTHER: "Other Document",
  }
  return labels[type]
}

const getDocumentIcon = (type: string) => {
  const icons: Record<string, React.ReactNode> = {
    DEED: <FileText className="size-4" />,
    FLOOR_PLAN: <Grid className="size-4" />,
    ENERGY_CERTIFICATE: <AlertCircle className="size-4" />,
    SURVEY: <FileText className="size-4" />,
    PROPERTY_TAX: <FileText className="size-4" />,
    INSURANCE: <FileText className="size-4" />,
    PHOTO: <FileText className="size-4" />,
    OTHER: <FileText className="size-4" />,
  }
  return icons[type]
}

export default function DocumentsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  // In a real app, this would fetch from an API
  const documents = mockPropertyDocuments
  const properties = mockProperties

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      getDocumentTypeLabel(doc.documentType)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (
        properties.find((p) => p.id === doc.propertyId)?.address.streetLine1 ||
        ""
      )
        .toLowerCase()
        .includes(searchQuery.toLowerCase())

    const matchesStatus =
      selectedStatus === "all" ||
      (selectedStatus === "verified" && doc.verified) ||
      (selectedStatus === "pending" && !doc.verified)

    return matchesSearch && matchesStatus
  })

  const requiredDocuments = filteredDocuments.filter((doc) =>
    ["DEED", "ENERGY_CERTIFICATE", "SURVEY"].includes(doc.documentType)
  )
  const propertyDocuments = filteredDocuments.filter((doc) =>
    ["FLOOR_PLAN", "INSURANCE", "PROPERTY_TAX"].includes(doc.documentType)
  )
  const otherDocuments = filteredDocuments.filter((doc) =>
    ["PHOTO", "OTHER"].includes(doc.documentType)
  )

  const DocumentCard = ({ document }: { document: (typeof documents)[0] }) => {
    const property = document.propertyId
      ? properties.find((p) => p.id === document.propertyId)
      : null

    return (
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 ${document.verified ? "bg-green-100" : "bg-primary/10"} rounded`}
              >
                {getDocumentIcon(document.documentType)}
              </div>
              <div>
                <CardTitle className="text-lg">
                  {getDocumentTypeLabel(document.documentType)}
                </CardTitle>
                {property && (
                  <CardDescription className="flex items-center gap-1">
                    <Home className="size-3" />
                    {property.address.streetLine1}
                  </CardDescription>
                )}
              </div>
            </div>
            <Badge
              className={getStatusColor(
                document.verified ? "VERIFIED" : "PENDING"
              )}
            >
              {document.verified ? (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="size-3" />
                  VERIFIED
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <AlertCircle className="size-3" />
                  PENDING
                </div>
              )}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Uploaded</p>
                <p className="font-medium">
                  {format(new Date(document.createdAt), "MMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p className="font-medium">
                  {formatDistance(new Date(document.updatedAt), new Date(), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">File Size</p>
                <p className="font-medium">2.4 MB</p>
              </div>
              <div>
                <p className="text-muted-foreground">File Type</p>
                <p className="font-medium">PDF</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Eye className="mr-2 size-4" />
                    Preview
                  </Button>
                </DialogTrigger>
                <DialogContent className="h-[80vh] max-w-4xl">
                  <DialogHeader>
                    <DialogTitle>
                      {getDocumentTypeLabel(document.documentType)}
                    </DialogTitle>
                    <DialogDescription>
                      {property?.address.streetLine1} • Uploaded{" "}
                      {format(new Date(document.createdAt), "MMM d, yyyy")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-1 items-center justify-center rounded-lg bg-muted">
                    <FileText className="size-16 text-muted-foreground" />
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="flex-1">
                <Download className="mr-2 size-4" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Manage and track all your property documents
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 size-4" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>
                Upload a new document for your property. Supported formats: PDF,
                JPG, PNG
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="rounded-lg border-2 border-dashed p-8 text-center">
                <Upload className="mx-auto mb-4 size-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag and drop your file here, or click to browse
                </p>
              </div>
              <Button className="w-full">Upload Document</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="size-4" />
              {selectedStatus === "all"
                ? "All Status"
                : selectedStatus === "verified"
                  ? "Verified"
                  : "Pending"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSelectedStatus("all")}>
              All Status
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedStatus("verified")}>
              Verified Only
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedStatus("pending")}>
              Pending Only
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
        >
          {viewMode === "grid" ? (
            <List className="size-4" />
          ) : (
            <Grid className="size-4" />
          )}
        </Button>
      </div>

      <Tabs defaultValue="required" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="required">
            Required ({requiredDocuments.length})
          </TabsTrigger>
          <TabsTrigger value="property">
            Property ({propertyDocuments.length})
          </TabsTrigger>
          <TabsTrigger value="other">
            Other ({otherDocuments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="required" className="mt-6">
          <div
            className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2" : ""}`}
          >
            {requiredDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
            {requiredDocuments.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No required documents match your search
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="property" className="mt-6">
          <div
            className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2" : ""}`}
          >
            {propertyDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
            {propertyDocuments.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No property documents match your search
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="other" className="mt-6">
          <div
            className={`grid gap-6 ${viewMode === "grid" ? "md:grid-cols-2" : ""}`}
          >
            {otherDocuments.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
            {otherDocuments.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No other documents match your search
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
