import { createResource } from "../../../ai_chatbot/src/resources"
import * as fs from "fs"
import * as path from "path"

// Function to split text into more manageable chunks
function splitIntoChunks(text: string, maxChunkSize: number = 1000): string[] {
  const sections = text.split("---")
  const chunks: string[] = []

  for (const section of sections) {
    if (!section.trim()) continue

    // Further split large sections by questions
    const questionSections = section.split(/(?=#{2,3} \*\*[^*]+\*\*)/g)

    for (const questionSection of questionSections) {
      if (!questionSection.trim()) continue

      // If the question section is still too large, split into paragraphs
      if (questionSection.length > maxChunkSize) {
        const paragraphs = questionSection.split(/\n\n|\r\n\r\n/g)
        let currentChunk = ""

        for (const paragraph of paragraphs) {
          if (currentChunk.length + paragraph.length > maxChunkSize) {
            if (currentChunk.trim()) {
              chunks.push(currentChunk.trim())
            }
            currentChunk = paragraph
          } else {
            currentChunk += (currentChunk ? "\n\n" : "") + paragraph
          }
        }

        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim())
        }
      } else {
        chunks.push(questionSection.trim())
      }
    }
  }

  return chunks
}

// Read the FAQ content from the file and create resources
export async function seedFAQ() {
  try {
    // Try multiple potential locations for the faq.txt file
    const possiblePaths = [
      // Project root
      path.join(process.cwd(), "faq.md"),
      // Relative to this file
      path.join(__dirname, "../../../..", "faq.md"),
      // Prisma directory
      path.join(__dirname, "..", "faq.md"),
      // Packages directory
      path.join(__dirname, "../../../..", "packages", "faq.md"),
    ]

    let faqContent = ""
    let foundPath = ""

    // Try each path until we find the file
    for (const testPath of possiblePaths) {
      try {
        if (fs.existsSync(testPath)) {
          faqContent = fs.readFileSync(testPath, "utf8")
          foundPath = testPath
          break
        }
      } catch (err) {
        // Continue to the next path
      }
    }

    if (!faqContent) {
      throw new Error(
        `Could not find faq.txt file. Tried paths: ${possiblePaths.join(", ")}`
      )
    }

    console.log(`Found FAQ file at: ${foundPath}`)

    // Split content into manageable chunks to avoid vector size issues
    const chunks = splitIntoChunks(faqContent)

    console.log(`Processing ${chunks.length} FAQ chunks`)

    // Process each chunk
    for (const [index, chunk] of chunks.entries()) {
      try {
        // Create resource for each chunk
        const result = await createResource({
          content: chunk,
        })

        console.log(
          `Processed FAQ chunk ${index + 1}/${chunks.length}: ${result}`
        )
      } catch (error) {
        console.error(
          `Error processing FAQ chunk ${index + 1}/${chunks.length}:`,
          error
        )
      }
    }

    console.log("FAQ seeding completed successfully")
  } catch (error) {
    console.error("Error seeding FAQ data:", error)
    throw error
  }
}
