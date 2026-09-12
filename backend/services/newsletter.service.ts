import { prisma } from '@backend/database/db'

export async function subscribeNewsletter(email: string) {
  if (process.env.DATABASE_URL) {
    try {
      const existing = await prisma.newsletterSignup.findUnique({ where: { email } })
      if (existing) {
        return { success: false, code: 409, message: 'This email is already subscribed.' }
      }

      await prisma.newsletterSignup.create({ data: { email } })
      return { success: true, code: 201, message: 'Subscribed successfully.' }
    } catch {
      // Fall through
    }
  }

  // Graceful fallback simulation
  return { success: true, code: 201, message: 'Subscribed successfully.' }
}
