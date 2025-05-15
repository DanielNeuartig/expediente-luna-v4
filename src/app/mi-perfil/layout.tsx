// app/mi-perfil/layout.tsx
import { ReactNode } from 'react'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function MiPerfilLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  // ❌ Si no hay sesión, redirige al login
  if (!session || !session.user.activo) {
    redirect('/')
  }

  // 🔍 Verificamos si ya tiene un perfil
  const perfil = await prisma.perfil.findUnique({
    where: { usuarioId: session.user.id },
  })

  // ❌ Si ya tiene perfil → redirige al dashboard
  if (perfil) {
    redirect('/dashboard')
  }

  return <>{children}</>
}