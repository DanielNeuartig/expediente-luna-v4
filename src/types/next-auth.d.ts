import type { DefaultSession } from 'next-auth'
import { TipoUsuario } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      tipoUsuario: TipoUsuario
      activo: boolean
      perfilid?: number | null
      perfil?: {
        id: number
        nombre: string
        telefonoPrincipal: string
      }
    } & DefaultSession['user']
  }

  interface User {
    id: number
    tipoUsuario: TipoUsuario
    activo: boolean
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number
    tipoUsuario: TipoUsuario
    activo: boolean
    email: string
    perfilid?: number | null // ✅ necesario para que pase a session
  }
}