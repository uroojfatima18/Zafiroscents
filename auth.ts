import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { prisma } from '@backend/database/db'
import bcrypt from 'bcryptjs'

const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.AUTH_GOOGLE_ID
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.AUTH_GOOGLE_SECRET

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: any[] = []

if (googleClientId && googleClientSecret) {
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    })
  )
}

providers.push(
  Credentials({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        const email = String(credentials.email).toLowerCase().trim()
        const password = String(credentials.password)

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user || !user.password) {
            return null
          }

          const isValid = await bcrypt.compare(password, user.password)
          if (!isValid) {
            return null
          }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      }
    } catch (error) {
      console.error('Auth error:', error)
      return null
    }
  },
}))

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        if (!user.email) return false
        const email = user.email.toLowerCase().trim()
        try {
          let dbUser = await prisma.user.findUnique({
            where: { email },
          })
          if (!dbUser) {
            dbUser = await prisma.user.create({
              data: {
                name: user.name || 'Valued Client',
                email,
                role: 'customer',
              },
            })
          }
          user.id = dbUser.id
          user.role = dbUser.role
          return true
        } catch (error) {
          console.error('Google sign-in user sync error:', error)
          return false
        }
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.id as string) || token.sub || ''
        session.user.role = token.role as string | undefined
      }
      return session
    },
  },
  session: { strategy: 'jwt' },
})
