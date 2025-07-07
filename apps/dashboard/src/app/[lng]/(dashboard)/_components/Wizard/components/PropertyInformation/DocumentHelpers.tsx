/*eslint-disable*/

import type { PropertyDocument, StoredTempFile } from "./FormValidation"

// Re-export PropertyDocument type for convenience
export type { PropertyDocument }

// Helper function to get file extension
export const getFileExtension = (filename: string): string => {
  return filename
    .slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2)
    .toLowerCase()
}

// Helper function to check if file is an image
export const isImageFile = (filename: string): boolean => {
  const ext = getFileExtension(filename)
  return ["jpg", "jpeg", "png", "gif", "webp"].includes(ext)
}

// Helper function to check if file is a PDF
export const isPdfFile = (filename: string): boolean => {
  const ext = getFileExtension(filename)
  return ext === "pdf"
}

// Helper function to open file in new window
export const openFileInNewWindow = (doc: PropertyDocument) => {
  const ext = getFileExtension(doc.filename)

  // For images, create an HTML page that displays the image properly
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    const imageWindow = window.open("", "_blank")
    if (imageWindow) {
      imageWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${doc.filename}</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: #f1f1f1;
              }
              img {
                max-width: 100%;
                max-height: 90vh;
                object-fit: contain;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
            </style>
          </head>
          <body>
            <img src="${doc.fileUrl}" alt="${doc.filename}" />
          </body>
        </html>
      `)
      imageWindow.document.close()
    }
  }
  // For PDFs, either use base64 data directly or the file URL
  else if (ext === "pdf") {
    // If it's a base64 PDF, we need to open it differently
    if (doc.fileUrl.startsWith("data:application/pdf")) {
      const pdfWindow = window.open("", "_blank")
      if (pdfWindow) {
        pdfWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${doc.filename}</title>
              <style>
                body, html {
                  margin: 0;
                  padding: 0;
                  height: 100%;
                  overflow: hidden;
                }
                embed {
                  width: 100%;
                  height: 100%;
                }
              </style>
            </head>
            <body>
              <embed src="${doc.fileUrl}" type="application/pdf" width="100%" height="100%">
            </body>
          </html>
        `)
        pdfWindow.document.close()
      }
    } else {
      // For regular PDF URLs
      window.open(doc.fileUrl, "_blank", "noopener,noreferrer")
    }
  }
  // For text files
  else if (["txt", "csv", "md"].includes(ext)) {
    const textWindow = window.open("", "_blank")
    if (textWindow) {
      textWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${doc.filename}</title>
            <style>
              body {
                margin: 0;
                padding: 20px;
                font-family: monospace;
                white-space: pre-wrap;
                background: #f1f1f1;
              }
              pre {
                background: white;
                padding: 20px;
                border-radius: 4px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
            </style>
          </head>
          <body>
            <pre>${doc.fileUrl}</pre>
          </body>
        </html>
      `)
      textWindow.document.close()
    }
  }
  // For other file types, try to open directly
  else {
    window.open(doc.fileUrl, "_blank", "noopener,noreferrer")
  }
}

// Helper function to convert File to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

// Storage keys for localStorage
export const TEMP_FILES_STORAGE_KEY = "property_temp_files"

// Helper function to load temp files from localStorage
export const loadTempFilesFromStorage = (): StoredTempFile[] => {
  try {
    const savedFiles = localStorage.getItem(TEMP_FILES_STORAGE_KEY)
    if (savedFiles) {
      return JSON.parse(savedFiles)
    }
  } catch (error) {
    console.error("Error loading temp files from storage:", error)
  }
  return []
}

// Helper function to save temp files to localStorage
export const saveTempFilesToStorage = (files: StoredTempFile[]) => {
  try {
    localStorage.setItem(TEMP_FILES_STORAGE_KEY, JSON.stringify(files))
  } catch (error) {
    console.error("Error saving temp files to storage:", error)
  }
}

// Helper to clear temp files from storage
export const clearTempFilesStorage = () => {
  localStorage.removeItem(TEMP_FILES_STORAGE_KEY)
}

// Update the formatFileName function
export const formatFileName = (filename: string): string => {
  // Get file extension
  const ext = filename.split(".").pop()?.toLowerCase() || ""
  // Get base name without extension
  const baseName = filename.split(".").slice(0, -1).join(".")
  // Format the base name: lowercase, replace spaces and special chars with underscore
  const formattedBase = baseName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_") // Replace multiple underscores with single

  // Combine all parts: formattedname.ext
  return `${formattedBase}.${ext}`
}

// Add helper function to check for duplicate documents
export const isDuplicateDocument = (
  filename: string,
  documentType: string,
  existingDocs: PropertyDocument[]
) => {
  return existingDocs.some(
    (doc) =>
      doc.filename === filename &&
      doc.documentType === documentType &&
      !doc.isTemp // Only consider permanent documents
  )
}
