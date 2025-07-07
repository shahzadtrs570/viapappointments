import { PrismaClient } from "@prisma/client"
import { users } from "./seeds/users"

const prisma = new PrismaClient()

async function main() {
  await prisma.$transaction([
    prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    }),
  ])
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
