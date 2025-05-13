// src/app/dashboard/crear-perfil-clinica/page.tsx
'use client'

import FormularioPerfil from '@/components/ui/FormularioPerfil'
import { Heading, Box } from '@chakra-ui/react'

export default function CrearPerfilClinicaPage() {
  return (
    <Box p="6" maxW="lg" mx="auto">
      <Heading mb="4" size="lg">
        Crear nuevo perfil (MODO CLÍNICA)
      </Heading>
      <FormularioPerfil mostrarVerificacionSMS={false} />
    </Box>
  )
}