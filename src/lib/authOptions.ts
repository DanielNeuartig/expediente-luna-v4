// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { type AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import { TipoUsuario } from '@prisma/client'

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt', // ✅ JWT como estrategia principal
  },
  callbacks: {
    async jwt({ token, user, account }) {
      const email = user?.email || token?.email

      console.log('🔑 JWT CALLBACK')
      console.log('→ token recibido:', token)
      console.log('→ user recibido:', user)

      if (email && (!token.id || account)) {
        const dbUser = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            tipoUsuario: true,
            activo: true,
          },
        })

        console.log('📥 Usuario encontrado en DB:', dbUser)

        if (dbUser) {
          token.id = dbUser.id
          token.tipoUsuario = dbUser.tipoUsuario
          token.activo = dbUser.activo
          token.email = email
        }
      }

      return token
    },

    async session({ session, token }) {
      console.log('🧪 SESSION CALLBACK')
      console.log('→ token recibido:', token)

      if (token?.id) {
        session.user.id = token.id as number
        session.user.tipoUsuario = token.tipoUsuario as TipoUsuario
        session.user.activo = token.activo as boolean

           const perfil = await prisma.perfil.findUnique({
      where: { usuarioId: token.id },
      select: {
         id: true, // ✅ ahora se incluye el ID real del perfil
        nombre: true,
        telefonoPrincipal: true,
      },
    })
session.user.perfil = perfil ?? undefined
session.user.perfilid = perfil?.id ?? null
    console.log('📋 Perfil recuperado de la base de datos:', session.user.perfil)




      } else {
        console.warn('⚠️ Token incompleto, sesión sin atributos extendidos')
      }

      console.log('🎯 Sesión construida:', session)
      return session
    },
  },
}



// API handlers
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }