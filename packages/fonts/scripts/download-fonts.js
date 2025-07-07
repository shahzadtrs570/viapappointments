import fs from "fs"
import path from "path"
import https from "https"
import { promisify } from "util"
import { fileURLToPath } from "url"

const mkdir = promisify(fs.mkdir)

// Use import.meta.url to get the current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const ASSETS_DIR = path.join(__dirname, "../src/assets")

// Font URLs
const FONTS = {
  "Sarabun-Thin.woff2":
    "https://fonts.gstatic.com/s/sarabun/v15/DtVmJx26TKEr37c9YK5silUs6yLUrwB0lw.woff2",
  "Sarabun-ExtraLight.woff2":
    "https://fonts.gstatic.com/s/sarabun/v16/DtVmJx26TKEr37c9YHZsilUs6yLUrwB0lw.woff2",
  "Sarabun-Light.woff2":
    "https://fonts.gstatic.com/s/sarabun/v16/DtVmJx26TKEr37c9YGZvilUs6yLUrwB0lw.woff2",
  "Sarabun-Regular.woff2":
    "https://fonts.gstatic.com/s/sarabun/v15/DtVmJx26TKEr37c9YOZqilUs6yLUrwB0lw.woff2",
  "Sarabun-Medium.woff2":
    "https://fonts.gstatic.com/s/sarabun/v15/DtVmJx26TKEr37c9YMptilUs6yLUrwB0lw.woff2",
  "Sarabun-SemiBold.woff2":
    "https://fonts.gstatic.com/s/sarabun/v16/DtVmJx26TKEr37c9YLZtilUs6yLUrwB0lw.woff2",
  "Sarabun-Bold.woff2":
    "https://fonts.gstatic.com/s/sarabun/v16/DtVmJx26TKEr37c9YJZrilUs6yLUrwB0lw.woff2",
  "Sarabun-ExtraBold.woff2":
    "https://fonts.gstatic.com/s/sarabun/v16/DtVmJx26TKEr37c9YIZgilUs6yLUrwB0lw.woff2",
  "Sarabun-Italic.woff2":
    "https://fonts.gstatic.com/s/sarabun/v16/DtVkJx26TKEr37c9aBe9C2UYzBUoWOAe.woff2",
  "Sarabun-BoldItalic.woff2":
    "https://fonts.gstatic.com/s/sarabun/v16/DtVkJx26TKEr37c9aBe9C2UYzGUsWOAe.woff2",
  "ArchivoBlack-Regular.woff2":
    "https://fonts.gstatic.com/s/archivoblack/v17/HTxqL289NzCGg4MzN6KJ7eW6CYKF_i7y.woff2",
  // Additional Sarabun font styles
  "Sarabun-Italic.woff2":
    "https://fonts.gstatic.com/s/sarabun/v15/DtVmJx26TKEr37c9YO5rilUs6yLUrwB0lw.woff2",
  "Sarabun-BoldItalic.woff2":
    "https://fonts.gstatic.com/s/sarabun/v15/DtVmJx26TKEr37c9YOpri1Us6yLUrwB0lw.woff2",
  // SF Pro Display fonts
  // "SFProDisplay-Thin.woff2":
  //   "https://fonts.googleapis.com/css2?family=Inter:wght@100&display=swap",
  // "SFProDisplay-Light.woff2":
  //   "https://fonts.googleapis.com/css2?family=Inter:wght@300&display=swap",
  // "SFProDisplay-Regular.woff2":
  //   "https://fonts.googleapis.com/css2?family=Inter:wght@400&display=swap",
  // "SFProDisplay-Medium.woff2":
  //   "https://fonts.googleapis.com/css2?family=Inter:wght@500&display=swap",
  // "SFProDisplay-Semibold.woff2":
  //   "https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap",
  // "SFProDisplay-Bold.woff2":
  //   "https://fonts.googleapis.com/css2?family=Inter:wght@700&display=swap",
  // "SFProDisplay-Heavy.woff2":
  //   "https://fonts.googleapis.com/css2?family=Inter:wght@800&display=swap",
}

async function downloadFont(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(ASSETS_DIR, filename)
    const file = fs.createWriteStream(filePath)

    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          console.error(
            `Failed to download ${filename}: HTTP ${response.statusCode}`
          )
          file.close()
          fs.unlink(filePath, () => {})
          resolve() // Resolve to skip this file
          return
        }

        response.pipe(file)

        file.on("finish", () => {
          file.close()
          console.log(`Downloaded ${filename}`)
          resolve()
        })

        file.on("error", (err) => {
          fs.unlink(filePath, () => {})
          reject(err)
        })
      })
      .on("error", (err) => {
        fs.unlink(filePath, () => {})
        reject(err)
      })
  })
}

async function main() {
  try {
    if (
      process.env.CI &&
      fs.existsSync(ASSETS_DIR) &&
      fs.readdirSync(ASSETS_DIR).some((file) => file.endsWith(".woff2"))
    ) {
      console.log(
        "CI environment detected and font files exist. Skipping download."
      )
      return
    }

    if (!fs.existsSync(ASSETS_DIR)) {
      await mkdir(ASSETS_DIR, { recursive: true })
    }

    const downloads = Object.entries(FONTS).map(([filename, url]) =>
      downloadFont(url, filename)
    )

    await Promise.all(downloads)
    console.log("All fonts downloaded successfully!")
  } catch (error) {
    console.error("Error downloading fonts:", error)
    process.exit(1)
  }
}

main()
