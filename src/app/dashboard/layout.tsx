import { ReactNode } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import { Flex, Box } from '@chakra-ui/react'
import DashboardHeader from '@/components/ui/DashboardHeader'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth()
console.log('Session en layout:', session)
  // Redirige si no hay sesión o si el usuario no está activo
  if (!session || !session.user.activo) {
    redirect('/login')
  }
  const perfil = await prisma.perfil.findUnique({
  where: { usuarioId: session.user.id },
})
if (!perfil) {
  redirect('/mi-perfil')
}

  return (
    <Flex minH="100vh">
      <Sidebar />
      <Box as="main" flex="1" p="6">
        <DashboardHeader />
        {children}
      </Box>
    </Flex>
  )
}