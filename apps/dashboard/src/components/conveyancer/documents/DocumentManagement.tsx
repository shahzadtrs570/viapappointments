/*eslint-disable import/order*/
/*eslint-disable react/function-component-definition*/
/*eslint-disable react/jsx-sort-props*/
/*eslint-disable sort-imports*/
/*eslint-disable react/jsx-max-depth*/
/*eslint-disable max-lines*/

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@package/ui/tabs"
import { Button } from "@package/ui/button"
import { Input } from "@package/ui/input"
import { Label } from "@package/ui/label"
import { Textarea } from "@package/ui/textarea"
import { Badge } from "@package/ui/badge"
import { ScrollArea } from "@package/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@package/ui/table"
import {
  FileText,
  Upload,
  Clock,
  FileCheck,
  AlertTriangle,
  Search,
  ChevronDown,
  Download,
  Eye,
  Trash2,
  Share,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@package/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@package/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"

interface Document {
  id: string
  name: string
  type: string
  uploadedAt: string
  status: "pending" | "reviewed" | "approved" | "rejected"
  size: string
  uploadedBy: string
  propertyId: string
  propertyAddress: string
  notes?: string
}

interface DocumentManagementProps {
  propertyId?: string
  propertyAddress?: string
}

export function DocumentManagement({
  propertyId,
  propertyAddress,
}: DocumentManagementProps) {
  const [activeTab, setActiveTab] = useState("all_documents")
  const [searchQuery, setSearchQuery] = useState("")
  const [documentType, setDocumentType] = useState<string>("")
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "doc1",
      name: "Property_Title_Deed.pdf",
      type: "Title Deed",
      uploadedAt: "2023-09-15T10:30:00Z",
      status: "approved",
      size: "2.4 MB",
      uploadedBy: "John Smith",
      propertyId: "prop1",
      propertyAddress: "15 Willow Avenue, Manchester",
    },
    {
      id: "doc2",
      name: "Land_Registry_Extract.pdf",
      type: "Land Registry",
      uploadedAt: "2023-09-14T14:15:00Z",
      status: "approved",
      size: "1.8 MB",
      uploadedBy: "John Smith",
      propertyId: "prop1",
      propertyAddress: "15 Willow Avenue, Manchester",
    },
    {
      id: "doc3",
      name: "Building_Survey_Report.pdf",
      type: "Survey",
      uploadedAt: "2023-09-12T09:45:00Z",
      status: "reviewed",
      size: "4.2 MB",
      uploadedBy: "Sarah Johnson",
      propertyId: "prop1",
      propertyAddress: "15 Willow Avenue, Manchester",
    },
    {
      id: "doc4",
      name: "Draft_Contract.docx",
      type: "Contract",
      uploadedAt: "2023-09-10T16:20:00Z",
      status: "pending",
      size: "780 KB",
      uploadedBy: "Michael Brown",
      propertyId: "prop2",
      propertyAddress: "42 Oak Street, London",
    },
    {
      id: "doc5",
      name: "Environmental_Report.pdf",
      type: "Environmental",
      uploadedAt: "2023-09-08T11:10:00Z",
      status: "reviewed",
      size: "3.1 MB",
      uploadedBy: "Sarah Johnson",
      propertyId: "prop2",
      propertyAddress: "42 Oak Street, London",
    },
    {
      id: "doc6",
      name: "Mortgage_Offer.pdf",
      type: "Mortgage",
      uploadedAt: "2023-09-05T15:40:00Z",
      status: "rejected",
      size: "1.5 MB",
      uploadedBy: "John Smith",
      propertyId: "prop3",
      propertyAddress: "7 Maple Road, Birmingham",
      notes: "Incorrect information. Please resubmit with corrected details.",
    },
  ])

  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [uploadData, setUploadData] = useState({
    name: "",
    type: "",
    notes: "",
  })

  const filteredDocuments = documents
    .filter((doc) => (propertyId ? doc.propertyId === propertyId : true))
    .filter((doc) => {
      if (searchQuery) {
        return (
          doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
          doc.propertyAddress.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }
      return true
    })
    .filter((doc) => {
      if (activeTab === "all_documents") return true
      if (activeTab === "pending") return doc.status === "pending"
      if (activeTab === "reviewed") return doc.status === "reviewed"
      if (activeTab === "approved") return doc.status === "approved"
      if (activeTab === "rejected") return doc.status === "rejected"
      return true
    })
    .filter((doc) => (documentType ? doc.type === documentType : true))

  const handleStatusChange = (
    docId: string,
    newStatus: "pending" | "reviewed" | "approved" | "rejected"
  ) => {
    setDocuments((docs) =>
      docs.map((doc) =>
        doc.id === docId ? { ...doc, status: newStatus } : doc
      )
    )
  }

  const handleUploadSubmit = () => {
    const newDocument: Document = {
      id: `doc${documents.length + 1}`,
      name: uploadData.name,
      type: uploadData.type,
      uploadedAt: new Date().toISOString(),
      status: "pending",
      size: "1.2 MB", // Placeholder
      uploadedBy: "Current User", // Placeholder
      propertyId: propertyId || "prop1",
      propertyAddress: propertyAddress || "Property Address",
      notes: uploadData.notes || undefined,
    }

    setDocuments([...documents, newDocument])
    setIsUploadDialogOpen(false)
    setUploadData({ name: "", type: "", notes: "" })
  }

  const documentTypes = Array.from(new Set(documents.map((doc) => doc.type)))

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-4">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Document Management</CardTitle>
              <CardDescription>
                {propertyAddress
                  ? `Manage legal documents for ${propertyAddress}`
                  : "Manage all legal documents for properties"}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search documents..."
                  className="w-[200px] pl-8 md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={documentType} onValueChange={setDocumentType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Document Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {documentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Dialog
                open={isUploadDialogOpen}
                onOpenChange={setIsUploadDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Upload className="size-4" />
                    <span>Upload Document</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Upload New Document</DialogTitle>
                    <DialogDescription>
                      Upload a new legal document for review and processing.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        File Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="document.pdf"
                        className="col-span-3"
                        value={uploadData.name}
                        onChange={(e) =>
                          setUploadData({ ...uploadData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Document Type
                      </Label>
                      <Select
                        value={uploadData.type}
                        onValueChange={(value) =>
                          setUploadData({ ...uploadData, type: value })
                        }
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Title Deed">Title Deed</SelectItem>
                          <SelectItem value="Land Registry">
                            Land Registry
                          </SelectItem>
                          <SelectItem value="Survey">Survey</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Environmental">
                            Environmental
                          </SelectItem>
                          <SelectItem value="Mortgage">Mortgage</SelectItem>
                          <SelectItem value="Insurance">Insurance</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="notes" className="text-right">
                        Notes
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Add any notes about this document..."
                        className="col-span-3"
                        value={uploadData.notes}
                        onChange={(e) =>
                          setUploadData({
                            ...uploadData,
                            notes: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <div className="col-span-4 flex justify-center">
                        <div className="rounded-lg border-2 border-dashed p-12 text-center">
                          <Upload className="mx-auto size-12 text-muted-foreground" />
                          <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            PDF, DOC, DOCX up to 10MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsUploadDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleUploadSubmit}>Upload</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger
                value="all_documents"
                className="flex items-center gap-2"
              >
                <FileText className="size-4" />
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger value="pending" className="flex items-center gap-2">
                <Clock className="size-4" />
                <span>Pending</span>
              </TabsTrigger>
              <TabsTrigger value="reviewed" className="flex items-center gap-2">
                <FileCheck className="size-4" />
                <span>Reviewed</span>
              </TabsTrigger>
              <TabsTrigger value="approved" className="flex items-center gap-2">
                <FileCheck className="size-4" />
                <span>Approved</span>
              </TabsTrigger>
              <TabsTrigger value="rejected" className="flex items-center gap-2">
                <AlertTriangle className="size-4" />
                <span>Rejected</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Type</TableHead>
                      {!propertyId && <TableHead>Property</TableHead>}
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.map((document) => (
                      <TableRow key={document.id}>
                        <TableCell className="font-medium">
                          {document.name}
                        </TableCell>
                        <TableCell>{document.type}</TableCell>
                        {!propertyId && (
                          <TableCell>{document.propertyAddress}</TableCell>
                        )}
                        <TableCell>{formatDate(document.uploadedAt)}</TableCell>
                        <TableCell>
                          <Badge
                            className={`
                              ${document.status === "pending" ? "bg-amber-500" : ""}
                              ${document.status === "reviewed" ? "bg-blue-500" : ""}
                              ${document.status === "approved" ? "bg-green-500" : ""}
                              ${document.status === "rejected" ? "bg-red-500" : ""}
                            `}
                          >
                            {document.status.charAt(0).toUpperCase() +
                              document.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{document.size}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <span className="sr-only">Open menu</span>
                                <ChevronDown className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-[200px]"
                            >
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuGroup>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Eye className="size-4" />
                                  <span>View Document</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Download className="size-4" />
                                  <span>Download</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2">
                                  <Share className="size-4" />
                                  <span>Share</span>
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                              <DropdownMenuSeparator />
                              <DropdownMenuLabel>
                                Change Status
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                className="flex items-center gap-2"
                                onClick={() =>
                                  handleStatusChange(document.id, "reviewed")
                                }
                              >
                                <FileCheck className="size-4 text-blue-500" />
                                <span>Mark as Reviewed</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2"
                                onClick={() =>
                                  handleStatusChange(document.id, "approved")
                                }
                              >
                                <FileCheck className="size-4 text-green-500" />
                                <span>Approve Document</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center gap-2"
                                onClick={() =>
                                  handleStatusChange(document.id, "rejected")
                                }
                              >
                                <AlertTriangle className="size-4 text-red-500" />
                                <span>Reject Document</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="flex items-center gap-2 text-red-500">
                                <Trash2 className="size-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}

                    {filteredDocuments.length === 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={propertyId ? 6 : 7}
                          className="h-24 text-center"
                        >
                          No documents found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Showing {filteredDocuments.length} of {documents.length} documents
            </p>
          </div>
          <Button variant="outline" size="sm">
            Export Documents
          </Button>
        </CardFooter>
      </Card>

      {/* Document Detail Dialog would be here */}
    </div>
  )
}
