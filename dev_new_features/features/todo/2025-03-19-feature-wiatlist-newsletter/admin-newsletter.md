// apps/dashboard/src/app/(dashboard)/admin/newsletter/page.tsx
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
import { Checkbox } from "@package/ui/checkbox";
import { Switch } from "@package/ui/switch";
import { Label } from "@package/ui/label";
import { format } from "date-fns";
import { Download, Mail, Search, Tag, User } from "lucide-react";

export default function AdminNewsletterPage() {
  const { toast } = useToast();
  const [filter, setFilter] = useState({
    isActive: true,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Fetch newsletter subscribers
  const { data, isLoading, refetch } = api.newsletter.getSubscribers.useQuery({
    limit: 10,
    cursor: page > 1 ? ((page - 1) * 10).toString() : undefined,
    filter: {
      isActive: filter.isActive,
    },
  });
  
  // Handle bulk operations (could be implemented in the future)
  const handleBulkAction = (action: string) => {
    if (selectedSubscribers.length === 0) {
      toast({
        title: "No subscribers selected",
        description: "Please select at least one subscriber to perform this action.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Action not implemented",
      description: `The action "${action}" would be performed on ${selectedSubscribers.length} subscribers.`,
    });
    
    // In a real implementation, you would call a mutation here
    // For example: api.newsletter.bulkUpdate.mutateAsync({ ids: selectedSubscribers, action })
  };
  
  // Toggle subscriber selection
  const toggleSubscriberSelection = (id: string) => {
    setSelectedSubscribers((prev) => {
      if (prev.includes(id)) {
        return prev.filter((subId) => subId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Toggle select all
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    
    if (newSelectAll && data?.subscribers) {
      setSelectedSubscribers(data.subscribers.map((sub) => sub.id));
    } else {
      setSelectedSubscribers([]);
    }
  };
  
  // Export subscribers to CSV
  const exportToCsv = () => {
    if (!data?.subscribers) return;
    
    // Create CSV header
    let csvContent = "ID,Email,Name,Status,Subscribed Date,Source,Tags\n";
    
    // Add data rows
    data.subscribers.forEach((sub) => {
      const status = sub.isActive ? "Active" : "Inactive";
      const tags = sub.tags?.join(", ") || "";
      csvContent += `${sub.id},${sub.email},"${sub.name || ""}",${status},${format(new Date(sub.subscribedAt), "yyyy-MM-dd")},"${sub.source || ""}","${tags}"\n`;
    });
    
    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `newsletter-subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Toggle active filter
  const toggleActiveFilter = () => {
    setFilter((prev) => ({ ...prev, isActive: !prev.isActive }));
    setPage(1); // Reset to first page when changing filter
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
          <p className="text-gray-500">Manage your newsletter subscribers and export data</p>
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
          <CardDescription>Filter and search through subscribers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by email or name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="active-filter"
                checked={filter.isActive}
                onCheckedChange={toggleActiveFilter}
              />
              <Label htmlFor="active-filter">
                {filter.isActive ? "Active subscribers only" : "Include inactive subscribers"}
              </Label>
            </div>
            <Button className="w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Bulk Actions */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleBulkAction("export")}
          disabled={selectedSubscribers.length === 0}
        >
          Export Selected
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleBulkAction("tag")}
          disabled={selectedSubscribers.length === 0}
        >
          Add Tag
        </Button>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => handleBulkAction("unsubscribe")}
          disabled={selectedSubscribers.length === 0}
        >
          Unsubscribe Selected
        </Button>
        
        <div className="ml-auto">
          <span className="text-sm text-gray-500">
            {selectedSubscribers.length} of {data?.subscribers?.length || 0} selected
          </span>
        </div>
      </div>
      
      {/* Subscribers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={selectAll} 
                    onCheckedChange={handleSelectAll} 
                  />
                </TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Subscribed</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Loading subscribers...
                  </TableCell>
                </TableRow>
              ) : data?.subscribers?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No subscribers found. Try adjusting your filters.
                  </TableCell>
                </TableRow>
              ) : (
                data?.subscribers?.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell>
                      <Checkbox 
                        checked={selectedSubscribers.includes(subscriber.id)}
                        onCheckedChange={() => toggleSubscriberSelection(subscriber.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {subscriber.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-400" />
                        {subscriber.name || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {subscriber.tags && subscriber.tags.length > 0 ? (
                          subscriber.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">No tags</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {subscriber.source || "website"}
                    </TableCell>
                    <TableCell>
                      {format(new Date(subscriber.subscribedAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={subscriber.isActive ? "default" : "secondary"}>
                        {subscriber.isActive ? "Active" : "Inactive"}
                      </Badge>
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
