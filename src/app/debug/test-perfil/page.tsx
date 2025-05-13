// src/app/debug/test-perfil/page.tsx
'use client'

import FormularioPerfil from '@/components/ui/FormularioPerfil'
import { Box, Heading } from '@chakra-ui/react'

export default function TestPerfilPage() {
  return (
    <Box p="6" maxW="lg" mx="auto">
      <Heading mb="4" size="lg">
        Test de creación de perfil
      </Heading>
      <FormularioPerfil mostrarVerificacionSMS={false} />
    </Box>
  )
}