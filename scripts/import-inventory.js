#!/usr/bin/env node

/**
 * Inventory Import Script
 *
 * This script calls the bulk import API to insert all inventory data
 * from JSON files into the database.
 *
 * Usage:
 *   node scripts/import-inventory.js
 *
 * Or with npm:
 *   npm run import-inventory
 */

const API_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001"
const IMPORT_ENDPOINT = `${API_URL}/api/inventory/bulk-import`

async function importInventory() {
  console.log("🚀 Starting inventory import...")
  console.log(`📡 API URL: ${IMPORT_ENDPOINT}`)

  try {
    const response = await fetch(IMPORT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })

    const result = await response.json()

    if (response.ok) {
      console.log("\n✅ Import completed successfully!")
      console.log("📊 Final Stats:")
      console.log(`   • Files processed: ${result.stats.totalFiles}`)
      console.log(
        `   • Total records: ${result.stats.totalRecords.toLocaleString()}`
      )
      console.log(
        `   • Successful inserts: ${result.stats.successfulInserts.toLocaleString()}`
      )
      console.log(
        `   • Failed inserts: ${result.stats.failedInserts.toLocaleString()}`
      )
      console.log(
        `   • Processing time: ${(result.stats.processingTime / 1000).toFixed(2)}s`
      )

      if (Object.keys(result.stats.dealerships).length > 0) {
        console.log("\n🏢 Dealerships imported:")
        Object.entries(result.stats.dealerships).forEach(([name, count]) => {
          console.log(`   • ${name}: ${count.toLocaleString()} vehicles`)
        })
      }
    } else {
      console.error("❌ Import failed:", result.message)
      if (result.error) {
        console.error("💥 Error details:", result.error)
      }
      process.exit(1)
    }
  } catch (error) {
    console.error("💥 Network error:", error.message)
    console.error("🔧 Make sure your Next.js server is running on", API_URL)
    process.exit(1)
  }
}

// Run the import
importInventory()
