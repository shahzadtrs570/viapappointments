import fs from "fs"
import path from "path"
import https from "https"
import { promisify } from "util"

const mkdir = promisify(fs.mkdir)

const ASSETS_DIR = path.join(__dirname, "../src/assets")

// Font URLs
const FONTS = {
  "Sarabun-Thin.woff2":
    "https://fonts.gstatic.com/s/sarabun/v15/DtVmJx26TKEr37c9YK5silUs6yLUrwB0lw.woff2",
  "Sarabun-ExtraLight.woff2":
    "https://fonts.gstatic.com/s/sarabun/v15/DtVmJx26TKEr37c9YMpsilUs6yLUrwB0lw.woff2",
  "Sarabun-Light.woff2":
    "https://fonts.gstatic.com/s/sarabun/v15/DtVmJx26TKEr37c9YNpvilUs6yLUrwB0lw.woff2",
  "Sarabun-Regular.woff2":
    "https://fonts.gstatic.com/s/sarabun/v15/DtVmJx26TKEr37c9YOZqilUs6yLUrwB0lw.woff2",
  "Sarabun-Medium.woff2":
    "https://fonts.gstatic.com/s/sarabun/v15/DtVmJx26TKEr37c9YMZtilUs6yLUrwB0lw.woff2",
  "Sarabun-SemiBold.woff2":
    "https://fonts.gstatic.com/s/sarabun/v15/DtVmJx26TKEr37c9YNptilUs6yLUrwB0lw.woff2",
  "Sarabun-Bold.woff2":
    "https://fonts.gstatic.com/s/sarabun/v15/DtVmJx26TKEr37c9YOprilUs6yLUrwB0lw.woff2",
  "Sarabun-ExtraBold.woff2":
    "https://fonts.gstatic.com/s/sarabun/v15/DtVmJx26TKEr37c9YOZgilUs6yLUrwB0lw.woff2",
  "ArchivoBlack-Regular.woff2":
    "https://fonts.gstatic.com/s/archivoblack/v17/HTxqL289NzCGg4MzN6KJ7eW6CYKF_i7y.woff2",
  // Additional Sarabun font styles
  "Sarabun-Italic.woff2":
    "https://fonts.gstatic.com/s/sarabun/v15/DtVmJx26TKEr37c9YO5rilUs6yLUrwB0lw.woff2",
  "Sarabun-BoldItalic.woff2":
    "https://fonts.gstatic.com/s/sarabun/v15/DtVmJx26TKEr37c9YOpri1Us6yLUrwB0lw.woff2",
}

async function downloadFont(url: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(ASSETS_DIR, filename)
    const file = fs.createWriteStream(filePath)

    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(
            new Error(
              `Failed to download ${filename}: HTTP ${response.statusCode}`
            )
          )
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
    // Skip download if assets already exist and CI environment is detected
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

    // Create assets directory if it doesn't exist
    if (!fs.existsSync(ASSETS_DIR)) {
      await mkdir(ASSETS_DIR, { recursive: true })
    }

    // Download all fonts
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
