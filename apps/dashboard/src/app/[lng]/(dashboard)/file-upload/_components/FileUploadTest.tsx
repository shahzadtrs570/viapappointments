"use client"

import { useState } from "react"

import { Button } from "@package/ui/button"
import { Input } from "@package/ui/input"
import { toast } from "@package/ui/toast"

import { api } from "@/lib/trpc/react"

export function FileUploadTest() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState<string>("")

  const uploadMutation = api.fileUpload.upload.useMutation({
    onSuccess: (data) => {
      setUploadedUrl(data.url)
      toast({
        title: "Success",
        description: "File uploaded successfully!",
        variant: "default",
      })
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    try {
      const base64 = await convertFileToBase64(file)
      await uploadMutation.mutateAsync({
        fileName: file.name,
        base64,
        metadata: {
          contentType: file.type,
          title: file.name,
        },
      })
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input type="file" onChange={handleFileChange} />
        <Button
          disabled={!file || isUploading}
          isLoading={isUploading}
          onClick={handleUpload}
        >
          {isUploading ? "Uploading" : "Upload"}
        </Button>
      </div>

      {uploadedUrl && (
        <div className="mt-4">
          <p className="font-semibold">Uploaded File URL:</p>
          <a
            className="text-blue-500 hover:underline"
            href={uploadedUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            {uploadedUrl}
          </a>
        </div>
      )}
    </div>
  )
}

function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Remove the data URL prefix (e.g., "data:image/png;base64,")
        const base64 = reader.result.split(",")[1]
        resolve(base64)
      }
    }
    reader.onerror = (error) => reject(error)
  })
}
