'use client'

import { signIn } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button, Center, Heading, VStack, Spinner } from '@chakra-ui/react'
import TarjetaBase from '@/components/ui/TarjetaBase'

export default function LoginPage() {
const { data: session, status } = useSession()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <Center minH="100vh">
        <Spinner size="xl" />
      </Center>
    )
  }

  return (
       <Center minH="100vh"> 
      <VStack>
        <TarjetaBase>
        <Heading>Iniciar sesión</Heading>
        <Button colorScheme="blue" onClick={() => signIn('google')}>
          Continuar con Google
        </Button>
         </TarjetaBase>
      </VStack>
      </Center>    
     
       
  )
}