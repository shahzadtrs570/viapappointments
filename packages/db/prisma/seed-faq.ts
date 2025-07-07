import { PrismaClient } from "@prisma/client"
import { seedFAQ } from "./seeds/faq"

const prisma = new PrismaClient()

async function main() {
  // Only seed FAQ data
  console.log("Starting FAQ seed process...")
  await seedFAQ()
  console.log("FAQ seed process completed")
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
