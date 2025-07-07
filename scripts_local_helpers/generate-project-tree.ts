import * as fs from "fs"
import * as path from "path"

// Create output directory if it doesn't exist
const outputDir = path.join(process.cwd(), "documentation", "structure")
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// Path to the output file
const outputFile = path.join(outputDir, "project-structure.md")

// Directories and files to exclude (as regex patterns)
const excludePatterns: RegExp[] = [
  /^node_modules$/,
  /^\.git$/,
  /^\.next$/,
  /^\.turbo$/,
  /^\.vercel$/,
  /^build$/,
  /^dist$/,
  /^coverage$/,
  /^\.husky$/,
  /^\.vscode$/,
  /^\.DS_Store$/,
  /^\.env/,
  /^out$/,
]

// Function to check if a path should be excluded
function shouldExclude(itemPath: string): boolean {
  const itemName = path.basename(itemPath)

  // Check if the item name matches any of the exclude patterns
  const shouldExcludeItem = excludePatterns.some((pattern) =>
    pattern.test(itemName)
  )

  if (shouldExcludeItem) {
    console.log(`Excluding: ${itemPath}`)
  }

  return shouldExcludeItem
}

// Simple function to generate tree structure
function generateSimpleTree(rootDir: string, maxDepth: number = 15): string[] {
  console.log("Generating simple project structure tree...")
  console.log(`Root directory: ${rootDir}`)

  const result: string[] = []

  // Add the root directory name
  const rootName = path.basename(rootDir)
  result.push(rootName + "/")

  // Function to recursively traverse directories
  function traverse(dir: string, depth: number = 0, prefix: string = ""): void {
    if (depth > maxDepth) {
      console.log(`Max depth reached at: ${dir}`)
      return
    }

    console.log(`Traversing directory: ${dir} (depth: ${depth})`)

    try {
      // Get all items in the directory
      const allItems = fs.readdirSync(dir)
      console.log(`Found ${allItems.length} items in ${dir}`)

      const items = allItems
        .filter((item) => {
          const fullPath = path.join(dir, item)
          const exclude = shouldExclude(fullPath)
          if (exclude) {
            console.log(`  Excluding: ${item}`)
          }
          return !exclude
        })
        .sort((a, b) => {
          try {
            const aPath = path.join(dir, a)
            const bPath = path.join(dir, b)

            if (!fs.existsSync(aPath) || !fs.existsSync(bPath)) {
              return a.localeCompare(b)
            }

            const aIsDir = fs.statSync(aPath).isDirectory()
            const bIsDir = fs.statSync(bPath).isDirectory()

            if (aIsDir && !bIsDir) return -1
            if (!aIsDir && bIsDir) return 1
            return a.localeCompare(b)
          } catch (error) {
            console.error(
              `Error sorting items in ${dir}:`,
              error instanceof Error ? error.message : String(error)
            )
            return 0
          }
        })

      console.log(`After filtering, ${items.length} items remain in ${dir}`)

      // Process each item
      items.forEach((item, index) => {
        const itemPath = path.join(dir, item)
        const isLast = index === items.length - 1
        const itemPrefix = prefix + (isLast ? "└── " : "├── ")
        const nextPrefix = prefix + (isLast ? "    " : "│   ")

        try {
          if (!fs.existsSync(itemPath)) {
            result.push(`${itemPrefix}${item} (not accessible)`)
            return
          }

          const isDirectory = fs.statSync(itemPath).isDirectory()

          // Add the item to the result
          result.push(`${itemPrefix}${item}${isDirectory ? "/" : ""}`)

          // If it's a directory, traverse it
          if (isDirectory) {
            traverse(itemPath, depth + 1, nextPrefix)
          }
        } catch (error) {
          result.push(
            `${itemPrefix}${item} (error: ${error instanceof Error ? error.message : String(error)})`
          )
        }
      })
    } catch (error) {
      console.error(
        `Error reading directory: ${dir}`,
        error instanceof Error ? error.message : String(error)
      )
    }
  }

  // Start traversing from the root
  traverse(rootDir, 1, "")

  return result
}

try {
  console.log("Generating project structure tree...")

  // Add a title and markdown formatting
  const title = "# Project Structure\n\n```\n"
  const footer = "\n```\n\nGenerated on: " + new Date().toISOString()

  // Generate the tree structure
  const tree = generateSimpleTree(process.cwd())

  console.log(`Generated tree with ${tree.length} lines`)

  if (tree.length <= 1) {
    throw new Error(
      "Tree generation returned empty result or only root directory"
    )
  }

  // Write to file
  fs.writeFileSync(outputFile, title + tree.join("\n") + footer, "utf8")

  console.log(`\nSuccess! Project structure has been saved to: ${outputFile}`)
  console.log(
    "The tree structure uses Unix-style formatting with directory indicators."
  )
} catch (error) {
  console.error(
    "\nError generating project structure:",
    error instanceof Error ? error.message : String(error)
  )
  process.exit(1)
}
