import type { Metadata } from "next"

import { FileUploadTest } from "./_components/FileUploadTest"

export const metadata: Metadata = {
  title: "File Upload Test",
  description: "Test the file upload functionality",
}

export default function FileUploadPage() {
  return (
    <div className="container py-8">
      <h1 className="mb-8 text-2xl font-bold">File Upload Test</h1>
      <FileUploadTest />
    </div>
  )
}
