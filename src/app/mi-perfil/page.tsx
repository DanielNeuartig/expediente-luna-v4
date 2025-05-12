// app/mi-perfil/page.tsx
'use client'

import { Box, Container, Heading } from '@chakra-ui/react'
import FormularioPerfil from '@/components/ui/FormularioPerfil'

export default function MiPerfilPage() {
  return (
    <Container maxW="container.md" py="10">
      <Heading as="h1" size="lg" mb="6">
        Mi Perfil
      </Heading>

      <Box  shadow="md" rounded="xl" p="6" borderWidth="1px">
        <FormularioPerfil />
      </Box>
    </Container>
  )
}