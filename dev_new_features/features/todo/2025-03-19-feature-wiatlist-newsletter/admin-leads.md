// apps/dashboard/src/app/(dashboard)/admin/leads/page.tsx
import { useState } from "react";
import { api } from "@/lib/api";
import { useToast } from "@package/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@package/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@package/ui/card";
import { Input } from "@package/ui/input";
import { Button } from "@package/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@package/ui/pagination";
import { Badge } from "@package/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@package/ui/dialog";
import { format } from "date-fns";
import { Download, Mail, Search, User } from "lucide-react";

// Lead status colors
const statusColors = {
  NEW: "bg-blue-500",
  CONTACTED: "bg-yellow-500",
  QUALIFIED: "bg-purple-500",
  CONVERTED: "bg-green-500",
  LOST: "bg-gray-500",
};

// Get color for lead type - this is now a function since types are flexible
function getLeadTypeColor(type: string): string {
  // Base mapping for common types
  const typeColors: Record<string, string> = {
    'meeting': "bg-indigo-500",
    'workshop': "bg-pink-500",
    'service': "bg-orange-500",
    'consultation': "bg-teal-500",
    'other': "bg-gray-500",
  };
  
  // Try to match by normalizing the type
  const normalizedType = type.toLowerCase().trim();
  if (typeColors[normalizedType]) {
    return typeColors[normalizedType];
  }
  
  // Fallback: generate a consistent color based on the type string
  // Simple hash function for consistent colors
  const hash = normalizedType.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Pick from a list of predefined colors using the hash
  const colors = [
    "bg-red-500", "bg-green-500", "bg-blue-500", 
    "bg-yellow-500", "bg-purple-500", "bg-pink-500", 
    "bg-indigo-500", "bg-teal-500", "bg-orange-500",
  ];
  
  return colors[Math.abs(hash) % colors.length];
}

export default function AdminLeadsPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  
  // Fetch lead types for the filter dropdown
  const { data: leadTypesData } = api.leads.getLeadTypes.useQuery();
  
  // Fetch leads data
  const { data, isLoading, refetch } = api.leads.getLeads.useQuery({
    limit: 10,
    cursor: page > 1 ? ((page - 1) * 10).toString() : undefined,
    filter: {
      status: statusFilter as any,
      leadType: typeFilter,
      search: searchQuery || undefined,
    },
  });
  
  // Update lead status mutation
  const updateLeadStatus = api.leads.updateLeadStatus.useMutation({
    onSuccess: () => {
      toast({
        title: "Lead updated",
        description: "The lead status has been updated successfully.",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update lead status.",
        variant: "destructive",
      });
    },
  });
  
  // Handle lead status change
  const handleStatusChange = async (leadId: string, status: string) => {
    await updateLeadStatus.mutateAsync({
      id: leadId,
      status: status as any,
    });
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on search
    refetch();
  };
  
  // Format lead type for display
  const formatLeadType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };
  
  // Export leads to CSV
  const exportToCsv = () => {
    if (!data?.leads) return;
    
    // Create CSV header
    let csvContent = "ID,Name,Email,Phone,Company,Type,Status,Created Date\n";
    
    // Add data rows
    data.leads.forEach((lead) => {
      csvContent += `${lead.id},${lead.name || ""},${lead.email || ""},"${lead.phone || ""}","${lead.company || ""}",${lead.leadType},${lead.status},${format(new Date(lead.createdAt), "yyyy-MM-dd")}\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads-export-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // View lead details
  const handleViewLead = (lead: any) => {
    setSelectedLead(lead);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Leads Management</h1>
          <p className="text-gray-500">Manage and track leads from all sources</p>
        </div>
        <Button onClick={exportToCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search through your leads</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-40">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="QUALIFIED">Qualified</SelectItem>
                  <SelectItem value="CONVERTED">Converted</SelectItem>
                  <SelectItem value="LOST">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-40">
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Lead Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {/* Dynamically generate type options from actual data */}
                  {leadTypesData?.map((typeInfo) => (
                    <SelectItem key={typeInfo.type} value={typeInfo.type}>
                      {formatLeadType(typeInfo.type)} ({typeInfo.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading leads...
                  </TableCell>
                </TableRow>
              ) : data?.leads?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No leads found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                data?.leads?.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {lead.name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {lead.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${getLeadTypeColor(lead.leadType)} text-white`}
                      >
                        {formatLeadType(lead.leadType)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={lead.status}
                        onValueChange={(value) => handleStatusChange(lead.id, value)}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="CONTACTED">Contacted</SelectItem>
                          <SelectItem value="QUALIFIED">Qualified</SelectItem>
                          <SelectItem value="CONVERTED">Converted</SelectItem>
                          <SelectItem value="LOST">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {format(new Date(lead.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewLead(lead)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Lead Details</DialogTitle>
                            <DialogDescription>
                              Complete information about this lead
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedLead && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <h3 className="font-semibold text-sm text-gray-500 mb-1">Lead Information</h3>
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-sm text-gray-500">Name:</span>
                                    <p>{selectedLead.name || "N/A"}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Email:</span>
                                    <p>{selectedLead.email}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Phone:</span>
                                    <p>{selectedLead.phone || "N/A"}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Company:</span>
                                    <p>{selectedLead.company || "N/A"}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Message:</span>
                                    <p className="whitespace-pre-line">{selectedLead.message || "N/A"}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold text-sm text-gray-500 mb-1">Additional Details</h3>
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-sm text-gray-500">Lead Type:</span>
                                    <p>{formatLeadType(selectedLead.leadType)}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Status:</span>
                                    <p>{selectedLead.status}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Source:</span>
                                    <p>{selectedLead.source || "N/A"}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Created:</span>
                                    <p>{format(new Date(selectedLead.createdAt), "MMMM d, yyyy, h:mm a")}</p>
                                  </div>
                                </div>
                                
                                {/* Metadata fields */}
                                {selectedLead.metadata && Object.keys(selectedLead.metadata).length > 0 && (
                                  <div className="mt-4">
                                    <h3 className="font-semibold text-sm text-gray-500 mb-1">Custom Fields</h3>
                                    <div className="space-y-2">
                                      {Object.entries(selectedLead.metadata).map(([key, value]) => (
                                        <div key={key}>
                                          <span className="text-sm text-gray-500">{key}:</span>
                                          <p>{String(value)}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Pagination */}
      {data?.nextCursor && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPage(page => Math.max(page - 1, 1))}
                  disabled={page === 1}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-4">{page}</span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setPage(page => page + 1)}
                  disabled={!data?.nextCursor}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}).toString() : undefined,
    filter: {
      status: statusFilter as any,
      leadType: typeFilter as any,
      search: searchQuery || undefined,
    },
  });
  
  // Update lead status mutation
  const updateLeadStatus = api.leads.updateLeadStatus.useMutation({
    onSuccess: () => {
      toast({
        title: "Lead updated",
        description: "The lead status has been updated successfully.",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update lead status.",
        variant: "destructive",
      });
    },
  });
  
  // Handle lead status change
  const handleStatusChange = async (leadId: string, status: string) => {
    await updateLeadStatus.mutateAsync({
      id: leadId,
      status: status as any,
    });
  };
  
  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on search
    refetch();
  };
  
  // Export leads to CSV
  const exportToCsv = () => {
    if (!data?.leads) return;
    
    // Create CSV header
    let csvContent = "ID,Name,Email,Phone,Company,Type,Status,Created Date\n";
    
    // Add data rows
    data.leads.forEach((lead) => {
      csvContent += `${lead.id},${lead.name || ""},${lead.email || ""},"${lead.phone || ""}","${lead.company || ""}",${lead.leadType},${lead.status},${format(new Date(lead.createdAt), "yyyy-MM-dd")}\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads-export-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // View lead details
  const handleViewLead = (lead: any) => {
    setSelectedLead(lead);
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Leads Management</h1>
          <p className="text-gray-500">Manage and track leads from all sources</p>
        </div>
        <Button onClick={exportToCsv}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      
      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter and search through your leads</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full sm:w-40">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="NEW">New</SelectItem>
                  <SelectItem value="CONTACTED">Contacted</SelectItem>
                  <SelectItem value="QUALIFIED">Qualified</SelectItem>
                  <SelectItem value="CONVERTED">Converted</SelectItem>
                  <SelectItem value="LOST">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-40">
              <Select
                value={typeFilter}
                onValueChange={setTypeFilter}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Lead Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  <SelectItem value="MEETING">Meeting</SelectItem>
                  <SelectItem value="WORKSHOP">Workshop</SelectItem>
                  <SelectItem value="SERVICE">Service</SelectItem>
                  <SelectItem value="CONSULTATION">Consultation</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading leads...
                  </TableCell>
                </TableRow>
              ) : data?.leads?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No leads found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                data?.leads?.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {lead.name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {lead.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${leadTypeBadges[lead.leadType as keyof typeof leadTypeBadges]?.color} text-white`}
                      >
                        {leadTypeBadges[lead.leadType as keyof typeof leadTypeBadges]?.label || lead.leadType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Select
                        defaultValue={lead.status}
                        onValueChange={(value) => handleStatusChange(lead.id, value)}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">New</SelectItem>
                          <SelectItem value="CONTACTED">Contacted</SelectItem>
                          <SelectItem value="QUALIFIED">Qualified</SelectItem>
                          <SelectItem value="CONVERTED">Converted</SelectItem>
                          <SelectItem value="LOST">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {format(new Date(lead.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewLead(lead)}
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Lead Details</DialogTitle>
                            <DialogDescription>
                              Complete information about this lead
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedLead && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                              <div>
                                <h3 className="font-semibold text-sm text-gray-500 mb-1">Lead Information</h3>
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-sm text-gray-500">Name:</span>
                                    <p>{selectedLead.name || "N/A"}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Email:</span>
                                    <p>{selectedLead.email}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Phone:</span>
                                    <p>{selectedLead.phone || "N/A"}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Company:</span>
                                    <p>{selectedLead.company || "N/A"}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Message:</span>
                                    <p className="whitespace-pre-line">{selectedLead.message || "N/A"}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-semibold text-sm text-gray-500 mb-1">Additional Details</h3>
                                <div className="space-y-2">
                                  <div>
                                    <span className="text-sm text-gray-500">Lead Type:</span>
                                    <p>{leadTypeBadges[selectedLead.leadType as keyof typeof leadTypeBadges]?.label || selectedLead.leadType}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Status:</span>
                                    <p>{selectedLead.status}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Source:</span>
                                    <p>{selectedLead.source || "N/A"}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm text-gray-500">Created:</span>
                                    <p>{format(new Date(selectedLead.createdAt), "MMMM d, yyyy, h:mm a")}</p>
                                  </div>
                                </div>
                                
                                {/* Metadata fields */}
                                {selectedLead.metadata && Object.keys(selectedLead.metadata).length > 0 && (
                                  <div className="mt-4">
                                    <h3 className="font-semibold text-sm text-gray-500 mb-1">Custom Fields</h3>
                                    <div className="space-y-2">
                                      {Object.entries(selectedLead.metadata).map(([key, value]) => (
                                        <div key={key}>
                                          <span className="text-sm text-gray-500">{key}:</span>
                                          <p>{String(value)}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Pagination */}
      {data?.nextCursor && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setPage(page => Math.max(page - 1, 1))}
                  disabled={page === 1}
                />
              </PaginationItem>
              <PaginationItem>
                <span className="px-4">{page}</span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setPage(page => page + 1)}
                  disabled={!data?.nextCursor}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
                