'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Spinner, Center, Text, VStack } from '@chakra-ui/react'

import { Button } from '@chakra-ui/react'
import { signOut } from 'next-auth/react'
import TarjetaBase from '@/components/ui/TarjetaBase'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
    <Center minH="100vh">
      <TarjetaBase>
      <VStack >
        <Text fontSize="2xl">¡Bienvenido al dashboard de ELDOC - Centro Veterinario!</Text>
<Text>Email: {session?.user?.email}</Text>
<Text>ID: {session?.user?.id}</Text>
    <Button colorScheme="red" onClick={() => signOut({ callbackUrl: '/' })}>
      Cerrar sesión
    </Button>
      </VStack>
      </TarjetaBase>
    </Center>
  )
}