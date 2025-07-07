import fs from "fs/promises"
import path from "path"

export async function getMarkdownContent(filePath: string) {
  const fullPath = path.join(process.cwd(), "src/content", filePath)
  try {
    const content = await fs.readFile(fullPath, "utf-8")
    return content
  } catch (error) {
    console.error(`Error reading markdown file: ${filePath}`, error)
    return null
  }
}

export async function verifyMarkdownFiles() {
  const files = [
    "docs/getting-started.md",
    "docs/auth.md",
    "docs/billing.md",
    "docs/api.md",
    "docs/guides/user-management.md",
    "docs/guides/email.md",
    "docs/guides/analytics.md",
    "docs/examples/basic.md",
    "docs/examples/advanced.md",
    "docs/contributing.md",
    "docs/security.md",
    "docs/performance.md",
  ]

  for (const file of files) {
    const content = await getMarkdownContent(file)
    if (!content) {
      console.warn(`Missing markdown file: ${file}`)
    }
  }
}
