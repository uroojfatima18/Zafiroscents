import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      city: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  console.log(`\n📊 Total Users in Database: ${users.length}\n`)
  console.table(users)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
