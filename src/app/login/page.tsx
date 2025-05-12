'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button, VStack, Text, Center } from '@chakra-ui/react'

export default function LoginPage() {
  const { data: session, status } = useSession()

  const handleLogin = () => {
    signIn('google', { callbackUrl: '/dashboard' })
  }

  const handleLogout = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <Center minH="100vh">
      <VStack>
        <Text fontSize="2xl" fontWeight="bold">
          {status === 'authenticated' ? 'Sesión iniciada' : 'Iniciar sesión'}
        </Text>

        {status === 'authenticated' ? (
          <>
            <Text>Ya estás autenticado como:</Text>
            <Text>{session?.user?.email}</Text>
            <Button colorScheme="red" onClick={handleLogout}>
              Cerrar sesión
            </Button>
          </>
        ) : (
          <Button colorScheme="blue" onClick={handleLogin}>
            Iniciar sesión con Google
          </Button>
        )}
      </VStack>
    </Center>
  )
}