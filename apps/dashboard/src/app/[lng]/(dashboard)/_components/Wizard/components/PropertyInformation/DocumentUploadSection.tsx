/*eslint-disable*/

import { useState } from "react"
import { Button } from "@package/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@package/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@package/ui/select"
import { Typography } from "@package/ui/typography"
import { useClientTranslation } from "@/lib/i18n/I18nProvider"
import {
  openFileInNewWindow,
  isImageFile,
  isPdfFile,
  type PropertyDocument,
} from "./DocumentHelpers"

interface DocumentUploadSectionProps {
  showDocumentUpload: boolean
  setShowDocumentUpload: (show: boolean) => void
  documents: PropertyDocument[]
  readOnly: boolean
  onDocumentUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: string
  ) => void
  onRemoveDocument: (documentId: string, documentType: string) => void
  form: any
}

export function DocumentUploadSection({
  showDocumentUpload,
  setShowDocumentUpload,
  documents,
  readOnly,
  onDocumentUpload,
  onRemoveDocument,
  form,
}: DocumentUploadSectionProps) {
  const { t } = useClientTranslation([
    "wizard_property_information",
    "wizard_common",
  ])

  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [documentTags, setDocumentTags] = useState<string[]>([])
  const [previewDoc, setPreviewDoc] = useState<{
    url: string
    type: string
    filename: string
  } | null>(null)

  const documentTagOptions = [
    "Additional info",
    "Approved extensions",
    "Updated photos",
    "Solar",
    "Conservatory",
    "Garage",
    "Floor plan",
    "Property deeds",
  ]

  const handlePreview = (doc: PropertyDocument) => {
    let fileType

    if (isImageFile(doc.filename)) {
      fileType = "image"
    } else if (isPdfFile(doc.filename)) {
      fileType = "pdf"
    } else {
      fileType = "other"
    }

    setPreviewDoc({
      url: doc.fileUrl,
      type: fileType,
      filename: doc.filename,
    })
  }

  function PreviewModal() {
    if (!previewDoc) return null
    let previewDocIcon

    switch (previewDoc.type) {
      case "image":
        previewDocIcon = "🖼️"
        break
      case "pdf":
        previewDocIcon = "📄"
        break
      default:
        previewDocIcon = "📎"
    }

    let previewElement

    switch (previewDoc.type) {
      case "image":
        previewElement = (
          <img
            alt={previewDoc.filename}
            className="mx-auto max-h-[70vh] w-auto rounded-lg"
            src={previewDoc.url}
          />
        )
        break
      case "pdf":
        previewElement = (
          <iframe
            className="h-[70vh] w-full rounded-lg"
            src={previewDoc.url}
            title={previewDoc.filename}
          />
        )
        break
      default:
        previewElement = (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            Preview not available for this file type
          </div>
        )
    }

    return (
      <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <span className="text-xl">{previewDocIcon}</span>
              {previewDoc.filename}
            </DialogTitle>
          </DialogHeader>
          <div className="relative mt-4 max-h-[80vh] overflow-auto rounded-lg border border-border bg-card p-1">
            {previewElement}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <PreviewModal />
      <Typography
        className="border-b border-border/40 pb-1 text-lg font-semibold text-primary sm:pb-2 sm:text-xl"
        variant="h3"
      >
        {t("wizard_property_information:documentSection.title")}
      </Typography>

      <div className="mb-4">
        <p className="mb-4 text-sm">
          Would you like to attach any documents to support your application
          such as updated floor plans, approved extensions, solar — anything
          that&apos;s added value to your property?
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant={showDocumentUpload ? "default" : "outline"}
            className={`flex items-center gap-2 ${
              showDocumentUpload
                ? "bg-primary text-primary-foreground"
                : "bg-background"
            }`}
            onClick={() => {
              setShowDocumentUpload(true)
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  "property_document_upload_preference",
                  "true"
                )
              }
              form.setValue("showDocumentUpload", true)
            }}
          >
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 13l4 4L19 7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            Yes
          </Button>

          <Button
            type="button"
            variant={!showDocumentUpload ? "default" : "outline"}
            className={`flex items-center gap-2 ${
              !showDocumentUpload
                ? "bg-primary text-primary-foreground"
                : "bg-background"
            }`}
            onClick={() => {
              setShowDocumentUpload(false)
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  "property_document_upload_preference",
                  "false"
                )
              }
              form.setValue("showDocumentUpload", false)
            }}
          >
            <svg
              className="size-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            Maybe Later
          </Button>
        </div>
      </div>

      {showDocumentUpload && (
        <div className="rounded-lg border-2 border-dashed border-border bg-background/30 p-4 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 sm:p-6">
          <div className="text-center">
            <span className="mb-2 block text-2xl">📎</span>
            <h4 className="mb-1 text-sm font-medium sm:text-base">
              {t(
                "wizard_property_information:documentSection.uploadPropertyDocuments"
              )}
            </h4>
            <p className="mb-3 text-xs text-muted-foreground sm:text-sm">
              {t(
                "wizard_property_information:documentSection.generalDescription"
              )}
            </p>
            {!readOnly ? (
              <div className="flex flex-col items-center">
                <label
                  className="group mb-4 cursor-pointer rounded-md bg-transparent font-medium text-primary transition-colors hover:text-primary/80"
                  htmlFor="document-upload-with-tag"
                >
                  <span className="relative inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs shadow-sm transition-all duration-200 group-hover:border-primary/50 group-hover:bg-primary/10 group-hover:shadow-md sm:px-4 sm:py-2 sm:text-sm">
                    <svg
                      className="size-3 sm:size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    Select Files
                  </span>
                  <input
                    multiple
                    accept="*/*"
                    className="sr-only"
                    id="document-upload-with-tag"
                    name="document-upload-with-tag"
                    type="file"
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        setSelectedFiles((prevFiles) => [
                          ...prevFiles,
                          ...Array.from(e.target.files || []),
                        ])
                        e.target.value = ""
                      }
                    }}
                  />
                </label>

                {selectedFiles.length > 0 && (
                  <div className="w-full max-w-md space-y-3">
                    <h5 className="text-sm font-medium">Selected Files</h5>
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-md border border-border p-2"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📄</span>
                          <span className="max-w-[150px] truncate text-sm">
                            {file.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Select
                            defaultValue="Additional info"
                            onValueChange={(value) => {
                              const updatedTags = [...documentTags]
                              updatedTags[index] = value
                              setDocumentTags(updatedTags)
                            }}
                          >
                            <SelectTrigger className="h-8 w-[140px] text-xs">
                              <SelectValue placeholder="Select tag" />
                            </SelectTrigger>
                            <SelectContent>
                              {documentTagOptions.map((tag) => (
                                <SelectItem
                                  key={tag}
                                  className="text-xs"
                                  value={tag}
                                >
                                  {tag}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Button
                            className="size-8 p-0 text-destructive"
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              const newFiles = [...selectedFiles]
                              newFiles.splice(index, 1)
                              setSelectedFiles(newFiles)

                              const newTags = [...documentTags]
                              newTags.splice(index, 1)
                              setDocumentTags(newTags)
                            }}
                          >
                            <svg
                              className="size-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M6 18L18 6M6 6l12 12"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                              />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      className="w-full"
                      type="button"
                      onClick={() => {
                        selectedFiles.forEach((file, index) => {
                          const tag = documentTags[index] || "Additional info"
                          const fileList = {
                            0: file,
                            length: 1,
                            item: (index: number) =>
                              index === 0 ? file : null,
                          } as unknown as FileList

                          const mockEvent = {
                            target: {
                              files: fileList,
                              value: "",
                            },
                            preventDefault: () => {},
                            stopPropagation: () => {},
                          } as unknown as React.ChangeEvent<HTMLInputElement>

                          void onDocumentUpload(mockEvent, tag)
                        })
                        setSelectedFiles([])
                        setDocumentTags([])
                      }}
                    >
                      Upload All Files
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t(
                  "wizard_property_information:documentSection.readOnlyMessage"
                )}
              </p>
            )}
          </div>

          {/* Document List */}
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="mt-3 flex items-center justify-between rounded-md border border-border/40 bg-card p-2 shadow-sm"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="shrink-0 text-lg">📎</span>
                <span className="max-w-[180px] truncate text-xs sm:max-w-[250px] sm:text-sm">
                  {doc.filename}
                </span>
                {doc.documentType && doc.documentType !== "OTHER" && (
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                    {doc.documentType}
                  </span>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {doc.verified && (
                  <span className="text-success" title="Verified">
                    ✓
                  </span>
                )}
                <button
                  className="rounded-full bg-primary/10 p-1 text-primary shadow-sm transition-all duration-200 hover:bg-primary/20"
                  title="Open in new window"
                  type="button"
                  onClick={() => openFileInNewWindow(doc)}
                >
                  <svg
                    className="size-3 sm:size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </button>
                <button
                  className="rounded-full bg-primary/10 p-1 text-primary shadow-sm transition-all duration-200 hover:bg-primary/20"
                  title="Preview"
                  type="button"
                  onClick={() => handlePreview(doc)}
                >
                  <svg
                    className="size-3 sm:size-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                    <path
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </button>
                {!readOnly && !doc.verified && (
                  <button
                    className="rounded-full bg-destructive/90 p-1 text-destructive-foreground shadow-sm transition-all duration-200 hover:bg-destructive"
                    title="Remove"
                    type="button"
                    onClick={() =>
                      onRemoveDocument(doc.id, doc.documentType as string)
                    }
                  >
                    <svg
                      className="size-3 sm:size-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M6 18L18 6M6 6l12 12"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
