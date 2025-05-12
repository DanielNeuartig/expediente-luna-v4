import type { DefaultSession } from 'next-auth'
import { TipoUsuario } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: number
      tipoUsuario: TipoUsuario
      activo: boolean
      perfil?: {
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
  }
}