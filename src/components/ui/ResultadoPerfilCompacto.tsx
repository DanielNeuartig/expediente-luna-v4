'use client'

import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import { Phone } from 'lucide-react'
import Link from 'next/link'

type ResultadoPerfil = {
  id: number
  nombre: string
  tipo: 'perfil'
  telefonoPrincipal?: string
}

export default function ResultadoPerfilCompacto({ perfil }: { perfil: ResultadoPerfil }) {
  return (
    <Link href={`/dashboard/perfiles/${perfil.id}`}>
      <Box
        bg="tema.intenso"
        borderRadius="xl"
        p="3"
        _hover={{ bg: 'tema.suave', cursor: 'pointer' }}
        width="100%"
      >
        <VStack align="start" gap="1">
          <HStack gap="2">
            <Text fontSize="xl" role="img">👤</Text>
            <Text fontWeight="bold" fontSize="md" color="tema.claro">
              {perfil.nombre}
            </Text>
          </HStack>

          {perfil.telefonoPrincipal && (
             <Box bg="tema.suave" borderRadius="full" px="2" py="1">
            <HStack gap="1">
              <Phone size={14} color="white" />
              <Text fontWeight="bold" fontSize="xs" color="tema.claro">
                {perfil.telefonoPrincipal.replace(/(\d{2})(?=\d)/g, '$1 ').trim()}
              </Text>
            </HStack>
            </Box>
          )}
        </VStack>
      </Box>
    </Link>
  )
}