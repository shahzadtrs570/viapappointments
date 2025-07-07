import { cn } from "@package/utils"

import { Badge } from "../Badge/Badge"
import { Card, CardContent, CardFooter } from "../Card/Card"

export interface DocumentCardProps {
  id: string
  title: string
  documentType: string
  fileUrl: string
  filename: string
  fileSize?: number
  uploadDate: string
  verified: boolean
  uploadedBy?: string
  className?: string
  onView?: (id: string) => void
  onDownload?: (id: string) => void
  onDelete?: (id: string) => void
}

export function DocumentCard({
  id,
  title,
  documentType,
  fileUrl,
  filename,
  fileSize,
  uploadDate,
  verified,
  uploadedBy,
  className,
  onView,
  onDownload,
  onDelete,
}: DocumentCardProps) {
  // Format file size
  const formattedFileSize = fileSize 
    ? fileSize < 1024 
      ? `${fileSize} KB` 
      : `${(fileSize / 1024).toFixed(2)} MB`
    : undefined
  
  // Format date
  const formattedDate = new Date(uploadDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  // Determine file icon based on type
  const getFileIcon = () => {
    switch (documentType) {
      case 'DEED':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
            <path d="M10 22h4" />
            <path d="M2 22h4" />
            <path d="M18 22h4" />
            <rect width="20" height="14" x="2" y="2" rx="2" />
            <path d="M12 16V8" />
            <path d="m9 11 3-3 3 3" />
          </svg>
        )
      case 'FLOOR_PLAN':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="M3 15h18" />
            <path d="M9 3v18" />
            <path d="M15 3v18" />
          </svg>
        )
      case 'ENERGY_CERTIFICATE':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
            <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.8a2 2 0 0 0 1.4-.6L12 4.6a2 2 0 0 1 1.4-.6h5.8a2 2 0 0 1 2 2v2.4Z" />
            <path d="m12 12 2 2 4-4" />
          </svg>
        )
      case 'PHOTO':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
            <path d="M15 8h.01" />
            <rect width="16" height="16" x="4" y="4" rx="3" />
            <path d="m4 15 4-4a3 3 0 0 1 3 0l5 5" />
            <path d="m14 14 1-1a3 3 0 0 1 3 0l2 2" />
          </svg>
        )
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        )
    }
  }

  return (
    <Card className={cn("", className)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-muted rounded">
            {getFileIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold line-clamp-1">{title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{filename}</p>
              </div>
              <Badge 
                variant={verified ? "default" : "outline"}
                className={verified ? "bg-success/20 text-success border-success/50" : ""}
              >
                {verified ? "Verified" : "Unverified"}
              </Badge>
            </div>
            <div className="flex text-xs text-muted-foreground mt-2 gap-4">
              {documentType && (
                <span>{documentType.replace('_', ' ')}</span>
              )}
              {formattedFileSize && (
                <span>{formattedFileSize}</span>
              )}
              <span>Uploaded: {formattedDate}</span>
              {uploadedBy && (
                <span>By: {uploadedBy}</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 gap-2 justify-end">
        {onView && (
          <button
            onClick={() => onView(id)}
            className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            View
          </button>
        )}
        {onDownload && (
          <button
            onClick={() => onDownload(id)}
            className="text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Download
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="text-sm text-destructive hover:underline focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2"
          >
            Delete
          </button>
        )}
      </CardFooter>
    </Card>
  )
} 