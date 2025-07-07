import { Input } from "@package/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"

// Helper function to get status value from isActive
export function getStatusValue(isActive: boolean | undefined): string {
  if (isActive === undefined) return "all"
  return isActive ? "active" : "inactive"
}

// Component for filter controls
export function FilterControls({
  searchQuery,
  setSearchQuery,
  isActive,
  setIsActive,
  source,
  setSource,
  sources,
}: {
  searchQuery: string
  setSearchQuery: (value: string) => void
  isActive: boolean | undefined
  setIsActive: (value: boolean | undefined) => void
  source: string | undefined
  setSource: (value: string | undefined) => void
  sources: string[]
}) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
      <div>
        <Input
          className="max-w-sm"
          placeholder="Search subscribers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div>
        <Select
          value={getStatusValue(isActive)}
          onValueChange={(value) => {
            if (value === "all") setIsActive(undefined)
            else if (value === "active") setIsActive(true)
            else setIsActive(false)
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subscribers</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {sources.length > 0 && (
        <div>
          <Select
            value={source || "all"}
            onValueChange={(value) =>
              setSource(value === "all" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              {sources.map((src: string) => (
                <SelectItem key={src} value={src}>
                  {src}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
